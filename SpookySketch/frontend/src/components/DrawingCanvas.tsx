'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brush, Eraser, Circle, Square, Minus, Undo, Redo, Save,
  Download, Trash2, Palette, Layers, ZoomIn, ZoomOut, Ghost, Menu, X, Settings
} from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { localDB } from '@/utils/localStorageDB';
import { clientAuth } from '@/utils/clientAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface DrawingCanvasProps {
  user: any;
}

type Tool = 'brush' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'ghost' | 'pumpkin' | 'fill' | 'eyedropper' | 'spray';

export default function DrawingCanvas({ user }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#FF6B00');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [layers, setLayers] = useState([{ id: 1, name: 'Layer 1', visible: true }]);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#0C0C0F');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [pressure, setPressure] = useState(0.5);
  const [pointerType, setPointerType] = useState<'mouse' | 'pen' | 'touch'>('mouse');
  const [usePressure, setUsePressure] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Halloween colors palette
  const halloweenColors = [
    '#FF6B00', '#B660FF', '#00FF00', '#FF0000', '#FFFF00',
    '#FFFFFF', '#000000', '#FF1493', '#00CED1', '#FFA500',
    '#8B4513', '#FF4500', '#9370DB', '#FFD700', '#DC143C'
  ];

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 50) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowToolbar(false);
        setShowSettings(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set responsive canvas size
    const updateCanvasSize = () => {
      const isMobileView = window.innerWidth < 768;
      let width, height;
      
      if (isMobileView) {
        // Mobile: full viewport width minus minimal padding
        width = window.innerWidth - 20;
        height = window.innerHeight - 120; // Account for header + controls
      } else {
        // Desktop: account for sidebars
        const sidebarWidth = 80 + 256; // toolbar + settings panel
        width = Math.min(canvasSize.width, window.innerWidth - sidebarWidth - 40);
        height = Math.min(canvasSize.height, window.innerHeight - 100);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Set initial background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    updateCanvasSize();
    saveToHistory(ctx);
    
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect pointer type (mouse, pen/stylus, touch)
    setPointerType(e.pointerType as 'mouse' | 'pen' | 'touch');
    
    // Get pressure (stylus pressure or default)
    const currentPressure = e.pressure || 0.5;
    setPressure(currentPressure);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setStartPos({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Ghost trail effect
    if (tool === 'ghost') {
      createGhostTrail(e.clientX, e.clientY);
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Get pressure from stylus (0.0 to 1.0)
    const currentPressure = e.pressure || 0.5;
    setPressure(currentPressure);
    
    // Calculate pressure-sensitive size
    const pressureSize = usePressure && e.pointerType === 'pen' 
      ? brushSize * (0.3 + currentPressure * 0.7) // 30% to 100% of brush size based on pressure
      : brushSize;

    ctx.globalAlpha = opacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (tool) {
      case 'brush':
        ctx.strokeStyle = color;
        ctx.lineWidth = pressureSize;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;

      case 'eraser':
        ctx.strokeStyle = backgroundColor || '#0C0C0F';
        ctx.lineWidth = pressureSize * 2;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        break;

      case 'ghost':
        ctx.strokeStyle = color;
        ctx.lineWidth = pressureSize;
        ctx.shadowBlur = 20 * currentPressure;
        ctx.shadowColor = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        createGhostTrail(e.clientX, e.clientY);
        break;

      case 'pumpkin':
        const pumpkinSize = Math.floor(brushSize * (0.5 + currentPressure * 0.5));
        ctx.font = `${pumpkinSize}px Arial`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FF6B00';
        ctx.fillText('🎃', x, y);
        break;
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.shadowBlur = 0;
        saveToHistory(ctx);
      }
    }
    setIsDrawing(false);
  };

  const createGhostTrail = (x: number, y: number) => {
    const trail = document.createElement('div');
    trail.className = 'ghost-cursor';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 800);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[historyStep - 1]) {
        ctx.putImageData(history[historyStep - 1], 0, 0);
        setHistoryStep(historyStep - 1);
      }
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[historyStep + 1]) {
        ctx.putImageData(history[historyStep + 1], 0, 0);
        setHistoryStep(historyStep + 1);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0C0C0F';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory(ctx);
    toast.success('Canvas cleared');
  };

  const saveDrawing = async () => {
    if (!drawingTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png');

    try {
      // Get current user ID for user-specific storage
      const currentUserId = clientAuth.getCurrentUserId();
      
      // Save to localStorage - NO TOKENS REQUIRED! 🎉
      localDB.saveDrawing({
        userId: currentUserId || undefined,
        title: drawingTitle,
        canvasData: dataURL,
        thumbnail: dataURL,
        width: canvas.width,
        height: canvas.height,
        tags: ['spooky', 'halloween'],
        isFavorite: false,
        isPublic: false,
      });

      toast.success('Drawing saved locally! 🎃 No tokens needed!');
      setShowSaveModal(false);
      setDrawingTitle('');
      
      // Clear draft after successful save
      localDB.clearDraft();
    } catch (error: any) {
      toast.error('Failed to save drawing');
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `spooky-sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('Drawing downloaded! 👻');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row relative">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-16 left-4 z-50 flex gap-2">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="w-12 h-12 rounded-full bg-orange-500 shadow-lg flex items-center justify-center text-white"
          >
            {showToolbar ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-12 h-12 rounded-full bg-purple-500 shadow-lg flex items-center justify-center text-white"
          >
            <Settings size={20} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <AnimatePresence>
        {(showToolbar || !isMobile) && (
          <motion.div
            initial={isMobile ? { x: -100, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${
              isMobile
                ? 'fixed top-20 left-4 z-40 bg-spooky-card rounded-lg shadow-2xl border border-orange-500/30 p-2'
                : 'w-20 border-r border-orange-500/20'
            } bg-spooky-card flex ${isMobile ? 'flex-row flex-wrap max-w-[280px]' : 'flex-col'} items-center py-4 gap-3`}
          >
        <ToolButton icon={<Brush />} active={tool === 'brush'} onClick={() => setTool('brush')} title="Brush" />
        <ToolButton icon={<Eraser />} active={tool === 'eraser'} onClick={() => setTool('eraser')} title="Eraser" />
        <ToolButton icon={<Ghost />} active={tool === 'ghost'} onClick={() => setTool('ghost')} title="Ghost Brush" />
        <ToolButton icon={<span className="text-2xl">🎃</span>} active={tool === 'pumpkin'} onClick={() => setTool('pumpkin')} title="Pumpkin Stamp" />
        
        <div className="w-full h-px bg-orange-500/20 my-2" />
        
        <ToolButton icon={<Undo />} onClick={undo} title="Undo" disabled={historyStep <= 0} />
        <ToolButton icon={<Redo />} onClick={redo} title="Redo" disabled={historyStep >= history.length - 1} />
        <ToolButton icon={<Trash2 />} onClick={clearCanvas} title="Clear Canvas" />
        
        <div className="w-full h-px bg-orange-500/20 my-2" />
        
        <ToolButton icon={<Save />} onClick={() => setShowSaveModal(true)} title="Save Drawing" />
        <ToolButton icon={<Download />} onClick={downloadDrawing} title="Download" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div className={`flex-1 overflow-auto flex items-center justify-center ${
        isMobile ? 'p-2' : 'p-4'
      }`}>
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          className={`border-2 border-orange-500/30 rounded-lg shadow-2xl glow-orange touch-none ${
            isMobile ? 'max-w-full' : ''
          }`}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            touchAction: 'none',
            cursor: tool === 'brush' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default',
          }}
        />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {(showSettings || !isMobile) && (
          <motion.div
            initial={isMobile ? { y: '100%' } : false}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${
              isMobile
                ? 'fixed bottom-0 left-0 right-0 z-40 max-h-[70vh] rounded-t-2xl'
                : 'w-64 border-l'
            } bg-spooky-card border-orange-500/20 p-4 space-y-6 overflow-y-auto`}
          >
            {isMobile && (
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-spooky-card pb-2 border-b border-orange-500/20">
                <h2 className="text-lg font-bold text-orange-500">⚙️ Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
        <div>
          <h3 className="text-lg font-bold mb-3 text-orange-500">🎨 Color</h3>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {halloweenColors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-lg border-2 ${
                  color === c ? 'border-orange-500 scale-110' : 'border-gray-700'
                } transition-all`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3 text-orange-500">🖌️ Brush Size</h3>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-400 mt-1">{brushSize}px</div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3 text-orange-500">👻 Opacity</h3>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center text-sm text-gray-400 mt-1">{Math.round(opacity * 100)}%</div>
        </div>

        {/* Stylus Pressure */}
        {pointerType === 'pen' && (
          <div>
            <h3 className="text-lg font-bold mb-3 text-orange-500">✏️ Stylus</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-300">Pressure Sensitivity</span>
                <input
                  type="checkbox"
                  checked={usePressure}
                  onChange={(e) => setUsePressure(e.target.checked)}
                  className="w-5 h-5 rounded accent-orange-500"
                />
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Pressure:</span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${pressure * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{Math.round(pressure * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-bold mb-3 text-orange-500">🔍 Zoom</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="flex-1 px-3 py-2 bg-spooky-bg rounded-lg hover:bg-orange-500/10 transition-all"
            >
              <ZoomOut size={20} className="mx-auto" />
            </button>
            <span className="px-3 py-2 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="flex-1 px-3 py-2 bg-spooky-bg rounded-lg hover:bg-orange-500/10 transition-all"
            >
              <ZoomIn size={20} className="mx-auto" />
            </button>
          </div>
        </div>

        {user.tier === 'free' && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-gray-300 mb-2">
              🎃 Unlock more features with Pro or VIP!
            </p>
            <button className="w-full spooky-btn text-sm py-2">
              Upgrade Now
            </button>
          </div>
        )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="spooky-card max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-orange-500">💾 Save Drawing</h2>
            <input
              type="text"
              value={drawingTitle}
              onChange={(e) => setDrawingTitle(e.target.value)}
              placeholder="Enter drawing title..."
              className="spooky-input mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={saveDrawing} className="flex-1 spooky-btn">
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ToolButton({
  icon,
  active,
  onClick,
  title,
  disabled,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all text-sm md:text-base ${
        active
          ? 'bg-orange-500 text-white'
          : 'bg-spooky-bg text-gray-400 hover:bg-orange-500/20 hover:text-orange-500'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
      {icon}
    </button>
  );
}
