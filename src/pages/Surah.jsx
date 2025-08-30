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
// } from "lucide-react";
// import { useState } from "react";
// import HomepageNavbar from "../components/HomeNavbar";
// import { Link, useNavigate } from "react-router-dom";
// import Transition from "../components/Transition";
// import WordByWord from "./WordByWord";

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

//   const verses = [
//     {
//       number: 1,
//       arabic: "الٓمٓ",
//       translation: "Alif, Lam, Mim,",
//     },
//     {
//       number: 2,
//       arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
//       translation:
//         "This is the Book! There is no doubt about it—a guide for those mindful of Allah,",
//     },
//     {
//       number: 3,
//       arabic:
//         "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//     },
//     {
//       number: 4,
//       arabic:
//         "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
//       translation:
//         "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
//     },
//     {
//       number: 5,
//       arabic:
//         "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//     },
//     {
//       number: 6,
//       arabic:
//         "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
//       translation:
//         "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
//     },
//     {
//       number: 7,
//       arabic:
//         "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
//       translation:
//         "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
//     },
//   ];

//   return (
//     <>
//       {/* <HomepageNavbar /> */}
//       <Transition />

//       <div className="min-h-screen bg-gray-50 dark:bg-black">
//         {/* Header */}
//         <div className="bg-white dark:bg-black px-4 py-8">
//           <div className="max-w-4xl mx-auto text-center">
//             {/* Toggle Buttons */}
//             <div className="flex items-center justify-center mb-8">
//               <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
//                 <div className="flex items-center">
//                   <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black dark:text-white  text-gray-900 rounded-full text-sm font-medium shadow-sm">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
//                     </svg>
//                     <span>Translation</span>
//                   </button>
//                   <button className="flex items-center space-x-2 px-4 py-2 text-white dark:hover:bg-gray-800 dark:text-white  hover:bg-gray-50 rounded-full text-sm font-medium">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
//                       <polyline points="14,2 14,8 20,8" />
//                       <line x1="16" y1="13" x2="8" y2="13" />
//                       <line x1="16" y1="17" x2="8" y2="17" />
//                       <polyline points="10,9 9,9 8,9" />
//                     </svg>
//                     <Link to="/reading">
//                       <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
//                         Reading
//                       </span>
//                     </Link>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Surah Title */}
//             <div className="mb-6">
//               <h1 className="text-5xl font-arabic dark:text-white text-gray-900 mb-4">
//                 البقرة
//               </h1>

//               {/* Action Icons */}
//               <div className="flex items-center justify-center space-x-4 mb-6">
//                 <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors">
//                   <Share2 className="w-5 h-5" />
//                 </button>
//                 <button
//                   className="p-2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
//                   onClick={handleBookmarkClick}
//                 >
//                   <Bookmark className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Bismillah */}
//               <div className="mb-8 relative">
//                 <p className="text-3xl font-arabic text-gray-800 dark:text-white leading-relaxed">
//                   بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
//                 </p>

//                 {/* Ayah wise / Block wise buttons */}
//                 <div className="absolute top-0 right-0">
//                   <div className="flex bg-gray-100  dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
//                     <button className="px-4 py-1.5 bg-white dark:bg-black dark:text-white  text-gray-900  rounded-full text-sm font-medium shadow transition-colors">
//                       Ayah wise
//                     </button>
//                     <button
//                       className="px-4 py-1.5 text-gray-500 rounded-full  dark:hover:bg-gray-800 dark:text-white text-sm font-medium hover:text-gray-700 transition-colors"
//                       onClick={() => navigate("/blockwise")}
//                     >
//                       Block wise
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Bottom Section */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full"></div>
//                   <Link to="/surahinfo">
//                     <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
//                       Surah Info
//                     </span>
//                   </Link>
//                 </div>

//                 <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
//                   <Play className="w-4 h-4" />
//                   <span className="text-sm font-medium">Play Audio</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Verses */}
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="space-y-6">
//             {verses.map((verse) => (
//               <div
//                 key={verse.number}
//                 className={`bg-white rounded-lg dark:bg-black shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
//                   selectedVerse === verse.number
//                     ? "ring-2 ring-cyan-500 border-cyan-200"
//                     : "hover:shadow-md"
//                 }`}
//                 onClick={() =>
//                   setSelectedVerse(
//                     selectedVerse === verse.number ? null : verse.number
//                   )
//                 }
//               >
//                 {/* Verse Number */}
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-medium">
//                       {verse.number}
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
//                       onClick={handleBookmarkClick}
//                     >
//                       <Bookmark className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
//                       <Share2 className="w-4 h-4" />
//                     </button>
//                     <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
//                       <Play className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Arabic Text */}
//                 <div className="text-right mb-4">
//                   <p className="text-2xl font-arabic leading-loose dark:text-white text-gray-900">
//                     {verse.arabic}
//                   </p>
//                 </div>

