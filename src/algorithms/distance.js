/**
 * @file distance.js
 * @description Euclidean distance and closed-loop tour distance calculations for the Travelling Salesperson Problem.
 * @authors Nisarg Jayesh Delvadiya, Rishan Mazumdar
 */

/**
 * Calculates the Euclidean distance between two 2D coordinates.
 * Formula: d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
 *
 * @param {{x: number, y: number}} pointA
 * @param {{x: number, y: number}} pointB
 * @returns {number} Distance in 2D Euclidean units
 */
export function calculateEuclideanDistance(pointA, pointB) {
  if (!pointA || !pointB) return 0;
  const deltaX = Number(pointA.x) - Number(pointB.x);
  const deltaY = Number(pointA.y) - Number(pointB.y);
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calculates the total length of a closed-loop tour visiting cities in the given index order,
 * returning back to the starting city.
 *
 * @param {number[]} order Array of city indices representing the tour permutation
 * @param {Array<{x: number, y: number}>} cities Array of city coordinate objects
 * @returns {number} Total circular path distance
 */
export function calculateTourDistanceByIndices(order, cities) {
  if (!order || !cities || order.length < 2 || cities.length < 2) return 0;

  let totalDistance = 0;
  const nodeCount = order.length;

  for (let i = 0; i < nodeCount; i++) {
    const currentCity = cities[order[i]];
    const nextCity = cities[order[(i + 1) % nodeCount]];
    if (currentCity && nextCity) {
      totalDistance += calculateEuclideanDistance(currentCity, nextCity);
    }
  }

  return totalDistance;
}

/**
 * Normalizes a floating-point distance to 2 decimal places.
 *
 * @param {number} distance Raw distance value
 * @returns {number} Rounded distance
 */
export function roundDistance(distance) {
  if (!Number.isFinite(distance) || distance < 0) return 0;
  return Math.round(distance * 100) / 100;
}
