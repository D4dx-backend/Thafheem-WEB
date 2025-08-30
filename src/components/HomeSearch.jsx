// import {
//   Search,
//   Mic,
//   Play,
//   List,
//   Bookmark,
//   TrendingUp,
//   X,
//   ChevronRight,
// } from "lucide-react";
// import { useState } from "react";
// import logo from "../assets/logo.png";
// import banner from "../assets/banner.png";

// const HomepageSearch = () => {
//   const [showPopular, setShowPopular] = useState(false);

//   // Popular chapters data
//   const popularChapters = [
//     { id: 67, name: "Al-Mulk", verses: "30 verses" },
//     { id: 2, name: "Al-Baqarah", verses: "285-286" },
//     { id: 1, name: "Al-Fatiha", verses: "7 verses" },
//     { id: 18, name: "Al-Kahf", verses: "110 verses" },
//     { id: 36, name: "Ya-Sin", verses: "83 verses" },
//   ];
//   return (
//     <div className="flex flex-col items-center justify-center  bg-white dark:bg-black px-4">
//       {/* Logo Section */}
//       <div className="">
//         <img src={banner} alt="Logo" className="w-full h-full object-contain" />
//       </div>
//       <div className="">
//         <img src={logo} alt="Logo" className="w-full h-full object-contain" />
//       </div>

//       {/* Search Bar */}
//       <div className="w-full max-w-3xl mb-8">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//             <Search className="h-5 w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search the Quran..."
//             className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] shadow-sm text-gray-700 placeholder-gray-400"
//           />
//           <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
//             <button className="text-gray-400 hover:text-cyan-500 transition-colors">
//               <Mic className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Popular Content - Shows below search bar */}
//         {showPopular && (
//           <div className="mt-4 bg-white dark:bg-[#2A2C38] rounded-lg shadow-lg border border-gray-200 p-6 w-full">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-2">
//                 <TrendingUp className="h-5 w-5 text-cyan-500" />
//                 <h2 className="text-lg font-medium text-gray-900 dark:text-white">Popular</h2>
//               </div>
//               <button
//                 onClick={() => setShowPopular(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Content */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
//                 Chapters and Verses
//               </h3>

//               {/* Popular Chapters */}
//               <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-4">
//   {popularChapters.map((chapter, index) => (
//     <button
//       key={index}
//       className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-black hover:bg-gray-200 rounded-full transition-colors text-sm text-gray-700"
//       style={index === popularChapters.length - 1 ? { marginRight: "1rem" } : {}}
//     >
//       <span>
//         {chapter.id}. {chapter.name}
//       </span>
//       <ChevronRight className="h-4 w-4" />
//     </button>
//   ))}
// </div>


//               {/* Listen to Quran Tajwid */}
//               <div className="flex flex-col items-center dark:bg-[#2A2C38] bg-gray-50 rounded-lg text-center">
//   <div className="flex items-center space-x-3">
//     <div className="flex items-center justify-center w-10 h-7 bg-gray-200 rounded-full">
//       <Play className="h-5 w-5 text-gray-600" />
//     </div>
//     <h4 className="font-medium text-gray-900 dark:text-white">
//       Listen to Quran Tajwid
//     </h4>
//   </div>
// </div>

//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-center gap-4 max-w-4xl overflow-x-auto">
//         <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 dark:bg-[#2A2C38] border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
//           <Play className="h-4 w-4 fill-current" />
//           <span className="text-sm font-medium">Continue Reading</span>
//         </button>

//         <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 dark:bg-[#2A2C38] border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
//           <List className="h-4 w-4" />
//           <span className="text-sm font-medium">Navigate Quran</span>
//         </button>

//         <button className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 dark:bg-[#2A2C38] border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700">
//           <Bookmark className="h-4 w-4" />
//           <span className="text-sm font-medium">Bookmarks</span>
//         </button>

//         <button
//           onClick={() => setShowPopular(true)}
//           className="flex items-center space-x-2 px-6 py-3 bg-cyan-50 dark:bg-[#2A2C38] border border-cyan-200 rounded-full hover:shadow-md hover:bg-cyan-100 transition-all duration-200 text-cyan-600 hover:text-cyan-700"
//         >
//           <TrendingUp className="h-4 w-4" />
//           <span className="text-sm font-medium">Popular</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HomepageSearch;


