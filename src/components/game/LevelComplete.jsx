import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, RotateCcw, Home, Timer, Zap, Lightbulb, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LEVELS } from '@/lib/gameData';
import { base44 } from '@/api/base44Client';

const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard', 'Pro'];

function getNextSuggestedLevel(currentLevelId) {
  const current = LEVELS[currentLevelId];
  const currentDiffIdx = DIFFICULTY_ORDER.indexOf(current.difficulty);
  if (currentDiffIdx === -1 || currentDiffIdx === DIFFICULTY_ORDER.length - 1) return null;
  const nextDiff = DIFFICULTY_ORDER[currentDiffIdx + 1];
  return LEVELS.find(l => l.difficulty === nextDiff) || null;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}

const difficultyColor = {
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Pro: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function LevelComplete({ levelId, attempts, completionTime, mistakeCards, gaveUp, onNextLevel, onReplay, onHome }) {
  const level = LEVELS[levelId];
  const nextLevel = getNextSuggestedLevel(levelId);
  const [tip, setTip] = useState([]);
  const [loadingTip, setLoadingTip] = useState(true);
  // allLevelStats: { [levelId]: { rank, total, percentile, myScore } }
  const [allLevelStats, setAllLevelStats] = useState({});
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const myScore = Math.max(0, Math.round(1000 - attempts * 200 - completionTime * 0.5));

  useEffect(() => {
    async function fetchLeaderboard() {
      if (gaveUp) return; // No percentile for give-ups
      try {
        // Fetch all non-gave-up scores for the current level
        const scores = await base44.entities.Score.filter({ levelId }, '-score', 10000);
        const validScores = scores.filter(s => !s.gaveUp);

        // My current score
        const currentScore = Math.max(0, Math.round(1000 - attempts * 200 - completionTime * 0.5));

        // Count how many scores are strictly worse than mine
        const worseThanMe = validScores.filter(s => s.score < currentScore).length;
        const total = validScores.length + 1; // +1 for the current attempt
        // percentile = what % of players scored <= me, expressed as "top X%"
        const topPct = Math.max(1, Math.round(((total - (worseThanMe + 1)) / total) * 100));

        setAllLevelStats({ [levelId]: { percentile: topPct, myScore: currentScore, total } });
      } catch (e) {
        console.error('Leaderboard fetch failed:', e);
      }
    }
    fetchLeaderboard();
  }, [levelId, gaveUp, attempts, completionTime]);

  useEffect(() => {
    async function fetchTip() {
      setLoadingTip(true);
      try {
        const mistakeNames = mistakeCards && mistakeCards.length > 0
          ? mistakeCards.map(c => `${c.name} (10^${c.exponent} m)`).join(', ')
          : null;

        const allCardsList = level.cards.map(c => `${c.name} (10^${c.exponent} m)`).join(', ');
        const prompt = attempts === 1
          ? `A student just sorted these objects from smallest to largest on their FIRST attempt with no mistakes, in the game "Powers of Ten: Our Universe", level "${level.name}": ${allCardsList}. Generate 5 insights that feel like hidden rewards — things they may not have known even though they got it right. Each insight should directly reference one of the specific objects AND reveal something surprising or counterintuitive about its size relative to another object in the list. Each insight must be a single sentence of MAX 30 words. No generic encouragement. Return as JSON with key "insights".`
          : `A student just played "Powers of Ten: Our Universe", level "${level.name}". The correct order from smallest to largest was: ${allCardsList}. ${mistakeNames ? `They specifically misplaced these objects: ${mistakeNames}. For EACH misplaced object, write one insight that directly addresses the likely confusion — compare it to a neighbour in the list and explain WHY the sizes are ordered the way they are (e.g. "Preons are theorised building blocks INSIDE quarks, making them smaller"). Then add ${Math.max(0, 5 - mistakeCards.length)} more surprising size-comparison insights from the rest of the list.` : `They made some ordering errors. Write 5 insights that compare adjacent objects in the list and explain why their size ordering is surprising or counterintuitive.`} Each insight must name two specific objects and be MAX 30 words. No generic encouragement. Return as JSON with key "insights".`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              insights: { type: "array", items: { type: "string" } }
            }
          }
        });
        setTip(result.insights || []);
      } catch {
        setTip(attempts === 1
          ? ["Outstanding! You nailed the order on your first try — you clearly have a great grasp of scale!"]
          : ["Great effort! Each mistake is a clue — the scale of the universe is full of surprises, and now you know them better."]);
      }
      setLoadingTip(false);
    }
    fetchTip();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.7 }}
        className="text-center max-w-lg w-full"
      >


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-2 mb-4 ${gaveUp ? 'bg-destructive/10 border-destructive/20' : 'bg-primary/10 border-primary/20'}`}>
            <Trophy className={`w-4 h-4 ${gaveUp ? 'text-destructive' : 'text-primary'}`} />
            <span className={`text-sm font-mono font-bold ${gaveUp ? 'text-destructive' : 'text-primary'}`}>{gaveUp ? 'TOO BAD!' : 'LEVEL COMPLETE'}</span>
          </div>

          <h2 className="text-3xl font-bold mb-2 text-foreground">{level.name}</h2>

          {/* Stats row */}
          <div className="flex justify-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-4 py-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-foreground">
                {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>
            {completionTime > 0 && (
              <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-4 py-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-foreground">{formatTime(completionTime)}</span>
              </div>
            )}
            {allLevelStats[levelId] && (
              <div className="flex items-center gap-2 bg-primary/20 rounded-xl px-4 py-2">
                <Medal className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-primary font-bold">top {allLevelStats[levelId].percentile}%</span>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 shrink-0" style={{ color: 'hsl(43 96% 70%)' }} />
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Insights</span>
            </div>
            {loadingTip ? (
              <div className="flex items-center gap-3 bg-secondary/40 border border-border rounded-xl px-4 py-3">
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin shrink-0" />
                <span className="text-xs text-muted-foreground">Generating your insights…</span>
              </div>
            ) : (
              <div className="space-y-2">
                {tip.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 border border-border/50 rounded-lg px-3 py-2.5">
                    <span className="text-primary font-mono text-xs font-bold shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-xs text-foreground leading-snug">{insight.split(' ').slice(0, 30).join(' ')}{insight.split(' ').length > 30 ? '.' : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!gaveUp && (
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              You've completed the scale from {level.cards[0].metricLabel} to {level.cards[level.cards.length - 1].metricLabel}
            </p>
          )}



          <div className="flex flex-col gap-3">
            {gaveUp ? (
              <>
                <Button
                  onClick={onReplay}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </Button>
                {nextLevel && (
                  <Button
                    onClick={onNextLevel}
                    variant="outline"
                    className="w-full border-primary/40 hover:border-primary rounded-xl flex items-center justify-center gap-2"
                  >
                    Move on: {nextLevel.name}
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                      nextLevel.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      nextLevel.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>{nextLevel.difficulty}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onHome}
                  className="w-full border-border hover:border-primary/40 rounded-xl"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </>
            ) : (
              <>
                {nextLevel && (
                  <Button
                    onClick={onNextLevel}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    Next: {nextLevel.name}
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                      nextLevel.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      nextLevel.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>{nextLevel.difficulty}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={onReplay}
                    className="flex-1 border-border hover:border-primary/40 rounded-xl"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onHome}
                    className="flex-1 border-border hover:border-primary/40 rounded-xl"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}