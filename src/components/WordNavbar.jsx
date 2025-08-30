import React from 'react';
import { ChevronDown, Grid3X3, Bookmark, Share2, X, ChevronLeft, ChevronRight, Tag,BookOpen } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const WordNavbar = ({ onClose }) => {
  
  return (
    <div className="bg-white border-b dark:bg-[#2A2C38] border-gray-200 max-w-4xl mx-auto">
      {/* Main Navigation Bar */ }
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Dropdowns */}
        <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3D464B] rounded-lg transition-colors">
  <span className="text-sm font-medium">2 - Al-Baqarah</span>
  <ChevronDown size={16} />

</button>


          <button  className="flex items-center space-x-2 rounded-lg px-4 py-2 bg-[#EBEEF0] text-gray-700 dark:text-white hover:text-gray-900 transition-colors">
            <span className="text-sm font-medium">1</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Right Section - Action Icons */}
        <div className="flex items-center space-x-3">
  {/* Open Book (active state with teal color) */}
  <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-teal-500 transition-colors">
    <BookOpen size={22} className="text-teal-500" />
  </button>

  {/* Bookmark */}
  <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
    <Bookmark size={22} />
  </button>

  {/* Share */}
  <button className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
    <Share2 size={22} />
  </button>

  {/* Close (inside light gray circle) */}
  <button
   className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
    <X size={20} className="text-black dark:text-white" />
  </button>
</div>

      </div>

      {/* Sub Navigation with Image */}
      <div className="flex items-center justify-center py-2 bg-gray-50 dark:bg-[#2A2C38] border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={16} />
          </button>
          
         
          
          <span className="text-sm text-gray-500 dark:text-white">click to navigate</span>
          
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordNavbar;