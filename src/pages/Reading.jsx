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
import { useState, useEffect, useRef, lazy, Suspense, useMemo } from "react";
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
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import { VersesSkeleton, CompactLoading } from "../components/LoadingSkeleton";
import { saveLastReading } from "../services/readingProgressService";
import {
  getCalligraphicSurahName,
  surahNameFontFamily,
} from "../utils/surahNameUtils.js";

// Lazy load heavy components
const StickyAudioPlayer = lazy(() => import("../components/StickyAudioPlayer"));

const QIRATHS = {
  "al-afasy": "QA",
  "al-ghamidi": "QG",
  "al-hudaify": "QH",
};

const Reading = () => {
  const { surahId } = useParams();

  useEffect(() => {
    if (surahId) {
      saveLastReading({
        surahId,
        viewType: "reading",
        path: `/reading/${surahId}`,
      });
    }
  }, [surahId]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [pageRanges, setPageRanges] = useState([]);
  const [loadedVerseCount, setLoadedVerseCount] = useState(0);
  const BATCH_SIZE = 50; // Load 50 verses at a time
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
      if (import.meta.env.DEV) {
        audioUrl = `/api/audio/translation/T${surahIdPadded}_${ayahIdPadded}.ogg`;
      } else {
        audioUrl = `https://old.thafheem.net/audio/translation/T${surahIdPadded}_${ayahIdPadded}.ogg`;
      }
    } else if (type === 'interpretation') {
      // Interpretation audio format: https://old.thafheem.net/audio/interpretation/I{surahId_3digit}_{ayahId_3digit}.ogg
      // Example: https://old.thafheem.net/audio/interpretation/I002_004.ogg
      if (import.meta.env.DEV) {
        audioUrl = `/api/audio/interpretation/I${surahIdPadded}_${ayahIdPadded}.ogg`;
      } else {
        audioUrl = `https://old.thafheem.net/audio/interpretation/I${surahIdPadded}_${ayahIdPadded}.ogg`;
      }
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

  // Listen for toast events from Transition component
  useEffect(() => {
    const handleToastEvent = (event) => {
      const { type, message } = event.detail;
      if (type === 'success') {
        showSuccess(message);
      } else if (type === 'error') {
        showError(message);
      }
    };

    window.addEventListener('showToast', handleToastEvent);
    return () => {
      window.removeEventListener('showToast', handleToastEvent);
    };
  }, [showSuccess, showError]);

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

  // Progressive loading: Load surah info and page ranges first, then verses in batches
  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        setLoading(true);
        setError(null);
        setVerses([]);
        setLoadedVerseCount(0);

        const currentSurahId = surahId || 2;

        // Step 1: Load surah info and page ranges first (fast, small data)
        const [surahsData, pageRangesData] = await Promise.all([
          fetchSurahs(),
          fetchPageRanges(),
        ]);

        // Filter page ranges for current surah
        const surahPageRanges = pageRangesData.filter(
          (range) => range.SuraId === parseInt(currentSurahId)
        );

        const surah = surahsData.find((s) => s.number === parseInt(currentSurahId));
        setSurahInfo(surah);
        setPageRanges(surahPageRanges);

        // Step 2: Load first batch of verses quickly (show content ASAP)
        setLoading(false); // Show UI with surah info while loading verses
        setLoadingMore(true);

        try {
          const allVersesData = await fetchArabicVerses(currentSurahId);
          
          // Load first batch immediately
          const firstBatch = allVersesData.slice(0, BATCH_SIZE);
          setVerses(firstBatch);
          setLoadedVerseCount(BATCH_SIZE);

          // Load remaining verses asynchronously
          if (allVersesData.length > BATCH_SIZE) {
            // Use requestIdleCallback for better performance, fallback to setTimeout
            const loadRemaining = () => {
              const remainingVerses = allVersesData.slice(BATCH_SIZE);
              setVerses(allVersesData);
              setLoadedVerseCount(allVersesData.length);
              setLoadingMore(false);
            };

            if (window.requestIdleCallback) {
              window.requestIdleCallback(loadRemaining, { timeout: 1000 });
            } else {
              setTimeout(loadRemaining, 100);
            }
          } else {
            setLoadingMore(false);
          }
        } catch (verseError) {
          console.error("Error loading verses:", verseError);
          setError(verseError.message);
          setLoadingMore(false);
        }
      } catch (err) {
        console.error("Error fetching surah data:", err);
        setError(err.message);
        setLoading(false);
        setLoadingMore(false);
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

  const toArabicNumber = (numberString) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return numberString.replace(/\d/g, (digit) => arabicDigits[digit]);
  };

  const { quranFont, theme } = useTheme();

  // Memoize grouped verses to prevent recalculation on every render
  const versesGroupedByPage = useMemo(() => getVersesGroupedByPage(), [verses, pageRanges]);

  const accessibleSurahName =
    surahInfo?.arabic || (surahId ? `Surah ${surahId}` : "Surah");
  const calligraphicSurahName = getCalligraphicSurahName(
    surahId,
    accessibleSurahName
  );
  const surahIdString = surahId ? String(surahId) : "";
  const useNormalSurahTitleWeight =
    surahIdString === "1" || surahIdString === "2";
  const surahTitleWeightClass = useNormalSurahTitleWeight
    ? "font-normal"
    : "font-semibold";

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Page Header (single) */}
        <div className="px-3 sm:px-4 lg:px-6 pt-6 sm:pt-8 pb-2 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            {/* Transition moved into global header for single-header layout */}
            {/* Toggle Buttons moved to global header (Transition component) */}

            {/* Surah Title */}
            <div className="mb-4 sm:mb-5">
              <h1
                className={`text-4xl sm:text-5xl font-arabic dark:text-white text-gray-900 mb-6 sm:mb-8 ${surahTitleWeightClass}`}
                style={{ fontFamily: surahNameFontFamily }}
                aria-label={accessibleSurahName}
              >
                {calligraphicSurahName}
              </h1>

              {/* Bismillah - hide for Al-Fatihah (1) as it's the first ayah, and At-Tawbah (9) */}
              {surahInfo?.number !== 1 && surahInfo?.number !== 9 && (
                <div className="mb-3 sm:mb-4">
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
          {/* Initial Loading State - Shimmer Skeleton */}
          {loading && (
            <VersesSkeleton count={5} />
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

          {/* Content - Show verses as they load */}
          {!loading && !error && verses.length > 0 && (
            <div>
              {/* Verse count moved to header */}
              {/* Play Audio button moved to header */}
              {/* Qirath selector moved to audio player settings */}

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="text-center py-4 mb-4">
                  <CompactLoading message="Loading remaining verses..." />
                </div>
              )}

              {/* Verses Content - Grouped by Page */}
              {versesGroupedByPage.map((pageGroup, groupIndex) => (
                <div key={groupIndex} className="">
                  {/* Verses for this page */}
                  <div className="dark:bg-gray-900 rounded-lg p-3 sm:p-4 lg:p-3">
                    <div className="text-center">
                      <p
                        style={{
                          fontFamily: `'${quranFont}', serif`,
                          textAlign: "justify",
                          textAlignLast: "right",
                          wordSpacing: "0.1em",
                          letterSpacing: "0.02em",
                          lineHeight: 2.3,
                          fontSize: "24px",
                        }}
                        className="font-arabic text-gray-900 dark:text-white"
                        dir="rtl"
                      >
                        {pageGroup.verses.map((verse, index) => {
                          // Calculate the actual ayah number based on the verse position in the surah
                          const actualAyahNumber = pageGroup.startVerse + index;
                          
                          return (
                            <span 
                              key={verse.id || `verse-${actualAyahNumber}`}
                              onClick={() => handleAyahClick(actualAyahNumber)}
                              className={`inline transition-all duration-300 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/40 rounded px-2 ${
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

      {/* Sticky Audio Player - Lazy loaded */}
      {currentAyah && (
        <Suspense fallback={<div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-100 dark:bg-gray-800 animate-pulse"></div>}>
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
        </Suspense>
      )}
      </div>
    </>
  );
};

export default Reading;