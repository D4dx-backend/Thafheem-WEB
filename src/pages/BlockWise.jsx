import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  User,
  Heart,
  Play,
  Copy,
  Pause,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  X,
  Info,
  LibraryBig,
  Notebook,
} from "lucide-react";
import HomeNavbar from "../components/HomeNavbar";
// Transition rendered globally in navbar
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import WordByWord from "./WordByWord";
import InterpretationBlockwise from "./InterpretationBlockwise";
import ToggleGroup from "../components/ToggleGroup";
import Bismi from "../assets/bismi.png";
import DarkModeBismi from "../assets/darkmode-bismi.png";
import { useTheme } from "../context/ThemeContext";
import {
  fetchBlockWiseData,
  fetchArabicVerses,
  fetchAyahAudioTranslations,
  fetchAyaRanges,
  fetchAyaTranslation,
  fetchUrduTranslationAudio,
  fetchUrduInterpretationAudio,
} from "../api/apifunction";
import { useSurahData } from "../hooks/useSurahData";
import { fetchDeduplicated } from "../utils/requestDeduplicator";
import { BlocksSkeleton, CompactLoading } from "../components/LoadingSkeleton";
import { AyahViewIcon, BlockViewIcon } from "../components/ViewToggleIcons";
import StickyAudioPlayer from "../components/StickyAudioPlayer";
import englishTranslationService from "../services/englishTranslationService";
import useSequentialEnglishFootnotes from "../hooks/useSequentialEnglishFootnotes";
import audioManager from "../utils/audioManager";
import {
  getCalligraphicSurahName,
  surahNameFontFamily,
} from "../utils/surahNameUtils.js";
import { useSurahViewCache } from "../context/SurahViewCacheContext";
import { processMalayalamMediaLinks, handleMalayalamMediaLinkClick, setMediaPopupHandlers } from "../utils/malayalamMediaLinks";
import MediaPopup from "../components/MediaPopup";

