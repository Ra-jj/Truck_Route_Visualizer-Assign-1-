import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDistance, interpolateCoordinates } from '../utils/geo';

const TICK_RATE_MS = 100; // How often the simulation updates
const LEG_DURATION_MS = 8000; // How long a single leg takes (8 seconds)
const PROGRESS_PER_TICK = TICK_RATE_MS / LEG_DURATION_MS;

export function useTruckSimulation(route) {
  // We need at least 2 points for a route
  const isValidRoute = route && route.length >= 2;

  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalStops = isValidRoute ? route.length - 1 : 0;
  const isFinished = currentLegIndex >= totalStops;

  // Track coordinates and stats
  const [currentPosition, setCurrentPosition] = useState(
    isValidRoute ? { lat: route[0].lat, lng: route[0].lng } : { lat: 0, lng: 0 }
  );
  
  const [distanceCovered, setDistanceCovered] = useState(0);
  const completedStops = Math.min(currentLegIndex, totalStops);
  
  // Calculate the next stop name
  const nextStop = isFinished ? null : route[currentLegIndex + 1]?.name;

  // We use a ref to hold the timer interval
  const timerRef = useRef(null);

  // Pre-calculate leg distances to optimize performance
  const legDistances = useRef([]);
  useEffect(() => {
    if (isValidRoute) {
      const distances = [];
      for (let i = 0; i < route.length - 1; i++) {
        distances.push(
          calculateDistance(route[i].lat, route[i].lng, route[i+1].lat, route[i+1].lng)
        );
      }
      legDistances.current = distances;
    }
  }, [route, isValidRoute]);

  const tick = useCallback(async () => {
    if (!isValidRoute || isPaused || isFinished) return;

    // Simulate an async API ping by awaiting a short timeout
    await new Promise(resolve => setTimeout(resolve, 0));
    const timestamp = Date.now();

    setProgress(prev => {
      let nextProgress = prev + PROGRESS_PER_TICK;
      
      if (nextProgress >= 1) {
        // Leg completed, move to next leg
        nextProgress = 0;
        setCurrentLegIndex(prevIndex => Math.min(prevIndex + 1, totalStops));
      }
      
      return nextProgress;
    });
  }, [isValidRoute, isPaused, isFinished]);

  // Main simulation loop
  useEffect(() => {
    if (!isPaused && !isFinished) {
      timerRef.current = setInterval(tick, TICK_RATE_MS);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, isFinished, tick]);

  // Update position and distance whenever progress or leg changes
  useEffect(() => {
    if (!isValidRoute || isFinished) return;

    const startPoint = route[currentLegIndex];
    const endPoint = route[currentLegIndex + 1];

    if (!startPoint || !endPoint) return;

    // 1. Update position via LERP
    const newPos = interpolateCoordinates(startPoint, endPoint, progress);
    setCurrentPosition(newPos);

    // 2. Calculate Distance
    let totalDist = 0;
    // Sum fully completed legs
    for (let i = 0; i < currentLegIndex; i++) {
      totalDist += legDistances.current[i] || 0;
    }
    // Add partial distance for current leg
    const currentLegTotalDist = legDistances.current[currentLegIndex] || 0;
    totalDist += currentLegTotalDist * progress;
    
    setDistanceCovered(totalDist);

  }, [currentLegIndex, progress, route, isFinished, isValidRoute]);

  // Calculate total route distance
  const totalRouteDistance = useRef(0);
  useEffect(() => {
    if (legDistances.current.length > 0) {
      totalRouteDistance.current = legDistances.current.reduce((acc, dist) => acc + dist, 0);
    }
  }, [legDistances.current]);

  // Control functions
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);
  const reset = () => {
    setIsPaused(false);
    setCurrentLegIndex(0);
    setProgress(0);
    setCurrentPosition({ lat: route[0].lat, lng: route[0].lng });
    setDistanceCovered(0);
  };

  return {
    currentLegIndex,
    currentPosition,
    distanceCovered,
    totalDistance: totalRouteDistance.current,
    nextStop,
    completedStops,
    totalStops,
    isPaused,
    isFinished,
    pause,
    resume,
    reset
  };
}
