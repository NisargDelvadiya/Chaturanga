/**
 * @file presetCities.js
 * @description Benchmark city coordinate configurations and procedural generators for TSP evaluations.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

/**
 * Generates N randomly placed cities with margin constraints within canvas dimensions.
 *
 * @param {number} [count=15] Number of cities to generate
 * @param {number} [width=960] Canvas width in pixels
 * @param {number} [height=520] Canvas height in pixels
 * @param {number} [padding=50] Margin from canvas boundaries
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function generateRandomCities(count = 15, width = 960, height = 520, padding = 50) {
  const safeCount = Math.max(3, Math.min(count, 50));
  const usableWidth = Math.max(100, width - padding * 2);
  const usableHeight = Math.max(100, height - padding * 2);
  const cities = [];

  for (let i = 0; i < safeCount; i++) {
    cities.push({
      id: i + 1,
      name: `Node ${i + 1}`,
      x: Math.round(padding + Math.random() * usableWidth),
      y: Math.round(padding + Math.random() * usableHeight),
    });
  }

  return cities;
}

/**
 * Generates cities arranged evenly along a circular perimeter.
 * Ideal for optimality verification since the known shortest tour has zero edge crossings.
 *
 * @param {number} [count=16]
 * @param {number} [width=960]
 * @param {number} [height=520]
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function generateCircleCities(count = 16, width = 960, height = 520) {
  const cities = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI;
    cities.push({
      id: i + 1,
      name: `Ring ${i + 1}`,
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
    });
  }

  return cities;
}

/**
 * Generates three distinct geographic clusters of nodes.
 * Tests local search ability to navigate between intra-cluster and inter-cluster connections.
 *
 * @param {number} [width=960]
 * @param {number} [height=520]
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function generateClusteredCities(width = 960, height = 520) {
  const clusters = [
    { cx: width * 0.25, cy: height * 0.32, count: 5, radius: 70, name: 'North Cluster' },
    { cx: width * 0.75, cy: height * 0.38, count: 6, radius: 75, name: 'East Cluster' },
    { cx: width * 0.5, cy: height * 0.76, count: 5, radius: 70, name: 'South Cluster' },
  ];

  const cities = [];
  let idCounter = 1;

  clusters.forEach((cluster) => {
    for (let i = 0; i < cluster.count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * cluster.radius;
      cities.push({
        id: idCounter++,
        name: `${cluster.name} ${i + 1}`,
        x: Math.round(cluster.cx + r * Math.cos(angle)),
        y: Math.round(cluster.cy + r * Math.sin(angle)),
      });
    }
  });

  return cities;
}

/**
 * College Campus Landmarks benchmark preset.
 * Designed specifically for academic presentations and demonstrations.
 *
 * @param {number} [width=960]
 * @param {number} [height=520]
 * @returns {Array<{id: number, name: string, x: number, y: number}>}
 */
export function getCampusPreset(width = 960, height = 520) {
  const scaleX = width / 960;
  const scaleY = height / 520;

  const campusNodes = [
    { id: 1, name: 'Main Gate', x: 100 * scaleX, y: 440 * scaleY },
    { id: 2, name: 'Admin Block', x: 220 * scaleX, y: 360 * scaleY },
    { id: 3, name: 'Central Library', x: 310 * scaleX, y: 230 * scaleY },
    { id: 4, name: 'CS & AI Labs', x: 470 * scaleX, y: 150 * scaleY },
    { id: 5, name: 'Robotics Center', x: 620 * scaleX, y: 120 * scaleY },
    { id: 6, name: 'Auditorium', x: 800 * scaleX, y: 200 * scaleY },
    { id: 7, name: 'Mechanical Shed', x: 860 * scaleX, y: 340 * scaleY },
    { id: 8, name: 'Sports Stadium', x: 750 * scaleX, y: 440 * scaleY },
    { id: 9, name: 'Cafeteria', x: 540 * scaleX, y: 360 * scaleY },
    { id: 10, name: 'Hostel A', x: 370 * scaleX, y: 450 * scaleY },
    { id: 11, name: 'Hostel B', x: 180 * scaleX, y: 490 * scaleY },
    { id: 12, name: 'Innovation Hub', x: 520 * scaleX, y: 250 * scaleY },
  ];

  return campusNodes.map((node) => ({
    ...node,
    x: Math.round(node.x),
    y: Math.round(node.y),
  }));
}

/**
 * Benchmark Presets Registry
 */
export const PRESETS = [
  { id: 'campus', label: 'College Campus (12 Nodes)', count: 12, generator: (w, h) => getCampusPreset(w, h) },
  { id: 'random-15', label: 'Random (15 Nodes)', count: 15, generator: (w, h) => generateRandomCities(15, w, h) },
  { id: 'random-25', label: 'Random (25 Nodes)', count: 25, generator: (w, h) => generateRandomCities(25, w, h) },
  { id: 'circle-16', label: 'Circular Challenge (16 Nodes)', count: 16, generator: (w, h) => generateCircleCities(16, w, h) },
  { id: 'clusters-16', label: 'Regional Clusters (16 Nodes)', count: 16, generator: (w, h) => generateClusteredCities(w, h) },
];
