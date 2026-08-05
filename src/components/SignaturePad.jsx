import React, { useRef, useState, useEffect } from 'react';

export const SignaturePad = ({ onSaveSignature, initialSignature }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#D4AF37'; // Gold ink stroke
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      onSaveSignature(dataUrl);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    onSaveSignature(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-300">Firma Digital del Técnico / Supervisor</label>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-amber-400 hover:underline text-[11px] font-semibold"
        >
          🧹 Limpiar Firma
        </button>
      </div>

      <div className="relative border border-amber-500/30 rounded-lg overflow-hidden bg-[#0B192C]">
        <canvas
          ref={canvasRef}
          width={380}
          height={100}
          className="w-full h-24 cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] text-slate-500 uppercase tracking-widest font-mono">
          Plataforma PARK — Firma Digital
        </div>
      </div>
    </div>
  );
};
