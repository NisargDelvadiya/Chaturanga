'use client';

/**
 * @file TSPVisualizerCanvas.jsx
 * @description Fully responsive, High-DPI Retina HTML5 Canvas visualizer.
 * Supports virtual coordinate mapping, mobile touch dragging, and resolution independence.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';

const VIRTUAL_WIDTH = 960;
const VIRTUAL_HEIGHT = 520;

export default function TSPVisualizerCanvas({
  cities = [],
  bestTour = [],
  currentTour = [],
  onAddCity,
  onMoveCity,
  isRunning = false,
  bestColor = '#10b981',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [draggedCityIndex, setDraggedCityIndex] = useState(null);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 960, height: 520 });

  // Map screen pixel coordinate to 960x520 virtual coordinate space
  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, screenX: 0, screenY: 0, rectWidth: 960, rectHeight: 520 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;

    if (clientX === undefined || clientY === undefined) {
      return { x: 0, y: 0, screenX: 0, screenY: 0, rectWidth: rect.width, rectHeight: rect.height };
    }

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const scaleX = VIRTUAL_WIDTH / rect.width;
    const scaleY = VIRTUAL_HEIGHT / rect.height;

    return {
      x: Math.round(screenX * scaleX),
      y: Math.round(screenY * scaleY),
      screenX,
      screenY,
      rectWidth: rect.width,
      rectHeight: rect.height,
    };
  }, []);

  // Update canvas dimensions on container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.round(rect.width) || 960,
          height: Math.round(rect.height) || 480,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle Canvas Click or Tap to place node
  const handleInteractionStart = (e) => {
    if (isRunning) return;

    const coords = getCanvasCoordinates(e);
    const { screenX, screenY, rectWidth, rectHeight } = coords;

    // Responsive screen-space hit detection: 24px screen radius (48px tap target for mobile fingers)
    const HIT_RADIUS_SCREEN_PX = 24;

    const cityIndex = cities.findIndex((c) => {
      const cityScreenX = c.x * (rectWidth / VIRTUAL_WIDTH);
      const cityScreenY = c.y * (rectHeight / VIRTUAL_HEIGHT);
      return Math.hypot(cityScreenX - screenX, cityScreenY - screenY) < HIT_RADIUS_SCREEN_PX;
    });

    if (cityIndex !== -1) {
      setDraggedCityIndex(cityIndex);
      if (e.cancelable && e.type.startsWith('touch')) {
        e.preventDefault();
      }
    } else {
      // Place new city
      if (onAddCity) {
        onAddCity({ x: coords.x, y: coords.y });
      }
    }
  };

  // Dragging or hover
  const handleInteractionMove = (e) => {
    const coords = getCanvasCoordinates(e);

    if (draggedCityIndex !== null && onMoveCity && !isRunning) {
      if (e.cancelable && e.type.startsWith('touch')) {
        e.preventDefault();
      }
      onMoveCity(draggedCityIndex, { x: coords.x, y: coords.y });
      return;
    }

    const { screenX, screenY, rectWidth, rectHeight } = coords;
    const hoverIndex = cities.findIndex((c) => {
      const cityScreenX = c.x * (rectWidth / VIRTUAL_WIDTH);
      const cityScreenY = c.y * (rectHeight / VIRTUAL_HEIGHT);
      return Math.hypot(cityScreenX - screenX, cityScreenY - screenY) < 20;
    });
    setHoveredCityIndex(hoverIndex !== -1 ? hoverIndex : null);
  };

  const handleInteractionEnd = () => {
    setDraggedCityIndex(null);
  };

  // Render Crisp Responsive Canvas Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High-DPI / Retina Resolution Setup
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2;
    const displayWidth = canvasDimensions.width;
    const displayHeight = canvasDimensions.height;

    const targetWidth = Math.round(displayWidth * dpr);
    const targetHeight = Math.round(displayHeight * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    // Scale from virtual space (VIRTUAL_WIDTH x VIRTUAL_HEIGHT) to physical device pixels
    ctx.setTransform(
      dpr * (displayWidth / VIRTUAL_WIDTH),
      0,
      0,
      dpr * (displayHeight / VIRTUAL_HEIGHT),
      0,
      0
    );
    ctx.clearRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // 1. Crisp, subtle dot matrix
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const dotSpacing = 32;
    for (let x = 16; x < VIRTUAL_WIDTH; x += dotSpacing) {
      for (let y = 16; y < VIRTUAL_HEIGHT; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // 2. Active probe route during optimization (sharp dashed line)
    if (currentTour && currentTour.length > 1 && isRunning) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);

      for (let i = 0; i < currentTour.length; i++) {
        const c1 = cities[currentTour[i]];
        const c2 = cities[currentTour[(i + 1) % currentTour.length]];
        if (c1 && c2) {
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Best Tour (Razor-Sharp, Clean Emerald Vector Path)
    if (bestTour && bestTour.length > 1) {
      ctx.save();

      // Sharp main vector stroke
      ctx.beginPath();
      ctx.strokeStyle = bestColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < bestTour.length; i++) {
        const c1 = cities[bestTour[i]];
        if (c1) {
          if (i === 0) ctx.moveTo(c1.x, c1.y);
          else ctx.lineTo(c1.x, c1.y);
        }
      }
      if (cities[bestTour[0]]) {
        ctx.lineTo(cities[bestTour[0]].x, cities[bestTour[0]].y);
      }
      ctx.stroke();

      // Sharp Directional Arrowheads
      ctx.fillStyle = bestColor;
      for (let i = 0; i < bestTour.length; i++) {
        const c1 = cities[bestTour[i]];
        const c2 = cities[bestTour[(i + 1) % bestTour.length]];
        if (c1 && c2) {
          const midX = (c1.x + c2.x) / 2;
          const midY = (c1.y + c2.y) / 2;
          const angle = Math.atan2(c2.y - c1.y, c2.x - c1.x);

          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(6, 0);
          ctx.lineTo(-4, -3.5);
          ctx.lineTo(-2, 0);
          ctx.lineTo(-4, 3.5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.restore();
    }

    // 4. Crisp Nodes
    cities.forEach((city, idx) => {
      const isStart = bestTour && bestTour.length > 0 && bestTour[0] === idx;
      const isHovered = hoveredCityIndex === idx;
      const isDragged = draggedCityIndex === idx;

      ctx.save();

      // Start city sharp dashed accent ring
      if (isStart) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 16, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Outer node ring
      ctx.beginPath();
      ctx.arc(city.x, city.y, isHovered || isDragged ? 12 : 10, 0, 2 * Math.PI);
      ctx.fillStyle = isStart
        ? '#f59e0b'
        : isHovered || isDragged
        ? '#38bdf8'
        : '#6366f1';
      ctx.fill();

      // Crisp inner dark circle
      ctx.beginPath();
      ctx.arc(city.x, city.y, isHovered || isDragged ? 8 : 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#090d16';
      ctx.fill();

      // Sharp ID number inside node
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${idx + 1}`, city.x, city.y);

      // Sharp city label
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = isStart ? '#fef08a' : '#cbd5e1';
      const labelText = city.name || `Node ${idx + 1}`;
      ctx.fillText(labelText, city.x, city.y - 17);

      ctx.restore();
    });

    // 5. Minimal Empty State Message
    if (cities.length === 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('// Click or tap anywhere to place nodes', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 - 8);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillText('// or select a preset below to initialize', VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2 + 14);
      ctx.restore();
    }

    ctx.restore();
  }, [cities, bestTour, currentTour, hoveredCityIndex, draggedCityIndex, isRunning, bestColor, canvasDimensions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] max-h-[62vh] sm:max-h-none rounded-2xl sm:rounded-3xl overflow-hidden bg-[#090d16] border border-white/[0.08] shadow-2xl group select-none transition-all touch-none"
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        title="Interactive map canvas: Click to place a city node, drag nodes to reposition"
        aria-label="Interactive Travelling Salesperson route canvas"
        className={`block w-full h-full select-none touch-none ${
          hoveredCityIndex !== null
            ? 'cursor-grab active:cursor-grabbing'
            : isRunning
            ? 'cursor-default'
            : 'cursor-crosshair'
        }`}
        onMouseDown={handleInteractionStart}
        onMouseMove={handleInteractionMove}
        onMouseUp={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchMove={handleInteractionMove}
        onTouchEnd={handleInteractionEnd}
      />

      {/* Responsive Canvas Helper Pill */}
      <div className="absolute bottom-2.5 right-3 text-[10px] text-zinc-500 font-mono pointer-events-none select-none bg-black/60 px-2.5 py-1 rounded-lg border border-white/[0.06] backdrop-blur-md hidden sm:block">
        CLICK TO ADD • DRAG TO MOVE
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] text-zinc-500 font-mono pointer-events-none select-none bg-black/70 px-2 py-0.5 rounded-md border border-white/[0.06] backdrop-blur-md sm:hidden">
        TAP TO ADD • DRAG TO MOVE
      </div>
    </div>
  );
}
