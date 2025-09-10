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
import { useNavigate } from "react-router-dom";

const InterpretationNavbar = ({
  interpretationNumber = 1,
  surahName = "2- Al-Baqarah",
  verseRange = "1 - 7",
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="w-full bg-white dark:bg-[#2A2C38]">
    <div className="mx-auto max-w-[1073px] border-b dark:border-gray-600">
      {/* Mobile Layout */}
      <div className="block md:hidden">
        {/* Top Row - Dropdowns and Close */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2 flex-1">
            <button className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white transition-colors">
              <span className="text-sm font-medium truncate max-w-[100px]">
                {surahName}
              </span>
              <ChevronDown size={16} />
            </button>
  
            <button className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white transition-colors">
              <span className="text-sm font-medium">{verseRange}</span>
              <ChevronDown size={16} />
            </button>
          </div>
  
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors ml-2"
          >
            <X size={20} className="text-black dark:text-white" />
          </button>
        </div>
  
        {/* Middle Row - Title + Action Icons */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-600">
          <h1 className="text-sm sm:text-lg font-medium text-[#2AA0BF]">
            Interpretation {interpretationNumber}
          </h1>
  
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <List className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <Bookmark className="w-4 h-4 sm:w-6 sm:h-6"/>
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <Share2 className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
  
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="text-sm font-medium">{surahName}</span>
              <ChevronDown size={16} />
            </button>
  
            <button className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors">
              <span className="text-sm font-medium">{verseRange}</span>
              <ChevronDown size={16} />
            </button>
          </div>
  
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium text-[#2AA0BF]">
              Interpretation {interpretationNumber}
            </h1>
          </div>
  
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <List size={20} />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <Bookmark size={20} />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              <Share2 size={20} />
            </button>
  
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors ml-2"
            >
              <X size={20} className="text-black dark:text-white" />
            </button>
          </div>
        </div>
      </div>
  
      {/* Sub Navigation */}
      <div className="flex items-center justify-center py-3 bg-gray-50 dark:bg-[#2A2C38] border-t border-gray-100 dark:border-gray-600">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronLeft size={16} />
          </button>
  
          <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
            click to navigate
          </span>
  
          <button className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default InterpretationNavbar;
