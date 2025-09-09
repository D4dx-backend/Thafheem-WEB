// import React, { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Play,
//   Pause,
//   SkipBack,
//   SkipForward,
//   Volume2,
//   ChevronLeft,
//   ChevronRight,
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

//   const toggleSection = (section) => {
//     setExpandedSections((prev) => ({
//       ...prev,
//       [section]: !prev[section],
//     }));
//   };

//   const togglePlay = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-black">
//       {/* Header */}
//       <div className="bg-white  dark:bg-black">
//         <div className="max-w-5xl mx-auto px-4 py-4 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
//               ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-5xl mx-auto px-4 py-6">
//         <div className="bg-white rounded-lg dark:bg-black p-8">
//           {/* Main Content */}
//           <div className="space-y-6">
//             {/* Basic Introduction Text */}
//             <div className="prose prose-gray max-w-none mb-8">
//               <p className="text-sm text-gray-700 leading-relaxed mb-4 dark:text-white">
//               അല്ലാഹു മനുഷ്യര്‍ക്ക് നല്‍കിയ ഏറ്റവും വലിയ അനുഗ്രഹമാണ് പരിശുദ്ധ ഖുര്‍ആന്‍. അതിന്റെ പാരായണവും പഠനവും മനനവും ഏറ്റവും മഹത്തായ പ്രതിഫലവും പുണ്യവും ലഭിക്കുന്ന സല്‍കര്‍മങ്ങളില്‍ പെട്ടതാണ്. ഖുര്‍ആന്‍ അവതരിപ്പിക്കപ്പെട്ട ശൈലിയില്‍ തന്നെ അത് പാരായണം ചെയ്യുന്നതാണ് അല്ലാഹു ഇഷ്ടപ്പെടുന്നത്. മലക്ക് ജിബ്‌രീല്‍(അ) മുഹമ്മദ് നബി(സ)ക്കും, അദ്ദേഹം തന്റെ അനുചരന്‍മാര്‍ക്കും അവര്‍ തങ്ങളുടെ പിന്‍ഗാമികള്‍ക്കും എന്ന ക്രമത്തില്‍ ഓതിക്കേള്‍പിച്ചതാണ് ആ ശൈലി. ‘സാവധാനത്തിലും അക്ഷരസ്ഫുടതയോടും കൂടി നീ ഖുര്‍ആന്‍ പാരായണം ചെയ്യുക’ എന്ന ഖുര്‍ആന്‍ വാക്യവും, ‘ഖുര്‍ആനിനെ നിങ്ങളുടെ ശബ്ദം കൊണ്ട് അലങ്കരിക്കുക’ എന്ന നബിവചനവും ഖുര്‍ആന്‍ പാരായണ ശാസ്ത്രത്തിന്റെ അനിവാര്യത വ്യക്തമാക്കുന്നു. അക്ഷരങ്ങളുടെ ഉച്ചാരണ രീതി, വിശേഷണങ്ങള്‍, രാഗം, ദീര്‍ഘം, കനം കുറക്കല്‍, കനപ്പിക്കല്‍, വിരാമം തുടങ്ങിയ കാര്യങ്ങളാണ് അതിലെ പ്രതിപാദ്യം. അവ പഠിക്കലും അതനുസരിച്ച് ഖുര്‍ആന്‍ പാരായണം ചെയ്യലും നിര്‍ബന്ധമാണെന്നാണ് പണ്ഡിതമതം. മൂന്ന് രീതികളാണ് ഖുര്‍ആന്‍ പാരായണത്തിന് നിശ്ചയിച്ചിട്ടുള്ളത്. 1. സാവധാനത്തിലുള്ള പാരായണം (الترتيل) 2. മധ്യനിലക്കുള്ള പാരായണം (التدوير) 3. വേഗതയോടുകൂടിയ പാരായണം (الحدر) ഇവ മൂന്നിലും പാരായണ നിയമങ്ങള്‍ പാലിക്കല്‍ നിര്‍ബന്ധമാണ്.
//               </p>
//             </div>

//             {/* രണ്ടനക്ക സമയം അടങ്ങുക Section */}
//             <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
//               <button
//                 onClick={() => toggleSection("chapter")}
//                 className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
//               >
//                 <h3 className="text-base font-medium text-blue-600 dark:text-blue-400">
//                   വിവിധയിനം വിരാമങ്ങള്‍
//                 </h3>
//                 <span className="text-gray-600 dark:text-gray-300">
//                   {expandedSections.chapter ? (
//                     <ChevronUp className="w-5 h-5" />
//                   ) : (
//                     <ChevronDown className="w-5 h-5" />
//                   )}
//                 </span>
//               </button>
//               {expandedSections.chapter && (
//                 <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
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

