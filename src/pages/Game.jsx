import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Timer, Flag, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LEVELS } from '@/lib/gameData';
import { base44 } from '@/api/base44Client';
import LevelSelect from '@/components/game/LevelSelect';
import GameCard from '@/components/game/GameCard';
import LevelComplete from '@/components/game/LevelComplete';
import ProgressBar from '@/components/game/ProgressBar';
import ScaleRuler from '@/components/game/ScaleRuler';
import Footer from '@/components/game/Footer';
import StorytellerDrawer from '@/components/game/StorytellerDrawer';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Game() {
  const [screen, setScreen] = useState('select'); // 'select' | 'play' | 'complete'
  const [levelId, setLevelId] = useState(null);
  const [cards, setCards] = useState([]);
  const [correctIds, setCorrectIds] = useState(new Set()); // green highlight
  const [shakingIds, setShakingIds] = useState(new Set());
  const [allFlipped, setAllFlipped] = useState(false); // true only when every card correct
  const [attempts, setAttempts] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [mistakeCards, setMistakeCards] = useState([]);
  const [gaveUp, setGaveUp] = useState(false);
  const [storytellerOpen, setStorytellerOpen] = useState(false);
  const timerRef = useRef(null);
  const dragIndexRef = useRef(null);
  const cardsRef = useRef(cards);
  useEffect(() => { cardsRef.current = cards; }, [cards]);

  const startLevel = useCallback((id) => {
    const level = LEVELS[id];
    setLevelId(id);
    setCards(shuffle(level.cards));
    setCorrectIds(new Set());
    setShakingIds(new Set());
    setAllFlipped(false);
    setAttempts(0);
    setElapsed(0);
    setFinalTime(0);
    setMistakeCards([]);
    setGaveUp(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    setScreen('play');
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Desktop: HTML5 drag-and-drop ──────────────────────────────────────────
  const handleDragStart = (e, index) => {
    if (allFlipped) { e.preventDefault(); return; }
    dragIndexRef.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // ghost image: transparent 1×1 pixel so the card stays in place visually
    const ghost = document.createElement('div');
    ghost.style.cssText = 'width:1px;height:1px;opacity:0;position:fixed;top:-1px;left:-1px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    if (index === dragIndexRef.current) return;
    setDragOverIndex(index);
    // Live-reorder while dragging for visual feedback
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    const newCards = [...cardsRef.current];
    const [moved] = newCards.splice(from, 1);
    newCards.splice(index, 0, moved);
    cardsRef.current = newCards;
    setCards(newCards);
    dragIndexRef.current = index;
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
    setCorrectIds(new Set());
  };

  // ── Mobile: Pointer Events ─────────────────────────────────────────────────
  const handlePointerDown = (e, index) => {
    if (allFlipped) return;
    if (e.pointerType === 'mouse') return; // handled by drag-and-drop
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragIndexRef.current = index;
    setDragIndex(index);
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'mouse') return;
    const fromIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragIndex(null);
    if (fromIndex === null) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cardEl = el?.closest('[data-card-index]');
    if (!cardEl) return;
    const toIndex = parseInt(cardEl.getAttribute('data-card-index'), 10);
    if (isNaN(toIndex) || toIndex === fromIndex) return;
    const newCards = [...cardsRef.current];
    const [moved] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, moved);
    setCards(newCards);
    setCorrectIds(new Set());
  };

  const handleReady = async () => {
    const level = LEVELS[levelId];
    const sortedByExp = [...level.cards].sort((a, b) => a.exponent - b.exponent);

    const newCorrect = new Set();
    const newShaking = new Set();

    cards.forEach((card, i) => {
      if (card.id === sortedByExp[i].id) {
        newCorrect.add(card.id);
      } else {
        newShaking.add(card.id);
      }
    });

    setAttempts(a => a + 1);
    setCorrectIds(newCorrect);
    setShakingIds(newShaking);

    // Track mistakes
    const wrongCards = cards.filter(c => newShaking.has(c.id));
    setMistakeCards(prev => {
      const existing = new Set(prev.map(c => c.id));
      return [...prev, ...wrongCards.filter(c => !existing.has(c.id))];
    });

    setTimeout(() => setShakingIds(new Set()), 600);

    // Only complete when ALL cards are in the correct position
    if (newCorrect.size === level.cards.length) {
      setAllFlipped(true);
      clearInterval(timerRef.current);
      const finalAtt = attempts + 1;
      setFinalTime(elapsed);
      setCompletedLevels(prev => prev.includes(levelId) ? prev : [...prev, levelId]);
      // Save score to leaderboard
      try {
        let playerName = 'Anonymous';
        try {
          const user = await base44.auth.me();
          playerName = user.full_name || user.email || 'Anonymous';
        } catch {
          // User not authenticated (public app) — use Anonymous
        }
        const s = computeScore(finalAtt, elapsed);
        await base44.entities.Score.create({
          levelId,
          levelName: level.name,
          attempts: finalAtt,
          completionTime: elapsed,
          score: s,
          gaveUp: false,
          playerName,
        });
      } catch {}
    }
  };

  const computeScore = (att, time) => Math.max(0, Math.round(1000 - att * 200 - time * 0.5));

  const handleGiveUp = () => {
    const level = LEVELS[levelId];
    const sorted = [...level.cards].sort((a, b) => a.exponent - b.exponent);

    // Build the list of swaps needed (selection-sort style, left to right)
    // so each step moves exactly one card into its correct slot, visibly.
    const workingOrder = [...cards];
    const swaps = [];
    for (let i = 0; i < sorted.length; i++) {
      const targetId = sorted[i].id;
      const currentIdx = workingOrder.findIndex(c => c.id === targetId);
      if (currentIdx !== i) {
        // swap workingOrder[i] and workingOrder[currentIdx]
        [workingOrder[i], workingOrder[currentIdx]] = [workingOrder[currentIdx], workingOrder[i]];
        swaps.push([...workingOrder.map(c => c.id)]);
      }
    }

    // Replay swaps one at a time, 600ms apart so the user can see each move
    swaps.forEach((orderSnapshot, step) => {
      setTimeout(() => {
        setCards(prev => {
          const idToCard = Object.fromEntries(prev.map(c => [c.id, c]));
          return orderSnapshot.map(id => idToCard[id]);
        });
      }, step * 700);
    });

    // Flip all after all swaps complete
    const totalDelay = swaps.length * 700 + 800;
    setTimeout(async () => {
      setAllFlipped(true);
      setGaveUp(true);
      setCorrectIds(new Set(sorted.map(c => c.id)));
      clearInterval(timerRef.current);
      setFinalTime(elapsed);
      setCompletedLevels(prev => prev.includes(levelId) ? prev : [...prev, levelId]);
      // Save gave-up score (not counted in leaderboard ranking)
      try {
        let playerName = 'Anonymous';
        try {
          const user = await base44.auth.me();
          playerName = user.full_name || user.email || 'Anonymous';
        } catch {
          // User not authenticated (public app) — use Anonymous
        }
        await base44.entities.Score.create({
          levelId,
          levelName: level.name,
          attempts,
          completionTime: elapsed,
          score: 0,
          gaveUp: true,
          playerName,
        });
      } catch {}
    }, totalDelay);
  };

  const correctCount = correctIds.size;
  const totalCards = levelId !== null ? LEVELS[levelId].cards.length : 9;

  return (
    <div className="min-h-screen font-grotesk">
      <AnimatePresence mode="wait">
        {screen === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen">
            <div className="flex-1">
              <LevelSelect onSelectLevel={startLevel} completedLevels={completedLevels} />
            </div>
            <Footer />
          </motion.div>
        )}

        {screen === 'play' && levelId !== null && (
          <motion.div
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setScreen('select')}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                        LEVELS[levelId].difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        LEVELS[levelId].difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        LEVELS[levelId].difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{LEVELS[levelId].difficulty}</span>
                      <h2 className="text-sm md:text-base font-semibold text-foreground">{LEVELS[levelId].name}</h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{LEVELS[levelId].range}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                    <Timer className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono tabular-nums">{formatTime(elapsed)}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleGiveUp}
                    className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold px-3 rounded-xl flex items-center gap-1.5"
                  >
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Give Up</span>
                  </Button>
                  <Button
                    onClick={handleReady}
                    disabled={allFlipped}
                    className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 rounded-xl flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Ready</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-4 px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{LEVELS[levelId].name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Drag cards to reorder them from <span className="text-primary font-mono">smallest → largest</span>, then press <span className="text-primary font-semibold">Ready</span>
              </p>
              {attempts > 0 && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Attempts: {attempts} · In position: {correctCount}/{totalCards}
                </p>
              )}
            </div>

            {/* Cards Grid */}
            <div className="flex-1 px-4 pb-8 overflow-y-auto">
              <div className="w-full pr-6 md:pr-0">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                  {cards.map((card, i) => (
                    <div
                      key={card.id}
                      data-card-index={i}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDragEnd={handleDragEnd}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                      onPointerMove={(e) => handleDragOver(e, i)}
                      onPointerUp={(e) => handlePointerUp(e)}
                      className={`select-none cursor-grab active:cursor-grabbing ${dragIndex === i ? 'opacity-40 scale-95' : ''} transition-all`}
                      style={{ touchAction: 'none' }}
                    >
                      <GameCard
                        card={card}
                        index={i}
                        isDragging={dragIndex === i}
                        isFlipped={allFlipped}
                        isCorrect={correctIds.has(card.id)}
                        isShaking={shakingIds.has(card.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* View Summary Banner — appears after all cards flip */}
                <AnimatePresence>
                  {allFlipped && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.5 }}
                      className={`mt-6 flex items-center justify-between gap-4 border rounded-2xl px-5 py-4 ${gaveUp ? 'bg-destructive/10 border-destructive/30' : 'bg-primary/10 border-primary/30'}`}
                    >
                      <div>
                        <p className="text-sm font-bold text-foreground">{gaveUp ? '😔 Too Bad!' : '🎉 Level Complete!'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Take your time reading the cards, then view your summary.</p>
                      </div>
                      <Button
                        onClick={() => setScreen('complete')}
                        className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 rounded-xl flex items-center gap-2"
                      >
                        View Summary
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cosmic Scale Ruler */}
              <ScaleRuler currentLevelId={levelId} cards={cards} onJumpToLevel={startLevel} />
            </div>
            <Footer />
          </motion.div>
        )}

        {screen === 'complete' && levelId !== null && (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col min-h-screen">
            <div className="flex-1">
              <LevelComplete
                levelId={levelId}
                attempts={attempts}
                completionTime={finalTime}
                mistakeCards={mistakeCards}
                gaveUp={gaveUp}
                onNextLevel={() => {
                  const DIFF_ORDER = ['Easy', 'Medium', 'Hard', 'Pro'];
                  const currentDiff = LEVELS[levelId].difficulty;
                  const nextDiff = DIFF_ORDER[DIFF_ORDER.indexOf(currentDiff) + 1];
                  const nextLevel = LEVELS.find(l => l.difficulty === nextDiff);
                  if (nextLevel) startLevel(nextLevel.id);
                }}
                onReplay={() => startLevel(levelId)}
                onHome={() => setScreen('select')}
              />
            </div>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat bubble */}
      <button
        onClick={() => setStorytellerOpen(true)}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Ask me anything"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <StorytellerDrawer isOpen={storytellerOpen} onClose={() => setStorytellerOpen(false)} />
    </div>
  );
}