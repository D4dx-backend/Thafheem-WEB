import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Copy, Bookmark, Share2, X } from 'lucide-react';

const AyathNavbar = () => {
  const [selectedChapter, setSelectedChapter] = useState('2- Al-Baqarah');
  const [selectedVerse, setSelectedVerse] = useState('1');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  return (
    <div className="bg-white border-b dark:bg-[#2A2C38] border-gray-200 px-4 py-3 space-y-3">
      {/* First Row - Chapter/Verse Selectors and Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Left side - Chapter and Verse Dropdowns */}
        <div className="flex items-center space-x-3">
          {/* Chapter Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] hover:bg-gray-200 rounded-lg text-sm font-medium  text-gray-700 transition-colors">
              <span>{selectedChapter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Verse Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100  dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <span>{selectedVerse}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
            <Copy className="w-5 h-5 text-blue-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bookmark">
            <Bookmark className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Close">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Second Row - Language Selector and Navigation */}
      <div className="flex items-center justify-between">
        {/* Left side - Language Selector */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-4 py-2 dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 font-medium dark:text-white">click to navigate</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Right side - Empty space for alignment */}
        <div className="w-[140px]"></div>
      </div>
    </div>
  );
};

export default AyathNavbar;