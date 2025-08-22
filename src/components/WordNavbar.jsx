import React from 'react';
import { ChevronDown, Grid3X3, Bookmark, Share2, X, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

const WordNavbar = () => {
  return (
    <div className="bg-white border-b border-gray-200 max-w-4xl mx-auto">
      {/* Main Navigation Bar */ }
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Dropdowns */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
            <span className="text-sm font-medium">2- Al-Baqarah</span>

          </button>
          
          <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
            <span className="text-sm font-medium">1</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Right Section - Action Icons */}
        <div className="flex items-center space-x-3">
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <Grid3X3 size={20} />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <Bookmark size={20} />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Sub Navigation with Image */}
      <div className="flex items-center justify-center py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={16} />
          </button>
          
         
          
          <span className="text-sm text-gray-500">click to navigate</span>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordNavbar;