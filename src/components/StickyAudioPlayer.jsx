import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings,
  X,
  ChevronDown,
  Check,
  Minus,
  Plus
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
  onClose,
  selectedQari = 'al-afasy',
  onQariChange,
  translationLanguage = 'mal',
  audioTypes = ['quran'], // Array of selected audio types
  onAudioTypesChange,
  playbackSpeed = 1.0,
  onPlaybackSpeedChange
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const isUpdatingAudioTypes = useRef(false);

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

  // Apply playback speed to audio element
  useEffect(() => {
    if (audioElement) {
      audioElement.playbackRate = playbackSpeed;
    }
  }, [audioElement, playbackSpeed]);

  const reciters = [
    { value: 'al-afasy', label: 'Mishari Rashid al-`Afasy' },
    { value: 'al-ghamidi', label: 'Saad Al Ghamidi' },
    { value: 'al-hudaify', label: 'Al-Hudaify' }
  ];

  const audioTypeOptions = [
    { value: 'quran', label: 'Quran', description: 'Play Quran audio' },
    { value: 'translation', label: 'Translation', description: 'Play Translation audio' },
    { value: 'interpretation', label: 'Interpretation', description: 'Play Interpretation audio' }
  ];

  // Filter audio types based on language - only show Translation and Interpretation for Malayalam
  const availableAudioTypes = translationLanguage === 'mal' 
    ? audioTypeOptions 
    : audioTypeOptions.filter(type => type.value === 'quran');

  const handlePlaybackSpeedDecrease = () => {
    const newSpeed = Math.max(0.5, playbackSpeed - 0.1);
    if (onPlaybackSpeedChange) {
      onPlaybackSpeedChange(Math.round(newSpeed * 10) / 10);
    }
  };

  const handlePlaybackSpeedIncrease = () => {
    const newSpeed = Math.min(2.0, playbackSpeed + 0.1);
    if (onPlaybackSpeedChange) {
      onPlaybackSpeedChange(Math.round(newSpeed * 10) / 10);
    }
  };

  // Debug: trace modal state changes
  useEffect(() => {
}, [showSettingsModal]);

  // Debug: trace audioTypes prop changes
  useEffect(() => {
}, [audioTypes]);

  // Keep modal open when audio types change
  useEffect(() => {
    // If modal was open and audio types changed, ensure it stays open
    if (showSettingsModal && isUpdatingAudioTypes.current) {
      // Modal should remain open - no action needed
      isUpdatingAudioTypes.current = false;
}
  }, [audioTypes, showSettingsModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on settings button or its children
      if (event.target.closest('.settings-menu') || event.target.closest('.settings-button')) {
        return;
      }
      
      if (showReciterDropdown && !event.target.closest('.reciter-dropdown')) {
        setShowReciterDropdown(false);
}
      // Do NOT auto-close settings modal via document click. The modal already
      // has an overlay click and an explicit close button; keeping it open
      // during interactions allows selecting multiple audio options.
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showReciterDropdown, showSettingsModal]);

  const selectedReciter = reciters.find(r => r.value === selectedQari) || reciters[0];

  if (!currentAyah) return null;

  useEffect(() => {
    console.log("[StickyAudioPlayer] Props update", {
      isPlaying,
      currentAyah,
      totalAyahs,
      selectedQari,
      translationLanguage,
      audioTypes,
      playbackSpeed
    });
  }, [isPlaying, currentAyah, totalAyahs, selectedQari, translationLanguage, audioTypes, playbackSpeed]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white to-gray-50 dark:from-[#1a1c24] dark:to-[#2A2C38] border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50">
      <div className="max-w-[1024px] mx-auto">
        {/* Title/Label */}
        <div className="px-3 sm:px-6 pt-2 pb-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide uppercase">
            Audio play
          </p>
        </div>

        {/* Main Container with Progress and Controls */}
        <div className="px-3 sm:px-6 pb-4">
          {/* Progress Bar */}
          <div className="relative cursor-pointer mb-4 group" onClick={handleProgressClick}>
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            {/* Progress Handle */}
            <div
              className="absolute top-1/2 w-3 h-3 bg-white dark:bg-gray-200 border-2 border-cyan-500 dark:border-cyan-400 rounded-full transform -translate-y-1/2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left - Current Time */}
            <div className="text-xs sm:text-sm font-semibold font-mono text-gray-700 dark:text-gray-300 min-w-[45px] sm:min-w-[50px]">
              {formatTime(currentTime)}
            </div>

            {/* Center - Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Settings Button */}
              <div className="relative settings-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettingsModal(!showSettingsModal);
                  }}
                  className="p-2 sm:p-2.5 text-gray-600 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-all rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 settings-button"
                  aria-label="Settings"
                  title="Settings"
                >
                  <Settings size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Volume Button */}
              <div className="relative hidden sm:block">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="p-2 sm:p-2.5 text-gray-600 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 transition-all rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
                </button>
                
                {/* Volume Slider */}
                {showVolumeSlider && (
                  <div 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl p-4 z-10"
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
                      className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-cyan-400 [&::-moz-range-thumb]:to-cyan-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Previous Button */}
              <button
                onClick={onSkipBack}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Previous"
                title="Previous"
              >
                <SkipBack size={18} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={() => {
                  console.log("[StickyAudioPlayer] PlayPause clicked", { isPlaying });
                  onPlayPause();
                }}
                className="p-3 sm:p-3.5 bg-gradient-to-br from-cyan-500 to-cyan-600 dark:from-cyan-500 dark:to-cyan-400 text-white rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                aria-label={isPlaying ? "Pause" : "Play"}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} className="sm:w-6 sm:h-6" fill="currentColor" /> : <Play size={20} className="sm:w-6 sm:h-6" fill="currentColor" />}
              </button>

              {/* Next Button */}
              <button
                onClick={onSkipForward}
                className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Next"
                title="Next"
              >
                <SkipForward size={18} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose || onStop}
                className="p-2 sm:p-2.5 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-all rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close"
                title="Close"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Right - Duration */}
            <div className="text-xs sm:text-sm font-semibold font-mono text-gray-700 dark:text-gray-300 min-w-[45px] sm:min-w-[50px] text-right">
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 modal-backdrop"
            onClick={(e) => {
              // Only close if clicking directly on the backdrop element and not updating audio types
              if (e.target === e.currentTarget && !isUpdatingAudioTypes.current) {
setShowSettingsModal(false);
              }
            }}
          ></div>
          <div 
            className="relative z-[1001] bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-md settings-modal"
            onClick={(e) => {
              // Prevent any clicks inside modal from bubbling to backdrop
              e.stopPropagation();
              // Debug container click
              if (process.env.NODE_ENV !== 'production') {
}
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Settings</h2>
              <button
                onClick={() => {
setShowSettingsModal(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Select Audio Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Audio Options
                </h3>
                <div className="space-y-2">
                  {availableAudioTypes.map((type) => {
                    const isSelected = audioTypes.includes(type.value);
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Prevent modal from closing during audio type update
                          isUpdatingAudioTypes.current = true;
                          
                          if (onAudioTypesChange) {
                            // Toggle selection: if already selected, remove it; otherwise add it
                            const newAudioTypes = isSelected
                              ? audioTypes.filter(t => t !== type.value)
                              : [...audioTypes, type.value];
                            
                            // Ensure at least one is selected (prevent empty array)
                            if (newAudioTypes.length > 0) {
onAudioTypesChange(newAudioTypes);
                            }
                          }
                          
                          // Reset flag after a short delay to allow re-render to complete
                          setTimeout(() => {
                            isUpdatingAudioTypes.current = false;
}, 100);
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 ${
                            isSelected
                              ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-500 dark:bg-cyan-400'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}>
                            {isSelected && (
                              <Check size={12} className="text-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Audio Settings
                </h3>
                
                {/* Reciter Dropdown */}
                {audioTypes.includes('quran') && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reciter
                    </label>
                    <div className="relative reciter-dropdown">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowReciterDropdown(!showReciterDropdown);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
                      >
                        <span className="text-sm text-gray-900 dark:text-white">
                          {selectedReciter.label}
                        </span>
                        <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                      
                      {showReciterDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {reciters.map((reciter) => (
                            <button
                              key={reciter.value}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onQariChange) {
                                  onQariChange(reciter.value);
                                }
                                setShowReciterDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                selectedQari === reciter.value
                                  ? 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                                  : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              {reciter.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Playback Speed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Playback Speed
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlaybackSpeedDecrease();
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      disabled={playbackSpeed <= 0.5}
                    >
                      <Minus size={16} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {playbackSpeed.toFixed(1)}x
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlaybackSpeedIncrease();
                      }}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      disabled={playbackSpeed >= 2.0}
                    >
                      <Plus size={16} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyAudioPlayer;

