// import { Share2, Bookmark, Play,Heart,Info,  LibraryBig,Notebook, } from "lucide-react";
// import { Link } from "react-router-dom";
// import HomepageNavbar from "../components/HomeNavbar";
// import Transition from "../components/Transition";
// import { ChevronLeft, ChevronRight, ArrowUp, X } from "lucide-react";
// const Reading = () => {
//   return (
//     <>
//       {/* <HomepageNavbar /> */}
//       <Transition showPageInfo={true} />

//       <div className="min-h-screen bg-gray-50 dark:bg-black">
//         {/* Header */}
//         <div className="bg-gray-50 px-4 py-8 dark:bg-black">
//           <div className="max-w-4xl mx-auto text-center">
//             {/* Toggle Buttons */}
//             <div className="flex items-center justify-center mb-8">
//               <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1"> 
//                 <div className="flex items-center">
//                   <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-sm font-medium">
// <LibraryBig className="w-20 h-20 sm:w-4 sm:h-4 text-black dark:text-white"/>
//                     <Link to="/surah">
//                       <span className="text-sm  text-black dark:text-white cursor-pointer hover:underline">
//                         Translation
//                       </span>
//                     </Link>
//                   </button>
//                   <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-sm font-medium shadow-sm">
// <Notebook className="w-20 h-20 sm:w-4 sm:h-4 text-black dark:text-white"/>
//                     <span className=" text-black dark:text-white">Reading</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Surah Title */}
//             <div className="mb-6">
//               <h1 className="text-5xl font-arabic text-gray-900 dark:text-white mb-4">
//                 البقرة
//               </h1>

//               {/* Action Icons */}
//               <div className="flex items-center justify-center space-x-4 mb-6">
//               <button
//   className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
// >
// <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M7.04102 0.876953C7.21988 0.872433 7.35595 0.982913 7.41797 1.12012C7.47966 1.25677 7.47269 1.43054 7.36328 1.56934L7.36426 1.57031C7.17444 1.81689 7.07051 2.12551 7.07031 2.44629C7.07036 3.2205 7.65293 3.83008 8.36328 3.83008C8.62217 3.82971 8.87562 3.74502 9.08984 3.58887L9.17871 3.51758C9.32708 3.38317 9.52955 3.38964 9.66992 3.49219C9.81323 3.59692 9.88171 3.79048 9.81445 4.01172L9.81543 4.0127C9.54829 5.06733 8.66874 5.81651 7.63672 5.87305V6.23242C7.93786 6.71662 8.42031 7.12993 9 7.53223C9.29438 7.7365 9.61115 7.93618 9.9375 8.14062C10.2631 8.34461 10.5987 8.55402 10.9287 8.77441C12.2911 9.68443 13.5581 10.839 13.583 12.9795C13.5946 13.9776 13.3942 15.2962 12.499 16.4688H12.6113C13.1516 16.469 13.5839 16.9408 13.584 17.4961V18.6973C13.5847 18.8969 13.4503 19.0739 13.2607 19.1143L13.1768 19.123H1.28125C1.05037 19.1218 0.876181 18.9239 0.876953 18.6973V17.4961C0.877067 16.9411 1.3077 16.4688 1.84863 16.4688H11.3506C12.3649 15.6135 12.7489 14.3763 12.7715 12.9785C12.7985 11.2944 11.769 10.3685 10.4912 9.4873C10.1797 9.27251 9.86617 9.07874 9.55762 8.88965C9.24992 8.70108 8.94523 8.51673 8.65527 8.3252C8.11964 7.97136 7.62651 7.58501 7.22949 7.07812C6.8299 7.58748 6.31991 7.99159 5.77539 8.35449C5.48029 8.55117 5.17372 8.73767 4.86914 8.92285C4.56391 9.10843 4.26079 9.29321 3.96875 9.48828C2.79826 10.2702 1.70969 11.2034 1.68945 12.9824C1.67627 14.1447 1.98255 14.9624 2.30762 15.5225C2.45386 15.7601 2.35174 15.9993 2.18262 16.1104C2.09875 16.1654 1.99273 16.1939 1.88574 16.1729C1.77539 16.1511 1.67857 16.0793 1.61426 15.9619V15.9609C1.2185 15.279 0.868253 14.2984 0.876953 12.9795C0.890309 10.9645 2.04737 9.73924 3.5332 8.77344C4.2039 8.33749 4.87254 7.95218 5.46484 7.53809C6.04306 7.13381 6.52411 6.7165 6.8252 6.23145V5.76562C5.84108 5.45019 5.12515 4.48656 5.125 3.35059C5.125 2.39207 5.71839 1.15535 7.01855 0.879883L7.0293 0.87793L7.04102 0.876953ZM1.84863 17.3164C1.76319 17.3164 1.68955 17.3833 1.68945 17.4961V18.2754H12.7725V17.4961C12.7724 17.3848 12.6978 17.3166 12.6113 17.3164H1.84863ZM6.26367 2.33301C6.05854 2.61668 5.93789 2.96975 5.9375 3.35059C5.93768 4.29033 6.6467 5.03107 7.51367 5.03125C7.87411 5.0308 8.20953 4.89868 8.47852 4.67285C8.44029 4.6753 8.4019 4.67769 8.36328 4.67773C7.19699 4.67773 6.25786 3.66674 6.25781 2.44629C6.25784 2.40838 6.26172 2.37059 6.26367 2.33301Z" fill="black" stroke="black" stroke-width="0.245554"/>
// </svg>

