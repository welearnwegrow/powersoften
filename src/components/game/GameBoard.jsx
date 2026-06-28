import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameCard from './GameCard';
import ProgressBar from './ProgressBar';
import { LEVELS } from '@/lib/gameData';

export default function GameBoard({ levelId, onComplete, onBack }) {
  const level = LEVELS[levelId];

  // Shuffle cards initially
  const [cards, setCards] = useState(() => {
    const shuffled = [...level.cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const [flippedIds, setFlippedIds] = useState(new Set());
  const [shakingIds, setShakingIds] = useState(new Set());
  const [dragFromIndex, setDragFromIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [allCorrect, setAllCorrect] = useState(false);

  const correctCount = flippedIds.size;

  const handleDragStart = useCallback((e, index) => {
    setDragFromIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    if (dragFromIndex === null || dragFromIndex === toIndex) {
      setDragOverIndex(null);
      return;
    }
    setCards(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragFromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDragFromIndex(null);
    setDragOverIndex(null);
  }, [dragFromIndex]);

  const handleDragEnd = useCallback(() => {
    setDragFromIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleCheck = () => {
    // Only check non-flipped cards
    const unflippedCards = cards.filter(c => !flippedIds.has(c.id));
    if (unflippedCards.length === 0) return;

    setAttempts(a => a + 1);

    const newFlipped = new Set(flippedIds);
    const newShaking = new Set();

    cards.forEach((card, idx) => {
      if (flippedIds.has(card.id)) return;

      // Find what index this card SHOULD be at among remaining cards
      // Correct order is ascending by exponent
      const sortedRemaining = [...cards.filter(c => !flippedIds.has(c.id))]
        .sort((a, b) => a.exponent - b.exponent);
      
      // For each position, check if the card there matches the expected card
      const unflippedPositions = cards
        .map((c, i) => ({ card: c, idx: i }))
        .filter(({ card: c }) => !flippedIds.has(c.id));

      const myPositionInUnflipped = unflippedPositions.findIndex(x => x.card.id === card.id);
      const expectedCard = sortedRemaining[myPositionInUnflipped];

      if (expectedCard && card.id === expectedCard.id) {
        newFlipped.add(card.id);
      } else {
        newShaking.add(card.id);
      }
    });

    setFlippedIds(newFlipped);
    setShakingIds(newShaking);

    // Clear shaking after animation
    setTimeout(() => setShakingIds(new Set()), 600);

    if (newFlipped.size === cards.length) {
      setAllCorrect(true);
      setTimeout(() => onComplete(attempts + 1), 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-6xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Levels</span>
        </button>
        <div className="text-center">
          <h2 className="text-sm md:text-base font-semibold text-foreground">{level.name}</h2>
          <p className="text-xs text-muted-foreground font-mono">{level.range}</p>
        </div>
        <div className={`text-xs font-mono font-bold uppercase ${level.difficultyColor}`}>
          {level.difficulty}
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-6xl mx-auto w-full mb-6">
        <ProgressBar current={correctCount} total={cards.length} />
      </div>

      {/* Instruction */}
      <div className="max-w-6xl mx-auto w-full mb-4">
        <p className="text-xs text-muted-foreground text-center">
          Drag cards to arrange from <span className="text-primary">smallest → largest</span>, then press Ready
        </p>
      </div>

      {/* Card Grid */}
      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2 md:gap-3 auto-rows-max">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`flex flex-col transition-all duration-200 ${dragOverIndex === index && dragFromIndex !== index ? 'drop-zone-active rounded-2xl' : ''}`}
            >
              {/* Position label */}
              <div className="text-center mb-1 h-5">
                <span className="text-xs text-muted-foreground font-mono">{index + 1}</span>
              </div>
              <div className="flex-1">
                  <GameCard
                  card={card}
                  index={index}
                  isDragging={dragFromIndex === index}
                  isFlipped={flippedIds.has(card.id)}
                  isShaking={shakingIds.has(card.id)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ready Button */}
      <div className="flex justify-center mt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleCheck}
            disabled={allCorrect}
            className="relative px-10 py-4 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {allCorrect ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Perfect!
              </span>
            ) : (
              <>
                ✓ Ready — Check My Order
                {attempts > 0 && (
                  <span className="ml-2 text-xs opacity-70">({attempts} {attempts === 1 ? 'attempt' : 'attempts'})</span>
                )}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}