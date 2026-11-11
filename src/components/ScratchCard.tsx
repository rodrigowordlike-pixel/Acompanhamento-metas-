import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Trophy, Quote } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { fireBurstConfetti } from '../utils/confetti';

interface ScratchCardProps {
  sellerName: string;
  prizeAmount: number;
}

const VICTORY_PHRASES = [
  'Parabéns! Você provou para você mesmo que é capaz de superar qualquer limite!',
  'Sensacional! Sua dedicação diária e garra te trouxeram direto até aqui!',
  'Incrível! A vitória e o bônus pertencem àqueles que não desistem no caminho!',
  'Parabéns! O resultado é o fruto da sua disciplina. Você é um verdadeiro campeão!',
  'Foguete não tem ré! Sua constância e foco te levaram direto ao topo!',
  'Impressionante! Quem trabalha com foco e energia colhe a recompensa em dinheiro!',
];

export const ScratchCard: React.FC<ScratchCardProps> = ({ sellerName, prizeAmount }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);

  // Pick a randomized inspirational victory phrase
  const [randomPhrase] = useState(() => {
    return VICTORY_PHRASES[Math.floor(Math.random() * VICTORY_PHRASES.length)];
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw Gold Metallic Foil Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f59e0b');
    gradient.addColorStop(0.3, '#fbbf24');
    gradient.addColorStop(0.6, '#d97706');
    gradient.addColorStop(1, '#f59e0b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add metallic texture dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 180; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add foil instruction text
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪙 RASPE AQUI SEU BÔNUS SURPRESA! 🪙', width / 2, height / 2 - 10);

    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('(Arraste o dedo ou mouse para revelar a mensagem)', width / 2, height / 2 + 14);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage(canvas, ctx);
  };

  const checkScratchPercentage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (isRevealed) return;
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          transparentPixels++;
        }
      }

      const totalPixels = canvas.width * canvas.height;
      const percent = (transparentPixels / totalPixels) * 100;

      if (percent >= 28) {
        setIsRevealed(true);
        soundManager.playInfoprodutoSaleSound();
        fireBurstConfetti();
      }
    } catch (e) {
      console.warn('Scratch percentage error', e);
    }
  };

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsScratching(true);
    const pos = getCanvasPos(e);
    scratch(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isScratching) return;
    const pos = getCanvasPos(e);
    scratch(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto min-h-32 sm:min-h-36 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400 select-none">
      {/* Revealed Motivational Message & Bonus Beneath Foil */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 flex flex-col items-center justify-center text-slate-950 p-4 sm:p-5 text-center space-y-1">
        <span className="text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 text-slate-950">
          <Trophy className="w-4 h-4 fill-slate-950" />
          <span>PARABÉNS, {sellerName.toUpperCase()}!</span>
        </span>

        <p className="text-sm sm:text-base font-outfit font-extrabold text-slate-950 italic px-2">
          "{randomPhrase}"
        </p>

        <div className="pt-1">
          <span className="inline-block px-3 py-1 rounded-xl bg-slate-950 text-emerald-400 font-outfit font-black text-sm sm:text-base shadow-md font-mono-num">
            💰 BÔNUS R$ {prizeAmount},00 GARANTIDO!
          </span>
        </div>
      </div>

      {/* HTML5 Scratch Overlay Canvas */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          width={450}
          height={140}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
        />
      )}
    </div>
  );
};