// </button>

//         <button
//           className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          
//         >
//           <Heart className="text-black w-5 h-5" />
//         </button>
//               </div>

//               {/* Bismillah */}
//               <div className="mb-8">
//                 <p className="text-3xl font-arabic dark:text-white text-gray-800 leading-relaxed">
//                   بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
//                 </p>
//               </div>

//               {/* Bottom Section */}
//             </div>
//           </div>
//         </div>

//         {/* Reading Content */}

//         <div className="max-w-2xl mx-auto px-4 py-6">
//         <div className="flex items-center justify-between">
//               <div className="flex items-center justify-start space-x-2">
//   <Info className="w-5 h-5 text-gray-900 dark:text-white" />  
//   <Link to="/surahinfo">
//     <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
//       Surah info
//     </span>
//   </Link>
// </div>

//                 <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
//                   <Play className="w-4 h-4" />
//                   <span className="text-sm font-medium">Play Audio</span>
//                 </button>
//               </div>
//           {/* First Block - Highlighted */}
//           <div className=" dark:bg-black rounded-lg p-6 mb-6">
//             <div className="text-center">
//               <p className="text-2xl font-arabic leading-loose dark:text-white text-gray-900 mb-4 bg-[#E7F0F3] dark:bg-[#63C3DC]">
//                 الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى
//                 لِّلْمُتَّقِينَ
//               </p>
//               <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                 الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ
//                 وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٢﴾
//               </p>
//               <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                 وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن
//                 قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٣﴾
//               </p>
//               <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                 أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ
//                 الْمُفْلِحُونَ ﴿٤﴾
//               </p>
//               <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                 إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ
//                 لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ﴿٥﴾
//               </p>
//               <div className="text-center text-gray-500 mb-2">2</div>
//               <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

//               <div className="text-center">
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                   خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ
//                   وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ
//                   ﴿٦﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                   وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ
//                   الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                   يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ
//                   إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ ﴿٧﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                   فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
//                   عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿٨﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-4">
//                   وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
//                   إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿٩﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                    فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
//                   عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿١٠﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
//                   إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿١١﴾
//                 </p>
//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ
//                   ﴿١٢﴾
//                 </p>