//                   {/* ഉദാഹരണം Section */}
//                   <div className="mt-6">
//                     <h4 className="text-sm font-medium text-green-600 mb-4 dark:text-green-400">
//                       ഉദാഹരണം:
//                     </h4>

//                     {/* Audio Player - Matching Screenshot Style */}
//                     <div className="bg-[#D9D9D9] rounded-2xl p-6 text-white dark:bg-[#191919]">
//                       {/* Arabic Text Display */}
//                       <div className="text-center mb-8">
//                         <div className="w-full">

//                         <div className="bg-[#B3B3B3] dark:bg-[#323A3F] rounded-lg p-6 mx-50 h-[132px]">
//                           <p
//                             className="text-2xl font-bold text-white leading-relaxed"
//                             style={{
//                               fontFamily:
//                                 "'Traditional Arabic', 'Arabic Typesetting', serif",
//                               direction: "rtl",
//                               lineHeight: "2.2",
//                               fontSize: "28px",
//                             }}
//                           >
//                             كَلَّا ۖ بَلْ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا
//                             يَكْسِبُونَ ﴿١٤﴾
//                           </p>
//                         </div>
//                       </div>

//                       {/* Navigation Arrows */}
//                       <div className="flex justify-between  items-center mb-8">
//                         <button className="p-3    rounded-full transition-colors duration-200">
//                           <ChevronLeft className="w-6 h-6  text-black dark:text-white"/>
//                         </button>
//                         <button className="p-3    rounded-full transition-colors duration-200">
//                           <ChevronRight className="w-6 h-6  text-black dark:text-white" />
//                         </button>
//                       </div>
//                       </div>

//                       {/* Progress Bar */}
//                       <div className="mb-6 px-2 mx-50">
//                         <div className="w-full bg-gray-600 dark:bg-[#4E4E4E] rounded-full h-1.5 ">
//                           <div
//                             className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
//                             style={{
//                               width: `${(currentTime / totalTime) * 100}%`,
//                             }}
//                           ></div>
//                         </div>
//                         <div className="flex justify-between text-sm text-black dark:text-white mb-8 px-2">
//                         <span className="font-mono">
//                           {formatTime(currentTime)}
//                         </span>
//                         <span className="font-mono">
//                           {formatTime(totalTime)}
//                         </span>
//                       </div>
//                       </div>

//                       {/* Audio Controls */}
//                       <div className="flex justify-center items-center gap-6">
//                         <button className="p-3   rounded-full transition-colors duration-200">
//                           <Volume2 className="w-5 h-5 text-black dark:text-white" />
//                         </button>

//                         <button className="p-3  rounded-full transition-colors duration-200">
//                           <SkipBack className="w-5 h-5 text-black dark:text-white" />
//                         </button>

//                         <button
//                           onClick={togglePlay}
//                           className="p-4  hover:bg-gray-200 dark:text-white dark:bg-[#A2A2A2] rounded-full text-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
//                         >
//                           {isPlaying ? (
//                             <Pause className="w-6 h-6" />
//                           ) : (
//                             <Play className="w-6 h-6 ml-0.5" />
//                           )}
//                         </button>

