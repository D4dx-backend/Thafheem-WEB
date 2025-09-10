// import {
//   Play,
//   Bookmark,
//   Share2,
//   Copy,
//   FileText,
//   AlignLeft,
//   ChevronDown,
//   BookOpen,
//   List,
//   ChevronLeft,
//   ChevronRight,
//   ArrowUp,
//   Info,
//   Building2,
//   Heart,
//   LibraryBig,
//   Notebook,
// } from "lucide-react";
// import { useState } from "react";
// import HomepageNavbar from "../components/HomeNavbar";
// import { Link, useNavigate } from "react-router-dom";
// import Transition from "../components/Transition";
// import WordByWord from "./WordByWord";
// import StarNumber from "../components/StarNumber";
//  import Bismi from "../assets/bismi.jpg"

// const Surah = () => {
//   const [selectedVerse, setSelectedVerse] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [showWordByWord, setShowWordByWord] = useState(false);
//   const [selectedVerseForWordByWord, setSelectedVerseForWordByWord] =
//     useState(null);
//   const navigate = useNavigate();

//   const handleWordByWordClick = (verseNumber) => {
//     setSelectedVerseForWordByWord(verseNumber);
//     setShowWordByWord(true);
//   };

//   const handleBookmarkClick = (e) => {
//     e.stopPropagation();
//     navigate("/bookmarkblock");
//   };

//   const kabahIcon = (
//     <svg
//       width="14"
//       height="20"
//       viewBox="0 0 14 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className="text-black dark:text-white" // tailwind handles color
//     >
//       <path
//         d="M7.04102 0.876953C7.21988 0.872433 7.35595 0.982913 7.41797 1.12012C7.47966 1.25677 7.47269 1.43054 7.36328 1.56934L7.36426 1.57031C7.17444 1.81689 7.07051 2.12551 7.07031 2.44629C7.07036 3.2205 7.65293 3.83008 8.36328 3.83008C8.62217 3.82971 8.87562 3.74502 9.08984 3.58887L9.17871 3.51758C9.32708 3.38317 9.52955 3.38964 9.66992 3.49219C9.81323 3.59692 9.88171 3.79048 9.81445 4.01172L9.81543 4.0127C9.54829 5.06733 8.66874 5.81651 7.63672 5.87305V6.23242C7.93786 6.71662 8.42031 7.12993 9 7.53223C9.29438 7.7365 9.61115 7.93618 9.9375 8.14062C10.2631 8.34461 10.5987 8.55402 10.9287 8.77441C12.2911 9.68443 13.5581 10.839 13.583 12.9795C13.5946 13.9776 13.3942 15.2962 12.499 16.4688H12.6113C13.1516 16.469 13.5839 16.9408 13.584 17.4961V18.6973C13.5847 18.8969 13.4503 19.0739 13.2607 19.1143L13.1768 19.123H1.28125C1.05037 19.1218 0.876181 18.9239 0.876953 18.6973V17.4961C0.877067 16.9411 1.3077 16.4688 1.84863 16.4688H11.3506C12.3649 15.6135 12.7489 14.3763 12.7715 12.9785C12.7985 11.2944 11.769 10.3685 10.4912 9.4873C10.1797 9.27251 9.86617 9.07874 9.55762 8.88965C9.24992 8.70108 8.94523 8.51673 8.65527 8.3252C8.11964 7.97136 7.62651 7.58501 7.22949 7.07812C6.8299 7.58748 6.31991 7.99159 5.77539 8.35449C5.48029 8.55117 5.17372 8.73767 4.86914 8.92285C4.56391 9.10843 4.26079 9.29321 3.96875 9.48828C2.79826 10.2702 1.70969 11.2034 1.68945 12.9824C1.67627 14.1447 1.98255 14.9624 2.30762 15.5225C2.45386 15.7601 2.35174 15.9993 2.18262 16.1104C2.09875 16.1654 1.99273 16.1939 1.88574 16.1729C1.77539 16.1511 1.67857 16.0793 1.61426 15.9619V15.9609C1.2185 15.279 0.868253 14.2984 0.876953 12.9795C0.890309 10.9645 2.04737 9.73924 3.5332 8.77344C4.2039 8.33749 4.87254 7.95218 5.46484 7.53809C6.04306 7.13381 6.52411 6.7165 6.8252 6.23145V5.76562C5.84108 5.45019 5.12515 4.48656 5.125 3.35059C5.125 2.39207 5.71839 1.15535 7.01855 0.879883L7.0293 0.87793L7.04102 0.876953ZM1.84863 17.3164C1.76319 17.3164 1.68955 17.3833 1.68945 17.4961V18.2754H12.7725V17.4961C12.7724 17.3848 12.6978 17.3166 12.6113 17.3164H1.84863ZM6.26367 2.33301C6.05854 2.61668 5.93789 2.96975 5.9375 3.35059C5.93768 4.29033 6.6467 5.03107 7.51367 5.03125C7.87411 5.0308 8.20953 4.89868 8.47852 4.67285C8.44029 4.6753 8.4019 4.67769 8.36328 4.67773C7.19699 4.67773 6.25786 3.66674 6.25781 2.44629C6.25784 2.40838 6.26172 2.37059 6.26367 2.33301Z"
//         fill="currentColor"
//         stroke="currentColor"
//         strokeWidth="0.245554"
//       />
//     </svg>
//   );
  
  

//   const verses = [
//     {
//       number: 1,
//       arabic: "الٓمٓ",
//       translation: "Alif, Lam, Mim,",
//       formattedNumber: "2.1",
//     },
//     {
//       number: 2,
//       arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
//       translation:
//         "This is the Book! There is no doubt about it—a guide for those mindful of Allah,",
//       formattedNumber: "2.2",
//     },
//     {
//       number: 3,
//       arabic:
//         "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//       formattedNumber: "2.3",
//     },
//     {
//       number: 4,
//       arabic:
//         "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
//       translation:
//         "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
//       formattedNumber: "2.4",
//     },
//     {
//       number: 5,
//       arabic:
//         "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//       formattedNumber: "2.5",
//     },
//     {
//       number: 6,
//       arabic:
//         "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
//       translation:
//         "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
//       formattedNumber: "2.6",
//     },
//     {
//       number: 7,
//       arabic:
//         "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//       formattedNumber: "2.7",
//     },
//   ];

//   return (
//     <>
//       {/* <HomepageNavbar /> */}
//       <Transition />

//       <div className="min-h-screen bg-white dark:bg-black">
//         {/* Header */}
//         <div className="bg-white dark:bg-black px-3 sm:px-4 py-6 sm:py-8">
//           <div className="w-[1290px] mx-auto text-center">
//             {/* Toggle Buttons */}
//             <div className="flex items-center justify-center mb-6 sm:mb-8">
//               <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
//                 <div className="flex items-center">
//                   <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow-sm min-h-[44px]">
//                     <LibraryBig className="w-20 h-20 sm:w-4 sm:h-4 text-black dark:text-white" />
//                     <span className="text-xs sm:text-sm text-black dark:text-white">
//                       Translation
//                     </span>
//                   </button>
//                   <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-sm font-medium min-h-[44px]">
//                     <Notebook className="w-20 h-20 sm:w-4 sm:h-4 text-black dark:text-white" />
//                     <Link to="/reading">
//                       <span className="text-xs sm:text-sm text-black dark:text-white cursor-pointer hover:underline">
//                         Reading
//                       </span>
//                     </Link>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Layout - matches screenshot */}
//             <div className="sm:hidden space-y-4">
//               {/* Surah Title */}
//               <h1 className="text-4xl font-arabic dark:text-white text-gray-900">
//                 البقرة
//               </h1>

//               {/* Action Icons */}
//               {/* <div className="flex items-center justify-center space-x-4">
//                 <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
//                   <Share2 className="w-5 h-5" />
//                 </button>
//                 <button
//                   className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
//                   onClick={handleBookmarkClick}
//                 >
//                   <Bookmark className="w-5 h-5" />
//                 </button>
//               </div> */}
//               <div className="flex items-center justify-center space-x-4">
//                 <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
//                   <svg
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="w-5 h-5"
//                   >
//                     {/* Crescent moon on top */}
//                     <path d="M12 2c-1 0-1.5 1-1 2s1.5 1 1 2" />

//                     {/* Main dome */}
//                     <path d="M7 10c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />

//                     {/* Minaret */}
//                     <rect x="4" y="4" width="1.5" height="8" />
//                     <circle cx="4.75" cy="3.5" r="0.5" />

//                     {/* Base structure */}
//                     <path d="M3 18h18" />
//                     <path d="M4 18v-7" />
//                     <path d="M20 18v-7" />
//                     <path d="M7 18v-8" />
//                     <path d="M17 18v-8" />

//                     {/* Entrance arch */}
//                     <path d="M10 18v-4c0-1 0.9-2 2-2s2 1 2 2v4" />
//                   </svg>
//                 </button>

//                 <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
//                   <Heart className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Bismillah */}
//               <p className="text-2xl font-arabic text-gray-800 dark:text-white leading-relaxed">
//                 بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
//               </p>

//               {/* Surah Info */}
//               <div className="flex items-center justify-start space-x-2">
//                 <Info className="w-5 h-5 text-gray-900 dark:text-white" />
//                 <Link to="/surahinfo">
//                   <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
//                     Surah info
//                   </span>
//                 </Link>
//               </div>

//               {/* Play Audio */}
//               <div className="flex items-center justify-start">
//                 <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors min-h-[44px] px-2">
//                   <Play className="w-4 h-4" />
//                   <span className="text-sm font-medium">Play Audio</span>
//                 </button>
//               </div>

//               {/* Mobile Ayah/Block Toggle - positioned at bottom right */}
//               <div className="flex justify-end">
//                 <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
//                   <button className="px-3 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
//                     Ayah
//                   </button>
//                   <button
//                     className="px-3 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
//                     onClick={() => navigate("/blockwise")}
//                   >
//                     Block
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Layout - preserved original */}
//             <div className="hidden sm:block">
//               {/* Surah Title */}
//               <div className="mb-4 sm:mb-6 relative">
//                 <h1 className="text-4xl lg:text-5xl font-arabic dark:text-white text-gray-900 mb-3 sm:mb-4">
//                   البقرة
//                 </h1>

//                 {/* Action Icons */}
//                 <div className="flex items-center justify-center space-x-4">
//                 <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
//                 {kabahIcon}
// </button>

//                   <button className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
//                     <Heart className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Bismillah */}
//                 <div className="mt-6 sm:mb-8 relative">
//                 <img 
//   src={Bismi} 
//   alt="Bismillah" 
//   className="w-auto h-12 mx-auto dark:invert" 
// />


//                   {/* Desktop Ayah wise / Block wise buttons */}
//                   <div className="absolute top-0 right-0">
//                     <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
//                       <button className="px-4 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow transition-colors">
//                         Ayah wise
//                       </button>
//                       <button
//                         className="px-4 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-sm font-medium hover:text-gray-700 dark:hover:text-white transition-colors"
//                         onClick={() => navigate("/blockwise")}
//                       >
//                         Block wise
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Desktop Bottom Section */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center justify-start space-x-2">
//                     <Info className="w-5 h-5 text-gray-900 dark:text-white" />
//                     <Link to="/surahinfo">
//                       <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
//                         Surah info
//                       </span>
//                     </Link>
//                   </div>

//                   <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors min-h-[44px] px-2">
//                     <Play className="w-4 h-4" />
//                     <span className="text-sm font-medium">Play Audio</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Verses */}
//         <div className="w-[1290px] mx-auto px-3 sm:px-4 py-4 sm:py-6 bg-white dark:bg-black">
//   <div className="space-y-6 sm:space-y-8">
//     {verses.map((verse, index) => (
//       <div key={verse.number} className="pb-6 border-b border-gray-200 dark:border-gray-700 ">
//         {/* Arabic Text */}
//         <div className="text-right mb-3 sm:mb-4">
//           <p className="text-xl sm:text-2xl font-arabic leading-loose dark:text-white text-gray-900">
//             {verse.arabic}
//             {/* <span className="ml-2 text-gray-500 text-sm sm:text-base">({verse.formattedNumber})</span> */}
//           </p>
//         </div>

//         {/* Translation */}
//         <div className="mb-3">
//           <p className="text-sm sm:text-base text-gray-700 dark:text-white leading-relaxed">
//             {verse.translation}
//           </p>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-4 sm:gap-6 text-gray-500 dark:text-gray-300">
//           {/* Verse Number */}
//           <span className="text-xs sm:text-sm font-medium">{verse.formattedNumber}</span>


//           {/* Copy */}
//           <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
//             <Copy className="w-4 h-4" />
//           </button>

//           {/* Play */}
//           <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
//             <Play className="w-4 h-4" />
//           </button>

//           {/* BookOpen */}
//           <button
//             className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/ayah/${verse.number}`);
//             }}
//           >
//             <BookOpen className="w-4 h-4" />
//           </button>

//           {/* List */}
//           <button
//             className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleWordByWordClick(verse.number);
//             }}
//           >
//             <List className="w-4 h-4" />
//           </button>

//           {/* Bookmark */}
//           <button
//             className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
//             onClick={handleBookmarkClick}
//           >
//             <Bookmark className="w-4 h-4" />
//           </button>

//           {/* Share */}
//           <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
//             <Share2 className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>


//         {/* Bottom Navigation */}
//         <div className="bg-gray-50  dark:bg-black  dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8">
//           <div className="max-w-4xl mx-auto">
//             {/* Mobile: Stack vertically */}
//             <div className="flex flex-col sm:hidden space-y-2">
//               <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
//                 <ChevronLeft className="w-4 h-4" />
//                 <span>Previous Surah</span>
//               </button>
//               <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
//                 <ArrowUp className="w-4 h-4" />
//                 <span>Beginning of Surah</span>
//               </button>
//               <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
//                 <span>Next Surah</span>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Desktop: Horizontal layout */}
//             <div className="hidden sm:flex items-center justify-center space-x-4 lg:space-x-6">
//   <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
//     <ChevronLeft className="w-4 h-4" />
//     <span>Previous Surah</span>
//   </button>
//   <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
//     <ArrowUp className="w-4 h-4" />
//     <span>Beginning of Surah</span>
//   </button>
//   <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
//     <span>Next Surah</span>
//     <ChevronRight className="w-4 h-4" />
//   </button>
// </div>

//           </div>
//         </div>

//         {/* Overlay Popup for Word by Word */}
//         {showWordByWord && (
//           <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className=" rounded-lg max-w-5xl max-h-[90vh] overflow-y-auto relative w-full">
//               <WordByWord selectedVerse={selectedVerseForWordByWord} />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Surah;



import {
  Play,
  Bookmark,
  Share2,
  Copy,
  FileText,
  AlignLeft,
  ChevronDown,
  BookOpen,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Info,
  Building2,
  Heart,
  LibraryBig,
  Notebook,
} from "lucide-react";
import { useState } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import WordByWord from "./WordByWord";
import StarNumber from "../components/StarNumber";
 import Bismi from "../assets/bismi.jpg"
 import { useTheme } from '../context/ThemeContext';

