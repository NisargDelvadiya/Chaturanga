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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl font-mono">
      {/* 1. Distance Metric */}
      <div className="flex items-center justify-between sm:justify-start gap-3">
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

      {/* 2. Status & Iterations (Grid on mobile, flex on desktop) */}
      <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 text-[11px] pt-2 sm:pt-0 border-t border-white/[0.06] sm:border-t-0">
        {/* Status */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 px-2 py-1 sm:py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span className={isRunning ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
            {isRunning ? 'RUN' : 'READY'}
          </span>
        </div>

        <div className="hidden sm:block h-3 w-px bg-white/10" />

        {/* Step */}
        <div className="flex items-center justify-center sm:justify-start px-2 py-1 sm:py-0 rounded bg-white/[0.02] sm:bg-transparent border border-white/[0.04] sm:border-none text-zinc-500">
          <span className="sm:inline hidden mr-1">STEP:</span>
          <span className="text-zinc-200 font-bold">#{String(iteration).padStart(3, '0')}</span>
        </div>

        <div className="hidden sm:block h-3 w-px bg-white/10" />

        {/* Nodes */}
        <div className="flex items-center justify-center sm:justify-start px-2 py-1 sm:py-0 rounded bg-white/[0.02] sm:bg-transparent border border-white/[0.04] sm:border-none text-zinc-500">
          <span className="mr-1">NODES:</span>
          <span className="text-zinc-200 font-bold">{citiesCount}</span>
        </div>
      </div>
    </div>
  );
}
