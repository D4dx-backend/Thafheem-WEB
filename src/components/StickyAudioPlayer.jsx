import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  MoreHorizontal, 
  X 
} from 'lucide-react';

const StickyAudioPlayer = ({ 
  audioElement, 
  isPlaying, 
  currentAyah, 
  totalAyahs,
  surahInfo,
  onPlayPause, 
  onStop, 
  onSkipBack, 
  onSkipForward,
  onClose 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Update current time from audio element
  useEffect(() => {
    if (!audioElement) {
      setCurrentTime(0);
      setDuration(0);
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioElement]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!audioElement || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    if (audioElement) {
      audioElement.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (!audioElement) return;

    if (isMuted) {
      audioElement.volume = volume;
      setIsMuted(false);
    } else {
      audioElement.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    
    if (audioElement) {
      audioElement.volume = newVolume;
    }
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const menuOptions = [
    { label: 'Download', action: () => console.log('Download') },
    { label: 'Share', action: () => console.log('Share') },
    { label: 'Add to Playlist', action: () => console.log('Add to Playlist') },
    { label: 'Repeat', action: () => console.log('Toggle Repeat') },
  ];

  if (!currentAyah) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2C38] border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      {/* Title/Label */}
      <div className="px-4 pt-2 pb-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Audio play
        </p>
      </div>

      {/* Main Container with Progress and Controls */}
      <div className="px-4 pb-3">
        {/* Progress Bar */}
        <div className="relative cursor-pointer mb-3" onClick={handleProgressClick}>
          <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full">
            <div
              className="h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full transition-all duration-200"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          {/* Progress Handle */}
          <div
            className="absolute top-1/2 w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full transform -translate-y-1/2 cursor-pointer"
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left - Current Time */}
          <div className="text-xs font-mono text-gray-800 dark:text-gray-200 w-14">
            {formatTime(currentTime)}
          </div>

          {/* Center - Controls */}
          <div className="flex items-center space-x-2">
            {/* Menu Button */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 transition-colors rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
              >
                <MoreHorizontal size={16} />
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-40 z-10">
                  {menuOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        option.action();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Button */}
            <div className="relative">
              <button
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="p-1.5 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 transition-colors rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              
              {/* Volume Slider */}
              {showVolumeSlider && (
                <div 
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-10"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer volume-slider"
                  />
                </div>
              )}
            </div>

            {/* Previous Button */}
            <button
              onClick={onSkipBack}
              className="p-1.5 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-center"
            >
              <SkipBack size={16} className="text-cyan-500 dark:text-cyan-400" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              className="p-2 bg-cyan-500 dark:bg-cyan-400 text-white dark:text-black rounded-full transition-colors shadow-md hover:shadow-lg hover:bg-cyan-600 dark:hover:bg-cyan-300"
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>

            {/* Next Button */}
            <button
              onClick={onSkipForward}
              className="p-1.5 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30 flex items-center justify-center"
            >
              <SkipForward size={16} className="text-cyan-500 dark:text-cyan-400" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose || onStop}
              className="p-1.5 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 transition-colors rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
            >
              <X size={16} />
            </button>
          </div>

          {/* Right - Duration */}
          <div className="text-xs font-mono text-gray-800 dark:text-gray-200 w-14 text-right">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          cursor: pointer;
        }
        .volume-slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default StickyAudioPlayer;