const Surah = () => {
  const { quranFont, fontSize } = useTheme();
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [selectedVerseForWordByWord, setSelectedVerseForWordByWord] =
    useState(null);
  const navigate = useNavigate();

  const handleWordByWordClick = (verseNumber) => {
    setSelectedVerseForWordByWord(verseNumber);
    setShowWordByWord(true);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    navigate("/bookmarkblock");
  };

  const kabahIcon = (
    <svg
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white" // tailwind handles color
    >
      <path
        d="M7.04102 0.876953C7.21988 0.872433 7.35595 0.982913 7.41797 1.12012C7.47966 1.25677 7.47269 1.43054 7.36328 1.56934L7.36426 1.57031C7.17444 1.81689 7.07051 2.12551 7.07031 2.44629C7.07036 3.2205 7.65293 3.83008 8.36328 3.83008C8.62217 3.82971 8.87562 3.74502 9.08984 3.58887L9.17871 3.51758C9.32708 3.38317 9.52955 3.38964 9.66992 3.49219C9.81323 3.59692 9.88171 3.79048 9.81445 4.01172L9.81543 4.0127C9.54829 5.06733 8.66874 5.81651 7.63672 5.87305V6.23242C7.93786 6.71662 8.42031 7.12993 9 7.53223C9.29438 7.7365 9.61115 7.93618 9.9375 8.14062C10.2631 8.34461 10.5987 8.55402 10.9287 8.77441C12.2911 9.68443 13.5581 10.839 13.583 12.9795C13.5946 13.9776 13.3942 15.2962 12.499 16.4688H12.6113C13.1516 16.469 13.5839 16.9408 13.584 17.4961V18.6973C13.5847 18.8969 13.4503 19.0739 13.2607 19.1143L13.1768 19.123H1.28125C1.05037 19.1218 0.876181 18.9239 0.876953 18.6973V17.4961C0.877067 16.9411 1.3077 16.4688 1.84863 16.4688H11.3506C12.3649 15.6135 12.7489 14.3763 12.7715 12.9785C12.7985 11.2944 11.769 10.3685 10.4912 9.4873C10.1797 9.27251 9.86617 9.07874 9.55762 8.88965C9.24992 8.70108 8.94523 8.51673 8.65527 8.3252C8.11964 7.97136 7.62651 7.58501 7.22949 7.07812C6.8299 7.58748 6.31991 7.99159 5.77539 8.35449C5.48029 8.55117 5.17372 8.73767 4.86914 8.92285C4.56391 9.10843 4.26079 9.29321 3.96875 9.48828C2.79826 10.2702 1.70969 11.2034 1.68945 12.9824C1.67627 14.1447 1.98255 14.9624 2.30762 15.5225C2.45386 15.7601 2.35174 15.9993 2.18262 16.1104C2.09875 16.1654 1.99273 16.1939 1.88574 16.1729C1.77539 16.1511 1.67857 16.0793 1.61426 15.9619V15.9609C1.2185 15.279 0.868253 14.2984 0.876953 12.9795C0.890309 10.9645 2.04737 9.73924 3.5332 8.77344C4.2039 8.33749 4.87254 7.95218 5.46484 7.53809C6.04306 7.13381 6.52411 6.7165 6.8252 6.23145V5.76562C5.84108 5.45019 5.12515 4.48656 5.125 3.35059C5.125 2.39207 5.71839 1.15535 7.01855 0.879883L7.0293 0.87793L7.04102 0.876953ZM1.84863 17.3164C1.76319 17.3164 1.68955 17.3833 1.68945 17.4961V18.2754H12.7725V17.4961C12.7724 17.3848 12.6978 17.3166 12.6113 17.3164H1.84863ZM6.26367 2.33301C6.05854 2.61668 5.93789 2.96975 5.9375 3.35059C5.93768 4.29033 6.6467 5.03107 7.51367 5.03125C7.87411 5.0308 8.20953 4.89868 8.47852 4.67285C8.44029 4.6753 8.4019 4.67769 8.36328 4.67773C7.19699 4.67773 6.25786 3.66674 6.25781 2.44629C6.25784 2.40838 6.26172 2.37059 6.26367 2.33301Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.245554"
      />
    </svg>
  );
  
  

  const verses = [
    {
      number: 1,
      arabic: "الٓمٓ",
      translation: "Alif, Lam, Mim,",
      formattedNumber: "2.1",
    },
    {
      number: 2,
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      translation:
        "This is the Book! There is no doubt about it—a guide for those mindful of Allah,",
      formattedNumber: "2.2",
    },
    {
      number: 3,
      arabic:
        "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
      formattedNumber: "2.3",
    },
    {
      number: 4,
      arabic:
        "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
      formattedNumber: "2.4",
    },
    {
      number: 5,
      arabic:
        "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
      formattedNumber: "2.5",
    },
    {
      number: 6,
      arabic:
        "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
      formattedNumber: "2.6",
    },
    {
      number: 7,
      arabic:
        "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
      formattedNumber: "2.7",
    },
  ];

  return (
    <>
      {/* <HomepageNavbar /> */}
      <Transition />

      <div className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <div className="bg-white dark:bg-black px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="w-full max-w-[1290px] mx-auto text-center px-2 sm:px-0">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow-sm min-h-[40px] sm:min-h-[44px]">
                    <LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white" />
                    <span className="text-xs sm:text-sm font-poppins text-black dark:text-white">
                      Translation
                    </span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-xs sm:text-sm font-medium min-h-[40px] sm:min-h-[44px]">
                    <Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white" />
                    <Link to="/reading">
                      <span className="text-xs sm:text-sm text-black font-poppins dark:text-white cursor-pointer hover:underline">
                        Reading
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout - matches screenshot */}
            <div className="sm:hidden space-y-3 sm:space-y-4 px-2">
              {/* Surah Title */}
              <h1 className="text-3xl sm:text-4xl font-arabic dark:text-white text-gray-900">
                البقرة
              </h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                {kabahIcon}
</button>


                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Bismillah */}
              <p className="text-xl sm:text-2xl font-arabic text-gray-800 dark:text-white leading-relaxed px-4">
              <img 
  src={Bismi} 
  alt="Bismillah" 
  className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert" 
