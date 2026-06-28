import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function GameCard({ card, isDragging, isFlipped, isCorrect, isShaking }) {
  const [imgError, setImgError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (isShaking) setShakeKey(k => k + 1);
  }, [isShaking]);

  return (
    <div
      key={shakeKey}
      className={`
        relative select-none cursor-grab active:cursor-grabbing
        w-full rounded-2xl border overflow-hidden
        transition-all duration-300 group
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isShaking ? 'shake' : ''}
        ${isFlipped
          ? 'border-primary/40 card-glow-correct shadow-[4px_6px_16px_rgba(0,0,0,0.45)]'
          : isCorrect
          ? 'border-teal-400/60 card-glow-correct shadow-[4px_6px_16px_rgba(0,0,0,0.45)]'
          : 'border-gray-700 hover:border-primary/50 bg-gray-900 shadow-[4px_6px_16px_rgba(0,0,0,0.45)] hover:shadow-[6px_8px_20px_rgba(0,0,0,0.55)]'
        }
      `}
      style={{ aspectRatio: '2/3' }}
    >
      {isFlipped ? (
        <motion.div
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col bg-gradient-to-b from-primary/10 to-secondary p-2"
        >
          {/* Card title */}
          <p className="text-[10px] leading-snug text-center text-foreground font-semibold shrink-0">
            {card.name}
          </p>

          {/* Main exponent display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="font-mono font-bold text-primary leading-none" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
              10<sup style={{ fontSize: '0.55em' }}>{card.exponent}</sup>
            </div>
            <div className="text-[8px] text-foreground/80 font-mono font-medium mt-0.5">
              × {card.coefficient} m
            </div>
          </div>

          {/* Bottom conversion */}
          <div className="w-full border-t border-border/40 px-2 py-2 shrink-0">
            <p className="text-[9px] text-primary/80 font-mono leading-tight text-center">
              {card.metricConversion}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 relative overflow-hidden bg-gray-900">
            {!imgError ? (
              <img
                src={card.image}
                alt={card.name}
                onError={() => setImgError(true)}
                draggable={false}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-4xl">🔬</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/20 via-70% to-transparent" />
          </div>
          <div className="bg-gray-900 flex items-center justify-center px-2 pb-2 pt-0">
            <p className="text-[10px] font-semibold text-white leading-tight text-center" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {card.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}