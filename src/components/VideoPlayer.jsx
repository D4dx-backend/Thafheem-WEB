import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, SkipForward, Volume2,FastForward } from 'lucide-react';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(9); // Starting at 00:09 as shown in screenshot
  const [duration, setDuration] = useState(1200); // 20:00 in seconds
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      setCurrentTime(Math.max(0, Math.min(newTime, duration)));
    }
  };

  // Skip backward 10 seconds
  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  // Simulate time progression when playing
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="w-full  mx-auto bg-[#D9D9D9]  rounded-lg overflow-hidden shadow-lg">
      {/* Video Display Area */}
      <div className="w-full h-64 bg-[#D9D9D9] dark:bg-[#434343] flex items-center justify-center">
        <div className="text-gray-600 text-lg"></div>
      </div>
      
      {/* Controls Container */}
      <div className="bg-[#D9D9D9] p-4 dark:bg-[#434343]">
        {/* Progress Bar */}
        <div className="mb-4">
          <div 
            ref={progressRef}
            className="w-full h-2 bg-white dark:bg-[#323A3F] rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-black rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-md transition-all duration-100 ease-out"
              style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
            />
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Current Time */}
          <div className="text-sm font-mono text-gray-700 min-w-[40px]">
            {formatTime(currentTime)}
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {/* Volume */}
            <button className="p-2 hover:bg-gray-300 rounded transition-colors dark:hover:bg-transparent">
              <Volume2 size={20} className="text-gray-700 dark:text-black" />
            </button>
            
            {/* Skip Backward */}
            <button 
              onClick={skipBackward}
              className="p-2 hover:bg-gray-300 rounded transition-colors dark:hover:bg-transparent"
            >
              <Rewind size={20} className="text-gray-700 dark:text-black" />
            </button>
            
            {/* Play/Pause */}
            <button 
              onClick={togglePlayPause}
              className="p-3 hover:bg-gray-300 dark:hover:bg-transparent rounded-full transition-colors bg-white dark:bg-[#2A2C38] shadow-sm"
            >
              {isPlaying ? (
                <Pause size={24} className="text-gray-700 dark:text-white" />
              ) : (
                <Play size={24} className="text-gray-700 ml-0.5 dark:text-white" />
              )}
            </button>
            
            {/* Skip Forward */}
            <button 
              onClick={skipForward}
              className="p-2 hover:bg-gray-300 rounded transition-colors dark:hover:bg-transparent"
            >
              <FastForward size={20} className="text-gray-700 dark:text-black" />
            </button>
          </div>
          
          {/* Duration */}
          <div className="text-sm font-mono text-gray-700 min-w-[40px] text-right">
            {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;