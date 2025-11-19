import React, { useState, useEffect, useRef } from "react";
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
} from "../api/apifunction";
import { useSurahData } from "../hooks/useSurahData";
import { fetchDeduplicated } from "../utils/requestDeduplicator";
import { BlocksSkeleton, CompactLoading } from "../components/LoadingSkeleton";
import { AyahViewIcon, BlockViewIcon } from "../components/ViewToggleIcons";
import StickyAudioPlayer from "../components/StickyAudioPlayer";
import englishTranslationService from "../services/englishTranslationService";
import {
  getCalligraphicSurahName,
  surahNameFontFamily,
} from "../utils/surahNameUtils.js";

const BlockWise = () => {
  const [activeTab, setActiveTab] = useState("Translation");
  const [activeView, setActiveView] = useState("Block wise");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedQirath, setSelectedQirath] = useState("al-hudaify");
  const [audioTypes, setAudioTypes] = useState(['quran']); // Selected audio types in order
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [playingBlock, setPlayingBlock] = useState(null); // Track which block is currently playing
  const [currentAudioType, setCurrentAudioType] = useState(null); // Track which audio type is playing
  const [currentAyahInBlock, setCurrentAyahInBlock] = useState(null); // Track which ayah within the block is playing
  const [currentInterpretationNumber, setCurrentInterpretationNumber] = useState(1); // Track which interpretation number (1, 2, 3, etc.)
  const [isContinuousPlay, setIsContinuousPlay] = useState(false); // Track if continuous playback is active
  const [isPaused, setIsPaused] = useState(false); // Track if audio is paused
  const audioRef = useRef(null); // Audio element reference

  useEffect(() => {
    console.log("[BlockWise] audioTypes state updated", audioTypes);
  }, [audioTypes]);

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
  const [loadingBlocks, setLoadingBlocks] = useState(new Set());
  const hasFetchedRef = useRef(false);
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
    translationFontSize,
    viewType: contextViewType,
    setViewType: setContextViewType,
  } = useTheme();
  const adjustedTranslationFontSize = Math.max(
    Number(translationFontSize) - 2,
    10
  );
  const { surahId } = useParams();

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
  const { surahs } = useSurahData();

  // Function to convert Western numerals to Arabic-Indic numerals
  const toArabicNumber = (num) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicDigits[digit] || digit)
      .join("");
  };

  const normalizeAyahNumber = (value, fallbackValue = null) => {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    return fallbackValue;
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
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
  const playBlockAudio = (blockId, fromContinuous = false) => {
    if (!audioRef.current) return;

    console.log("[BlockWise] playBlockAudio start", {
      blockId,
      fromContinuous,
      audioTypes,
      translationLanguage,
      selectedQirath
    });

    // Check if translation/interpretation audio is selected but language is not Malayalam
    // Only check if not already in continuous mode (to allow resume)
    if (!fromContinuous && translationLanguage !== 'mal') {
      const hasTranslationOrInterpretation = audioTypes.some(type =>
        type === 'translation' || type === 'interpretation'
      );
      if (hasTranslationOrInterpretation) {
        const languageName = getLanguageName(translationLanguage);
        showWarning(`${languageName} translation and explanation audio is coming soon. Currently, only Malayalam translation and explanation audio is available.`);
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

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Find the block data
    const blockInfo = blockRanges.find(b => (b.ID || b.id) === blockId);
    if (!blockInfo) {
      console.error('Block not found:', blockId);
      return;
    }

    const startingAyah = blockInfo.AyaFrom || blockInfo.ayafrom || blockInfo.from || 1;
    const normalizedStartingAyah = normalizeAyahNumber(startingAyah, 1);

    setIsContinuousPlay(true);
    setPlayingBlock(blockId);
    setCurrentAyahInBlock(normalizedStartingAyah);
    setCurrentInterpretationNumber(1); // Reset interpretation number for new block
    setIsPaused(false);

    console.log("[BlockWise] playBlockAudio state set", {
      playingBlock: blockId,
      normalizedStartingAyah,
      currentAudioType: audioTypes?.[0] || 'quran'
    });

    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));

    // Play the first ayah's audio (will play all selected types in sequence)
    playAyahAudio(blockId, normalizedStartingAyah, 0);
  };

  // Generate audio URL based on audio type
  const generateAudioUrl = (surahId, ayahId, type) => {
    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahId).padStart(3, "0");

    // Use proxy path in development to avoid CORS issues
    const baseUrl = import.meta.env.DEV ? '/api/audio' : 'https://old.thafheem.net/audio';

    if (type === 'quran') {
      return `${baseUrl}/qirath/${selectedQirath}/${qirathPrefixes[selectedQirath]}${surahCode}_${ayahCode}.ogg`;
    } else if (type === 'translation') {
      return `${baseUrl}/translation/T${surahCode}_${ayahCode}.ogg`;
    } else if (type === 'interpretation') {
      return `${baseUrl}/interpretation/I${surahCode}_${ayahCode}.ogg`;
    }
    return null;
  };

  // Function to play audio types for a specific ayah in sequence
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahAudioWithTypes = (blockId, ayahNumber, audioTypeIndex = 0, typesToPlay = null) => {
    if (!audioRef.current) return;

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
      playbackSpeed,
      isContinuousPlay,
      isPaused,
      playingBlock
    });

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      moveToNextAyahOrBlock(ayahToPlay, activeAudioTypes);
      return;
    }

    // Stop any currently playing audio before starting new audio
    audioRef.current.pause();

    const currentAudioType = activeAudioTypes[audioTypeIndex];
    const audioUrl = generateAudioUrl(surahId, ayahToPlay, currentAudioType);
    if (!audioUrl) {
      // If URL generation fails, skip to next audio type
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, typesToPlay);
      return;
    }

    console.log("[BlockWise] generated audioUrl", {
      blockId,
      ayahToPlay,
      currentAudioType,
      audioUrl
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
    audioRef.current.onended = null;
    audioRef.current.onerror = null;

    // Set up audio event handlers before setting src
    audioRef.current.onended = () => {
      // Play next audio type for this ayah, or move to next ayah if all types done
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
    };

    audioRef.current.onerror = () => {
      console.error('Error playing audio:', audioUrl);
      // Skip to next audio type or next ayah
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
    };

    audioRef.current.src = audioUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.load();
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err.name, err.message, audioUrl);
      // If audio fails, skip to next audio type or next ayah
      playAyahAudioWithTypes(blockId, ayahToPlay, audioTypeIndex + 1, activeAudioTypes);
    });
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahAudio = (blockId, ayahNumber, audioTypeIndex = 0, typesOverride = null) => {
    playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex, typesOverride);
  };

  // Old functions removed - now handled by playAyahAudio with audioTypes array

  // Function to move to the next ayah in the block or the next block
  const moveToNextAyahOrBlock = (currentAyahOverride = null, activeAudioTypes = null) => {

    const effectiveCurrentAyah = currentAyahOverride ?? currentAyahInBlock;
    if (!playingBlock || !effectiveCurrentAyah) {
      return;
    }

    const blockInfo = blockRanges.find(b => (b.ID || b.id) === playingBlock);
    if (!blockInfo) {
      return;
    }

    const ayaTo = blockInfo.AyaTo || blockInfo.ayato || blockInfo.to;
    const currentAyahNumber = normalizeAyahNumber(effectiveCurrentAyah, null);
    const ayaToNumber = normalizeAyahNumber(ayaTo, currentAyahNumber);

    if (currentAyahNumber === null || ayaToNumber === null) {
      console.warn("[BlockWise] moveToNextAyahOrBlock aborted - invalid ayah numbers", {
        playingBlock,
        currentAyahInBlock: effectiveCurrentAyah,
        ayaTo
      });
      return;
    }

    const nextAyah = currentAyahNumber + 1;

    console.log("[BlockWise] moveToNextAyahOrBlock", {
      playingBlock,
      currentAyahNumber,
      nextAyah,
      ayaToNumber,
      isContinuousPlay
    });

    // Check if there are more ayahs in this block
    if (nextAyah <= ayaToNumber) {
      // Reset interpretation number for new ayah
      setCurrentInterpretationNumber(1);
      // Play the next ayah in the same block (start with first audio type)
      playAyahAudio(playingBlock, nextAyah, 0, activeAudioTypes);
    } else {
      // Block is finished, move to next block or stop
      if (isContinuousPlay) {
        setCurrentInterpretationNumber(1); // Reset for next block
        playNextBlock();
      } else {
        setPlayingBlock(null);
        setCurrentAudioType(null);
        setCurrentAyahInBlock(null);
        setCurrentInterpretationNumber(1);
        setIsPaused(false);
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
    if (!isContinuousPlay || !blockRanges || blockRanges.length === 0) return;

    const currentIndex = blockRanges.findIndex(block => {
      const blockId = block.ID || block.id;
      return blockId === playingBlock;
    });

    // Check if there's a next block
    if (currentIndex !== -1 && currentIndex < blockRanges.length - 1) {
      const nextBlock = blockRanges[currentIndex + 1];
      const nextBlockId = nextBlock.ID || nextBlock.id;
      playBlockAudio(nextBlockId, true); // Keep continuous mode active
    } else {
      // End of blocks, stop continuous play
      setPlayingBlock(null);
      setCurrentAudioType(null);
      setCurrentAyahInBlock(null);
      setCurrentInterpretationNumber(1);
      setIsContinuousPlay(false);
      setIsPaused(false);
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
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
        // Don't clear playingBlock, currentAyahInBlock - keep them for resume
      } else {
        // Resume playback from current position or start from beginning
        if (playingBlock && currentAyahInBlock) {
          // Resume from current position
          setIsContinuousPlay(true);
          setIsPaused(false);
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
    }
    setIsContinuousPlay(false);
    setPlayingBlock(null);
    setCurrentAudioType(null);
    setCurrentAyahInBlock(null);
    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
    setCurrentInterpretationNumber(1);
    setIsPaused(false);
  };

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
      }
    };
  }, [surahId]);

  // Restart audio when selectedQirath or audioTypes changes during playback
  useEffect(() => {
    if (playingBlock && currentAyahInBlock && audioRef.current && isContinuousPlay) {
      // Restart audio with new settings for the current ayah (start with first audio type)
      playAyahAudio(playingBlock, currentAyahInBlock, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQirath, audioTypes]);

  // Apply playback speed when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

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
              setBlockTranslations(prev => ({
                ...prev,
                [blockId]: {
                  range: range,
                  ayaFrom: ayaFrom,
                  ayaTo: ayaTo,
                  data: translationData,
                }
              }));

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

          // REQUEST THROTTLING: Increased concurrent requests for faster first load
          // Higher limit for better performance on first load, but still prevents server overload
          const MAX_CONCURRENT_REQUESTS = 5;
          const requestQueue = [];
          let activeRequests = 0;

          const processWithThrottle = async (block, blockIndex) => {
            return new Promise((resolve) => {
              const execute = async () => {
                activeRequests++;
                try {
                  await processBlockTranslation(block, blockIndex);
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
  }, [surahId, surahs, translationLanguage]);

  // When language changes, clear current block data to force re-render with new language
  useEffect(() => {
    // Mark all existing blocks as loading immediately to prevent "Translation not available" flash
    if (blockRanges.length > 0) {
      const allBlockIds = new Set(
        blockRanges.map((block) => {
          const rawStart = block.AyaFrom ?? block.ayafrom ?? block.from ?? 1;
          const rawEnd = block.AyaTo ?? block.ayato ?? block.to ?? rawStart;
          const parsedStart = Number.parseInt(rawStart, 10);
          const parsedEnd = Number.parseInt(rawEnd, 10);
          const hasNumericBounds = Number.isFinite(parsedStart) && Number.isFinite(parsedEnd);
          const fallbackStart = Number.isFinite(Number(rawStart)) ? Number(rawStart) : 1;
          const start = hasNumericBounds ? parsedStart : fallbackStart;
          const fallbackEnd = Number.isFinite(Number(rawEnd)) ? Number(rawEnd) : start;
          const end = hasNumericBounds ? parsedEnd : fallbackEnd;
          const rangeKey = hasNumericBounds ? `${start}-${end}` : `${rawStart}-${rawEnd}`;
          return block.ID || block.id || rangeKey || `block-${blockRanges.indexOf(block)}`;
        })
      );
      setLoadingBlocks(allBlockIds);
    }

    setBlockTranslations({});
    // Don't clear blockRanges - keep them so blocks still render with loading state
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
  }, [translationLanguage]);

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
  useEffect(() => {
    if (translationLanguage !== 'E') {
      return;
    }

    const handleEnglishFootnoteClick = async (event) => {
      const target = event.target.closest(".english-footnote-link");
      if (!target) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const footnoteId = target.getAttribute("data-footnote-id");
      if (!footnoteId) {
        return;
      }

      const footnoteNumber = (target.textContent || "").trim() || target.getAttribute("data-footnote-number");
      const ayahNoAttr = target.getAttribute("data-ayah");
      const ayahNo = ayahNoAttr ? parseInt(ayahNoAttr, 10) : null;

      setEnglishFootnoteMeta({
        footnoteId: footnoteId,
        footnoteNumber: footnoteNumber || null,
        surah: surahId ? parseInt(surahId, 10) : null,
        ayah: ayahNo,
      });
      setEnglishFootnoteContent("Loading...");
      setEnglishFootnoteLoading(true);
      setShowEnglishFootnoteModal(true);

      try {
        const explanation = await englishTranslationService.getExplanation(parseInt(footnoteId, 10));
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
  }, [translationLanguage, surahId]);

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

  // Handle interpretation number click
  const handleInterpretationClick = (blockRange, interpretationNumber) => {
    setSelectedInterpretation({
      range: blockRange,
      interpretationNumber: interpretationNumber,
    });
  };

  // Helper function to parse translation HTML and make sup tags clickable
  const parseTranslationWithClickableSup = (htmlContent, blockRange) => {
    if (!htmlContent) return "";

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Find all sup tags and make them clickable with badge styling
    const supTags = tempDiv.querySelectorAll("sup");
    supTags.forEach((sup) => {
      const number = sup.textContent.trim();
      if (/^\d+$/.test(number)) {
        // Style as rounded badge with cyan background
        sup.style.cssText = `
          cursor: pointer !important;
          background-color: rgb(41 169 199) !important;
          color: rgb(255, 255, 255) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          border: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 1 !important;
          border-radius: 9999px !important;
          position: relative !important;
          z-index: 10 !important;
          top: 0px !important;
          min-width: 20px !important;
          min-height: 19px !important;
          text-align: center !important;
          transition: 0.2s ease-in-out !important;
          padding-top: 3px !important;
          margin-right: 4px;
          margin-left: -1px;
          margin-top: -15px;
          padding-left: 2px !important;
          padding-right: 2px !important;
        `;
        sup.setAttribute("data-interpretation", number);
        sup.setAttribute("data-range", blockRange);
        // Pass current language into dataset so handler can use it
        sup.setAttribute("data-lang", translationLanguage === 'E' ? 'en' : 'mal');
        sup.setAttribute("title", `Click to view interpretation ${number}`);
        sup.className = "interpretation-link";
      }
    });

    return tempDiv.innerHTML;
  };

  // Handle clicks on interpretation numbers in the rendered HTML
  useEffect(() => {
    const handleSupClick = (e) => {
      // Check if the click is on an interpretation link or inside one
      const target = e.target.closest(".interpretation-link");

      if (target) {
        // Prevent default behavior and stop event propagation
        e.preventDefault();
        e.stopPropagation();

        const interpretationNumber = target.getAttribute("data-interpretation");
        const range = target.getAttribute("data-range");

        if (interpretationNumber && range) {
          // Log for debugging
          console.log("Interpretation clicked:", { range, interpretationNumber });

          // Force state update
          setSelectedInterpretation({
            range: range,
            interpretationNumber: parseInt(interpretationNumber, 10),
          });
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
        background-color: #0891b2 !important;
        transform: scale(1.05) !important;
      }
      .interpretation-link:active {
        background-color: #0e7490 !important;
        transform: scale(0.95) !important;
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

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 font-outfit transition-colors duration-300">
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

                  {/* View Toggle - Centered */}
                  <div className="w-full flex justify-center mt-2">
                    {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                      <ToggleGroup
                        options={["Ayah Wise", "Block Wise"]}
                        value="Block Wise"
                        onChange={(val) => setContextViewType(val)}
                      />
                    )}
                  </div>
                </div>
              )}


              {/* Surah Info moved to global header */}
              {/* Play Audio button moved to header */}
              {/* Qirath selector moved to audio player settings */}
            </div>
          </div>

          <div className={`container-responsive py-6 sm:py-8 space-y-4 sm:space-y-6 ${currentAyahInBlock ? 'pb-32 sm:pb-36' : ''}`}>

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
                const translationEntries = Array.isArray(translationData)
                  ? translationData
                  : Array.isArray(translationData?.translations)
                    ? translationData.translations
                    : Array.isArray(translationData?.data)
                      ? translationData.data
                      : [];

                // Get Arabic verses for this block
                const arabicSlice = Array.isArray(arabicVerses)
                  ? arabicVerses.slice(start - 1, end)
                  : [];

                return (
                  <div
                    key={`block-${blockId}-${start}-${end}`}
                    className="relative rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-card hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300"
                  >
                    {/* Block Range Badge */}
                    <div className="absolute top-0 left-0 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-br-xl border-b border-r border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 z-10">
                      {surahId}:{start}{start !== end && `-${end}`}
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8 pt-12">
                      {/* Arabic Text */}
                      <div className="w-full mb-6 sm:mb-8 text-right" dir="rtl">
                        <p
                          className="leading-[2.2] text-gray-800 dark:text-gray-100"
                          style={{
                            fontFamily: quranFont ? `'${quranFont}', serif` : '"Amiri Quran", serif',
                            direction: 'rtl',
                            lineHeight: '2.7',
                            fontSize: '23px',
                          }}
                        >
                          {arabicSlice.length > 0
                            ? arabicSlice
                              .map(
                                (verse, idx) =>
                                  `${verse.text_uthmani} ﴿${toArabicNumber(start + idx)}﴾`
                              )
                              .join(" ")
                            : "Loading Arabic text..."}
                        </p>
                      </div>

                      {/* Translation Text for this block */}
                      <div className="w-full text-left mb-6">
                        {translationData ? (
                          <div className={`prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 ${translationLanguage === 'hi' ? 'font-hindi' :
                            translationLanguage === 'ur' ? 'font-urdu' :
                              translationLanguage === 'bn' ? 'font-bengali' :
                                translationLanguage === 'ta' ? 'font-tamil' :
                                  translationLanguage === 'mal' ? 'font-malayalam' :
                                    'font-poppins'
                            }`}
                            style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                          >
                            {/* Render translation text with HTML and clickable interpretation numbers */}
                            {translationEntries.length > 0 ? (
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
                                const parsedHtml =
                                  translationLanguage === 'E'
                                    ? englishTranslationService.parseEnglishTranslationWithClickableFootnotes(
                                      translationText,
                                      parseInt(surahId, 10),
                                      verseNumber
                                    )
                                    : parseTranslationWithClickableSup(
                                      translationText,
                                      `${start}-${end}`
                                    );

                                return (
                                  <div
                                    key={`translation-${blockId}-${idx}`}
                                    className="leading-relaxed"
                                    style={{ fontSize: '17px' }}
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
                                style={{ fontSize: '17px' }}
                                dangerouslySetInnerHTML={{
                                  __html:
                                    translationLanguage === 'E'
                                      ? englishTranslationService.parseEnglishTranslationWithClickableFootnotes(
                                        translationData.TranslationText || translationData.translationText || translationData.translation_text || translationData.text,
                                        parseInt(surahId, 10),
                                        start
                                      )
                                      : parseTranslationWithClickableSup(
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
                                      .map(
                                        (verse, idx) =>
                                          `${verse.text_uthmani} ﴿${start + idx}﴾`
                                      )
                                      .join(" ")
                                    : "Loading Arabic text...";

                                // Get translation text (strip HTML for clipboard)
                                let translationText = "Loading translation...";
                                if (translationData) {
                                  let rawText = "";
                                  if (translationEntries.length > 0) {
                                    const firstEntry = translationEntries[0];
                                    rawText =
                                      firstEntry.TranslationText ||
                                      firstEntry.translationText ||
                                      firstEntry.translation_text ||
                                      firstEntry.text ||
                                      "";
                                  } else {
                                    rawText =
                                      translationData.TranslationText ||
                                      translationData.translationText ||
                                      translationData.translation_text ||
                                      translationData.text ||
                                      "";
                                  }

                                  // Strip HTML tags for clipboard
                                  const tempDiv = document.createElement("div");
                                  tempDiv.innerHTML = rawText;
                                  translationText = tempDiv.textContent || tempDiv.innerText || "";
                                }

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
                                const shareText = `Surah ${surahId} • Verses ${start}-${end}`;
                                const shareUrl = window.location.href;

                                if (navigator.share) {
                                  await navigator.share({
                                    title: "Thafheem - Quran Study",
                                    text: shareText,
                                    url: shareUrl,
                                  });
                                } else {
                                  await navigator.clipboard.writeText(
                                    `${shareText}\n${shareUrl}`
                                  );
                                  showSuccess("Link copied to clipboard!");
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
                        style={{ fontSize: `${translationFontSize}px` }}
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
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-start justify-center z-[9999] pt-24 sm:pt-28 lg:pt-32 p-2 sm:p-4 lg:p-6 overflow-y-auto">
              <div className="bg-white dark:bg-[#2A2C38] rounded-lg max-w-xs sm:max-w-4xl max-h-[90vh] overflow-y-auto relative w-full shadow-2xl">
                <InterpretationBlockwise
                  key={`block-interpretation-${surahId}-${selectedInterpretation.range}-${selectedInterpretation.interpretationNumber}`}
                  surahId={parseInt(surahId)}
                  range={selectedInterpretation.range}
                  ipt={selectedInterpretation.interpretationNumber}
                  lang={translationLanguage === 'E' ? 'E' : 'mal'}
                  onClose={() => setSelectedInterpretation(null)}
                />
              </div>
            </div>
          )}

          {/* Floating Back to Top Button */}
          {showScrollButton && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`fixed right-6 z-[60] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${currentAyahInBlock ? 'bottom-32 sm:bottom-36' : 'bottom-6'
                }`}
              title="Beginning of Surah"
              aria-label="Beginning of Surah"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

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
          }}
        />
      )}
    </>
  );
};

export default BlockWise;