/>
              </p>

              {/* Surah Info */}
              <div className="flex items-center justify-start space-x-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />
                <Link to="/surahinfo">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                    Surah info
                  </span>
                </Link>
              </div>

              {/* Play Audio */}
              <div className="flex  justify-between">
                <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors min-h-[44px] px-2">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Play Audio</span>
                </button>
                <div className="flex justify-end">
                <div className="flex bg-gray-100 w-[115px] dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                  <button className="px-2 sm:px-3 py-1.5 bg-white w-[55px] dark:bg-black dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                    Ayah
                  </button>
                  <button
                    className="px-2 sm:px-3 py-1.5 w-[55px] text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
                    onClick={() => navigate("/blockwise")}
                  >
                    Block
                  </button>
                </div>
              </div>
              </div>

              {/* Mobile Ayah/Block Toggle - positioned at bottom right */}
              {/* <div className="flex justify-end">
                <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                  <button className="px-2 sm:px-3 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                    Ayah
                  </button>
                  <button
                    className="px-2 sm:px-3 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
                    onClick={() => navigate("/blockwise")}
                  >
                    Block
                  </button>
                </div>
              </div> */}
            </div>

            {/* Desktop Layout - preserved original */}
            <div className="hidden sm:block">
              {/* Surah Title */}
              <div className="mb-4 sm:mb-6 relative">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-arabic dark:text-white text-gray-900 mb-3 sm:mb-4">
                  البقرة
                </h1>

                {/* Action Icons */}
                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                {kabahIcon}
</button>


                  <button className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Bismillah */}
                <div className="mt-6 sm:mb-8 relative">
                <img 
  src={Bismi} 
  alt="Bismillah" 
  className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert" 
