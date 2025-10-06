// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Play, 
//   Pause, 
//   SkipBack, 
//   SkipForward, 
//   Volume2, 
//   VolumeX, 
//   MoreHorizontal, 
//   X 
// } from 'lucide-react';
// import ForwardIcon from '../assets/forward.png';
// import BackwardIcon from '../assets/backward.png';

// const QuranStudyPlay = ({ audioSrc, title, onClose, autoPlay = false }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showVolumeSlider, setShowVolumeSlider] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
  
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration);
//       if (autoPlay) {
//         audio.play();
//         setIsPlaying(true);
//       }
//     };

//     const handleTimeUpdate = () => {
//       setCurrentTime(audio.currentTime);
//     };

//     const handleEnded = () => {
//       setIsPlaying(false);
//       setCurrentTime(0);
//     };

//     audio.addEventListener('loadedmetadata', handleLoadedMetadata);
//     audio.addEventListener('timeupdate', handleTimeUpdate);
//     audio.addEventListener('ended', handleEnded);

//     return () => {
//       audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       audio.removeEventListener('timeupdate', handleTimeUpdate);
//       audio.removeEventListener('ended', handleEnded);
//     };
//   }, [audioSrc, autoPlay]);

//   const formatTime = (time) => {
//     if (isNaN(time)) return "00:00";
    
//     const hours = Math.floor(time / 3600);
//     const minutes = Math.floor((time % 3600) / 60);
//     const seconds = Math.floor(time % 60);

//     if (hours > 0) {
//       return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     }
//     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   const togglePlayPause = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isPlaying) {
//       audio.pause();
//     } else {
//       audio.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleSkipBack = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     audio.currentTime = Math.max(0, audio.currentTime - 10);
//   };

//   const handleSkipForward = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
//     audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
//   };

//   const toggleMute = () => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (isMuted) {
//       audio.volume = volume;
//       setIsMuted(false);
//     } else {
//       audio.volume = 0;
//       setIsMuted(true);
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     const audio = audioRef.current;
//     if (!audio) return;

//     setVolume(newVolume);
//     audio.volume = newVolume;
//     setIsMuted(newVolume === 0);
//   };

//   const menuOptions = [
//     { label: 'Download', action: () => console.log('Download') },
//     { label: 'Share', action: () => console.log('Share') },
//     { label: 'Add to Playlist', action: () => console.log('Add to Playlist') },
//     { label: 'Repeat', action: () => console.log('Toggle Repeat') },
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2C38] shadow-lg z-50">
//       <audio
//         ref={audioRef}
//         src={audioSrc}
//         preload="metadata"
//       />
      
//       {/* Progress Bar */}
//       <div className="px-4 lg:px-6 pb-4">
//         <div className="relative">
//           <div className="w-full h-1 bg-gray-200 rounded-full">
//             <div
//               className="h-1 bg-black rounded-full transition-all duration-200"
//               style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
//             />
//           </div>
//           {/* Progress Handle */}
//           <div
//             className="absolute top-1/2 w-3 h-3 bg-black rounded-full transform -translate-y-1/2 cursor-pointer"
//             style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
//           />
//         </div>
//       </div>

//       {/* Main Player Bar */}
//       <div className="flex items-center justify-between px-4 lg:px-6 py-4 h-[60px]">
        
//         {/* Left - Current Time */}
//         <div className="text-xs lg:text-sm font-mono text-black w-12 lg:w-16 dark:text-white">
//           {formatTime(currentTime)}
//         </div>

//         {/* Center - Controls */}
//         <div className="flex items-center space-x-2 lg:space-x-4">
//           {/* Menu Button - Hidden on small screens */}
//           <div className="relative hidden sm:block">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="p-2 text-black hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white"
//             >
//               <MoreHorizontal size={18} />
//             </button>
            
//             {/* Dropdown Menu */}
//             {showMenu && (
//               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-40">
//                 {menuOptions.map((option, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       option.action();
//                       setShowMenu(false);
//                     }}
//                     className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#1A1C28] transition-colors"
//                   >
//                     {option.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Volume Button - Hidden on small screens */}
//           <div className="relative hidden sm:block">
//             <button
//               onClick={() => setShowVolumeSlider(!showVolumeSlider)}
//               onMouseEnter={() => setShowVolumeSlider(true)}
//               className="p-2 text-gray-600 bg-[#D9D9D9] hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white dark:bg-[#1A1C28]"
//             >
//               {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
//             </button>
            
//             {/* Volume Slider */}
//             {showVolumeSlider && (
//               <div 
//                 className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3"
//                 onMouseLeave={() => setShowVolumeSlider(false)}
//               >
//                 <input
//                   type="range"
//                   min="0"
//                   max="1"
//                   step="0.1"
//                   value={isMuted ? 0 : volume}
//                   onChange={handleVolumeChange}
//                   className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer volume-slider"
//                 />
//               </div>
//             )}
//           </div>