//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   وَإِذَا قِيلَ لَهُمْ آمِنُوا كَمَا آمَنَ النَّاسُ قَالُوا
//                   أَنُؤْمِنُ كَمَا آمَنَ السُّفَهَاءُ ۗ أَلَا إِنَّهُمْ هُمُ
//                   السُّفَهَاءُ وَلَٰكِن لَّا يَعْلَمُونَ ﴿١٣﴾
//                 </p>

//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا وَإِذَا
//                   خَلَوْا إِلَىٰ شَيَاطِينِهِمْ قَالُوا إِنَّا مَعَكُمْ إِنَّمَا
//                   نَحْنُ مُسْتَهْزِئُونَ ﴿١٤﴾
//                 </p>

//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   اللَّهُ يَسْتَهْزِئُ بِهِمْ وَيَمُدُّهُمْ فِي طُغْيَانِهِمْ
//                   يَعْمَهُونَ ﴿١٥﴾
//                 </p>

//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//                   أُولَٰئِكَ الَّذِينَ اشْتَرَوُا الضَّلَالَةَ بِالْهُدَىٰ فَمَا
//                   رَبِحَت تِّجَارَتُهُمْ وَمَا كَانُوا مُهْتَدِينَ ﴿١٦﴾
//                 </p>
//                 <div className="text-center text-gray-500 mb-2">3</div>
//                 <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

//                 <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white"></p>
//               </div>



//               <div className="text-center">
//               <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   مَثَلُهُمْ كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا فَلَمَّا أَضَاءَتْ مَا حَوْلَهُ ذَهَبَ اللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِي ظُلُمَاتٍ لَّا يُبْصِرُونَ ﴿١٧﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ ﴿١٨﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   أَوْ كَصَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ وَرَعْدٌ وَبَرْقٌ يَجْعَلُونَ أَصَابِعَهُمْ فِي آذَانِهِم مِّنَ الصَّوَاعِقِ حَذَرَ الْمَوْتِ ۚ وَاللَّهُ مُحِيطٌ بِالْكَافِرِينَ ﴿١٩﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ ۖ كُلَّمَا أَضَاءَ لَهُم مَّشَوْا فِيهِ وَإِذَا أَظْلَمَ عَلَيْهِمْ قَامُوا ۚ وَلَوْ شَاءَ اللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَارِهِمْ ۚ إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿٢٠﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ ﴿٢١﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   الَّذِي جَعَلَ لَكُمُ الْأَرْضَ فِرَاشًا وَالسَّمَاءَ بِنَاءً وَأَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجَ بِهِ مِنَ الثَّمَرَاتِ رِزْقًا لَّكُمْ ۖ فَلَا تَجْعَلُوا لِلَّهِ أَندَادًا وَأَنتُمْ تَعْلَمُونَ ﴿٢٢﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   وَإِن كُنتُمْ فِي رَيْبٍ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ وَادْعُوا شُهَدَاءَكُم مِّن دُونِ اللَّهِ إِن كُنتُمْ صَادِقِينَ ﴿٢٣﴾
// </p>

// <p className="text-2xl font-arabic leading-loose text-gray-900 dark:text-white">
//   فَإِن لَّمْ تَفْعَلُوا وَلَن تَفْعَلُوا فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ ﴿٢٤﴾
// </p>

//                 <div className="text-center text-gray-500 mb-2">4</div>
//                 <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

//               </div>
//             </div>
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
//       </div>
//     </>
//   );
// };

// export default Reading;


import { Share2, Bookmark, Play,Heart,Info,  LibraryBig,Notebook, } from "lucide-react";
import { Link } from "react-router-dom";
import HomepageNavbar from "../components/HomeNavbar";
import Transition from "../components/Transition";
import { ChevronLeft, ChevronRight, ArrowUp, X } from "lucide-react";
import Bismi from "../assets/bismi.jpg"

