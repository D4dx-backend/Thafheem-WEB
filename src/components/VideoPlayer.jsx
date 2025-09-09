import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Volume2 } from 'lucide-react';
import forwardIcon from "../assets/forward.png"
import BackwardIcon from "../assets/backward.png"
const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(9);
  const [duration] = useState(1200);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      setCurrentTime(Math.max(0, Math.min(newTime, duration)));
    }
  };

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10));
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => interval && clearInterval(interval);
  }, [isPlaying, duration]);

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="w-[350px] sm:w-full max-w-[933px] mx-auto bg-[#D9D9D9] rounded-lg overflow-hidden shadow-lg">
      
      {/* Video Display */}
      <div className="w-full h-[222px] sm:h-48 md:h-56 lg:h-64 xl:h-72 bg-[#D9D9D9] dark:bg-[#434343] flex items-center justify-center">
        {/* <div className="text-gray-600 text-base sm:text-lg">Video Preview Area</div> */}
      </div>

      {/* Controls */}
      <div className="bg-[#D9D9D9] p-3 dark:bg-[#434343]">
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div
            ref={progressRef}
            className="w-full sm:h-[3px] h-[3px] bg-white dark:bg-[#323A3F] rounded-full cursor-pointer relative touch-manipulation"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-black rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-black rounded-full shadow-md"
              style={{ left: `${progressPercentage}%`, marginLeft: '-10px' }}
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm font-mono text-gray-700 min-w-[32px]">
            {formatTime(currentTime)}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-300 rounded dark:hover:bg-transparent">
              <Volume2 size={18} className="text-gray-700 dark:text-black" />
            </button>

            <button onClick={skipForward} className="p-2 hover:bg-gray-300 rounded dark:hover:bg-transparent flex items-center space-x-1">
  <img src={BackwardIcon} alt="Forward" className="sm:w-5 w-[16px] sm:h-5 h-[16px]" />
  <img src={BackwardIcon} alt="Forward" className="sm:w-5 w-[16px] sm:h-5 h-[16px]" />
</button>


            <button
              onClick={togglePlayPause}
              className="p-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-sm"
            >
              {isPlaying ? (
                <Pause size={20} className="text-gray-700 dark:text-white" />
              ) : (
                <Play size={20} className="text-gray-700 dark:text-white" />
              )}
            </button>

            <button onClick={skipForward} className="p-2 hover:bg-gray-300 rounded dark:hover:bg-transparent flex items-center space-x-1">
  <img src={forwardIcon} alt="Forward" className="sm:w-5 w-[16px] sm:h-5 h-[16px]" />
  <img src={forwardIcon} alt="Forward" className="sm:w-5 w-[16px] sm:h-5 h-[16px]" />
</button>


          </div>

          <div className="text-xs sm:text-sm font-mono text-gray-700 min-w-[32px] text-right">
            {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
