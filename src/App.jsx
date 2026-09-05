import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';


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
    <div className={`w-screen h-[100dvh] flex flex-col ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <main className="flex-1 w-full h-full relative">
        <MapComponent 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
        />
      </main>
    </div>
  );
}

export default App;
