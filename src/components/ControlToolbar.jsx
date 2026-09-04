import React from 'react';
import { Play, Pause, RotateCcw, Moon, Sun } from 'lucide-react';

const ControlToolbar = ({ isPaused, isFinished, isDarkMode, onPause, onResume, onReset, onToggleTheme }) => {
  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-slate-700/50 p-0.5 sm:p-1 flex items-center gap-0.5 sm:gap-1 z-[1000]">
      <button 
        onClick={onToggleTheme}
        className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      
      <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-0.5 sm:mx-1"></div>
      
      <button 
        onClick={isPaused ? onResume : onPause}
        disabled={isFinished}
        className={`p-1.5 sm:p-2 rounded-full transition-all ${
          isFinished 
            ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
            : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40'
        }`}
        title={isPaused ? "Resume Tracking" : "Pause Tracking"}
      >
        {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
      </button>
      
      <button 
        onClick={onReset}
        className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all"
        title="Reset Route"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default ControlToolbar;