const BlockWise = () => {
  const [activeTab, setActiveTab] = useState("Translation");
  const [activeView, setActiveView] = useState("Block wise");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedQirath, setSelectedQirath] = useState(() => {
    const savedReciter = localStorage.getItem("reciter");
    return savedReciter || "al-hudaify";
  });
  const [audioTypes, setAudioTypes] = useState(['quran']); // Selected audio types in order
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
    return savedSpeed ? parseFloat(savedSpeed) : 1.0;
  });
  const [playingBlock, setPlayingBlock] = useState(null); // Track which block is currently playing
  const [currentAudioType, setCurrentAudioType] = useState(null); // Track which audio type is playing
  const [currentAyahInBlock, setCurrentAyahInBlock] = useState(null); // Track which ayah within the block is playing
  const [currentInterpretationNumber, setCurrentInterpretationNumber] = useState(1); // Track which interpretation number (1, 2, 3, etc.)
  const [isContinuousPlay, setIsContinuousPlay] = useState(false); // Track if continuous playback is active
  const [isPaused, setIsPaused] = useState(false); // Track if audio is paused
  const audioRef = useRef(null); // Audio element reference
  // Refs to track playback state for event handlers (avoid stale closures)
  const playingBlockRef = useRef(null);
  const isContinuousPlayRef = useRef(false);
  const isProcessingNextRef = useRef(false); // Guard to prevent duplicate calls to moveToNextAyahOrBlock/playNextBlock
  const playbackSpeedRef = useRef(playbackSpeed); // Ref to track current playback speed
  const preservedAudioTypesRef = useRef(null); // Ref to preserve audioTypes when block playback starts
  const isTryingFallbackRef = useRef(false); // Guard to prevent multiple fallback attempts for the same audio


  // State management for API data
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ayahData, setAyahData] = useState([]);
  const [arabicVerses, setArabicVerses] = useState([]);
  const [blockBookmarkLoading, setBlockBookmarkLoading] = useState({});
  const [blockRanges, setBlockRanges] = useState([]);
  const [blockTranslations, setBlockTranslations] = useState({});
  const [selectedInterpretation, setSelectedInterpretation] = useState(null);
  // Word-by-Word modal state
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [selectedVerseForWordByWord, setSelectedVerseForWordByWord] = useState(null);
  // Media popup state
  const [mediaPopup, setMediaPopup] = useState({ isOpen: false, mediaId: null });
  const [loadingBlocks, setLoadingBlocks] = useState(new Set());
  const hasFetchedRef = useRef(false);
  const [blockReloadToken, setBlockReloadToken] = useState(0);
  const [autoRetryAttempted, setAutoRetryAttempted] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  // Favorite surah state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  // English footnote modal state
  const [showEnglishFootnoteModal, setShowEnglishFootnoteModal] = useState(false);
  const [englishFootnoteContent, setEnglishFootnoteContent] = useState("");
  const [englishFootnoteLoading, setEnglishFootnoteLoading] = useState(false);
  const [englishFootnoteMeta, setEnglishFootnoteMeta] = useState({
    footnoteId: null,
    footnoteNumber: null,
    surah: null,
    ayah: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();
  const {
    quranFont,
    translationLanguage,
    theme,
    fontSize,
    adjustedTranslationFontSize,
    viewType: contextViewType,
    setViewType: setContextViewType,
  } = useTheme();
  const blockModalFontSize = Math.max(
    Number(adjustedTranslationFontSize) - 2,
    10
  );
  const { surahId } = useParams();
  const { getBlockViewCache, setBlockViewCache } = useSurahViewCache();
  const hydratedBlockCacheRef = useRef(false);
  const previousLanguageRef = useRef(translationLanguage);
  const previousSurahRef = useRef(surahId);
  const processedBlocksRef = useRef(new Set()); // Track blocks that are being/have been processed

  useSequentialEnglishFootnotes({
    enabled: translationLanguage === 'E' && contextViewType === 'Block Wise',
    context: 'blockwise',
    dependencies: [blockTranslations, blockRanges, surahId, blockData],
  });

  // Handle viewType from location state (e.g., when navigating from bookmarks)
  useEffect(() => {
    if (location.state?.viewType) {
      setContextViewType(location.state.viewType);
    }
  }, [location.state, setContextViewType]);

  useEffect(() => {
    const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';

    if (!supportsBlockwise) {
      if (contextViewType !== 'Ayah Wise') {
        setContextViewType('Ayah Wise');
      }
      return;
    }

    if (contextViewType === 'Ayah Wise') {
      const targetPath = `/surah/${surahId}`;
      if (pathname !== targetPath) {
        navigate(targetPath);
      }
    } else if (contextViewType !== 'Block Wise') {
      setContextViewType('Block Wise');
    }
  }, [contextViewType, translationLanguage, surahId, navigate, pathname, setContextViewType]);

  const handleNavigateToAyahWise = () => {
    setContextViewType('Ayah Wise');
  };

  // Use cached surah data
  const { surahs } = useSurahData(translationLanguage);

  const buildBlockIdSet = useCallback((ranges = []) => {
    if (!Array.isArray(ranges) || ranges.length === 0) {
      return new Set();
    }

    return new Set(
      ranges.map((block, index) => {
        const rawStart = block.AyaFrom ?? block.ayafrom ?? block.from ?? 1;
        const rawEnd = block.AyaTo ?? block.ayato ?? block.to ?? rawStart;
        const parsedStart = Number.parseInt(rawStart, 10);
        const parsedEnd = Number.parseInt(rawEnd, 10);
        const hasNumericBounds = Number.isFinite(parsedStart) && Number.isFinite(parsedEnd);
        const fallbackStart = Number.isFinite(Number(rawStart)) ? Number(rawStart) : 1;
        const start = hasNumericBounds ? parsedStart : fallbackStart;
        const fallbackEnd = Number.isFinite(Number(rawEnd)) ? Number(rawEnd) : start;
        const end = hasNumericBounds ? parsedEnd : fallbackEnd;
        const rangeKey = hasNumericBounds
          ? `${start}-${end}`
          : `${rawStart}-${rawEnd}`;

        return block.ID || block.id || rangeKey || `block-${index}`;
      })
    );
  }, []);

  // Function to convert Western numerals to Arabic-Indic numerals
  const toArabicNumber = (num) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicDigits[digit] || digit)
      .join("");
  };

  const stripArabicVerseMarker = (text) => {
    if (!text) return "";
    return text.replace(/\s*﴿\s*[\d\u0660-\u0669]+\s*﴾\s*$/u, "").trim();
  };

  const formatArabicVerseWithNumber = (text, ayahNumber) => {
    const cleaned = stripArabicVerseMarker(text);
    const display = cleaned || text || "";
    return `${display} ﴿${toArabicNumber(ayahNumber)}﴾`;
  };

  const normalizeAyahNumber = (value, fallbackValue = null) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    return fallbackValue;
  };

  const triggerBlockwiseReload = useCallback(
    (reason = "manual") => {
      if (!surahId) {
        return;
      }

      console.log(`[BlockWise] Triggering blockwise reload (${reason})`);
      hasFetchedRef.current = false;

      const nextLoadingSet = buildBlockIdSet(blockRanges);
      setLoadingBlocks(nextLoadingSet);
      setBlockTranslations({});
      setError(null);

      if (reason === "manual") {
        setAutoRetryAttempted(false);
      }

      setBlockReloadToken((prev) => prev + 1);
    },
    [surahId, blockRanges, buildBlockIdSet]
  );

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Register with audio manager
      audioManager.register(audioRef.current);
    }

    // Cleanup: Stop audio when component unmounts (navigating away)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Clear the source
        audioRef.current.currentTime = 0;
      }
      // Clear playback state
      setPlayingBlock(null);
      setCurrentAudioType(null);
      setCurrentAyahInBlock(null);
      setIsContinuousPlay(false);
      setIsPaused(false);
      // Update refs
      playingBlockRef.current = null;
      isContinuousPlayRef.current = false;
    };
  }, []); // Only run on mount/unmount

  // Qirath prefix mapping
  const qirathPrefixes = {
    "al-hudaify": "QH",
    "al-afasy": "QA",
    "al-ghamidi": "QG"
  };

  // Helper function to get language name from code
  const getLanguageName = (code) => {
    const languageMap = {
      'E': 'English',
      'mal': 'Malayalam',
      'ur': 'Urdu',
      'bn': 'Bangla',
      'ta': 'Tamil',
      'hi': 'Hindi'
    };
    return languageMap[code] || code;
  };

  // Function to play audio for a specific block - starts from the first ayah
  const playBlockAudio = (blockId, fromContinuous = false, preservedAudioTypes = null) => {
    if (!audioRef.current) return;

    // Preserve audioTypes when moving to next block
    // If preservedAudioTypes is provided, use it; otherwise use state; if fromContinuous, use ref
    const audioTypesToUse = preservedAudioTypes || (fromContinuous && preservedAudioTypesRef.current) || audioTypes;
    
    // Update the ref when starting a new block (not from continuous)
    if (!fromContinuous) {
      preservedAudioTypesRef.current = audioTypesToUse;
    }

    console.log("[BlockWise] playBlockAudio start", {
      blockId,
      fromContinuous,
      audioTypes: audioTypesToUse,
      preservedAudioTypes,
      translationLanguage,
      selectedQirath
    });

    // Check if translation/interpretation audio is selected but language is not Malayalam
    // Urdu doesn't support blockwise - only ayahwise and reading page
    // Only check if not already in continuous mode (to allow resume)
    if (!fromContinuous && translationLanguage !== 'mal') {
      const hasTranslationOrInterpretation = audioTypesToUse.some(type =>
        type === 'translation' || type === 'interpretation'
      );
      if (hasTranslationOrInterpretation) {
        const languageName = getLanguageName(translationLanguage);
        showWarning(`${languageName} translation and explanation audio is coming soon. Currently, only Malayalam translation and explanation audio is available for blockwise view.`);
        // Filter out translation and interpretation from audioTypes
        const filteredTypes = audioTypes.filter(type =>
          type !== 'translation' && type !== 'interpretation'
        );
        if (filteredTypes.length > 0) {
          setAudioTypes(filteredTypes);
          // Continue with only Quran audio
        } else {
          // If no valid types left, default to Quran
          setAudioTypes(['quran']);
        }
        return;
      }
    }

    // Stop any currently playing audio and clean up handlers
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.src = '';
        audioRef.current.load();
      } catch (error) {
        console.warn('[BlockWise] Error cleaning up audio:', error);
      }
    }

    // Find the block data
    const blockInfo = blockRanges.find(b => (b.ID || b.id) === blockId);
    if (!blockInfo) {
      console.error('Block not found:', blockId);
      // Reset guard flag if block not found
      isProcessingNextRef.current = false;
      return;
    }

    const startingAyah = blockInfo.AyaFrom || blockInfo.ayafrom || blockInfo.from || 1;
    const normalizedStartingAyah = normalizeAyahNumber(startingAyah, 1);

    setIsContinuousPlay(true);
    setPlayingBlock(blockId);
    setCurrentAyahInBlock(normalizedStartingAyah);
    setCurrentInterpretationNumber(1); // Reset interpretation number for new block
    setIsPaused(false);
    // Update refs for event handlers
    playingBlockRef.current = blockId;
    isContinuousPlayRef.current = true;

    console.log("[BlockWise] playBlockAudio state set", {
      playingBlock: blockId,
      normalizedStartingAyah,
      currentAudioType: audioTypesToUse?.[0] || 'quran',
      audioTypes: audioTypesToUse
    });

    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));

    // Play the first ayah's audio (will play all selected types in sequence)
    // Pass preserved audioTypes to maintain continuity
    // Guard flag will be reset when audio starts playing (in playAyahAudioWithTypes)
    playAyahAudio(blockId, normalizedStartingAyah, 0, audioTypesToUse);
  };

  // Generate audio URL based on audio type
  // Returns object with primary and fallback URLs for Malayalam translation
  const generateAudioUrl = async (surahId, ayahId, type, interpretationNumber = 1) => {
    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahId).padStart(3, "0");

    const baseUrl = 'https://thafheem.net/audio';

    if (type === 'quran') {
      return { primary: `${baseUrl}/qirath/${selectedQirath}/${qirathPrefixes[selectedQirath]}${surahCode}_${ayahCode}.ogg`, fallback: null };
    } else if (type === 'translation') {
      // For Malayalam, use default pattern (Urdu doesn't support blockwise)
      const primaryUrl = `${baseUrl}/translation/T${surahCode}_${ayahCode}.ogg`;
      // Generate fallback URL with previous ayah (only if ayahId > 1)
      // Format: T{surah}_{previousAyah},{currentAyah}.ogg (previous, current order)
      let fallbackUrl = null;
      if (translationLanguage === 'mal' && ayahId > 1) {
        const previousAyahCode = String(ayahId - 1).padStart(3, "0");
        fallbackUrl = `${baseUrl}/translation/T${surahCode}_${previousAyahCode},${ayahCode}.ogg`;
      }
      return { primary: primaryUrl, fallback: fallbackUrl };
    } else if (type === 'interpretation') {
      // For Malayalam, use default pattern (Urdu doesn't support blockwise)
      // First interpretation has no number suffix, subsequent ones have _02, _03, etc.
      let primaryUrl;
      if (interpretationNumber === 1) {
        primaryUrl = `${baseUrl}/interpretation/I${surahCode}_${ayahCode}.ogg`;
      } else {
        const interpretationCode = String(interpretationNumber).padStart(2, "0");
        primaryUrl = `${baseUrl}/interpretation/I${surahCode}_${ayahCode}_${interpretationCode}.ogg`;
      }
      return { primary: primaryUrl, fallback: null };
    }
    return { primary: null, fallback: null };
  };

  // Function to play audio types for a specific ayah in sequence
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahAudioWithTypes = async (blockId, ayahNumber, audioTypeIndex = 0, typesToPlay = null) => {
    if (!audioRef.current) return;
    
    // Check if audio should be stopped (language changed)
    if (audioManager.getShouldStop()) {
      return;
    }

    const ayahToPlay = normalizeAyahNumber(
      ayahNumber,
      normalizeAyahNumber(currentAyahInBlock, 1) || 1
    );

    // Use provided types or fall back to state
    const activeAudioTypes = typesToPlay || audioTypes;

    console.log("[BlockWise] playAyahAudioWithTypes", {
      blockId,
      requestedAyah: ayahNumber,
      ayahToPlay,
      audioTypeIndex,
      audioTypes: activeAudioTypes,
      audioTypesLength: activeAudioTypes.length,
      shouldMoveToNext: audioTypeIndex >= activeAudioTypes.length,
      playbackSpeed,
      isContinuousPlay,
      isPaused,
      playingBlock
    });

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      console.log('[BlockWise] All audio types played for ayah, moving to next ayah', {
        audioTypeIndex,
        audioTypesLength: activeAudioTypes.length,
        ayahToPlay,
        blockId
      });
      moveToNextAyahOrBlock(ayahToPlay, activeAudioTypes);
      return;
    }

    // Stop any currently playing audio before starting new audio
    // Clear handlers first to prevent old handlers from firing
    try {
      if (audioRef.current.onended) {
        audioRef.current.onended = null;
      }
      if (audioRef.current.onerror) {
        audioRef.current.onerror = null;
      }
      audioRef.current.pause();
    } catch (error) {
      console.warn('[BlockWise] Error stopping previous audio:', error);
    }

    const currentAudioType = activeAudioTypes[audioTypeIndex];
    
    // For interpretation, use currentInterpretationNumber
    let interpretationNumber = 1;
    if (currentAudioType === 'interpretation') {
      interpretationNumber = currentInterpretationNumber;
    }
    
    // Generate audio URL (async for Urdu audio)
    let audioUrls;
    try {
      audioUrls = await generateAudioUrl(surahId, ayahToPlay, currentAudioType, interpretationNumber);
    } catch (error) {
      console.error('[BlockWise] Error generating audio URL:', error);
      // If URL generation fails, skip to next audio type
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, typesToPlay);
      return;
    }
    
    if (!audioUrls || !audioUrls.primary) {
      // If URL generation fails, skip to next audio type
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, typesToPlay);
      return;
    }

    // Start with primary URL, will try fallback if needed
    let currentAudioUrl = audioUrls.primary;
    let triedFallback = false;

    console.log("[BlockWise] generated audioUrl", {
      blockId,
      ayahToPlay,
      currentAudioType,
      primary: audioUrls.primary,
      fallback: audioUrls.fallback
    });

    // Map audioType to currentAudioType format for display
    const audioTypeMap = {
      'quran': 'qirath',
      'translation': 'translation',
      'interpretation': 'interpretation'
    };
    const mappedAudioType = audioTypeMap[currentAudioType] || 'qirath';

    setCurrentAudioType(mappedAudioType);
    setCurrentAyahInBlock(ayahToPlay);
    // FIXED: Don't reset interpretation number here - it should only reset when moving to a new ayah

    // CRITICAL FIX: Remove old event handlers before adding new ones to prevent multiple triggers
    try {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    } catch (error) {
      console.warn('[BlockWise] Error clearing audio handlers:', error);
    }

    // Add timeout to detect stuck audio loading (missing files)
    let loadTimeout = null;
    const clearLoadTimeout = () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        loadTimeout = null;
      }
    };

    // Helper function to try loading audio with fallback support
    const tryLoadAudio = (urlToTry, isFallback = false) => {
      if (!audioRef.current) return;
      
      // Reset fallback flag when starting a new primary audio load
      if (!isFallback) {
        isTryingFallbackRef.current = false;
      }
      
      // Clear previous handlers
      try {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      } catch (error) {
        console.warn('[BlockWise] Error clearing audio handlers:', error);
      }
      
      // Set up event handlers
      audioRef.current.onended = () => {
        clearLoadTimeout();
        console.log('[BlockWise] Audio ended', {
          blockId,
          ayahToPlay,
          audioTypeIndex,
          currentAudioType,
          url: urlToTry,
          isFallback,
          playingBlock: playingBlockRef.current,
          isContinuousPlay: isContinuousPlayRef.current,
          audioTypes: activeAudioTypes,
          totalTypes: activeAudioTypes.length,
          isProcessingNext: isProcessingNextRef.current
        });
        
        // Guard against duplicate calls when already processing next move
        if (isProcessingNextRef.current) {
          console.warn('[BlockWise] onended handler aborted - already processing next move');
          return;
        }
        
        // Use refs instead of state for reliability (state might be stale)
        const shouldContinue = isContinuousPlayRef.current && playingBlockRef.current === blockId;
        
        if (shouldContinue) {
          console.log('[BlockWise] Continuing to next audio type/ayah');
          playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
        } else {
          console.warn('[BlockWise] Not continuing - state mismatch', {
            isContinuousPlay: isContinuousPlayRef.current,
            playingBlock: playingBlockRef.current,
            blockId,
            ayahToPlay
          });
        }
      };

      audioRef.current.onerror = (error) => {
        clearLoadTimeout();
        const audioElement = audioRef.current;
        
        // Check if we should try fallback for Malayalam translation
        // Guard against multiple handlers triggering fallback simultaneously
        if (!isFallback && !isTryingFallbackRef.current && currentAudioType === 'translation' && translationLanguage === 'mal' && audioUrls.fallback) {
          // Mark that we're trying fallback to prevent duplicate attempts
          isTryingFallbackRef.current = true;
          console.log('[BlockWise] Primary Malayalam translation audio failed, trying fallback:', audioUrls.fallback);
          // Reset audio element before trying fallback
          if (audioElement) {
            try {
              audioElement.pause();
              audioElement.currentTime = 0;
              // Clear error state by removing src and reloading
              audioElement.src = '';
              audioElement.load();
            } catch (resetError) {
              console.warn('[BlockWise] Error resetting audio for fallback:', resetError);
            }
          }
          // Try fallback URL - this will set up new handlers and play the fallback
          // IMPORTANT: Return early to prevent moving to next audio type
          tryLoadAudio(audioUrls.fallback, true);
          return; // Exit early - don't continue to next audio type
        }
        
        // If fallback attempt was already triggered by another handler, just return
        if (!isFallback && isTryingFallbackRef.current) {
          if (import.meta.env.DEV) {
            console.log('[BlockWise] onerror handler aborted - fallback already being attempted');
          }
          return;
        }
        
        // Handle error (no fallback or fallback also failed)
        // Only reach here if: isFallback is true OR no fallback available OR fallback also failed
        // If this is a fallback that failed, log it and then move to next audio type
        if (isFallback && currentAudioType === 'translation' && translationLanguage === 'mal') {
          console.log('[BlockWise] Fallback Malayalam translation audio also failed, moving to next audio type');
          // Reset fallback flag when fallback fails
          isTryingFallbackRef.current = false;
        }
        
        if (audioElement && audioElement.error) {
          const errorCode = audioElement.error.code;
          // Error codes: 1=MEDIA_ERR_ABORTED, 2=MEDIA_ERR_NETWORK, 3=MEDIA_ERR_DECODE, 4=MEDIA_ERR_SRC_NOT_SUPPORTED
          if (errorCode === 2 || errorCode === 4) {
            if (import.meta.env.DEV) {
              console.log('[BlockWise] Audio file not found (expected), skipping:', urlToTry);
            }
            
            // If it's an interpretation that doesn't exist, skip to next audio type
            if (currentAudioType === 'interpretation') {
              if (import.meta.env.DEV) {
                console.log('[BlockWise] Interpretation not found, skipping to next audio type', {
                  currentInterpretationNumber,
                  ayahToPlay,
                  audioUrl: urlToTry,
                  audioTypeIndex
                });
              }
              isProcessingNextRef.current = true;
              if (audioRef.current) {
                try {
                  audioRef.current.pause();
                  audioRef.current.onended = null;
                  audioRef.current.onerror = null;
                } catch (error) {
                  console.warn('[BlockWise] Error cleaning up audio on interpretation error:', error);
                }
              }
              setCurrentInterpretationNumber(1);
              const shouldContinue = isContinuousPlayRef.current && playingBlockRef.current === blockId;
              if (shouldContinue) {
                setTimeout(() => {
                  playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
                  setTimeout(() => {
                    isProcessingNextRef.current = false;
                  }, 300);
                }, 200);
                return;
              } else {
                isProcessingNextRef.current = false;
              }
            }
          } else {
            console.error('[BlockWise] Unexpected audio error:', {
              errorCode: audioElement.error?.code,
              audioUrl: urlToTry,
              currentAudioType
            });
          }
        } else {
          console.error('[BlockWise] Audio error event (unknown error):', urlToTry, error);
        }
        
        const shouldContinue = isContinuousPlayRef.current && playingBlockRef.current === blockId && !isProcessingNextRef.current;
        
        if (shouldContinue) {
          setTimeout(() => {
            playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
          }, 200);
        } else {
          if (import.meta.env.DEV && isProcessingNextRef.current) {
            console.log('[BlockWise] Not continuing after error - already processing (expected)');
          } else if (!isProcessingNextRef.current) {
            console.warn('[BlockWise] Not continuing after error - state mismatch', {
              isContinuousPlay: isContinuousPlayRef.current,
              playingBlock: playingBlockRef.current,
              blockId
            });
          }
        }
      };

      // Reset guard flag when audio is ready to play
      const handleCanPlay = () => {
        isProcessingNextRef.current = false;
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackSpeedRef.current;
        }
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      };
      audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
      
      // Clear timeout when audio successfully loads
      audioRef.current.addEventListener('canplay', clearLoadTimeout, { once: true });
      audioRef.current.addEventListener('loadeddata', clearLoadTimeout, { once: true });
      
      // Set playback rate when metadata is loaded
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackSpeedRef.current;
        }
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });

      // Add timeout to detect stuck audio loading (missing files)
      const startLoadTimeout = () => {
        clearLoadTimeout(); // Clear any existing timeout
        loadTimeout = setTimeout(() => {
          if (audioRef.current && audioRef.current.readyState < 2 && 
              playingBlock === blockId && currentAyahInBlock === ayahToPlay && isContinuousPlay) {
            // Don't timeout if we're trying a fallback - give it more time
            if (isFallback && currentAudioType === 'translation' && translationLanguage === 'mal') {
              console.log('[BlockWise] Fallback audio still loading, extending timeout...');
              // Extend timeout for fallback
              clearLoadTimeout();
              loadTimeout = setTimeout(() => {
                if (audioRef.current && audioRef.current.readyState < 2 && 
                    playingBlock === blockId && currentAyahInBlock === ayahToPlay && isContinuousPlay) {
                  console.warn('[BlockWise] Fallback audio load timeout (file may be missing):', urlToTry);
                  // Only skip to next audio type if fallback also fails
                  playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
                }
              }, 5000); // Additional 5 seconds for fallback
              return;
            }
            console.warn('[BlockWise] Audio load timeout (file may be missing):', urlToTry);
            // Check if we should try fallback before skipping
            // Guard against multiple handlers triggering fallback simultaneously
            if (!isFallback && !isTryingFallbackRef.current && currentAudioType === 'translation' && translationLanguage === 'mal' && audioUrls.fallback) {
              // Mark that we're trying fallback to prevent duplicate attempts
              isTryingFallbackRef.current = true;
              console.log('[BlockWise] Primary audio timeout, trying fallback:', audioUrls.fallback);
              tryLoadAudio(audioUrls.fallback, true);
              return;
            }
            
            // If fallback attempt was already triggered by another handler, just skip to next
            if (!isFallback && isTryingFallbackRef.current) {
              if (import.meta.env.DEV) {
                console.log('[BlockWise] Timeout handler aborted - fallback already being attempted');
              }
              return;
            }
            // Skip to next audio type
            playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
          }
        }, 5000); // 5 second timeout
      };

      audioRef.current.src = urlToTry;
      audioRef.current.playbackRate = playbackSpeedRef.current;
      audioRef.current.load();
      startLoadTimeout();
      
      audioRef.current.play().catch(err => {
        clearLoadTimeout();
        
        // Check if we should try fallback for Malayalam translation
        // Guard against multiple handlers triggering fallback simultaneously
        if (!isFallback && !isTryingFallbackRef.current && currentAudioType === 'translation' && translationLanguage === 'mal' && audioUrls.fallback) {
          // Mark that we're trying fallback to prevent duplicate attempts
          isTryingFallbackRef.current = true;
          console.log('[BlockWise] Primary Malayalam translation audio play failed, trying fallback:', audioUrls.fallback);
          // Reset audio element before trying fallback
          if (audioRef.current) {
            try {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              // Clear error state by removing src and reloading
              audioRef.current.src = '';
              audioRef.current.load();
            } catch (resetError) {
              console.warn('[BlockWise] Error resetting audio for fallback:', resetError);
            }
          }
          // Try fallback URL - this will set up new handlers and play the fallback
          // IMPORTANT: Return early to prevent moving to next audio type
          tryLoadAudio(audioUrls.fallback, true);
          return; // Exit early - don't continue to next audio type
        }
        
        // If fallback attempt was already triggered by another handler, just return
        if (!isFallback && isTryingFallbackRef.current) {
          if (import.meta.env.DEV) {
            console.log('[BlockWise] play().catch() handler aborted - fallback already being attempted');
          }
          return;
        }
        
        // Guard against duplicate calls if we're already processing an error
        if (isProcessingNextRef.current) {
          if (import.meta.env.DEV) {
            console.log('[BlockWise] play().catch() aborted - already processing next move (expected)');
          }
          setTimeout(() => {
            isProcessingNextRef.current = false;
          }, 100);
          return;
        }
        
        // Only log unexpected errors (skip AbortError if it's from our reset)
        if (err.name === 'AbortError' && isFallback) {
          // AbortError during fallback might be from reset, ignore it
          console.log('[BlockWise] AbortError during fallback (likely from reset), ignoring');
          return;
        }
        
        if (err.name !== 'NotSupportedError' && err.name !== 'AbortError') {
          console.error('[BlockWise] Error playing audio:', err.name, err.message, urlToTry);
        } else if (import.meta.env.DEV && err.name !== 'AbortError') {
          console.log('[BlockWise] Audio file not supported (expected for missing files):', urlToTry);
        }
        
        // Only move to next audio type if fallback also failed or no fallback available
        const shouldContinue = isContinuousPlayRef.current && playingBlockRef.current === blockId;
        
        if (shouldContinue) {
          isProcessingNextRef.current = false;
          setTimeout(() => {
            playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
          }, 200);
        } else {
          isProcessingNextRef.current = false;
          console.warn('[BlockWise] Not continuing after play error - state mismatch', {
            blockId,
            playingBlockRef: playingBlockRef.current,
            isContinuousPlayRef: isContinuousPlayRef.current
          });
        }
      });
    };

    // Start loading with primary URL
    tryLoadAudio(currentAudioUrl, false);
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahAudio = (blockId, ayahNumber, audioTypeIndex = 0, typesOverride = null) => {
    playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex, typesOverride);
  };

  // Old functions removed - now handled by playAyahAudio with audioTypes array

  // Function to move to the next ayah in the block or the next block
  const moveToNextAyahOrBlock = (currentAyahOverride = null, activeAudioTypes = null) => {
    // Guard against duplicate calls
    if (isProcessingNextRef.current) {
      console.warn('[BlockWise] moveToNextAyahOrBlock aborted - already processing next', {
        currentAyahOverride,
        currentAyahInBlock
      });
      return;
    }

    const effectiveCurrentAyah = currentAyahOverride ?? currentAyahInBlock;
    // Use ref instead of state to avoid stale closures
    const currentPlayingBlock = playingBlockRef.current || playingBlock;
    
    if (!currentPlayingBlock || !effectiveCurrentAyah) {
      console.warn('[BlockWise] moveToNextAyahOrBlock aborted - no playing block or ayah', {
        currentPlayingBlock,
        effectiveCurrentAyah,
        playingBlock,
        playingBlockRef: playingBlockRef.current
      });
      return;
    }

    // Set guard flag
    isProcessingNextRef.current = true;

    const blockInfo = blockRanges.find(b => (b.ID || b.id) === currentPlayingBlock);
    if (!blockInfo) {
      isProcessingNextRef.current = false; // Reset guard flag on early return
      return;
    }

    const ayaTo = blockInfo.AyaTo || blockInfo.ayato || blockInfo.to;
    const currentAyahNumber = normalizeAyahNumber(effectiveCurrentAyah, null);
    const ayaToNumber = normalizeAyahNumber(ayaTo, currentAyahNumber);

    if (currentAyahNumber === null || ayaToNumber === null) {
      console.warn("[BlockWise] moveToNextAyahOrBlock aborted - invalid ayah numbers", {
        currentPlayingBlock,
        currentAyahInBlock: effectiveCurrentAyah,
        ayaTo
      });
      isProcessingNextRef.current = false; // Reset guard flag on early return
      return;
    }

    const nextAyah = currentAyahNumber + 1;

    console.log("[BlockWise] moveToNextAyahOrBlock", {
      currentPlayingBlock,
      currentAyahNumber,
      nextAyah,
      ayaToNumber,
      isContinuousPlay: isContinuousPlayRef.current
    });

    // Check if there are more ayahs in this block
    if (nextAyah <= ayaToNumber) {
      // Reset interpretation number for new ayah
      setCurrentInterpretationNumber(1);
      // Play the next ayah in the same block (start with first audio type)
      // Guard flag will be reset when audio starts playing (in playAyahAudioWithTypes)
      playAyahAudio(currentPlayingBlock, nextAyah, 0, activeAudioTypes);
    } else {
      // Block is finished, move to next block or stop
      // Use ref to check continuous play status
      if (isContinuousPlayRef.current) {
        // Clean up current audio before moving to next block
        if (audioRef.current) {
          try {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
          } catch (error) {
            console.warn('[BlockWise] Error cleaning up audio before next block:', error);
          }
        }
        setCurrentInterpretationNumber(1); // Reset for next block
        // Reset guard flag before calling playNextBlock
        // playNextBlock will set it again when it starts
        isProcessingNextRef.current = false;
        // Small delay to ensure cleanup completes
        setTimeout(() => {
          playNextBlock();
        }, 50);
      } else {
        if (audioRef.current) {
          try {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
          } catch (error) {
            console.warn('[BlockWise] Error stopping audio:', error);
          }
        }
        setPlayingBlock(null);
        setCurrentAudioType(null);
        setCurrentAyahInBlock(null);
        setCurrentInterpretationNumber(1);
        setIsPaused(false);
        // Update refs
        playingBlockRef.current = null;
        isContinuousPlayRef.current = false;
        // Reset guard flag
        isProcessingNextRef.current = false;
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
      }
    }
  };

  // Function to move to previous ayah in the block or previous block
  const moveToPreviousAyahOrBlock = (currentAyahOverride = null, activeAudioTypes = null) => {
    const effectiveCurrentAyah = currentAyahOverride ?? currentAyahInBlock;
    if (!playingBlock || !effectiveCurrentAyah) {
      return;
    }

    const blockInfo = blockRanges.find(b => (b.ID || b.id) === playingBlock);
    if (!blockInfo) {
      return;
    }

    const ayaFrom = blockInfo.AyaFrom || blockInfo.ayafrom || blockInfo.from || 1;
    const currentAyahNumber = normalizeAyahNumber(effectiveCurrentAyah, null);
    const ayaFromNumber = normalizeAyahNumber(ayaFrom, 1);

    if (currentAyahNumber === null || ayaFromNumber === null) {
      console.warn("[BlockWise] moveToPreviousAyahOrBlock aborted - invalid ayah numbers", {
        playingBlock,
        currentAyahInBlock: effectiveCurrentAyah,
        ayaFrom
      });
      return;
    }

    const previousAyah = currentAyahNumber - 1;

    console.log("[BlockWise] moveToPreviousAyahOrBlock", {
      playingBlock,
      currentAyahNumber,
      previousAyah,
      ayaFromNumber,
      isContinuousPlay
    });
    // Check if there's a previous ayah in this block
    if (previousAyah >= ayaFromNumber) {
      // Reset interpretation number for new ayah
      setCurrentInterpretationNumber(1);
      // Play the previous ayah in the same block (start with first audio type)
      playAyahAudio(playingBlock, previousAyah, 0, activeAudioTypes);
    } else {
      // Need to go to previous block or stop
      if (isContinuousPlay) {
        setCurrentInterpretationNumber(1);
        playPreviousBlock();
      } else {
        // Stop at beginning of current block
        setPlayingBlock(null);
        setCurrentAudioType(null);
        setCurrentAyahInBlock(null);
        setCurrentInterpretationNumber(1);
        setIsPaused(false);
      }
    }
  };

  // Function to play previous block in continuous mode
  const playPreviousBlock = () => {
    if (!isContinuousPlay || !blockRanges || blockRanges.length === 0) return;

    const currentIndex = blockRanges.findIndex(block => {
      const blockId = block.ID || block.id;
      return blockId === playingBlock;
    });

    // Check if there's a previous block
    if (currentIndex > 0) {
      const previousBlock = blockRanges[currentIndex - 1];
      const previousBlockId = previousBlock.ID || previousBlock.id;
      const lastAyahRaw = previousBlock.AyaTo || previousBlock.ayato || previousBlock.to || 1;
      const lastAyah = normalizeAyahNumber(lastAyahRaw, 1);

      setIsContinuousPlay(true);
      setPlayingBlock(previousBlockId);
      setCurrentAyahInBlock(lastAyah);
      setCurrentInterpretationNumber(1);
      setIsPaused(false);
      // Update refs
      playingBlockRef.current = previousBlockId;
      isContinuousPlayRef.current = true;

      // Play the last ayah of the previous block
      playAyahAudio(previousBlockId, lastAyah);
    } else {
      // Already at first block, go to first ayah
      const firstBlock = blockRanges[0];
      const firstBlockId = firstBlock.ID || firstBlock.id;
      const firstAyahRaw = firstBlock.AyaFrom || firstBlock.ayafrom || firstBlock.from || 1;
      const firstAyah = normalizeAyahNumber(firstAyahRaw, 1);

      setPlayingBlock(firstBlockId);
      setCurrentAyahInBlock(firstAyah);
      setCurrentInterpretationNumber(1);
      playAyahAudio(firstBlockId, firstAyah);
    }
  };

  // Function to play next block in continuous mode
  const playNextBlock = () => {
    // Guard against duplicate calls
    if (isProcessingNextRef.current) {
      console.warn('[BlockWise] playNextBlock aborted - already processing next');
      return;
    }

    // Use ref instead of state to avoid stale closures
    const shouldContinue = isContinuousPlayRef.current;
    
    if (!shouldContinue || !blockRanges || blockRanges.length === 0) {
      console.warn('[BlockWise] playNextBlock aborted - invalid state', {
        isContinuousPlay: isContinuousPlayRef.current,
        isContinuousPlayState: isContinuousPlay,
        blockRangesLength: blockRanges?.length
      });
      isProcessingNextRef.current = false; // Reset guard if aborted
      return;
    }

    // Set guard flag
    isProcessingNextRef.current = true;

    // Use ref instead of state to avoid stale closures
    const currentPlayingBlock = playingBlockRef.current || playingBlock;
    
    const currentIndex = blockRanges.findIndex(block => {
      const blockId = block.ID || block.id;
      return blockId === currentPlayingBlock;
    });

    console.log('[BlockWise] playNextBlock', {
      currentIndex,
      currentPlayingBlock,
      playingBlock,
      playingBlockRef: playingBlockRef.current,
      blockRangesLength: blockRanges.length
    });

    // Check if there's a next block
    if (currentIndex !== -1 && currentIndex < blockRanges.length - 1) {
      const nextBlock = blockRanges[currentIndex + 1];
      const nextBlockId = nextBlock.ID || nextBlock.id;
      
      if (!nextBlockId) {
        console.error('[BlockWise] playNextBlock - next block has no ID', nextBlock);
        return;
      }

      // Clean up current audio before switching blocks
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
          audioRef.current.src = '';
          audioRef.current.load();
        } catch (error) {
          console.warn('[BlockWise] Error cleaning up audio before next block:', error);
        }
      }

      // Small delay to ensure cleanup completes before starting next block
      setTimeout(() => {
        try {
          // Preserve audioTypes when moving to next block
          // Use the ref to preserve original audioTypes, fallback to state if ref is null
          const audioTypesToPreserve = preservedAudioTypesRef.current || audioTypes;
          // playBlockAudio will reset the guard flag when starting the new block
          playBlockAudio(nextBlockId, true, audioTypesToPreserve); // Keep continuous mode active and preserve audioTypes
        } catch (error) {
          console.error('[BlockWise] Error playing next block:', error);
          // Stop playback on error
          setPlayingBlock(null);
          setCurrentAudioType(null);
          setCurrentAyahInBlock(null);
          setCurrentInterpretationNumber(1);
          setIsContinuousPlay(false);
          setIsPaused(false);
          isProcessingNextRef.current = false; // Reset guard on error
          window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
        }
      }, 100);
    } else {
      // End of blocks, stop continuous play
      console.log('[BlockWise] playNextBlock - end of blocks reached');
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
        } catch (error) {
          console.warn('[BlockWise] Error stopping audio at end:', error);
        }
      }
      setPlayingBlock(null);
      setCurrentAudioType(null);
      setCurrentAyahInBlock(null);
      setCurrentInterpretationNumber(1);
      setIsContinuousPlay(false);
      setIsPaused(false);
      // Update refs
      playingBlockRef.current = null;
      isContinuousPlayRef.current = false;
      isProcessingNextRef.current = false; // Reset guard flag
      // Dispatch event to update header button
      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
    }
  };

  // Handle main play/pause audio button (same pattern as Reading.jsx)
  const handlePlayAudio = () => {
    if (!blockRanges || blockRanges.length === 0) {
      showError("No blocks available to play");
      return;
    }

    // Check if translation/interpretation audio is available (only for Malayalam)
    if (translationLanguage !== 'mal') {
      const languageName = getLanguageName(translationLanguage);
      showWarning(`${languageName} translation and explanation audio is coming soon. Currently, only Malayalam translation and explanation audio is available.`);
      return;
    }

    try {
      if (isContinuousPlay) {
        // Pause playback but keep the current position
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsContinuousPlay(false);
        setIsPaused(true);
        // Update refs
        isContinuousPlayRef.current = false;
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
        // Don't clear playingBlock, currentAyahInBlock - keep them for resume
      } else {
        // Resume playback from current position or start from beginning
        if (playingBlock && currentAyahInBlock) {
          // Resume from current position
          setIsContinuousPlay(true);
          setIsPaused(false);
          // Update refs
          isContinuousPlayRef.current = true;
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              // Dispatch event to update header button
              window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
            }).catch(err => {
              console.error('Error resuming audio:', err);
            });
          }
        } else {
          // Start from first block
          setIsContinuousPlay(true);
          setIsPaused(false);
          // Update refs
          isContinuousPlayRef.current = true;
          const firstBlockId = blockRanges[0].ID || blockRanges[0].id;
          playBlockAudio(firstBlockId);
          // Dispatch event to update header button (will be dispatched when audio actually starts)
        }
      }
    } catch (error) {
      console.error('Error in handlePlayAudio:', error);
      setIsContinuousPlay(false);
      setPlayingBlock(null);
      setCurrentAyahInBlock(null);
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

  // Dispatch audio state changes when isContinuousPlay changes
  useEffect(() => {
    const isPlaying = isContinuousPlay && !isPaused && playingBlock !== null;
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying } }));
  }, [isContinuousPlay, isPaused, playingBlock]);

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

  // Function to stop playback completely (same as Reading.jsx stopAudio)
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Clear handlers
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    setIsContinuousPlay(false);
    setPlayingBlock(null);
    setCurrentAudioType(null);
    setCurrentAyahInBlock(null);
    // Update refs
    playingBlockRef.current = null;
    isContinuousPlayRef.current = false;
    isProcessingNextRef.current = false; // Reset guard flag
    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
    setCurrentInterpretationNumber(1);
    setIsPaused(false);
  };

  // Stop audio when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      audioManager.stopAll();
      stopPlayback();
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Stop audio on unmount (navigating away)
  useEffect(() => {
    return () => {
      try {
        stopPlayback();
      } catch (e) { }
    };
  }, []);

  // Audio chaining is now handled inside playAyahAudio function with audioTypes array

  // Cleanup audio when surahId changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingBlock(null);
        setCurrentAudioType(null);
        setCurrentAyahInBlock(null);
        setCurrentInterpretationNumber(1);
        setIsContinuousPlay(false);
        setIsPaused(false);
        // Update refs
        playingBlockRef.current = null;
        isContinuousPlayRef.current = false;
        isProcessingNextRef.current = false; // Reset guard flag
      }
    };
  }, [surahId]);

  // Save reciter to localStorage when it changes and dispatch event
  useEffect(() => {
    localStorage.setItem("reciter", selectedQirath);
    // Dispatch event to sync with other components
    window.dispatchEvent(new CustomEvent('reciterChange', { detail: { reciter: selectedQirath } }));
  }, [selectedQirath]);

  // Listen for reciter changes from other components (Settings, StickyAudioPlayer)
  useEffect(() => {
    const handleReciterChange = (event) => {
      const newReciter = event.detail.reciter;
      if (newReciter !== selectedQirath) {
        setSelectedQirath(newReciter);
      }
    };

    window.addEventListener('reciterChange', handleReciterChange);
    return () => {
      window.removeEventListener('reciterChange', handleReciterChange);
    };
  }, [selectedQirath]);

  // Restart audio when selectedQirath or audioTypes changes during playback
  useEffect(() => {
    if (playingBlock && currentAyahInBlock && audioRef.current && isContinuousPlay) {
      // Restart audio with new settings for the current ayah (start with first audio type)
      playAyahAudio(playingBlock, currentAyahInBlock, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQirath, audioTypes]);

  // Update playback speed ref when it changes
  useEffect(() => {
    playbackSpeedRef.current = playbackSpeed;
  }, [playbackSpeed]);

  // Save playback speed to localStorage when it changes and dispatch event
  useEffect(() => {
    localStorage.setItem("playbackSpeed", playbackSpeed.toString());
    // Dispatch event to sync with other components
    window.dispatchEvent(new CustomEvent('playbackSpeedChange', { detail: { playbackSpeed } }));
  }, [playbackSpeed]);

  // Listen for playback speed changes from other components (Settings, StickyAudioPlayer)
  useEffect(() => {
    const handlePlaybackSpeedChange = (event) => {
      const newSpeed = event.detail.playbackSpeed;
      if (newSpeed !== playbackSpeed) {
        setPlaybackSpeed(newSpeed);
      }
    };

    window.addEventListener('playbackSpeedChange', handlePlaybackSpeedChange);
    return () => {
      window.removeEventListener('playbackSpeedChange', handlePlaybackSpeedChange);
    };
  }, [playbackSpeed]);

  // Apply playback speed when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    hydratedBlockCacheRef.current = false;
  }, [surahId, translationLanguage]);

  useEffect(() => {
    setAutoRetryAttempted(false);
  }, [surahId]);

  useEffect(() => {
    if (!surahId) {
      return;
    }

    const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';
    if (!supportsBlockwise) {
      return;
    }

    const cached = getBlockViewCache?.(surahId, translationLanguage);
    if (cached) {
      hydratedBlockCacheRef.current = true;
      setBlockData(cached.blockData || null);
      setBlockRanges(cached.blockRanges || []);
      setArabicVerses(cached.arabicVerses || []);
      setBlockTranslations(cached.blockTranslations || {});
      setError(null);
      setLoadingBlocks(new Set());

      const cachedTranslationCount = cached.blockTranslations
        ? Object.keys(cached.blockTranslations).length
        : 0;
      const hasCompleteData = Boolean(cached.__meta?.isComplete && cachedTranslationCount > 0);

      setLoading(!hasCompleteData);
      hasFetchedRef.current = hasCompleteData;
    }
  }, [surahId, translationLanguage, getBlockViewCache]);

  // Fetch block-wise data
  useEffect(() => {
    const loadBlockWiseData = async () => {
      if (!surahId || hasFetchedRef.current || surahs.length === 0) return;

      // 🔒 CRITICAL: Check if language supports blockwise before fetching
      const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';
      if (!supportsBlockwise) {
        console.log(`⚠️ BlockWise: Language '${translationLanguage}' doesn't support blockwise. Skipping fetch.`);
        setLoading(false);
        return;
      }

      // Mark as fetched to prevent duplicate calls in StrictMode
      hasFetchedRef.current = true;

      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch aya ranges and surah info
        const [ayaRangesResponse, arabicResponse] =
          await Promise.all([
            fetchAyaRanges(parseInt(surahId), translationLanguage || 'mal'),
            fetchArabicVerses(parseInt(surahId)),
          ]);

        // Get surah info from cached data
        const surahInfo = surahs.find(
          (s) => s.number === parseInt(surahId)
        );

        setBlockData({
          surahInfo: surahInfo || {
            number: parseInt(surahId),
            arabic: "القرآن",
            type: 'Makki', // Default fallback
          },
        });

        setArabicVerses(arabicResponse || []);
        setBlockRanges(ayaRangesResponse || []);

        // Step 2: TRUE LAZY LOADING - Load each block individually and update UI immediately
        if (ayaRangesResponse && ayaRangesResponse.length > 0) {

          const processBlockTranslation = async (block, blockIndex) => {
            const rawAyaFrom = block.AyaFrom || block.ayafrom || block.from;
            const rawAyaTo = block.AyaTo || block.ayato || block.to;

            if (rawAyaFrom === undefined || rawAyaFrom === null || rawAyaTo === undefined || rawAyaTo === null) {
              return;
            }

            const normalizedAyaFrom = Number.parseInt(rawAyaFrom, 10);
            const normalizedAyaTo = Number.parseInt(rawAyaTo, 10);
            const hasNumericRange = Number.isFinite(normalizedAyaFrom) && Number.isFinite(normalizedAyaTo);
            const range = hasNumericRange
              ? `${normalizedAyaFrom}-${normalizedAyaTo}`
              : `${rawAyaFrom}-${rawAyaTo}`;
            const blockId =
              block.ID ||
              block.id ||
              range ||
              `block-${blockIndex}`;
            const ayaFrom = hasNumericRange ? normalizedAyaFrom : rawAyaFrom;
            const ayaTo = hasNumericRange ? normalizedAyaTo : rawAyaTo;

            // Check if this block is already being processed (prevent duplicate API calls)
            if (processedBlocksRef.current.has(blockId)) {
              return; // Skip if already processed
            }

            // Mark as being processed
            processedBlocksRef.current.add(blockId);

            try {
              // Mark this specific block as loading
              setLoadingBlocks(prev => new Set([...prev, blockId]));

              // Fetch translation directly from API
              let translationData;
              const currentLang = translationLanguage || 'mal';

              // Fetch from API
              translationData = await fetchAyaTranslation(
                parseInt(surahId),
                range,
                currentLang
              );

              // IMMEDIATE UI UPDATE: Update this block's translation as soon as it loads
              // Only update if blockId doesn't already have data (prevent overwriting)
              setBlockTranslations(prev => {
                if (prev[blockId]?.data) {
                  // Already has data, don't overwrite
                  return prev;
                }
                return {
                  ...prev,
                  [blockId]: {
                    range: range,
                    ayaFrom: ayaFrom,
                    ayaTo: ayaTo,
                    data: translationData,
                  }
                };
              });

              // Remove from loading set
              setLoadingBlocks(prev => {
                const updated = new Set(prev);
                updated.delete(blockId);
                return updated;
              });


            } catch (error) {
              // Only log timeout errors once (errors are already logged in fetchAyaTranslation with retry info)
              // This reduces console spam while still showing important errors
              if (!error.message?.includes('timeout')) {
                console.error(`❌ BlockWise: Failed to load block ${range}:`, error.message);
              }

              // Remove from loading set even on error
              setLoadingBlocks(prev => {
                const updated = new Set(prev);
                updated.delete(blockId);
                return updated;
              });
            }
          };

          // REQUEST THROTTLING: Adaptive - Start conservative (2), increase to 5 after first successful loads
          // This prevents timeouts on first load when database is cold, then speeds up after connections warm up
          const INITIAL_CONCURRENT = 2;  // Start with 2 for reliable first load
          const MAX_CONCURRENT = 5;      // Increase to 5 after first few succeed
          const SUCCESS_THRESHOLD = 3;   // Increase concurrency after 3 successful loads
          
          let MAX_CONCURRENT_REQUESTS = INITIAL_CONCURRENT;  // Start conservative
          let successfulLoads = 0;  // Track successful background block loads
          const requestQueue = [];
          let activeRequests = 0;

          const processWithThrottle = async (block, blockIndex) => {
            return new Promise((resolve) => {
              const execute = async () => {
                activeRequests++;
                try {
                  await processBlockTranslation(block, blockIndex);
                  // Track successful loads and increase concurrency after threshold
                  successfulLoads++;
                  if (successfulLoads === SUCCESS_THRESHOLD && MAX_CONCURRENT_REQUESTS < MAX_CONCURRENT) {
                    MAX_CONCURRENT_REQUESTS = MAX_CONCURRENT;
                    console.log(`🚀 Increased concurrent requests from ${INITIAL_CONCURRENT} to ${MAX_CONCURRENT} after ${SUCCESS_THRESHOLD} successful loads`);
                  }
                } catch (error) {
                  // Error already handled in processBlockTranslation
                } finally {
                  activeRequests--;
                  // Process next item in queue
                  if (requestQueue.length > 0) {
                    const next = requestQueue.shift();
                    next();
                  }
                  resolve();
                }
              };

              if (activeRequests < MAX_CONCURRENT_REQUESTS) {
                execute();
              } else {
                requestQueue.push(execute);
              }
            });
          };

          // VIEWPORT-BASED LOADING: Load visible blocks first, then background
          const prioritizeBlocks = (blocks) => {
            // First 3 blocks are likely visible (increased from 2 for better initial experience)
            const visibleBlocks = blocks.slice(0, 3);
            const backgroundBlocks = blocks.slice(3);

            return { visibleBlocks, backgroundBlocks };
          };

          const { visibleBlocks, backgroundBlocks } = prioritizeBlocks(ayaRangesResponse);

          // Load visible blocks first (high priority) - no throttling for initial load
          // These load in parallel for fastest first render
          const visiblePromises = visibleBlocks.map((block, index) => processBlockTranslation(block, index));

          // Load background blocks immediately after visible blocks start (reduced delay)
          // Start background loading as soon as visible blocks are initiated (no delay)
          backgroundBlocks.forEach((block, index) => {
            // Minimal stagger: 50ms between batches (reduced from 200ms) for faster loading
            setTimeout(() => {
              processWithThrottle(block, index + visibleBlocks.length);
            }, 50 * Math.floor(index / MAX_CONCURRENT_REQUESTS));
          });

          // Monitor visible loading completion
          Promise.allSettled(visiblePromises).then((results) => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
          });
        }
      } catch (err) {
        // Provide user-friendly error messages
        let errorMessage = err.message;
        if (err.message?.includes('timeout') || err.message?.includes('Request timeout')) {
          errorMessage = `The server is taking longer than expected to respond. Please try again in a moment. If the problem persists, the English blockwise data may be temporarily unavailable.`;
        } else if (err.message?.includes('Failed to fetch') || err.message?.includes('Network error')) {
          errorMessage = `Unable to connect to the server. Please check your internet connection and try again.`;
        } else if (err.message?.includes('HTTP error')) {
          errorMessage = `Server error: ${err.message}. Please try again later.`;
        }
        setError(errorMessage);
        console.error("Error fetching block-wise data:", err);
        hasFetchedRef.current = false; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };

    loadBlockWiseData();

    // Reset hasFetchedRef when surahId changes
    return () => {
      hasFetchedRef.current = false;
    };
  }, [surahId, surahs, translationLanguage, blockReloadToken]);

  useEffect(() => {
    const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';
    if (
      !surahId ||
      !supportsBlockwise ||
      !setBlockViewCache ||
      loading ||
      !Array.isArray(blockRanges) ||
      blockRanges.length === 0
    ) {
      return;
    }

    const blockTranslationsCount = blockTranslations
      ? Object.keys(blockTranslations).length
      : 0;
    const isComplete =
      blockTranslationsCount > 0 &&
      (!loadingBlocks || loadingBlocks.size === 0);

    setBlockViewCache(surahId, translationLanguage, {
      blockData,
      blockRanges,
      arabicVerses,
      blockTranslations,
      __meta: { isComplete },
    });
  }, [
    surahId,
    translationLanguage,
    blockData,
    blockRanges,
    arabicVerses,
    blockTranslations,
    loading,
    loadingBlocks,
    setBlockViewCache,
  ]);

  useEffect(() => {
    const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';
    const hasBlocks = Array.isArray(blockRanges) && blockRanges.length > 0;
    const isStillLoading = loading || (loadingBlocks && loadingBlocks.size > 0);
    const translationCount = blockTranslations ? Object.keys(blockTranslations).length : 0;

    if (
      !surahId ||
      !supportsBlockwise ||
      !hasBlocks ||
      isStillLoading ||
      translationCount > 0 ||
      autoRetryAttempted
    ) {
      return;
    }

    setAutoRetryAttempted(true);
    triggerBlockwiseReload("auto");
  }, [
    surahId,
    translationLanguage,
    blockRanges,
    blockTranslations,
    loading,
    loadingBlocks,
    autoRetryAttempted,
    triggerBlockwiseReload,
  ]);

  // Reset translations only when language or surah actually changes.
  useEffect(() => {
    const languageChanged = previousLanguageRef.current !== translationLanguage;
    const surahChanged = previousSurahRef.current !== surahId;

    if (!languageChanged && !surahChanged) {
      return;
    }

    previousLanguageRef.current = translationLanguage;
    previousSurahRef.current = surahId;

    if (blockRanges.length > 0) {
      setLoadingBlocks(buildBlockIdSet(blockRanges));
    } else {
      setLoadingBlocks(new Set());
    }

    setBlockTranslations({});
    processedBlocksRef.current.clear(); // Clear processed blocks when surah/language changes
    hasFetchedRef.current = false;
    setSelectedInterpretation(null);
    setShowInterpretation(false);
    setShowEnglishFootnoteModal(false);
    setEnglishFootnoteContent("");
    setEnglishFootnoteLoading(false);
    setEnglishFootnoteMeta({
      footnoteId: null,
      footnoteNumber: null,
      surah: null,
      ayah: null,
    });
    setAutoRetryAttempted(false);
  }, [translationLanguage, surahId, blockRanges, buildBlockIdSet]);

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

  // Handle clicks on English footnotes (E translation)
  // In blockwise view, English footnotes should open interpretations, not footnote modals
  useEffect(() => {
    if (translationLanguage !== 'E') {
      return;
    }

    const handleEnglishFootnoteClick = async (event) => {
      const target = event.target.closest(".english-footnote-link");
      if (!target) {
        return;
      }

      // In blockwise view (contextViewType === 'Block Wise'), open interpretation modal instead
      if (contextViewType === 'Block Wise') {
        event.preventDefault();
        event.stopPropagation();
        
        const footnoteId = target.getAttribute("data-footnote-id");
        const interpretationIdAttr = target.getAttribute("data-interpretation-id");
        const interpretationId = interpretationIdAttr && /^\d+$/.test(interpretationIdAttr)
          ? parseInt(interpretationIdAttr, 10)
          : null;
        const displayedNumberAttr =
          target.getAttribute("data-interpretation-number") ||
          target.getAttribute("data-footnote-number");
        const displayedNumber = displayedNumberAttr || (target.textContent || "").trim();
        const interpretationNumber = displayedNumber && /^\d+$/.test(displayedNumber)
          ? parseInt(displayedNumber, 10)
          : 1;
        const ayahNoAttr = target.getAttribute("data-ayah");
        const ayahNo = ayahNoAttr ? parseInt(ayahNoAttr, 10) : null;

        if (!displayedNumber && !footnoteId) {
          console.warn("[BlockWise] ⚠️ Missing displayed number and footnote ID");
          return;
        }

        // Find which block range this verse belongs to
        let blockRange = null;
        
        if (ayahNo && blockRanges.length > 0) {
          const block = blockRanges.find(b => {
            const from = b.AyaFrom || b.ayafrom || b.from || 0;
            const to = b.AyaTo || b.ayato || b.to || from;
            return ayahNo >= from && ayahNo <= to;
          });

          if (block) {
            const blockFrom = block.AyaFrom || block.ayafrom || block.from || 1;
            const blockTo = block.AyaTo || block.ayato || block.to || blockFrom;
            blockRange = `${blockFrom}-${blockTo}`;
          } else {
            console.warn("[BlockWise] ⚠️ Could not find block range for verse:", ayahNo, "available blocks:", blockRanges.map(b => ({
              from: b.AyaFrom || b.ayafrom || b.from,
              to: b.AyaTo || b.ayato || b.to
            })));
          }
        }
        
        // If we don't have ayah number or couldn't find block, try to find block from current displayed blocks
        if (!blockRange && blockRanges.length > 0) {
          // Try to find block by checking which block's translation contains this footnote
          // For now, use the first block as fallback
          const firstBlock = blockRanges[0];
          const blockFrom = firstBlock.AyaFrom || firstBlock.ayafrom || firstBlock.from || 1;
          const blockTo = firstBlock.AyaTo || firstBlock.ayato || firstBlock.to || blockFrom;
          blockRange = `${blockFrom}-${blockTo}`;
        }

        if (blockRange) {
          // Open interpretation modal with footnote ID for English footnotes
          setSelectedInterpretation({
            range: blockRange,
            interpretationNumber: interpretationNumber,
            footnoteId: footnoteId, // Pass footnote ID for English footnotes
            interpretationId: interpretationId,
          });

          return; // Don't open footnote modal
        } else {
          console.warn("[BlockWise] ⚠️ Could not determine block range, falling back to footnote modal");
          // Fall through to open footnote modal if we can't find block
        }
      }

      // In ayahwise view, open footnote modal as usual

      // In ayahwise view, open footnote modal as usual
      event.preventDefault();
      event.stopPropagation();

      const footnoteId = target.getAttribute("data-footnote-id");
      const interpretationIdAttr = target.getAttribute("data-interpretation-id");
      const interpretationId = interpretationIdAttr && /^\d+$/.test(interpretationIdAttr)
        ? parseInt(interpretationIdAttr, 10)
        : null;
      const footnoteNumber = target.getAttribute("data-footnote-number") || (target.textContent || "").trim();
      const interpretationNumberAttr =
        target.getAttribute("data-interpretation-number") || target.getAttribute("data-footnote-number");
      const interpretationNumber = interpretationNumberAttr && /^\d+$/.test(interpretationNumberAttr)
        ? parseInt(interpretationNumberAttr, 10)
        : null;
      const ayahNoAttr = target.getAttribute("data-ayah");
      const ayahNo = ayahNoAttr ? parseInt(ayahNoAttr, 10) : null;

      setEnglishFootnoteMeta({
        footnoteId: footnoteId,
        interpretationId: interpretationId,
        footnoteNumber: footnoteNumber || null,
        surah: surahId ? parseInt(surahId, 10) : null,
        ayah: ayahNo,
      });
      setEnglishFootnoteContent("Loading...");
      setEnglishFootnoteLoading(true);
      setShowEnglishFootnoteModal(true);

      try {
        let explanation = '';

        if (interpretationId) {
          explanation = await englishTranslationService.getInterpretationById(interpretationId);
        } else if (footnoteId) {
          explanation = await englishTranslationService.getExplanation(parseInt(footnoteId, 10));
        } else if (interpretationNumber && ayahNo) {
          explanation = await englishTranslationService.getInterpretationByNumber(
            parseInt(surahId, 10),
            ayahNo,
            interpretationNumber
          );
        } else {
          setEnglishFootnoteContent("Explanation not available.");
          return;
        }

        setEnglishFootnoteContent(explanation || "Explanation not available.");
      } catch (error) {
        console.error("Error fetching English footnote explanation:", error);
        setEnglishFootnoteContent(`Error loading explanation: ${error.message || error}`);
      } finally {
        setEnglishFootnoteLoading(false);
      }
    };

    document.addEventListener("click", handleEnglishFootnoteClick);
    return () => {
      document.removeEventListener("click", handleEnglishFootnoteClick);
    };
  }, [translationLanguage, surahId, contextViewType, blockRanges]);

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
          blockData?.surahInfo?.arabic || `Surah ${surahId}`
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

  const handleNumberClick = (number) => {
    setSelectedNumber(number);
    setShowInterpretation(true);
  };

  const getPlainTextFromHtml = (htmlContent) => {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const getRawTranslationText = (entry = {}) =>
    entry?.TranslationText ||
    entry?.translationText ||
    entry?.translation_text ||
    entry?.text ||
    "";

  const getVerseNumberFromEntry = (entry = {}, fallback) => {
    const rawVerseNumber =
      entry?.VerseNo ??
      entry?.Verse_Number ??
      entry?.verse_number ??
      entry?.VerseNumber ??
      entry?.ayah_number ??
      entry?.AyaId ??
      entry?.AyahId ??
      fallback;
    const parsed = Number.parseInt(rawVerseNumber, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const buildTranslationPlainText = (entries = [], fallbackEntry = null, rangeStart = 1) => {
    const sources = entries.length > 0 ? entries : fallbackEntry ? [fallbackEntry] : [];
    if (sources.length === 0) return "";

    return sources
      .map((item, idx) => {
        const rawText = getRawTranslationText(item);
        if (!rawText) return "";

        const plain = getPlainTextFromHtml(rawText).trim();
        if (!plain) return "";

        const verseNumber = getVerseNumberFromEntry(item, rangeStart + idx);
        const needsNumbering = sources.length > 1;
        return needsNumbering ? `${verseNumber}. ${plain}` : plain;
      })
      .filter(Boolean)
      .join("\n\n");
  };

  // Handle interpretation number click
  const handleInterpretationClick = (blockRange, interpretationNumber) => {
    setSelectedInterpretation({
      range: blockRange,
      interpretationNumber: interpretationNumber,
    });
  };

  // Helper function to parse translation HTML and make sup tags clickable
  // For Malayalam blockwise:
  //   - Treat ANY digit sequence 1–342, optionally followed by a/A (e.g. 25, 25a, 199A),
  //     as an interpretation marker – no need to inspect surrounding text.
  //   - 199 and 199A are distinct markers and must be preserved as-is.
  // For Hindi:
  //   - Match digit sequence followed by A or B (e.g. 25A, 18A, 20A, 27B)
  const parseTranslationWithClickableSup = (htmlContent, blockRange) => {
    if (!htmlContent) return "";

    let processedContent = String(htmlContent);
    
    // Preprocess: Convert escape sequences from database content
    // \n (newline) → <br> tag for line breaks
    // \t (tab) → single space
    processedContent = processedContent.replace(/\n/g, '<br>');
    processedContent = processedContent.replace(/\t/g, ' ');
    const lang = translationLanguage === 'E' ? 'en' : translationLanguage === 'hi' ? 'hi' : 'mal';
    const supTagStyle = 'cursor:pointer!important;background-color:transparent!important;color:rgb(41,169,199)!important;font-weight:600!important;text-decoration:none!important;border:none!important;display:inline!important;font-size:12px!important;vertical-align:super!important;line-height:1!important;position:relative!important;top:3px!important;z-index:10!important;transition:0.2s ease-in-out!important;';
    
    // Create a helper function to generate the sup tag
    const createSupTag = (token) => {
      // token is the full marker as it appears in the text (e.g. "25", "25a", "199A", "25A", "27B")
      return `<sup class="interpretation-link" data-interpretation="${token}" data-range="${blockRange}" data-lang="${lang}" data-interpretation-number="${token}" data-interpretation-label="${token}" title="Click to view interpretation ${token}" aria-label="Interpretation ${token}" style="${supTagStyle}">${token}</sup>`;
    };

    // For Hindi, match numbers followed by A or B (e.g. 25A, 18A, 27B)
    if (translationLanguage === 'hi') {
      const markerPattern = /(\d{1,3}[aAbB])/g;
      const matches = [];
      let match;

      while ((match = markerPattern.exec(processedContent)) !== null) {
        const token = match[1]; // e.g. "25A", "18A", "27B"

        // Extract numeric part
        const numericPartMatch = token.match(/^(\d{1,3})/);
        if (!numericPartMatch) continue;
        const baseNumber = parseInt(numericPartMatch[1], 10);

        // Only allow 1–342
        if (!(baseNumber >= 1 && baseNumber <= 342)) continue;

        const index = match.index;

        // Skip if inside an HTML tag (between '<' and '>')
        const beforeAll = processedContent.substring(0, index);
        const lastLt = beforeAll.lastIndexOf("<");
        const lastGt = beforeAll.lastIndexOf(">");
        if (lastLt > lastGt) {
          // We're currently inside a tag like <span attr="25A">
          continue;
        }

        // Skip if already inside a <sup>...</sup>
        const contextStart = Math.max(0, index - 200);
        const context = processedContent.substring(contextStart, index);
        const lastSupOpen = context.lastIndexOf("<sup");
        const lastSupClose = context.lastIndexOf("</sup>");
        if (lastSupOpen > lastSupClose) {
          continue;
        }

        matches.push({
          index,
          token,
          length: token.length,
        });
      }

      // Replace from right to left so indices stay valid
      for (let i = matches.length - 1; i >= 0; i--) {
        const { index, token, length } = matches[i];
        const before = processedContent.substring(0, index);
        const after = processedContent.substring(index + length);
        processedContent = before + createSupTag(token) + after;
      }

      return processedContent;
    }

    // For Malayalam and English, apply the simplified "marker token" logic:
    //   - Match any occurrence of 1–342, optionally followed by a/A.
    //   - Do NOT inspect surrounding text / punctuation; just avoid:
    //       * HTML tag contents
    //       * existing <sup>...</sup> regions
    if (translationLanguage === 'mal' || translationLanguage === 'E') {
      const markerPattern = /(\d{1,3}[aA]?)/g;
      const matches = [];
      let match;

      while ((match = markerPattern.exec(processedContent)) !== null) {
        const token = match[1]; // e.g. "25", "25a", "199A"

        // Extract numeric part
        const numericPartMatch = token.match(/^(\d{1,3})/);
        if (!numericPartMatch) continue;
        const baseNumber = parseInt(numericPartMatch[1], 10);

        // Only allow 1–342
        if (!(baseNumber >= 1 && baseNumber <= 342)) continue;

        const index = match.index;

        // Skip if inside an HTML tag (between '<' and '>')
        const beforeAll = processedContent.substring(0, index);
        const lastLt = beforeAll.lastIndexOf("<");
        const lastGt = beforeAll.lastIndexOf(">");
        if (lastLt > lastGt) {
          // We're currently inside a tag like <span attr="199">
          continue;
        }

        // Skip if already inside a <sup>...</sup>
        const contextStart = Math.max(0, index - 200);
        const context = processedContent.substring(contextStart, index);
        const lastSupOpen = context.lastIndexOf("<sup");
        const lastSupClose = context.lastIndexOf("</sup>");
        if (lastSupOpen > lastSupClose) {
          continue;
        }

        // Skip if inside parentheses (e.g., (24-), (26-28), (1))
        const beforeMatch = processedContent.substring(0, index);
        const afterMatch = processedContent.substring(index + token.length);
        const lastOpenParen = beforeMatch.lastIndexOf("(");
        const nextCloseParen = afterMatch.indexOf(")");
        if (lastOpenParen !== -1 && nextCloseParen !== -1) {
          // Check if there's no closing paren before the match and no opening paren after
          const beforeCloseParen = beforeMatch.substring(lastOpenParen + 1);
          if (beforeCloseParen.indexOf(")") === -1) {
            // We're inside parentheses, skip this match
            continue;
          }
        }

        matches.push({
          index,
          token,
          length: token.length,
        });
      }

      // Replace from right to left so indices stay valid
      for (let i = matches.length - 1; i >= 0; i--) {
        const { index, token, length } = matches[i];
        const before = processedContent.substring(0, index);
        const after = processedContent.substring(index + length);
        processedContent = before + createSupTag(token) + after;
      }

      // Also process M1, M2, etc. media links for Malayalam only
      if (translationLanguage === 'mal') {
        processedContent = processMalayalamMediaLinks(processedContent);
      }

      return processedContent;
    }

    // Non-Malayalam/Hindi: leave content unchanged (no special sup parsing here)
    return processedContent;
  };

  // Set up media popup handlers
  useEffect(() => {
    setMediaPopupHandlers(
      (mediaId) => setMediaPopup({ isOpen: true, mediaId }),
      () => setMediaPopup({ isOpen: false, mediaId: null })
    );
    return () => setMediaPopupHandlers(null, null);
  }, []);

  // Handle clicks on interpretation numbers in the rendered HTML
  useEffect(() => {
    const handleSupClick = (e) => {
      // Check if clicked element is a Malayalam media link (M1, M2, etc.)
      const mediaLink = e.target.closest('.malayalam-media-link');
      if (mediaLink) {
        handleMalayalamMediaLinkClick(e);
        return;
      }

      // Check if the click is on an interpretation link or inside one
      let target = e.target.closest(".interpretation-link");
      
      // For English blockwise, also check if it's an English footnote link (which should open as interpretation)
      if (!target && translationLanguage === 'E') {
        const footnoteTarget = e.target.closest(".english-footnote-link");
        if (footnoteTarget) {
          const displayedNumberAttr =
            footnoteTarget.getAttribute("data-interpretation-number") ||
            footnoteTarget.getAttribute("data-footnote-number");
          const displayedNumber = displayedNumberAttr || footnoteTarget.textContent?.trim() || "";
          const interpretationNumber = displayedNumber && /^\d+$/.test(displayedNumber) 
            ? parseInt(displayedNumber, 10) 
            : 1;
          const footnoteSurah = footnoteTarget.getAttribute("data-surah");
          const footnoteAyah = footnoteTarget.getAttribute("data-ayah");
          
          // Find which block range this verse belongs to
          if (footnoteSurah === surahId && footnoteAyah && blockRanges.length > 0) {
            const verseNum = parseInt(footnoteAyah, 10);
            const block = blockRanges.find(b => {
              const from = b.AyaFrom || b.ayafrom || b.from || 0;
              const to = b.AyaTo || b.ayato || b.to || from;
              return verseNum >= from && verseNum <= to;
            });
            
            if (block) {
              const blockFrom = block.AyaFrom || block.ayafrom || block.from || 1;
              const blockTo = block.AyaTo || block.ayato || block.to || blockFrom;
              const blockRange = `${blockFrom}-${blockTo}`;
              const footnoteId = footnoteTarget.getAttribute("data-footnote-id");
              
              // Prevent default behavior and stop event propagation
              e.preventDefault();
              e.stopPropagation();
              
              // Open interpretation modal with the displayed number as interpretation number and footnote ID
              setSelectedInterpretation({
                range: blockRange,
                interpretationNumber: interpretationNumber,
                footnoteId: footnoteId, // Pass footnote ID for English footnotes
              });
              
              return;
            } else {
              console.warn("[BlockWise] ⚠️ Could not find block range for verse:", verseNum);
            }
          }
        }
      }

      if (target) {
        // Prevent default behavior and stop event propagation
        e.preventDefault();
        e.stopPropagation();

        const interpretationNumber = target.getAttribute("data-interpretation");
        const range = target.getAttribute("data-range");
        const lang = target.getAttribute("data-lang");

        if (interpretationNumber && range) {
          // Force state update
          setSelectedInterpretation({
            range: range,
            // Keep the full token (e.g. "199A") so 199 and 199A are distinct
            interpretationNumber: interpretationNumber,
          });
        } else {
          console.warn("[BlockWise] ⚠️ Missing interpretation data:", { interpretationNumber, range });
        }
      }
    };

    // Add CSS for hover and active effects
    const style = document.createElement('style');
    style.textContent = `
      .interpretation-link {
        cursor: pointer !important;
      }
      .interpretation-link > a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 100% !important;
        height: 100% !important;
        color: inherit !important;
        font-weight: inherit !important;
        text-decoration: none !important;
      }
      .interpretation-link:hover {
        color: #0891b2 !important;
      }
      .interpretation-link:active {
        color: #0e7490 !important;
      }
    `;
    document.head.appendChild(style);

    // Use capture phase to ensure we catch the event first
    document.addEventListener("click", handleSupClick, true);
    return () => {
      document.removeEventListener("click", handleSupClick, true);
      document.head.removeChild(style);
    };
  }, []);

  // Navigation functions
  const handlePreviousSurah = () => {
    const prevSurahId = parseInt(surahId) - 1;
    if (prevSurahId >= 1) {
      navigate(`/blockwise/${prevSurahId}`);
    }
  };

  const handleNextSurah = () => {
    const nextSurahId = parseInt(surahId) + 1;
    if (nextSurahId <= 114) {
      navigate(`/blockwise/${nextSurahId}`);
    }
  };


  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScrollButton = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Use both window and document scroll events for better compatibility
    window.addEventListener('scroll', handleScrollButton, { passive: true });
    document.addEventListener('scroll', handleScrollButton, { passive: true });
    // Initial check
    handleScrollButton();
    return () => {
      window.removeEventListener('scroll', handleScrollButton);
      document.removeEventListener('scroll', handleScrollButton);
    };
  }, []);

  // Handle scroll to specific block when navigating from bookmark
  useEffect(() => {
    const scrollToBlockFromState = () => {
      const scrollToBlockRange = location.state?.scrollToBlock;
      
      if (scrollToBlockRange && !loading && blockRanges.length > 0) {
        // Wait for DOM to render blocks
        setTimeout(() => {
          const blockElement = document.getElementById(`block-${scrollToBlockRange}`);
          if (blockElement) {
            blockElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            // Highlight the block briefly
            blockElement.style.backgroundColor = "#fef3c7";
            setTimeout(() => {
              blockElement.style.backgroundColor = "";
            }, 2000);
          }
        }, 500);
      }
    };

    if (!loading && blockRanges.length > 0) {
      scrollToBlockFromState();
    }
  }, [loading, blockRanges, location.state]);

  // Loading state - Show shimmer skeleton for better perceived performance
  if (loading && blockRanges.length === 0) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Surah Header Skeleton */}
            <div className="text-center mb-8">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-64 mx-auto mb-4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-40 mx-auto relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
              </div>
            </div>
            {/* Blocks Skeleton */}
            <BlocksSkeleton count={3} />
          </div>
        </div>
      </>
    );
  }
  const formatInterpretationRange = (range) => {
    // If it's just a number, convert to "number-number" format
    if (/^\d+$/.test(String(range))) {
      return `${range}-${range}`;
    }
    // If it already has a dash, return as is
    if (range.includes('-')) {
      return range;
    }
    // Fallback: return as "number-number"
    return `${range}-${range}`;
  };
  // Error state
  if (error) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />

        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 text-lg mb-2">
              Failed to load Block-wise data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const accessibleSurahName =
    blockData?.surahInfo?.arabic || (surahId ? `Surah ${surahId}` : "Surah");
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
  const translationsLoadedCount = blockTranslations
    ? Object.keys(blockTranslations).length
    : 0;
  const showManualRetryBanner =
    !loading &&
    Array.isArray(blockRanges) &&
    blockRanges.length > 0 &&
    (loadingBlocks?.size ?? 0) === 0 &&
    translationsLoadedCount === 0 &&
    autoRetryAttempted;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 font-outfit transition-colors duration-300 overflow-x-hidden w-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
          <div className="container-responsive py-3 sm:py-4">
            {/* Header with Tabs */}
            <div className="flex flex-col items-center justify-center relative">
              {/* Translation/Reading Tabs moved to global header (Transition component) */}

              {/* Surah Title */}
              <div className="mb-2 sm:mb-4">
                <h1
                  className={`text-4xl sm:text-5xl md:text-6xl font-arabic text-center text-gray-800 dark:text-white drop-shadow-sm ${surahTitleWeightClass}`}
                  style={{ fontFamily: surahNameFontFamily }}
                  aria-label={accessibleSurahName}
                >
                  {blockData ? calligraphicSurahName : accessibleSurahName}
                </h1>
              </div>

              {/* Bismillah */}
              {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 && (
                <div className="mb-4 sm:mb-6">
                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="max-w-[1290px] mx-auto relative flex items-center justify-center px-4 lg:px-8">
                      {/* Center - Bismillah */}
                      <div className="flex-shrink-0 px-4 sm:px-6 pt-8 pb-6 sm:pt-10 sm:pb-8">
                        {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 ? (
                          <img
                            src={theme === "dark" ? DarkModeBismi : Bismi}
                            alt="Bismi"
                            className="w-[236px] h-[52.9px]"
                          />
                        ) : (
                          <div className="h-[52.9px]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full flex justify-center mb-4 sm:mb-6">
                {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                  <ToggleGroup
                    options={["Ayah Wise", "Block Wise"]}
                    value="Block Wise"
                    onChange={(val) => setContextViewType(val)}
                  />
                )}
              </div>

              {showManualRetryBanner && (
                <div className="w-full flex justify-center mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
                    <span>We couldn't load the blockwise translation. Please retry.</span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-amber-700 transition-colors"
                      onClick={() => triggerBlockwiseReload("manual")}
                    >
                      Retry now
                    </button>
                  </div>
                </div>
              )}


              {/* Surah Info moved to global header */}
              {/* Play Audio button moved to header */}
              {/* Qirath selector moved to audio player settings */}
            </div>
          </div>

          <div className={`container-responsive py-6 sm:py-8 space-y-4 sm:space-y-6 overflow-x-hidden w-full ${currentAyahInBlock ? 'pb-32 sm:pb-36' : ''}`}>

            {/* Render blocks based on aya ranges */}
            {loading && blockRanges.length === 0 ? (
              <BlocksSkeleton count={5} />
            ) : blockRanges && blockRanges.length > 0 ? (
              blockRanges.map((block, blockIndex) => {
                const rawStart = block.AyaFrom ?? block.ayafrom ?? block.from ?? 1;
                const rawEnd = block.AyaTo ?? block.ayato ?? block.to ?? rawStart;
                const parsedStart = Number.parseInt(rawStart, 10);
                const parsedEnd = Number.parseInt(rawEnd, 10);
                const hasNumericBounds = Number.isFinite(parsedStart) && Number.isFinite(parsedEnd);
                const fallbackStart = Number.isFinite(Number(rawStart)) ? Number(rawStart) : 1;
                const start = hasNumericBounds ? parsedStart : fallbackStart;
                const fallbackEnd = Number.isFinite(Number(rawEnd)) ? Number(rawEnd) : start;
                const end = hasNumericBounds ? parsedEnd : fallbackEnd;
                const rangeKey = hasNumericBounds
                  ? `${start}-${end}`
                  : `${rawStart}-${rawEnd}`;
                const blockId =
                  block.ID ||
                  block.id ||
                  rangeKey ||
                  `block-${blockIndex}`;

                // Get translation data for this block
                const translationInfo = blockTranslations[blockId] || null;
                const translationData = translationInfo?.data;
                
                // For Malayalam blockwise, check if we have AudioText (single block format from audiotranslation)
                // Only treat as blockwise if it's NOT an array and has AudioText
                const isMalayalamBlockwise = translationLanguage === 'mal' && 
                  !Array.isArray(translationData) &&
                  !Array.isArray(translationData?.translations) &&
                  !Array.isArray(translationData?.data) &&
                  (translationData?.AudioText || 
                   translationData?.translation_text ||
                   translationData?.TranslationText);
                
                const translationEntries = Array.isArray(translationData)
                  ? translationData
                  : Array.isArray(translationData?.translations)
                    ? translationData.translations
                    : Array.isArray(translationData?.data)
                      ? translationData.data
                      : [];
                const translationPlainText = translationData
                  ? buildTranslationPlainText(translationEntries, translationData, start)
                  : "";

                // Get Arabic verses for this block
                const arabicSlice = Array.isArray(arabicVerses)
                  ? arabicVerses.slice(start - 1, end)
                  : [];

                return (
                  <div
                    id={`block-${start}-${end}`}
                    key={`block-${blockId}-${start}-${end}`}
                    className="relative rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-card hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 overflow-x-hidden w-full"
                  >
                    {/* Block Range Badge */}
                    <div className="absolute top-0 left-0 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 border-b border-r border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 z-10" style={{ borderRadius: '16px 0' }}>
                      {surahId}:{start}{start !== end && `-${end}`}
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8 pt-12 overflow-x-hidden">
                      {/* Arabic Text */}
                      <div className="w-full mb-6 sm:mb-8 text-right overflow-x-auto" dir="rtl">
                        <p
                          className="leading-[2.2] text-gray-800 dark:text-gray-100 break-words"
                          style={{
                            fontFamily: quranFont ? `'${quranFont}', serif` : '"Amiri Quran", serif',
                            direction: 'rtl',
                            lineHeight: '2.7',
                            fontSize: `${fontSize}px`,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {arabicSlice.length > 0
                            ? arabicSlice
                              .map((verse, idx) =>
                                formatArabicVerseWithNumber(
                                  verse.text_uthmani,
                                  start + idx
                                )
                              )
                              .join(" ")
                            : "Loading Arabic text..."}
                        </p>
                      </div>

                      {/* Translation Text for this block */}
                      <div className="w-full text-left mb-6 overflow-x-hidden">
                        {translationData ? (
                          <div className={`prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 ${translationLanguage === 'hi' ? 'font-hindi' :
                            translationLanguage === 'ur' ? 'font-urdu' :
                              translationLanguage === 'bn' ? 'font-bengali' :
                                translationLanguage === 'ta' ? 'font-tamil' :
                                  translationLanguage === 'mal' ? 'font-malayalam' :
                                    'font-poppins'
                            }`}
                            style={{ 
                              fontSize: `${adjustedTranslationFontSize}px`,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {/* Render translation text with HTML and clickable interpretation numbers */}
                            {isMalayalamBlockwise ? (
                              // Malayalam blockwise: Single AudioText from audiotranslation table
                              <div
                                className="leading-relaxed"
                                data-footnote-context="blockwise"
                                dangerouslySetInnerHTML={{
                                  __html: parseTranslationWithClickableSup(
                                    translationData.AudioText || translationData.translation_text || translationData.TranslationText || '',
                                    `${start}-${end}`
                                  ),
                                }}
                              />
                            ) : translationEntries.length > 0 ? (
                              translationEntries.map((item, idx) => {
                                const translationText =
                                  item.TranslationText ||
                                  item.translationText ||
                                  item.translation_text ||
                                  item.text ||
                                  "";
                                const rawVerseNumber =
                                  item.VerseNo ||
                                  item.Verse_Number ||
                                  item.verse_number ||
                                  item.VerseNumber ||
                                  item.ayah_number ||
                                  item.AyaId ||
                                  item.AyahId ||
                                  (start + idx);
                                const verseNumber = Number.isFinite(parseInt(rawVerseNumber, 10))
                                  ? parseInt(rawVerseNumber, 10)
                                  : start + idx;
                                const parsedHtml = parseTranslationWithClickableSup(
                                  translationText,
                                  `${start}-${end}`
                                );

                                return (
                                  <div
                                    key={`translation-${blockId}-${idx}`}
                                    className="leading-relaxed"
                                    data-footnote-context="blockwise"
                                    dangerouslySetInnerHTML={{ __html: parsedHtml }}
                                  />
                                );
                              })
                            ) : translationData?.TranslationText ||
                              translationData?.translationText ||
                              translationData?.translation_text ||
                              translationData?.text ? (
                              <div
                                className="leading-relaxed"
                                data-footnote-context="blockwise"
                                dangerouslySetInnerHTML={{
                                  __html: parseTranslationWithClickableSup(
                                    translationData.TranslationText || translationData.translationText || translationData.translation_text || translationData.text,
                                    `${start}-${end}`
                                  ),
                                }}
                              />
                            ) : (
                              <p>Translation not available</p>
                            )}
                          </div>
                        ) : loadingBlocks.has(blockId) ? (
                          <CompactLoading message="Loading translation..." />
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Translation not available
                          </p>
                        )}
                      </div>

                      {/* Action Icons - Border top separator */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {/* Copy */}
                          <button
                            className="icon-btn"
                            onClick={async () => {
                              try {
                                // Get Arabic text
                                const arabicText =
                                  arabicSlice.length > 0
                                    ? arabicSlice
                                      .map((verse, idx) =>
                                        formatArabicVerseWithNumber(
                                          verse.text_uthmani,
                                          start + idx
                                        )
                                      )
                                      .join(" ")
                                    : "Loading Arabic text...";

                                // Get translation text (strip HTML for clipboard)
                                const translationText = translationPlainText || "Translation not available";
                                const textToCopy = `${arabicText}\n\n${translationText}`;
                                await navigator.clipboard.writeText(textToCopy);
                                showSuccess("Text copied to clipboard!");
                              } catch (e) {
                                console.error("Copy failed", e);
                                showError("Failed to copy text");
                              }
                            }}
                            title="Copy text"
                          >
                            <Copy className="w-5 h-5" />
                          </button>

                          {/* Play/Pause */}
                          <button
                            className={`icon-btn ${playingBlock === blockId && !isPaused
                              ? 'text-primary bg-primary/10'
                              : ''
                              }`}
                            onClick={() => {
                              // If this block is currently playing, pause/resume
                              if (playingBlock === blockId) {
                                if (isPaused) {
                                  // Resume playback
                                  setIsPaused(false);
                                  setIsContinuousPlay(true);
                                  // Update refs
                                  isContinuousPlayRef.current = true;
                                  if (audioRef.current) {
                                    audioRef.current.play().then(() => {
                                      // Dispatch event to update header button
                                      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
                                    }).catch(err => {
                                      console.error('Error resuming audio:', err);
                                    });
                                  }
                                } else {
                                  // Pause playback
                                  if (audioRef.current) {
                                    audioRef.current.pause();
                                  }
                                  setIsPaused(true);
                                  setIsContinuousPlay(false);
                                  // Dispatch event to update header button
                                  window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
                                }
                              } else {
                                // Start playing this block
                                playBlockAudio(blockId);
                              }
                            }}
                            title={
                              playingBlock === blockId
                                ? (isPaused ? "Resume audio" : "Pause audio")
                                : "Play audio"
                            }
                          >
                            {playingBlock === blockId && !isPaused ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>

                          {/* Book - Ayah Detail */}
                          {/* BookOpen - Interpretation (hidden for Tamil, English, and Malayalam) */}
                          {translationLanguage !== 'ta' && translationLanguage !== 'E' && translationLanguage !== 'mal' && (
                            <button
                              className="icon-btn group"
                              onClick={(e) => {
                                const targetUrl = `/surah/${surahId}#verse-${start}`;
                                const isModifierPressed = e?.ctrlKey || e?.metaKey;

                                if (isModifierPressed) {
                                  e.preventDefault();
                                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                                } else {
                                  navigate(targetUrl);
                                }
                              }}
                              title="View ayah details"
                            >
                              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                          )}

                          {/* Note/Page - Word by Word */}
                          <button
                            className="icon-btn group"
                            onClick={(e) => {
                              const url = `/word-by-word/${surahId}/${start}`;
                              const isModifierPressed = e?.ctrlKey || e?.metaKey;
                              if (isModifierPressed) {
                                e.preventDefault();
                                window.open(url, '_blank', 'noopener,noreferrer');
                                return;
                              }
                              // Open inline modal instead of navigating
                              setShowWordByWord(true);
                              setSelectedVerseForWordByWord(start);
                            }}
                            title="Word by word"
                          >
                            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>

                          {/* Bookmark */}
                          <button
                            className={`icon-btn ${blockBookmarkLoading[`${start}-${end}`]
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              }`}
                            onClick={async () => {
                              if (!user) {
                                showError("Please sign in to bookmark blocks");
                                navigate("/sign", {
                                  state: {
                                    from: location.pathname,
                                    message: "Sign in to bookmark blocks",
                                  },
                                });
                                return;
                              }

                              const key = `${start}-${end}`;
                              try {
                                setBlockBookmarkLoading((prev) => ({
                                  ...prev,
                                  [key]: true,
                                }));
                                const userId =
                                  BookmarkService.getEffectiveUserId(user);
                                await BookmarkService.addBlockBookmark(
                                  userId,
                                  surahId,
                                  start,
                                  end
                                );
                                showSuccess(`Saved block ${start}-${end}`);
                              } catch (err) {
                                console.error("Failed to bookmark block:", err);
                                showError("Failed to save block");
                              } finally {
                                setBlockBookmarkLoading((prev) => ({
                                  ...prev,
                                  [key]: false,
                                }));
                              }
                            }}
                            title="Bookmark block"
                            disabled={blockBookmarkLoading[`${start}-${end}`]}
                          >
                            {blockBookmarkLoading[`${start}-${end}`] ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b border-current"></div>
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>

                          {/* Share */}
                          <button
                            className="icon-btn"
                            onClick={async () => {
                              try {
                                const currentUrl = window.location.href;
                                const arabicText =
                                  arabicSlice.length > 0
                                    ? arabicSlice
                                      .map((verse, idx) =>
                                        formatArabicVerseWithNumber(
                                          verse.text_uthmani,
                                          start + idx
                                        )
                                      )
                                      .join(" ")
                                    : "Arabic text is loading...";

                                const translationText = translationPlainText || "Translation not available";
                                const shareContent = `${arabicText}\n\n${translationText}\n\nRead more: ${currentUrl}`;
                                const shareTitle = `Surah ${surahId} • Verses ${start}-${end}`;

                                if (navigator.share) {
                                  await navigator.share({
                                    title: shareTitle,
                                    text: shareContent,
                                  });
                                } else {
                                  await navigator.clipboard.writeText(
                                    shareContent
                                  );
                                  showSuccess("Content copied to clipboard!");
                                }
                              } catch (e) {
                                console.error("Share failed", e);
                                showError("Failed to share");
                              }
                            }}
                            title="Share block"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No blocks available for this Surah
                </p>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-gray-50 dark:bg-gray-900 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mt-6 sm:mt-8">
            <div className="max-w-4xl mx-auto">
              {/* Mobile: Stack vertically */}
              <div className="sm:hidden space-y-2">
                {/* First row: Previous + Beginning */}
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
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                               dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                               border border-gray-300 dark:border-gray-600 rounded-lg min-h-[44px]"
                  >
                    <ArrowUp className="w-3 h-3" />
                    <span>Beginning of Surah</span>
                  </button>
                </div>

                {/* Second row: Next Surah */}
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
              <div className="hidden sm:flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-6">
                <button
                  onClick={handlePreviousSurah}
                  disabled={parseInt(surahId) <= 1}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-full shadow-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors min-h-[44px] sm:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Previous Surah</span>
                </button>

                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-full shadow-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors min-h-[44px] sm:min-h-[48px]"
                >
                  <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Beginning of Surah</span>
                </button>
                <button
                  onClick={handleNextSurah}
                  disabled={parseInt(surahId) >= 114}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-full shadow-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 transition-colors min-h-[44px] sm:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next Surah</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Overlay Popup for Ayah Interpretation (from clicking ayah numbers) */}
          {showInterpretation && selectedNumber && (
            <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => {
                  setShowInterpretation(false);
                  setSelectedNumber(null);
                }}
              />

              {/* Modal Content */}
              <div className="relative w-full sm:w-[550px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn overflow-hidden">
                {/* Drag Handle (Mobile) */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <InterpretationBlockwise
                    key={`interpretation-${surahId}-${selectedNumber}`}
                    surahId={parseInt(surahId)}
                    range={selectedNumber.toString()}
                    ipt={1}
                    lang={translationLanguage === 'E' ? 'E' : 'mal'}
                    onClose={() => {
                      setShowInterpretation(false);
                      setSelectedNumber(null);
                    }}
                    showSuccess={showSuccess}
                    showError={showError}
                    isModal={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Overlay Popup for Word by Word (from block toolbar button) */}
          {showWordByWord && selectedVerseForWordByWord && (
            <WordByWord
              selectedVerse={selectedVerseForWordByWord}
              surahId={surahId}
              onClose={() => { setShowWordByWord(false); setSelectedVerseForWordByWord(null); }}
              onNavigate={(v) => setSelectedVerseForWordByWord(v)}
              onSurahChange={(newSurahId) => {
                setShowWordByWord(false);
                setSelectedVerseForWordByWord(null);
                navigate(`/surah/${newSurahId}?wordByWord=1`);
              }}
            />
          )}

          {/* English Footnote Modal */}
          {showEnglishFootnoteModal && (
            <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
                onClick={() => setShowEnglishFootnoteModal(false)}
              />

              {/* Modal Content */}
              <div className="relative w-full sm:w-[480px] md:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn overflow-hidden">
                {/* Drag Handle (Mobile) */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      English Explanation
                    </h2>
                    {englishFootnoteMeta?.footnoteNumber && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Footnote {englishFootnoteMeta.footnoteNumber}
                        {englishFootnoteMeta?.ayah
                          ? ` • Ayah ${englishFootnoteMeta.ayah}`
                          : ""}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setShowEnglishFootnoteModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {englishFootnoteLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading explanation...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div
                        className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                        style={{ fontSize: `${blockModalFontSize}px` }}
                      >
                        {englishFootnoteContent}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Overlay Popup for Block Interpretation (from clicking sup numbers in translation) */}
          {selectedInterpretation && (
            <InterpretationBlockwise
              key={`block-interpretation-${surahId}-${selectedInterpretation.range}-${selectedInterpretation.interpretationNumber}-${selectedInterpretation.footnoteId || ''}`}
              surahId={parseInt(surahId)}
              range={selectedInterpretation.range}
              ipt={selectedInterpretation.interpretationNumber}
              lang={translationLanguage === 'E' ? 'E' : 'mal'}
              footnoteId={selectedInterpretation.footnoteId || null}
              blockRanges={blockRanges}
              onClose={() => setSelectedInterpretation(null)}
            />
          )}

        </div>
      </div>

      {/* Floating Back to Top Button - Outside main container */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed right-6 z-[100] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${currentAyahInBlock ? 'bottom-32 sm:bottom-36' : 'bottom-6'
            }`}
          title="Beginning of Surah"
          aria-label="Beginning of Surah"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Sticky Audio Player */}
      {currentAyahInBlock && (
        <StickyAudioPlayer
          audioElement={audioRef.current}
          isPlaying={isContinuousPlay && audioRef.current && !audioRef.current.paused}
          currentAyah={currentAyahInBlock}
          totalAyahs={blockRanges.reduce((acc, block) => {
            const end = block.AyaTo || block.ayato || block.to || 0;
            const start = block.AyaFrom || block.ayafrom || block.from || 0;
            return acc + (end - start + 1);
          }, 0)}
          surahInfo={blockData?.surahInfo}
          onPlayPause={handlePlayAudio}
          onStop={stopPlayback}
          onSkipBack={() => {
            // Go to previous ayah
            moveToPreviousAyahOrBlock();
          }}
          onSkipForward={() => {
            // Go to next ayah
            moveToNextAyahOrBlock();
          }}
          onClose={null}
          selectedQari={selectedQirath}
          onQariChange={(newQari) => {
            setSelectedQirath(newQari);
            // If audio is currently playing, restart with new reciter
            if (playingBlock && currentAyahInBlock) {
              stopPlayback();
              setTimeout(() => {
                playBlockAudio(playingBlock);
              }, 100);
            }
          }}
          translationLanguage={translationLanguage}
          audioTypes={audioTypes}
          onAudioTypesChange={(newTypes) => {
            const currentBlock = playingBlock;
            const currentAyah = currentAyahInBlock;
            console.log("[BlockWise] onAudioTypesChange", {
              newTypes,
              currentBlock,
              currentAyah,
              isContinuousPlay,
              isPaused
            });
            setAudioTypes(newTypes);
            // Update the preserved ref when user changes audio types
            preservedAudioTypesRef.current = newTypes;
            // If audio is currently playing, restart with new audio types
            if (currentBlock && currentAyah) {
              if (audioRef.current) {
                try {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                } catch (pauseError) {
                  console.warn("[BlockWise] Failed to pause audio before restarting with new types", pauseError);
                }
              }
              setIsContinuousPlay(true);
              setIsPaused(false);
              setPlayingBlock(currentBlock);
              setCurrentAyahInBlock(currentAyah);
              // Update refs
              playingBlockRef.current = currentBlock;
              isContinuousPlayRef.current = true;
              // Pass newTypes directly to avoid closure issue
              setTimeout(() => {
                console.log("[BlockWise] restarting playback after audioTypes change", {
                  currentBlock,
                  currentAyah,
                  newTypes
                });
                playAyahAudioWithTypes(currentBlock, currentAyah, 0, newTypes);
              }, 100);
            }
          }}
          playbackSpeed={playbackSpeed}
          onPlaybackSpeedChange={(newSpeed) => {
            setPlaybackSpeed(newSpeed);
            // Immediately apply to current audio element if it exists
            if (audioRef.current) {
              audioRef.current.playbackRate = newSpeed;
            }
          }}
        />
      )}

      {/* Media Popup */}
      <MediaPopup
        isOpen={mediaPopup.isOpen}
        onClose={() => setMediaPopup({ isOpen: false, mediaId: null })}
        mediaId={mediaPopup.mediaId}
      />
    </>
  );
};

export default BlockWise;