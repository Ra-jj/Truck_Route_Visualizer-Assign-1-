import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`w-screen h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <main className="flex-1 w-full h-full relative">
        <MapComponent isDarkMode={isDarkMode} />
        
        {/* Dark Mode Toggle Bar */}
        <div className="absolute top-4 right-4 z-[1000]">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm font-semibold">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
