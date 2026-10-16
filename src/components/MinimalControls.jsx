'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Shuffle,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { PRESETS } from '../data/presetCities';

/**
 * @file MinimalControls.jsx
 * @description Floating glassmorphic control dock with full accessibility and cursor pointer states.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */
export default function MinimalControls({
  isRunning,
  onStart,
  onPause,
  onStep,
  onReset,
  onClearCities,
  onRandomizeCities,
  selectedPreset,
  onSelectPreset,
  speed,
  setSpeed,
  onOpenSettings,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#090d15]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl font-mono">
      {/* Row 1 on Mobile: Primary Playback & Config */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Main Action: Start / Pause */}
        {!isRunning ? (
          <button
            onClick={onStart}
            title="Start Hill Climbing 2-Opt optimization"
            aria-label="Start route optimization"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all tracking-tight cursor-pointer min-h-[38px]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="whitespace-nowrap">&gt; RUN</span>
            <span className="hidden md:inline">_ALGORITHM</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            title="Pause route optimization"
            aria-label="Pause route optimization"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all tracking-tight cursor-pointer min-h-[38px]"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        {/* Step Forward */}
        <button
          onClick={onStep}
          disabled={isRunning}
          title="Single step forward (Ideal for viva and professor demonstration)"
          aria-label="Advance one optimization step"
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 transition-all border border-white/[0.06] cursor-pointer disabled:cursor-not-allowed min-h-[38px]"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span className="text-[11px] sm:text-xs">STEP</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset tour to initial permutation"
          aria-label="Reset tour"
          className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all border border-white/[0.06] cursor-pointer min-h-[38px] flex items-center justify-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Config button (visible in row 1 on mobile) */}
        <button
          onClick={onOpenSettings}
          title="Configure heuristic search parameters"
          aria-label="Configure algorithm parameters"
          className="sm:hidden p-2 rounded-xl text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer min-h-[38px] flex items-center justify-center ml-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Row 2 on Mobile: Presets, Map Actions & Speed */}
      <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
        {/* Presets Selector */}
        <div className="relative flex-1 sm:flex-initial">
          <select
            value={selectedPreset}
            onChange={(e) => onSelectPreset(e.target.value)}
            disabled={isRunning}
            title="Select benchmark map layout (Campus Map, Circular, Clusters)"
            aria-label="Select benchmark map layout"
            className="w-full sm:w-auto appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs rounded-xl px-2.5 sm:px-3 py-2 pr-6 sm:pr-7 focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono min-h-[38px]"
          >
            <option value="" className="bg-[#090d15] text-white">MAP: CUSTOM</option>
            {PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-[#090d15] text-white">
                MAP: {preset.label.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Randomize */}
        <button
          onClick={() => onRandomizeCities(15)}
          disabled={isRunning}
          title="Generate 15 random city coordinates"
          aria-label="Generate random city map"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer min-h-[38px]"
        >
          <Shuffle className="w-3 h-3 text-cyan-400" />
          <span className="text-[11px] sm:text-xs">RAND</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClearCities}
          disabled={isRunning}
          title="Clear all cities from the map"
          aria-label="Clear all cities from the map"
          className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer min-h-[38px] flex items-center justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Speed Toggle */}
        <div className="flex rounded-xl bg-white/[0.03] p-0.5 border border-white/[0.06] text-[10px] min-h-[38px] items-center">
          <button
            onClick={() => setSpeed(60)}
            title="Set normal animation speed (60ms)"
            aria-label="Normal animation speed"
            className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
              speed === 60 ? 'bg-white/10 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => setSpeed(15)}
            title="Set fast animation speed (15ms)"
            aria-label="Fast animation speed"
            className={`px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
              speed === 15 ? 'bg-white/10 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            FAST
          </button>
        </div>

        {/* Config button (desktop) */}
        <button
          onClick={onOpenSettings}
          title="Configure heuristic search parameters"
          aria-label="Configure algorithm parameters"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer min-h-[38px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">CONFIG</span>
        </button>
      </div>
    </div>
  );
}
