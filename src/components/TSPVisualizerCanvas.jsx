'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Razor-Sharp, High-DPI (Retina) HTML5 Canvas Visualizer for TSP.
 * Fixes all blurriness by:
 * 1. Matching canvas internal buffer directly to window.devicePixelRatio (2x / 3x Retina)
 * 2. Removing fuzzy shadowBlur filters and blurry halos
 * 3. Rendering clean, crisp, high-contrast vector lines, nodes, and typography
 */
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

  // Get canvas coordinates from mouse/touch event
  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX !== undefined ? e.clientX : e.touches?.[0]?.clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches?.[0]?.clientY;

    return {
      x: Math.round(clientX - rect.left),
      y: Math.round(clientY - rect.top),
    };
  }, []);

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasDimensions({
          width: Math.round(rect.width) || 960,
          height: 520,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle Canvas Click to add city
  const handleCanvasClick = (e) => {
    if (isRunning) return;
    if (draggedCityIndex !== null) return;

    const coords = getCanvasCoordinates(e);

    // Prevent placing directly on top of an existing city
    const clickedExisting = cities.some(
      (c) => Math.hypot(c.x - coords.x, c.y - coords.y) < 24
    );

    if (!clickedExisting && onAddCity) {
      onAddCity(coords);
    }
  };

  // Start dragging city
  const handleMouseDown = (e) => {
    if (isRunning) return;
    const coords = getCanvasCoordinates(e);

    const cityIndex = cities.findIndex(
      (c) => Math.hypot(c.x - coords.x, c.y - coords.y) < 22
    );

    if (cityIndex !== -1) {
      setDraggedCityIndex(cityIndex);
    }
  };

  // Dragging or hover
  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e);

    if (draggedCityIndex !== null && onMoveCity && !isRunning) {
      onMoveCity(draggedCityIndex, coords);
      return;
    }

    const hoverIndex = cities.findIndex(
      (c) => Math.hypot(c.x - coords.x, c.y - coords.y) < 20
    );
    setHoveredCityIndex(hoverIndex !== -1 ? hoverIndex : null);
  };

  const handleMouseUp = () => {
    setDraggedCityIndex(null);
  };

  // Render Crisp Canvas Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 1. High-DPI / Retina Resolution Setup
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2;
    const width = canvasDimensions.width;
    const height = canvasDimensions.height;

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    // Scale context so drawing units are in CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // 2. Crisp, subtle dot matrix
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const dotSpacing = 32;
    for (let x = 16; x < width; x += dotSpacing) {
      for (let y = 16; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // 3. Active probe route during optimization (sharp dashed line)
    if (currentTour && currentTour.length > 1 && isRunning) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
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

    // 4. Best Tour (Razor-Sharp, Clean Emerald Vector Path)
    if (bestTour && bestTour.length > 1) {
      ctx.save();

      // Sharp main stroke
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

      // Sharp Directional Arrowheads (no blur)
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

    // 5. Crisp Nodes (Zero Blurry Halos)
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
      const labelText = city.name || `City ${idx + 1}`;
      ctx.fillText(labelText, city.x, city.y - 17);

      ctx.restore();
    });

    // 6. Minimal Empty State Message
    if (cities.length === 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '500 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('// Click anywhere to place nodes', width / 2, height / 2 - 8);
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillText('// or select a preset below to initialize', width / 2, height / 2 + 14);
      ctx.restore();
    }

    ctx.restore();
  }, [cities, bestTour, currentTour, hoveredCityIndex, draggedCityIndex, isRunning, bestColor, canvasDimensions]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-[#090d16] border border-white/[0.08] shadow-2xl group select-none transition-all"
    >
      <canvas
        ref={canvasRef}
        style={{ width: `${canvasDimensions.width}px`, height: '520px' }}
        title="Interactive map canvas: Click to place a city node, drag nodes to reposition"
        aria-label="Interactive Travelling Salesperson route canvas"
        className={`block w-full select-none ${
          hoveredCityIndex !== null
            ? 'cursor-grab active:cursor-grabbing'
            : isRunning
            ? 'cursor-default'
            : 'cursor-crosshair'
        }`}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
