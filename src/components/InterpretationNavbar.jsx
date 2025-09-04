import React from "react";
import {
  ChevronDown,
  List,
  Bookmark,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate for React Router

const InterpretationNavbar = ({
  interpretationNumber = 1,
  surahName = "2- Al-Baqarah",
  verseRange = "1 - 7",
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // ✅ Go back to previous page
  };
  // const handleClose = () => {
  //   window.close();
  // };


  return (
    <div className="bg-white border-b dark:bg-[#2A2C38] border-gray-200 dark:border-gray-600 max-w-4xl mx-auto">
      {/* Main Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 py-3 space-y-3 sm:space-y-0">
        {/* Left Section - Dropdowns */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto ">
          <button className="flex items-center space-x-1 sm:space-x-2 rounded-2xl px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white dark:hover:text-white hover:text-gray-900 transition-colors min-h-[44px] flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">
              {surahName}
            </span>
            <ChevronDown size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
          </button>

          <button className="flex items-center space-x-1 sm:space-x-2 rounded-2xl px-4 py-2 bg-[#EBEEF0] text-black dark:bg-[#323A3F] dark:text-white dark:hover:text-white hover:text-gray-900 transition-colors min-h-[44px] flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium">{verseRange}</span>
            <ChevronDown size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
          </button>
        </div>

        {/* Center Section - Title */}
        <div className="flex-1 text-center w-full sm:w-auto order-first sm:order-none">
          <h1 className="text-base sm:text-lg font-medium text-[#2AA0BF]">
            Interpretation {interpretationNumber}
          </h1>
        </div>

        {/* Right Section - Action Icons */}
        <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end">
          <button className="p-2 text-gray-600 dark:text-white dark:hover:text-white hover:text-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <List size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-white dark:hover:text-white hover:text-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Bookmark size={18} className="sm:w-5 sm:h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-white dark:hover:text-white hover:text-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <Share2 size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white dark:hover:bg-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X size={18} className="text-black dark:text-black" />
          </button>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center justify-center py-2 bg-gray-50 dark:bg-[#2A2C38] ">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
          </button>

          <span className="text-xs sm:text-sm text-gray-500 dark:text-white px-2">
            click to navigate
          </span>

          <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterpretationNavbar;