//                 {/* Translation */}
//                 <div className="mb-3">
//                   <p className="text-gray-700 dark:text-white leading-relaxed">
//                     {verse.translation}
//                   </p>
//                 </div>

//                 {/* Action Icons */}
//                 <div className="flex items-center justify-start space-x-6 py-3">
//                   <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
//                     <Copy className="w-5 h-5" />
//                   </button>
//                   <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
//                     <Play className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate(`/ayah/${verse.number}`);
//                     }}
//                   >
//                     <BookOpen className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleWordByWordClick(verse.number);
//                     }}
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                   <button
//                     className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
//                     onClick={handleBookmarkClick}
//                   >
//                     <Bookmark className="w-5 h-5" />
//                   </button>
//                   <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
//                     <Share2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom Navigation */}
//         <div className="bg-white border-t dark:bg-black border-gray-200 px-4 py-4 mt-8">
//           <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
//             <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
//               <ChevronLeft className="w-4 h-4" />
//               <span>Previous Surah</span>
//             </button>
//             <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
//               <ArrowUp className="w-4 h-4" />
//               <span>Beginning of Surah</span>
//             </button>
//             <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
//               <span>Next Surah</span>
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Overlay Popup for Word by Word */}
//         {showWordByWord && (
//           <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-y-auto relative w-full mx-4">
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
  Info ,
  Building2,
  Heart ,
} from "lucide-react";
import { useState } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import WordByWord from "./WordByWord";
import StarNumber from "../components/StarNumber";
 
const Surah = () => {
  
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

  const verses = [
    {
      number: 1,
      arabic: "الٓمٓ",
      translation: "Alif, Lam, Mim,",
      formattedNumber:'2.1',
    },
    {
      number: 2,
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      translation:
        "This is the Book! There is no doubt about it—a guide for those mindful of Allah,",
        formattedNumber:'2.2',

    },
    {
      number: 3,
      arabic:
        "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
        formattedNumber:'2.3',

    },
    {
      number: 4,
      arabic:
        "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
        formattedNumber:'2.4',

    },
    {
      number: 5,
      arabic:
        "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
        formattedNumber:'2.5',

    },
    {
      number: 6,
      arabic:
        "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
        formattedNumber:'2.6',

    },
    {
      number: 7,
      arabic:
        "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
        formattedNumber:'2.7',

    },
  ];


  
  return (
    <>
      {/* <HomepageNavbar /> */}
      <Transition />

      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-white dark:bg-black px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow-sm min-h-[44px]">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <span className="text-xs sm:text-sm">Translation</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-sm font-medium min-h-[44px]">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    <Link to="/reading">
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                        Reading
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout - matches screenshot */}
            <div className="sm:hidden space-y-4">
              {/* Surah Title */}
              <h1 className="text-4xl font-arabic dark:text-white text-gray-900">
                البقرة
              </h1>

              {/* Action Icons */}
              {/* <div className="flex items-center justify-center space-x-4">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  onClick={handleBookmarkClick}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div> */}
               <div className="flex items-center justify-center space-x-4">
               <button
  className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    {/* Crescent moon on top */}
    <path d="M12 2c-1 0-1.5 1-1 2s1.5 1 1 2" />

    {/* Main dome */}
    <path d="M7 10c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />

    {/* Minaret */}
    <rect x="4" y="4" width="1.5" height="8" />
    <circle cx="4.75" cy="3.5" r="0.5" />

    {/* Base structure */}
    <path d="M3 18h18" />
    <path d="M4 18v-7" />
    <path d="M20 18v-7" />
    <path d="M7 18v-8" />
    <path d="M17 18v-8" />

    {/* Entrance arch */}
    <path d="M10 18v-4c0-1 0.9-2 2-2s2 1 2 2v4" />
  </svg>
</button>

        <button
          className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

              {/* Bismillah */}
              <p className="text-2xl font-arabic text-gray-800 dark:text-white leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>

              {/* Surah Info */}
              <div className="flex items-center justify-start space-x-2">
  <Info className="w-5 h-5 text-gray-900 dark:text-white" />  
  <Link to="/surahinfo">
    <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
      Surah info
    </span>
  </Link>
</div>

              {/* Play Audio */}
              <div className="flex items-center justify-start">
                <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors min-h-[44px] px-2">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Play Audio</span>
                </button>
              </div>

              {/* Mobile Ayah/Block Toggle - positioned at bottom right */}
              <div className="flex justify-end">
                <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                  <button className="px-3 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs font-medium shadow transition-colors">
                    Ayah
                  </button>
                  <button
                    className="px-3 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-xs font-medium hover:text-gray-700 transition-colors"
                    onClick={() => navigate("/blockwise")}
                  >
                    Block
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout - preserved original */}
            <div className="hidden sm:block">
              {/* Surah Title */}
              <div className="mb-4 sm:mb-6 relative">
                <h1 className="text-4xl lg:text-5xl font-arabic dark:text-white text-gray-900 mb-3 sm:mb-4">
                  البقرة
                </h1>

                {/* Action Icons */}
                <div className="flex items-center justify-center space-x-4">
                <button
  className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    {/* Crescent moon on top */}
    <path d="M12 2c-1 0-1.5 1-1 2s1.5 1 1 2" />

    {/* Main dome */}
    <path d="M7 10c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />

    {/* Minaret */}
    <rect x="4" y="4" width="1.5" height="8" />
    <circle cx="4.75" cy="3.5" r="0.5" />

    {/* Base structure */}
    <path d="M3 18h18" />
    <path d="M4 18v-7" />
    <path d="M20 18v-7" />
    <path d="M7 18v-8" />
    <path d="M17 18v-8" />

    {/* Entrance arch */}
    <path d="M10 18v-4c0-1 0.9-2 2-2s2 1 2 2v4" />
  </svg>
