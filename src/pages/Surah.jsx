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
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import HomepageNavbar from "../components/HomeNavbar";
import { Link } from "react-router-dom";
import Transition from "../components/Transition";
import WordByWord from "./WordByWord";
import StarNumber from "../components/StarNumber";
import Bismi from "../assets/bismi.jpg";
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
  fetchArabicVerses,
  fetchPageRanges,
  fetchAyaTranslation,
  fetchAyaRanges,
} from "../api/apifunction";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import translationCache from "../utils/translationCache";
import { VersesSkeleton, LoadingWithProgress } from "../components/LoadingSkeleton";

const Surah = () => {
  const { quranFont, fontSize, translationFontSize, translationLanguage } = useTheme();
  const { user } = useAuth();
  const { surahId } = useParams(); // Get surah ID from URL
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get query parameters
  const { toasts, removeToast, showSuccess, showError } = useToast();

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
  const [error, setError] = useState(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState({});
  const [tamilDownloading, setTamilDownloading] = useState(false);
  
  // Hindi footnote modal state
  const [showHindiFootnoteModal, setShowHindiFootnoteModal] = useState(false);
  const [hindiFootnoteContent, setHindiFootnoteContent] = useState('');
  const [hindiFootnoteLoading, setHindiFootnoteLoading] = useState(false);

  // Audio functionality states
  const [playingAyah, setPlayingAyah] = useState(null);
  const [selectedQari, setSelectedQari] = useState('al-afasy');
  const [showQariDropdown, setShowQariDropdown] = useState(false);
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
              
              const parsed = hindiTranslationService.parseHindiTranslationWithClickableFootnotes(
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
          arabicResponse,
          pageRangesResponse,
        ] = await Promise.all([
          listSurahNames(),
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
          // Tamil translations from SQLite database (auto-load, no prompt)
          try {
            // Ensure DB is initialized; this will mark it as downloaded internally
            await tamilTranslationService.initDB();
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
          // Hindi translations from local SQLite database
          try {
            await hindiTranslationService.initHindiDB();
            // Build list of translations per ayah
            const verseNumbers = Array.from({ length: verseCount }, (_, i) => i + 1);
            const items = await Promise.all(
              verseNumbers.map(async (v) => {
                const rawTranslation = await hindiTranslationService.getAyahTranslation(parseInt(surahId), v) || '';
                
                // Store both raw and parsed versions
                const parsedTranslation = hindiTranslationService.parseHindiTranslationWithClickableFootnotes(
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
            console.error('Error fetching Hindi translations:', error);
            const fallbackAyahData = Array.from({ length: verseCount }, (_, index) => ({
              number: index + 1,
              ArabicText: '',
              Translation: 'Hindi translation service unavailable. Please try again later.'
            }));
            setAyahData(fallbackAyahData);
          }
        } else if (translationLanguage === 'E') {
          // Use cache if available
          const cacheKey = `${surahId}-E`;
          const cachedMap = englishAyahCacheRef.current.get(cacheKey);
          if (cachedMap) {
            const formatted = Array.from({ length: verseCount }, (_, i) => ({
              number: i + 1,
              ArabicText: '',
              Translation: cachedMap.get(i + 1) || '',
            }));
            setAyahData(formatted);
          } else {
            // Fetch ranges
            const ranges = await fetchAyaRanges(parseInt(surahId), 'E').catch(() => []);
            const htmlToPlain = (html) => {
              const div = document.createElement('div');
              div.innerHTML = html || '';
              div.querySelectorAll('sup').forEach(s => s.remove());
              return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
            };

            const surahNum = parseInt(surahId);
            const perAyah = new Map();


            // Cache and set state
            englishAyahCacheRef.current.set(cacheKey, perAyah);
            
            // Progressive loading: Update state as we process translations
            const updateAyahData = (currentPerAyah) => {
              const formattedAyahData = Array.from({ length: verseCount }, (_, k) => ({
                number: k + 1,
                ArabicText: '',
                Translation: currentPerAyah.get(k + 1) || '',
              }));
              setAyahData(formattedAyahData);
            };
            
            // Set initial state with empty translations
            updateAyahData(new Map());
            
            // TRUE LAZY LOADING: Load each translation individually and update UI immediately
            const processTranslationRange = async (r, rangeIndex) => {
              const from = r.AyaFrom || r.ayafrom || r.from;
              const to = r.AyaTo || r.ayato || r.to || from;
              if (!from || !to) return;
              
              const rangeStr = `${from}-${to}`;
              try {
                // Check cache first
                let tData = await translationCache.getCachedTranslation(parseInt(surahId), rangeStr, 'E');
                
                if (!tData) {
                  // Cache miss - fetch from API
                  tData = await fetchAyaTranslation(parseInt(surahId), rangeStr, 'E');
                  // Cache the result for future use
                  await translationCache.setCachedTranslation(parseInt(surahId), rangeStr, tData, 'E');
                }
                
                const raw = Array.isArray(tData) && tData.length > 0
                  ? (tData[0].TranslationText || tData[0].translationText || tData[0].text || '')
                  : (tData?.TranslationText || tData?.translationText || tData?.text || '');
                const content = htmlToPlain(raw);
                const re = new RegExp(`\\(\\s*${surahNum}\\s*:\\s*(\\d+)\\s*\\)`, 'g');
                let m;
                const idxs = [];
                while ((m = re.exec(content)) !== null) {
                  idxs.push({ ayah: parseInt(m[1], 10), index: m.index });
                }
                if (idxs.length === 0) {
                  const reAlt = /\((\d+)\)/g;
                  while ((m = reAlt.exec(content)) !== null) {
                    idxs.push({ ayah: parseInt(m[1], 10), index: m.index });
                  }
                }
                if (idxs.length > 0) {
                  for (let j = 0; j < idxs.length; j++) {
                    const start = idxs[j].index;
                    const end = j + 1 < idxs.length ? idxs[j + 1].index : content.length;
                    const ay = idxs[j].ayah;
                    const seg = content.slice(start, end).replace(re, '').replace(/\((\d+)\)/g, '').trim();
                    if (ay >= from && ay <= to) perAyah.set(ay, seg);
                  }
                }
                if (idxs.length === 0) {
                  perAyah.set(from, content);
                }
                
                // IMMEDIATE UI UPDATE: Update UI as soon as this range completes
                updateAyahData(perAyah);
                
                // Update progress
                const progress = Math.round(((rangeIndex + 1) / ranges.length) * 100);
                setLoadingProgress(progress);
                
                
              } catch (error) {
                console.error('Error processing translation range:', error);
              }
            };
            
            // VIEWPORT-BASED LOADING: Load visible content first, then background
            const prioritizeRanges = (ranges) => {
              // First 3 ranges are likely visible (above the fold)
              const visibleRanges = ranges.slice(0, 3);
              const backgroundRanges = ranges.slice(3);
              
              return { visibleRanges, backgroundRanges };
            };
            
            const { visibleRanges, backgroundRanges } = prioritizeRanges(ranges);
            
            // Load visible ranges first (high priority)
            const visiblePromises = visibleRanges.map((r, index) => processTranslationRange(r, index));
            
            // Load background ranges after a short delay (low priority)
            setTimeout(() => {
              const backgroundPromises = backgroundRanges.map((r, index) => 
                processTranslationRange(r, index + visibleRanges.length)
              );
              
              Promise.allSettled(backgroundPromises).then((results) => {
                const successful = results.filter(r => r.status === 'fulfilled').length;
              });
            }, 100); // 100ms delay for background loading
            
            // Monitor all loading completion
            Promise.allSettled(visiblePromises).then((results) => {
              const successful = results.filter(r => r.status === 'fulfilled').length;
            });
            
            // Preload strategy: Preload popular surahs in background
            const popularSurahs = [1, 2, 18, 36, 67]; // Al-Fatiha, Al-Baqarah, Al-Kahf, Ya-Sin, Al-Mulk
            const currentSurahNum = parseInt(surahId);
            
            // Preload next/previous surah if they're popular
            const preloadCandidates = [
              currentSurahNum - 1,
              currentSurahNum + 1
            ].filter(num => num >= 1 && num <= 114 && popularSurahs.includes(num));
            
            // Background preload (don't await)
            if (preloadCandidates.length > 0) {
              preloadCandidates.forEach(surahToPreload => {
                // Preload in background without blocking UI
                setTimeout(async () => {
                  try {
                    const preloadRanges = await fetchAyaRanges(surahToPreload, 'E').catch(() => []);
                    if (preloadRanges && preloadRanges.length > 0) {
                      // Preload first few ranges only to avoid overwhelming
                      const firstFewRanges = preloadRanges.slice(0, 3);
                      await Promise.all(firstFewRanges.map(async (r) => {
                        const from = r.AyaFrom || r.ayafrom || r.from;
                        const to = r.AyaTo || r.ayato || r.to || from;
                        if (!from || !to) return;
                        const rangeStr = `${from}-${to}`;
                        
                        // Check if already cached
                        const cached = await translationCache.getCachedTranslation(surahToPreload, rangeStr, 'E');
                        if (!cached) {
                          try {
                            const data = await fetchAyaTranslation(surahToPreload, rangeStr, 'E');
                            await translationCache.setCachedTranslation(surahToPreload, rangeStr, data, 'E');
                          } catch (preloadError) { 
                  }
                        }
                      }));
                    }
                  } catch (error) {
                  }
                }, 1000); // Delay preload to not interfere with current loading
              });
            }
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
        setSurahInfo(
          currentSurah
            ? { arabic: currentSurah.arabic, number: currentSurah.id }
            : { arabic: "Unknown Surah", number: parseInt(surahId) }
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

  const handleWordByWordClick = (verseNumber) => {
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

      // Open the AyahModal instead of navigating
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
            const explanation = await hindiTranslationService.getExplanationByFootnote(
              parseInt(surahNo), 
              parseInt(ayahNo), 
              parseInt(footnoteNumber)
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
            
            const parsed = hindiTranslationService.parseHindiTranslationWithClickableFootnotes(
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

  // Play qirath then translation for the ayah, then advance automatically
  const playAyahSequence = (ayahNumber) => {
    if (!surahId) return;
    const totalAyahs = ayahData?.length || 0;
    setIsSequencePlaying(true);

    // Qirath first
    stopCurrentAudio();
    const qirathEl = playAyahAudio({
      ayahNumber,
      surahNumber: parseInt(surahId),
      audioType: 'qirath',
      qariName: selectedQari,
      onStart: () => setPlayingAyah(ayahNumber),
      onEnd: () => {
        // Then translation
        const transEl = playAyahAudio({
          ayahNumber,
          surahNumber: parseInt(surahId),
          audioType: 'translation',
          qariName: selectedQari,
          onEnd: () => {
            // Advance to next ayah if available
            if (ayahNumber < totalAyahs) {
              playAyahSequence(ayahNumber + 1);
            } else {
              setIsSequencePlaying(false);
              setPlayingAyah(null);
            }
          },
          onError: () => {
            // If translation fails, still advance
            if (ayahNumber < totalAyahs) {
              playAyahSequence(ayahNumber + 1);
            } else {
              setIsSequencePlaying(false);
              setPlayingAyah(null);
            }
          }
        });
        setAudioEl(transEl);
      },
      onError: () => {
        // If qirath fails, try translation then continue
        const transEl = playAyahAudio({
          ayahNumber,
          surahNumber: parseInt(surahId),
          audioType: 'translation',
          qariName: selectedQari,
          onEnd: () => {
            if (ayahNumber < totalAyahs) {
              playAyahSequence(ayahNumber + 1);
            } else {
              setIsSequencePlaying(false);
              setPlayingAyah(null);
            }
          },
          onError: () => {
            if (ayahNumber < totalAyahs) {
              playAyahSequence(ayahNumber + 1);
            } else {
              setIsSequencePlaying(false);
              setPlayingAyah(null);
            }
          }
        });
        setAudioEl(transEl);
      },
    });
    setAudioEl(qirathEl);
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
    playAyahSequence(ayahNumber);
  };

  // Top controls: Play/Pause/Resume and Stop (reset to beginning)
  const handleTopPlayPause = () => {
    try {
      if (audioEl && !audioEl.paused) {
        audioEl.pause();
        setIsSequencePlaying(false);
      } else if (audioEl && audioEl.paused) {
        audioEl.play().then(() => setIsSequencePlaying(true)).catch(() => {});
      } else {
        // Start from beginning (ayah 1) or current highlighted ayah
        playAyahSequence(1);
      }
    } catch (_) {}
  };

  const handleTopStopReset = () => {
    stopCurrentAudio();
    setIsSequencePlaying(false);
    setPlayingAyah(null);
    // clear current element so next Play starts a fresh sequence from ayah 1
    setAudioEl(null);
  };

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
          
          const [surahNamesResponse, arabicResponse, pageRangesResponse] = await Promise.all([
            listSurahNames(),
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
          setSurahInfo(
            currentSurah
              ? { arabic: currentSurah.arabic, number: currentSurah.id }
              : { arabic: "Unknown Surah", number: parseInt(surahId) }
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
        <Transition />
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
        <Transition />
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
    <>
      <Transition />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="w-full max-w-[1290px] mx-auto text-center px-2 sm:px-0">
            {/* Toggle Buttons */}
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
                      <span className="text-xs sm:text-sm text-black font-poppins dark:text-white cursor-pointer hover:underline">
                        Reading
                      </span>
                    </Link>
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
                  {kabahIcon}
                </button>
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Bismillah */}
              <p className="text-xl sm:text-2xl font-arabic text-gray-800 dark:text-white leading-relaxed px-4">
                <img
                  src={Bismi}
                  alt="Bismillah"
                  className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert"
                />
              </p>

              {/* Surah Info */}
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
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleTopPlayPause}
                    className={`flex items-center space-x-2 transition-colors ${isSequencePlaying ? "text-red-500 hover:text-red-600" : "text-cyan-500 hover:text-cyan-600"} min-h-[44px] px-2`}
                  >
                    {audioEl && !audioEl.paused ? (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                    ) : (
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">
                      {audioEl ? (audioEl.paused ? "Resume Audio" : "Pause Audio") : "Play Audio"}
                    </span>
                  </button>
                  {audioEl && (
                    <button
                      onClick={handleTopStopReset}
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      title="Stop and reset to beginning"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                      <span className="text-xs sm:text-sm font-medium hidden sm:inline">Stop</span>
                    </button>
                  )}
                </div>
                <div className="flex justify-end">
                  <div className={`flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm ${translationLanguage === 'ta' || translationLanguage === 'hi' ? 'w-[55px]' : 'w-[115px]'}`}>
                    <button className="px-2 sm:px-3 py-1.5 bg-white w-[55px] dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                      Ayah
                    </button>
                    {/* Hide blockwise for Tamil and Hindi */}
                    {translationLanguage !== 'ta' && translationLanguage !== 'hi' && (
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
                    {kabahIcon}
                  </button>
                  <button className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Bismillah */}
                <div className="mt-6 sm:mb-8 relative">
                  <img
                    src={Bismi}
                    alt="Bismillah"
                    className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert"
                  />

                  {/* Desktop Ayah wise / Block wise buttons */}
                  <div className="absolute top-0 right-0">
                    <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                      <button className="px-3 sm:px-4 py-1.5 bg-white dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow transition-colors">
                        Ayah wise
                      </button>
                      {/* Hide blockwise for Tamil and Hindi */}
                      {translationLanguage !== 'ta' && translationLanguage !== 'hi' && (
                        <button
                          className="px-3 sm:px-4 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs sm:text-sm font-medium hover:text-gray-700 dark:hover:text-white transition-colors"
                          onClick={() => navigate(`/blockwise/${surahId}`)}
                        >
                          Block wise
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Desktop Bottom Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-start space-x-2">
                    <Info className="w-5 h-5 text-gray-900 dark:text-white" />
                    <Link to={`/surahinfo/${surahId}`}>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                        Surah info
                      </span>
                    </Link>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleTopPlayPause}
                      className={`flex items-center space-x-2 transition-colors ${isSequencePlaying ? "text-red-500 hover:text-red-600" : "text-cyan-500 hover:text-cyan-600"} min-h-[44px] px-2`}
                    >
                      {audioEl && !audioEl.paused ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">{audioEl ? (audioEl.paused ? "Resume Audio" : "Pause Audio") : "Play Audio"}</span>
                    </button>
                    {audioEl && (
                      <button 
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        onClick={handleTopStopReset}
                        title="Stop and reset to beginning"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                        <span className="text-sm font-medium hidden sm:inline">Stop</span>
                      </button>
                    )}

                    {/* Qari Selector - Right side of Play Audio */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQariDropdown((prev) => !prev)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                        title="Select Reciter"
                      >
                        <span>
                          {selectedQari === 'al-ghamidi' && 'Al-Ghamidi'}
                          {selectedQari === 'al-afasy' && 'Al-Afasy'}
                          {selectedQari === 'al-hudaify' && 'Al-Hudaify'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
                      </button>

                      {showQariDropdown && (
                        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden w-40 z-50">
                          <div
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white text-xs sm:text-sm ${
                              selectedQari === 'al-ghamidi' ? 'bg-gray-100 dark:bg-gray-700' : ''
                            }`}
                            onClick={() => {
                              setSelectedQari('al-ghamidi');
                              setShowQariDropdown(false);
                            }}
                          >
                            Al-Ghamidi
                          </div>
                          <div
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white text-xs sm:text-sm ${
                              selectedQari === 'al-afasy' ? 'bg-gray-100 dark:bg-gray-700' : ''
                            }`}
                            onClick={() => {
                              setSelectedQari('al-afasy');
                              setShowQariDropdown(false);
                            }}
                          >
                            Al-Afasy
                          </div>
                          <div
                            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white text-xs sm:text-sm ${
                              selectedQari === 'al-hudaify' ? 'bg-gray-100 dark:bg-gray-700' : ''
                            }`}
                            onClick={() => {
                              setSelectedQari('al-hudaify');
                              setShowQariDropdown(false);
                            }}
                          >
                            Al-Hudaify
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                    className="pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700 rounded-md transition-colors"
                    style={playingAyah === index + 1 ? { backgroundColor: 'rgba(76, 175, 80, 0.1)' } : undefined}
                  >
                    {/* Arabic Text */}
                    {/* Arabic Text */}
                    <div className="text-right mb-2 sm:mb-3 lg:mb-4">
                      <p
                        className="leading-loose dark:text-white text-gray-900 px-2 sm:px-0"
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
                          className="text-gray-700 dark:text-white leading-relaxed px-2 sm:px-0 font-poppins font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                          dangerouslySetInnerHTML={{ __html: verse.Translation }}
                          data-hindi-translation={verse.RawTranslation || verse.Translation}
                          data-surah={surahId}
                          data-ayah={verse.number}
                          data-parsed={verse.Translation}
                        />
                      ) : (
                        <p
                          className="text-gray-700 dark:text-white leading-relaxed px-2 sm:px-0 font-poppins font-normal"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {verse.Translation}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-gray-500 dark:text-gray-300 px-2 sm:px-0">
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

                      {/* BookOpen - Interpretation */}
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

                      {/* List */}
                      <button
                        className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWordByWordClick(index + 1);
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
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
      </div>
    </>
  );
};

export default Surah;
