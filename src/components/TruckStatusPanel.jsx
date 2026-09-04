import React from 'react';
import { Play, Pause, RotateCcw, Truck } from 'lucide-react';
import { routeData } from '../data/route';

const TruckStatusPanel = ({ 
  currentLegIndex,
  distanceCovered, 
  totalDistance,
  nextStop, 
  completedStops, 
  totalStops, 
  isPaused, 
  isFinished
}) => {
  // Derive status text
  let statusText = "";
  if (isFinished) {
    const finalDestination = routeData[routeData.length - 1].name;
    statusText = `Arrived at ${finalDestination}`;
  } else if (routeData[currentLegIndex] && routeData[currentLegIndex + 1]) {
    statusText = `Moving towards ${routeData[currentLegIndex + 1].name}`;
  }

  const remainingDistance = Math.max(0, totalDistance - distanceCovered);
  const etaMinutes = isFinished ? 0 : Math.ceil((remainingDistance / 40) * 60);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-[320px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-5 z-[1000] border border-white/20 dark:border-slate-700/50">
      
      {/* Primary Status (Visual Hierarchy Focus) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Truck size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Live Status</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
          {statusText}
        </h2>
        {isPaused && !isFinished && (
          <span className="inline-block mt-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
            PAUSED
          </span>
        )}
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {/* Distance */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Distance</span>
          <span className="text-base font-bold text-slate-700 dark:text-slate-200">
            {distanceCovered.toFixed(1)} <span className="text-xs font-medium text-slate-400">km</span>
          </span>
        </div>
        
        {/* Progress */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
          <span className="text-base font-bold text-slate-700 dark:text-slate-200">
            {completedStops} / {totalStops}
          </span>
        </div>

        {/* Next Stop */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Next Stop</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">
            {nextStop || "—"}
          </span>
        </div>

        {/* ETA */}
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ETA</span>
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
            {isFinished ? "—" : `${etaMinutes} min`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TruckStatusPanel;
