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
    <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#090d15]/90 border border-white/[0.08] shadow-2xl backdrop-blur-2xl font-mono">
      {/* 1. Main Action: Start / Pause */}
      <div className="flex items-center gap-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            title="Start Hill Climbing 2-Opt optimization"
            aria-label="Start route optimization"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all tracking-tight cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>&gt; RUN_ALGORITHM</span>
          </button>
        ) : (
          <button
            onClick={onPause}
            title="Pause route optimization"
            aria-label="Pause route optimization"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95 transition-all tracking-tight cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>PAUSE</span>
          </button>
        )}

        <button
          onClick={onStep}
          disabled={isRunning}
          title="Single step forward (Ideal for viva and professor demonstration)"
          aria-label="Advance one optimization step"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-40 transition-all border border-white/[0.06] cursor-pointer disabled:cursor-not-allowed"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">STEP</span>
        </button>

        <button
          onClick={onReset}
          title="Reset tour to initial permutation"
          aria-label="Reset tour"
          className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-all border border-white/[0.06] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Middle: Presets & Randomize */}
      <div className="flex items-center gap-2">
        {/* Presets Selector */}
        <div className="relative">
          <select
            value={selectedPreset}
            onChange={(e) => onSelectPreset(e.target.value)}
            disabled={isRunning}
            title="Select benchmark map layout (Campus Map, Circular, Clusters)"
            aria-label="Select benchmark map layout"
            className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs rounded-xl px-3 py-2 pr-7 focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono"
          >
            <option value="" className="bg-[#090d15] text-white">MAP: CUSTOM</option>
            {PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-[#090d15] text-white">
                MAP: {preset.label.toUpperCase()}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Randomize */}
        <button
          onClick={() => onRandomizeCities(15)}
          disabled={isRunning}
          title="Generate 15 random city coordinates"
          aria-label="Generate random city map"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Shuffle className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">RANDOM</span>
        </button>

        {/* Clear */}
        <button
          onClick={onClearCities}
          disabled={isRunning}
          title="Clear all cities from the map"
          aria-label="Clear all cities from the map"
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Speed & Config */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-xl bg-white/[0.03] p-0.5 border border-white/[0.06] text-[10px]">
          <button
            onClick={() => setSpeed(60)}
            title="Set normal animation speed (60ms)"
            aria-label="Normal animation speed"
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              speed === 60 ? 'bg-white/10 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => setSpeed(15)}
            title="Set fast animation speed (15ms)"
            aria-label="Fast animation speed"
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              speed === 15 ? 'bg-white/10 text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            FAST
          </button>
        </div>

        {/* Config button */}
        <button
          onClick={onOpenSettings}
          title="Configure heuristic search parameters"
          aria-label="Configure algorithm parameters"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden md:inline">CONFIG</span>
        </button>
      </div>
    </div>
  );
}
