'use client';

import React from 'react';

/**
 * Dedicated Custom SVG Vector Logo for OptiTour.
 * Represents interconnected network nodes forming an optimal closed-loop path.
 */
export default function Logo({ className = "w-7 h-7" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="logoGrad" x1="2" y1="4" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Closed Loop Optimal Path */}
        <path
          d="M18 5L30 27H6L18 5Z"
          stroke="url(#logoGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#glowFilter)"
        />

        {/* Inner intersecting connection */}
        <path
          d="M18 5V27M30 27L18 16M6 27L18 16"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.2"
          strokeDasharray="2,2"
        />

        {/* Node 1 (Apex) */}
        <circle cx="18" cy="5" r="3" fill="#10b981" />
        <circle cx="18" cy="5" r="1.5" fill="#080b11" />

        {/* Node 2 (Right) */}
        <circle cx="30" cy="27" r="3" fill="#06b6d4" />
        <circle cx="30" cy="27" r="1.5" fill="#080b11" />

        {/* Node 3 (Left) */}
        <circle cx="6" cy="27" r="3" fill="#3b82f6" />
        <circle cx="6" cy="27" r="1.5" fill="#080b11" />

        {/* Center Pulse Point */}
        <circle cx="18" cy="18" r="1.8" fill="#ffffff" />
      </svg>
    </div>
  );
}
