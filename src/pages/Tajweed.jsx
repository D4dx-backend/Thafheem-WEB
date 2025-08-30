// import React, { useState } from "react";
// import {
//   ArrowLeft,
//   ChevronDown,
//   ChevronUp,
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   Rewind,
//   FastForward,
// } from "lucide-react";

// const Tajweed = () => {
//   const [expandedSections, setExpandedSections] = useState({
//     topics: false,
//     chapter: false,
//     resonance: false,
//   });
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(2);
//   const [totalTime] = useState(18);

//   const handleBack = () => {
//     console.log("Navigate back");
//   };

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handlePrevious = () => {
//     console.log("Previous verse");
//   };

//   const handleNext = () => {
//     console.log("Next verse");
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 dark:bg-black">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center gap-3">

//             <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
//               ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-4 py-6 ">
//         <div className="bg-white rounded-lg shadow-sm border dark:bg-black p-8">
//           {/* Main Content */}
//           <div className="space-y-6">
//             {/* Basic Introduction Text */}
//             <div className="prose prose-gray max-w-none mb-8">
//               <p className="text-sm text-gray-700 leading-relaxed mb-4 dark:text-white">
//                 അല്ലാഹുവിന്റെ തിരുവചനങ്ങള്‍ നമ്മളിലെ ഹൃദയത്തില്‍ വന്നിറങ്ങിയ
//                 അതിവിശുദ്ധ പുസ്തകമാണ് ഖുര്‍ആന്‍. എല്ലാ യുഗത്തിലും ജീവിക്കുന്ന
//                 മനുഷ്യര്‍ക്ക് കൃത്യമായ പ്രമാണപത്രവും ഹിദായത്തും ആയിരിക്കാന്‍
//                 നിര്‍ദ്ദേശിച്ചിരിക്കുന്ന ഖുര്‍ആന്‍ ഖുര്‍ഇഷ് അറബികളില്‍ക്കൂടെ
//                 ലോകം മുഴുവന്‍ അറിയിക്കപ്പെട്ടിരിക്കുന്നു. നബി (സ) യുടെ കാലത്ത്
//                 ഖുര്‍ആന്‍ പഠനത്തിന്റെ ലക്ഷ്യമായിരുന്നത് പാരായണം. പാരായണത്തിന്റെ
//                 സൗന്ദര്യവും അര്‍ത്ഥബോധവും ഒരുപോലെ പ്രാധാന്യമുള്ളതാണ്. ഇസ്‌ലാമിക്
//                 ശാസ്ത്രത്തിലെ ഒരു പ്രധാന ശാഖയാണ് തജ്‌വീദ്. ഖുര്‍ആന്‍
//                 പാരായണത്തിന്റെ നിയമാവലി വിശദീകരിക്കുന്ന ശാസ്ത്രമാണ് എന്ന് ഇതിനെ
//                 വിശേഷിപ്പിക്കാവുന്നതാണ്. 'തജ്‌വീദ്' എന്ന നിബന്ധന ഗുണഭേദം
//                 വര്‍ത്തിച്ച് അതിമനോഹരമാക്കുക എന്ന് അര്‍ത്ഥമാക്കുന്നു. ഖുര്‍ആന്‍
//                 പാരായണത്തിലെ ഓരോ അക്ഷരത്തിനും കൃത്യമായ ശബ്ദരൂപവും കൃത്യമായ
//                 ഉച്ചാരണ നിയമങ്ങളും ഉണ്ട്.
//               </p>

//               <p className="text-sm text-gray-700 leading-relaxed mb-6 dark:text-white">
//                 നമ്മുടെ ഖുര്‍ആന്‍ പാരായണം ശുദ്ധമാകണം. എന്ന് ഇതിലെ ഓരോ വ്യാകരണം,
//                 'തജ്‌വീദിന്റെ നിലവാരം അറിയാതെ ഖുര്‍ആന്‍ തന്നെയാണെങ്കില്‍ എന്ന്
//                 അര്‍ത്ഥമാകും അതിനാല്‍ കൃത്യമായ ഉച്ചാരണത്തോടെ സാധാരണ ഹാഫിസുകള്‍,
//                 വിദ്വാന്മാര്‍, കത്ത്, കൃത്യങ്ങള്‍, വിശേഷങ്ങള്‍, ഭേദങ്ങള്‍,
//                 ന്യൂനതകള്‍, സമന്വയങ്ങള്‍, മോവും, ദീര്‍ഘം, കത്ത് കൃത്യങ്ങള്‍,
//                 കൃത്യങ്ങള്‍, വിശേഷങ്ങള്‍ നിയമാവലിയുടെ അടിസ്ഥാനത്തിലറിയേണ്ടത്
//                 പ്രധാനമാണ്. അതിനാല്‍പൊകാതിരിക്കുന്ന ആര്‍ക്കും സാധിച്ചേക്കാം
//                 എന്നിവ സാധാരണഗതിയില്‍ തന്നെ മനസ്സിലാക്കാം. അതിനായി ധ്വനിയുടെ
//                 ഖുര്‍ആന്‍ പാരായണത്തിലേക്ക് ശ്രദ്ധിക്കുന്ന ഓരോ അക്ഷരത്തിനും
//                 ഉച്ചാരണം. 1. സത്യപഠനത്തിലൂടെ പാരായണം നൈപുണ്യം ബി
//                 തത്ത്വശാസ്ത്രത്തോട് അടുത്ത് ബന്ധപ്പെട്ടുകൊണ്ട് (اوسط) ആ
//                 തത്ത്വത്തിനോ അന്തര്‍ബന്ധം (قياس عام) കൃത്യമാണ്.
//               </p>
//             </div>

//             {/* വിവിധയിനം വിരാമങ്ങള്‍ Section */}
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("topics")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                   വിവിധയിനം വിരാമങ്ങള്‍
//                 </h3>
//                 {expandedSections.topics ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.topics && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                   <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white">
//                     الوقف ഭാഷാര്‍ഥം: തടഞ്ഞുവെക്കുക സാങ്കേതികാര്‍ഥം: പാരായണം
//                     തുടരണമെന്ന ഉദ്ദേശ്യത്തോടെ സാധാരണഗതിയില്‍ ശ്വാസം വിടാവുന്ന
//                     സമയം നിര്‍ത്തുക. അനുബന്ധം : وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
//                     പദത്തിന്റെ ഒടുവില്‍ فَتْحُ التَّنْوِين ആണുള്ളതെങ്കില്‍ ആ
//                     تَنْوِين നെ اَلِف ആക്കി മാറ്റി സാധാരണ ദീര്‍ഘം നല്‍കി വേണം
//                     നിറുത്തുവാന്‍. ഉദാ: فَضْلاً مِنَ اللهِ وَرِضْوَانًا ഇനി
//                     وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന പദത്തിന്റെ ഒടുവില്‍
//                     സ്ത്രീലിംഗത്തെ കുറിക്കുന്ന تَاءُ التَّأْنِيث = ة
//                     ആണുള്ളതെങ്കില്‍ അതിനെ هَاء ആക്കിമാറ്റി سُكُون
//                     ചെയ്തുച്ചരിക്കണം. ഉദാ: عَالِيَة = عَالِيَه خَاشِعَة =
//                     خَاشِعَه. മറ്റു സ്ഥലങ്ങളിലെല്ലാം وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
//                     പദത്തിന്റെ അവസാനത്തെ حَرْف ന്سُكُون നല്‍കിക്കൊണ്ടാണ് وَقْف
//                     ചെയ്യേണ്ടത്. ഉദാ: أَكْرَمنِ = أَكْرَمَنْ فَصْلٌ = فَصْلْ
//                     خُسْرٍ = خُسْرْ يَعْمَلُونَ = يَعْمَلُونْ
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* രണ്ടനക്ക സമയം അടങ്ങുക Section */}
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("chapter")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-blue-600">
//                 രണ്ടനക്ക സമയം അടങ്ങുക
//                 </h3>
//                 {expandedSections.chapter ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.chapter && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                   <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white ">
//                   ശ്വാസം വിടാതെ വായന തുടരാമെന്ന ഉദ്ദേശ്യത്തോടെ രണ്ടനക്ക സമയം അടങ്ങുക. س ആണ് ഇതിന്റെ അടയാളം.
//                   </p>
//                         {/* ഉദാഹരണം Section */}
//             <div>
//               <h4 className="text-sm font-medium text-green-600 mb-4 dark:text-white">
//                 ഉദാഹരണം:
//               </h4>

