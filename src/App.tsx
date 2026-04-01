import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-vt flex flex-col items-center justify-center p-4 overflow-hidden relative selection:bg-fuchsia-500 selection:text-black scanlines">
      <div className="static-noise"></div>
      
      <header className="mb-12 text-center z-10 screen-tear">
        <h1 className="text-2xl md:text-4xl font-pixel text-white glitch-text" data-text="SYS.CORE_DUMP">
          SYS.CORE_DUMP
        </h1>
        <div className="mt-4 bg-fuchsia-500 text-black px-4 py-1 font-pixel text-xs inline-block shadow-[4px_4px_0px_#0ff]">
          [ STATUS: OFFLINE // OVERRIDE: ACTIVE ]
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl z-10 items-center lg:items-stretch justify-center">
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <SnakeGame />
        </div>
        <div className="flex-1 w-full flex justify-center lg:justify-start">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
