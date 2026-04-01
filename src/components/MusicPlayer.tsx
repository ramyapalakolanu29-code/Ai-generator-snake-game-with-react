import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "0x01_NEON_HORIZON",
    artist: "SYS.AUDIO",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "0x02_CYBER_DREAM",
    artist: "SYS.AUDIO",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "0x03_DIGITAL_OVR",
    artist: "SYS.AUDIO",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = 0.5;
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio play failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
    setProgress(percentage * 100);
  };

  return (
    <div className="bg-black p-6 border-4 border-fuchsia-500 shadow-[8px_8px_0px_#0ff] flex flex-col h-full w-full max-w-md relative">
      <div className="absolute top-0 right-0 w-full h-1 bg-fuchsia-500 opacity-50 animate-pulse"></div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-fuchsia-500 flex items-center justify-center shrink-0 border-2 border-white">
          <span className="text-black font-pixel text-xs">WAV</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-pixel text-xs truncate mb-2">
            {currentTrack.title}
          </h3>
          <p className="text-cyan-500 text-sm font-vt truncate">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div 
          className="h-4 bg-gray-900 cursor-pointer relative border-2 border-fuchsia-500"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-cyan-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-10 font-pixel text-xs">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`hover:text-white transition-colors ${isMuted ? 'text-fuchsia-500' : 'text-cyan-500'}`}
        >
          [{isMuted ? 'MUTE' : 'VOL'}]
        </button>

        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="text-cyan-500 hover:text-white transition-colors"
          >
            {'<<'}
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-fuchsia-500 hover:text-white transition-colors text-lg"
          >
            {isPlaying ? '[ || ]' : '[ > ]'}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-cyan-500 hover:text-white transition-colors"
          >
            {'>>'}
          </button>
        </div>
        
        <div className="w-12"></div> {/* Spacer for balance */}
      </div>

      {/* Playlist */}
      <div className="mt-auto">
        <h4 className="text-xs font-pixel text-fuchsia-500 mb-4">AUDIO_BUFFER</h4>
        <div className="space-y-2 font-vt text-lg">
          {TRACKS.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`flex items-center justify-between p-2 cursor-pointer border-l-4 transition-all ${
                index === currentTrackIndex 
                  ? 'bg-fuchsia-500 text-black border-white' 
                  : 'border-transparent text-cyan-500 hover:bg-gray-900 hover:border-cyan-500'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="opacity-50 shrink-0">0{index + 1}</span>
                <span className="truncate">{track.title}</span>
              </div>
              {index === currentTrackIndex && isPlaying ? (
                <span className="animate-pulse shrink-0">PLAYING</span>
              ) : (
                <span className="opacity-50 shrink-0">{track.duration}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
