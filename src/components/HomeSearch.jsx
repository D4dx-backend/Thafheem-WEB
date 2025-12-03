import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import banner from "../assets/banner.png";
import { Play } from "lucide-react";
import { searchQuran, fetchPopularChapters, searchWords, searchArabicPhrases, searchSurahsByName, fetchSurahs } from "../api/apifunction";
import {
  getLastReading,
  LAST_READING_STORAGE_KEY,
} from "../services/readingProgressService";

// Icon components (keeping your existing ones)
const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MicIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const BookmarkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

// Normalize free-form verse queries such as `4 : 20`
const normalizeSearchQuery = (query = "") =>
  query.replace(/\s*:\s*/g, ":").replace(/\s+/g, " ").trim();

// Return `{ surah, verse }` when the normalized query matches `surah:verse`
const extractVerseReference = (query = "") => {
  const match = /^(\d{1,3}):(\d{1,3})$/.exec(query);
  if (!match) {
    return null;
  }

  const surah = match[1].replace(/^0+/, "") || "0";
  const verse = match[2].replace(/^0+/, "") || "0";

  return { surah, verse };
};

import { useTheme } from "../context/ThemeContext";

const HomepageSearch = () => {
  const { theme, setViewType, translationLanguage } = useTheme();
  const [showPopular, setShowPopular] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [popularChapters, setPopularChapters] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState(null);
  const [lastReading, setLastReading] = useState(null);
  const [surahsCache, setSurahsCache] = useState(null);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const wasManuallyClosed = useRef(false); // Track if user manually closed the popup

  // Preload popular data and surahs when component mounts
  useEffect(() => {
    fetchPopularData();
    // Preload surahs for name matching
    fetchSurahs().then(surahs => {
      setSurahsCache(surahs);
    }).catch(err => {
      console.warn('Failed to preload surahs:', err);
    });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showPopular || showSearchResults) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [showPopular, showSearchResults]);

  useEffect(() => {
    setLastReading(getLastReading());

    const handleStorageUpdate = (event) => {
      if (event.key && event.key !== LAST_READING_STORAGE_KEY) {
        return;
      }
      setLastReading(getLastReading());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageUpdate);
      }
    };
  }, []);

  // Mouse/Touch event handlers for drag scrolling
  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Multiply by 2 for faster scrolling
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.userSelect = '';
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Fetch popular chapters data
  const fetchPopularData = async () => {
    setIsLoadingPopular(true);
    setPopularError(null);
    
    try {
      const popularData = await fetchPopularChapters('en');
      setPopularChapters(popularData);
    } catch (error) {
      console.error('Error fetching popular data:', error);
      setPopularError('Failed to load popular content');
      // Set fallback data on error
      setPopularChapters([
        { id: 67, name: "Al-Mulk", verses: "30 verses", type: "Makki" },
        { id: 2, name: "Al-Baqarah", verses: "286 verses", type: "Madani" },
        { id: 1, name: "Al-Fatiha", verses: "7 verses", type: "Makki" },
        { id: 18, name: "Al-Kahf", verses: "110 verses", type: "Makki" },
        { id: 36, name: "Ya-Sin", verses: "83 verses", type: "Makki" },
        { id: 55, name: "Ar-Rahman", verses: "78 verses", type: "Makki" },
        { id: 112, name: "Al-Ikhlas", verses: "4 verses", type: "Makki" },
        { id: 114, name: "An-Nas", verses: "6 verses", type: "Makki" },
      ]);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  // Helper function to check if query matches a surah name or number
  const findMatchingSurah = async (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if it's a pure number (surah number)
    const surahNumber = /^\d+$/.test(normalizedQuery);
    if (surahNumber) {
      const num = parseInt(normalizedQuery, 10);
      if (num >= 1 && num <= 114) {
        return { number: num, name: `Surah ${num}` };
      }
    }

    // Try to get surahs from cache or fetch them
    let surahs = surahsCache;
    if (!surahs) {
      try {
        surahs = await fetchSurahs();
        setSurahsCache(surahs);
      } catch (err) {
        console.warn('Failed to fetch surahs for name matching:', err);
        return null;
      }
    }

    if (!surahs || surahs.length === 0) {
      return null;
    }

    // Search for exact match first (by name or number)
    // Note: surah.name = English name, surah.arabic = Arabic name
    // This works regardless of the selected translation language
    const exactMatch = surahs.find(surah => 
      surah.name?.toLowerCase() === normalizedQuery ||
      surah.number?.toString() === normalizedQuery ||
      surah.arabic?.toLowerCase() === normalizedQuery
    );

    if (exactMatch) {
      return exactMatch;
    }

    // Search for partial match (starts with)
    const startsWithMatch = surahs.find(surah =>
      surah.name?.toLowerCase().startsWith(normalizedQuery) ||
      surah.arabic?.toLowerCase().startsWith(normalizedQuery)
    );

    if (startsWithMatch) {
      return startsWithMatch;
    }

    return null;
  };

  const performSearch = async (query) => {
    const sanitizedQuery = normalizeSearchQuery(query);

    if (!sanitizedQuery) {
      setShowSearchResults(false);
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    // Skip word search for verse references - they should navigate directly
    const verseReference = extractVerseReference(sanitizedQuery);
    if (verseReference) {
      // This shouldn't happen if handleSearchSubmit works correctly, but handle it anyway
      return;
    }

    wasManuallyClosed.current = false;
    setIsSearching(true);
    setSearchError(null);
    setShowSearchResults(true);

    try {
      // Map translationLanguage code to API language name
      const languageMap = {
        'E': 'english',
        'mal': 'malayalam',
        'ta': 'tamil',
        'bn': 'bangla',
        'ur': 'urdu',
        'hi': 'hindi'
      };
      
      const selectedLang = languageMap[translationLanguage] || 'malayalam';
      
      // Search in both selected language AND Arabic (always include Arabic search)
      // Run searches in parallel for better performance
      const searchPromises = [
        searchWords(sanitizedQuery, selectedLang, 15).catch((err) => {
          console.warn(`Word search failed for ${selectedLang}:`, err);
          return { language: selectedLang, results: [] };
        }),
        searchArabicPhrases(sanitizedQuery, 15).catch((err) => {
          console.warn('Arabic phrase search failed:', err);
          return [];
        })
      ];
      
      const [wordSearchResult, arabicResults] = await Promise.all(searchPromises);
      
      // Format selected language word search results
      const formattedWordResults = (wordSearchResult.results || []).map(item => {
        // Ensure surah and ayah are properly parsed as integers
        const surah = typeof item.surah === 'number' ? item.surah : parseInt(String(item.surah), 10);
        const ayah = typeof item.ayah === 'number' ? item.ayah : parseInt(String(item.ayah), 10);
        
        // Validate values
        if (!surah || !ayah || isNaN(surah) || isNaN(ayah)) {
          console.warn('Invalid surah/ayah in result:', { item, surah, ayah, language: wordSearchResult.language });
          return null;
        }
        
        return {
          type: 'word_search',
          language: wordSearchResult.language,
          surah: surah,
          ayah: ayah,
          displayText: item.matchedText || '',
          subText: `${wordSearchResult.language} • Surah ${surah}:${ayah}`,
          arabicWord: item.arabicWord || '',
          matchedText: item.matchedText || ''
        };
      }).filter(result => result !== null && result.surah > 0 && result.ayah > 0); // Filter out invalid results

      // Format Arabic phrase search results - handle multiple possible response formats
      let formattedArabicResults = [];
      if (Array.isArray(arabicResults) && arabicResults.length > 0) {
        formattedArabicResults = arabicResults.map(result => {
          // Handle different possible field names from Arabic phrase search API
          const surah = result.SuraID || result.suraid || result.SuraId || result.surah || result.Sura;
          const ayah = result.AyaID || result.ayaid || result.AyaId || result.ayah || result.Aya;
          const text = result.AyaHText || result.text_uthmani || result.Text || result.text || result.AyaText || '';
          
          return {
            type: 'word_search',
            language: 'arabic',
            surah: parseInt(surah) || 0,
            ayah: parseInt(ayah) || 0,
            displayText: text,
            subText: `arabic • Surah ${surah}:${ayah}`,
            matchedText: sanitizedQuery
          };
        }).filter(result => result.surah > 0 && result.ayah > 0); // Filter out invalid results
      }

      // Also include surah name search results
      const surahResults = [];
      try {
        const surahs = await searchSurahsByName(sanitizedQuery);
        if (surahs && surahs.length > 0) {
          surahResults.push(...surahs.map(surah => ({
            type: 'surah',
            data: surah,
            displayText: `${surah.number}. ${surah.name}`,
            subText: `${surah.ayahs} verses • ${surah.type}`,
            arabicText: surah.arabic
          })));
        }
      } catch (error) {
        // Silently fail surah search
      }

      // Combine all results: preserve existing results (verse references, surahs) first, then new surahs, then word results
      // Use functional update to get current results from state
      setSearchResults(currentResults => {
        const existingResults = (currentResults || []).filter(r => r.type === 'verse_reference' || r.type === 'surah');
        const allResults = [...existingResults, ...surahResults, ...formattedWordResults, ...formattedArabicResults];
        return allResults.slice(0, 25);
      });
      
      // Debug: Log results to help troubleshoot
      setSearchResults(currentResults => {
        const existingResults = (currentResults || []).filter(r => r.type === 'verse_reference' || r.type === 'surah');
        const allResults = [...existingResults, ...surahResults, ...formattedWordResults, ...formattedArabicResults];
        
        console.log('📊 Search results:', {
          selectedLanguage: selectedLang,
          wordResults: formattedWordResults.length,
          arabicResults: formattedArabicResults.length,
          surahResults: surahResults.length,
          existingResults: existingResults.length,
          total: allResults.length,
          sampleWordResult: formattedWordResults[0],
          allWordResults: formattedWordResults
        });
        
        return allResults.slice(0, 25);
      });
    } catch (error) {
      setSearchError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const rawQuery = e.target.value;
    const normalizedQuery = normalizeSearchQuery(rawQuery);

    setSearchQuery(rawQuery);

    if (normalizedQuery.length < 1) {
      setShowSearchResults(false);
      setSearchResults([]);
      setSearchError(null);
      wasManuallyClosed.current = false; // Reset when input is cleared
      return;
    }

    // Reset manual close flag when user starts typing
    wasManuallyClosed.current = false;

    // Don't auto-show popup while typing - only show after form submit or when user completes input
    // Hide any existing results while user is typing
    setShowSearchResults(false);
  };

  // Handle search result click with modifier key support
  const handleSearchResultClick = (result, event) => {
    // Prevent default to avoid any unwanted behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Debug: Log all clicks to see what's happening
    console.log('🔍 Click handler called:', { 
      type: result.type, 
      language: result.language,
      surah: result.surah,
      ayah: result.ayah,
      fullResult: result
    });
    
    // Mark that we're navigating so blur handler doesn't interfere
    wasManuallyClosed.current = true;
    
    const isModifierPressed = event?.ctrlKey || event?.metaKey;
    
    if (result.type === 'word_search') {
      // Navigate to specific surah and ayah for word search results
      // Ensure we get the values correctly - handle both number and string
      const surah = typeof result.surah === 'number' ? result.surah : parseInt(String(result.surah || ''), 10);
      const ayah = typeof result.ayah === 'number' ? result.ayah : parseInt(String(result.ayah || ''), 10);
      
      // Debug log to help troubleshoot
      console.log('✅ Navigating to word search result:', { surah, ayah, language: result.language, originalResult: result });
      
      if (!surah || !ayah || isNaN(surah) || isNaN(ayah) || surah < 1 || surah > 114 || ayah < 1) {
        console.warn('Invalid surah or ayah:', { surah, ayah, result });
        return;
      }
      
      const targetUrl = `/surah/${surah}#verse-${ayah}`;
      
      if (isModifierPressed) {
        event?.preventDefault();
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // Store state in sessionStorage for the surah page to read (backup)
      sessionStorage.setItem('scrollToVerse', ayah.toString());
      sessionStorage.setItem('navigationState', JSON.stringify({
        viewType: 'Ayah Wise',
        highlightVerse: `${surah}:${ayah}`,
        scrollToVerse: ayah
      }));
      
      // Close the popup before navigation
      setShowSearchResults(false);
      setSearchQuery("");
      setSearchResults([]);
      
      // Always use window.location.href to ensure hash is preserved in URL
      // This works reliably for all languages
      window.location.href = targetUrl;
    } else if (result.type === 'surah') {
      let surahNumber =
        result.data?.number ??
        result.data?.id ??
        result.data?.chapter_id ??
        result.data?.code ??
        null;

      if (typeof surahNumber === "string") {
        surahNumber = surahNumber.replace(/^0+/, "");
      }

      if (!surahNumber) {
        console.warn("Unable to determine surah number from search result:", result);
        return;
      }

      const targetSurahId = surahNumber.toString();
      const url = `/surah/${targetSurahId}`;
      
      if (isModifierPressed) {
        event?.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // Close the popup before navigation
      setShowSearchResults(false);
      setSearchQuery("");
      setSearchResults([]);
      
      navigate(url);
    } else if (result.type === 'verse' || result.type === 'verse_reference') {
      const surah = result.surah || (result.verse_key ? parseInt(result.verse_key.split(':')[0], 10) : null);
      const verse = result.ayah || result.verse || (result.verse_key ? parseInt(result.verse_key.split(':')[1], 10) : null);
      
      if (!surah || !verse) {
        console.warn('Invalid verse reference:', result);
        return;
      }
      
      const url = `/surah/${surah}#verse-${verse}`;
      const verseKey = result.verse_key || `${surah}:${verse}`;
      
      if (isModifierPressed) {
        event?.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      
      // Store state for navigation
      sessionStorage.setItem('scrollToVerse', verse.toString());
      sessionStorage.setItem('navigationState', JSON.stringify({
        viewType: 'Ayah Wise',
        highlightVerse: verseKey,
        scrollToVerse: verse
      }));
      
      // Close the popup before navigation
      setShowSearchResults(false);
      setSearchQuery("");
      setSearchResults([]);
      
      window.location.href = url;
    }
    
    setShowSearchResults(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const normalizedQuery = normalizeSearchQuery(searchQuery);

    if (!normalizedQuery) {
      setShowSearchResults(false);
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    wasManuallyClosed.current = false;
    setIsSearching(true);
    setSearchError(null);
    setShowSearchResults(true);
    setSearchQuery(normalizedQuery);

    try {
      const results = [];

      // Check if it's a verse reference (e.g., "2:45")
      const verseReference = extractVerseReference(normalizedQuery);
      if (verseReference) {
        const surah = parseInt(verseReference.surah, 10);
        const verse = parseInt(verseReference.verse, 10);
        
        // Validate surah and verse numbers
        if (surah >= 1 && surah <= 114 && verse >= 1) {
          // Get surah name for display
          let surahs = surahsCache;
          if (!surahs) {
            try {
              surahs = await fetchSurahs();
              setSurahsCache(surahs);
            } catch (err) {
              console.warn('Failed to fetch surahs:', err);
            }
          }
          
          const surahInfo = surahs?.find(s => s.number === surah);
          const surahName = surahInfo?.name || `Surah ${surah}`;
          const surahArabic = surahInfo?.arabic || '';
          
          results.push({
            type: 'verse_reference',
            surah: surah,
            ayah: verse,
            displayText: `${surahName} - Verse ${verse}`,
            subText: `Surah ${surah}:${verse}`,
            arabicText: surahArabic,
            verse_key: `${surah}:${verse}`
          });
        }
      }

      // Check if it's a surah number only (e.g., "2")
      const isSurahOnly = /^\d+$/.test(normalizedQuery);
      if (isSurahOnly) {
        const surahNum = parseInt(normalizedQuery, 10);
        if (surahNum >= 1 && surahNum <= 114) {
          // Get surah info
          let surahs = surahsCache;
          if (!surahs) {
            try {
              surahs = await fetchSurahs();
              setSurahsCache(surahs);
            } catch (err) {
              console.warn('Failed to fetch surahs:', err);
            }
          }
          
          const surahInfo = surahs?.find(s => s.number === surahNum);
          if (surahInfo) {
            results.push({
              type: 'surah',
              data: surahInfo,
              displayText: `${surahInfo.number}. ${surahInfo.name}`,
              subText: `${surahInfo.ayahs} verses • ${surahInfo.type}`,
              arabicText: surahInfo.arabic
            });
          }
        }
      }

      // Check if it's a surah name
      const matchingSurah = await findMatchingSurah(normalizedQuery);
      if (matchingSurah && !isSurahOnly) {
        const surahId = matchingSurah.number || matchingSurah.id;
        if (surahId >= 1 && surahId <= 114) {
          // Get full surah info
          let surahs = surahsCache;
          if (!surahs) {
            try {
              surahs = await fetchSurahs();
              setSurahsCache(surahs);
            } catch (err) {
              console.warn('Failed to fetch surahs:', err);
            }
          }
          
          const surahInfo = surahs?.find(s => s.number === surahId);
          if (surahInfo) {
            results.push({
              type: 'surah',
              data: surahInfo,
              displayText: `${surahInfo.number}. ${surahInfo.name}`,
              subText: `${surahInfo.ayahs} verses • ${surahInfo.type}`,
              arabicText: surahInfo.arabic
            });
          }
        }
      }

      // If we found verse reference or surah matches, show them
      if (results.length > 0) {
        setSearchResults(results);
        setIsSearching(false);
        
        // Only do word search if it's not a pure verse reference or surah number
        // (e.g., "2:45" or "2" should not trigger word search, but "Al-Baqarah" can)
        const isVerseReference = extractVerseReference(normalizedQuery);
        const isSurahNumber = /^\d+$/.test(normalizedQuery);
        
        if (!isVerseReference && !isSurahNumber) {
          // Perform word search in background to add more results
          performSearch(normalizedQuery).catch(() => {
            // Ignore word search errors, we already have verse/surah results
          });
        }
      } else {
        // No verse/surah matches, just do word search
        await performSearch(normalizedQuery);
      }
    } catch (error) {
      setSearchError('Failed to search. Please try again.');
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleBookmarkClick = () => {
    navigate("/bookmarkedverses");
  };

  const handleContinueReading = () => {
    const latestReading = getLastReading();
    if (!latestReading) {
      setLastReading(null);
      return;
    }

    setLastReading(latestReading);

    if (latestReading.viewType === "blockwise") {
      setViewType?.("Block Wise");
    } else if (latestReading.viewType === "surah") {
      setViewType?.("Ayah Wise");
    }

    const targetPath =
      latestReading.path ||
      (latestReading.surahId ? `/surah/${latestReading.surahId}` : "/reading");

    navigate(targetPath);
  };

  // Handle search input blur - navigate directly if verse reference or surah
  const handleSearchBlur = async () => {
    // Longer delay to allow click events to process first (especially for word search results)
    setTimeout(async () => {
      // Check if user clicked on a result (wasManuallyClosed is set to true on click)
      if (wasManuallyClosed.current) {
        return; // Don't interfere with navigation
      }
      
      const normalizedQuery = normalizeSearchQuery(searchQuery);
      
      if (!normalizedQuery) {
        setShowSearchResults(false);
        return;
      }

      // Check if it's a verse reference (e.g., "2:45")
      const verseReference = extractVerseReference(normalizedQuery);
      if (verseReference) {
        const surah = parseInt(verseReference.surah, 10);
        const verse = parseInt(verseReference.verse, 10);
        
        if (surah >= 1 && surah <= 114 && verse >= 1) {
          const targetUrl = `/surah/${surah}#verse-${verse}`;
          sessionStorage.setItem('scrollToVerse', verse.toString());
          sessionStorage.setItem('navigationState', JSON.stringify({
            viewType: 'Ayah Wise',
            highlightVerse: `${surah}:${verse}`,
            scrollToVerse: verse
          }));
          window.location.href = targetUrl;
          return;
        }
      }

      // Check if it's a surah number
      const isSurahOnly = /^\d+$/.test(normalizedQuery);
      if (isSurahOnly) {
        const surahNum = parseInt(normalizedQuery, 10);
        if (surahNum >= 1 && surahNum <= 114) {
          navigate(`/surah/${surahNum}`);
          setSearchQuery("");
          return;
        }
      }

      // Check if it's a surah name
      const matchingSurah = await findMatchingSurah(normalizedQuery);
      if (matchingSurah) {
        const surahId = matchingSurah.number || matchingSurah.id;
        if (surahId >= 1 && surahId <= 114) {
          navigate(`/surah/${surahId}`);
          setSearchQuery("");
          return;
        }
      }

      // If it's a complete verse reference, show search results
      if (verseReference && normalizedQuery.trim().length > 0) {
        // Don't perform search for verse references - they should navigate directly
        setShowSearchResults(false);
      } else {
        setShowSearchResults(false);
      }
    }, 200);
  };

  // Handle chapter button click (prevent drag from triggering click)
  const handleChapterClick = (chapter, e) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }

    const chapterId = chapter?.id ?? chapter?.chapter_id;
    if (!chapterId) {
      return;
    }

    const verseKey = chapter?.verseKey || chapter?.verse_key;
    const verseNumber =
      chapter?.verseNumber ??
      chapter?.verse_number ??
      (typeof verseKey === "string" ? verseKey.split(":")[1] : undefined);

    const url = `/surah/${chapterId}`;
    const isModifierPressed = e?.ctrlKey || e?.metaKey;

    const navigationState =
      verseNumber || verseKey
        ? {
            ...(verseNumber ? { scrollToVerse: verseNumber } : {}),
            ...(verseKey ? { highlightVerse: verseKey } : {}),
          }
        : undefined;

    if (isModifierPressed) {
      e?.preventDefault();
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url, { state: navigationState });
    }
    setShowPopular(false);
    hasDragged.current = false;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 py-6 sm:py-8 lg:py-12">
      {/* Banner Section */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mb-6 sm:mb-8 mx-auto">
        <a
          href="https://app.thafheem.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img
            src={banner}
            alt="Banner"
            className="w-full h-auto object-contain rounded-xl"
          />
        </a>
      </div>

      {/* Logo Section */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-8 sm:mb-10 mx-auto">
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 rounded-lg flex items-center justify-center">
          <img
            src={theme === 'dark' ? logoWhite : logo}
            alt="Logo"
            className="object-contain transition-transform h-16 sm:h-20 md:h-24 lg:h-28 max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[400px] w-auto"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-8 sm:mb-10 relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-white" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            // Removed onFocus auto-show to prevent popup from reappearing after cancel
            // Results will only show when user types or submits search
            placeholder="Search surahs, verses, or try '2:255' for specific verses..."
            className="w-full h-[49px] pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] dark:border-gray-600 dark:text-white shadow-sm text-gray-700 placeholder-gray-400 text-base"
          />
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[300] backdrop-blur-sm"
              onClick={() => {
                setShowSearchResults(false);
                setSearchResults([]);
                setSearchQuery("");
                wasManuallyClosed.current = true; // Mark as manually closed
              }}
            />
            
            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 w-[95vw] max-w-xl sm:max-w-2xl md:max-w-3xl z-[310] max-h-[85vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium font-poppins text-gray-900 dark:text-white">
                    Search Results
                  </h3>
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchResults([]);
                      setSearchQuery("");
                      wasManuallyClosed.current = true; // Mark as manually closed
                    }}
                    className="text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4">
                {isSearching && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                  </div>
                )}

                {searchError && (
                  <div className="text-center py-4">
                    <p className="text-red-500 dark:text-red-400">{searchError}</p>
                  </div>
                )}

                {!isSearching && !searchError && searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No results found</p>
                  </div>
                )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Found {searchResults.filter(r => r.type === 'surah').length} surahs, {searchResults.filter(r => r.type === 'verse' || r.type === 'verse_reference').length} verses, {searchResults.filter(r => r.type === 'word_search').length} word matches
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${index}-${result.surah || result.data?.number || index}`}
                      onMouseDown={(e) => {
                        // Use onMouseDown instead of onClick to ensure it fires before blur
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🖱️ Div clicked:', { result, index });
                        handleSearchResultClick(result, e);
                      }}
                      onClick={(e) => {
                        // Also handle onClick as backup
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      {result.type === 'word_search' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase">
                                {result.language}
                              </span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.subText}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.displayText}
                            </p>
                            {result.arabicWord && (
                              <p className="text-lg text-gray-700 dark:text-gray-300 mt-1" dir="rtl">
                                {result.arabicWord}
                              </p>
                            )}
                          </div>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      ) : result.type === 'surah' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                                Surah
                              </span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.subText}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.displayText}
                              </p>
                              <p className="text-lg text-gray-700 dark:text-gray-300 ml-4" dir="rtl">
                                {result.arabicText}
                              </p>
                            </div>
                          </div>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      ) : result.type === 'verse_reference' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                                Verse Reference
                              </span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.subText}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.displayText}
                              </p>
                              {result.arabicText && (
                                <p className="text-lg text-gray-700 dark:text-gray-300 ml-4" dir="rtl">
                                  {result.arabicText}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                                Verse
                              </span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {result.surahName}
                              </span>
                              {result.surahType && (
                                <>
                                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {result.surahType}
                                  </span>
                                </>
                              )}
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                Verse {result.verseNumber}
                              </span>
                            </div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                                  {result.displayText}
                                </p>
                              </div>
                              {result.surahArabic && (
                                <div className="text-right" dir="rtl">
                                  <p className="text-lg text-gray-600 dark:text-gray-400">
                                    {result.surahArabic}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {/* Popular Content - Enhanced with Drag Scrolling */}
        {showPopular && !showSearchResults && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-[300] backdrop-blur-sm"
              onClick={() => setShowPopular(false)}
            />
            
            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-600 w-[95vw] max-w-lg sm:max-w-xl md:max-w-2xl z-[310] max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1.5">
                  <TrendingUpIcon className="h-5 w-5 text-cyan-500" />
                <h2 className="sm:text-[15px] font-semibold font-poppins text-gray-600 dark:text-[#95959b]">Popular</h2>
              </div>
              <button
                onClick={() => setShowPopular(false)}
                className="text-[#323A3F] dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3">
              <h3 className="text-base font-medium font-poppins text-gray-900 dark:text-white">
                Chapters and Verses
              </h3>

              {/* Loading State */}
              {isLoadingPopular && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading popular content...</p>
                </div>
              )}

              {/* Error State */}
              {popularError && (
                <div className="text-center py-4">
                  <p className="text-red-500 dark:text-red-400">{popularError}</p>
                </div>
              )}

              {/* Popular Chapters with Drag Scrolling */}
              {!isLoadingPopular && !popularError && (
                <>
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-2.5 mb-3 overflow-x-auto scrollbar-hide pr-3 border-b border-gray-200 dark:border-gray-700 pb-2.5 cursor-grab"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {popularChapters.map((chapter, index) => (
                      <button
                        key={`${chapter.id ?? chapter.chapter_id}-${index}`}
                        type="button"
                        onClick={(e) => handleChapterClick(chapter, e)}
                        className="inline-flex font-poppins items-center space-x-2.5 px-3.5 py-2.5 bg-[#D8D8D8] dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-xs sm:text-sm text-gray-700 flex-shrink-0 min-w-fit shadow pointer-events-auto"
                        style={index === popularChapters.length - 1 ? { marginRight: "1rem" } : {}}
                        title={`${chapter.translated_name || chapter.name} - ${chapter.verses} (${chapter.type})`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            {chapter.id}. {chapter.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chapter.verses} • {chapter.type}
                          </span>
                        </div>
                        <ChevronRightIcon className="h-3.5 w-3.5 ml-1.5" />
                      </button>
                    ))}
                  </div>
                  
          
                </>
              )}

            </div>
          </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-4xl px-2">
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 w-full">
          <button
            type="button"
            onClick={handleContinueReading}
            disabled={!lastReading}
            title={
              lastReading
                ? "Jump back to your last reading session"
                : "Start reading any Surah to enable this shortcut"
            }
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] text-[#62C3DC] dark:text-cyan-200 rounded-full shadow-md transition-all duration-200 text-sm hover:bg-[#62C3DC] hover:text-white hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none dark:hover:bg-[#3FA6C0] dark:hover:text-white [&_svg]:transition-colors [&_svg]:duration-200 [&:hover_svg]:text-white"
          >
            <Play className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap font-poppins">Continue Reading</span>
          </button>

          <button
            onClick={handleBookmarkClick}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] text-[#62C3DC] dark:text-cyan-200 rounded-full shadow-md transition-all duration-200 text-sm hover:bg-[#62C3DC] hover:text-white hover:shadow-lg flex-shrink-0 dark:hover:bg-[#3FA6C0] dark:hover:text-white [&_svg]:transition-colors [&_svg]:duration-200 [&:hover_svg]:text-white"
          >
            <BookmarkIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap font-poppins">Bookmarks</span>
          </button>

          <button
            onClick={() => {
              setShowPopular(true);
              if (popularChapters.length === 0 && !isLoadingPopular) {
                fetchPopularData();
              }
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] text-[#62C3DC] dark:text-cyan-200 rounded-full shadow-md transition-all duration-200 text-sm hover:bg-[#62C3DC] hover:text-white hover:shadow-lg flex-shrink-0 dark:hover:bg-[#3FA6C0] dark:hover:text-white [&_svg]:transition-colors [&_svg]:duration-200 [&:hover_svg]:text-white"
          >
            <TrendingUpIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap font-poppins">Popular</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomepageSearch;