import React from 'react';

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground font-mono">LEVEL PROGRESS</span>
        <span className="text-xs text-primary font-mono">{current}/{total}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full progress-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}