const Reading = () => {

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

  return (
    <>
      {/* <HomepageNavbar /> */}
      <Transition showPageInfo={true} />

      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-gray-50 px-3 sm:px-4 lg:px-6 py-6 sm:py-8 dark:bg-black">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1"> 
                <div className="flex items-center">
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 text-gray-600 dark:hover:bg-gray-800 dark:text-white hover:bg-gray-50 rounded-full text-xs sm:text-sm font-medium">
<LibraryBig className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white"/>
                    <Link to="/surah">
                      <span className="text-xs sm:text-sm text-black dark:text-white cursor-pointer hover:underline">
                        Translation
                      </span>
                    </Link>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 bg-white dark:bg-black dark:text-white text-gray-900 rounded-full text-xs sm:text-sm font-medium shadow-sm">
<Notebook className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-black dark:text-white"/>
                    <span className="text-black dark:text-white">Reading</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Surah Title */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-arabic text-gray-900 dark:text-white mb-3 sm:mb-4">
                البقرة
              </h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                {kabahIcon}
</button>


        <button
          className="p-2 text-gray-400 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          
        >
          <Heart className="text-black dark:text-white w-4 h-4 sm:w-5 sm:h-5" />
        </button>
              </div>

              {/* Bismillah */}
              <div className="mb-6 sm:mb-8">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-arabic dark:text-white text-gray-800 leading-relaxed px-2">
                <img 
  src={Bismi} 
  alt="Bismillah" 
  className="w-auto h-8 sm:h-10 lg:h-12 xl:h-14 mx-auto dark:invert" 
/>
                </p>
              </div>

              {/* Bottom Section */}
            </div>
          </div>
        </div>

        {/* Reading Content */}

        <div className="max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-row sm:flex-row items-center justify-between">
  {/* Left side */}
  <div className="flex items-center space-x-2">
    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 dark:text-white" />  
    <Link to="/surahinfo">
      <span className="text-xs sm:text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
        Surah info
      </span>
    </Link>
  </div>

  {/* Right side */}
  <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
    <span className="text-xs sm:text-sm font-medium">Play Audio</span>
  </button>
</div>

          {/* First Block - Highlighted */}
          <div className="dark:bg-black rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <div className="text-center">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose dark:text-white text-gray-900 mb-3 sm:mb-4 bg-[#E7F0F3] dark:bg-[#63C3DC] px-2 py-1 rounded">
                الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى
                لِّلْمُتَّقِينَ
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ
                وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٢﴾
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن
                قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٣﴾
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ
                الْمُفْلِحُونَ ﴿٤﴾
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ
                لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ ﴿٥﴾
              </p>
              <div className="text-center text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">2</div>
              <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

              <div className="text-center">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                  خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ
                  وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ
                  ﴿٦﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                  وَمِنَ النَّاسِ مَن يَقُولُ آمَنَّا بِاللَّهِ وَبِالْيَوْمِ
                  الْآخِرِ وَمَا هُم بِمُؤْمِنِينَ
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                  يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا وَمَا يَخْدَعُونَ
                  إِلَّا أَنفُسَهُمْ وَمَا يَشْعُرُونَ ﴿٧﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                  فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
                  عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿٨﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
                  وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
                  إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿٩﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                   فِي قُلُوبِهِم مَّرَضٌ فَزَادَهُمُ اللَّهُ مَرَضًا ۖ وَلَهُمْ
                  عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ ﴿١٠﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا
                  إِنَّمَا نَحْنُ مُصْلِحُونَ ﴿١١﴾
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  أَلَا إِنَّهُمْ هُمُ الْمُفْسِدُونَ وَلَٰكِن لَّا يَشْعُرُونَ
                  ﴿١٢﴾
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  وَإِذَا قِيلَ لَهُمْ آمِنُوا كَمَا آمَنَ النَّاسُ قَالُوا
                  أَنُؤْمِنُ كَمَا آمَنَ السُّفَهَاءُ ۗ أَلَا إِنَّهُمْ هُمُ
                  السُّفَهَاءُ وَلَٰكِن لَّا يَعْلَمُونَ ﴿١٣﴾
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  وَإِذَا لَقُوا الَّذِينَ آمَنُوا قَالُوا آمَنَّا وَإِذَا
                  خَلَوْا إِلَىٰ شَيَاطِينِهِمْ قَالُوا إِنَّا مَعَكُمْ إِنَّمَا
                  نَحْنُ مُسْتَهْزِئُونَ ﴿١٤﴾
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  اللَّهُ يَسْتَهْزِئُ بِهِمْ وَيَمُدُّهُمْ فِي طُغْيَانِهِمْ
                  يَعْمَهُونَ ﴿١٥﴾
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
                  أُولَٰئِكَ الَّذِينَ اشْتَرَوُا الضَّلَالَةَ بِالْهُدَىٰ فَمَا
                  رَبِحَت تِّجَارَتُهُمْ وَمَا كَانُوا مُهْتَدِينَ ﴿١٦﴾
                </p>
                <div className="text-center text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">3</div>
                <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white"></p>
              </div>



              <div className="text-center">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  مَثَلُهُمْ كَمَثَلِ الَّذِي اسْتَوْقَدَ نَارًا فَلَمَّا أَضَاءَتْ مَا حَوْلَهُ ذَهَبَ اللَّهُ بِنُورِهِمْ وَتَرَكَهُمْ فِي ظُلُمَاتٍ لَّا يُبْصِرُونَ ﴿١٧﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  صُمٌّ بُكْمٌ عُمْيٌ فَهُمْ لَا يَرْجِعُونَ ﴿١٨﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  أَوْ كَصَيِّبٍ مِّنَ السَّمَاءِ فِيهِ ظُلُمَاتٌ وَرَعْدٌ وَبَرْقٌ يَجْعَلُونَ أَصَابِعَهُمْ فِي آذَانِهِم مِّنَ الصَّوَاعِقِ حَذَرَ الْمَوْتِ ۚ وَاللَّهُ مُحِيطٌ بِالْكَافِرِينَ ﴿١٩﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ ۖ كُلَّمَا أَضَاءَ لَهُم مَّشَوْا فِيهِ وَإِذَا أَظْلَمَ عَلَيْهِمْ قَامُوا ۚ وَلَوْ شَاءَ اللَّهُ لَذَهَبَ بِسَمْعِهِمْ وَأَبْصَارِهِمْ ۚ إِنَّ اللَّهَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿٢٠﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ ﴿٢١﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  الَّذِي جَعَلَ لَكُمُ الْأَرْضَ فِرَاشًا وَالسَّمَاءَ بِنَاءً وَأَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجَ بِهِ مِنَ الثَّمَرَاتِ رِزْقًا لَّكُمْ ۖ فَلَا تَجْعَلُوا لِلَّهِ أَندَادًا وَأَنتُمْ تَعْلَمُونَ ﴿٢٢﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  وَإِن كُنتُمْ فِي رَيْبٍ مِّمَّا نَزَّلْنَا عَلَىٰ عَبْدِنَا فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ وَادْعُوا شُهَدَاءَكُم مِّن دُونِ اللَّهِ إِن كُنتُمْ صَادِقِينَ ﴿٢٣﴾
</p>

<p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-arabic leading-loose text-gray-900 dark:text-white px-2">
  فَإِن لَّمْ تَفْعَلُوا وَلَن تَفْعَلُوا فَاتَّقُوا النَّارَ الَّتِي وَقُودُهَا النَّاسُ وَالْحِجَارَةُ ۖ أُعِدَّتْ لِلْكَافِرِينَ ﴿٢٤﴾
</p>

                <div className="text-center text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">4</div>
                <hr className="w-1/2 mx-auto border-gray-300 shadow-sm" />

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t dark:bg-black border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 sm:py-4 mt-6 sm:mt-8">
          {/* Mobile: Stack vertically */}
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
          <div className="hidden sm:flex max-w-4xl mx-auto items-center justify-center space-x-4 lg:space-x-6">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg">
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Previous Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg">
              <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Beginning of Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900 dark:hover:text-gray-300 rounded-lg">
              <span>Next Surah</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reading;