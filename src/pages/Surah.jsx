import {
  Play,
  Bookmark,
  Share2,
  Copy,
  AlignLeft,
  ChevronDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Info,
  Building2,
  Heart,
  LibraryBig,
  Notebook,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import HomepageNavbar from "../components/HomeNavbar";
import { Link } from "react-router-dom";
import WordByWord from "./WordByWord";
import StarNumber from "../components/StarNumber";
import Bismi from "../assets/bismi.png";
import DarkModeBismi from "../assets/darkmode-bismi.png";
import { useTheme } from "../context/ThemeContext";
import WordByWordIcon from "../components/WordByWordIcon";
import { useAuth } from "../context/AuthContext";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";
import AyahModal from "../components/AyahModal";
import { playAyahAudio } from "../utils/audio";
import audioManager from "../utils/audioManager";
import {
  fetchAyahAudioTranslations,
  listSurahNames,
  fetchSurahs,
  fetchArabicVerses,
  fetchPageRanges,
  fetchAyaTranslation,
  fetchAyaRanges,
} from "../api/apifunction";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import banglaTranslationService from "../services/banglaTranslationService";
import englishTranslationService from "../services/englishTranslationService";
import { VersesSkeleton, LoadingWithProgress } from "../components/LoadingSkeleton";
import StickyAudioPlayer from "../components/StickyAudioPlayer";
import { saveLastReading } from "../services/readingProgressService";
import { AyahViewIcon, BlockViewIcon } from "../components/ViewToggleIcons";
import ToggleGroup from "../components/ToggleGroup";
import {
  getCalligraphicSurahName,
  surahNameFontFamily,
} from "../utils/surahNameUtils.js";

// Helper function to decode HTML entities
const decodeHTML = (html) => {
  if (!html) return html;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};
import { useSurahViewCache } from "../context/SurahViewCacheContext";
import useSequentialEnglishFootnotes from "../hooks/useSequentialEnglishFootnotes";

const TAMIL_PAGE_SIZE = 25;
const DEFAULT_TRANSLATION_PAGE_SIZE = 40;
const PAGINATED_TRANSLATION_LANGUAGES = new Set(['bn', 'hi', 'ur', 'ta', 'E']);

const Surah = () => {
  const {
    quranFont,
    fontSize,
    adjustedTranslationFontSize,
    translationLanguage,
    theme,
    viewType,
    setViewType: setContextViewType,
  } = useTheme();
  const showBlockNavigation = translationLanguage === 'mal' || translationLanguage === 'E';
  const { user } = useAuth();
  const { surahId } = useParams(); // Get surah ID from URL
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get query parameters
  const { pathname } = location;
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  const handleNavigateToBlockWise = useCallback(() => {
    if (showBlockNavigation) {
      setContextViewType("Block Wise");
    }
  }, [setContextViewType, showBlockNavigation]);

  // Handle viewType from location state or sessionStorage (e.g., when navigating from search)
  useEffect(() => {
    if (location.state?.viewType) {
      setContextViewType(location.state.viewType);
    } else {
      // Check sessionStorage for navigation state from search
      const navState = sessionStorage.getItem('navigationState');
      if (navState) {
        try {
          const state = JSON.parse(navState);
          if (state.viewType) {
            setContextViewType(state.viewType);
          }
          sessionStorage.removeItem('navigationState');
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [location.state, setContextViewType]);

  useEffect(() => {
    if (!showBlockNavigation && viewType !== "Ayah Wise") {
      setContextViewType("Ayah Wise");
      return;
    }

    if (showBlockNavigation && viewType === "Block Wise") {
      const targetPath = `/blockwise/${surahId}`;
      if (pathname !== targetPath) {
        navigate(targetPath);
      }
    }
  }, [viewType, showBlockNavigation, surahId, navigate, pathname, setContextViewType]);

  // Check if user came from Juz view
  const fromJuz = new URLSearchParams(location.search).get("fromJuz");
  const [copiedVerse, setCopiedVerse] = useState(null);

  // State management
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [selectedVerseForWordByWord, setSelectedVerseForWordByWord] =
    useState(null);
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [selectedVerseForInterpretation, setSelectedVerseForInterpretation] =
    useState(null);
  const [ayahData, setAyahData] = useState([]);
  const [arabicVerses, setArabicVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState({});
  const [tamilDownloading, setTamilDownloading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  // Favorite surah state
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Hindi footnote modal state
  const [showHindiFootnoteModal, setShowHindiFootnoteModal] = useState(false);
  const [hindiFootnoteContent, setHindiFootnoteContent] = useState('');
  const [hindiFootnoteLoading, setHindiFootnoteLoading] = useState(false);

  // Bangla explanation modal state
  const [showBanglaExplanationModal, setShowBanglaExplanationModal] = useState(false);
  const [banglaExplanationContent, setBanglaExplanationContent] = useState('');
  const [banglaExplanationLoading, setBanglaExplanationLoading] = useState(false);

  // Urdu footnote modal state
  const [showUrduFootnoteModal, setShowUrduFootnoteModal] = useState(false);
  const [urduFootnoteContent, setUrduFootnoteContent] = useState('');
  const [urduFootnoteLoading, setUrduFootnoteLoading] = useState(false);

  // English footnote modal state
  const [showEnglishFootnoteModal, setShowEnglishFootnoteModal] = useState(false);
  const [englishFootnoteContent, setEnglishFootnoteContent] = useState('');
  const [englishFootnoteLoading, setEnglishFootnoteLoading] = useState(false);

  // Audio functionality states
  const [playingAyah, setPlayingAyah] = useState(null);
  const [selectedQari, setSelectedQari] = useState(() => {
    const savedReciter = localStorage.getItem("reciter");
    return savedReciter || "al-afasy";
  });
  const [audioTypes, setAudioTypes] = useState(['quran']); // Array of selected audio types
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
    return savedSpeed ? parseFloat(savedSpeed) : 1.0;
  });
  const [currentAudioTypeIndex, setCurrentAudioTypeIndex] = useState(0); // Track which audio type is currently playing
  const [audioEl, setAudioEl] = useState(null);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const audioRefForCleanup = useRef(null); // Track audio for cleanup
  const isComponentMountedRef = useRef(false); // Track component mount status

  // Paginated translation state
  const [translationPagination, setTranslationPagination] = useState(null);
  const [isLoadingTranslationPage, setIsLoadingTranslationPage] = useState(false);
  const loadMoreTranslationRef = useRef(null);
  const { getAyahViewCache, setAyahViewCache } = useSurahViewCache();
  const hydratedAyahCacheRef = useRef(false);

  useEffect(() => {
    hydratedAyahCacheRef.current = false;
  }, [surahId, translationLanguage]);

  useEffect(() => {
    if (!surahId) {
      return;
    }

    const cached = getAyahViewCache?.(surahId, translationLanguage);
    if (cached) {
      hydratedAyahCacheRef.current = true;
      setAyahData(cached.ayahData || []);
      setArabicVerses(cached.arabicVerses || []);
      setSurahInfo(cached.surahInfo || null);
      setTranslationPagination(cached.translationPagination || null);
      setLoading(false);
    }
  }, [surahId, translationLanguage, getAyahViewCache]);

  useEffect(() => {
    if (surahId) {
      saveLastReading({ surahId, viewType: "surah", path: `/surah/${surahId}` });
    }
  }, [surahId]);

  useSequentialEnglishFootnotes({
    enabled: translationLanguage === 'E',
    context: 'ayahwise',
    dependencies: [ayahData, surahId],
  });

  const stripArabicVerseMarker = (text) => {
    if (!text) return "";
    return text.replace(/\s*﴿\s*[\d\u0660-\u0669]+\s*﴾\s*$/u, "").trim();
  };

  const toArabicNumber = (num) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicDigits[digit] || digit)
      .join("");
  };

  const buildPaginatedFallbackAyahs = useCallback((count, language) => {
    const messageMap = {
      ta: (idx) => `Tamil translation not available for verse ${idx + 1}`,
      hi: () => 'Hindi translation service unavailable. Please try again later.',
      ur: () => 'Urdu translation service unavailable. Please try again later.',
      bn: (idx) => `Bangla translation not available for verse ${idx + 1}`,
      E: (idx) => `English translation not available for verse ${idx + 1}`,
    };

    const getMessage = messageMap[language] || ((idx) => `Translation not available for verse ${idx + 1}`);

    return Array.from({ length: count }, (_, index) => ({
      number: index + 1,
      ArabicText: '',
      Translation: getMessage(index),
      ...(language === 'E' ? { interpretationCount: 0 } : {}),
    }));
  }, []);

  const getPaginatedTranslationLimit = useCallback(() => {
    return translationLanguage === 'ta'
      ? TAMIL_PAGE_SIZE
      : DEFAULT_TRANSLATION_PAGE_SIZE;
  }, [translationLanguage]);

const upsertArabicVerses = useCallback((incomingVerses, replace = false) => {
  if (!Array.isArray(incomingVerses)) {
    if (replace) {
      setArabicVerses([]);
    }
    return;
  }

  setArabicVerses(prev => {
    if (replace) {
      return incomingVerses;
    }

    const verseMap = new Map();
    prev.forEach(verse => {
      if (verse?.verse_number != null) {
        verseMap.set(verse.verse_number, verse);
      }
    });
    incomingVerses.forEach(verse => {
      if (verse?.verse_number != null) {
        verseMap.set(verse.verse_number, verse);
      }
    });

    return Array.from(verseMap.values()).sort((a, b) => a.verse_number - b.verse_number);
  });
}, []);

  const fetchPaginatedTranslations = useCallback(
    async ({ page = 1, replace = false, trackLoading = true } = {}) => {
      if (!surahId || !PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage)) {
        return null;
      }

      const surahNumber = parseInt(surahId, 10);
      if (Number.isNaN(surahNumber)) return null;

      const serviceMap = {
        bn: banglaTranslationService,
        hi: hindiTranslationService,
        ur: urduTranslationService,
        ta: tamilTranslationService,
        E: englishTranslationService,
      };

      const service = serviceMap[translationLanguage];
      if (!service) return null;

      if (translationLanguage === 'ur' && (replace || page === 1)) {
        urduTranslationService.resetFootnoteOrdering(surahNumber);
      }

      if (trackLoading) {
        setIsLoadingTranslationPage(true);
      }

      try {
        const limit = getPaginatedTranslationLimit();
        const response = await service.getSurahTranslations(surahNumber, {
          page,
          limit,
        });

        const rawItems = Array.isArray(response?.translations)
          ? response.translations
          : Array.isArray(response)
            ? response
            : [];

        let processedItems = rawItems;

        if (translationLanguage === 'bn') {
          processedItems = rawItems.map((verse) => ({
            ...verse,
            Translation:
              banglaTranslationService.parseBanglaTranslationWithClickableExplanations(
                verse.Translation,
                surahNumber,
                verse.number
              ),
          }));
        } else if (translationLanguage === 'ur') {
          processedItems = rawItems.map((verse) => {
            const parsed = urduTranslationService.parseUrduTranslationWithClickableFootnotes(
              verse.Translation || '',
              surahNumber,
              verse.number
            );

            return {
              ...verse,
              Translation: parsed,
              RawTranslation: verse.Translation || '',
            };
          });
        } else if (translationLanguage === 'E') {
          processedItems = rawItems.map((verse) => {
            const interpretationMeta = Array.isArray(verse.interpretations) ? verse.interpretations : [];
            const footnoteMetadata = verse.footnote_metadata || null;

            return {
              ...verse,
              Translation:
                englishTranslationService.parseEnglishTranslationWithClickableFootnotes(
                  verse.Translation || verse.translation_text,
                  surahNumber,
                  verse.number
                ),
              interpretationCount: verse.interpretationCount ?? interpretationMeta.length ?? 0,
              interpretations: interpretationMeta,
            };
          });
        }

        let arabicResult = null;
        try {
          arabicResult = await fetchArabicVerses(surahNumber, { page, limit });
        } catch (arabicError) {
          console.error('Error fetching Arabic verses page:', arabicError);
        }

        const arabicItems = Array.isArray(arabicResult?.verses)
          ? arabicResult.verses
          : Array.isArray(arabicResult)
            ? arabicResult
            : [];

        if (isComponentMountedRef.current) {
          if (replace) {
            setAyahData(processedItems);
          } else if (processedItems.length > 0) {
            setAyahData((prev) => [...prev, ...processedItems]);
          }

          setTranslationPagination(response?.pagination || null);
          if (arabicItems.length > 0) {
            upsertArabicVerses(arabicItems, replace);
          } else if (replace) {
            upsertArabicVerses([], true);
          }
        }

        return { items: processedItems, pagination: response?.pagination || null };
      } catch (error) {
        if (replace && isComponentMountedRef.current) {
          setAyahData([]);
          setTranslationPagination(null);
        }
        throw error;
      } finally {
        if (trackLoading && isComponentMountedRef.current) {
          setIsLoadingTranslationPage(false);
        }
      }
    },
    [surahId, translationLanguage, getPaginatedTranslationLimit, upsertArabicVerses]
  );

  const handleLoadMoreTranslations = useCallback(async () => {
    if (
      !PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage) ||
      isLoadingTranslationPage ||
      !translationPagination ||
      !translationPagination.hasNext
    ) {
      return;
    }

    const nextPage = (translationPagination.page || 1) + 1;

    try {
      await fetchPaginatedTranslations({ page: nextPage, replace: false });
    } catch (error) {
      console.error('Error loading more translations:', error);
      showError?.('Failed to load more ayahs. Please try again.');
    }
  }, [
    translationLanguage,
    translationPagination,
    isLoadingTranslationPage,
    fetchPaginatedTranslations,
    showError,
  ]);
  useEffect(() => {
    if (!PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage)) {
      return;
    }

    const target = loadMoreTranslationRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          translationPagination?.hasNext &&
          !isLoadingTranslationPage
        ) {
          handleLoadMoreTranslations();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
    };
  }, [
    translationLanguage,
    translationPagination,
    isLoadingTranslationPage,
    handleLoadMoreTranslations,
  ]);

  // Ref to store handleTopPlayPause for event listener (defined later)
  const handleTopPlayPauseRef = useRef(null);

  // Listen for play audio event from header
  useEffect(() => {
    const handlePlayAudioEvent = () => {
      if (handleTopPlayPauseRef.current) {
        handleTopPlayPauseRef.current();
      }
    };

    window.addEventListener('playAudio', handlePlayAudioEvent);
    return () => {
      window.removeEventListener('playAudio', handlePlayAudioEvent);
    };
  }, []);

  // Check for wordByWord query parameter and auto-open modal
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const wordByWordParam = urlParams.get("wordByWord");

    if (wordByWordParam) {
      const verseNumber = parseInt(wordByWordParam) || 1;

      // Set a small delay to ensure the component is fully loaded
      const timer = setTimeout(() => {
        setSelectedVerseForWordByWord(verseNumber);
        setShowWordByWord(true);

        // Clean up URL by removing the parameter
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete("wordByWord");
        window.history.replaceState({}, "", newUrl.pathname);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.search, loading]); // Depend on loading to ensure data is ready

  // Additional effect to ensure Hindi footnotes are properly rendered after component mount
  useEffect(() => {
    if (translationLanguage === 'hi' && ayahData.length > 0 && !loading) {
      // Run multiple checks with increasing delays to ensure footnotes are properly rendered
      const timers = [200, 500, 1000, 2000].map(delay =>
        setTimeout(() => {
          const translationElements = document.querySelectorAll('p[data-hindi-translation]');
          let reParsedCount = 0;

          translationElements.forEach((element, index) => {
            const rawText = element.getAttribute('data-hindi-translation');
            const surahNo = element.getAttribute('data-surah');
            const ayahNo = element.getAttribute('data-ayah');
            const currentHTML = element.innerHTML;

            // Check for raw HTML in both raw text and current HTML
            const hasRawHTML = rawText && (rawText.includes('<sup class="f-note">') || rawText.includes('<sup>'));
            const hasRawHTMLInCurrent = currentHTML.includes('<sup class="f-note">') || currentHTML.includes('<sup>');
            const hasNoClickableFootnotes = !element.querySelector('.hindi-footnote-link');

            if ((hasRawHTML || hasRawHTMLInCurrent) && hasNoClickableFootnotes) {

              const parsed = hindiTranslationService.parseHindiTranslationWithClickableExplanations(
                rawText || currentHTML,
                parseInt(surahNo),
                parseInt(ayahNo)
              );
              element.innerHTML = parsed;
              reParsedCount++;
            }
          });

          // Re-parsed Hindi translation elements
        }, delay)
      );

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [translationLanguage, ayahData, loading]);

  // Cleanup audio when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      // Stop and clear audio on unmount - use ref to get current audio
      if (audioRefForCleanup.current) {
        audioRefForCleanup.current.pause();
        audioRefForCleanup.current.src = '';
        audioRefForCleanup.current.currentTime = 0;
        audioRefForCleanup.current.onended = null;
        audioRefForCleanup.current.onerror = null;
        audioRefForCleanup.current = null;
      }
    };
  }, []); // Only run on unmount

  // Update ref whenever audioEl changes
  useEffect(() => {
    audioRefForCleanup.current = audioEl;
  }, [audioEl]);

  // Fetch ayah data and surah info
  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();

    const loadSurahData = async () => {
      if (!surahId || hydratedAyahCacheRef.current) return;

      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);
        setArabicVerses([]);
        setTranslationPagination(null);

        const [
          surahNamesResponse,
          surahsResponse,
          pageRangesResponse,
        ] = await Promise.all([
          listSurahNames(),
          fetchSurahs(),
          fetchPageRanges(),
        ]);

        // Check if component is still mounted before proceeding
        if (!isMounted) return;

        // Get the correct verse count from page ranges API
        const getVerseCountFromPageRanges = (surahId, pageRanges) => {
          const surahRanges = pageRanges.filter(
            (range) => range.SuraId === parseInt(surahId)
          );
          if (surahRanges.length === 0) return 7; // Default fallback

          // Find the maximum ayato value for this surah
          const maxAyah = Math.max(...surahRanges.map((range) => range.ayato));
          return maxAyah;
        };

        // Compute verse count
        let verseCount = getVerseCountFromPageRanges(
          surahId,
          pageRangesResponse || []
        );

        if (
          verseCount === 7 &&
          surahNamesResponse &&
          Array.isArray(surahNamesResponse)
        ) {
          const currentSurahForCount = surahNamesResponse.find(
            (s) => s.id === parseInt(surahId)
          );
          if (currentSurahForCount && currentSurahForCount.ayahs) {
            verseCount = currentSurahForCount.ayahs;
          }
        }

        // Check if component is still mounted before setting state
        if (!isMounted) return;

        // Translation source depends on selected language
        if (PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage)) {
          try {
            const result = await fetchPaginatedTranslations({
              page: 1,
              replace: true,
              trackLoading: false,
            });
            if (!isMounted) return;
            const items = result?.items || [];
            if (!items.length) {
              const fallbackAyahData = buildPaginatedFallbackAyahs(
                verseCount,
                translationLanguage
              );
              setAyahData(fallbackAyahData);
              setTranslationPagination(null);
            }
          } catch (error) {
            if (!isMounted) return;
            if (error.name !== 'AbortError') {
              console.error(`Error fetching ${translationLanguage} translations:`, error);
            }
            const fallbackAyahData = buildPaginatedFallbackAyahs(
              verseCount,
              translationLanguage
            );
            setAyahData(fallbackAyahData);
            setTranslationPagination(null);
          }
        } else {
          const ayahResponse = await fetchAyahAudioTranslations(parseInt(surahId));
          if (!isMounted) return;
          if (!ayahResponse || !Array.isArray(ayahResponse) || ayahResponse.length === 0) {
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Translation not available for verse ${index + 1}. The API server may be temporarily unavailable. Please try again later.`,
            }));
            setAyahData(fallbackAyahData);
          } else {
            const formattedAyahData = ayahResponse.map((ayah, idx) => {
              const verseNumber = (() => {
                const candidates = [
                  ayah.ayaid,
                  ayah.AyaId,
                  ayah.AyaID,
                  ayah.contiayano,
                  ayah.contiAyaNo,
                  idx + 1
                ];
                for (const candidate of candidates) {
                  const parsed = Number.parseInt(candidate, 10);
                  if (Number.isFinite(parsed) && parsed > 0) {
                    return parsed;
                  }
                }
                return idx + 1;
              })();

              return {
                number: verseNumber,
                ArabicText: '',
                Translation: (ayah.AudioText || '')
                  .replace(/<sup[^>]*foot_note[^>]*>\d+<\/sup>/g, '')
                  .replace(/\s+/g, ' ')
                  .trim(),
              };
            });
            setAyahData(formattedAyahData);
          }

          try {
            const arabicResult = await fetchArabicVerses(parseInt(surahId));
            if (!isMounted) return;
            const normalizedArabic = Array.isArray(arabicResult?.verses)
              ? arabicResult.verses
              : Array.isArray(arabicResult)
                ? arabicResult
                : [];
            setArabicVerses(normalizedArabic);
          } catch (arabicError) {
            if (!isMounted) return;
            if (arabicError.name !== 'AbortError') {
              console.error('Error fetching Arabic verses:', arabicError);
            }
            setArabicVerses([]);
          }
        }

        if (!isMounted) return;

        const currentSurah = surahNamesResponse.find(
          (s) => s.id === parseInt(surahId)
        );
        // Get type from surahsResponse which includes Makki/Madani information
        const currentSurahWithType = surahsResponse.find(
          (s) => s.number === parseInt(surahId)
        );
        setSurahInfo(
          currentSurah
            ? {
              arabic: currentSurah.arabic,
              number: currentSurah.id,
              type: currentSurahWithType?.type || 'Makki'
            }
            : {
              arabic: "Unknown Surah",
              number: parseInt(surahId),
              type: 'Makki'
            }
        );
      } catch (err) {
        // Only handle error if component is still mounted and it's not an abort error
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
          console.error("Error fetching surah data:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSurahData();

    // Cleanup function to cancel in-flight requests
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [surahId, translationLanguage, fetchPaginatedTranslations, buildPaginatedFallbackAyahs]);

  useEffect(() => {
    if (
      !surahId ||
      loading ||
      !setAyahViewCache ||
      !Array.isArray(ayahData) ||
      ayahData.length === 0
    ) {
      return;
    }

    setAyahViewCache(surahId, translationLanguage, {
      ayahData,
      arabicVerses,
      surahInfo,
      translationPagination,
      __meta: { isComplete: true },
    });
  }, [
    surahId,
    translationLanguage,
    ayahData,
    arabicVerses,
    surahInfo,
    translationPagination,
    loading,
    setAyahViewCache,
  ]);

  // Load bookmarked verses for signed-in users
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user || !surahId) return;

      try {
        const bookmarks = await BookmarkService.getBookmarks(
          user.uid,
          "translation"
        );
        const bookmarkedKeys = new Set(
          bookmarks
            .filter((bookmark) => bookmark.surahId === parseInt(surahId))
            .map((bookmark) => `${bookmark.surahId}:${bookmark.verseId}`)
        );
        setBookmarkedVerses(bookmarkedKeys);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
      }
    };

    loadBookmarks();
  }, [user, surahId]);

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

  // Handle scroll to specific verse when navigating with anchor
  useEffect(() => {
    const handleScrollToVerse = () => {
      // Check multiple sources for verse number: hash, location state, sessionStorage
      let verseNumber = null;
      
      // First, check hash
      const hash = window.location.hash;
      if (hash && hash.startsWith("#verse-")) {
        const hashVerse = parseInt(hash.replace("#verse-", ""), 10);
        if (!isNaN(hashVerse) && hashVerse > 0) {
          verseNumber = hashVerse;
        }
      }
      
      // If no hash, check location state
      if (!verseNumber && location.state?.scrollToVerse) {
        const stateVerse = parseInt(location.state.scrollToVerse, 10);
        if (!isNaN(stateVerse) && stateVerse > 0) {
          verseNumber = stateVerse;
        }
      }
      
      // If still no verse, check sessionStorage (backup from search navigation)
      if (!verseNumber) {
        const storedVerse = sessionStorage.getItem('scrollToVerse');
        if (storedVerse) {
          const storedVerseNum = parseInt(storedVerse, 10);
          if (!isNaN(storedVerseNum) && storedVerseNum > 0) {
            verseNumber = storedVerseNum;
            sessionStorage.removeItem('scrollToVerse'); // Clean up after use
          }
        }
      }

      if (verseNumber && !loading) {
        // Check if this is a paginated language and if the verse is beyond loaded data
        const isPaginated = PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage);
        const limit = isPaginated ? getPaginatedTranslationLimit() : 0;
        // Verse elements use id={`verse-${index + 1}`} where index is array index
        // So if we have 40 items, we have verse-1 through verse-40
        const maxLoadedVerseIndex = ayahData.length;
        const needsMoreData = isPaginated && verseNumber > maxLoadedVerseIndex;
        
        // If verse is beyond loaded data, load the required page(s)
        if (needsMoreData && limit > 0) {
          const targetPage = Math.ceil(verseNumber / limit);
          console.log(`Loading page ${targetPage} to get verse ${verseNumber} (currently loaded ${maxLoadedVerseIndex} verses)`);
          
          // Load all pages up to the target page
          const loadPagesUpTo = async (targetPageNum) => {
            let currentPage = translationPagination?.page || 1;
            const maxPage = Math.max(currentPage, targetPageNum);
            
            while (currentPage < maxPage) {
              currentPage++;
              try {
                await fetchPaginatedTranslations({ page: currentPage, replace: false, trackLoading: false });
                // Wait a bit for DOM to update
                await new Promise(resolve => setTimeout(resolve, 100));
              } catch (error) {
                console.error(`Error loading page ${currentPage}:`, error);
                break;
              }
            }
          };
          
          loadPagesUpTo(targetPage).then(() => {
            // After loading, try to scroll with retries
            const scrollAfterLoad = (attempt = 1) => {
              const verseElement = document.getElementById(`verse-${verseNumber}`);
              if (verseElement) {
                verseElement.scrollIntoView({ behavior: "smooth", block: "center" });
                verseElement.style.backgroundColor = "#fef3c7";
                setTimeout(() => {
                  verseElement.style.backgroundColor = "";
                }, 2000);
              } else if (attempt < 5) {
                // Retry if element not found yet (DOM might still be updating)
                setTimeout(() => scrollAfterLoad(attempt + 1), attempt * 200);
              } else {
                console.warn(`Could not find verse element: verse-${verseNumber} after loading pages. Current array length: ${ayahData.length}`);
              }
            };
            setTimeout(() => scrollAfterLoad(1), 300);
          });
          return;
        }
        
        // If verse should be loaded, try to scroll
        if (ayahData.length > 0) {
          const scrollToElement = (attempt = 1) => {
            const verseElement = document.getElementById(`verse-${verseNumber}`);
            
            if (verseElement) {
              // Scroll to element
              verseElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              // Highlight the verse briefly
              verseElement.style.backgroundColor = "#fef3c7";
              setTimeout(() => {
                verseElement.style.backgroundColor = "";
              }, 2000);
              return true;
            } else if (attempt < 3) {
              // Retry up to 3 times with shorter delays for faster response
              setTimeout(() => scrollToElement(attempt + 1), attempt * 150);
              return false;
            } else {
              console.warn(`Could not find verse element: verse-${verseNumber} after ${attempt} attempts. Loaded ${ayahData.length} verses (indices 0-${ayahData.length - 1} map to verse-1 through verse-${ayahData.length})`);
              return false;
            }
          };

          // Start scrolling immediately using requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            scrollToElement(1);
          });
        }
      }
    };

    // Run when data is loaded or when hash changes
    // Also run when pagination changes (for paginated languages)
    if (!loading) {
      // Use requestAnimationFrame for immediate execution when DOM is ready
      // This is faster than setTimeout and ensures DOM is rendered
      requestAnimationFrame(() => {
        handleScrollToVerse();
        // Also run once more after a brief delay to catch any late DOM updates
        setTimeout(handleScrollToVerse, 100);
      });
    }

    // Listen for hash changes and popstate (back/forward button)
    window.addEventListener("hashchange", handleScrollToVerse);
    window.addEventListener("popstate", handleScrollToVerse);
    
    // Also listen for load event (when page loads with hash)
    window.addEventListener("load", handleScrollToVerse);

    return () => {
      window.removeEventListener("hashchange", handleScrollToVerse);
      window.removeEventListener("popstate", handleScrollToVerse);
      window.removeEventListener("load", handleScrollToVerse);
    };
  }, [loading, ayahData, surahId, location.state, translationLanguage, translationPagination, fetchPaginatedTranslations, getPaginatedTranslationLimit]);

  const handleWordByWordClick = (verseNumber, event) => {
    // Check if modifier key is pressed (Ctrl/Cmd)
    const isModifierPressed = event?.ctrlKey || event?.metaKey;

    if (isModifierPressed) {
      // Open word-by-word page in new tab
      event?.preventDefault();
      event?.stopPropagation();
      const url = `/word-by-word/${surahId}/${verseNumber}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Normal behavior: open modal
    setSelectedVerseForWordByWord(verseNumber);
    setShowWordByWord(true);
  };

  const handleWordByWordClose = () => {
    setShowWordByWord(false);
    setSelectedVerseForWordByWord(null);
  };

  const handleWordByWordNavigate = (newVerseNumber) => {
    setSelectedVerseForWordByWord(newVerseNumber);
  };

  const handleWordByWordSurahChange = (newSurahId) => {
    // Close the modal and navigate to the new surah with wordByWord parameter
    setShowWordByWord(false);
    setSelectedVerseForWordByWord(null);
    navigate(`/surah/${newSurahId}?wordByWord=1`);
  };

  const handleInterpretationClick = async (verseNumber) => {
    try {
      // Special handling for Surah 114
      if (parseInt(surahId) === 114) {
        // Add any special logic for Surah 114 if needed
      }

      // For English language, we don't need to fetch interpretation count
      // The AyahModal will handle fetching the specific footnotes directly
      if (translationLanguage === 'E') {
      }

      // Open the AyahModal
      setSelectedVerseForInterpretation(verseNumber);
      setShowAyahModal(true);
    } catch (error) {
      console.error("Error opening interpretation:", error);
      showError("Failed to load interpretation. Please try again.");
    }
  };

  const handleAyahModalClose = () => {
    setShowAyahModal(false);
    setSelectedVerseForInterpretation(null);
  };

  // Note: Interpretation count fetching removed for English language
  // English interpretations are now fetched directly in AyahModal using specific footnote endpoints

  const handleBookmarkClick = async (
    e,
    verseIndex,
    arabicText,
    translation
  ) => {
    e.stopPropagation();

    // Check if user is signed in
    if (!user) {
      showError("Please sign in to bookmark verses");
      navigate("/sign");
      return;
    }

    const verseNumber = verseIndex + 1;
    const verseKey = `${surahId}:${verseNumber}`;

    try {
      setBookmarkLoading((prev) => ({ ...prev, [verseKey]: true }));

      if (bookmarkedVerses.has(verseKey)) {
        // Find the bookmark to delete
        const bookmarks = await BookmarkService.getBookmarks(
          user.uid,
          "translation"
        );
        const bookmarkToDelete = bookmarks.find(
          (bookmark) =>
            bookmark.surahId === parseInt(surahId) &&
            bookmark.verseId === verseNumber
        );

        if (bookmarkToDelete) {
          await BookmarkService.deleteBookmark(bookmarkToDelete.id, user.uid);
        }

        setBookmarkedVerses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(verseKey);
          return newSet;
        });
        showSuccess("Bookmark removed successfully");
      } else {
        // Add bookmark
        await BookmarkService.addBookmark(
          user.uid,
          surahId,
          verseNumber,
          "translation",
          surahInfo?.arabic || `Surah ${surahId}`,
          `${arabicText} - ${translation}`
        );

        setBookmarkedVerses((prev) => new Set([...prev, verseKey]));
        showSuccess("Verse bookmarked successfully");
      }
    } catch (error) {
      console.error("Error managing bookmark:", error);
      showError("Failed to manage bookmark. Please try again.");
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [verseKey]: false }));
    }
  };

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

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchAyahAudioTranslations(parseInt(surahId))
      .then(setAyahData)
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching ayah data on retry:", err);
      })
      .finally(() => setLoading(false));
  };

  // Navigation functions
  // Add this useEffect after your existing useEffects
  useEffect(() => {
    // Scroll to top whenever surahId changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [surahId]);

  // Handle clicks on Hindi footnotes and ensure footnotes are always clickable
  useEffect(() => {
    const handleHindiFootnoteClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".hindi-footnote-link");
      if (target) {

        const footnoteNumber = target.getAttribute("data-footnote");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");


        if (footnoteNumber && surahNo && ayahNo) {
          setHindiFootnoteLoading(true);
          setShowHindiFootnoteModal(true);
          setHindiFootnoteContent('Loading...');

          try {
            const explanation = await hindiTranslationService.getExplanationByNumber(
              parseInt(surahNo),
              parseInt(ayahNo),
              footnoteNumber
            );
            setHindiFootnoteContent(explanation);
          } catch (error) {
            console.error('Error fetching Hindi footnote explanation:', error);
            setHindiFootnoteContent(`Error loading explanation: ${error.message}`);
          } finally {
            setHindiFootnoteLoading(false);
          }
        } else {
          console.error('Missing footnote data:', { footnoteNumber, surahNo, ayahNo });
        }
      }
    };

    // Function to ensure all Hindi footnotes are clickable
    const ensureHindiFootnotesClickable = () => {
      if (translationLanguage === 'hi' && ayahData.length > 0) {

        // Find all translation elements that might have raw HTML footnotes
        const translationElements = document.querySelectorAll('p[data-hindi-translation]');
        let reParsedCount = 0;

        translationElements.forEach((element, index) => {
          const rawText = element.getAttribute('data-hindi-translation');
          const surahNo = element.getAttribute('data-surah');
          const ayahNo = element.getAttribute('data-ayah');

          // Check if this element has raw HTML footnotes that need parsing
          // Also check if the current innerHTML contains raw HTML tags
          const currentHTML = element.innerHTML;
          const hasRawHTML = rawText && (rawText.includes('<sup class="f-note">') || rawText.includes('<sup>'));
          const hasRawHTMLInCurrent = currentHTML.includes('<sup class="f-note">') || currentHTML.includes('<sup>');
          const hasNoClickableFootnotes = !element.querySelector('.hindi-footnote-link');

          if ((hasRawHTML || hasRawHTMLInCurrent) && hasNoClickableFootnotes) {

            const parsed = hindiTranslationService.parseHindiTranslationWithClickableExplanations(
              rawText || currentHTML,
              parseInt(surahNo),
              parseInt(ayahNo)
            );
            element.innerHTML = parsed;
            reParsedCount++;
          }
        });

        // Re-parsed Hindi translation elements
      }
    };

    // Add CSS for hover and active effects
    const style = document.createElement('style');
    style.textContent = `
      .hindi-footnote-link:hover {
        color: #0891b2 !important;
      }
      .hindi-footnote-link:active {
        color: #0e7490 !important;
      }
    `;
    document.head.appendChild(style);

    // Run the check immediately and then periodically
    ensureHindiFootnotesClickable();
    const interval = setInterval(ensureHindiFootnotesClickable, 1000); // Increased interval to 1 second

    // Add global function for manual testing
    window.testHindiFootnotes = () => {
      ensureHindiFootnotesClickable();
    };

    // Add MutationObserver to watch for DOM changes and re-parse footnotes
    const observer = new MutationObserver((mutations) => {
      let shouldReparse = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Check if any added nodes contain Hindi translation elements
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches('p[data-hindi-translation]')) {
                shouldReparse = true;
              } else if (node.querySelector && node.querySelector('p[data-hindi-translation]')) {
                shouldReparse = true;
              }
            }
          });
        }
      });

      if (shouldReparse) {
        setTimeout(ensureHindiFootnotesClickable, 100);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-hindi-translation']
    });

    document.addEventListener("click", handleHindiFootnoteClick);
    return () => {
      document.removeEventListener("click", handleHindiFootnoteClick);
      document.head.removeChild(style);
      clearInterval(interval);
      observer.disconnect();
    };
  }, [translationLanguage, ayahData]); // Added ayahData as dependency

  // Handle clicks on Urdu footnotes
  useEffect(() => {
    const handleUrduFootnoteClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".urdu-footnote-link");
      if (target) {
        const footnoteId = target.getAttribute("data-footnote-id");
        const footnoteNumber = target.getAttribute("data-footnote-number");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (footnoteId && surahNo && ayahNo) {
          setUrduFootnoteLoading(true);
          setShowUrduFootnoteModal(true);
          setUrduFootnoteContent('Loading...');

          try {
            const explanation = await urduTranslationService.getFootnoteExplanation(footnoteId);
            // Decode HTML entities to ensure links render properly
            const decodedExplanation = explanation ? decodeHTML(explanation) : explanation;
            setUrduFootnoteContent(decodedExplanation);
          } catch (error) {
            console.error('❌ Error loading Urdu footnote:', error);
            setUrduFootnoteContent(`Error loading explanation: ${error.message}`);
          } finally {
            setUrduFootnoteLoading(false);
          }
        }
      }
    };

    document.addEventListener("click", handleUrduFootnoteClick);
    return () => {
      document.removeEventListener("click", handleUrduFootnoteClick);
    };
  }, [translationLanguage, ayahData]);

  // Handle clicks on Bangla explanation numbers
  useEffect(() => {
    const handleBanglaExplanationClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".bangla-explanation-link");
      if (target) {
        const explanationNumber = target.getAttribute("data-explanation-number");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (explanationNumber && surahNo && ayahNo) {
          setBanglaExplanationLoading(true);
          setShowBanglaExplanationModal(true);
          setBanglaExplanationContent('Loading...');

          try {
            const explanation = await banglaTranslationService.getExplanationByNumber(
              parseInt(surahNo),
              parseInt(ayahNo),
              explanationNumber
            );

            if (explanation) {
              setBanglaExplanationContent(explanation);
            } else {
              setBanglaExplanationContent('Explanation not found.');
            }
          } catch (error) {
            console.error('❌ Error loading Bangla explanation:', error);
            setBanglaExplanationContent('Error loading explanation.');
          } finally {
            setBanglaExplanationLoading(false);
          }
        }
      }
    };

    document.addEventListener("click", handleBanglaExplanationClick);
    return () => {
      document.removeEventListener("click", handleBanglaExplanationClick);
    };
  }, [translationLanguage, ayahData]);

  // Handle clicks on English interpretation links and footnotes
  useEffect(() => {
    const handleEnglishClick = async (e) => {
      // Check for interpretation link clicks first (these are the numbered interpretation badges in translation text)
      let target = e.target.closest(".interpretation-link");
      if (target && translationLanguage === 'E') {
        e.preventDefault();
        e.stopPropagation();
        
        const interpretationNumber = target.getAttribute("data-interpretation") || 
                                     target.getAttribute("data-interpretation-number") ||
                                     target.textContent?.trim();
        const surahNo = target.getAttribute("data-surah") || surahId;
        const ayahNo = target.getAttribute("data-ayah");
        
        if (surahNo && ayahNo) {
          // Open AyahModal which will show all interpretations for this verse
          setSelectedVerseForInterpretation(parseInt(ayahNo, 10));
          setShowAyahModal(true);
          return;
        }
      }

      // Check for footnote link clicks
      target = e.target.closest(".english-footnote-link");
      if (target) {
        e.preventDefault();
        e.stopPropagation();

        const footnoteId = target.getAttribute("data-footnote-id");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (!surahNo || !ayahNo) {
          return;
        }

        setEnglishFootnoteLoading(true);
        setShowEnglishFootnoteModal(true);
        setEnglishFootnoteContent('Loading...');

        try {
          let explanation = '';

          if (footnoteId) {
            explanation = await englishTranslationService.getExplanation(parseInt(footnoteId, 10));
          } else {
            setEnglishFootnoteContent('Explanation not available.');
            return;
          }

          setEnglishFootnoteContent(explanation || 'Explanation not available.');
        } catch (error) {
          console.error('Error fetching English explanation:', error);
          setEnglishFootnoteContent(`Error loading explanation: ${error.message}`);
        } finally {
          setEnglishFootnoteLoading(false);
        }
      }
    };

    document.addEventListener("click", handleEnglishClick);
    return () => {
      document.removeEventListener("click", handleEnglishClick);
    };
  }, [translationLanguage, ayahData, surahId]);

  // Debug modal state changes
  useEffect(() => {
  }, [showHindiFootnoteModal]);

  // Cache busting comment - force browser refresh

  // Keep the navigation functions simple
  const handlePreviousSurah = () => {
    const prevSurahId = parseInt(surahId) - 1;
    if (prevSurahId >= 1) {
      navigate(`/surah/${prevSurahId}`);
    }
  };

  const handleNextSurah = () => {
    const nextSurahId = parseInt(surahId) + 1;
    if (nextSurahId <= 114) {
      // Total surahs in Quran
      navigate(`/surah/${nextSurahId}`);
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

  const getPlainTextTranslation = (html) => {
    if (!html) return '';

    if (typeof document === 'undefined') {
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    tempDiv
      .querySelectorAll('.english-footnote-link, .footnote-link, sup.f-note')
      .forEach((el) => el.remove());

    return (tempDiv.textContent || tempDiv.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCopyVerse = async (arabicText, translation, verseNumber) => {
    const plainTranslation = getPlainTextTranslation(translation);
    const textToCopy = `${arabicText}
  
  "${plainTranslation}"
  
  — Quran ${surahId}:${verseNumber}`;

    try {
      await navigator.clipboard.writeText(textToCopy);

      // Show feedback
      setCopiedVerse(verseNumber);

      // Clear feedback after 2 seconds
      setTimeout(() => {
        setCopiedVerse(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);

      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopiedVerse(verseNumber);
        setTimeout(() => {
          setCopiedVerse(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
    }
  };

  const handleShareVerse = async (arabicText, translation, verseNumber) => {
    const plainTranslation = getPlainTextTranslation(translation);
    const shareUrl = `${window.location.origin}/surah/${surahId}#verse-${verseNumber}`;

    const shareContent = `${arabicText}

${plainTranslation}

— Quran ${surahId}:${verseNumber}

Read more: ${shareUrl}`;

    const shareData = {
      title: `Quran ${surahId}:${verseNumber}`,
      text: shareContent,
    };

    try {
      // Check if Web Share API is supported
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        showSuccess("Verse shared successfully");
      } else {
        // Fallback: Copy shareable link to clipboard
        await navigator.clipboard.writeText(shareContent);
        showSuccess("Verse content copied to clipboard");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // User cancelled the share dialog
        return;
      }

      console.error("Error sharing verse:", error);

      // Final fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareContent);
        showSuccess("Verse content copied to clipboard");
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
        showError("Failed to share verse. Please try again.");
      }
    }
  };

  // Stop helper
  const stopCurrentAudio = () => {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
      // prevent auto-continue callbacks after stopping
      audioEl.onended = null;
      audioEl.onerror = null;
    }
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

  // Stop audio when navigating away from this page (unmount)
  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      isComponentMountedRef.current = false;
      try {
        stopCurrentAudio();
      } catch (e) { }
      setIsSequencePlaying(false);
      setPlayingAyah(null);
      setCurrentAudioTypeIndex(0);
      // Notify header controls
      window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
    };
  }, []);

  // Handle header compaction on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHeaderCompact(true);
      } else {
        setIsHeaderCompact(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Play audio types for an ayah in sequence, then move to next ayah
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahSequenceWithTypes = async (ayahNumber, audioTypeIndex = 0, typesToPlay = null, qariToUse = null) => {
    if (!surahId) return;

    // Use provided types or fall back to state
    const activeAudioTypes = typesToPlay || audioTypes;
    const activeQari = qariToUse || selectedQari;
    const totalAyahs = ayahData?.length || 0;

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      if (ayahNumber < totalAyahs) {
        playAyahSequenceWithTypes(ayahNumber + 1, 0, typesToPlay, qariToUse);
      } else {
        setIsSequencePlaying(false);
        setPlayingAyah(null);
        setCurrentAudioTypeIndex(0);
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
      }
      return;
    }

    // Check if audio should be stopped (language changed)
    if (audioManager.getShouldStop()) {
      return;
    }
    
    // Set playing state early so UI shows loading/playing state immediately
    setIsSequencePlaying(true);
    setPlayingAyah(ayahNumber);
    // Dispatch event to update header button immediately
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));

    // Map audioType to playAyahAudio format
    const audioTypeMap = {
      'quran': 'qirath',
      'translation': 'translation',
      'interpretation': 'interpretation'
    };
    const currentAudioType = activeAudioTypes[audioTypeIndex];
    const mappedAudioType = audioTypeMap[currentAudioType] || 'qirath';

    stopCurrentAudio();
    setCurrentAudioTypeIndex(audioTypeIndex);

    try {
      const audioElement = await playAyahAudio({
        ayahNumber,
        surahNumber: parseInt(surahId),
        audioType: mappedAudioType,
        qariName: activeQari,
        playbackSpeed: playbackSpeed,
        translationLanguage: translationLanguage,
        onStart: () => {
          // Ensure state is set when audio actually starts playing
          setPlayingAyah(ayahNumber);
          setIsSequencePlaying(true);
          // Dispatch event to update header button
          window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
        },
        onEnd: () => {
          // Play next audio type for this ayah, or move to next ayah if all types done
          playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay, qariToUse);
        },
        onError: () => {
          // If audio fails, skip to next audio type or next ayah
          // Use setTimeout to prevent race conditions and ensure smooth transitions
          setTimeout(() => {
            setIsSequencePlaying(false);
            setPlayingAyah(null);
            window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
            playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay, qariToUse);
          }, 100);
        },
      });
      
      // Check if audio should be stopped (language changed during async operation)
      if (audioManager.getShouldStop()) {
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
        setIsSequencePlaying(false);
        setPlayingAyah(null);
        return;
      }
      
      if (audioElement) {
        setAudioEl(audioElement);
      } else {
        // If audio element is null (URL not available), skip to next
        // Use setTimeout to prevent race conditions
        setTimeout(() => {
          setIsSequencePlaying(false);
          setPlayingAyah(null);
          window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
          playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay, qariToUse);
        }, 100);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      // Use setTimeout to prevent race conditions
      setTimeout(() => {
        setIsSequencePlaying(false);
        setPlayingAyah(null);
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
        playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay, qariToUse);
      }, 100);
    }
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahSequence = async (ayahNumber, audioTypeIndex = 0, qariToUse = null) => {
    await playAyahSequenceWithTypes(ayahNumber, audioTypeIndex, null, qariToUse);
  };


  const handleAyahPlayPause = (ayahNumber) => {
    // If this ayah is currently playing, toggle pause/resume
    if (playingAyah === ayahNumber && audioEl) {
      if (audioEl.paused) {
        audioEl.play().then(() => setIsSequencePlaying(true)).catch(() => { });
      } else {
        audioEl.pause();
        setIsSequencePlaying(false);
      }
      return;
    }
    // Otherwise start sequence for this ayah
    setCurrentAudioTypeIndex(0);
    playAyahSequence(ayahNumber, 0);
  };

  // Top controls: Play/Pause/Resume and Stop (reset to beginning)
  const handleTopPlayPause = () => {
    try {
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
        setIsSequencePlaying(false);
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
      } else if (audioEl && audioEl.paused) {
        audioEl.play().then(() => {
          setIsSequencePlaying(true);
          // Dispatch event to update header button
          window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
        }).catch(() => { });
      } else {
        // Start from beginning (ayah 1) or current highlighted ayah
        setCurrentAudioTypeIndex(0);
        playAyahSequence(1, 0);
        // Dispatch event to update header button (will be dispatched when audio actually starts)
      }
    } catch (_) { }
  };

  // Store the handler in ref for event listener (defined after playAyahSequence)
  handleTopPlayPauseRef.current = handleTopPlayPause;

  const handleTopStopReset = () => {
    stopCurrentAudio();
    setIsSequencePlaying(false);
    setPlayingAyah(null);
    setCurrentAudioTypeIndex(0);
    // clear current element so next Play starts a fresh sequence from ayah 1
    setAudioEl(null);
    // Dispatch event to update header button
    window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
  };

  // Save reciter to localStorage when it changes and dispatch event
  useEffect(() => {
    localStorage.setItem("reciter", selectedQari);
    // Dispatch event to sync with other components
    window.dispatchEvent(new CustomEvent('reciterChange', { detail: { reciter: selectedQari } }));
  }, [selectedQari]);

  // Stop audio when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      audioManager.stopAll();
      stopCurrentAudio();
      setIsSequencePlaying(false);
      setPlayingAyah(null);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Stop audio when surah changes
  useEffect(() => {
    const handleSurahChange = () => {
      audioManager.stopAll();
      stopCurrentAudio();
      setIsSequencePlaying(false);
      setPlayingAyah(null);
    };
    window.addEventListener('surahChange', handleSurahChange);
    return () => {
      window.removeEventListener('surahChange', handleSurahChange);
    };
  }, []);

  // Listen for reciter changes from other components (Settings, StickyAudioPlayer)
  useEffect(() => {
    const handleReciterChange = (event) => {
      const newReciter = event.detail.reciter;
      if (newReciter !== selectedQari) {
        setSelectedQari(newReciter);
      }
    };

    window.addEventListener('reciterChange', handleReciterChange);
    return () => {
      window.removeEventListener('reciterChange', handleReciterChange);
    };
  }, [selectedQari]);

  // Stop audio when Qirath or audio types change
  useEffect(() => {
    if (isSequencePlaying && audioEl && playingAyah) {
      stopCurrentAudio();
      setIsSequencePlaying(false);
      setTimeout(() => {
        playAyahSequence(playingAyah, 0);
      }, 100);
    }
  }, [selectedQari, audioTypes]);

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
    if (audioEl) {
      audioEl.playbackRate = playbackSpeed;
    }
  }, [audioEl, playbackSpeed]);

  // Handle Tamil database download
  const handleTamilDownload = async () => {
    try {
      setTamilDownloading(true);
      await tamilTranslationService.downloadDatabase();
      showSuccess("Tamil database downloaded successfully!");

      // Reload the surah data to show Tamil translations
      const loadSurahData = async () => {
        if (!surahId) return;

        try {
          setLoading(true);
          setError(null);

        const [surahNamesResponse, surahsResponse, pageRangesResponse] = await Promise.all([
          listSurahNames(),
          fetchSurahs(),
          fetchPageRanges(),
        ]);

          const getVerseCountFromPageRanges = (surahId, pageRanges) => {
            const surahRanges = pageRanges.filter(
              (range) => range.SuraId === parseInt(surahId)
            );
            if (surahRanges.length === 0) return 7;
            const maxAyah = Math.max(...surahRanges.map((range) => range.ayato));
            return maxAyah;
          };

          let verseCount = getVerseCountFromPageRanges(surahId, pageRangesResponse || []);

          if (verseCount === 7 && surahNamesResponse && Array.isArray(surahNamesResponse)) {
            const currentSurahForCount = surahNamesResponse.find(
              (s) => s.id === parseInt(surahId)
            );
            if (currentSurahForCount && currentSurahForCount.ayahs) {
              verseCount = currentSurahForCount.ayahs;
            }
          }

          // Now fetch Tamil translations since database is downloaded
          const tamilResult = await tamilTranslationService.getSurahTranslations(parseInt(surahId), {
            page: 1,
            limit: TAMIL_PAGE_SIZE,
          });
          const tamilTranslations = Array.isArray(tamilResult?.translations) ? tamilResult.translations : [];
          if (tamilTranslations.length > 0) {
            setAyahData(tamilTranslations);
            setTamilPagination(tamilResult?.pagination || null);
          } else {
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Tamil translation not available for verse ${index + 1}`,
            }));
            setAyahData(fallbackAyahData);
            setTamilPagination(null);
          }

          try {
            const arabicResult = await fetchArabicVerses(parseInt(surahId));
            const normalizedArabic = Array.isArray(arabicResult?.verses)
              ? arabicResult.verses
              : Array.isArray(arabicResult)
                ? arabicResult
                : [];
            setArabicVerses(normalizedArabic);
          } catch (arabicError) {
            console.error('Error fetching Arabic verses:', arabicError);
            setArabicVerses([]);
          }

          const currentSurah = surahNamesResponse.find(
            (s) => s.id === parseInt(surahId)
          );
          // Get type from surahsResponse which includes Makki/Madani information
          const currentSurahWithType = surahsResponse.find(
            (s) => s.number === parseInt(surahId)
          );
          setSurahInfo(
            currentSurah
              ? {
                arabic: currentSurah.arabic,
                number: currentSurah.id,
                type: currentSurahWithType?.type || 'Makki'
              }
              : {
                arabic: "Unknown Surah",
                number: parseInt(surahId),
                type: 'Makki'
              }
          );
        } catch (err) {
          setError(err.message);
          console.error("Error fetching surah data:", err);
        } finally {
          setLoading(false);
        }
      };

      await loadSurahData();
    } catch (error) {
      console.error('Error downloading Tamil database:', error);
      showError("Failed to download Tamil database. Please try again.");
    } finally {
      setTamilDownloading(false);
    }
  };

  // Loading state - Show shimmer skeleton for better perceived performance
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Surah Header Skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-48 mx-auto mb-4 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-32 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
            </div>
          </div>
          {/* Verses Skeleton */}
          <VersesSkeleton count={5} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 text-lg mb-2">
              Failed to load Surah data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={handleRetry}
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
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-outfit transition-colors duration-300">
        {/* Sticky Header */}
        <div className={`sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${showWordByWord || showAyahModal || showHindiFootnoteModal || showUrduFootnoteModal || showBanglaExplanationModal || showEnglishFootnoteModal ? 'hidden' : ''}`}>
          <div className="container-responsive py-3 sm:py-4">
            <div className="flex flex-col items-center justify-center relative">

              {/* Mobile Top Bar */}
              <div className="sm:hidden w-full flex items-center justify-between mb-2">
                {fromJuz && (
                  <button
                    onClick={() => navigate("/juz")}
                    className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Juz {fromJuz}
                  </button>
                )}
                <div className="flex-1"></div>
                {/* Mobile Settings/Menu could go here */}
              </div>

              {/* Surah Title */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isHeaderCompact ? 'max-h-0 opacity-0 m-0' : 'max-h-40 opacity-100 mb-2 sm:mb-4'}`}>
                <h1
                  className={`text-4xl sm:text-5xl md:text-6xl font-arabic text-center text-gray-800 dark:text-white drop-shadow-sm ${surahTitleWeightClass}`}
                  style={{ fontFamily: surahNameFontFamily }}
                  aria-label={accessibleSurahName}
                >
                  {calligraphicSurahName}
                </h1>
              </div>

              {/* Bismillah */}
              {parseInt(surahId) !== 1 && parseInt(surahId) !== 9 && (
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isHeaderCompact ? 'max-h-0 opacity-0 m-0' : 'max-h-20 opacity-90 hover:opacity-100 mb-4 sm:mb-6'}`}>
                  <img
                    src={theme === "dark" ? DarkModeBismi : Bismi}
                    alt="Bismillah"
                    className="h-8 sm:h-10 md:h-12 w-auto mx-auto"
                  />
                </div>
              )}

              {/* Controls & Navigation (Desktop) */}
              <div className="w-full flex items-center justify-between mt-2">
                {/* Left: Back to Juz (Desktop) */}
                <div className="hidden sm:block w-1/3">
                  {fromJuz && (
                    <button
                      onClick={() => navigate("/juz")}
                      className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors group"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      Back to Juz {fromJuz}
                    </button>
                  )}
                </div>

                {/* Center: View Toggle */}
                <div className="w-full sm:w-1/3 flex justify-center">
                  {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                    <ToggleGroup
                      options={["Ayah Wise", "Block Wise"]}
                      value={viewType}
                      onChange={(val) => setContextViewType(val)}
                    />
                  )}
                </div>

                {/* Right: Tamil Download (Desktop) */}
                <div className="hidden sm:flex w-1/3 justify-end">
                  {translationLanguage === 'ta' && !tamilTranslationService.isDatabaseDownloaded() && (
                    <button
                      onClick={handleTamilDownload}
                      disabled={tamilDownloading}
                      className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center"
                    >
                      {tamilDownloading ? 'Downloading...' : 'Download Tamil DB'}
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Tamil Download */}
              {translationLanguage === 'ta' && !tamilTranslationService.isDatabaseDownloaded() && (
                <div className="sm:hidden mt-2 w-full flex justify-center">
                  <button
                    onClick={handleTamilDownload}
                    disabled={tamilDownloading}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full w-full text-center"
                  >
                    {tamilDownloading ? 'Downloading...' : 'Download Tamil Database'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container-responsive py-6 sm:py-8 space-y-4 sm:space-y-6">
          {loading && ayahData.length === 0 ? (
            <VersesSkeleton count={5} />
          ) : !loading && ayahData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No verses found for this Surah.
              </p>
            </div>
          ) : !loading && ayahData.length > 0 ? (
            <>
              {(() => {
                // Create efficient lookup map for Arabic verses by verse_number
                const arabicVerseMap = new Map();
                arabicVerses.forEach(av => {
                  if (av?.verse_number != null) {
                    arabicVerseMap.set(av.verse_number, av);
                  }
                  if (av?.verse_key) {
                    arabicVerseMap.set(av.verse_key, av);
                  }
                });
                return ayahData.map((verse, index) => {
                  const verseNumber = verse.number || index + 1;
                  const verseKey = `${surahId}:${verseNumber}`;
                  const arabicVerse = arabicVerseMap.get(verseNumber) || arabicVerseMap.get(verseKey) || arabicVerses[index];
                  const arabicText = arabicVerse?.text_uthmani || "";
                  const finalArabicText = arabicText;
                  const sanitizedArabicText = stripArabicVerseMarker(arabicText);
                  const displayArabicText = sanitizedArabicText || arabicText;
                  const isCurrentAyah = playingAyah === verseNumber;
                  const isPlaying = isCurrentAyah && isSequencePlaying;

                // Card Styling
                const cardClasses = `
                    relative group rounded-2xl transition-all duration-300 overflow-hidden
                    ${isCurrentAyah
                    ? 'bg-teal-50/50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800 shadow-md ring-1 ring-teal-100 dark:ring-teal-900'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-card hover:border-gray-200 dark:hover:border-gray-600'
                  }
                  `;

                return (
                  <div key={index} id={`verse-${verseNumber}`} className={cardClasses}>
                    {/* Verse Number Badge */}
                    <div className="absolute top-0 left-0 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-br-xl border-b border-r border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 z-10">
                      {surahId}:{verseNumber}
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                      {/* Arabic Text */}
                      <div className="w-full mb-6 sm:mb-8 text-right" dir="rtl">
                        <p
                          className={`leading-[2.2] ${isCurrentAyah ? 'text-primary dark:text-primary-light' : 'text-gray-800 dark:text-gray-100'}`}
                          style={{
                            fontFamily: quranFont,
                            fontSize: `${fontSize}px`,
                          }}
                        >
                          {displayArabicText}{" "}
                          <span className="inline-block mx-1 text-gray-400 dark:text-gray-500 font-arabic text-[0.8em]">
                            ﴿{toArabicNumber(arabicVerse?.verse_number || verseNumber)}﴾
                          </span>
                        </p>
                      </div>

                      {/* Translation */}
                      <div className="w-full text-left mb-6 relative">
                        <div className={`prose dark:prose-invert max-w-none ${isCurrentAyah ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                          {translationLanguage === 'hi' ? (
                            <div
                              data-hindi-translation={verse.Translation}
                              data-surah={surahId}
                              data-ayah={verseNumber}
                              className="font-hindi leading-relaxed"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              dangerouslySetInnerHTML={{ 
                                __html: hindiTranslationService.parseHindiTranslationWithClickableExplanations(
                                  verse.Translation || '',
                                  parseInt(surahId),
                                  verseNumber
                                )
                              }}
                            />
                          ) : translationLanguage === 'ur' ? (
                            <div
                              className="font-urdu-nastaliq leading-relaxed text-right"
                              dir="rtl"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              dangerouslySetInnerHTML={{ __html: verse.Translation }}
                            />
                          ) : translationLanguage === 'bn' ? (
                            <div
                              className="font-bengali leading-relaxed"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              dangerouslySetInnerHTML={{ __html: verse.Translation }}
                            />
                          ) : translationLanguage === 'ta' ? (
                            <div
                              className="font-tamil leading-relaxed"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              dangerouslySetInnerHTML={{ __html: verse.Translation }}
                            />
                          ) : translationLanguage === 'mal' ? (
                            <div
                              className="font-malayalam leading-relaxed"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              dangerouslySetInnerHTML={{ __html: verse.Translation }}
                            />
                          ) : (
                            <div
                              className="font-poppins leading-relaxed"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                              data-footnote-context="ayahwise"
                              dangerouslySetInnerHTML={{ 
                                __html: viewType === 'Ayah Wise' && translationLanguage === 'E'
                                  ? (verse.Translation || '').replace(/<sup[^>]*>.*?<\/sup>/gi, '').replace(/<span[^>]*class="english-footnote-link"[^>]*>.*?<\/span>/gi, '')
                                  : verse.Translation 
                              }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center gap-1 sm:gap-2">

                          {/* Play Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAyahPlayPause(verseNumber); }}
                            className={`icon-btn ${isPlaying ? 'text-primary bg-primary/10' : ''}`}
                            title={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <div className="flex gap-0.5 h-3 items-end">
                                <span className="w-0.5 h-full bg-current animate-[pulse_0.6s_ease-in-out_infinite]"></span>
                                <span className="w-0.5 h-2/3 bg-current animate-[pulse_0.8s_ease-in-out_infinite_0.1s]"></span>
                                <span className="w-0.5 h-full bg-current animate-[pulse_1s_ease-in-out_infinite_0.2s]"></span>
                              </div>
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </button>

                          {/* Interpretation */}
                          {translationLanguage !== 'ta' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleInterpretationClick(verseNumber); }}
                              className="icon-btn group"
                              title="Interpretation"
                            >
                              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                          )}

                          {/* Word by Word */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleWordByWordClick(verseNumber, e); }}
                            className="icon-btn group"
                            title="Word by Word"
                          >
                            <WordByWordIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>

                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                          {/* Copy */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopyVerse(finalArabicText, verse.Translation, verseNumber); }}
                            className="icon-btn"
                            title="Copy"
                          >
                            {copiedVerse === index + 1 ? (
                              <span className="text-green-500 font-bold text-xs">Copied</span>
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>

                          {/* Bookmark */}
                          <button
                            onClick={(e) => handleBookmarkClick(e, index, finalArabicText, verse.Translation)}
                            disabled={bookmarkLoading[`${surahId}:${verseNumber}`]}
                            className={`icon-btn ${bookmarkedVerses.has(`${surahId}:${verseNumber}`) ? 'text-accent' : ''}`}
                            title="Bookmark"
                          >
                            {bookmarkLoading[`${surahId}:${verseNumber}`] ? (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : (
                              <Bookmark className={`w-5 h-5 ${bookmarkedVerses.has(`${surahId}:${verseNumber}`) ? 'fill-current' : ''}`} />
                            )}
                          </button>

                          {/* Share */}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShareVerse(finalArabicText, verse.Translation, verseNumber); }}
                            className="icon-btn"
                            title="Share"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
                });
              })()}

              {/* Paginated translation indicator */}
              {PAGINATED_TRANSLATION_LANGUAGES.has(translationLanguage) &&
                translationPagination?.totalItems ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing {Math.min(ayahData.length, translationPagination.totalItems)} of {translationPagination.totalItems} ayahs
                    </p>
                    <div ref={loadMoreTranslationRef} className="h-10 flex items-center justify-center">
                      {isLoadingTranslationPage && (
                        <div className="flex items-center gap-2 text-primary">
                          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                          <span className="text-sm font-medium">Loading more...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
            </>
          ) : null}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-50 dark:bg-gray-900 dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mt-6 sm:mt-8">
          <div className="max-w-4xl mx-auto">
            {/* Mobile: Row + Bottom Button */}
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
            <div className="hidden sm:flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6">
              <button
                onClick={handlePreviousSurah}
                disabled={parseInt(surahId) <= 1}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 
                           dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] 
                           sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Previous Surah</span>
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 
                           dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] 
                           sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Beginning of Surah</span>
              </button>

              <button
                onClick={handleNextSurah}
                disabled={parseInt(surahId) >= 114}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 
                           dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] 
                           sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next Surah</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Popup for Word by Word */}
        {showWordByWord && (
          <WordByWord
            selectedVerse={selectedVerseForWordByWord}
            surahId={surahId}
            onClose={handleWordByWordClose}
            onNavigate={handleWordByWordNavigate}
            onSurahChange={handleWordByWordSurahChange}
          />
        )}

        {/* Ayah Modal for Interpretation */}
        {showAyahModal && (
          <AyahModal
            surahId={surahId}
            verseId={selectedVerseForInterpretation}
            onClose={handleAyahModalClose}
          />
        )}

        {/* Hindi Footnote Modal */}
        {showHindiFootnoteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4 lg:p-6 bg-black/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden my-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hindi Explanation
                </h2>
                <button
                  onClick={() => setShowHindiFootnoteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
                {hindiFootnoteLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Loading explanation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <style>{`
                      .hindi-explanation-content,
                      .hindi-explanation-content p,
                      .hindi-explanation-content div,
                      .hindi-explanation-content span {
                        text-align: justify !important;
                      }
                    `}</style>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                      <div
                        className="hindi-explanation-content text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none text-justify"
                        style={{ 
                          fontSize: `${adjustedTranslationFontSize}px`,
                          textAlign: 'justify'
                        }}
                        dangerouslySetInnerHTML={{ __html: hindiFootnoteContent }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bangla Explanation Modal */}
        {showBanglaExplanationModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4 lg:p-6 bg-black/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden my-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bangla Explanation
                </h2>
                <button
                  onClick={() => setShowBanglaExplanationModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
                {banglaExplanationLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Loading explanation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                    <div
                      className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                      style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                    >
                      {banglaExplanationContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Urdu Footnote Modal */}
        {showUrduFootnoteModal && (
          <>
            <style>{`
              .urdu-footnote-modal-content * {
                font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
              }
              .urdu-footnote-modal-content a {
                font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
                text-align: right !important;
              }
            `}</style>
            <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4 lg:p-6 bg-black/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
              <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden my-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Urdu Explanation
                  </h2>
                <button
                  onClick={() => setShowUrduFootnoteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
                {urduFootnoteLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Loading explanation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                    <div
                      className={`text-gray-700 leading-[1.6] sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none urdu-footnote-modal-content ${
                        translationLanguage === 'ur' ? 'font-urdu-nastaliq' : 'font-poppins'
                      }`}
                      style={{ 
                        fontSize: `${adjustedTranslationFontSize}px`,
                        ...(translationLanguage === 'ur' ? {
                          textAlign: 'right',
                          lineHeight: '2.6',
                          fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                        } : {})
                      }}
                      dir={translationLanguage === 'ur' ? 'rtl' : 'ltr'}
                    >
                      {urduFootnoteContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </>
        )}

        {/* English Footnote Modal */}
        {showEnglishFootnoteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4 lg:p-6 bg-black/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden my-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  English Explanation
                </h2>
                <button
                  onClick={() => setShowEnglishFootnoteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
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
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                    <div
                      className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                      style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                    >
                      {englishFootnoteContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Back to Top Button */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed right-6 z-[60] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${playingAyah ? 'bottom-32 sm:bottom-36' : 'bottom-6'
              }`}
            title="Beginning of Surah"
            aria-label="Beginning of Surah"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}

        {/* Sticky Audio Player */}
        {playingAyah && !showWordByWord && !showAyahModal && !showHindiFootnoteModal && !showUrduFootnoteModal && !showBanglaExplanationModal && !showEnglishFootnoteModal && (
          <StickyAudioPlayer
            audioElement={audioEl}
            isPlaying={isSequencePlaying && audioEl && !audioEl.paused}
            currentAyah={playingAyah}
            totalAyahs={ayahData?.length || 0}
            surahInfo={surahInfo}
            onPlayPause={handleTopPlayPause}
            onStop={handleTopStopReset}
            onSkipBack={() => {
              // Go to previous ayah
              if (playingAyah && playingAyah > 1) {
                setCurrentAudioTypeIndex(0);
                playAyahSequence(playingAyah - 1, 0);
              }
            }}
            onSkipForward={() => {
              // Go to next ayah
              const totalAyahs = ayahData?.length || 0;
              if (playingAyah && playingAyah < totalAyahs) {
                setCurrentAudioTypeIndex(0);
                playAyahSequence(playingAyah + 1, 0);
              }
            }}
            onClose={null}
            selectedQari={selectedQari}
            onQariChange={(newQari) => {
              setSelectedQari(newQari);
              // If audio is currently playing, restart with new reciter
              if (playingAyah) {
                // Soft restart: do not clear playingAyah to keep player/modal mounted
                stopCurrentAudio();
                setIsSequencePlaying(false);
                setTimeout(() => {
                  playAyahSequence(playingAyah, 0, newQari);
                }, 50);
              }
            }}
            translationLanguage={translationLanguage}
            audioTypes={audioTypes}
            onAudioTypesChange={(newTypes) => {
              const currentPlayingAyah = playingAyah; // Capture current ayah
              setAudioTypes(newTypes);
              // If audio is currently playing, restart with new audio types
              if (currentPlayingAyah) {
                // Soft restart without unmounting the player
                stopCurrentAudio();
                setIsSequencePlaying(false);
                // Use newTypes directly instead of relying on state
                setTimeout(() => {
                  playAyahSequenceWithTypes(currentPlayingAyah, 0, newTypes);
                }, 50);
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

  );
};

export default Surah;
