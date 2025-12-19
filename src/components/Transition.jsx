import { ChevronDown, BookOpen, Notebook, Info, Play, Pause, Heart, LibraryBig, Check } from "lucide-react"; // swapped icons
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import NavigateSurah from "../pages/NavigateSurah";
import { fetchPageRanges, fetchAyaRanges } from "../api/apifunction";
import { PAGE_RANGES_API } from "../api/apis";
import { useSurahData } from "../hooks/useSurahData";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import BookmarkService from "../services/bookmarkService";
import SurahInfoModal from "./SurahInfoModal";

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

const Transition = ({ showPageInfo = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);
  const [selectedSurah, setSelectedSurah] = useState({
    id: 2,
    name: "Al-Baqarah",
    type: "Madani",
  });
  const [currentPage, setCurrentPage] = useState(2);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [verseCount, setVerseCount] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showSurahInfoModal, setShowSurahInfoModal] = useState(false);
  // Block range dropdown state (only for blockwise pages)
  const [blockRanges, setBlockRanges] = useState([]);
  const [showBlockRangeDropdown, setShowBlockRangeDropdown] = useState(false);
  const [currentVisibleBlock, setCurrentVisibleBlock] = useState(null);
  const blockRangeDropdownRef = useRef(null);

  // Ayah dropdown state (only for ayahwise pages)
  const [showAyahDropdown, setShowAyahDropdown] = useState(false);
  const [currentVisibleAyah, setCurrentVisibleAyah] = useState(null);
  const ayahDropdownRef = useRef(null);

  // Page dropdown state (only for reading pages)
  const [showPageDropdown, setShowPageDropdown] = useState(false);
  const [currentVisiblePage, setCurrentVisiblePage] = useState(null);
  const [surahPageNumbers, setSurahPageNumbers] = useState([]);
  const pageDropdownRef = useRef(null);

  const { surahId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translationLanguage } = useTheme();
  const { surahs: surahNames, loading: surahNamesLoading } = useSurahData(translationLanguage);
  
  // Check if we're on a blockwise page
  const isBlockwisePage = location.pathname.startsWith('/blockwise');
  
  // Check if we're on an ayahwise page (surah page, not blockwise or reading)
  const isAyahwisePage = location.pathname.startsWith('/surah') && !location.pathname.startsWith('/surah/all');
  
  // Check if we're on a reading page
  const isReadingPage = location.pathname.startsWith('/reading');

  const getSurahIdFromPath = () => {
    const match = location?.pathname?.match(/\/(surah|reading|blockwise)\/(\d+)/);
    return match ? parseInt(match[2]) : undefined;
  };

  const [activeView, setActiveView] = useState("book"); // "book" or "notebook"
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalRoot(document.body);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedButton = dropdownRef.current?.contains(event.target);
      const clickedDropdown = dropdownContentRef.current?.contains(event.target);

      if (isDropdownOpen && !clickedButton && !clickedDropdown) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  // Update selected surah based on URL when surahNames are loaded
  useEffect(() => {
    if (surahNames.length > 0) {
      // Update selected surah based on current URL (supports navbar scope)
      const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
      if (effectiveId) {
        const currentSurah = surahNames.find(s => s.number === effectiveId);
        if (currentSurah) {
          setSelectedSurah({
            id: currentSurah.number,
            name: currentSurah.name,
            type: currentSurah.type
          });
        }
      }
    }
  }, [surahId, location.pathname, surahNames]);

  // Calculate page number and verse count based on surah using page ranges API
  useEffect(() => {
    const calculatePageNumberAndVerseCount = async () => {
      const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
      if (effectiveId && surahNames.length > 0) {
        try {
          const surahIdNum = effectiveId;
          
          // Fetch page ranges to get accurate page information
          const pageRanges = await fetchPageRanges();
          
          if (pageRanges && pageRanges.length > 0) {
            // Find the first page range for this surah
            const surahPageRange = pageRanges.find(range => 
              range.SuraId === surahIdNum
            );
            
            if (surahPageRange) {
              setCurrentPage(surahPageRange.PageId);
            } else {
              // Fallback calculation if no page range found
              const pageNumber = Math.max(1, Math.min(604, surahIdNum + 1));
              setCurrentPage(pageNumber);
            }

            // Calculate verse count for reading page
            if (location.pathname.startsWith('/reading')) {
              const surahRanges = pageRanges.filter(
                (range) => range.SuraId === surahIdNum
              );
              if (surahRanges.length > 0) {
                // Find the maximum ayato value for this surah
                const maxAyah = Math.max(...surahRanges.map((range) => range.ayato));
                setVerseCount(maxAyah);
                
                // Get all unique page numbers for this surah
                const uniquePages = [...new Set(surahRanges.map((range) => range.PageId))].sort((a, b) => a - b);
                setSurahPageNumbers(uniquePages);
              } else {
                // Fallback to surah names data
                const currentSurah = surahNames.find(s => s.number === surahIdNum);
                if (currentSurah && currentSurah.ayahs) {
                  setVerseCount(currentSurah.ayahs);
                }
                setSurahPageNumbers([]);
              }
            } else {
              // For non-reading pages, use surah names ayah count
              const currentSurah = surahNames.find(s => s.number === surahIdNum);
              if (currentSurah && currentSurah.ayahs) {
                setVerseCount(currentSurah.ayahs);
              }
            }
          }
        } catch (error) {
          console.error('Error calculating page number:', error);
        }
      }
    };

    calculatePageNumberAndVerseCount();
  }, [surahId, location.pathname, surahNames]);

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsFavorited(false);
        return;
      }

      const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
      if (effectiveId) {
        try {
          const favorites = await BookmarkService.getFavoriteSurahs(user.uid);
          setIsFavorited(favorites.some(fav => fav.surahId === effectiveId));
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [user, surahId, location.pathname]);

  // Listen for audio playback changes
  useEffect(() => {
    const handleAudioStateChange = (event) => {
      setIsAudioPlaying(event.detail?.isPlaying || false);
    };

    window.addEventListener('audioStateChange', handleAudioStateChange);
    return () => {
      window.removeEventListener('audioStateChange', handleAudioStateChange);
    };
  }, []);

  // Fetch block ranges when on blockwise page
  useEffect(() => {
    if (!isBlockwisePage) {
      setBlockRanges([]);
      setCurrentVisibleBlock(null);
      return;
    }

    const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
    const supportsBlockwise = translationLanguage === 'mal' || translationLanguage === 'E';
    
    if (!effectiveId || !supportsBlockwise) {
      setBlockRanges([]);
      return;
    }

    const loadBlockRanges = async () => {
      try {
        const ranges = await fetchAyaRanges(effectiveId, translationLanguage || 'mal');
        setBlockRanges(ranges || []);
      } catch (error) {
        console.error('Error fetching block ranges:', error);
        setBlockRanges([]);
      }
    };

    loadBlockRanges();
  }, [isBlockwisePage, surahId, location.pathname, translationLanguage]);

  // Track which block is currently visible (only on blockwise pages)
  useEffect(() => {
    if (!isBlockwisePage || blockRanges.length === 0) {
      return;
    }

    const handleBlockTracking = () => {
      const blocks = blockRanges.map((block) => {
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
        const element = document.getElementById(`block-${rangeKey}`);
        return { rangeKey, element, start };
      });

      // Find the block that's most visible in the viewport
      const viewportTop = window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const viewportCenter = viewportTop + window.innerHeight / 2;

      let visibleBlock = null;
      let minDistance = Infinity;

      blocks.forEach(({ rangeKey, element, start }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height / 2;

          // Check if block is in viewport
          if (elementTop <= viewportBottom && elementBottom >= viewportTop) {
            const distance = Math.abs(elementCenter - viewportCenter);
            if (distance < minDistance) {
              minDistance = distance;
              visibleBlock = rangeKey;
            }
          }
        }
      });

      if (visibleBlock) {
        setCurrentVisibleBlock(visibleBlock);
      }
    };

    window.addEventListener('scroll', handleBlockTracking, { passive: true });
    // Initial check
    handleBlockTracking();
    return () => window.removeEventListener('scroll', handleBlockTracking);
  }, [isBlockwisePage, blockRanges]);

  // Clear page numbers when not on reading page
  useEffect(() => {
    if (!isReadingPage) {
      setSurahPageNumbers([]);
      setCurrentVisiblePage(null);
      setShowPageDropdown(false);
    }
  }, [isReadingPage]);

  // Track which page is currently visible (only on reading pages)
  useEffect(() => {
    if (!isReadingPage || surahPageNumbers.length === 0) {
      setCurrentVisiblePage(null);
      return;
    }

    const handlePageTracking = () => {
      const viewportTop = window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const viewportCenter = viewportTop + window.innerHeight / 2;

      let visiblePage = null;
      let minDistance = Infinity;

      // Check all pages for this surah
      surahPageNumbers.forEach((pageNum) => {
        const element = document.getElementById(`page-${pageNum}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height / 2;

          // Check if page is in viewport
          if (elementTop <= viewportBottom && elementBottom >= viewportTop) {
            const distance = Math.abs(elementCenter - viewportCenter);
            if (distance < minDistance) {
              minDistance = distance;
              visiblePage = pageNum;
            }
          }
        }
      });

      if (visiblePage) {
        setCurrentVisiblePage(visiblePage);
      }
    };

    window.addEventListener('scroll', handlePageTracking, { passive: true });
    // Initial check
    handlePageTracking();
    return () => {
      window.removeEventListener('scroll', handlePageTracking);
    };
  }, [isReadingPage, surahPageNumbers]);

  // Track which ayah is currently visible (only on ayahwise pages)
  useEffect(() => {
    if (!isAyahwisePage || !verseCount) {
      setCurrentVisibleAyah(null);
      return;
    }

    const handleAyahTracking = () => {
      // First check if there's a hash in the URL
      const hash = window.location.hash;
      if (hash && hash.startsWith("#verse-")) {
        const hashAyah = parseInt(hash.replace("#verse-", ""), 10);
        if (!isNaN(hashAyah) && hashAyah >= 1 && hashAyah <= verseCount) {
          setCurrentVisibleAyah(hashAyah);
          return;
        }
      }

      // Otherwise, find the most visible ayah in viewport
      const viewportTop = window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const viewportCenter = viewportTop + window.innerHeight / 2;

      let visibleAyah = null;
      let minDistance = Infinity;

      // Check all ayahs from 1 to verseCount
      for (let ayahNum = 1; ayahNum <= verseCount; ayahNum++) {
        const element = document.getElementById(`verse-${ayahNum}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const elementCenter = elementTop + rect.height / 2;

          // Check if ayah is in viewport
          if (elementTop <= viewportBottom && elementBottom >= viewportTop) {
            const distance = Math.abs(elementCenter - viewportCenter);
            if (distance < minDistance) {
              minDistance = distance;
              visibleAyah = ayahNum;
            }
          }
        }
      }

      if (visibleAyah) {
        setCurrentVisibleAyah(visibleAyah);
      }
    };

    window.addEventListener('scroll', handleAyahTracking, { passive: true });
    window.addEventListener('hashchange', handleAyahTracking);
    // Initial check
    handleAyahTracking();
    return () => {
      window.removeEventListener('scroll', handleAyahTracking);
      window.removeEventListener('hashchange', handleAyahTracking);
    };
  }, [isAyahwisePage, verseCount]);

  // Close block range dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blockRangeDropdownRef.current && !blockRangeDropdownRef.current.contains(event.target)) {
        setShowBlockRangeDropdown(false);
      }
    };

    if (showBlockRangeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showBlockRangeDropdown]);

  // Close ayah dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ayahDropdownRef.current && !ayahDropdownRef.current.contains(event.target)) {
        setShowAyahDropdown(false);
      }
    };

    if (showAyahDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showAyahDropdown]);

  // Close page dropdown when clicking outside
  useEffect(() => {
    if (!showPageDropdown) return;

    const handleClickOutside = (event) => {
      // Check if the click target is inside the dropdown
      if (pageDropdownRef.current && pageDropdownRef.current.contains(event.target)) {
        // Click is inside dropdown - let the button's onClick handle it
        return;
      }

      // Click is outside - close the dropdown
      // Use a small delay to ensure button clicks inside dropdown process first
      requestAnimationFrame(() => {
        setShowPageDropdown(false);
      });
    };

    // Use 'click' event (bubbling phase) to fire after button onClick
    // This ensures button onClick handlers execute before we check for outside clicks
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPageDropdown]);

  // Function to scroll to a specific block
  const scrollToBlock = (rangeKey) => {
    const blockElement = document.getElementById(`block-${rangeKey}`);
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
      setShowBlockRangeDropdown(false);
    }
  };

  // Function to scroll to a specific page (for reading mode)
  const scrollToPage = (pageNumber, event) => {
    // Prevent event propagation to avoid conflicts with click-outside handler
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Close dropdown immediately
    setShowPageDropdown(false);

    // Use requestAnimationFrame to ensure DOM is ready and avoid blocking
    requestAnimationFrame(() => {
      const pageElement = document.getElementById(`page-${pageNumber}`);
      if (pageElement) {
        // Calculate offset to account for sticky header
        const headerOffset = 100; // Approximate header height
        const elementPosition = pageElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Use scrollTo for better control
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Highlight the page briefly
        const originalBg = pageElement.style.backgroundColor;
        pageElement.style.backgroundColor = "#fef3c7";
        setTimeout(() => {
          pageElement.style.backgroundColor = originalBg || "";
        }, 2000);
      } else {
        console.warn(`Page element with id "page-${pageNumber}" not found`);
      }
    });
  };

  // Function to scroll to a specific ayah
  const scrollToAyah = (ayahNumber) => {
    const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
    if (!effectiveId) return;

    setShowAyahDropdown(false);

    // Update URL with hash
    const targetUrl = `/surah/${effectiveId}#verse-${ayahNumber}`;
    if (window.location.pathname === `/surah/${effectiveId}`) {
      // Same page - update hash and scroll
      window.location.hash = `verse-${ayahNumber}`;
      
      // Scroll to element with retry logic
      const scrollToElement = (attempt = 1) => {
        const verseElement = document.getElementById(`verse-${ayahNumber}`);
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
        } else if (attempt < 5) {
          // Retry up to 5 times with increasing delays
          setTimeout(() => scrollToElement(attempt + 1), attempt * 100);
        }
      };
      
      // Start scrolling immediately
      requestAnimationFrame(() => {
        scrollToElement(1);
      });
    } else {
      // Different page - navigate
      navigate(targetUrl);
    }
  };

  const handleSurahSelect = (surah) => {
    const surahIdValue = surah?.number ?? surah?.id;
    if (!surahIdValue) {
      console.warn("handleSurahSelect called without a valid surah id", surah);
      return;
    }

    const matchedSurah =
      surahNames.find((s) => s.number === surahIdValue) || surah;

    setSelectedSurah({
      id: surahIdValue,
      name: matchedSurah?.name || surah.name,
      type: matchedSurah?.type || surah.type,
    });
    setIsDropdownOpen(false);

    // Navigate to the appropriate page based on current route
    if (location.pathname.startsWith('/reading')) {
      navigate(`/reading/${surahIdValue}`);
    } else if (location.pathname.startsWith('/blockwise')) {
      navigate(`/blockwise/${surahIdValue}`);
    } else {
      navigate(`/surah/${surahIdValue}`);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { type: 'warning', message: 'Please sign in to add favorites' } 
      }));
      return;
    }

    const effectiveId = surahId ? parseInt(surahId) : getSurahIdFromPath();
    if (!effectiveId) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        await BookmarkService.deleteFavoriteSurah(user.uid, effectiveId);
        setIsFavorited(false);
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { type: 'info', message: 'Surah removed from favorites' } 
        }));
      } else {
        const surahData = surahNames.find(s => s.number === effectiveId);
        await BookmarkService.addFavoriteSurah(user.uid, effectiveId, surahData?.name || `Surah ${effectiveId}`);
        setIsFavorited(true);
        window.dispatchEvent(new CustomEvent('showToast', { 
          detail: { type: 'success', message: 'Surah added to favorites' } 
        }));
      }
    } catch (error) {
      console.error("Error managing favorite:", error);
      window.dispatchEvent(new CustomEvent('showToast', { 
        detail: { type: 'error', message: 'Failed to manage favorite. Please try again.' } 
      }));
    } finally {
      setFavoriteLoading(false);
    }
  };

  const surahIcon = selectedSurah.type === "Makki" ? (
    <KaabaIcon className="w-4 h-4 text-[#3FA5C0]" />
  ) : (
    <MadinaIcon className="w-4 h-4 text-[#3FA5C0]" />
  );

  const renderActionButtons = (variant = "desktop") => {
    const isDesktop = variant === "desktop";
    const containerClasses = isDesktop
      ? "hidden sm:flex items-center ml-1 sm:ml-2 space-x-1"
      : "flex sm:hidden items-center space-x-1";
    const baseButtonClasses = isDesktop
      ? "inline-flex items-center justify-center min-h-[44px] px-1.5 text-[#2AA0BF] hover:opacity-90 dark:text-[#2AA0BF]"
      : "inline-flex items-center justify-center h-9 w-9 rounded-full text-[#2AA0BF] dark:text-[#2AA0BF] bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors";
    const playButtonClasses = isDesktop
      ? "flex items-center transition-colors text-[#2AA0BF] hover:opacity-90 dark:text-[#2AA0BF] min-h-[44px] px-1.5 relative"
      : "flex items-center justify-center h-9 w-9 rounded-full text-[#2AA0BF] dark:text-[#2AA0BF] bg-gray-50 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors relative";
    const favoriteButtonClasses = isDesktop
      ? `flex items-center justify-center transition-colors min-h-[44px] px-1.5 ${
          favoriteLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        } ${isFavorited ? "text-red-500" : "text-[#2AA0BF] dark:text-[#2AA0BF]"}`
      : `flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
          favoriteLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        } ${isFavorited ? "text-red-500 bg-red-50 dark:bg-red-900/40" : "text-[#2AA0BF] dark:text-[#2AA0BF] bg-gray-50 dark:bg-gray-800/70"} dark:hover:bg-red-900/50`;
    const iconSizeClasses = isDesktop ? "w-4 h-4 sm:w-5 sm:h-5" : "w-4 h-4";
    const playIconWrapperClasses = isDesktop
      ? "relative w-4 h-4 sm:w-5 sm:h-5"
      : "relative w-4 h-4";
    const verseCountClasses = isDesktop
      ? "flex items-center text-xs sm:text-sm text-[#2AA0BF] dark:text-[#2AA0BF] pl-1"
      : "flex items-center text-xs text-[#2AA0BF] dark:text-[#2AA0BF] pl-1";

    return (
      <div className={containerClasses}>
        <button
          onClick={() => setShowSurahInfoModal(true)}
          className={baseButtonClasses}
          aria-label="Surah info"
          title="View Surah info"
        >
          <Info className={iconSizeClasses} />
        </button>

        {(location.pathname.startsWith('/surah') ||
          location.pathname.startsWith('/reading') ||
          location.pathname.startsWith('/blockwise')) && (
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('playAudio'));
            }}
            className={playButtonClasses}
            aria-label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
            title={isAudioPlaying ? "Pause recitation audio" : "Play recitation audio"}
          >
            <div className={playIconWrapperClasses}>
              <Play
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                  isAudioPlaying ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
                }`}
              />
              <Pause
                className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                  isAudioPlaying ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
                }`}
              />
            </div>
          </button>
        )}

        {(location.pathname.startsWith('/surah') ||
          location.pathname.startsWith('/reading') ||
          location.pathname.startsWith('/blockwise')) && (
          <button
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
            className={favoriteButtonClasses}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`${iconSizeClasses} ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        )}

        {location.pathname.startsWith('/reading') && verseCount && (
          <div className={verseCountClasses}>
            <BookOpen className="h-4 w-4 flex-shrink-0 mr-1" aria-hidden="true" />
            <span>{verseCount}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-[#2A2C38] shadow-md dark:shadow-lg">
      <div className="px-2 sm:px-4 py-1">
        <div className="max-w-none w-full mx-0 py-1">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-2 min-h-[48px]">
            {/* Left Section - Chapter Selector */}
            <div className="flex items-center ml-[17px] sm:ml-[21px] justify-self-start space-x-1 sm:space-x-2">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-2 py-1 text-gray-700 dark:text-white rounded-lg transition-colors"
                >
                  <span 
                    className={`font-medium text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none ${
                      translationLanguage === 'ur' ? 'font-urdu-nastaliq' : 
                      translationLanguage === 'mal' ? 'font-malayalam' : ''
                    }`}
                    style={translationLanguage === 'mal' ? { fontFamily: "'NotoSansMalayalam'" } : {}}
                  >
                    {surahNamesLoading || surahNames.length === 0 ? '...' : selectedSurah.name}
                  </span>
                  {surahIcon}
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </button>

                {isDropdownOpen && portalRoot &&
                  createPortal(
                    <div ref={dropdownContentRef} className="fixed inset-0 z-[99990]">
                      <NavigateSurah
                        onSurahSelect={handleSurahSelect}
                        onClose={() => setIsDropdownOpen(false)}
                      />
                    </div>,
                    portalRoot
                  )
                }
              </div>

              {/* Block Range Dropdown - Only show on blockwise pages */}
              {isBlockwisePage && blockRanges.length > 0 && (
                <div className="relative" ref={blockRangeDropdownRef}>
                  <button
                    onClick={() => setShowBlockRangeDropdown(!showBlockRangeDropdown)}
                    className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors shadow-sm min-h-[36px] sm:min-h-[40px]"
                    title="Select block range"
                  >
                    <span className="whitespace-nowrap">
                      {currentVisibleBlock || ''}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform ${showBlockRangeDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showBlockRangeDropdown && (
                    <div className="absolute left-0 top-full mt-1.5 w-full min-w-[120px] sm:min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-50">
                      {blockRanges.map((block, index) => {
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
                        const isSelected = currentVisibleBlock === rangeKey;

                        return (
                          <button
                            key={`dropdown-${rangeKey}-${index}`}
                            onClick={() => scrollToBlock(rangeKey)}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="flex-1">{rangeKey}</span>
                            {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Ayah Dropdown - Only show on ayahwise pages */}
              {isAyahwisePage && verseCount && verseCount > 0 && (
                <div className="relative" ref={ayahDropdownRef}>
                  <button
                    onClick={() => setShowAyahDropdown(!showAyahDropdown)}
                    className="flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors shadow-sm min-h-[36px] sm:min-h-[40px]"
                    title="Select ayah"
                  >
                    <span className="whitespace-nowrap">
                      {currentVisibleAyah || ''}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-transform ${showAyahDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showAyahDropdown && (
                    <div className="absolute left-0 top-full mt-1.5 w-full min-w-[120px] sm:min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-50">
                      {Array.from({ length: verseCount }, (_, index) => {
                        const ayahNumber = index + 1;
                        const isSelected = currentVisibleAyah === ayahNumber;

                        return (
                          <button
                            key={`ayah-${ayahNumber}`}
                            onClick={() => scrollToAyah(ayahNumber)}
                            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="flex-1">Ayah {ayahNumber}</span>
                            {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Center Section - Translation/Reading Toggle - Only show on surah, reading, and blockwise pages */}
            <div className="flex justify-center justify-self-center">
              {(location.pathname.startsWith('/surah') ||
                location.pathname.startsWith('/reading') ||
                location.pathname.startsWith('/blockwise')) && (
                <div className="flex justify-center">
                  {/* Desktop Translation/Reading Toggle */}
                  <div className="hidden sm:flex">
                    <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const effectiveId =
                              surahId ? parseInt(surahId) : getSurahIdFromPath() || selectedSurah.id;
                            if (location.pathname.startsWith('/reading')) {
                              navigate(`/surah/${effectiveId}`);
                            }
                          }}
                          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium min-h-[40px] transition-colors ${
                            location.pathname.startsWith('/surah') ||
                            location.pathname.startsWith('/blockwise')
                              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-poppins">Translation</span>
                        </button>
                        <div className="relative" ref={pageDropdownRef}>
                          <button
                            onClick={(e) => {
                              const effectiveId =
                                surahId ? parseInt(surahId) : getSurahIdFromPath() || selectedSurah.id;
                              if (!location.pathname.startsWith('/reading')) {
                                navigate(`/reading/${effectiveId}`);
                              } else if (isReadingPage && surahPageNumbers.length > 0) {
                                // Toggle dropdown if already on reading page
                                e.stopPropagation();
                                setShowPageDropdown(!showPageDropdown);
                              }
                            }}
                            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium min-h-[40px] transition-colors ${
                              location.pathname.startsWith('/reading')
                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <Notebook className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-poppins">Reading</span>
                            {isReadingPage && currentVisiblePage && (
                              <>
                                <span className="text-xs sm:text-sm font-poppins">•</span>
                                <span className="text-xs sm:text-sm font-poppins font-semibold">{currentVisiblePage}</span>
                                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showPageDropdown ? 'rotate-180' : ''}`} />
                              </>
                            )}
                          </button>

                          {/* Page Dropdown - Only show on reading pages */}
                          {isReadingPage && showPageDropdown && surahPageNumbers.length > 0 && (
                            <div className="absolute left-0 top-full mt-1.5 w-full min-w-[120px] sm:min-w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-[100] pointer-events-auto">
                              {surahPageNumbers.map((pageNum) => {
                                const isSelected = currentVisiblePage === pageNum;

                                return (
                                  <button
                                    key={`page-${pageNum}`}
                                    onClick={(e) => scrollToPage(pageNum, e)}
                                    type="button"
                                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 pointer-events-auto ${
                                      isSelected
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    <span className="flex-1">Page {pageNum}</span>
                                    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Translation/Reading Toggle */}
                  <div className="sm:hidden">
                    <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-0.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const effectiveId =
                              surahId ? parseInt(surahId) : getSurahIdFromPath() || selectedSurah.id;
                            if (location.pathname.startsWith('/reading')) {
                              navigate(`/surah/${effectiveId}`);
                            }
                          }}
                          aria-label="Translation"
                          title="Go to translation view"
                          className={`flex items-center px-2 py-2 rounded-full min-h-[32px] transition-colors ${
                            location.pathname.startsWith('/surah') ||
                            location.pathname.startsWith('/blockwise')
                              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400'
                          }`}
                        >
                          <LibraryBig className="w-2.5 h-2.5" />
                        </button>
                        <div className="relative" ref={pageDropdownRef}>
                          <button
                            onClick={(e) => {
                              const effectiveId =
                                surahId ? parseInt(surahId) : getSurahIdFromPath() || selectedSurah.id;
                              if (!location.pathname.startsWith('/reading')) {
                                navigate(`/reading/${effectiveId}`);
                              } else if (isReadingPage && surahPageNumbers.length > 0) {
                                // Toggle dropdown if already on reading page
                                e.stopPropagation();
                                setShowPageDropdown(!showPageDropdown);
                              }
                            }}
                            aria-label="Reading"
                            title={isReadingPage && currentVisiblePage ? `Page ${currentVisiblePage}` : "Go to reading view"}
                            className={`flex items-center px-2 py-2 rounded-full min-h-[32px] transition-colors ${
                              location.pathname.startsWith('/reading')
                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400'
                            }`}
                          >
                            <Notebook className="w-2.5 h-2.5" />
                            {isReadingPage && currentVisiblePage && (
                              <>
                                <span className="ml-1 text-[10px] font-semibold">{currentVisiblePage}</span>
                                <ChevronDown className={`w-2.5 h-2.5 ml-0.5 transition-transform ${showPageDropdown ? 'rotate-180' : ''}`} />
                              </>
                            )}
                          </button>

                          {/* Page Dropdown - Mobile - Only show on reading pages */}
                          {isReadingPage && showPageDropdown && surahPageNumbers.length > 0 && (
                            <div className="absolute left-0 top-full mt-1.5 w-[140px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-[60vh] overflow-y-auto z-[100] pointer-events-auto">
                              {surahPageNumbers.map((pageNum) => {
                                const isSelected = currentVisiblePage === pageNum;

                                return (
                                  <button
                                    key={`page-mobile-${pageNum}`}
                                    onClick={(e) => scrollToPage(pageNum, e)}
                                    type="button"
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-2 pointer-events-auto ${
                                      isSelected
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    <span className="flex-1">Page {pageNum}</span>
                                    {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Surah info on the right, optional Juz/Hizb */}
            <div className="flex items-center justify-end space-x-1 sm:space-x-2 mr-1 sm:mr-4 justify-self-end">
              {showPageInfo ? (
                <div className="hidden sm:flex items-center text-sm text-gray-500">
                  <span>Juz 1 | Hizb 1</span>
                </div>
              ) : null}
              
              {renderActionButtons("mobile")}
              {renderActionButtons("desktop")}
            </div>
          </div>
        </div>
      </div>

      {/* Surah Info Modal */}
      {showSurahInfoModal && (
        <SurahInfoModal
          surahId={surahId ? parseInt(surahId) : getSurahIdFromPath() || selectedSurah.id}
          onClose={() => setShowSurahInfoModal(false)}
        />
      )}
    </div>
  );
};

export default Transition;