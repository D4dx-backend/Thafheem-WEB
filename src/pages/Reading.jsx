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
import {
  fetchArabicVerses,
  fetchSurahs,
  fetchPageRanges,
} from "../api/apifunction";
import StickyAudioPlayer from "../components/StickyAudioPlayer";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

// Custom Kaaba Icon Component (Makkah)
const KaabaIcon = ({ className }) => (
  <svg
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);

// Madina Icon Component
const MadinaIcon = ({ className }) => (
  <svg
    width="11"
    height="15"
    viewBox="0 0 11 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.625 1.0498C5.96379 1.0415 6.15318 1.43447 5.9375 1.69434L5.93848 1.69531C5.8059 1.85727 5.73354 2.06001 5.7334 2.26953C5.73364 2.7733 6.13675 3.17749 6.63965 3.17773C6.8485 3.17752 7.05247 3.1038 7.21484 2.9707C7.35907 2.84911 7.5516 2.85714 7.68555 2.94922C7.82703 3.0465 7.89339 3.22605 7.83203 3.42188C7.62359 4.1963 6.95559 4.74982 6.16699 4.82324V4.96973C6.38842 5.29376 6.73956 5.57803 7.17188 5.86035C7.39553 6.00639 7.63673 6.14949 7.88672 6.29688C8.13549 6.44354 8.39372 6.59442 8.64746 6.75391C9.69542 7.41265 10.702 8.26832 10.7217 9.86133C10.7302 10.5552 10.5894 11.4633 9.97949 12.293C10.3948 12.3364 10.7226 12.6925 10.7227 13.1182V13.9834C10.7235 14.202 10.5466 14.3792 10.3281 14.3789V14.3799H1.21582C0.998036 14.379 0.822454 14.2011 0.823242 13.9834V13.1182C0.823351 12.6643 1.19496 12.2891 1.65039 12.2891H8.89941C9.63381 11.6946 9.91674 10.8407 9.93359 9.86035C9.95344 8.7001 9.20568 8.05633 8.22656 7.4209C7.99002 7.26739 7.75176 7.12838 7.51562 6.99219C7.28064 6.85666 7.04583 6.72296 6.82227 6.58398C6.43649 6.34416 6.0728 6.08117 5.77148 5.74121C5.46708 6.08406 5.09223 6.35958 4.7002 6.60547C4.47252 6.74826 4.23591 6.88329 4.00293 7.0166C3.76878 7.15058 3.53754 7.28322 3.31543 7.42285C2.42056 7.98548 1.62622 8.63485 1.61133 9.86523C1.6014 10.6849 1.83171 11.2575 2.07324 11.6484H2.07227C2.13777 11.7504 2.15412 11.8634 2.12402 11.9678C2.0949 12.0686 2.02647 12.1474 1.94727 12.1963C1.86807 12.2451 1.76716 12.2711 1.66406 12.252C1.55623 12.2319 1.46123 12.1657 1.39941 12.0596V12.0586C1.0886 11.5539 0.816533 10.8308 0.823242 9.8623C0.83371 8.36129 1.75222 7.45412 2.89844 6.75293C3.41821 6.43497 3.92281 6.1624 4.37598 5.86426C4.80764 5.58025 5.15748 5.29245 5.37891 4.9668V4.72949C4.62425 4.47414 4.07622 3.76183 4.07617 2.9209C4.07617 2.19418 4.55355 1.26045 5.59473 1.05273L5.61035 1.0498H5.625ZM1.62207 13.0869C1.61745 13.0916 1.61137 13.1013 1.61133 13.1182V13.5908H9.93457V13.1182C9.93452 13.1022 9.92888 13.093 9.92383 13.0879C9.91879 13.0828 9.90931 13.0771 9.89355 13.0771H1.65039C1.63521 13.0771 1.6266 13.0825 1.62207 13.0869ZM4.95801 2.47852C4.89845 2.61488 4.86542 2.76443 4.86523 2.9209L4.87109 3.03613C4.92841 3.60447 5.40474 4.04371 5.98926 4.04395C6.14409 4.04376 6.29155 4.00941 6.42676 3.95117C5.66139 3.85413 5.05306 3.24442 4.95801 2.47852Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.35469"
    />
  </svg>
);

const QIRATHS = {
  "al-afasy": "QA",
  "al-ghamidi": "QG",
  "al-hudaify": "QH",
};

const Reading = () => {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageRanges, setPageRanges] = useState([]);
  const [selectedQirath, setSelectedQirath] = useState("al-afasy");
  const [audioTypes, setAudioTypes] = useState(["quran"]); // Array of selected audio types
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentAudioTypeIndex, setCurrentAudioTypeIndex] = useState(0); // Track which audio type is currently playing
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const currentAudioRef = useRef(null);
  const audioRefForCleanup = useRef(null); // Track audio for cleanup
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Favorite surah state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { translationLanguage } = useTheme();

  // Generate audio URL based on audio type
  const generateAudioUrl = (surahId, ayahId, type, qirathName, qirathCode) => {
    const surahIdPadded = String(surahId).padStart(3, '0');
    const ayahIdPadded = String(ayahId).padStart(3, '0');
    
    let audioUrl;
    
    if (type === 'quran') {
      // Quran audio format: https://old.thafheem.net/audio/qirath/{qirathName}/{prefix}{surahId_3digit}_{ayahId_3digit}.ogg
      // Example: https://old.thafheem.net/audio/qirath/al-afasy/QA002_004.ogg
      if (import.meta.env.DEV) {
        audioUrl = `/api/audio/qirath/${qirathName}/${qirathCode}${surahIdPadded}_${ayahIdPadded}.ogg`;
      } else {
        audioUrl = `https://old.thafheem.net/audio/qirath/${qirathName}/${qirathCode}${surahIdPadded}_${ayahIdPadded}.ogg`;
      }
    } else if (type === 'translation') {
      // Translation audio format: https://old.thafheem.net/audio/translation/T{surahId_3digit}_{ayahId_3digit}.ogg
      // Example: https://old.thafheem.net/audio/translation/T002_004.ogg
      audioUrl = `https://old.thafheem.net/audio/translation/T${surahIdPadded}_${ayahIdPadded}.ogg`;
    } else if (type === 'interpretation') {
      // Interpretation audio format: https://old.thafheem.net/audio/interpretation/I{surahId_3digit}_{ayahId_3digit}.ogg
      // Example: https://old.thafheem.net/audio/interpretation/I002_004.ogg
      audioUrl = `https://old.thafheem.net/audio/interpretation/I${surahIdPadded}_${ayahIdPadded}.ogg`;
    }
    
    return audioUrl;
  };

  // Play audio types for an ayah in sequence, then move to next ayah
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahAtIndexWithTypes = (index, audioTypeIndex = 0, typesToPlay = null) => {
    // Use provided types or fall back to state
    const activeAudioTypes = typesToPlay || audioTypes;
    
    if (index >= verses.length) {
      // All ayahs played, stop playback
      setIsPlaying(false);
      setCurrentAyah(null);
      setCurrentAyahIndex(0);
      setCurrentAudioTypeIndex(0);
      setAudioElement(null);
      // Dispatch event to update header button
      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
      return;
    }

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      playAyahAtIndexWithTypes(index + 1, 0, typesToPlay);
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
    const currentAudioType = activeAudioTypes[audioTypeIndex];
    const audioUrl = generateAudioUrl(currentSurahId, ayahId, currentAudioType, selectedQirath, qirathCode);
    
    // Create new audio element
    const audio = new Audio(audioUrl);
    
    // Set audio properties before adding event listeners
    audio.preload = 'none'; // Don't preload to avoid conflicts
    audio.playbackRate = playbackSpeed; // Apply playback speed
    // Removed crossOrigin to avoid CORS issues
    
    setAudioElement(audio);
    currentAudioRef.current = audio;
    setCurrentAyah(ayahId);
    setCurrentAyahIndex(index);
    setCurrentAudioTypeIndex(audioTypeIndex);
    
    // Handle audio end - play next audio type or next ayah
    audio.onended = () => {
      // Only continue if this is still the current audio element
      if (currentAudioRef.current === audio) {
        // Play next audio type for this ayah, or move to next ayah if all types done
        playAyahAtIndexWithTypes(index, audioTypeIndex + 1, typesToPlay);
      }
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      console.error('Failed URL:', audioUrl);
      // Only continue if this is still the current audio element
      if (currentAudioRef.current === audio) {
        // Skip to next audio type or next ayah
        playAyahAtIndexWithTypes(index, audioTypeIndex + 1, typesToPlay);
      }
    };
    
    // Play the audio with better error handling
    audio.play().then(() => {
      // Successfully started playing
      // Dispatch event to update header button
      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
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
        // Try to continue to next audio type or ayah anyway
        setTimeout(() => {
          playAyahAtIndexWithTypes(index, audioTypeIndex + 1, typesToPlay);
        }, 1000);
        return;
      }
      
      // For other errors, skip to next audio type or next ayah
      playAyahAtIndexWithTypes(index, audioTypeIndex + 1, typesToPlay);
    });
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahAtIndex = (index, audioTypeIndex = 0) => {
    playAyahAtIndexWithTypes(index, audioTypeIndex, null);
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
    setCurrentAudioTypeIndex(0);
    setAudioElement(null);
    currentAudioRef.current = null;
    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
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
        setCurrentAudioTypeIndex(0);
        
        // Start playing from the clicked ayah
        setIsPlaying(true);
        playAyahAtIndex(ayahIndex, 0);
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
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
        // Don't clear currentAyah or currentAyahIndex - keep them for resume
      } else {
        // Resume playback from current ayah or start from beginning
        if (currentAyahIndex > 0 || currentAyah) {
          // Resume from current position
          setIsPlaying(true);
          playAyahAtIndex(currentAyahIndex, currentAudioTypeIndex);
        } else {
          // Start from first ayah
          setIsPlaying(true);
          playAyahAtIndex(0, 0);
        }
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      setCurrentAyah(null);
      setAudioElement(null);
      // Dispatch event to update header button
      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
    }
  };

  // Ref to store handlePlayAudio for event listener
  const handlePlayAudioRef = useRef(null);
  handlePlayAudioRef.current = handlePlayAudio;

  // Listen for play audio event from header
  useEffect(() => {
    const handlePlayAudioEvent = () => {
      if (handlePlayAudioRef.current) {
        handlePlayAudioRef.current();
      }
    };

    window.addEventListener('playAudio', handlePlayAudioEvent);
    return () => {
      window.removeEventListener('playAudio', handlePlayAudioEvent);
    };
  }, []);

  // Dispatch audio state changes when isPlaying changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying } }));
  }, [isPlaying]);

  // Stop audio and clear highlight when Qirath or audio types change
  useEffect(() => {
    if (isPlaying && audioElement) {
      stopAudio();
    }
  }, [selectedQirath, audioTypes]);

  // Apply playback speed when it changes
  useEffect(() => {
    if (audioElement) {
      audioElement.playbackRate = playbackSpeed;
    }
  }, [audioElement, playbackSpeed]);

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

  // Load favorite status for the current surah
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!user || !surahId) {
        setIsFavorited(false);
        return;
      }

      try {
        const favorited = await BookmarkService.isFavorited(user.uid, surahId);
        setIsFavorited(favorited);
      } catch (error) {
        console.error("Error loading favorite status:", error);
      }
    };

    loadFavoriteStatus();
  }, [user, surahId]);

  // Handle favorite surah toggle
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    // Check if user is signed in
    if (!user) {
      showError("Please sign in to favorite surahs");
      navigate("/sign");
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorited) {
        // Remove from favorites
        await BookmarkService.deleteFavoriteSurah(user.uid, surahId);
        setIsFavorited(false);
        showSuccess("Surah removed from favorites");
      } else {
        // Add to favorites
        await BookmarkService.addFavoriteSurah(
          user.uid,
          surahId,
          surahInfo?.arabic || `Surah ${surahId}`
        );
        setIsFavorited(true);
        showSuccess("Surah added to favorites");
      }
    } catch (error) {
      console.error("Error managing favorite:", error);
      showError("Failed to manage favorite. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  // Get the appropriate icon based on surah type
  const surahIcon = surahInfo?.type === 'Makki' ? (
    <KaabaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3FA5C0]" />
  ) : (
    <MadinaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3FA5C0]" />
  );

  const toArabicNumber = (numberString) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return numberString.replace(/\d/g, (digit) => arabicDigits[digit]);
  };

  const { quranFont, theme } = useTheme();

  const versesGroupedByPage = getVersesGroupedByPage();

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
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
              <h1 className="text-3xl sm:text-4xl font-arabic dark:text-white text-gray-900">
                {surahInfo?.arabic || "Loading..."}
              </h1>

              {/* Removed extra header row below surah title for Reading view */}

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  {surahIcon}
                </button>

                <button 
                  onClick={handleFavoriteClick}
                  disabled={favoriteLoading}
                  className={`p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    favoriteLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:text-gray-600 dark:hover:text-gray-300'
                  } ${isFavorited ? 'text-red-500' : 'text-gray-400 dark:text-white'}`}
                  title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'fill-current' : ''}`} />
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
              {/* Verse count moved to header */}
              {/* Play Audio button moved to header */}
              {/* Qirath selector moved to audio player settings */}

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
          className={`fixed right-6 z-[60] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
            currentAyah ? 'bottom-32 sm:bottom-36' : 'bottom-6'
          }`}
          title="Beginning of Surah"
          aria-label="Beginning of Surah"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Sticky Audio Player */}
      {currentAyah && (
        <StickyAudioPlayer
          audioElement={audioElement}
          isPlaying={isPlaying}
          currentAyah={currentAyah}
          totalAyahs={verses.length}
          surahInfo={surahInfo}
          onPlayPause={handlePlayAudio}
          onStop={stopAudio}
          onSkipBack={() => {
            // Go to previous ayah
            if (currentAyahIndex > 0) {
              setIsPlaying(true);
              playAyahAtIndex(currentAyahIndex - 1, 0);
            }
          }}
          onSkipForward={() => {
            // Go to next ayah
            if (currentAyahIndex < verses.length - 1) {
              setIsPlaying(true);
              playAyahAtIndex(currentAyahIndex + 1, 0);
            }
          }}
          onClose={null}
          selectedQari={selectedQirath}
          onQariChange={(newQari) => {
            setSelectedQirath(newQari);
            // If audio is currently playing, restart with new reciter
            if (currentAyah) {
              stopAudio();
              setTimeout(() => {
                if (currentAyahIndex >= 0) {
                  setIsPlaying(true);
                  playAyahAtIndex(currentAyahIndex);
                }
              }, 100);
            }
          }}
          translationLanguage={translationLanguage}
          audioTypes={audioTypes}
          onAudioTypesChange={(newTypes) => {
            const currentIdx = currentAyahIndex; // Capture current index
            setAudioTypes(newTypes);
            // If audio is currently playing, restart with new audio types
            if (currentAyah && currentIdx >= 0) {
              stopAudio();
              // Pass newTypes directly to avoid closure issue
              setTimeout(() => {
                setIsPlaying(true);
                playAyahAtIndexWithTypes(currentIdx, 0, newTypes);
              }, 100);
            }
          }}
          playbackSpeed={playbackSpeed}
          onPlaybackSpeedChange={(newSpeed) => {
            setPlaybackSpeed(newSpeed);
          }}
        />
      )}
      </div>
    </>
  );
};

export default Reading;