</button>

        <button
          className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>

                {/* Bismillah */}
                <div className="mb-6 sm:mb-8 relative">
                  <p className="text-2xl lg:text-3xl font-arabic text-gray-800 dark:text-white leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>

                  {/* Desktop Ayah wise / Block wise buttons */}
                  <div className="absolute top-0 right-0">
                    <div className="flex bg-gray-100 dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                      <button className="px-4 py-1.5 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow transition-colors">
                        Ayah wise
                      </button>
                      <button
                        className="px-4 py-1.5 text-gray-500 rounded-full dark:hover:bg-gray-800 dark:text-white text-sm font-medium hover:text-gray-700 transition-colors"
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
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
  <div className="space-y-4 sm:space-y-6">
    {verses.map((verse) => (
      <div
        key={verse.number}
        className={`bg-white rounded-lg dark:bg-black shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-200 ${
          selectedVerse === verse.number
            ? "ring-2 ring-cyan-500 border-cyan-200 dark:border-cyan-600"
            : "hover:shadow-md"
        }`}
        onClick={() =>
          setSelectedVerse(
            selectedVerse === verse.number ? null : verse.number
          )
        }
      >
        {/* Arabic Text */}
        <div className="text-right mb-3 sm:mb-4">
          <p className="text-xl sm:text-2xl font-arabic leading-loose dark:text-white text-gray-900">
            {verse.arabic}
          </p>
        </div>

        {/* Translation */}
        <div className="mb-3">
          <p className="text-sm sm:text-base text-gray-700 dark:text-white leading-relaxed">
            {verse.translation}
          </p>
        </div>

        {/* Verse Number + Action Icons */}
        <div className="flex items-center justify-start space-x-4 sm:space-x-6 py-2 sm:py-3 overflow-x-auto text-gray-500 dark:text-gray-300">
  {/* Correct verse.number */}
  {/* <span className="text-sm sm:text-base font-medium ">
    {verse.number}
  </span> */}
  <span className="text-sm sm:text-base font-medium">
  {verse.formattedNumber}
</span>

  {/* Copy */}
  <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
    <Copy className="w-3 h-3" />
  </button>

  {/* Play */}
  <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
    <Play className="w-3 h-3" />
  </button>

  {/* BookOpen */}
  {/* <button
    className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/ayah/${verse.number}`);
    }}
  >
    <BookOpen className="w-3 h-3" />
  </button> */}
  <button
  className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/ayah/${verse.number}`); // keep using integer ID
  }}
>
  <BookOpen className="w-3 h-3" />
</button>

  {/* List */}
  <button
    className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
    onClick={(e) => {
      e.stopPropagation();
      handleWordByWordClick(verse.number);
    }}
  >
    <List className="w-3 h-3" />
  </button>

  {/* Bookmark */}
  <button
    className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors"
    onClick={handleBookmarkClick}
  >
    <Bookmark className="w-3 h-3" />
  </button>

  {/* Share */}
  <button className="p-1 hover:text-gray-700 dark:hover:text-white transition-colors">
    <Share2 className="w-3 h-3" />
  </button>
</div>
      </div>
    ))}
  </div>
</div>


        {/* Bottom Navigation */}
        <div className="bg-gray-50 border-t dark:bg-black border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8">
          <div className="max-w-4xl mx-auto">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col sm:hidden space-y-2">
              <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Surah</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
                <ArrowUp className="w-4 h-4" />
                <span>Beginning of Surah</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg min-h-[48px]">
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center justify-center space-x-4 lg:space-x-6">
              <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px]">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Surah</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px]">
                <ArrowUp className="w-4 h-4" />
                <span>Beginning of Surah</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#FFFFFF] text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 min-h-[48px]">
                <span>Next Surah</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Overlay Popup for Word by Word */}
        {showWordByWord && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-black rounded-lg max-w-5xl max-h-[90vh] overflow-y-auto relative w-full">
              <WordByWord selectedVerse={selectedVerseForWordByWord} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Surah;