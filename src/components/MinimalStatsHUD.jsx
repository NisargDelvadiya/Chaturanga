'use client';

import React from 'react';
import { roundDistance } from '../algorithms/distance';
import { TrendingDown, Terminal } from 'lucide-react';

/**
 * High-tech Hacker/Developer HUD for Hill Climbing Algorithm.
 */
export default function MinimalStatsHUD({
  bestDistance,
  initialDistance,
  iteration,
  isRunning,
  citiesCount = 0,
}) {
  const roundedBest = bestDistance && bestDistance !== Infinity ? roundDistance(bestDistance) : 0;
  const roundedInitial = initialDistance && initialDistance !== Infinity ? roundDistance(initialDistance) : 0;

  const improvement =
    roundedInitial > 0 && roundedBest > 0 && roundedBest < roundedInitial
      ? roundDistance(((roundedInitial - roundedBest) / roundedInitial) * 100)
      : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl font-mono">
      {/* 1. Distance Metric */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[10px] tracking-widest text-zinc-500 uppercase flex items-center gap-1.5 font-semibold">
            <span>TOTAL_DISTANCE</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-300 font-mono mt-0.5">
            {roundedBest > 0 ? `${roundedBest.toFixed(2)} px` : '0.00 px'}
          </div>
        </div>

        {/* Improvement Badge */}
        {improvement > 0 && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <TrendingDown className="w-3 h-3" />
            <span>-{improvement}%</span>
          </div>
        )}
      </div>

      {/* 2. Status & Iterations */}
      <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
        {/* Status */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span className={isRunning ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
            {isRunning ? 'OPTIMIZING' : 'STANDBY'}
          </span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="text-zinc-500">
          STEP: <span className="text-zinc-200 font-bold">{String(iteration).padStart(3, '0')}</span>
        </div>

        <div className="h-3 w-px bg-white/10" />

        <div className="text-zinc-500">
          NODES: <span className="text-zinc-200 font-bold">{citiesCount}</span>
        </div>
      </div>
    </div>
  );
}
