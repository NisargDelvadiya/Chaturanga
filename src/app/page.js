'use client';

/**
 * @file page.js
 * @description Main application controller for OptiTour.
 * Coordinates real-time canvas rendering, heuristic execution loops, and user interactions.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import MinimalStatsHUD from '../components/MinimalStatsHUD';
import MinimalControls from '../components/MinimalControls';
import TSPVisualizerCanvas from '../components/TSPVisualizerCanvas';
import SettingsModal from '../components/SettingsModal';
import Footer from '../components/Footer';
import { HillClimbingRunner } from '../algorithms/hillClimbing';
import { calculateTourDistanceByIndices } from '../algorithms/distance';
import { getCampusPreset, generateRandomCities, PRESETS } from '../data/presetCities';

export default function Home() {
  // Cities State (Campus Preset by default)
  const [cities, setCities] = useState(() => getCampusPreset(960, 520));
  const [selectedPreset, setSelectedPreset] = useState('campus');

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(40); // ms per step
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Hill Climbing Hyperparameters
  const [hcParams, setHcParams] = useState({
    operator: '2opt',
    strategy: 'steepest',
    sampleNeighbors: 50,
    maxPatienceBeforeRestart: 40,
  });

  // Runner reference & Timer
  const runnerRef = useRef(null);
  const timerRef = useRef(null);

  // Telemetry States
  const [bestTour, setBestTour] = useState([]);
  const [currentTour, setCurrentTour] = useState([]);
  const [bestDistance, setBestDistance] = useState(Infinity);
  const [initialDistance, setInitialDistance] = useState(Infinity);
  const [iteration, setIteration] = useState(0);

  // Reset or Initialize Runner
  const resetRunner = useCallback(
    (currentCities = cities) => {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (Array.isArray(currentCities) && currentCities.length >= 3) {
        const hc = new HillClimbingRunner(currentCities, hcParams);
        runnerRef.current = hc;
        setBestTour(hc.bestTour);
        setCurrentTour(hc.currentTour);
        setBestDistance(hc.bestDistance);
        setInitialDistance(hc.bestDistance);
        setIteration(0);
      } else {
        runnerRef.current = null;
        const initialOrder = Array.isArray(currentCities) ? currentCities.map((_, i) => i) : [];
        setBestTour(initialOrder);
        setCurrentTour(initialOrder);
        setBestDistance(0);
        setInitialDistance(0);
        setIteration(0);
      }
    },
    [cities, hcParams]
  );

  useEffect(() => {
    resetRunner(cities);
  }, [cities.length, hcParams, resetRunner]);

  // Single step optimization
  const stepOptimization = useCallback(() => {
    if (runnerRef.current) {
      const res = runnerRef.current.step();
      setBestTour(res.bestTour);
      setCurrentTour(res.currentTour);
      setBestDistance(res.bestDistance);
      setIteration(res.iteration);
    }
  }, []);

  // Main animation timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        stepOptimization();
      }, speed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, speed, stepOptimization]);

  // Start route search
  const handleStart = () => {
    if (!cities || cities.length < 3) {
      return;
    }
    setIsRunning(true);
  };

  // Pause route search
  const handlePause = () => {
    setIsRunning(false);
  };

  // Single step forward
  const handleStep = () => {
    if (!cities || cities.length < 3) return;
    setIsRunning(false);
    stepOptimization();
  };

  // Reset route
  const handleReset = () => {
    resetRunner(cities);
  };

  // Add City by Clicking Canvas (Sanitized & Clamped)
  const handleAddCity = (coords) => {
    if (!coords || !Number.isFinite(coords.x) || !Number.isFinite(coords.y)) return;
    if (cities.length >= 60) return; // Prevent excessive node creation / resource exhaustion

    setSelectedPreset('');
    const clampedX = Math.max(20, Math.min(Math.round(coords.x), 940));
    const clampedY = Math.max(20, Math.min(Math.round(coords.y), 500));

    const newCity = {
      id: cities.length + 1,
      name: `Node ${cities.length + 1}`,
      x: clampedX,
      y: clampedY,
    };
    const updated = [...cities, newCity];
    setCities(updated);
    resetRunner(updated);
  };

  // Move City by Dragging on Canvas (Sanitized & Clamped)
  const handleMoveCity = (cityIndex, coords) => {
    if (
      cityIndex < 0 ||
      cityIndex >= cities.length ||
      !coords ||
      !Number.isFinite(coords.x) ||
      !Number.isFinite(coords.y)
    ) {
      return;
    }

    const clampedX = Math.max(10, Math.min(Math.round(coords.x), 950));
    const clampedY = Math.max(10, Math.min(Math.round(coords.y), 510));

    const updated = [...cities];
    updated[cityIndex] = {
      ...updated[cityIndex],
      x: clampedX,
      y: clampedY,
    };
    setCities(updated);

    if (runnerRef.current) {
      runnerRef.current.cities = updated;
      const newBestDist = calculateTourDistanceByIndices(runnerRef.current.bestTour, updated);
      setBestDistance(newBestDist);
    }
  };

  // Clear All Cities
  const handleClearCities = () => {
    setIsRunning(false);
    setSelectedPreset('');
    setCities([]);
    resetRunner([]);
  };

  // Randomize Cities (Clamped between 3 and 45)
  const handleRandomizeCities = (count = 15) => {
    setSelectedPreset('');
    const safeCount = Math.max(3, Math.min(Number(count) || 15, 45));
    const randomCities = generateRandomCities(safeCount, 960, 520);
    setCities(randomCities);
    resetRunner(randomCities);
  };

  // Select Preset Benchmark
  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const presetData = preset.generator(960, 520);
      setCities(presetData);
      resetRunner(presetData);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-zinc-100 flex flex-col font-mono selection:bg-emerald-500 selection:text-black">
      {/* Centered Floating Header */}
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-16 sm:pt-20 pb-6 sm:pb-8 flex flex-col gap-3 sm:gap-4">
        {/* Minimalist Stats HUD */}
        <MinimalStatsHUD
          bestDistance={bestDistance}
          initialDistance={initialDistance}
          iteration={iteration}
          isRunning={isRunning}
          citiesCount={cities.length}
        />

        {/* Main Visualizer Canvas */}
        <TSPVisualizerCanvas
          cities={cities}
          bestTour={bestTour}
          currentTour={currentTour}
          onAddCity={handleAddCity}
          onMoveCity={handleMoveCity}
          isRunning={isRunning}
          bestColor="#10b981"
        />

        {/* Minimalist Floating Controls */}
        <MinimalControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onStep={handleStep}
          onReset={handleReset}
          onClearCities={handleClearCities}
          onRandomizeCities={handleRandomizeCities}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          speed={speed}
          setSpeed={setSpeed}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Structured Developer Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hcParams={hcParams}
        setHcParams={setHcParams}
        isRunning={isRunning}
      />
    </div>
  );
}
