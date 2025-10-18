'use client';

import { useState } from 'react';
import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
}

interface LayerPanelProps {
  layers: Layer[];
  currentLayer: number;
  onLayerSelect: (id: number) => void;
  onLayerToggle: (id: number) => void;
  onLayerDelete: (id: number) => void;
  onLayerAdd: () => void;
  onLayerRename: (id: number, name: string) => void;
}

export default function LayerPanel({
  layers,
  currentLayer,
  onLayerSelect,
  onLayerToggle,
  onLayerDelete,
  onLayerAdd,
  onLayerRename,
}: LayerPanelProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const handleRename = (id: number) => {
    if (editName.trim()) {
      onLayerRename(id, editName);
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="w-64 bg-spooky-card border-l border-orange-500/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-500">Layers</h3>
        <button
          onClick={onLayerAdd}
          className="p-2 rounded-lg bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 transition-all"
          title="Add Layer"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {layers.map((layer) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`
                p-3 rounded-lg cursor-pointer transition-all
                ${currentLayer === layer.id
                  ? 'bg-orange-500/20 border-2 border-orange-500'
                  : 'bg-spooky-bg border-2 border-transparent hover:border-orange-500/30'
                }
              `}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex items-center justify-between">
                {editingId === layer.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRename(layer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(layer.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="flex-1 bg-spooky-bg px-2 py-1 rounded text-sm"
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 font-medium text-sm"
                    onDoubleClick={() => {
                      setEditingId(layer.id);
                      setEditName(layer.name);
                    }}
                  >
                    {layer.name}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLayerToggle(layer.id);
                    }}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  
                  {layers.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLayerDelete(layer.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-3 bg-spooky-bg rounded-lg">
        <p className="text-xs text-gray-400">
          <strong>Pro tip:</strong> Double-click layer name to rename
        </p>
      </div>
    </div>
  );
}