//                         <button className="p-3 rounded-full transition-colors duration-200">
//                           <SkipForward className="w-5 h-5 text-black dark:text-white" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Other Sections */}
//             {[
//               "വിവിധയിനം വിരാമങ്ങള്‍",
//               "അനനുവദനീയ വിരാമം",
//               "അനിവാര്യമായ വിരാമം",
//               "ഹംസഃയുടെ ഇനങ്ങള്‍",
//               "ഖല്‍ഖലത്തിന്റെ പദവികള്‍",
//               "നൂനും തന്‍വീനും",
//               "നൂനും മീമും",
//               "സുകൂനുള്ള മീമ്",
//               "സുകൂനുള്ള ലാമുകള്‍",
//               "വിവിധയിനം ദീര്‍ഘങ്ങള്‍",
//               "സുകൂനുള്ള രണ്ട് അക്ഷരങ്ങള്‍ ഒരുമിച്ച് വരല്‍",
//             ].map((title, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]"
//               >
//                 <button
//                   onClick={() => toggleSection(`section_${index}`)}
//                   className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   <h3 className="text-base font-medium text-gray-800 dark:text-white">
//                     {title}
//                   </h3>
//                   <span className="text-gray-600 dark:text-gray-300">
//                     {expandedSections[`section_${index}`] ? (
//                       <ChevronUp className="w-5 h-5" />
//                     ) : (
//                       <ChevronDown className="w-5 h-5" />
//                     )}
//                   </span>
//                 </button>
//                 {expandedSections[`section_${index}`] && (
//                   <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
//                     <p className="text-sm text-gray-700 leading-relaxed mt-3 dark:text-white">
//                       Content for {title} section would go here.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
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
      <div className="bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white leading-tight">
              ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-lg dark:bg-black p-4 sm:p-6 lg:p-8">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Introduction Text */}
            <div className="prose prose-gray max-w-none mb-6 sm:mb-8">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3 sm:mb-4 dark:text-white">
                അല്ലാഹു മനുഷ്യര്‍ക്ക് നല്‍കിയ ഏറ്റവും വലിയ അനുഗ്രഹമാണ് പരിശുദ്ധ
                ഖുര്‍ആന്‍. അതിന്റെ പാരായണവും പഠനവും മനനവും ഏറ്റവും മഹത്തായ
                പ്രതിഫലവും പുണ്യവും ലഭിക്കുന്ന സല്‍കര്‍മങ്ങളില്‍ പെട്ടതാണ്.
                ഖുര്‍ആന്‍ അവതരിപ്പിക്കപ്പെട്ട ശൈലിയില്‍ തന്നെ അത് പാരായണം
                ചെയ്യുന്നതാണ് അല്ലാഹു ഇഷ്ടപ്പെടുന്നത്. മലക്ക് ജിബ്‌രീല്‍(അ)
                മുഹമ്മദ് നബി(സ)ക്കും, അദ്ദേഹം തന്റെ അനുചരന്‍മാര്‍ക്കും അവര്‍
                തങ്ങളുടെ പിന്‍ഗാമികള്‍ക്കും എന്ന ക്രമത്തില്‍ ഓതിക്കേള്‍പിച്ചതാണ്
                ആ ശൈലി. 'സാവധാനത്തിലും അക്ഷരസ്ഫുടതയോടും കൂടി നീ ഖുര്‍ആന്‍
                പാരായണം ചെയ്യുക' എന്ന ഖുര്‍ആന്‍ വാക്യവും, 'ഖുര്‍ആനിനെ നിങ്ങളുടെ
                ശബ്ദം കൊണ്ട് അലങ്കരിക്കുക' എന്ന നബിവചനവും ഖുര്‍ആന്‍ പാരായണ
                ശാസ്ത്രത്തിന്റെ അനിവാര്യത വ്യക്തമാക്കുന്നു. അക്ഷരങ്ങളുടെ ഉച്ചാരണ
                രീതി, വിശേഷണങ്ങള്‍, രാഗം, ദീര്‍ഘം, കനം കുറക്കല്‍, കനപ്പിക്കല്‍,
                വിരാമം തുടങ്ങിയ കാര്യങ്ങളാണ് അതിലെ പ്രതിപാദ്യം. അവ പഠിക്കലും
                അതനുസരിച്ച് ഖുര്‍ആന്‍ പാരായണം ചെയ്യലും നിര്‍ബന്ധമാണെന്നാണ്
                പണ്ഡിതമതം. മൂന്ന് രീതികളാണ് ഖുര്‍ആന്‍ പാരായണത്തിന്
                നിശ്ചയിച്ചിട്ടുള്ളത്. 1. സാവധാനത്തിലുള്ള പാരായണം (الترتيل) 2.
                മധ്യനിലക്കുള്ള പാരായണം (التدوير) 3. വേഗതയോടുകൂടിയ പാരായണം
                (الحدر) ഇവ മൂന്നിലും പാരായണ നിയമങ്ങള്‍ പാലിക്കല്‍ നിര്‍ബന്ധമാണ്.
              </p>
            </div>

            {/* രണ്ടനക്ക സമയം അടങ്ങുക Section */}
            <div className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]">
              <button
                onClick={() => toggleSection("chapter")}
                className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <h3 className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400">
                  വിവിധയിനം വിരാമങ്ങള്‍
                </h3>
                <span className="text-gray-600 dark:text-gray-300">
                  {expandedSections.chapter ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </span>
              </button>
              {expandedSections.chapter && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2 sm:mt-3 dark:text-white">
                    الوقف ഭാഷാര്‍ഥം: തടഞ്ഞുവെക്കുക സാങ്കേതികാര്‍ഥം: പാരായണം
                    തുടരണമെന്ന ഉദ്ദേശ്യത്തോടെ സാധാരണഗതിയില്‍ ശ്വാസം വിടാവുന്ന
                    സമയം നിര്‍ത്തുക. അനുബന്ധം : وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ ഒടുവില്‍ فَتْحُ التَّنْوِين ആണുള്ളതെങ്കില്‍ ആ
                    تَنْوِين നെ اَلِف ആക്കി മാറ്റി സാധാരണ ദീര്‍ഘം നല്‍കി വേണം
                    നിറുത്തുവാന്‍. ഉദാ: فَضْلاً مِنَ اللهِ وَرِضْوَانًا ഇനി
                    وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന പദത്തിന്റെ ഒടുവില്‍
                    സ്ത്രീലിംഗത്തെ കുറിക്കുന്ന تَاءُ التَّأْنِيث = ة
                    ആണുള്ളതെങ്കില്‍ അതിനെ هَاء ആക്കിമാറ്റി سُكُون
                    ചെയ്തുച്ചരിക്കണം. ഉദാ: عَالِيَة = عَالِيَه خَاشِعَة =
                    خَاشِعَه. മറ്റു സ്ഥലങ്ങളിലെല്ലാം وَقْف ചെയ്യാനുദ്ദേശിക്കുന്ന
                    പദത്തിന്റെ അവസാനത്തെ حَرْف ന്سُكُون നല്‍കിക്കൊണ്ടാണ് وَقْف
                    ചെയ്യേണ്ടത്. ഉദാ: أَكْرَمنِ = أَكْرَمَنْ فَصْلٌ = فَصْلْ
                    خُسْرٍ = خُسْرْ يَعْمَلُونَ = يَعْمَلُونْ
                  </p>

                  {/* ഉദാഹരണം Section */}
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-xs sm:text-sm font-medium text-green-600 mb-3 sm:mb-4 dark:text-green-400">
                      ഉദാഹരണം:
                    </h4>

                    {/* Audio Player - Matching Screenshot Style */}
                    <div className="bg-[#D9D9D9] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:bg-[#191919]">
                      {/* Arabic Text Display */}
                      <div className="text-center mb-6 sm:mb-8">
                        <div className="w-full">
                          <div className="bg-[#B3B3B3] dark:bg-[#323A3F] rounded-lg p-3 sm:p-4 lg:p-6 mx-auto h-auto max-w-[406px] min-h-[80px] sm:min-h-[100px] lg:h-[132px] flex items-center justify-center">
                            <p
                              className="text-lg sm:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-relaxed text-center px-2"
                              style={{
                                fontFamily:
                                  "'Traditional Arabic', 'Arabic Typesetting', serif",
                                direction: "rtl",
                                lineHeight: "1.8",
                              }}
                            >
                              كَلَّا ۖ بَلْ رَانَ عَلَىٰ قُلُوبِهِم مَّا كَانُوا
                              يَكْسِبُونَ ﴿١٤﴾
                            </p>
                          </div>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex sm:justify-around justify-between sm:gap-50 items-center mb-6 sm:mb-8 mt-4">
                          <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
                          </button>
                          <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4 sm:mb-6 px-1 sm:px-2 flex flex-col items-center">
                        {/* Progress Bar */}
                        <div className="w-full max-w-[406px] bg-gray-600 dark:bg-[#4E4E4E] rounded-full h-1 sm:h-1.5">
                          <div
                            className="bg-black dark:bg-white h-1 sm:h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${(currentTime / totalTime) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {/* Time Labels */}
                        <div className="flex justify-between text-xs sm:text-sm text-black dark:text-white mt-2 w-full max-w-[406px]">
                          <span className="font-mono">
                            {formatTime(currentTime)}
                          </span>
                          <span className="font-mono">
                            {formatTime(totalTime)}
                          </span>
                        </div>
                      </div>

                      {/* Audio Controls */}
                      <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6">
                        <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                        </button>

                        <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                          <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                        </button>

                        <button
                          onClick={togglePlay}
                          className="p-3 sm:p-4 hover:bg-gray-200 dark:text-white dark:bg-[#A2A2A2] rounded-full text-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                          )}
                        </button>

                        <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
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
                className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]"
              >
                <button
                  onClick={() => toggleSection(`section_${index}`)}
                  className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <h3 className="text-sm sm:text-base font-medium text-gray-800 dark:text-white pr-2">
                    {title}
                  </h3>
                  <span className="text-gray-600 dark:text-gray-300 flex-shrink-0">
                    {expandedSections[`section_${index}`] ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </span>
                </button>
                {expandedSections[`section_${index}`] && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2 sm:mt-3 dark:text-white">
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
