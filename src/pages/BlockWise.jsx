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
import translationCache from "../utils/translationCache";
import { fetchDeduplicated } from "../utils/requestDeduplicator";
import { BlocksSkeleton, CompactLoading } from "../components/LoadingSkeleton";
import StickyAudioPlayer from "../components/StickyAudioPlayer";

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
    

    setIsContinuousPlay(true);
    setPlayingBlock(blockId);
    setCurrentAyahInBlock(startingAyah);
    setCurrentInterpretationNumber(1); // Reset interpretation number for new block
    setIsPaused(false);
    
    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
    
    // Play the first ayah's audio (will play all selected types in sequence)
    playAyahAudio(blockId, startingAyah, 0);
  };

  // Generate audio URL based on audio type
  const generateAudioUrl = (surahId, ayahId, type) => {
    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahId).padStart(3, "0");
    
    if (type === 'quran') {
      return `https://old.thafheem.net/audio/qirath/${selectedQirath}/${qirathPrefixes[selectedQirath]}${surahCode}_${ayahCode}.ogg`;
    } else if (type === 'translation') {
      return `https://old.thafheem.net/audio/translation/T${surahCode}_${ayahCode}.ogg`;
    } else if (type === 'interpretation') {
      return `https://old.thafheem.net/audio/interpretation/I${surahCode}_${ayahCode}.ogg`;
    }
    return null;
  };

  // Function to play audio types for a specific ayah in sequence
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahAudioWithTypes = (blockId, ayahNumber, audioTypeIndex = 0, typesToPlay = null) => {
    if (!audioRef.current) return;

    // Use provided types or fall back to state
    const activeAudioTypes = typesToPlay || audioTypes;

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      moveToNextAyahOrBlock();
      return;
    }

    // Stop any currently playing audio before starting new audio
    audioRef.current.pause();
    
    const currentAudioType = activeAudioTypes[audioTypeIndex];
    const audioUrl = generateAudioUrl(surahId, ayahNumber, currentAudioType);
    if (!audioUrl) {
      // If URL generation fails, skip to next audio type
      playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex + 1, typesToPlay);
      return;
    }
    
    // Map audioType to currentAudioType format for display
    const audioTypeMap = {
      'quran': 'qirath',
      'translation': 'translation',
      'interpretation': 'interpretation'
    };
    const mappedAudioType = audioTypeMap[currentAudioType] || 'qirath';
    
    setCurrentAudioType(mappedAudioType);
    setCurrentAyahInBlock(ayahNumber);
    setCurrentInterpretationNumber(1); // Reset interpretation counter
    
    // Set up audio event handlers before setting src
    audioRef.current.onended = () => {
      // Play next audio type for this ayah, or move to next ayah if all types done
      playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex + 1, typesToPlay);
    };
    
    audioRef.current.onerror = () => {
      console.error('Error playing audio:', audioUrl);
      // Skip to next audio type or next ayah
      playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex + 1, typesToPlay);
    };
    
    audioRef.current.src = audioUrl;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.load();
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err.name, err.message, audioUrl);
      // If audio fails, skip to next audio type or next ayah
      playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex + 1, typesToPlay);
    });
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahAudio = (blockId, ayahNumber, audioTypeIndex = 0) => {
    playAyahAudioWithTypes(blockId, ayahNumber, audioTypeIndex, null);
  };

  // Old functions removed - now handled by playAyahAudio with audioTypes array

  // Function to move to the next ayah in the block or the next block
  const moveToNextAyahOrBlock = () => {
    
    if (!playingBlock || !currentAyahInBlock) {
      return;
    }

    const blockInfo = blockRanges.find(b => (b.ID || b.id) === playingBlock);
    if (!blockInfo) {
      return;
    }

    const ayaTo = blockInfo.AyaTo || blockInfo.ayato || blockInfo.to;
    const nextAyah = currentAyahInBlock + 1;


    // Check if there are more ayahs in this block
    if (nextAyah <= ayaTo) {
      // Reset interpretation number for new ayah
      setCurrentInterpretationNumber(1);
      // Play the next ayah in the same block (start with first audio type)
      playAyahAudio(playingBlock, nextAyah, 0);
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
  const moveToPreviousAyahOrBlock = () => {
    if (!playingBlock || !currentAyahInBlock) {
      return;
    }

    const blockInfo = blockRanges.find(b => (b.ID || b.id) === playingBlock);
    if (!blockInfo) {
      return;
    }

    const ayaFrom = blockInfo.AyaFrom || blockInfo.ayafrom || blockInfo.from || 1;
    const previousAyah = currentAyahInBlock - 1;

    // Check if there's a previous ayah in this block
    if (previousAyah >= ayaFrom) {
      // Reset interpretation number for new ayah
      setCurrentInterpretationNumber(1);
      // Play the previous ayah in the same block (start with first audio type)
      playAyahAudio(playingBlock, previousAyah, 0);
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
      const lastAyah = previousBlock.AyaTo || previousBlock.ayato || previousBlock.to || 1;
      
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
      const firstAyah = firstBlock.AyaFrom || firstBlock.ayafrom || firstBlock.from || 1;
      
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
      } catch (e) {}
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
            const ayaFrom = block.AyaFrom || block.ayafrom || block.from;
            const ayaTo = block.AyaTo || block.ayato || block.to;
            const blockId = block.ID || block.id;

            if (!ayaFrom || !ayaTo) return;

            const range = `${ayaFrom}-${ayaTo}`;

            try {
              // Mark this specific block as loading
              setLoadingBlocks(prev => new Set([...prev, blockId]));

              // Check cache first for English translations
              let translationData;
              if (translationLanguage === 'E') {
                translationData = await translationCache.getCachedTranslation(
                  parseInt(surahId),
                  range,
                  'E'
                );
                
                if (!translationData) {
                  // Cache miss - fetch from API
                  translationData = await fetchAyaTranslation(
                    parseInt(surahId),
                    range,
                    'E'
                  );
                  // Cache the result for future use
                  await translationCache.setCachedTranslation(
                    parseInt(surahId),
                    range,
                    translationData,
                    'E'
                  );
                }
              } else {
                // For non-English translations, use original API call
                translationData = await fetchAyaTranslation(
                  parseInt(surahId),
                  range,
                  translationLanguage || 'mal'
                );
              }

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

          // REQUEST THROTTLING: Limit concurrent requests to prevent server overload
          const MAX_CONCURRENT_REQUESTS = 3;
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
            // First 2 blocks are likely visible (above the fold)
            const visibleBlocks = blocks.slice(0, 2);
            const backgroundBlocks = blocks.slice(2);
            
            return { visibleBlocks, backgroundBlocks };
          };
          
          const { visibleBlocks, backgroundBlocks } = prioritizeBlocks(ayaRangesResponse);
          
          // Load visible blocks first (high priority) - no throttling for initial load
          const visiblePromises = visibleBlocks.map((block, index) => processBlockTranslation(block, index));
          
          // Load background blocks with throttling and staggered delays (low priority)
          setTimeout(() => {
            // Process background blocks with throttling and staggered delays
            backgroundBlocks.forEach((block, index) => {
              // Stagger requests: 200ms delay between starting each batch
              setTimeout(() => {
                processWithThrottle(block, index + visibleBlocks.length);
              }, 200 * Math.floor(index / MAX_CONCURRENT_REQUESTS));
            });
          }, 500); // 500ms delay before starting background loading
          
          // Monitor visible loading completion
          Promise.allSettled(visiblePromises).then((results) => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
          });
        }
      } catch (err) {
        setError(err.message);
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
    setBlockTranslations({});
    setBlockRanges([]);
    setLoadingBlocks(new Set());
    hasFetchedRef.current = false;
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
          background-color: #19B5DD !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          border: none !important;
          padding: 4px 8px !important;
          margin: 0 4px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 1 !important;
          border-radius: 8px !important;
          position: relative !important;
          top: 0 !important;
          min-width: 20px !important;
          min-height: 20px !important;
          text-align: center !important;
          transition: all 0.2s ease-in-out !important;
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
      const target = e.target.closest(".interpretation-link");
      if (target) {
        // Prevent default behavior and stop event propagation
        e.preventDefault();
        e.stopPropagation();
        
        const interpretationNumber = target.getAttribute("data-interpretation");
        const range = target.getAttribute("data-range");
        const langAttr = target.getAttribute("data-lang");
        if (interpretationNumber && range) {
          // Use requestAnimationFrame to ensure state updates properly
          requestAnimationFrame(() => {
            handleInterpretationClick(range, parseInt(interpretationNumber));
          });
        }
      }
    };

    // Add CSS for hover and active effects
    const style = document.createElement('style');
    style.textContent = `
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

  // Loading state - only show full loading screen for initial data fetch
  if (loading && blockRanges.length === 0) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading Block-wise data...
            </p>
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

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="mx-auto min-h-screen bg-white dark:bg-gray-900">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md">
          <div className="mx-auto px-3 sm:px-6 lg:px-8">
            {/* Header with Tabs */}
            <div className="py-3 sm:py-4">
              {/* Translation/Reading Tabs moved to global header (Transition component) */}

            {/* Arabic Title */}
            <div className="text-center mb-3 sm:mb-4">
              <h1 className="text-3xl sm:text-4xl font-arabic dark:text-white text-gray-900">
                {blockData?.surahInfo?.arabic || "Loading..."}
              </h1>
            </div>

            {/* Bismillah and Controls Container */}
            <div className="mb-3 sm:mb-4 relative">
              {/* Bismillah - hide for Al-Fatihah (Surah 1) as it's the first ayah, and At-Tawbah (Surah 9) */}
              {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 ? (
                <div className="flex flex-col items-center px-2 sm:px-4">
                  <img
                    src={theme === "dark" ? DarkModeBismi : Bismi}
                    alt="Bismi"
                    className="w-[236px] h-[52.9px] mb-2"
                  />
                </div>
              ) : (
                // Spacer to preserve layout when Bismillah is hidden (keeps buttons aligned)
                <div className="h-[52.9px] mb-2" />
              )}

              {/* Mobile Ayah/Block selector (only for Malayalam and English) */}
              {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                <div className="flex justify-end mb-4 sm:hidden">
                  <div className="flex gap-1 bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm w-[115px]">
                    <button
                      className="px-2 sm:px-3 py-1.5 w-[55px] text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
                      onClick={handleNavigateToAyahWise}
                    >
                      Ayah
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 bg-white w-[55px] dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                      Block
                    </button>
                  </div>
                </div>
              )}

              {/* Desktop Ayah wise / Block wise buttons (only for Malayalam and English) */}
              {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                <div className="absolute top-0 right-4 sm:right-6 lg:right-42 hidden sm:block">
                  <div className="flex gap-1 sm:gap-2 bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                    <button
                      className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 text-gray-500 rounded-full dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 text-xs sm:text-sm font-medium transition-colors min-h-[40px] sm:min-h-[44px]"
                      onClick={handleNavigateToAyahWise}
                    >
                      Ayah wise
                    </button>
                    <button className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-xs sm:text-sm font-medium shadow-sm transition-colors min-h-[40px] sm:min-h-[44px]">
                      Block wise
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Surah Info moved to global header */}
            {/* Play Audio button moved to header */}
            {/* Qirath selector moved to audio player settings */}
          </div>
        </div>

        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          {/* Main Content */}
          <div className="max-w-full sm:max-w-[1290px] mx-auto pb-6 sm:pb-8">
            
            {/* Render blocks based on aya ranges */}
            {loading && blockRanges.length === 0 ? (
              <BlocksSkeleton count={5} />
            ) : blockRanges && blockRanges.length > 0 ? (
              blockRanges.map((block, blockIndex) => {
                const blockId = block.ID || block.id;
                const start = block.AyaFrom || block.ayafrom || block.from || 1;
                const end = block.AyaTo || block.ayato || block.to || start;
                
                // Get translation data for this block
                const translationInfo = blockTranslations[blockId] || null;
                const translationData = translationInfo?.data;

                // Get Arabic verses for this block
                const arabicSlice = Array.isArray(arabicVerses)
                  ? arabicVerses.slice(start - 1, end)
                  : [];

                return (
                  <div
                    key={`block-${blockId}-${start}-${end}`}
                    className="rounded-xl mb-3 sm:mb-4 border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-[#e8f2f6] active:bg-[#e8f2f6] transition-colors"
                  >
                    

                    <div className="px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 pb-2 sm:pb-3">
                      <p
                        className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-xl leading-relaxed text-right text-gray-900 dark:text-white"
                        style={{ fontFamily: `'${quranFont}', serif`, direction: 'rtl' }}
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
                    <div className="px-4 sm:px-6 md:px-8 pb-2 sm:pb-3">
                      {translationData ? (
                        <div 
                          className={`text-gray-700 dark:text-white leading-relaxed text-left ${
                            translationLanguage === 'hi' ? 'font-hindi' :
                            translationLanguage === 'ur' ? 'font-urdu' :
                            translationLanguage === 'bn' ? 'font-bengali' :
                            translationLanguage === 'ta' ? 'font-tamil' :
                            translationLanguage === 'mal' ? 'font-malayalam' :
                            'font-poppins'
                          }`}
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {/* Render translation text with HTML and clickable interpretation numbers */}
                          {Array.isArray(translationData) && translationData.length > 0 ? (
                            translationData.map((item, idx) => {
                              const translationText = item.TranslationText || item.translationText || item.text || "";
                              const parsedHtml = parseTranslationWithClickableSup(
                                translationText,
                                `${start}-${end}`
                              );
                              
                              return (
                                <div
                                  key={`translation-${blockId}-${idx}`}
                                  className="leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                                />
                              );
                            })
                          ) : translationData.TranslationText || translationData.translationText || translationData.text ? (
                            <div
                              className="leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: parseTranslationWithClickableSup(
                                  translationData.TranslationText || translationData.translationText || translationData.text,
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

                      <div className="flex flex-wrap justify-start gap-1 sm:gap-2 pt-2 sm:pt-3">
                        {/* Copy */}
                        <button
                          className="p-1.5 sm:p-2 text-[#2AA0BF] hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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
                                const rawText = Array.isArray(translationData) && translationData.length > 0
                                  ? (translationData[0].TranslationText || translationData[0].translationText || translationData[0].text || "")
                                  : (translationData.TranslationText || translationData.translationText || translationData.text || "");
                                
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
                          <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Play/Pause */}
                        <button
                          className={`p-1.5 sm:p-2 hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center ${
                            playingBlock === blockId 
                              ? 'text-cyan-500 dark:text-cyan-400' 
                              : 'text-[#2AA0BF]'
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
                            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>

                        {/* Book - Ayah Detail */}
                        {/* BookOpen - Interpretation (hidden for Tamil, English, and Malayalam) */}
                        {translationLanguage !== 'ta' && translationLanguage !== 'E' && translationLanguage !== 'mal' && (
                          <button
                            className="p-1.5 sm:p-2 text-[#2AA0BF] hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}

                        {/* Note/Page - Word by Word */}
                        <button
                          className="p-1.5 sm:p-2 text-[#2AA0BF] hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Bookmark */}
                        <button
                          className={`p-1.5 sm:p-2 text-[#2AA0BF] hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center ${
                            blockBookmarkLoading[`${start}-${end}`]
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
                            <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
                          ) : (
                            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </button>

                        {/* Share */}
                        <button
                          className="p-1.5 sm:p-2 text-[#2AA0BF] hover:text-black hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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
                          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
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

            {/* Bottom Navigation */}
            <div className="bg-white border-t dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8 rounded-lg">
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
            <div className="fixed inset-0 bg-gray-500/70 bg-opacity-50 flex items-start justify-center z-[9999] pt-24 sm:pt-28 lg:pt-32 p-2 sm:p-4 lg:p-6 overflow-y-auto">
              <div className="bg-white dark:bg-[#2A2C38] rounded-lg max-w-xs sm:max-w-4xl max-h-[90vh] overflow-y-auto relative w-full">
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
                />
              </div>
            </div>
          )}

      {/* Overlay Popup for Word by Word (from block toolbar button) */}
      {showWordByWord && selectedVerseForWordByWord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[9999] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden">
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
                  showSuccess={showSuccess}
                  showError={showError}
                />
              </div>
            </div>
          )}

          {/* Floating Back to Top Button */}
          {showScrollButton && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`fixed right-6 z-[60] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                currentAyahInBlock ? 'bottom-32 sm:bottom-36' : 'bottom-6'
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
                console.debug('[BlockWise] onAudioTypesChange called', {
                  prevAudioTypes: audioTypes,
                  newAudioTypes: newTypes,
                  currentBlock,
                  currentAyah
                });
                setAudioTypes(newTypes);
                // If audio is currently playing, restart with new audio types
                if (currentBlock && currentAyah) {
                  stopPlayback();
                  // Pass newTypes directly to avoid closure issue
                  setTimeout(() => {
                    console.debug('[BlockWise] restarting ayah audio with newTypes', newTypes);
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
        </div>
      </div>
      </div>
    </>
  );
};

export default BlockWise;