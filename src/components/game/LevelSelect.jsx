import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Dna, Globe, Telescope } from 'lucide-react';
import { LEVELS } from '@/lib/gameData';

const levelIcons = [Atom, Dna, Globe, Telescope];

// Each level has its own earthy hue: subatomic=blue, molecular=green, human=orange, astro=red
// Ordered by level.id: 0=Subatomic(Pro), 1=Molecular(Medium), 2=Human(Easy), 3=Astro(Hard)
const levelColors = {
  0: { card: "border-blue-400/50",   bg: "bg-blue-100/60",   icon: "text-blue-700",   range: "text-blue-700",   badge: "bg-blue-200 text-blue-800" },
  1: { card: "border-emerald-400/50", bg: "bg-emerald-100/60", icon: "text-emerald-700", range: "text-emerald-700", badge: "bg-emerald-200 text-emerald-800" },
  2: { card: "border-orange-400/50", bg: "bg-orange-100/60", icon: "text-orange-700", range: "text-orange-700", badge: "bg-orange-200 text-orange-800" },
  3: { card: "border-red-400/50",    bg: "bg-red-100/60",    icon: "text-red-700",    range: "text-red-700",    badge: "bg-red-200 text-red-800" },
};

export default function LevelSelect({ onSelectLevel, completedLevels }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-primary star"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-grotesk mb-3 tracking-tight">
          <span className="shimmer-text">POWERS OF TEN</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-grotesk font-semibold tracking-wide">
          Our Universe
        </p>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
          Arrange 9 cards in order from smallest to largest. 
          Drag, drop, and discover the incredible scale of our cosmos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
        {[...LEVELS].sort((a, b) => {
          const order = { Easy: 0, Medium: 1, Hard: 2, Pro: 3 };
          return order[a.difficulty] - order[b.difficulty];
        }).map((level, i) => {
          const Icon = levelIcons[LEVELS.indexOf(level)];
          const isCompleted = completedLevels.includes(level.id);
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLevel(level.id)}
              className={`relative text-left p-6 rounded-2xl border ${levelColors[level.id].card} ${levelColors[level.id].bg} backdrop-blur-sm transition-all duration-300 hover:shadow-lg group`}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-bold">✓</span>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/30 group-hover:bg-white/50 transition-colors shrink-0">
                  <Icon className={`w-6 h-6 ${levelColors[level.id].icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{level.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[level.id].badge}`}>{level.difficulty}</span>
                  </div>
                  <p className={`text-xs font-mono mb-2 font-semibold ${levelColors[level.id].range}`}>{level.range}</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">{level.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      
    </div>
  );
}