//               {/* Audio Player */}
//               <div className="bg-gray-100 rounded-lg p-6 dark:bg-[#191919]">
//                 {/* Arabic Text Display */}
//                 <div className="text-center mb-6">
//                   <p
//                     className="text-xl font-semibold text-gray-800 mb-2 dark:text-white"
//                     style={{ fontFamily: "Arabic, serif", direction: "rtl" }}
//                   >
//                     كَلَّا ۖ بَلْ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا
//                     يَكْسِبُونَ (14)
//                   </p>
//                 </div>

//                 {/* Navigation Arrows */}
//                 <div className="flex justify-center items-center mb-4">
//                   <button
//                     onClick={handlePrevious}
//                     className="p-2 hover:bg-gray-200 rounded"
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-600 rotate-90 dark:text-white" />
//                   </button>
//                   <div className="mx-8"></div>
//                   <button
//                     onClick={handleNext}
//                     className="p-2 hover:bg-gray-200 rounded"
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-600 -rotate-90" />
//                   </button>
//                 </div>

//                 {/* Progress Bar */}
//                 <div className="mb-4">
//                   <div className="w-full bg-gray-300 rounded-full h-1">
//                     <div
//                       className="bg-gray-600 h-1 rounded-full transition-all duration-300"
//                       style={{ width: `${(currentTime / totalTime) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 {/* Time Display */}
//                 <div className="flex justify-between text-xs text-gray-500 mb-4">
//                   <span>{formatTime(currentTime)}</span>
//                   <span>{formatTime(totalTime)}</span>
//                 </div>