/>


                  {/* Desktop Ayah wise / Block wise buttons */}
                  <div className="absolute top-0 right-0">
                    <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                      <button className="px-3 sm:px-4 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow transition-colors">
                        Ayah wise
                      </button>
                      <button
                        className="px-3 sm:px-4 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs sm:text-sm font-medium hover:text-gray-700 dark:hover:text-white transition-colors"
                        onClick={() => navigate("/blockwise")}
                      >
                        Block wise
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop Bottom Section */}
                <div className="flex items-center justify-between">
                 <div className="flex items-center justify-start space-x-2">
                    <Info className="w-5 h-5 text-gray-900 dark:text-white" />
                    <Link to="/surahinfo">
                      <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                        Surah info
                      </span>
                    </Link>
                  </div>

                  <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors min-h-[44px] px-2">
                    <Play className="w-4 h-4" />
                    <span className="text-sm font-medium">Play Audio</span>
                  </button>
</div>
              </div>
            </div>
          </div>
        </div>

        {/* Verses */}
        <div className="w-full max-w-[1290px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-white dark:bg-black">
  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
    {verses.map((verse, index) => (
      <div key={verse.number} className="pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
        {/* Arabic Text */}
        <div className="text-right mb-2 sm:mb-3 lg:mb-4">
  <p
    className="leading-loose dark:text-white text-gray-900 px-2 sm:px-0"
    style={{
      fontFamily: quranFont,
      fontSize: `${fontSize}px`, // Controlled by ThemeContext, defaults to 16px
    }}
  >
    {verse.arabic}
  </p>
</div>

        {/* Translation */}
        <div className="mb-2 sm:mb-3">
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-white leading-relaxed px-2 sm:px-0 font-poppins font-normal">
            {verse.translation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6 text-gray-500 dark:text-gray-300 px-2 sm:px-0">
          {/* Verse Number */}
          <span className="text-xs sm:text-sm font-medium">{verse.formattedNumber}</span>

          {/* Copy */}
          <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Play */}
          <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* BookOpen */}
          <button
            className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ayah/${verse.number}`);
            }}
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* List */}
          <button
            className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleWordByWordClick(verse.number);
            }}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Bookmark */}
          <button
            className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={handleBookmarkClick}
          >
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Share */}
          <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Bottom Navigation */}
        <div className="bg-gray-50 dark:bg-black dark:border-gray-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mt-6 sm:mt-8">
          <div className="max-w-4xl mx-auto">
            {/* Mobile: Stack vertically */}
         {/* Mobile: Row + Bottom Button */}
<div className="sm:hidden space-y-2">
  {/* First row: Previous + Beginning */}
  <div className="flex space-x-2">
    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                       dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                       border border-gray-300 dark:border-gray-600 rounded-lg w-[173.96px] min-h-[44px]">
      <ChevronLeft className="w-3 h-3" />
      <span>Previous Surah</span>
    </button>

    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                       dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                       border border-gray-300 dark:border-gray-600 rounded-lg min-h-[44px]">
      <ArrowUp className="w-3 h-3" />
      <span>Beginning of Surah</span>
    </button>
  </div>

  {/* Second row: Next Surah */}
{/* Second row: Next Surah */}
<div className="flex justify-center">
  <button className="w-[173.96px] flex items-center justify-center space-x-2 px-4 py-2 text-xs text-gray-600 
                     dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 
                     border border-gray-300 dark:border-gray-600 rounded-lg min-h-[44px]">
    <span>Next Surah</span>
    <ChevronRight className="w-3 h-3" />
  </button>
</div>

</div>
            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6">
  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
    <span>Previous Surah</span>
  </button>
  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
    <span>Beginning of Surah</span>
  </button>
  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#2A2C38] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[44px] sm:min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg">
    <span>Next Surah</span>
    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
  </button>
</div>

          </div>
        </div>

        {/* Overlay Popup for Word by Word */}
        {showWordByWord && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="rounded-lg max-w-xs sm:max-w-5xl max-h-[90vh] overflow-y-auto relative w-full">
              <WordByWord selectedVerse={selectedVerseForWordByWord} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Surah;