//           {/* Previous Button */}
//           <button
//   onClick={handleSkipBack}
//   className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1C28] flex items-center justify-center"
// >
//   <img
//     src={BackwardIcon}
//     alt="Forward"
//     className="w-5 h-5 object-contain"
//   />
//   <img
//     src={BackwardIcon}
//     alt="Forward"
//     className="w-5 h-5 object-contain"
//   />
// </button>

//           {/* Play/Pause Button */}
//           <button
//             onClick={togglePlayPause}
//             className="p-2 lg:p-3 bg-gray-100 dark:bg-[#1A1C28] text-black dark:text-white rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-[#0F1117]"
//           >
//             {isPlaying ? <Pause size={18} /> : <Play size={18} />}
//           </button>

//           {/* Next Button */}
 

//           <button
//   onClick={handleSkipForward}
//   className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1C28] flex items-center justify-center"
// >
//   <img
//     src={ForwardIcon}
//     alt="Forward"
//     className="w-5 h-5 object-contain"
//   />
//   <img
//     src={ForwardIcon}
//     alt="Forward"
//     className="w-5 h-5 object-contain"
//   />
// </button>




//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="p-2 text-black hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-[#1A1C28]"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Right - Duration */}
//         <div className="text-xs lg:text-sm font-mono text-black w-12 lg:w-16 text-right dark:text-white">
//           {formatTime(duration)}
//         </div>
//       </div>

//       {/* Track Info (if title provided) */}
//       {title && (
//         <div className="px-4 lg:px-6 pb-2">
//           <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 truncate">{title}</p>
//         </div>
//       )}

//       <style jsx>{`
//         .volume-slider::-webkit-slider-thumb {
//           appearance: none;
//           height: 12px;
//           width: 12px;
//           border-radius: 50%;
//           background: black;
//           cursor: pointer;
//         }
//         .volume-slider::-moz-range-thumb {
//           height: 12px;
//           width: 12px;
//           border-radius: 50%;
//           background: #3b82f6;
//           cursor: pointer;
//           border: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default QuranStudyPlay;


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
import ForwardIcon from '../assets/forward.png';
import BackwardIcon from '../assets/backward.png';
const QuranStudyPlay = ({ audioSrc, title, onClose, autoPlay = false, isMobile = false }) => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2C38] border-t border-gray-200 shadow-lg z-50 h-[90px]">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
      />
      
      {/* Progress Bar */}
      <div className="px-4 sm:px-6 pb-4">
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

      {/* Main Player Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 min-h-[60px]">
        
        {/* Left - Current Time */}
        <div className="text-xs sm:text-sm font-mono text-black w-12 sm:w-16 dark:text-white">
          {formatTime(currentTime)}
        </div>

        {/* Center - Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Menu Button - Hidden on mobile */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-black hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white"
            >
              <MoreHorizontal size={20} />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-40">
                {menuOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      option.action();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
              className="p-1.5 sm:p-2 text-gray-600 bg-[#D9D9D9] hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white dark:bg-gray-600"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} className="sm:w-5 sm:h-5" /> : <Volume2 size={16} className="sm:w-5 sm:h-5" />}
            </button>
            
            {/* Volume Slider */}
            {showVolumeSlider && (
              <div 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer volume-slider"
                />
              </div>
            )}
          </div>

          {/* Previous Button */}
          <button
  onClick={handleSkipBack}
  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1C28] flex items-center justify-center"
>
  <img
    src={BackwardIcon}
    alt="Forward"
    className="w-5 h-5 object-contain"
  />
  <img
    src={BackwardIcon}
    alt="Forward"
    className="w-5 h-5 object-contain"
  />
</button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="p-2 sm:p-3 bg-white text-black rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
          </button>

          {/* Next Button */}
          <button
  onClick={handleSkipForward}
  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1C28] flex items-center justify-center"
>
  <img
    src={ForwardIcon}
    alt="Forward"
    className="w-5 h-5 object-contain"
  />
  <img
    src={ForwardIcon}
    alt="Forward"
    className="w-5 h-5 object-contain"
  />
</button>


          {/* Close Button - Only show on mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-black hover:text-gray-800 transition-colors rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Right - Duration */}
        <div className="text-xs sm:text-sm font-mono text-black w-12 sm:w-16 text-right dark:text-white">
          {formatTime(duration)}
        </div>
      </div>

      {/* Track Info (if title provided) */}
      {title && (
        <div className="px-4 sm:px-6 pb-2">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{title}</p>
        </div>
      )}

    </div>
  );
};

export default QuranStudyPlay;