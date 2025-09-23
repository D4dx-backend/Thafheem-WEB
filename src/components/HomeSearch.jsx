import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import { Play } from "lucide-react";
import ForwardIcon from "../assets/forward.png";
import { searchQuran, fetchPopularChapters } from "../api/apifunction";

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

const HomepageSearch = () => {
  const [showPopular, setShowPopular] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [popularChapters, setPopularChapters] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [popularError, setPopularError] = useState(null);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Preload popular data when component mounts
  useEffect(() => {
    fetchPopularData();
  }, []);

  // Mouse/Touch event handlers for drag scrolling
  const handleMouseDown = (e) => {
    isDragging.current = true;
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
    startX.current = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
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

  // Handle search input changes
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 1) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const searchResults = await searchQuran(query.trim(), 'en');
      
      const combinedResults = [
        ...searchResults.surahs.map(surah => ({
          type: 'surah',
          data: surah,
          displayText: `${surah.number}. ${surah.name}`,
          subText: `${surah.ayahs} verses • ${surah.type}`,
          arabicText: surah.arabic
        })),
        ...searchResults.verses.slice(0, 10).map(verse => ({
          type: 'verse',
          data: verse,
          displayText: verse.text || verse.translated_text || 'Verse text not available',
          subText: `Surah ${verse.verse_key.split(':')[0]}:${verse.verse_key.split(':')[1]}`,
          verse_key: verse.verse_key,
          // Enhanced verse information
          surahName: verse.surahInfo?.name || verse.chapter?.name_simple || `Surah ${verse.verse_key.split(':')[0]}`,
          surahArabic: verse.surahInfo?.arabic || '',
          verseNumber: verse.verse_key.split(':')[1],
          surahNumber: verse.verse_key.split(':')[0],
          surahType: verse.surahInfo?.type || '',
          highlighted_text: verse.highlighted_text
        }))
      ];

      setSearchResults(combinedResults.slice(0, 12)); // Increased to show more results
      setShowSearchResults(true);
    } catch (error) {
      setSearchError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result click
  const handleSearchResultClick = (result) => {
    if (result.type === 'surah') {
      navigate(`/surah/${result.data.number}`);
    } else if (result.type === 'verse' || result.type === 'verse_reference') {
      const surahNumber = result.verse_key.split(':')[0];
      const verseNumber = result.verse_key.split(':')[1];
      
      navigate(`/surah/${surahNumber}`, {
        state: { 
          highlightVerse: result.verse_key,
          scrollToVerse: verseNumber
        }
      });
    }
    
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      handleSearchResultClick(searchResults[0]);
    }
  };

  const handleBookmarkClick = () => {
    navigate("/bookmarkedverses");
  };

  // Close search results when clicking outside
  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  // Handle chapter button click (prevent drag from triggering click)
  const handleChapterClick = (chapterId, e) => {
    // Only navigate if we're not dragging
    if (!isDragging.current) {
      navigate(`/surah/${chapterId}`);
      setShowPopular(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 py-6 sm:py-8 lg:py-12">
      {/* Banner Section */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mb-6 sm:mb-8 mx-auto">
        <img
          src={banner}
          alt="Banner"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Logo Section */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-8 sm:mb-10 mx-auto">
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 rounded-lg flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-full object-contain p-2"
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
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowSearchResults(true);
              }
            }}
            placeholder="Search surahs, verses, or try '2:255' for specific verses..."
            className="w-full h-[49px] pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] dark:border-gray-600 dark:text-white shadow-sm text-gray-700 placeholder-gray-400 text-base"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button 
              type="button"
              className="text-gray-400 dark:text-white hover:text-cyan-500 transition-colors"
            >
              <MicIcon className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute top-[100%] left-0 mt-2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 w-full max-w-xl sm:max-w-2xl md:max-w-3xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium font-poppins text-gray-900 dark:text-white">
                  Search Results
                </h3>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-gray-500 dark:text-white hover:text-gray-700 transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

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
                  {/* Show result count */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Found {searchResults.filter(r => r.type === 'surah').length} surahs and {searchResults.filter(r => r.type === 'verse').length} verses
                  </div>
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${index}`}
                      onClick={() => handleSearchResultClick(result)}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      {result.type === 'surah' ? (
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
        )}

        {/* Popular Content - Enhanced with Drag Scrolling */}
        {showPopular && !showSearchResults && (
          <div className="absolute top-[100%] left-0 mt-2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 w-full max-w-xl sm:max-w-2xl md:max-w-3xl z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUpIcon className="h-5 w-5 text-cyan-500" />
                <h2 className="sm:text-[16px] font-normal font-poppins text-gray-500 dark:text-[#95959b]">Popular</h2>
              </div>
              <button
                onClick={() => setShowPopular(false)}
                className="text-[#323A3F] dark:text-white transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-medium font-poppins text-gray-900 mb-4 dark:text-white">
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
                    className="flex gap-3 mb-4 overflow-x-auto scrollbar-hide pr-4 border-b border-gray-200 dark:border-gray-700 pb-3 cursor-grab"
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
                        key={`${chapter.id}-${index}`}
                        onClick={(e) => handleChapterClick(chapter.id, e)}
                        className="inline-flex font-poppins items-center space-x-2 px-4 py-3 bg-[#D8D8D8] dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700 flex-shrink-0 min-w-fit shadow-sm pointer-events-auto"
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
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </button>
                    ))}
                  </div>
                  
          
                </>
              )}

              {/* Listen to Quran Tajwid */}
              <div className="flex flex-col items-center dark:bg-[#2A2C38] rounded-lg py-4 text-center">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-8 rounded-full">
                    <img src={ForwardIcon} alt="Forward" className="w-[85px] h-[18px] object-contain" />
                  </div>
                  <h4 className="font-medium font-poppins text-black dark:text-white text-base">
                    Listen to Quran Tajwid
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-4xl px-2">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
          <div className="flex w-full justify-center gap-3 sm:w-auto sm:gap-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm">
              <Play className="h-4 w-4 fill-current text-[#3FA6C0]" />
              <span className="font-medium whitespace-nowrap font-poppins">Continue Reading</span>
            </button>

            <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm">
              <ListIcon className="h-4 w-4 text-[#3FA6C0]" />
              <span className="font-medium whitespace-nowrap font-poppins">Navigate Quran</span>
            </button>
          </div>

          <button onClick={handleBookmarkClick} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm flex-shrink-0">
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
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm flex-shrink-0"
          >
            <TrendingUpIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap font-poppins">Popular</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomepageSearch;