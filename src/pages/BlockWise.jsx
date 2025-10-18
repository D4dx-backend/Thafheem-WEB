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
import Transition from "../components/Transition";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import InterpretationBlockwise from "./InterpretationBlockwise";
import Bismi from "../assets/bismi.jpg";
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

const BlockWise = () => {
  const [activeTab, setActiveTab] = useState("Translation");
  const [activeView, setActiveView] = useState("Block wise");
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [selectedQirath, setSelectedQirath] = useState("al-hudaify");
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
  const [loadingBlocks, setLoadingBlocks] = useState(new Set());
  const hasFetchedRef = useRef(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const { quranFont, translationLanguage } = useTheme();
  const { surahId } = useParams();
  
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

  // Function to play audio for a specific block - starts from the first ayah
  const playBlockAudio = (blockId, fromContinuous = false) => {
    if (!audioRef.current) return;


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
    
    // Play the first ayah's qirath
    playAyahAudio(blockId, startingAyah);
  };

  // Function to play audio for a specific ayah (qirath → translation → interpretation)
  const playAyahAudio = (blockId, ayahNumber) => {
    if (!audioRef.current) return;

    // Stop any currently playing audio before starting new ayah
    audioRef.current.pause();

    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahNumber).padStart(3, "0");
    
    const qirathUrl = `https://old.thafheem.net/audio/qirath/${selectedQirath}/${qirathPrefixes[selectedQirath]}${surahCode}_${ayahCode}.ogg`;
    
    
    setCurrentAudioType('qirath');
    setCurrentAyahInBlock(ayahNumber);
    setCurrentInterpretationNumber(1); // Reset interpretation counter
    
    audioRef.current.src = qirathUrl;
    audioRef.current.load();
    audioRef.current.play().catch(err => {
      console.error('Error playing qirath audio:', err.name, err.message, qirathUrl);
      // If qirath fails to load, immediately try translation
      playAyahTranslation(blockId, ayahNumber);
    });
  };

  // Function to play translation audio for a specific ayah
  const playAyahTranslation = (blockId, ayahNumber) => {
    if (!audioRef.current) return;
    
    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahNumber).padStart(3, "0");
    
    const translationUrl = `https://old.thafheem.net/audio/translation/T${surahCode}_${ayahCode}.ogg`;
    
    
    setCurrentAudioType('translation');
    audioRef.current.src = translationUrl;
    audioRef.current.load();
    audioRef.current.play().catch(err => {
      console.error('Error loading translation audio:', err.name, err.message);
      // If translation fails, try interpretation anyway
      playAyahInterpretation(blockId, ayahNumber, 1);
    });
  };

  // Function to play interpretation audio for a specific ayah (supports multiple interpretations)
  const playAyahInterpretation = (blockId, ayahNumber, interpretationNum = 1) => {
    if (!audioRef.current) return;
    
    const surahCode = String(surahId).padStart(3, "0");
    const ayahCode = String(ayahNumber).padStart(3, "0");
    
    // First interpretation has no number suffix, subsequent ones have _02, _03, etc.
    let interpretationUrl;
    if (interpretationNum === 1) {
      interpretationUrl = `https://old.thafheem.net/audio/interpretation/I${surahCode}_${ayahCode}.ogg`;
    } else {
      const interpretationCode = String(interpretationNum).padStart(2, "0");
      interpretationUrl = `https://old.thafheem.net/audio/interpretation/I${surahCode}_${ayahCode}_${interpretationCode}.ogg`;
    }
    
    
    setCurrentAudioType('interpretation');
    setCurrentInterpretationNumber(interpretationNum);
    
    // Create a promise to load and play the audio
    audioRef.current.src = interpretationUrl;
    
    // Try to load the audio
    audioRef.current.load();
    
    audioRef.current.play().catch(err => {
      
      // If first interpretation doesn't exist, there are no interpretations for this ayah
      // Move to next ayah immediately (no interpretations to play)
      if (interpretationNum === 1) {
        // Use setTimeout to avoid conflicts with other audio events
        setTimeout(() => {
          moveToNextAyahOrBlock();
        }, 100);
      } else {
        // If interpretation 2, 3, etc. doesn't exist, we've reached the end of interpretations
        // Move to next ayah
        setTimeout(() => {
          moveToNextAyahOrBlock();
        }, 100);
      }
    });
  };

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
      // Play the next ayah in the same block
      playAyahAudio(playingBlock, nextAyah);
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
      }
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
    }
  };

  // Handle main play/pause audio button (same pattern as Reading.jsx)
  const handlePlayAudio = () => {
    if (!blockRanges || blockRanges.length === 0) {
      showError("No blocks available to play");
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
        // Don't clear playingBlock, currentAyahInBlock - keep them for resume
      } else {
        // Resume playback from current position or start from beginning
        if (playingBlock && currentAyahInBlock) {
          // Resume from current position
          setIsContinuousPlay(true);
          setIsPaused(false);
          if (audioRef.current) {
            audioRef.current.play().catch(err => {
              console.error('Error resuming audio:', err);
            });
          }
        } else {
          // Start from first block
          setIsContinuousPlay(true);
          setIsPaused(false);
          const firstBlockId = blockRanges[0].ID || blockRanges[0].id;
          playBlockAudio(firstBlockId);
        }
      }
    } catch (error) {
      console.error('Error in handlePlayAudio:', error);
      setIsContinuousPlay(false);
      setPlayingBlock(null);
      setCurrentAyahInBlock(null);
    }
  };

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
    setCurrentInterpretationNumber(1);
    setIsPaused(false);
  };

  // Handle audio ended event to chain audio files
  useEffect(() => {
    const handleAudioEnded = () => {
      if (!playingBlock || !currentAyahInBlock) return;


      if (currentAudioType === 'qirath') {
        // Play translation after qirath for the same ayah
        playAyahTranslation(playingBlock, currentAyahInBlock);
      } else if (currentAudioType === 'translation') {
        // Play first interpretation after translation for the same ayah
        playAyahInterpretation(playingBlock, currentAyahInBlock, 1);
      } else if (currentAudioType === 'interpretation') {
        // After interpretation, try the next interpretation number
        const nextInterpretationNum = currentInterpretationNumber + 1;
        playAyahInterpretation(playingBlock, currentAyahInBlock, nextInterpretationNum);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleAudioEnded);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingBlock, currentAudioType, currentAyahInBlock, currentInterpretationNumber, isContinuousPlay, blockRanges]);

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

  // Restart qirath audio when selectedQirath changes during playback
  useEffect(() => {
    if (playingBlock && currentAyahInBlock && currentAudioType === 'qirath' && audioRef.current) {
      // Restart qirath with new reciter for the current ayah
      const surahCode = String(surahId).padStart(3, "0");
      const ayahCode = String(currentAyahInBlock).padStart(3, "0");
      const qirathUrl = `https://old.thafheem.net/audio/qirath/${selectedQirath}/${qirathPrefixes[selectedQirath]}${surahCode}_${ayahCode}.ogg`;
      
      
      audioRef.current.src = qirathUrl;
      audioRef.current.play().catch(err => {
        console.error('Error playing qirath audio:', err);
        playAyahTranslation(playingBlock, currentAyahInBlock);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQirath]);

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
              console.error(`❌ BlockWise: Failed to load block ${range}:`, error.message);
              
              // Remove from loading set even on error
              setLoadingBlocks(prev => {
                const updated = new Set(prev);
                updated.delete(blockId);
                return updated;
              });
            }
          };

          // VIEWPORT-BASED LOADING: Load visible blocks first, then background
          const prioritizeBlocks = (blocks) => {
            // First 2 blocks are likely visible (above the fold)
            const visibleBlocks = blocks.slice(0, 2);
            const backgroundBlocks = blocks.slice(2);
            
            return { visibleBlocks, backgroundBlocks };
          };
          
          const { visibleBlocks, backgroundBlocks } = prioritizeBlocks(ayaRangesResponse);
          
          // Load visible blocks first (high priority)
          const visiblePromises = visibleBlocks.map((block, index) => processBlockTranslation(block, index));
          
          // Load background blocks after a short delay (low priority)
          setTimeout(() => {
            const backgroundPromises = backgroundBlocks.map((block, index) => 
              processBlockTranslation(block, index + visibleBlocks.length)
            );
            
            Promise.allSettled(backgroundPromises).then((results) => {
              const successful = results.filter(r => r.status === 'fulfilled').length;
            });
          }, 100); // 100ms delay for background loading
          
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
        const interpretationNumber = target.getAttribute("data-interpretation");
        const range = target.getAttribute("data-range");
        const langAttr = target.getAttribute("data-lang");
        if (interpretationNumber && range) {
          handleInterpretationClick(range, parseInt(interpretationNumber));
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

    document.addEventListener("click", handleSupClick);
    return () => {
      document.removeEventListener("click", handleSupClick);
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

  // Loading state - only show full loading screen for initial data fetch
  if (loading && blockRanges.length === 0) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Transition />
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
        <Transition />
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
      <Transition />
      <div className="mx-auto min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          {/* Header with Tabs */}
          <div className="bg-white dark:bg-gray-900 py-4 sm:py-6">
            {/* Translation/Reading Tabs */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow-sm min-h-[40px] sm:min-h-[44px]">
                    <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white" />
                    <span className="text-xs sm:text-sm font-poppins text-black dark:text-white">
                      Translation
                    </span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-xs sm:text-sm font-medium min-h-[40px] sm:min-h-[44px]">
                    <Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white" />
                    <Link to={`/reading/${surahId}`}>
                      <span className="text-xs sm:text-sm font-poppins text-black dark:text-white cursor-pointer hover:underline">
                        Reading
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>

            {/* Arabic Title */}
            <div className="text-center mb-4 sm:mb-6">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                style={{ fontFamily: "Arial" }}
              >
                {blockData?.surahInfo?.arabic || "القرآن"}
              </h1>
              <div className="flex justify-center space-x-3 sm:space-x-4 text-gray-600 mb-4 sm:mb-6">
                <button className="p-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  {kabahIcon}
                </button>
                <button className="p-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Bismillah with Controls */}
            <div className="mb-6 sm:mb-8 relative">
              <div className="flex flex-col items-center px-2 sm:px-4">
                <img
                  src={Bismi}
                  alt="Bismi"
                  className="w-[236px] h-[52.9px] mb-4 dark:invert"
                />
              </div>

              {/* Desktop Ayah wise / Block wise buttons */}
              <div className="absolute top-0 right-0 hidden sm:block">
                <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                  <button
                    className="px-2 sm:px-3 lg:px-4 py-1.5 text-gray-500 rounded-full dark:text-white dark:hover:text-white dark:hover:bg-gray-800 text-xs sm:text-sm font-medium hover:text-gray-700 transition-colors"
                    onClick={() => navigate(`/surah/${surahId}`)}
                  >
                    Ayah wise
                  </button>
                  {/* Hide blockwise for Tamil, Hindi, and Bangla */}
                  {translationLanguage !== 'ta' && translationLanguage !== 'hi' && translationLanguage !== 'bn' && (
                    <button className="px-2 sm:px-3 lg:px-4 py-1.5 dark:bg-black dark:text-white bg-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow transition-colors">
                      Block wise
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between max-w-full sm:max-w-[1290px] mx-auto space-y-2 sm:space-y-0">
              <div className="flex items-center justify-start space-x-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
                <Link to={`/surahinfo/${surahId}`}>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                    Surah info
                  </span>
                </Link>
              </div>

              {/* Play Audio */}
              <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  {/* Audio Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Play/Pause Audio Button (same as Reading.jsx) */}
                    <button 
                      className={`flex items-center space-x-2 transition-colors min-h-[44px] px-2 ${
                        isContinuousPlay 
                          ? "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500" 
                          : "text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300"
                      }`}
                      onClick={handlePlayAudio}
                    >
                      {isContinuousPlay ? (
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                  <span className="text-xs sm:text-sm font-medium">
                        {isContinuousPlay ? "Pause Audio" : (playingBlock ? "Resume Audio" : "Play Audio")}
                  </span>
                </button>

                    {/* Stop/Reset Button (same as Reading.jsx) */}
                    {playingBlock && (
                      <button 
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors min-h-[44px] px-2"
                        onClick={stopPlayback}
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
                  
                  {/* Qirath Dropdown */}
                  <select
                    value={selectedQirath}
                    onChange={(e) => setSelectedQirath(e.target.value)}
                    className="px-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:border-cyan-500 dark:hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-colors min-h-[44px]"
                    aria-label="Select Qirath"
                  >
                    <option value="al-hudaify">Al-Hudaify</option>
                    <option value="al-afasy">Al-Afasy</option>
                    <option value="al-ghamidi">Al-Ghamidi</option>
                  </select>
                </div>
                <div className="flex justify-end sm:hidden">
                  <div className={`flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm ${translationLanguage === 'ta' || translationLanguage === 'hi' || translationLanguage === 'bn' ? 'w-[55px]' : 'w-[115px]'}`}>
                    <button
                      onClick={() => navigate(`/surah/${surahId}`)}
                      className="px-2 sm:px-3 py-1.5 w-[55px] text-gray-500 rounded-full dark:text-white dark:hover:text-white dark:hover:bg-gray-800 text-xs font-medium hover:text-gray-700 transition-colors"
                    >
                      Ayah
                    </button>
                    {/* Hide blockwise for Tamil, Hindi, and Bangla */}
                    {translationLanguage !== 'ta' && translationLanguage !== 'hi' && translationLanguage !== 'bn' && (
                      <button className="px-2 sm:px-3 py-1.5 w-[55px] dark:bg-black dark:text-white bg-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                        Block
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    className="rounded-xl mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-[#e8f2f6] active:bg-[#e8f2f6] transition-colors"
                  >
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium">
                        Block {blockIndex + 1}: Ayahs {start}
                        {end && end !== start ? `-${end}` : ""}
                      </span>
                    </div>

                    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                      <p
                        className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-xl leading-loose text-center text-gray-900 dark:text-white px-2"
                        style={{ fontFamily: `'${quranFont}', serif` }}
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
                    <div className="px-3 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-4 md:pb-6 lg:pb-8">
                      {translationData ? (
                        <div className="text-gray-700 max-w-[1081px] dark:text-white leading-relaxed text-xs sm:text-sm md:text-base lg:text-base font-poppins">
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
                                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                                />
                              );
                            })
                          ) : translationData.TranslationText || translationData.translationText || translationData.text ? (
                            <div
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

                      <div className="flex flex-wrap justify-start gap-1 sm:gap-2 pt-3 sm:pt-4">
                        {/* Copy */}
                        <button
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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

                        {/* Play */}
                        <button
                          className={`p-1.5 sm:p-2 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center ${
                            playingBlock === blockId 
                              ? 'text-cyan-500 dark:text-cyan-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                          onClick={() => playBlockAudio(blockId)}
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
                        <button
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
                          onClick={() => {
                            const targetUrl = `/surah/${surahId}#verse-${start}`;
                            navigate(targetUrl);
                          }}
                          title="View ayah details"
                        >
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Note/Page - Word by Word */}
                        <button
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
                          onClick={() => {
                            navigate(`/word-by-word/${surahId}/${start}`, {
                              state: { from: location.pathname },
                            });
                          }}
                          title="Word by word"
                        >
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Bookmark */}
                        <button
                          className={`p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center ${
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
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
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
            <div className="fixed inset-0 bg-gray-500/70 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
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

          {/* Overlay Popup for Block Interpretation (from clicking sup numbers in translation) */}
          {selectedInterpretation && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
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
        </div>
      </div>
    </>
  );
};

export default BlockWise;