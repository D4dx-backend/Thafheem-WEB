import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Bookmark,
  Share2,
  BookOpen,

  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WordNavbar = ({
  surahId,
  selectedVerse,
  surahInfo,
  onNavigate,
  onClose,
  onShowAyahModal,
}) => {
  const [visible, setVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="bg-white dark:bg-[#2A2C38] px-3 sm:px-4 py-3 space-y-3 relative">
      {/* Mobile Close Button - Positioned absolute on mobile */}
      <button
        className="absolute top-2 right-2 sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors bg-white dark:bg-gray-600 shadow-sm z-10"
        title="Close"
        onClick={() => navigate(-1)}
      >
        <X className="w-4 h-4 text-gray-600 dark:text-white" />
      </button>

      {/* First Row - Chapter/Verse Selectors and Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left side - Chapter and Verse Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-3 pr-12 sm:pr-0">
          {/* Chapter Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
              <span>
                {surahId
                  ? `${surahId} - ${surahInfo?.name || "Loading..."}`
                  : "Select Surah"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
          </div>

          {/* Verse Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
              <span>{selectedVerse || "1"}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Right side - Action buttons (Desktop only close button) */}
        <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-auto">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy"
          >
            <Copy className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Ayah Details"
            onClick={() => onShowAyahModal && onShowAyahModal(selectedVerse)}
          >
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Bookmark"
          >
            <Bookmark className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {/* Desktop Close Button */}
          {onClose && (
            <button
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-white"
              title="Close"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Second Row - Language Selector and Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Center - Navigation */}
   
        <div className="relative">
            <button className="flex font-poppins items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
          </div>
        {/* Right side - Empty space for alignment */}
        <div className="hidden sm:block w-[140px]"></div>
      </div>
    </div>
  );
};

export default WordNavbar;
