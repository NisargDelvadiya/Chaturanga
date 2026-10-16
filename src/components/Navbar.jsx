'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';

/**
 * Centered Dynamic Floating Navbar with Dedicated Logo, Brand Name & Slogan.
 */
export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY <= 5) {
        setIsVisible(true);
      } else if (delta > 2) {
        setIsVisible(false);
      } else if (delta < -2) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center pointer-events-none transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
      }`}
    >
      <nav
        title="OptiTour: Untangling complexity. Finding the shortest path."
        aria-label="OptiTour navigation header"
        className="pointer-events-auto max-w-[calc(100vw-1.5rem)] rounded-full bg-[#080b11]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-center gap-2.5 sm:gap-3 transition-all hover:border-emerald-500/30"
      >
        {/* Dedicated Vector Logo */}
        <Logo className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />

        {/* Dedicated Brand Name & Slogan */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white font-mono flex items-center">
              OptiTour
              <span className="inline-block w-1.5 h-3 bg-emerald-400/80 animate-pulse ml-1" />
            </h1>
          </div>

          <div className="h-3 w-px bg-white/10 hidden sm:block flex-shrink-0" />

          {/* Slogan */}
          <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono tracking-tight truncate">
            Untangling complexity. Finding the shortest path.
          </span>
        </div>
      </nav>
    </header>
  );
}
