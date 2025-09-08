// import React, { useState } from 'react';
// import { ChevronDown, ChevronLeft, ChevronRight, Copy, Bookmark, Share2, X } from 'lucide-react';
// import { useNavigate } from "react-router-dom";
// const AyathNavbar = () => {
//   const [visible, setVisible] = useState(true);
//   const [selectedChapter, setSelectedChapter] = useState('2- Al-Baqarah');
//   const [selectedVerse, setSelectedVerse] = useState('1');
//   const [selectedLanguage, setSelectedLanguage] = useState('English');
//   const navigate = useNavigate();
//   if (!visible) return null;
//   return (
//     <div className="bg-white  dark:bg-[#2A2C38]  px-4 py-3 space-y-3">
//       {/* First Row - Chapter/Verse Selectors and Action Buttons */}
//       <div className="flex items-center justify-between">
//         {/* Left side - Chapter and Verse Dropdowns */}
//         <div className="flex items-center space-x-3">
//           {/* Chapter Selector */}
//           <div className="relative">
//             <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] hover:bg-gray-200 rounded-lg text-sm font-medium  text-gray-700 transition-colors">
//               <span>{selectedChapter}</span>
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </div>

//           {/* Verse Selector */}
//           <div className="relative">
//             <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100  dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
//               <span>{selectedVerse}</span>
//               <ChevronDown className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Right side - Action buttons */}
//         <div className="flex items-center space-x-2">
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Copy">
//             <Copy className="w-5 h-5 text-blue-500" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bookmark">
//             <Bookmark className="w-5 h-5 text-gray-600" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
//             <Share2 className="w-5 h-5 text-gray-600" />
//           </button>
//           <button
//   className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:bg-white"
//   title="Close"
//   onClick={() => navigate(-1)}
// >
//   <X className="w-5 h-5 text-gray-600" />
// </button>
//         </div>
//       </div>

//       {/* Second Row - Language Selector and Navigation */}
//       <div className="flex items-center justify-between">
//         {/* Left side - Language Selector */}
//         <div className="relative">
//           <button className="flex items-center space-x-2 px-4 py-2 dark:bg-[#323A3F] dark:text-white dark:hover:bg-[#323A3F] bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
//             <span>{selectedLanguage}</span>
//             <ChevronDown className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Center - Navigation */}
//         <div className="flex items-center space-x-4">
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <ChevronLeft className="w-5 h-5 text-gray-600" />
//           </button>
//           <span className="text-sm text-gray-500 font-medium dark:text-white">click to navigate</span>
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <ChevronRight className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Right side - Empty space for alignment */}
//         <div className="w-[140px]"></div>
//       </div>
//     </div>
//   );
// };

// export default AyathNavbar;
// import React, { useState } from 'react';
// import { ChevronDown, ChevronLeft, ChevronRight, Copy, Bookmark, Share2, X } from 'lucide-react';
// import { useNavigate } from "react-router-dom";

// const AyathNavbar = () => {
//   const [visible, setVisible] = useState(true);
//   const [selectedChapter, setSelectedChapter] = useState('2- Al-Baqarah');
//   const [selectedVerse, setSelectedVerse] = useState('1');
//   const [selectedLanguage, setSelectedLanguage] = useState('English');
//   const navigate = useNavigate();

//   if (!visible) return null;

//   return (
//     <div className="bg-white dark:bg-[#2A2C38] px-3 sm:px-4 py-3 space-y-3 relative">
//       {/* Mobile Close Button - Positioned absolute on mobile */}
//       <button
//         className="absolute top-2 right-2 sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors bg-white dark:bg-gray-600 shadow-sm z-10"
//         title="Close"
//         onClick={() => navigate(-1)}
//       >
//         <X className="w-4 h-4 text-gray-600 dark:text-white" />
//       </button>

//       {/* First Row - Chapter/Verse Selectors and Action Buttons */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
//         {/* Left side - Chapter and Verse Dropdowns */}
//         <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-3 pr-12 sm:pr-0">
//           {/* Chapter Selector */}
//           <div className="relative">
//             <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
//               <span>{selectedChapter}</span>
//               <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
//             </button>
//           </div>

//           {/* Verse Selector */}
//           <div className="relative">
//             <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
//               <span>{selectedVerse}</span>
//               <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
//             </button>
//           </div>
//         </div>

//         {/* Right side - Action buttons (Desktop only close button) */}
//         <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-auto">
//           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Copy">
//             <Copy className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Bookmark">
//             <Bookmark className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
//           </button>
//           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Share">
//             <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
//           </button>
//           {/* Desktop Close Button */}
//           <button
//             className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-white"
//             title="Close"
//             onClick={() => navigate(-1)}
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Second Row - Language Selector and Navigation */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
//         {/* Left side - Language Selector */}
//         <div className="relative">
//           <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
//             <span>{selectedLanguage}</span>
//             <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
//           </button>
//         </div>

//         {/* Center - Navigation */}
//         <div className="flex items-center space-x-3 sm:space-x-4">
//           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//             <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
//           </button>
//           <span className="text-xs sm:text-sm text-gray-500 font-medium dark:text-white text-center">
//             click to navigate
//           </span>
//           <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
//             <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
//           </button>
//         </div>

//         {/* Right side - Empty space for alignment */}
//         <div className="hidden sm:block w-[140px]"></div>
//       </div>
//     </div>
//   );
// };

// export default AyathNavbar;





import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Copy, Bookmark, Share2, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const AyathNavbar = () => {
  const [visible, setVisible] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState('2- Al-Baqarah');
  const [selectedVerse, setSelectedVerse] = useState('1');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
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

      {/* First Row - Chapter/Verse Selectors and Close Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left side - Chapter and Verse Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-3 pr-12 sm:pr-0">
          {/* Chapter Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
              <span>{selectedChapter}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
          </div>

          {/* Verse Selector */}
          <div className="relative">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
              <span>{selectedVerse}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Right side - Desktop Close Button */}
        <div className="hidden sm:flex items-center">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-white"
            title="Close"
            onClick={() => navigate(-1)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Second Row - Language Selector and Action Icons */}
   {/* Second Row - Language Selector + Action Icons (Same Row) */}
<div className="flex flex-row items-center justify-between gap-3 sm:gap-0">
  {/* Left side - Language Selector */}
  <div className="relative">
    <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors">
      <span>{selectedLanguage}</span>
      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
    </button>
  </div>

  {/* Right side - Action Icons */}
  <div className="flex items-center space-x-1 sm:space-x-2">
    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Copy">
      <Copy className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" />
    </button>
    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Bookmark">
      <Bookmark className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
    </button>
    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Share">
      <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
    </button>
  </div>
</div>

    </div>
  );
};

export default AyathNavbar;

