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
import translationCache from "../utils/translationCache";
import { VersesSkeleton, LoadingWithProgress } from "../components/LoadingSkeleton";
import StickyAudioPlayer from "../components/StickyAudioPlayer";

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

const Surah = () => {
  const { quranFont, fontSize, translationFontSize, translationLanguage, theme } = useTheme();
  const { user } = useAuth();
  const { surahId } = useParams(); // Get surah ID from URL
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get query parameters
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

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
  const [selectedQari, setSelectedQari] = useState('al-afasy');
  const [audioTypes, setAudioTypes] = useState(['quran']); // Array of selected audio types
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentAudioTypeIndex, setCurrentAudioTypeIndex] = useState(0); // Track which audio type is currently playing
  const [audioEl, setAudioEl] = useState(null);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const audioRefForCleanup = useRef(null); // Track audio for cleanup

  // In-memory cache for English per-ayah translation map
  const englishAyahCacheRef = useRef(new Map()); // key: `${surahId}-E` -> Map(ayah->text)

  const toArabicNumber = (num) => {
    const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .split("")
      .map((digit) => arabicDigits[digit] || digit)
      .join("");
  };

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
    const loadSurahData = async () => {
      if (!surahId) return;

      try {
        setLoading(true);
        setError(null);

        const [
          surahNamesResponse,
          surahsResponse,
          arabicResponse,
          pageRangesResponse,
        ] = await Promise.all([
          listSurahNames(),
          fetchSurahs(),
          fetchArabicVerses(parseInt(surahId)),
          fetchPageRanges(),
        ]);

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

        // Translation source depends on selected language
        if (translationLanguage === 'ta') {
          // Tamil translations using hybrid service (API-first with SQL.js fallback)
          try {
            const tamilTranslations = await tamilTranslationService.getSurahTranslations(parseInt(surahId));
            if (tamilTranslations && tamilTranslations.length > 0) {
              setAyahData(tamilTranslations);
            } else {
              const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
                number: index + 1,
                ArabicText: '',
                Translation: `Tamil translation not available for verse ${index + 1}`,
              }));
              setAyahData(fallbackAyahData);
            }
          } catch (error) {
            console.error('Error fetching Tamil translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Tamil translation service unavailable. Please try again later.`,
            }));
            setAyahData(fallbackAyahData);
          }
        } else if (translationLanguage === 'hi') {
          // Hindi translations using hybrid service (API-first with SQL.js fallback)
          try {
            const hindiTranslations = await hindiTranslationService.getSurahTranslations(parseInt(surahId));
            if (hindiTranslations && hindiTranslations.length > 0) {
              setAyahData(hindiTranslations);
            } else {
              console.warn('No Hindi translations found');
              setAyahData([]);
            }
          } catch (error) {
            console.error('Error fetching Hindi translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: 'Hindi translation service unavailable. Please try again later.'
            }));
            setAyahData(fallbackAyahData);
          }
        } else if (translationLanguage === 'ur') {
          // Urdu translations using hybrid service (API-first with SQL.js fallback)
          try {
            // Build list of translations per ayah using hybrid service
            const verseNumbers = Array.from({ length: verseCount }, (_, i) => i + 1);
            const items = await Promise.all(
              verseNumbers.map(async (v) => {
                const rawTranslation = await urduTranslationService.getAyahTranslation(parseInt(surahId), v) || '';
                
                // Store both raw and parsed versions
                const parsedTranslation = urduTranslationService.parseUrduTranslationWithClickableFootnotes(
                  rawTranslation, 
                  parseInt(surahId), 
                  v
                );
                
                return {
                  number: v,
                  ArabicText: '',
                  Translation: parsedTranslation,
                  RawTranslation: rawTranslation // Store raw version for re-parsing if needed
                };
              })
            );
            setAyahData(items);
            
          } catch (error) {
            console.error('Error fetching Urdu translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: 'Urdu translation service unavailable. Please try again later.'
            }));
            setAyahData(fallbackAyahData);
          }
        } else if (translationLanguage === 'bn') {
          // Bangla translations from SQLite database (auto-load, no prompt)
          try {
            // Ensure DB is initialized; this will mark it as downloaded internally
            await banglaTranslationService.initDB();
            const banglaTranslations = await banglaTranslationService.getSurahTranslations(parseInt(surahId));
            if (banglaTranslations && banglaTranslations.length > 0) {
              // Parse Bangla translations to make explanation numbers clickable
              const parsedTranslations = banglaTranslations.map(verse => ({
                ...verse,
                Translation: banglaTranslationService.parseBanglaTranslationWithClickableExplanations(
                  verse.Translation, 
                  parseInt(surahId), 
                  verse.number
                )
              }));
              setAyahData(parsedTranslations);
            } else {
              const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
                number: index + 1,
                ArabicText: '',
                Translation: `Bangla translation not available for verse ${index + 1}`,
              }));
              setAyahData(fallbackAyahData);
            }
          } catch (error) {
            console.error('Error fetching Bangla translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Bangla translation service unavailable. Please try again later.`,
            }));
            setAyahData(fallbackAyahData);
          }
        } else if (translationLanguage === 'E') {
          // English translations using database-only service
          try {
            const englishTranslations = await englishTranslationService.getSurahTranslations(parseInt(surahId));
            if (englishTranslations && englishTranslations.length > 0) {
              // Parse English translations to make footnotes clickable
              // Note: Interpretation counts will be fetched on-demand when user clicks interpretation button
              const parsedTranslations = englishTranslations.map(verse => ({
                ...verse,
                Translation: englishTranslationService.parseEnglishTranslationWithClickableFootnotes(
                  verse.Translation, 
                  parseInt(surahId), 
                  verse.number
                ),
                interpretationCount: 0 // Will be fetched on-demand
              }));
              setAyahData(parsedTranslations);
            } else {
              const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
                number: index + 1,
                ArabicText: '',
                Translation: `English translation not available for verse ${index + 1}`,
              }));
              setAyahData(fallbackAyahData);
            }
          } catch (error) {
            console.error('Error fetching English translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `English translation service unavailable. Please try again later.`,
            }));
            setAyahData(fallbackAyahData);
          }
        } else {
          const ayahResponse = await fetchAyahAudioTranslations(parseInt(surahId));
          if (!ayahResponse || !Array.isArray(ayahResponse) || ayahResponse.length === 0) {
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Translation not available for verse ${index + 1}. The API server may be temporarily unavailable. Please try again later.`,
            }));
            setAyahData(fallbackAyahData);
          } else {
            const formattedAyahData = ayahResponse.map((ayah) => ({
              number: ayah.contiayano || 0,
              ArabicText: '',
              Translation: (ayah.AudioText || '')
                .replace(/<sup[^>]*foot_note[^>]*>\d+<\/sup>/g, '')
                .replace(/\s+/g, ' ')
                .trim(),
            }));
            setAyahData(formattedAyahData);
          }
        }

        setArabicVerses(arabicResponse || []);

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

    loadSurahData();
  }, [surahId, translationLanguage]);

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
      const hash = window.location.hash;

      if (hash && hash.startsWith("#verse-")) {
        const verseNumber = parseInt(hash.replace("#verse-", ""));

        if (verseNumber && !loading && ayahData.length > 0) {
          // Wait for the content to fully render
          setTimeout(() => {
            const verseElement = document.getElementById(
              `verse-${verseNumber}`
            );

            if (verseElement) {
              verseElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              // Highlight the verse briefly
              verseElement.style.backgroundColor = "#fef3c7";
              setTimeout(() => {
                verseElement.style.backgroundColor = "";
              }, 2000);
            }
          }, 500); // Reduced delay for better responsiveness
        }
      }
    };

    // Run when data is loaded or when hash changes
    if (!loading && ayahData.length > 0) {
      // Add a small delay to ensure DOM is ready
      setTimeout(handleScrollToVerse, 100);
    }

    // Listen for hash changes and popstate (back/forward button)
    window.addEventListener("hashchange", handleScrollToVerse);
    window.addEventListener("popstate", handleScrollToVerse);

    return () => {
      window.removeEventListener("hashchange", handleScrollToVerse);
      window.removeEventListener("popstate", handleScrollToVerse);
    };
  }, [loading, ayahData, surahId]);

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
      console.log(`🔄 Opening interpretation for verse ${verseNumber} in Surah ${surahId}`);

      // Special handling for Surah 114
      if (parseInt(surahId) === 114) {
        // Add any special logic for Surah 114 if needed
      }

      // For English language, we don't need to fetch interpretation count
      // The AyahModal will handle fetching the specific footnotes directly
      if (translationLanguage === 'E') {
        console.log(`📚 [Surah] Opening English interpretation modal for verse ${verseNumber}`);
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
        background-color: #0891b2 !important;
        transform: scale(1.05) !important;
      }
      .hindi-footnote-link:active {
        background-color: #0e7490 !important;
        transform: scale(0.95) !important;
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
            setUrduFootnoteContent(explanation);
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

  // Handle clicks on English footnotes
  useEffect(() => {
    const handleEnglishFootnoteClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target.closest(".english-footnote-link");
      if (target) {
        const footnoteId = target.getAttribute("data-footnote-id");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");
        
        if (footnoteId && surahNo && ayahNo) {
          setEnglishFootnoteLoading(true);
          setShowEnglishFootnoteModal(true);
          setEnglishFootnoteContent('Loading...');
          
          try {
            const explanation = await englishTranslationService.getExplanation(parseInt(footnoteId));
            setEnglishFootnoteContent(explanation);
          } catch (error) {
            console.error('Error fetching English footnote explanation:', error);
            setEnglishFootnoteContent(`Error loading explanation: ${error.message}`);
          } finally {
            setEnglishFootnoteLoading(false);
          }
        }
      }
    };

    document.addEventListener("click", handleEnglishFootnoteClick);
    return () => {
      document.removeEventListener("click", handleEnglishFootnoteClick);
    };
  }, [translationLanguage, ayahData]);

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

  // Get the appropriate icon based on surah type
  const surahIcon = surahInfo?.type === 'Makki' ? (
    <KaabaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3FA5C0]" />
  ) : (
    <MadinaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#3FA5C0]" />
  );

  const handleCopyVerse = async (arabicText, translation, verseNumber) => {
    const textToCopy = `${arabicText}
  
  "${translation}"
  
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
    const shareText = `${arabicText}

"${translation}"

— Quran ${surahId}:${verseNumber}`;

    const shareUrl = `${window.location.origin}/surah/${surahId}#verse-${verseNumber}`;

    const shareData = {
      title: `Quran ${surahId}:${verseNumber}`,
      text: shareText,
      url: shareUrl,
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
        const shareableContent = `${shareText}\n\nRead more: ${shareUrl}`;
        await navigator.clipboard.writeText(shareableContent);
        showSuccess("Verse link copied to clipboard");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // User cancelled the share dialog
        return;
      }

      console.error("Error sharing verse:", error);

      // Final fallback: Copy to clipboard
      try {
        const shareableContent = `${shareText}\n\nRead more: ${shareUrl}`;
        await navigator.clipboard.writeText(shareableContent);
        showSuccess("Verse link copied to clipboard");
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

  // Play audio types for an ayah in sequence, then move to next ayah
  // This version accepts audioTypes as parameter to avoid closure issues
  const playAyahSequenceWithTypes = (ayahNumber, audioTypeIndex = 0, typesToPlay = null) => {
    if (!surahId) return;
    
    // Use provided types or fall back to state
    const activeAudioTypes = typesToPlay || audioTypes;
    const totalAyahs = ayahData?.length || 0;

    // If all audio types for this ayah have been played, move to next ayah
    if (audioTypeIndex >= activeAudioTypes.length) {
      if (ayahNumber < totalAyahs) {
        playAyahSequenceWithTypes(ayahNumber + 1, 0, typesToPlay);
      } else {
        setIsSequencePlaying(false);
        setPlayingAyah(null);
        setCurrentAudioTypeIndex(0);
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: false } }));
      }
      return;
    }

    setIsSequencePlaying(true);

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
    
    const audioElement = playAyahAudio({
      ayahNumber,
      surahNumber: parseInt(surahId),
      audioType: mappedAudioType,
      qariName: selectedQari,
      playbackSpeed: playbackSpeed,
      onStart: () => {
        setPlayingAyah(ayahNumber);
        // Dispatch event to update header button
        window.dispatchEvent(new CustomEvent('audioStateChange', { detail: { isPlaying: true } }));
      },
      onEnd: () => {
        // Play next audio type for this ayah, or move to next ayah if all types done
        playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay);
      },
      onError: () => {
        // If audio fails, skip to next audio type or next ayah
        playAyahSequenceWithTypes(ayahNumber, audioTypeIndex + 1, typesToPlay);
      },
    });
    setAudioEl(audioElement);
  };

  // Wrapper function that uses state audioTypes (for backwards compatibility)
  const playAyahSequence = (ayahNumber, audioTypeIndex = 0) => {
    playAyahSequenceWithTypes(ayahNumber, audioTypeIndex, null);
  };


  const handleAyahPlayPause = (ayahNumber) => {
    // If this ayah is currently playing, toggle pause/resume
    if (playingAyah === ayahNumber && audioEl) {
      if (audioEl.paused) {
        audioEl.play().then(() => setIsSequencePlaying(true)).catch(() => {});
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
        }).catch(() => {});
      } else {
        // Start from beginning (ayah 1) or current highlighted ayah
        setCurrentAudioTypeIndex(0);
        playAyahSequence(1, 0);
        // Dispatch event to update header button (will be dispatched when audio actually starts)
      }
    } catch (_) {}
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
          
          const [surahNamesResponse, surahsResponse, arabicResponse, pageRangesResponse] = await Promise.all([
            listSurahNames(),
            fetchSurahs(),
            fetchArabicVerses(parseInt(surahId)),
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
          const tamilTranslations = await tamilTranslationService.getSurahTranslations(parseInt(surahId));
          if (tamilTranslations && tamilTranslations.length > 0) {
            setAyahData(tamilTranslations);
          } else {
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: `Tamil translation not available for verse ${index + 1}`,
            }));
            setAyahData(fallbackAyahData);
          }
          
          setArabicVerses(arabicResponse || []);
          
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

  // Loading state
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading Surah data...
            </p>
          </div>
        </div>
      </>
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

  return (
    <div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md">
          <div className="px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="w-full max-w-[1290px] mx-auto text-center px-2 sm:px-0">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-xs sm:text-sm font-medium shadow-sm min-h-[40px] sm:min-h-[44px]">
                    <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="text-xs sm:text-sm font-poppins">Translation</span>
                  </button>
                  <button
                    onClick={() => navigate(`/reading/${surahId}`)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800 min-h-[40px] sm:min-h-[44px]"
                  >
                    <Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="text-xs sm:text-sm font-poppins">Reading</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden space-y-3 sm:space-y-4 px-2">
              {/* Juz Context Indicator */}
              {fromJuz && (
                <div className="text-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Reading from Juz {fromJuz}
                  </span>
                  <button
                    onClick={() => navigate("/juz")}
                    className="ml-2 text-xs text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
                  >
                    Back to Juz
                  </button>
                </div>
              )}

              {/* Surah Title */}
              <h1 className="text-3xl sm:text-4xl font-arabic dark:text-white text-gray-900">
                {surahInfo?.arabic || "Loading..."}
              </h1>

              {/* Tamil Download Button */}
              {translationLanguage === 'ta' && !tamilTranslationService.isDatabaseDownloaded() && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Tamil translation database is not downloaded. Download to view Tamil translations.
                    </p>
                    <button
                      onClick={handleTamilDownload}
                      disabled={tamilDownloading}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        tamilDownloading
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {tamilDownloading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Downloading...</span>
                        </div>
                      ) : (
                        'Download Tamil Database'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
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

              {/* Bismillah */}
              <p className="text-xl sm:text-2xl font-arabic text-gray-800 dark:text-white leading-relaxed px-4">
                <img
                  src={theme === "dark" ? DarkModeBismi : Bismi}
                  alt="Bismillah"
                  className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto"
                />
              </p>

              {/* Surah Info moved to global header */}
              {/* Play Audio button moved to header */}

              {/* Ayah/Block selector */}
              <div className="flex justify-end mb-4">
                <div className={`flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm ${translationLanguage === 'ta' || translationLanguage === 'hi' || translationLanguage === 'ur' || translationLanguage === 'bn' ? 'w-[55px]' : 'w-[115px]'}`}>
                  <button className="px-2 sm:px-3 py-1.5 bg-white w-[55px] dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                    Ayah
                  </button>
                  {/* Hide blockwise for Tamil, Hindi, Urdu, and Bangla */}
                  {translationLanguage !== 'ta' && translationLanguage !== 'hi' && translationLanguage !== 'ur' && translationLanguage !== 'bn' && (
                    <button
                      className="px-2 sm:px-3 py-1.5 w-[55px] text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
                      onClick={() => navigate(`/blockwise/${surahId}`)}
                    >
                      Block
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              {/* Juz Context Indicator */}
              {fromJuz && (
                <div className="mb-2 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Reading from Juz {fromJuz}
                  </span>
                  <button
                    onClick={() => navigate("/juz")}
                    className="ml-2 text-sm text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline"
                  >
                    Back to Juz
                  </button>
                </div>
              )}

                {/* Surah Title */}
                <div className="mb-4 sm:mb-6 relative">
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-arabic dark:text-white text-gray-900 mb-3 sm:mb-4"
                    style={{
                      fontFamily: quranFont,
                      fontSize: `${fontSize + 20}px`, // Increase the base font size by 8px
                    }}
                  >
                    {surahInfo?.arabic || `Surah ${surahId}`}
                  </h1>

                  {/* Tamil Download Button - Desktop */}
                  {translationLanguage === 'ta' && !tamilTranslationService.isDatabaseDownloaded() && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-center">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Tamil translation database is not downloaded. Download to view Tamil translations.
                        </p>
                        <button
                          onClick={handleTamilDownload}
                          disabled={tamilDownloading}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            tamilDownloading
                              ? 'bg-gray-400 text-white cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {tamilDownloading ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Downloading...</span>
                            </div>
                          ) : (
                            'Download Tamil Database'
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                {/* Action Icons */}
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
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
                    } ${isFavorited ? 'text-red-500' : 'text-black dark:text-white'}`}
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Bismillah */}
                <div className="mt-6 sm:mb-8 relative">
                  <img
                    src={theme === "dark" ? DarkModeBismi : Bismi}
                    alt="Bismillah"
                    className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto"
                  />

                  {/* Desktop Ayah wise / Block wise buttons (only for Malayalam and English) */}
                  {(translationLanguage === 'mal' || translationLanguage === 'E') && (
                    <div className="absolute top-0 right-0">
                      <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                        <button className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full text-xs sm:text-sm font-medium shadow-sm min-h-[40px] sm:min-h-[44px]">
                          Ayah wise
                        </button>
                        <button
                          className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 text-gray-500 rounded-full dark:text-white text-xs sm:text-sm font-medium hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/40 transition-colors min-h-[40px] sm:min-h-[44px]"
                          onClick={() => navigate(`/blockwise/${surahId}`)}
                        >
                          Block wise
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Bottom Section */}
                {/* Play Audio button moved to header */}
              </div>
            </div>
          </div>
        </div>

        {/* Verses */}
        <div className="w-full max-w-[1290px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-white dark:bg-gray-900">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {loading && ayahData.length === 0 ? (
              <VersesSkeleton count={7} />
            ) : !loading && ayahData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No ayah data available for this surah.
                </p>
              </div>
            ) : !loading && ayahData.length > 0 ? (
              ayahData.map((verse, index) => {
                // Find corresponding Arabic verse by index (more reliable than verse_key matching)
                const arabicVerse = arabicVerses[index];
                const arabicText = arabicVerse?.text_uthmani || "";

                // If no Arabic text found, try to find by verse_key as fallback
                const fallbackArabicVerse = arabicVerses.find(
                  (av) => av.verse_key === `${surahId}:${index + 1}`
                );
                const finalArabicText =
                  arabicText || fallbackArabicVerse?.text_uthmani || "";

                return (
                  <div
                    key={index}
                    id={`verse-${index + 1}`}
                    className="py-5 sm:py-7 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors hover:bg-[#e8f2f6] dark:hover:bg-gray-800 active:bg-[#e8f2f6] mx-2 sm:mx-4"
                    style={playingAyah === index + 1 ? { backgroundColor: 'rgba(76, 175, 80, 0.1)' } : undefined}
                  >
                    {/* Arabic Text */}
                    {/* Arabic Text */}
                    <div className="text-right mb-2 sm:mb-3 lg:mb-4">
                      <p
                        className="leading-loose dark:text-white text-gray-900 px-4 sm:px-6 md:px-8"
                        style={{
                          fontFamily: quranFont,
                          fontSize: `${fontSize}px`,
                        }}
                        dir="rtl"
                      >
                        {finalArabicText}{" "}
                        <span className="whitespace-nowrap">
                          ﴿
                          {toArabicNumber(
                            arabicVerse?.verse_number || index + 1
                          )}
                          ﴾
                        </span>
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="mb-2 sm:mb-3">
                      {translationLanguage === 'hi' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-hindi font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-hindi-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : translationLanguage === 'ur' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-urdu font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-urdu-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : translationLanguage === 'bn' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-bengali font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-bangla-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : translationLanguage === 'ta' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-tamil font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-tamil-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : translationLanguage === 'E' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-poppins font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-english-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : translationLanguage === 'mal' ? (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-malayalam font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-malayalam-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-4 sm:px-6 md:px-8 font-poppins font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {verse.Translation}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-gray-500 dark:text-gray-300 px-2 sm:px-4 md:px-6">
                      {/* Verse Number */}
                      <span className="text-xs sm:text-sm font-medium">
                        {surahId}.{index + 1}
                      </span>

                      {/* Copy */}
                      <button
                        className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyVerse(
                            finalArabicText,
                            verse.Translation,
                            index + 1
                          );
                        }}
                        title="Copy verse"
                      >
                        {copiedVerse === index + 1 ? (
                          <div className="flex items-center space-x-1">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs text-green-500 font-medium hidden sm:inline">
                              Copied!
                            </span>
                          </div>
                        ) : (
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>

                      {/* Play */}
                      <button
                        className={`p-1 transition-colors ${playingAyah === index + 1 ? "text-cyan-600" : "hover:text-gray-700 dark:hover:text-white"} ${playingAyah === index + 1 && audioEl && !audioEl.paused ? "animate-pulse" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAyahPlayPause(index + 1);
                        }}
                        title={playingAyah === index + 1 && audioEl && !audioEl.paused ? "Pause ayah" : playingAyah === index + 1 && audioEl && audioEl.paused ? "Resume ayah" : "Play ayah audio"}
                      >
                        {playingAyah === index + 1 && audioEl && !audioEl.paused ? (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        ) : (
                          <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                      {playingAyah === index + 1 && (
                        <span className="inline-flex items-center ml-1 text-cyan-600">
                          {/* simple equalizer indicator */}
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                            <rect x="1" y="3" width="2" height="6" className="animate-[bounce_1s_infinite]" />
                            <rect x="5" y="2" width="2" height="8" className="animate-[bounce_1s_infinite_200ms]" />
                            <rect x="9" y="4" width="2" height="4" className="animate-[bounce_1s_infinite_400ms]" />
                          </svg>
                        </span>
                      )}

                      {/* BookOpen - Interpretation (hidden for Tamil) */}
                      {translationLanguage !== 'ta' && (
                        <button
                          className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInterpretationClick(index + 1);
                          }}
                          title="View interpretation"
                        >
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      )}

                      {/* List */}
                      <button
                        className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWordByWordClick(index + 1, e);
                        }}
                      >
                        <WordByWordIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                      {/* Bookmark */}
                      <button
                        className={`p-1 transition-colors ${
                          bookmarkedVerses.has(`${surahId}:${index + 1}`)
                            ? "text-cyan-500 hover:text-cyan-600"
                            : "hover:text-gray-700 dark:hover:text-white"
                        } ${
                          bookmarkLoading[`${surahId}:${index + 1}`]
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={(e) =>
                          handleBookmarkClick(
                            e,
                            index,
                            finalArabicText,
                            verse.Translation
                          )
                        }
                        disabled={bookmarkLoading[`${surahId}:${index + 1}`]}
                        title={
                          bookmarkedVerses.has(`${surahId}:${index + 1}`)
                            ? "Remove bookmark"
                            : "Add bookmark"
                        }
                      >
                        {bookmarkLoading[`${surahId}:${index + 1}`] ? (
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b border-current"></div>
                        ) : (
                          <Bookmark
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              bookmarkedVerses.has(`${surahId}:${index + 1}`)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Share */}
                      <button
                        className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareVerse(
                            finalArabicText,
                            verse.Translation,
                            index + 1
                          );
                        }}
                        title="Share verse"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : null}
          </div>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[9999] pt-32 sm:pt-40 lg:pt-48 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#2A2C38] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="overflow-y-auto max-h-[90vh]">
                <WordByWord
                  selectedVerse={selectedVerseForWordByWord}
                  surahId={surahId}
                  onClose={handleWordByWordClose}
                  onNavigate={handleWordByWordNavigate}
                  onSurahChange={handleWordByWordSurahChange}
                />
              </div>
            </div>
          </div>
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
          <div className="fixed inset-0 flex items-start justify-center z-[9999] pt-32 sm:pt-40 lg:pt-48 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-y-auto">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
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
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
                    <div
                      className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                      style={{ fontSize: `${translationFontSize}px` }}
                    >
                      {hindiFootnoteContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bangla Explanation Modal */}
        {showBanglaExplanationModal && (
          <div className="fixed inset-0 flex items-start justify-center z-[9999] pt-32 sm:pt-40 lg:pt-48 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-y-auto">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
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
                      style={{ fontSize: `${translationFontSize}px` }}
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
          <div className="fixed inset-0 flex items-start justify-center z-[9999] pt-32 sm:pt-40 lg:pt-48 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-y-auto">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
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
                      className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                      style={{ fontSize: `${translationFontSize}px` }}
                    >
                      {urduFootnoteContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* English Footnote Modal */}
        {showEnglishFootnoteModal && (
          <div className="fixed inset-0 flex items-start justify-center z-[9999] pt-32 sm:pt-40 lg:pt-48 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-y-auto">
            <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
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

        {/* Floating Back to Top Button */}
        {showScrollButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed right-6 z-[60] bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center ${
              playingAyah ? 'bottom-32 sm:bottom-36' : 'bottom-6'
            }`}
            title="Beginning of Surah"
            aria-label="Beginning of Surah"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}

        {/* Sticky Audio Player */}
        {playingAyah && (
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
                handleTopStopReset();
                setTimeout(() => {
                  playAyahSequence(playingAyah, 0);
                }, 100);
              }
            }}
            translationLanguage={translationLanguage}
            audioTypes={audioTypes}
            onAudioTypesChange={(newTypes) => {
              const currentPlayingAyah = playingAyah; // Capture current ayah
              setAudioTypes(newTypes);
              // If audio is currently playing, restart with new audio types
              if (currentPlayingAyah) {
                handleTopStopReset();
                // Use newTypes directly instead of relying on state
                setTimeout(() => {
                  // Temporarily update the function to use newTypes
                  playAyahSequenceWithTypes(currentPlayingAyah, 0, newTypes);
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
  );
};

export default Surah;
