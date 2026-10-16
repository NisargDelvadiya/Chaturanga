'use client';

import React from 'react';
import Logo from './Logo';
import { ArrowUp, Terminal, Cpu, Layers } from 'lucide-react';

/**
 * Proper, Modern Developer Footer for OptiTour.
 * Clean, structured 3-column layout matching the high-tech terminal vibe.
 */
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/[0.08] bg-[#06080e] mt-auto font-mono text-zinc-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/[0.06]">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Logo className="w-6 h-6 flex-shrink-0" />
              <span className="text-base font-bold text-white tracking-tight">
                OptiTour
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Untangling complexity. Finding the shortest path.
            </p>
            <p className="text-[11px] text-zinc-500 leading-normal">
              An interactive route heuristic simulator solving the Travelling Salesperson Problem (TSP) using iterative 2-Opt edge inversion.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>HEURISTIC_ENGINE: ONLINE</span>
            </div>
          </div>

          {/* Column 2: Algorithm Specifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Algorithm Specs</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Search Paradigm:</span>
                <span className="text-zinc-300 font-medium">Local Search / Hill Climbing</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Move Operator:</span>
                <span className="text-zinc-300 font-medium">2-Opt Edge Inversion</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Complexity:</span>
                <span className="text-amber-400 font-medium">O(N²) neighborhood</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Evaluation:</span>
                <span className="text-zinc-300 font-medium">Euclidean 2D Metric</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack & System */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>System Stack</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Framework:</span>
                <span className="text-zinc-300">Next.js 16 (App Router)</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Styling:</span>
                <span className="text-zinc-300">Tailwind CSS v4</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Typography:</span>
                <span className="text-zinc-300">JetBrains Mono</span>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-zinc-500">Renderer:</span>
                <span className="text-zinc-300">HTML5 Retina Canvas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © 2026 <strong className="text-zinc-400 font-medium">OptiTour</strong> • Developed by{' '}
            <span className="text-zinc-300 font-semibold">Nisarg Jayesh Delvadiya</span> &{' '}
            <span className="text-zinc-300 font-semibold">Rishan Mazumdar</span>
          </div>

          {/* Scroll to Top Action */}
          <button
            onClick={scrollToTop}
            title="Scroll back to the top of the page"
            aria-label="Scroll to top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>[ ↑ BACK_TO_TOP ]</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
