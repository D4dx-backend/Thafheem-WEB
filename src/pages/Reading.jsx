import { Share2, Bookmark, Play, Heart, Info, LibraryBig, Notebook } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import { ChevronLeft, ChevronRight, ArrowUp, X } from "lucide-react";
import Bismi from "../assets/bismi.jpg";
import { useTheme } from "../context/ThemeContext";
import { surahNameUnicodes } from '../components/surahNameUnicodes';
import { fetchArabicVersesWithPage } from '../api/apifunction';
import { useSurahData } from '../hooks/useSurahData';

const Reading = () => {
  const { surahId } = useParams();
  const navigate = useNavigate();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  
  // Use cached surah data
  const { surahs } = useSurahData();

  // Fetch surah data and first page
  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to first page when surah changes
        
        const currentSurahId = surahId || 2;
        
        // Fetch verses with pagination
        const versesData = await fetchArabicVersesWithPage(currentSurahId, 1);
        
        setVerses(versesData.verses);
        setPagination(versesData.pagination);
        
        // Get surah info from cached data
        if (surahs.length > 0) {
          setSurahInfo(surahs.find(s => s.number === parseInt(currentSurahId)));
        }
        
      } catch (err) {
        console.error('Error fetching surah data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahData();
  }, [surahId, surahs]);

  // Fetch specific page data
  const fetchPage = async (pageNumber) => {
    try {
      setPageLoading(true);
      setError(null);
      
      const currentSurahId = surahId || 2;
      const versesData = await fetchArabicVersesWithPage(currentSurahId, pageNumber);
      
      setVerses(versesData.verses);
      setPagination(versesData.pagination);
      setCurrentPage(pageNumber);
      
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error('Error fetching page data:', err);
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  // Navigation functions
  const handlePreviousSurah = () => {
    const currentId = parseInt(surahId) || 2;
    const prevSurahId = currentId - 1;
    if (prevSurahId >= 1) {
      navigate(`/reading/${prevSurahId}`);
    }
  };

  const handleNextSurah = () => {
    const currentId = parseInt(surahId) || 2;
    const nextSurahId = currentId + 1;
    if (nextSurahId <= 114) {
      navigate(`/reading/${nextSurahId}`);
    }
  };

  const handlePreviousPage = () => {
    if (pagination && currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.total_pages) {
      fetchPage(currentPage + 1);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const toArabicNumber = (numberString) => {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return numberString.replace(/\d/g, (digit) => arabicDigits[digit]);
  };
  
  const { quranFont } = useTheme();

  return (
    <>
      <Transition showPageInfo={true} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-6 sm:py-8 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1"> 
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-xs sm:text-sm font-medium">
                    <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white"/>
                    <Link to={`/surah/${surahId || 2}`}>
                      <span className="text-xs sm:text-sm text-black dark:text-white cursor-pointer hover:underline">
                        Translation
                      </span>
                    </Link>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-gray-900 dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                    <Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white"/>
                    <span className="text-black dark:text-white">Reading</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Surah Title */}
            <div className="mb-4 sm:mb-6">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic text-gray-900 dark:text-white mb-3 sm:mb-4"
                style={{ fontFamily: 'SuraName, Amiri, serif' }}
              >
                {surahInfo ? surahInfo.arabic : 'البقرة'}
              </h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  {kabahIcon}
                </button>

                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Heart className="text-black dark:text-white w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Bismillah - only show on first page */}
              {currentPage === 1 && (
                <div className="mb-6 sm:mb-8">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-arabic dark:text-white text-gray-800 leading-relaxed px-2">
                    <img 
                      src={Bismi} 
                      alt="Bismillah" 
                      className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert" 
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading verses...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 dark:text-red-400">Error loading verses: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && verses.length > 0 && (
            <>
              <div className="flex flex-row sm:flex-row items-center justify-between mb-4">
                {/* Left side */}
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />  
                  <Link to={`/surahinfo/${surahId || 2}`}>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                      Surah info
                    </span>
                  </Link>
                </div>

                {/* Center - Page info */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <span>Page {currentPage} of {pagination.total_pages}</span>
                  </div>
                )}

                {/* Right side */}
                <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Play Audio</span>
                </button>
              </div>

              {/* Page Navigation - Top */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button 
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || pageLoading}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 
                               dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                               border border-gray-300 dark:border-gray-600 rounded-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#323A3F] rounded-lg">
                    {currentPage} / {pagination.total_pages}
                  </span>

                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage >= pagination.total_pages || pageLoading}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 
                               dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                               border border-gray-300 dark:border-gray-600 rounded-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Page Loading Indicator */}
              {pageLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Loading page...</p>
                </div>
              )}

              {/* Verses Content */}
              {/* <div className="dark:bg-black rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
  <div className="text-center">
    {verses.map((verse, index) => (
      <div key={verse.id} className="mb-4">

        <div className="p-4  rounded-lg ">
          <p 
            style={{ fontFamily: `'${quranFont}', serif` }} 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white"
          >
            {verse.text_uthmani} ﴿{toArabicNumber(verse.verse_key.split(':')[1])}﴾
          </p>
        </div>

        {(index + 1) % 10 === 0 && index < verses.length - 1 && (
          <div className="my-6 ">
            <hr className="border-gray-300 dark:border-gray-600" />
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
              Page {Math.ceil((index + 1) / 10)}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</div> */}

{/* Verses Content */}
{/* Verses Content */}
<div className="dark:bg-gray-900 rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
  <div className="text-center">
    {/* Continuous text flow */}
    <p 
      style={{ fontFamily: `'${quranFont}', serif` }} 
      className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white"
    >
      {verses.map((verse, index) => (
        <span key={verse.id}>
          {verse.text_uthmani} ﴿{toArabicNumber(verse.verse_key.split(':')[1])}﴾
          {/* Add gap between verses for better readability */}
          {index < verses.length - 1 && '   '}
          
          {/* Page Break Indicator Every 10 Verses */}
          {(index + 1) % 10 === 0 && index < verses.length - 1 && (
            <>
              <br />
              <span className="block my-3">
                <span className="block border-t border-gray-300 dark:border-gray-600 mb-2"></span>
                <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400 font-sans">
                  Verses {Math.max(1, (index + 1) - 9)} - {index + 1}
                </span>
              </span>
              <br />
            </>
          )}
        </span>
      ))}
    </p>

    {/* End of page indicator */}
    {verses.length > 0 && (
      <div className="mt-8 mb-4">
        <hr className="border-gray-300 dark:border-gray-600" />
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-4">
          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-sans">
            End of Page {currentPage} • {verses.length} verses
          </span>
        </div>
      </div>
    )}
  </div>
</div>


              {/* Page Navigation - Bottom */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button 
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1 || pageLoading}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 
                               dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                               border border-gray-300 dark:border-gray-600 rounded-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Page</span>
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#323A3F] rounded-lg">
                    {currentPage} / {pagination.total_pages}
                  </span>

                  <button 
                    onClick={handleNextPage}
                    disabled={currentPage >= pagination.total_pages || pageLoading}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 
                               dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                               border border-gray-300 dark:border-gray-600 rounded-lg
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t dark:bg-gray-900 border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8">
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
                onClick={handleScrollToTop}
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
          <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-center space-x-4 lg:space-x-6">
            <button 
              onClick={handlePreviousSurah}
              disabled={parseInt(surahId) <= 1}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Previous Surah</span>
            </button>
            <button 
              onClick={handleScrollToTop}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg"
            >
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Beginning of Surah</span>
            </button>
            <button 
              onClick={handleNextSurah}
              disabled={parseInt(surahId) >= 114}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 
                         dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Surah</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reading;