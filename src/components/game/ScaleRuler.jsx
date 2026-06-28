import React from 'react';
import { LEVELS } from '@/lib/gameData';

// All exponents across all levels, in order
const ALL_MIN = -35;
const ALL_MAX = 26;
const TOTAL_SPAN = ALL_MAX - ALL_MIN;

// Level exponent ranges
const LEVEL_RANGES = LEVELS.map(level => ({
  id: level.id,
  name: level.name,
  min: Math.min(...level.cards.map(c => c.exponent)),
  max: Math.max(...level.cards.map(c => c.exponent)),
}));

function pct(exp) {
  return ((exp - ALL_MIN) / TOTAL_SPAN) * 100;
}

function superscript(n) {
  const map = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(c => map[c] || c).join('');
}

const levelColors = [
  { bg: 'bg-red-500/30', border: 'border-red-500/60', text: 'text-red-400', glow: 'shadow-red-500/20' },
  { bg: 'bg-yellow-500/30', border: 'border-yellow-500/60', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  { bg: 'bg-green-500/30', border: 'border-green-500/60', text: 'text-green-400', glow: 'shadow-green-500/20' },
  { bg: 'bg-orange-500/30', border: 'border-orange-500/60', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
];

export default function ScaleRuler({ currentLevelId, cards, onJumpToLevel }) {
  // Compute the "current position" as average exponent of placed cards
  const avgExp = cards.length
    ? cards.reduce((sum, c) => sum + c.exponent, 0) / cards.length
    : LEVELS[currentLevelId]?.cards[0]?.exponent ?? 0;

  const currentRange = LEVEL_RANGES[currentLevelId];

  return (
    <div className="w-full px-2 py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-mono">10{superscript(ALL_MIN)} m</span>
        <span className="text-xs text-muted-foreground font-mono tracking-widest">← COSMIC SCALE →</span>
        <span className="text-xs text-muted-foreground font-mono">10{superscript(ALL_MAX)} m</span>
      </div>

      {/* Ruler track */}
      <div className="relative h-8 w-full">
        {/* Base track */}
        <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-secondary" />

        {/* Tick marks — one per power of 10 */}
        {Array.from({ length: TOTAL_SPAN + 1 }, (_, i) => ALL_MIN + i).map(exp => (
          <div
            key={exp}
            className="absolute top-1/2 -translate-x-1/2 w-px bg-border/60"
            style={{ left: `${pct(exp)}%`, height: exp % 5 === 0 ? '10px' : '5px', marginTop: exp % 5 === 0 ? '-5px' : '-2.5px' }}
          />
        ))}

        {/* Level bands */}
        {LEVEL_RANGES.map((lr, i) => {
          const col = levelColors[i];
          const left = pct(lr.min);
          const width = pct(lr.max) - pct(lr.min);
          const isActive = lr.id === currentLevelId;
          return (
            <button
              key={lr.id}
              onClick={() => onJumpToLevel && !isActive && onJumpToLevel(lr.id)}
              title={`Jump to ${lr.name}`}
              className={`absolute top-1/2 -translate-y-1/2 h-2 rounded-full border transition-all duration-500 ${col.bg} ${col.border} ${isActive ? 'h-3 shadow-lg ' + col.glow : 'opacity-50 hover:opacity-80 cursor-pointer'}`}
              style={{ left: `${left}%`, width: `${width}%` }}
            />
          );
        })}

        {/* Current position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/40 transition-all duration-700"
          style={{ left: `${pct(avgExp)}%` }}
        />
      </div>

      {/* Level labels */}
      <div className="relative h-5 mt-1">
        {LEVEL_RANGES.map((lr, i) => {
          const col = levelColors[i];
          const midPct = (pct(lr.min) + pct(lr.max)) / 2;
          const isActive = lr.id === currentLevelId;
          return (
            <button
              key={lr.id}
              onClick={() => onJumpToLevel && !isActive && onJumpToLevel(lr.id)}
              title={`Jump to ${lr.name}`}
              className={`absolute text-[9px] font-mono -translate-x-1/2 transition-all duration-300 ${isActive ? col.text + ' font-bold' : 'text-muted-foreground opacity-50 hover:opacity-80'}`}
              style={{ left: `${midPct}%` }}
            >
              {lr.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}