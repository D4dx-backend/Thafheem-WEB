import {
  Share2,
  Bookmark,
  Play,
  Heart,
  Info,
  LibraryBig,
  Notebook,
  ChevronDown,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import Bismi from "../assets/bismi.png";
import DarkModeBismi from "../assets/darkmode-bismi.png";
import { useTheme } from "../context/ThemeContext";
import { surahNameUnicodes } from "../components/surahNameUnicodes";
import {
  fetchArabicVerses,
  fetchSurahs,
  fetchPageRanges,
} from "../api/apifunction";

const QIRATHS = {
  "al-afasy": "QA",
  "al-ghamidi": "QG",
  "al-hudaify": "QH",
};

const Reading = () => {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageRanges, setPageRanges] = useState([]);
  const [selectedQirath, setSelectedQirath] = useState("al-afasy");
  const [showQirathDropdown, setShowQirathDropdown] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const currentAudioRef = useRef(null);
  const audioRefForCleanup = useRef(null); // Track audio for cleanup
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Generate audio URL for the selected Qirath, surah, and ayah
  const generateAudioUrl = (surahId, ayahId, qirathName, qirathCode) => {
    // Format: https://old.thafheem.net/audio/qirath/{qirathName}/{prefix}{surahId_3digit}_{ayahId_3digit}.ogg
    // Example: https://old.thafheem.net/audio/qirath/al-afasy/QA002_004.ogg
    const surahIdPadded = String(surahId).padStart(3, '0');
    const ayahIdPadded = String(ayahId).padStart(3, '0');
    
    // Use proxy in development to avoid CORS issues
    if (import.meta.env.DEV) {
      return `/api/audio/qirath/${qirathName}/${qirathCode}${surahIdPadded}_${ayahIdPadded}.ogg`;
    }
    
    return `https://old.thafheem.net/audio/qirath/${qirathName}/${qirathCode}${surahIdPadded}_${ayahIdPadded}.ogg`;
  };

  // Play next ayah in sequence
  const playAyahAtIndex = (index) => {
    if (index >= verses.length) {
      // All ayahs played, stop playback
      setIsPlaying(false);
      setCurrentAyah(null);
      setCurrentAyahIndex(0);
      setAudioElement(null);
      return;
    }

    // Stop any existing audio first
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.onended = null;
      audioElement.onerror = null;
    }

    const currentSurahId = parseInt(surahId) || 2;
    const qirathCode = QIRATHS[selectedQirath];
    const verse = verses[index];
    const ayahId = index + 1; // Since verse_number is undefined, use index + 1
    const audioUrl = generateAudioUrl(currentSurahId, ayahId, selectedQirath, qirathCode);
    
    // Create new audio element
    const audio = new Audio(audioUrl);
    
    // Set audio properties before adding event listeners
    audio.preload = 'none'; // Don't preload to avoid conflicts
    // Removed crossOrigin to avoid CORS issues
    
    setAudioElement(audio);
    currentAudioRef.current = audio;
    setCurrentAyah(ayahId);
    setCurrentAyahIndex(index);
    
    // Handle audio end - play next ayah
    audio.onended = () => {
      // Only continue if this is still the current audio element
      if (currentAudioRef.current === audio) {
        playAyahAtIndex(index + 1);
      }
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      console.error('Failed URL:', audioUrl);
      console.error('Audio element state:', audio);
      // Only continue if this is still the current audio element
      if (currentAudioRef.current === audio) {
        playAyahAtIndex(index + 1);
      }
    };
    
    // Play the audio with better error handling
    audio.play().then(() => {
      // Successfully started playing
    }).catch((error) => {
      // If it's an abort error (interrupted by another play), don't log as error
      if (error.name === 'AbortError') {
        // This is normal - happens when switching between ayahs
        // Don't log as error, just silently handle it
        return;
      }
      
      // Only log actual errors (not AbortErrors)
      console.error('Error playing audio:', error);
      console.error('Audio URL that failed:', audioUrl);
      
      // Handle CORS errors specifically
      if (error.name === 'NotSupportedError' || error.message.includes('CORS')) {
        console.error('CORS error - audio server does not allow cross-origin requests');
        // Try to continue to next ayah anyway
        setTimeout(() => {
          playAyahAtIndex(index + 1);
        }, 1000);
        return;
      }
      
      // For other errors, reset the state
      setIsPlaying(false);
      setCurrentAyah(null);
      setAudioElement(null);
      currentAudioRef.current = null;
    });
  };

  // Stop audio completely (reset to beginning)
  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentAyah(null);
    setCurrentAyahIndex(0);
    setAudioElement(null);
    currentAudioRef.current = null;
  };

  // Handle clicking on a specific ayah
  const handleAyahClick = (verseNumber) => {
    // Since verse_number is undefined, use array index + 1 as the ayah number
    const ayahIndex = parseInt(verseNumber) - 1; // Convert to 0-based index
    
    if (ayahIndex >= 0 && ayahIndex < verses.length) {
      // Stop any currently playing audio first and wait for it to stop
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.onended = null; // Remove the onended handler to prevent automatic continuation
        audioElement.onerror = null; // Remove error handlers
      }
      
      // Clear the current audio element reference
      setAudioElement(null);
      currentAudioRef.current = null;
      
      // Small delay to ensure the previous audio is properly stopped
      setTimeout(() => {
        // Set the current ayah first to update button text
        setCurrentAyah(parseInt(verseNumber));
        setCurrentAyahIndex(ayahIndex);
        
        // Start playing from the clicked ayah
        setIsPlaying(true);
        playAyahAtIndex(ayahIndex);
      }, 100);
    } else {
      console.error(`Invalid ayah index: ${ayahIndex} for verse number ${verseNumber}`);
      console.error(`Valid range: 1 to ${verses.length}`);
    }
  };

  // Handle audio playback
  const handlePlayAudio = () => {
    try {
      if (isPlaying) {
        // Pause playback but keep the current position
        if (audioElement) {
          audioElement.pause();
        }
        setIsPlaying(false);
        // Don't clear currentAyah or currentAyahIndex - keep them for resume
      } else {
        // Resume playback from current ayah or start from beginning
        if (currentAyahIndex > 0 || currentAyah) {
          // Resume from current position
          setIsPlaying(true);
          playAyahAtIndex(currentAyahIndex);
        } else {
          // Start from first ayah
          setIsPlaying(true);
          playAyahAtIndex(0);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentAyah(null);
      setAudioElement(null);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQirathDropdown && !event.target.closest('.qirath-dropdown')) {
        setShowQirathDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showQirathDropdown]);

  // Stop audio and clear highlight when Qirath changes
  useEffect(() => {
    if (isPlaying && audioElement) {
      stopAudio();
    }
  }, [selectedQirath]);

  // Cleanup audio when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      // Stop and clear audio on unmount - use refs to get current audio
      if (audioRefForCleanup.current) {
        audioRefForCleanup.current.pause();
        audioRefForCleanup.current.src = '';
        audioRefForCleanup.current.currentTime = 0;
        audioRefForCleanup.current.onended = null;
        audioRefForCleanup.current.onerror = null;
        audioRefForCleanup.current = null;
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
        currentAudioRef.current.currentTime = 0;
        currentAudioRef.current = null;
      }
    };
  }, []); // Only run on unmount
  
  // Update cleanup ref whenever audioElement changes
  useEffect(() => {
    audioRefForCleanup.current = audioElement;
  }, [audioElement]);

  // Stop audio when surah changes (but keep this separate from unmount cleanup)
  useEffect(() => {
    // Only run when surahId actually changes, not on initial mount
    return () => {
      if (audioElement) {
        stopAudio();
      }
    };
  }, [surahId]);

  // Fetch all verses for the surah
  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentSurahId = surahId || 2;

        // Fetch all verses, surah info, and page ranges
        const [versesData, surahsData, pageRangesData] = await Promise.all([
          fetchArabicVerses(currentSurahId),
          fetchSurahs(),
          fetchPageRanges(),
        ]);

        // Filter page ranges for current surah
        const surahPageRanges = pageRangesData.filter(
          (range) => range.SuraId === parseInt(currentSurahId)
        );

        setVerses(versesData);
        setSurahInfo(
          surahsData.find((s) => s.number === parseInt(currentSurahId))
        );
        setPageRanges(surahPageRanges);
      } catch (err) {
        console.error("Error fetching surah data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahData();
  }, [surahId]);

  // Function to get page number for a specific verse
  const getPageNumberForVerse = (verseNumber) => {
    const pageRange = pageRanges.find(
      (range) => verseNumber >= range.ayafrom && verseNumber <= range.ayato
    );
    return pageRange ? pageRange.PageId : null;
  };

  // Group verses by page
  const getVersesGroupedByPage = () => {
    const grouped = [];
    let currentPage = null;
    let currentGroup = [];

    verses.forEach((verse, index) => {
      const verseNumber = verse.verse_number || index + 1;
      const pageNumber = getPageNumberForVerse(verseNumber);

      if (pageNumber !== currentPage) {
        if (currentGroup.length > 0) {
          grouped.push({
            pageNumber: currentPage,
            verses: currentGroup,
            startVerse: currentGroup[0].verse_number,
            endVerse: currentGroup[currentGroup.length - 1].verse_number,
          });
        }
        currentPage = pageNumber;
        currentGroup = [{ ...verse, verse_number: verseNumber }];
      } else {
        currentGroup.push({ ...verse, verse_number: verseNumber });
      }
    });

    // Add last group
    if (currentGroup.length > 0) {
      grouped.push({
        pageNumber: currentPage,
        verses: currentGroup,
        startVerse: currentGroup[0].verse_number,
        endVerse: currentGroup[currentGroup.length - 1].verse_number,
      });
    }

    return grouped;
  };

  // Navigation functions
  const handlePreviousSurah = () => {
    const currentId = parseInt(surahId) || 2;
    const prevSurahId = currentId - 1;
    if (prevSurahId >= 1) {
      navigate(`/reading/${prevSurahId}`);
    }
  };

  const handleNextSurah = () => {
    const currentId = parseInt(surahId) || 2;
    const nextSurahId = currentId + 1;
    if (nextSurahId <= 114) {
      navigate(`/reading/${nextSurahId}`);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const kabahIcon = (
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white"
    >
      <path
        d="M7.04102 0.876953C7.21988 0.872433 7.35595 0.982913 7.41797 1.12012C7.47966 1.25677 7.47269 1.43054 7.36328 1.56934L7.36426 1.57031C7.17444 1.81689 7.07051 2.12551 7.07031 2.44629C7.07036 3.2205 7.65293 3.83008 8.36328 3.83008C8.62217 3.82971 8.87562 3.74502 9.08984 3.58887L9.17871 3.51758C9.32708 3.38317 9.52955 3.38964 9.66992 3.49219C9.81323 3.59692 9.88171 3.79048 9.81445 4.01172L9.81543 4.0127C9.54829 5.06733 8.66874 5.81651 7.63672 5.87305V6.23242C7.93786 6.71662 8.42031 7.12993 9 7.53223C9.29438 7.7365 9.61115 7.93618 9.9375 8.14062C10.2631 8.34461 10.5987 8.55402 10.9287 8.77441C12.2911 9.68443 13.5581 10.839 13.583 12.9795C13.5946 13.9776 13.3942 15.2962 12.499 16.4688H12.6113C13.1516 16.469 13.5839 16.9408 13.584 17.4961V18.6973C13.5847 18.8969 13.4503 19.0739 13.2607 19.1143L13.1768 19.123H1.28125C1.05037 19.1218 0.876181 18.9239 0.876953 18.6973V17.4961C0.877067 16.9411 1.3077 16.4688 1.84863 16.4688H11.3506C12.3649 15.6135 12.7489 14.3763 12.7715 12.9785C12.7985 11.2944 11.769 10.3685 10.4912 9.4873C10.1797 9.27251 9.86617 9.07874 9.55762 8.88965C9.24992 8.70108 8.94523 8.51673 8.65527 8.3252C8.11964 7.97136 7.62651 7.58501 7.22949 7.07812C6.8299 7.58748 6.31991 7.99159 5.77539 8.35449C5.48029 8.55117 5.17372 8.73767 4.86914 8.92285C4.56391 9.10843 4.26079 9.29321 3.96875 9.48828C2.79826 10.2702 1.70969 11.2034 1.68945 12.9824C1.67627 14.1447 1.98255 14.9624 2.30762 15.5225C2.45386 15.7601 2.35174 15.9993 2.18262 16.1104C2.09875 16.1654 1.99273 16.1939 1.88574 16.1729C1.77539 16.1511 1.67857 16.0793 1.61426 15.9619V15.9609C1.2185 15.279 0.868253 14.2984 0.876953 12.9795C0.890309 10.9645 2.04737 9.73924 3.5332 8.77344C4.2039 8.33749 4.87254 7.95218 5.46484 7.53809C6.04306 7.13381 6.52411 6.7165 6.8252 6.23145V5.76562C5.84108 5.45019 5.12515 4.48656 5.125 3.35059C5.125 2.39207 5.71839 1.15535 7.01855 0.879883L7.0293 0.87793L7.04102 0.876953ZM1.84863 17.3164C1.76319 17.3164 1.68955 17.3833 1.68945 17.4961V18.2754H12.7725V17.4961C12.7724 17.3848 12.6978 17.3166 12.6113 17.3164H1.84863ZM6.26367 2.33301C6.05854 2.61668 5.93789 2.96975 5.9375 3.35059C5.93768 4.29033 6.6467 5.03107 7.51367 5.03125C7.87411 5.0308 8.20953 4.89868 8.47852 4.67285C8.44029 4.6753 8.4019 4.67769 8.36328 4.67773C7.19699 4.67773 6.25786 3.66674 6.25781 2.44629C6.25784 2.40838 6.26172 2.37059 6.26367 2.33301Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.245554"
      />
    </svg>
  );

  const toArabicNumber = (numberString) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return numberString.replace(/\d/g, (digit) => arabicDigits[digit]);
  };

  const { quranFont, theme } = useTheme();

  const versesGroupedByPage = getVersesGroupedByPage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header (single) */}
        <div className="px-3 sm:px-4 lg:px-6 pt-2 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            {/* Transition moved into global header for single-header layout */}
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button
                    onClick={() => navigate(`/surah/${surahId || 2}`)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="">Translation</span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-xs sm:text-sm font-medium shadow-sm">
                    <Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span>Reading</span>
                  </button>
                </div>
              </div>
              {/* Chapter selector and page info bar is provided by <Transition /> above */}
            </div>

            {/* Surah Title */}
            <div className="mb-4 sm:mb-6">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic text-gray-900 dark:text-white mb-3 sm:mb-4"
                style={{ fontFamily: "SuraName, Amiri, serif" }}
              >
                {surahInfo && surahNameUnicodes[surahInfo.number]
                  ? String.fromCharCode(
                      parseInt(
                        surahNameUnicodes[surahInfo.number].replace("U+", ""),
                        16
                      )
                    )
                  : surahInfo?.arabic || "البقرة"}
              </h1>

              {/* Removed extra header row below surah title for Reading view */}

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  {kabahIcon}
                </button>

                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Heart className="text-black dark:text-white w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Bismillah - show for all surahs except At-Tawbah (9) */}
              {surahInfo?.number !== 9 && (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-arabic dark:text-white text-gray-800 leading-relaxed px-2">
                    <img
                      src={theme === "dark" ? DarkModeBismi : Bismi}
                      alt="Bismillah"
                      className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto"
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Loading verses...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">
                Error loading verses: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && verses.length > 0 && (
            <div>
              <div className="flex flex-row sm:flex-row items-center justify-between mb-4">
                {/* Left side */}
                <div className="flex items-center space-x-2 ml-5">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#2AA0BF] dark:text-[#2AA0BF]" />
                  <Link to={`/surahinfo/${surahId || 2}`}>
                    <span className="text-xs sm:text-sm text-[#2AA0BF] dark:text-[#2AA0BF] cursor-pointer hover:underline">
                      Surah info
                    </span>
                  </Link>
                </div>

                {/* Center - Total verses info */}
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>{verses.length} verses</span>
                </div>

                {/* Right side - Play Audio and Qirath selector */}
                <div className="flex items-center space-x-3">
                  {/* Audio Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause Audio Button */}
                    <button 
                      className={`flex items-center space-x-2 transition-colors ${
                        isPlaying 
                          ? "text-red-500 hover:text-red-600" 
                          : "text-cyan-500 hover:text-cyan-600"
                      }`}
                      onClick={handlePlayAudio}
                    >
                      {isPlaying ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">
                        {isPlaying ? "Pause Audio" : (currentAyah ? "Resume Audio" : "Play Audio")}
                      </span>
                    </button>

                    {/* Stop/Reset Button */}
                    {currentAyah && (
                      <button 
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        onClick={stopAudio}
                        title="Stop and reset to beginning"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h12v12H6z"/>
                        </svg>
                        <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                          Stop
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Qirath Selector Dropdown */}
                  <div className="relative qirath-dropdown">
                    <button
                      onClick={() => setShowQirathDropdown(!showQirathDropdown)}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 
                                 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                                 transition-colors min-h-[32px]"
                    >
                      <span className="capitalize">{selectedQirath.replace("-", " ")}</span>
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {showQirathDropdown && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 
                                     dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-[140px]">
                        {Object.keys(QIRATHS).map((qirath) => (
                          <button
                            key={qirath}
                            onClick={() => {
                              setSelectedQirath(qirath);
                              setShowQirathDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors
                                       ${selectedQirath === qirath 
                                         ? "bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400" 
                                         : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                       } first:rounded-t-lg last:rounded-b-lg capitalize`}
                          >
                            {qirath.replace("-", " ")}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verses Content - Grouped by Page */}
              {versesGroupedByPage.map((pageGroup, groupIndex) => (
                <div key={groupIndex} className="">
                  {/* Verses for this page */}
                  <div className="dark:bg-gray-900 rounded-lg p-3 sm:p-4 lg:p-3">
                    <div className="text-center">
                      <p
                        style={{ fontFamily: `'${quranFont}', serif` }}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-arabic leading-loose text-gray-900 dark:text-white"
                        dir="rtl"
                      >
                        {pageGroup.verses.map((verse, index) => {
                          // Calculate the actual ayah number based on the verse position in the surah
                          const actualAyahNumber = pageGroup.startVerse + index;
                          
                          return (
                            <span 
                              key={verse.id || `verse-${actualAyahNumber}`}
                              onClick={() => handleAyahClick(actualAyahNumber)}
                              className={`inline-block transition-all duration-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 ${
                                currentAyah === actualAyahNumber 
                                  ? "bg-blue-100 dark:bg-blue-900" 
                                  : ""
                              }`}
                              title={`Click to play ayah ${actualAyahNumber}`}
                            >
                              {verse.text_uthmani} ﴿
                              {toArabicNumber(actualAyahNumber.toString())}﴾
                              {index < pageGroup.verses.length - 1 && "   "}
                            </span>
                          );
                        })}
                      </p>
                      {/* Page Header */}
                      {pageGroup.pageNumber && (
                        <div className="flex items-center justify-center my-6 relative">
                          <div className="w-full  border-b border-gray-300 dark:border-gray-600 py-2 text-center">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 font-semibold">
                              {pageGroup.pageNumber}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* End of Surah indicator */}
              {verses.length > 0 && surahInfo && (
                <div className="mt-8 mb-4">
                  {/* <hr className="border-gray-300 dark:border-gray-600" /> */}
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
                    {/* <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-sans">
                      {surahInfo.name} • {verses.length} verses
                    </span> */}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation - same as before */}
        <div className="bg-white border-t dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8">
          {/* Mobile: Stack vertically */}
          <div className="sm:hidden space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={handlePreviousSurah}
                disabled={parseInt(surahId) <= 1}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                           dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                           border border-gray-300 dark:border-gray-600 rounded-lg w-[173.96px] min-h-[44px]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Previous Surah</span>
              </button>

              <button
                onClick={handleScrollToTop}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                           dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                           border border-gray-300 dark:border-gray-600 rounded-lg min-h-[44px]"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Beginning of Surah</span>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNextSurah}
                disabled={parseInt(surahId) >= 114}
                className="w-[173.96px] flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                           dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                           border border-gray-300 dark:border-gray-600 rounded-lg min-h-[44px]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next Surah</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-center space-x-4 lg:space-x-6">
            <button
              onClick={handlePreviousSurah}
              disabled={parseInt(surahId) <= 1}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Previous Surah</span>
            </button>
            <button
              onClick={handleScrollToTop}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg"
            >
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Beginning of Surah</span>
            </button>
            <button
              onClick={handleNextSurah}
              disabled={parseInt(surahId) >= 114}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Surah</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
      </div>

      {/* Floating Back to Top Button */}
      {showScrollButton && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="Beginning of Surah"
          aria-label="Beginning of Surah"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Reading;