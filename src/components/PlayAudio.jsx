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

const PlayAudio = ({ audioSrc, title, onClose, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play();
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      // Stop audio when component unmounts (navigating away)
      audio.pause();
      audio.src = '';
      audio.currentTime = 0;
    };
  }, [audioSrc, autoPlay]);

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

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(newVolume);
    audio.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const menuOptions = [
    { label: 'Download', action: () => console.log('Download') },
    { label: 'Share', action: () => console.log('Share') },
    { label: 'Add to Playlist', action: () => console.log('Add to Playlist') },
    { label: 'Repeat', action: () => console.log('Toggle Repeat') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />
      
      {/* Main Player Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left - Current Time */}
        <div className="text-sm font-mono text-gray-600 w-16">
          {formatTime(currentTime)}
        </div>

        {/* Center - Controls */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.action();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {/* Volume Slider */}
            {showVolumeSlider && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer volume-slider"
                />
              </div>
            )}
          </div>

          {/* Previous Button */}
          <button
            onClick={handleSkipBack}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
          >
            <SkipBack size={20} />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-3 bg-black hover:bg-gray-700 text-white rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Next Button */}
          <button
            onClick={handleSkipForward}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
          >
            <SkipForward size={20} />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right - Duration */}
        <div className="text-sm font-mono text-gray-600 w-16 text-right">
          {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-black rounded-full transition-all duration-200"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          {/* Progress Handle */}
          <div
            className="absolute top-1/2 w-3 h-3 bg-black rounded-full transform -translate-y-1/2 cursor-pointer"
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Track Info (if title provided) */}
      {title && (
        <div className="px-6 pb-2">
          <p className="text-sm text-gray-700 truncate">{title}</p>
        </div>
      )}

    </div>
  );
};

export default PlayAudio;