import { useState } from "react";
import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ForwardIcon from "../assets/forward.png"
// Icon components using inline SVG
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

const PlayIcon = ({ className }) => (
  <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M10 6.5L8 8v8l2 1.5h4L16 16V8l-2-1.5H10z" />
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const BookmarkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
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

const HomepageSearch = () => {
  const [showPopular, setShowPopular] = useState(false);

  // Popular chapters data
  const popularChapters = [
    { id: 67, name: "Al-Mulk", verses: "30 verses" },
    { id: 2, name: "Al-Baqarah", verses: "285-286" },
    { id: 1, name: "Al-Fatiha", verses: "7 verses" },
    { id: 18, name: "Al-Kahf", verses: "110 verses" },
    { id: 67, name: "Al-Baqarah 285-286", verses: "83 verses" },
  ];
  const navigate = useNavigate();

  const handleBookmarkClick = () => {
    navigate("/bookmarkedverses");
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
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 0 rounded-lg flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-full object-contain p-2"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-8 sm:mb-10 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-white" />
          </div>
          <input
            type="text"
            placeholder="Search the Quran..."
            className="w-full f-[49px] pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] dark:border-gray-600 dark:text-white shadow-sm text-gray-700 placeholder-gray-400 text-base"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button className="text-gray-400 dark:text-white hover:text-cyan-500 transition-colors">
              <MicIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Popular Content - Shows below search bar */}
        {showPopular && (
          <div className="absolute top-[100%] left-0 mt-2 bg-white dark:bg-[#2A2C38] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-6 w-full max-w-xl sm:max-w-2xl md:max-w-3xl z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUpIcon className="h-5 w-5 text-cyan-500" />
                <h2 className="sm:text-[16px] font-normal font-poppins text-gray-500 dark:text-[#95959b]">Popular</h2>
              </div>
              <button
                onClick={() => setShowPopular(false)}
                className="text-[#323A3F]  dark:text-white  transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-medium font-poppins text-gray-900 mb-4 dark:text-white">
                Chapters and Verses
              </h3>

              {/* Popular Chapters */}
              <div className="flex  gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-4 border-b border-gray-200 dark:border-gray-700 pb-3">
  {popularChapters.map((chapter, index) => (
    <button
      key={index}
      className="inline-flex font-poppins sm:text-[12px] items-center space-x-2 px-4 py-2 bg-[#D8D8D8] dark:bg-black dark:text-white dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-colors text-sm text-gray-700 flex-shrink-0"
      style={index === popularChapters.length - 1 ? { marginRight: "1rem" } : {}}
    >
      <span>
        {chapter.id}. {chapter.name}
      </span>
      <ChevronRightIcon className="h-4 w-4" />
    </button>
  ))}
</div>


              {/* Listen to Quran Tajwid */}
             
<div className="flex flex-col items-center dark:bg-[#2A2C38]  rounded-lg py-4 text-center">
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
    {/* Group Continue Reading + Navigate Quran */}
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

    {/* Bookmarks */}
    <button   onClick={handleBookmarkClick} className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm flex-shrink-0">
      <BookmarkIcon className="h-4 w-4 text-[#3FA6C0]" />
      <span className="font-medium whitespace-nowrap font-poppins">Bookmarks</span>
    </button>

    {/* Popular */}
    <button
      onClick={() => setShowPopular(true)}
      className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-[#62C3DC] dark:text-cyan-200 text-sm flex-shrink-0"
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