// import { useState } from "react";
// import logo from "../assets/logo.png";
// import banner from "../assets/banner.png";
// // Icon components using inline SVG
// const SearchIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// const MicIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//   </svg>
// );

// const PlayIcon = ({ className }) => (
//   <svg className={className} fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M10 6.5L8 8v8l2 1.5h4L16 16V8l-2-1.5H10z" />
//   </svg>
// );

// const ListIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//   </svg>
// );

// const BookmarkIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
//   </svg>
// );

// const TrendingUpIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );

// const XIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );

// const ChevronRightIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//   </svg>
// );

// const HomepageSearch = () => {
//   const [showPopular, setShowPopular] = useState(false);

//   // Popular chapters data
//   const popularChapters = [
//     { id: 67, name: "Al-Mulk", verses: "30 verses" },
//     { id: 2, name: "Al-Baqarah", verses: "285-286" },
//     { id: 1, name: "Al-Fatiha", verses: "7 verses" },
//     { id: 18, name: "Al-Kahf", verses: "110 verses" },
//     { id: 36, name: "Ya-Sin", verses: "83 verses" },
//   ];

//   return (
//     <div className="flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-4 sm:py-6 lg:py-8">
//       {/* Logo Section */}
//       <div className="w-full 
//   max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 
//   mb-4 sm:mb-6 mx-auto"
// >
//   <img
//     src={banner}
//     alt="Banner"
//     className="w-full h-auto object-contain"
//   />
// </div>
// <div className="w-full 
//   max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
//   mb-6 sm:mb-8 mx-auto"
// >
//   <div
//     className="w-full 
//       h-16 sm:h-20 md:h-24 lg:h-32 xl:h-40 
//       bg-gray-200 dark:bg-gray-700 rounded-lg 
//       flex items-center justify-center"
//   >
//     <img
//       src={logo}
//       alt="Logo"
//       className="w-auto h-full object-contain"
//     />
//   </div>
// </div>

//       {/* Search Bar */}
//       <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-6 sm:mb-8">
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
//             <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search the Quran..."
//             className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] dark:border-gray-600 dark:text-white shadow-sm text-gray-700 placeholder-gray-400 text-sm sm:text-base"
//           />
//           <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
//             <button className="text-gray-400 hover:text-cyan-500 transition-colors">
//               <MicIcon className="h-4 w-4 sm:h-5 sm:w-5" />
//             </button>
//           </div>
//         </div>

//         {/* Popular Content - Shows below search bar */}
//         {showPopular && (
//           <div className="mt-4 bg-white dark:bg-[#2A2C38] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-4 sm:p-6 w-full">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-2">
//                 <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
//                 <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Popular</h2>
//               </div>
//               <button
//                 onClick={() => setShowPopular(false)}
//                 className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//               >
//                 <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//               </button>
//             </div>

//             {/* Content */}
//             <div>
//               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 dark:text-white">
//                 Chapters and Verses
//               </h3>

//               {/* Popular Chapters */}
//               <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-4">
//                 {popularChapters.map((chapter, index) => (
//                   <button
//                     key={index}
//                     className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-colors text-xs sm:text-sm text-gray-700 flex-shrink-0"
//                     style={index === popularChapters.length - 1 ? { marginRight: "1rem" } : {}}
//                   >
//                     <span>
//                       {chapter.id}. {chapter.name}
//                     </span>
//                     <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
//                   </button>
//                 ))}
//               </div>

//               {/* Listen to Quran Tajwid */}
//               <div className="flex flex-col items-center dark:bg-[#2A2C38] bg-gray-50 rounded-lg py-3 sm:py-4 text-center">
//                 <div className="flex items-center space-x-2 sm:space-x-3">
//                   <div className="flex items-center justify-center w-8 h-6 sm:w-10 sm:h-7 bg-gray-200 dark:bg-gray-600 rounded-full">
//                     <PlayIcon className="h-3 w-3 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
//                   </div>
//                   <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
//                     Listen to Quran Tajwid
//                   </h4>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full max-w-4xl px-2">
//   <div className="flex flex-wrap justify-center gap-2 sm:gap-4 sm:overflow-x-auto">
//     <button className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg hover:bg-cyan-100 dark:hover:bg-gray-700 transition-all duration-200 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs sm:text-sm flex-shrink-0">
//       <PlayIcon className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
//       <span className="font-medium whitespace-nowrap">Continue Reading</span>
//     </button>