//                 {/* Audio Controls */}
//                 <div className="flex justify-center items-center gap-4">
//                   <button className="p-2 hover:bg-gray-200 rounded">
//                     <Rewind className="w-4 h-4 text-gray-600" />
//                   </button>

//                   <button className="p-2 hover:bg-gray-200 rounded">
//                     <SkipBack className="w-4 h-4 text-gray-600" />
//                   </button>

//                   <button
//                     onClick={togglePlay}
//                     className="p-3 bg-gray-600 hover:bg-gray-700 rounded-full"
//                   >
//                     {isPlaying ? (
//                       <Pause className="w-5 h-5 text-white" />
//                     ) : (
//                       <Play className="w-5 h-5 text-white ml-1" />
//                     )}
//                   </button>

//                   <button className="p-2 hover:bg-gray-200 rounded">
//                     <SkipForward className="w-4 h-4 text-gray-600" />
//                   </button>

//                   <button className="p-2 hover:bg-gray-200 rounded">
//                     <FastForward className="w-4 h-4 text-gray-600" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//                 </div>
//               )}
//             </div>

//             {/* അനനുവദനീയ വിരാമം Section */}
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 അനനുവദനീയ വിരാമം
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                   <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white">
//                     ഖുര്‍ആന്‍ പാരായണത്തിലെ വിവിധ അനുനാദങ്ങളുടെയും ശബ്ദ
//                     വൈശിഷ്ട്യങ്ങളുടെയും വിശേഷതകള്‍ ഇവിടെ വിവരിക്കുന്നു.
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 അനിവാര്യമായ വിരാമം
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                   {/* <p className="text-sm text-gray-700 leading-relaxed mt-3">
//                     ഖുര്‍ആന്‍ പാരായണത്തിലെ വിവിധ അനുനാദങ്ങളുടെയും ശബ്ദ
//                     വൈശിഷ്ട്യങ്ങളുടെയും വിശേഷതകള്‍ ഇവിടെ വിവരിക്കുന്നു.
//                   </p> */}
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 ഹംസഃയുടെ ഇനങ്ങള്‍
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]" >
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 ഖല്‍ഖലത്തിന്റെ പദവികള്‍
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 നൂനും തന്‍വീനും
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200 ">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 നൂനും മീമും
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 dark:hover:bg-[#2A2C38] text-left hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 സുകൂനുള്ള മീമ്
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 സുകൂനുള്ള ലാമുകള്‍
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white" >
//                 വിവിധയിനം ദീര്‍ഘങ്ങള്‍
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("resonance")}
//                 className="w-full flex items-center justify-between p-4 text-left dark:hover:bg-[#2A2C38] hover:bg-gray-50"
//               >
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                 സുകൂനുള്ള രണ്ട് അക്ഷരങ്ങള്‍ ഒരുമിച്ച് വരല്‍
//                 </h3>
//                 {expandedSections.resonance ? (
//                   <ChevronUp className="w-5 h-5 text-gray-600" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-gray-600" />
//                 )}
//               </button>
//               {expandedSections.resonance && (
//                 <div className="px-4 pb-4 border-t border-gray-200">
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tajweed;

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Tajweed = () => {
  const [expandedSections, setExpandedSections] = useState({
    topics: false,
    chapter: false,
    resonance: false,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2);
  const [totalTime] = useState(18);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white  dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg dark:bg-black p-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Basic Introduction Text */}
            <div className="prose prose-gray max-w-none mb-8">
              <p className="text-sm text-gray-700 leading-relaxed mb-4 dark:text-white">
              അല്ലാഹു മനുഷ്യര്‍ക്ക് നല്‍കിയ ഏറ്റവും വലിയ അനുഗ്രഹമാണ് പരിശുദ്ധ ഖുര്‍ആന്‍. അതിന്റെ പാരായണവും പഠനവും മനനവും ഏറ്റവും മഹത്തായ പ്രതിഫലവും പുണ്യവും ലഭിക്കുന്ന സല്‍കര്‍മങ്ങളില്‍ പെട്ടതാണ്. ഖുര്‍ആന്‍ അവതരിപ്പിക്കപ്പെട്ട ശൈലിയില്‍ തന്നെ അത് പാരായണം ചെയ്യുന്നതാണ് അല്ലാഹു ഇഷ്ടപ്പെടുന്നത്. മലക്ക് ജിബ്‌രീല്‍(അ) മുഹമ്മദ് നബി(സ)ക്കും, അദ്ദേഹം തന്റെ അനുചരന്‍മാര്‍ക്കും അവര്‍ തങ്ങളുടെ പിന്‍ഗാമികള്‍ക്കും എന്ന ക്രമത്തില്‍ ഓതിക്കേള്‍പിച്ചതാണ് ആ ശൈലി. ‘സാവധാനത്തിലും അക്ഷരസ്ഫുടതയോടും കൂടി നീ ഖുര്‍ആന്‍ പാരായണം ചെയ്യുക’ എന്ന ഖുര്‍ആന്‍ വാക്യവും, ‘ഖുര്‍ആനിനെ നിങ്ങളുടെ ശബ്ദം കൊണ്ട് അലങ്കരിക്കുക’ എന്ന നബിവചനവും ഖുര്‍ആന്‍ പാരായണ ശാസ്ത്രത്തിന്റെ അനിവാര്യത വ്യക്തമാക്കുന്നു. അക്ഷരങ്ങളുടെ ഉച്ചാരണ രീതി, വിശേഷണങ്ങള്‍, രാഗം, ദീര്‍ഘം, കനം കുറക്കല്‍, കനപ്പിക്കല്‍, വിരാമം തുടങ്ങിയ കാര്യങ്ങളാണ് അതിലെ പ്രതിപാദ്യം. അവ പഠിക്കലും അതനുസരിച്ച് ഖുര്‍ആന്‍ പാരായണം ചെയ്യലും നിര്‍ബന്ധമാണെന്നാണ് പണ്ഡിതമതം. മൂന്ന് രീതികളാണ് ഖുര്‍ആന്‍ പാരായണത്തിന് നിശ്ചയിച്ചിട്ടുള്ളത്. 1. സാവധാനത്തിലുള്ള പാരായണം (الترتيل) 2. മധ്യനിലക്കുള്ള പാരായണം (التدوير) 3. വേഗതയോടുകൂടിയ പാരായണം (الحدر) ഇവ മൂന്നിലും പാരായണ നിയമങ്ങള്‍ പാലിക്കല്‍ നിര്‍ബന്ധമാണ്.
              </p>
            </div>

            {/* രണ്ടനക്ക സമയം അടങ്ങുക Section */}
            <div className="border border-gray-200 rounded-lg dark:bg-gray-800">
              <button
                onClick={() => toggleSection("chapter")}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="text-base font-medium text-blue-600 dark:text-blue-400">
                  വിവിധയിനം വിരാമങ്ങള്‍
                </h3>
                <span className="text-gray-600 dark:text-gray-300">
                  {expandedSections.chapter ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>
              {expandedSections.chapter && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white">
                    الوقف ഭാഷാര്‍ഥം: തടഞ്ഞുവെക്കുക സാങ്കേതികാര്‍ഥം: പാരായണം
                    തുടരണമെന്ന ഉദ്ദേശ്യത്തോടെ സാധാരണഗതിയില്‍ ശ്വാസം വിടാവുന്ന
                    സമയം നിര്‍ത്തുക. അനുബന്ധം : وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ ഒടുവില്‍ فَتْحُ التَّنْوِين ആണുള്ളതെങ്കില്‍ ആ
                    تَنْوِين നെ اَلِف ആക്കി മാറ്റി സാധാരണ ദീര്‍ഘം നല്‍കി വേണം
                    നിറുത്തുവാന്‍. ഉദാ: فَضْلاً مِنَ اللهِ وَرِضْوَانًا ഇനി
                    وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന പദത്തിന്റെ ഒടുവില്‍
                    സ്ത്രീലിംഗത്തെ കുറിക്കുന്ന تَاءُ التَّأْنِيث = ة
                    ആണുള്ളതെങ്കില്‍ അതിനെ هَاء ആക്കിമാറ്റി سُكُون
                    ചെയ്തുച്ചരിക്കണം. ഉദാ: عَالِيَة = عَالِيَه خَاشِعَة =
                    خَاشِعَه. മറ്റു സ്ഥലങ്ങളിലെല്ലാം وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ അവസാനത്തെ حَرْف ന്سُكُون നല്‍കിക്കൊണ്ടാണ് وَقْف
                    ചെയ്യേണ്ടത്. ഉദാ: أَكْرَمنِ = أَكْرَمَنْ فَصْلٌ = فَصْلْ
                    خُسْرٍ = خُسْرْ يَعْمَلُونَ = يَعْمَلُونْ
                  </p>

                  {/* ഉദാഹരണം Section */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-green-600 mb-4 dark:text-green-400">
                      ഉദാഹരണം:
                    </h4>

                    {/* Audio Player - Matching Screenshot Style */}
                    <div className="bg-[#D9D9D9] rounded-2xl p-6 text-white dark:bg-black">
                      {/* Arabic Text Display */}
                      <div className="text-center mb-8">
                        <div className="w-full">

                        <div className="bg-[#B3B3B3] rounded-xl p-6 mx-50">
                          <p
                            className="text-2xl font-bold text-white leading-relaxed"
                            style={{
                              fontFamily:
                                "'Traditional Arabic', 'Arabic Typesetting', serif",
                              direction: "rtl",
                              lineHeight: "2.2",
                              fontSize: "28px",
                            }}
                          >
                            كَلَّا ۖ بَلْ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا
                            يَكْسِبُونَ ﴿١٤﴾
                          </p>
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      <div className="flex justify-between  items-center mb-8">
                        <button className="p-3    rounded-full transition-colors duration-200">
                          <ChevronLeft className="w-6 h-6  text-black " />
                        </button>
                        <button className="p-3    rounded-full transition-colors duration-200">
                          <ChevronRight className="w-6 h-6  text-black" />
                        </button>
                      </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6 px-2 mx-50">
                        <div className="w-full bg-gray-600 rounded-full h-1.5 ">
                          <div
                            className="bg-black h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${(currentTime / totalTime) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-black mb-8 px-2">
                        <span className="font-mono">
                          {formatTime(currentTime)}
                        </span>
                        <span className="font-mono">
                          {formatTime(totalTime)}
                        </span>
                      </div>
                      </div>

 

                      {/* Audio Controls */}
                      <div className="flex justify-center items-center gap-6">
                        <button className="p-3   rounded-full transition-colors duration-200">
                          <Volume2 className="w-5 h-5 text-black" />
                        </button>

                        <button className="p-3  rounded-full transition-colors duration-200">
                          <SkipBack className="w-5 h-5 text-black" />
                        </button>

                        <button
                          onClick={togglePlay}
                          className="p-4  hover:bg-gray-200 rounded-full text-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6 ml-0.5" />
                          )}
                        </button>

                        <button className="p-3 rounded-full transition-colors duration-200">
                          <SkipForward className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Sections */}
            {[
              "വിവിധയിനം വിരാമങ്ങള്‍",
              "അനനുവദനീയ വിരാമം",
              "അനിവാര്യമായ വിരാമം",
              "ഹംസഃയുടെ ഇനങ്ങള്‍",
              "ഖല്‍ഖലത്തിന്റെ പദവികള്‍",
              "നൂനും തന്‍വീനും",
              "നൂനും മീമും",
              "സുകൂനുള്ള മീമ്",
              "സുകൂനുള്ള ലാമുകള്‍",
              "വിവിധയിനം ദീര്‍ഘങ്ങള്‍",
              "സുകൂനുള്ള രണ്ട് അക്ഷരങ്ങള്‍ ഒരുമിച്ച് വരല്‍",
            ].map((title, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleSection(`section_${index}`)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <h3 className="text-base font-medium text-gray-800 dark:text-white">
                    {title}
                  </h3>
                  <span className="text-gray-600 dark:text-gray-300">
                    {expandedSections[`section_${index}`] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>
                {expandedSections[`section_${index}`] && (
                  <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white">
                      Content for {title} section would go here.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tajweed;
