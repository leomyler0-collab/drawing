// Canvas utility functions

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string = 'drawing.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const clearCanvas = (canvas: HTMLCanvasElement, bgColor: string = '#0C0C0F') => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const resizeCanvas = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(tempCanvas, 0, 0);
};

export const getCanvasBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });
};

export const loadImageToCanvas = (canvas: HTMLCanvasElement, imageSrc: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

export const createGhostTrail = (x: number, y: number, color: string = '#FF6B00') => {
  const trail = document.createElement('div');
  trail.style.position = 'fixed';
  trail.style.left = `${x}px`;
  trail.style.top = `${y}px`;
  trail.style.width = '20px';
  trail.style.height = '20px';
  trail.style.borderRadius = '50%';
  trail.style.background = `radial-gradient(circle, ${color}88, transparent)`;
  trail.style.pointerEvents = 'none';
  trail.style.zIndex = '9999';
  trail.style.animation = 'ghost-trail 0.8s ease-out forwards';
  
  document.body.appendChild(trail);
  
  setTimeout(() => trail.remove(), 800);
};

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  shape: 'line' | 'circle' | 'rectangle',
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  lineWidth: number
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  
  switch (shape) {
    case 'line':
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      break;
      
    case 'circle':
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
      
    case 'rectangle':
      ctx.strokeRect(startX, startY, endX - startX, endY - startY);
      break;
  }
};

export const applyFilter = (
  canvas: HTMLCanvasElement,
  filter: 'grayscale' | 'sepia' | 'invert' | 'blur'
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  switch (filter) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      break;
      
    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;
      
    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      break;
  }
  
  ctx.putImageData(imageData, 0, 0);
};
