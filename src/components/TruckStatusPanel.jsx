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
  isFinished, 
  onPause, 
  onResume, 
  onReset 
}) => {
  // Derive status text
  let statusText = "";
  if (isFinished) {
    const finalDestination = routeData[routeData.length - 1].name;
    statusText = `Arrived at ${finalDestination}`;
  } else if (routeData[currentLegIndex] && routeData[currentLegIndex + 1]) {
    statusText = `Between ${routeData[currentLegIndex].name} → ${routeData[currentLegIndex + 1].name}`;
  }

  // Calculate ETA
  // ETA = remaining distance (km) / speed (40 km/h) = hours
  // hours * 60 = minutes
  const remainingDistance = Math.max(0, totalDistance - distanceCovered);
  const etaMinutes = isFinished ? 0 : Math.ceil((remainingDistance / 40) * 60);

  return (
    <div className="absolute bottom-[10px] right-[10px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-6 w-[calc(100%-20px)] md:w-[340px] z-[1000] border border-gray-100/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between mb-4 md:mb-5 pb-3 md:pb-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Truck size={24} />
          <h2 className="font-bold text-lg tracking-tight">TRUCK STATUS</h2>
        </div>
        
        <button 
          onClick={onReset}
          className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current</span>
          <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
            {statusText} {isPaused && !isFinished && <span className="text-orange-500 font-bold ml-1">(Paused)</span>}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Distance</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {distanceCovered.toFixed(1)} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">km</span>
            </span>
          </div>
          
          <div className="flex flex-col bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Completed</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {completedStops}/{totalStops}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-50 dark:border-indigo-800/30">
          <div className="flex flex-col overflow-hidden mr-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Next stop</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
              {nextStop || "Route Complete"}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">ETA</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              {etaMinutes} min
            </span>
          </div>
        </div>

        {/* Play/Pause Tracking Button */}
        {!isFinished && (
          <button 
            onClick={isPaused ? onResume : onPause}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-xl transition-colors font-semibold"
          >
            {isPaused ? (
              <>
                <Play size={16} fill="currentColor" /> Resume Tracking
              </>
            ) : (
              <>
                <Pause size={16} fill="currentColor" /> Pause Tracking
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TruckStatusPanel;