//     <button className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg hover:bg-cyan-100 dark:hover:bg-gray-700 transition-all duration-200 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs sm:text-sm flex-shrink-0">
//       <ListIcon className="h-3 w-3 sm:h-4 sm:w-4" />
//       <span className="font-medium whitespace-nowrap">Navigate Quran</span>
//     </button>

//     <button className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg hover:bg-cyan-100 dark:hover:bg-gray-700 transition-all duration-200 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs sm:text-sm flex-shrink-0">
//       <BookmarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
//       <span className="font-medium whitespace-nowrap">Bookmarks</span>
//     </button>

//     <button
//       onClick={() => setShowPopular(true)}
//       className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-[#2A2C38] rounded-full shadow-md hover:shadow-lg hover:bg-cyan-100 dark:hover:bg-gray-700 transition-all duration-200 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs sm:text-sm flex-shrink-0"
//     >
//       <TrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
//       <span className="font-medium whitespace-nowrap">Popular</span>
//     </button>
//   </div>
// </div>

//     </div>
//   );
// };

// export default HomepageSearch;

import { useState } from "react";
import logo from "../assets/logo.png";
import banner from "../assets/banner.png";
import { Play } from "lucide-react";
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
    { id: 36, name: "Ya-Sin", verses: "83 verses" },
  ];

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-6 sm:py-8 lg:py-12">
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
        <div className="w-full h-20 sm:h-24 md:h-28 lg:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-full object-contain p-2"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mb-8 sm:mb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search the Quran..."
            className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-[#2A2C38] dark:border-gray-600 dark:text-white shadow-sm text-gray-700 placeholder-gray-400 text-base"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button className="text-gray-400 hover:text-cyan-500 transition-colors">
              <MicIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Popular Content - Shows below search bar */}
        {showPopular && (
          <div className="mt-4 bg-white dark:bg-[#2A2C38] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 p-6 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUpIcon className="h-5 w-5 text-cyan-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Popular</h2>
              </div>
              <button
                onClick={() => setShowPopular(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
                Chapters and Verses
              </h3>

              {/* Popular Chapters */}
              <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide pr-4">
                {popularChapters.map((chapter, index) => (
                  <button
                    key={index}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full transition-colors text-sm text-gray-700 flex-shrink-0"
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
    <div className="flex items-center justify-center w-10 h-8 bg-gray-200 dark:bg-gray-600 rounded-full">
      <Play className="h-5 w-5 text-gray-600 dark:text-gray-300" />
    </div>
    <h4 className="font-medium text-gray-900 dark:text-white text-base">
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
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-cyan-900 rounded-full shadow-md hover:shadow-lg  transition-all duration-200 text-[#62C3DC] dark:text-cyan-200  text-sm flex-shrink-0">
            <Play className="h-4 w-4 fill-current text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap">Continue Reading</span>
          </button>

          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-cyan-900 rounded-full shadow-md hover:shadow-lg  transition-all duration-200 text-[#62C3DC] dark:text-cyan-200  text-sm flex-shrink-0">
            <ListIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap">Navigate Quran</span>
          </button>

          <button className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-cyan-900 rounded-full shadow-md hover:shadow-lg  transition-all duration-200 text-[#62C3DC] dark:text-cyan-200  text-sm flex-shrink-0">
            <BookmarkIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap">Bookmarks</span>
          </button>

          <button
            onClick={() => setShowPopular(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-cyan-900 rounded-full shadow-md hover:shadow-lg  transition-all duration-200 text-[#62C3DC] dark:text-cyan-200  text-sm flex-shrink-0"
          >
            <TrendingUpIcon className="h-4 w-4 text-[#3FA6C0]" />
            <span className="font-medium whitespace-nowrap">Popular</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomepageSearch;