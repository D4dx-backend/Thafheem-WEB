// import React from "react";
// import HomepageNavbar from "../components/HomeNavbar";
// import HomepageSearch from "../components/HomeSearch";
// import { useNavigate, useLocation } from "react-router-dom";
// import StarNumber from "../components/StarNumber";
// import { Play, Book, Circle ,BookOpen} from "lucide-react";


// const Juz = () => {
//   const KaabaIcon = ({ className }) => (
//     <svg
//       viewBox="0 0 11 13"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className} // now tailwind can control size
//     >
//       <path
//         d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
//         stroke="#8A8A8A"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
  
//   // Accurate Juz data based on the image
//   const juzData = [
//     {
//       id: 1,
//       title: "Juz 1",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },

//     {
//       id: 3,
//       title: "Juz 5",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//     {
//       id: 20,
//       title: "Juz 20",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//     {
//       id: 22,
//       title: "Juz 3",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//   ];
//   const juzData1 = [
//     {
//       id: 1,
//       title: "Juz 2",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//     {
//       id: 2,
//       title: "Juz 3",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//     {
//       id: 3,
//       title: "Juz 3",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//   ];
//   const juzData2 = [
//     {
//       id: 23,
//       title: "Juz 21",
//       surahs: [
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//         {
//           number: 1,
//           name: "Al-Fatihah",
//           arabicText: "الْفَاتِحَة",
//           verses: "1-7",
//         },
//       ],
//     },
//   ];
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <>
//       {/* <HomepageNavbar /> */}
//       <HomepageSearch />
//       <div className="min-h-screen bg-white dark:bg-black p-3 sm:p-4 mx-auto">
//         <div className="w-[1290px]  mx-auto">
//           {/* Header Tabs */}
//           <div className="border-b border-gray-200 dark:border-gray-700">
//             <div className="flex">
//               <button
//                 onClick={() => navigate("/")}
//                 className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
//                   location.pathname === "/"
//                     ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
//                     : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                 }`}
//               >
//                 Surah
//               </button>
//               <button
//                 onClick={() => navigate("/juz")}
//                 className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
//                   location.pathname === "/juz"
//                     ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
//                     : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                 }`}
//               >
//                 Juz
//               </button>
//             </div>
//           </div>

//           {/* Juz Grid */}
//           {/* Juz Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
//             {/* Left side - JuzData */}
//             <div>
//               {juzData.map((juz) => (
//                 <div
//                   key={juz.id}
//                   className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-4 w-[400px]" // adjusted
//                 >
//                   {/* Header */}
//                   <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
//                     <h3 className="text-sm font-medium text-gray-700 dark:text-white">
//                       {juz.title}
//                     </h3>
//                     <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
//                       Read Juz
//                     </button>
//                   </div>

//                   {/* Surah List */}
//                   <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
//                     {juz.surahs.map((surah, index) => (
//                       <div
//                         key={index}
//                         className="w-full h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
//                       >
//                         {/* Top Row: Number + English + Arabic */}
//                         <div className="flex items-center justify-between">
//                           {/* Left side: Number + Name + Icons */}
//                           <div className="flex items-center space-x-3 flex-1 min-w-0">
//                             {/* Star Badge */}
//                             <StarNumber
//                               number={surah.number}
//                               color="#E5E7EB"
//                               textColor="#000"
//                             />

//                             {/* Name + Icons stacked */}
//                             <div className="flex flex-col min-w-0">
//                               <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
//                                 {surah.name}
//                               </h4>

//                               {/* Icons row (under name) */}
//                               <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mt-1">
//                                 {surah.type === "Makki" ? (
//                                   <KaabaIcon className="h-4 w-4 flex-shrink-0" />
//                                 ) : (
//                                   <KaabaIcon className=" h-4 w-4 flex-shrink-0" />
//                                 )}

//                                 <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

//                                 <BookOpen className="h-4 w-4 flex-shrink-0" />
//                                 <span className="text-xs sm:text-sm font-medium">
//                                   {surah.ayahs}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Arabic name on the right */}
//                           <div className="text-right flex-shrink-0 ml-2">
//                             <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
//                               {surah.arabicText}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Middle - JuzData1 */}
//             <div>
//               {juzData1.map((juz) => (
//                 <div
//                   key={juz.id}
//                   className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-4 w-[400px]"
//                 >
//                   {/* Header */}
//                   <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
//                     <h3 className="text-sm font-medium text-gray-700 dark:text-white">
//                       {juz.title}
//                     </h3>
//                     <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
//                       Read Juz
//                     </button>
//                   </div>

//                   {/* Surah List */}
//                   <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
//                     {juz.surahs.map((surah, index) => (
//                       <div
//                         key={index}
//                         className="w-full h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
//                       >
//                         {/* Top Row: Number + English + Arabic */}
//                         <div className="flex items-center justify-between">
//                           {/* Left side: Number + Name + Icons */}
//                           <div className="flex items-center space-x-3 flex-1 min-w-0">
//                             {/* Star Badge */}
//                             <StarNumber
//                               number={surah.number}
//                               color="#E5E7EB"
//                               textColor="#000"
//                             />

//                             {/* Name + Icons stacked */}
//                             <div className="flex flex-col min-w-0">
//                               <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
//                                 {surah.name}
//                               </h4>

//                               {/* Icons row (under name) */}
//                               <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mt-1">
//                                 {surah.type === "Makki" ? (
//                                   <KaabaIcon className="h-4 w-4 flex-shrink-0" />
//                                 ) : (
//                                   <KaabaIcon className="h-4 w-4 flex-shrink-0" />
//                                 )}

//                                 <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

//                                 <BookOpen className="h-4 w-4 flex-shrink-0" />
//                                 <span className="text-xs sm:text-sm font-medium">
//                                   {surah.ayahs}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Arabic name on the right */}
//                           <div className="text-right flex-shrink-0 ml-2">
//                             <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
//                               {surah.arabicText}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Right side - JuzData2 */}
//             <div>
//               {juzData2.map((juz) => (
//                 <div
//                   key={juz.id}
//                   className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-4 w-[400px]"
//                 >
//                   {/* Header */}
//                   <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
//                     <h3 className="text-sm font-medium text-gray-700 dark:text-white">
//                       {juz.title}
//                     </h3>
//                     <button className="text-black hover:text-black text-xs font-medium dark:text-white min-h-[32px] px-2">
//                       Read Juz
//                     </button>
//                   </div>

//                   {/* Surah List */}
//                   <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
//                     {juz.surahs.map((surah, index) => (
//                       <div
//                         key={index}
//                         className="w-full h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
//                       >
//                         {/* Top Row: Number + English + Arabic */}
//                         <div className="flex items-center justify-between">
//                           {/* Left side: Number + Name + Icons */}
//                           <div className="flex items-center space-x-3 flex-1 min-w-0">
//                             {/* Star Badge */}
//                             <StarNumber
//                               number={surah.number}
//                               color="#E5E7EB"
//                               textColor="#000"
//                             />

//                             {/* Name + Icons stacked */}
//                             <div className="flex flex-col min-w-0">
//                               <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
//                                 {surah.name}
//                               </h4>

//                               {/* Icons row (under name) */}
//                               <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mt-1">
//                                 {surah.type === "Makki" ? (
//                                   <KaabaIcon className="h-4 w-4 flex-shrink-0" />
//                                 ) : (
//                                   <KaabaIcon className="h-4 w-4 flex-shrink-0" />
//                                 )}

//                                 <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

//                                 <BookOpen className="h-4 w-4 flex-shrink-0" />
//                                 <span className="text-xs sm:text-sm font-medium">
//                                   {surah.ayahs}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Arabic name on the right */}
//                           <div className="text-right flex-shrink-0 ml-2">
//                             <p className="text-lg sm:text-xl font-arabic text-gray-900 dark:text-white leading-tight">
//                               {surah.arabicText}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Juz;


import React from "react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation } from "react-router-dom";
import StarNumber from "../components/StarNumber";
import { Play, Book, Circle, BookOpen } from "lucide-react";
import { surahNameUnicodes } from '../components/surahNameUnicodes';

const Juz = () => {
  const KaabaIcon = ({ className }) => (
    <svg
      viewBox="0 0 11 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className} // now tailwind can control size
    >
      <path
        d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
        stroke="#8A8A8A"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Accurate Juz data based on the image
  const juzData = [
    {
      id: 1,
      title: "Juz 1",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },

    {
      id: 3,
      title: "Juz 5",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 20,
      title: "Juz 20",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 22,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
  ];
  const juzData1 = [
    {
      id: 1,
      title: "Juz 2",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 2,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
    {
      id: 3,
      title: "Juz 3",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
  ];
  const juzData2 = [
    {
      id: 23,
      title: "Juz 21",
      surahs: [
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
        {
          number: 1,
          name: "Al-Fatihah",
          arabicText: "الْفَاتِحَة",
          verses: "1-7",
        },
      ],
    },
  ];
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* <HomepageNavbar /> */}
      <HomepageSearch />
      <div className="min-h-screen bg-white dark:bg-black p-3 sm:p-4 mx-auto">
        <div className="w-full max-w-[1290px] mx-auto px-2 sm:px-4">
          {/* Header Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => navigate("/")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Surah
              </button>
              <button
                onClick={() => navigate("/juz")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/juz"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Juz
              </button>
            </div>
          </div>

          {/* Juz Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
            {/* Left side - JuzData */}
            <div className="w-full">
              {juzData.map((juz) => (
                <div
                  key={juz.id}
                  className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-2 sm:m-4 w-full max-w-[400px] mx-auto lg:mx-0"
                >
                  {/* Header */}
                  <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
                    <h3 className="text-sm font-medium font-poppins text-gray-700 dark:text-white">
                      {juz.title}
                    </h3>
                    <button className="text-black hover:text-black text-xs font-medium font-poppins dark:text-white min-h-[32px] px-2">
                      Read Juz
                    </button>
                  </div>

                  {/* Surah List */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                    {juz.surahs.map((surah, index) => (
                      <div
                        key={index}
                        className="w-full min-h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
                      >
                        {/* Top Row: Number + English + Arabic */}
                        <div className="flex items-center justify-between">
                          {/* Left side: Number + Name + Icons */}
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            {/* Star Badge */}
                            <div className="flex-shrink-0">
                              <StarNumber
                                number={surah.number}
                                color="#E5E7EB"
                                textColor="#000"
                              />
                            </div>

                            {/* Name + Icons stacked */}
                            <div className="flex flex-col min-w-0 flex-1">
                              <h4 className="text-sm sm:text-[16px] font-poppins font-semibold text-gray-900 dark:text-white truncate">
                                {surah.name}
                              </h4>

                              {/* Icons row (under name) */}
                              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500 dark:text-gray-400 mt-1">
                                {surah.type === "Makki" ? (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                ) : (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                )}

                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {surah.ayahs}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Arabic name on the right */}
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-base sm:text-[30px] font-arabic text-gray-900 dark:text-white leading-tight"
    style={{ fontFamily: 'SuraName, Amiri, serif' }}
                            
                            >
                             {surahNameUnicodes[surah.number]
      ? String.fromCharCode(
          parseInt(surahNameUnicodes[surah.number].replace('U+', ''), 16)
        )
      : surah.arabic}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Middle - JuzData1 */}
            <div className="w-full">
              {juzData1.map((juz) => (
                <div
                  key={juz.id}
                  className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-2 sm:m-4 w-full max-w-[400px] mx-auto lg:mx-0"
                >
                  {/* Header */}
                  <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
                    <h3 className="text-sm font-medium font-poppins text-gray-700 dark:text-white">
                      {juz.title}
                    </h3>
                    <button className="text-black hover:text-black text-xs font-medium font-poppins dark:text-white min-h-[32px] px-2">
                      Read Juz
                    </button>
                  </div>

                  {/* Surah List */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto">
                    {juz.surahs.map((surah, index) => (
                      <div
                        key={index}
                        className="w-full min-h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
                      >
                        {/* Top Row: Number + English + Arabic */}
                        <div className="flex items-center justify-between">
                          {/* Left side: Number + Name + Icons */}
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            {/* Star Badge */}
                            <div className="flex-shrink-0">
                              <StarNumber
                                number={surah.number}
                                color="#E5E7EB"
                                textColor="#000"
                              />
                            </div>

                            {/* Name + Icons stacked */}
                            <div className="flex flex-col min-w-0 flex-1">
                              <h4 className="text-sm sm:text-[16px] font-poppins font-semibold text-gray-900 dark:text-white truncate">
                                {surah.name}
                              </h4>

                              {/* Icons row (under name) */}
                              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500 dark:text-gray-400 mt-1">
                                {surah.type === "Makki" ? (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                ) : (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                )}

                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {surah.ayahs}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Arabic name on the right */}
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-base sm:text-[30px] font-arabic text-gray-900 dark:text-white leading-tight"
                                style={{ fontFamily: 'SuraName, Amiri, serif' }}

                            >
                              {surahNameUnicodes[surah.number]
      ? String.fromCharCode(
          parseInt(surahNameUnicodes[surah.number].replace('U+', ''), 16)
        )
      : surah.arabic}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right side - JuzData2 */}
            <div className="w-full">
              {juzData2.map((juz) => (
                <div
                  key={juz.id}
                  className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-2 sm:m-4 w-full max-w-[400px] mx-auto lg:mx-0"
                >
                  {/* Header */}
                  <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center ">
                    <h3 className="text-sm font-poppins font-medium text-gray-700 dark:text-white">
                      {juz.title}
                    </h3>
                    <button className="text-black hover:text-black text-xs font-poppins font-medium dark:text-white min-h-[32px] px-2">
                      Read Juz
                    </button>
                  </div>

                  {/* Surah List */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 overflow-y-auto max-h-full">
                    {juz.surahs.map((surah, index) => (
                      <div
                        key={index}
                        className="w-full min-h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-black hover:shadow-md"
                      >
                        {/* Top Row: Number + English + Arabic */}
                        <div className="flex items-center justify-between">
                          {/* Left side: Number + Name + Icons */}
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            {/* Star Badge */}
                            <div className="flex-shrink-0">
                              <StarNumber
                                number={surah.number}
                                color="#E5E7EB"
                                textColor="#000"
                              />
                            </div>

                            {/* Name + Icons stacked */}
                            <div className="flex flex-col min-w-0 flex-1">
                              <h4 className="text-sm sm:text-[16px] font-poppins font-semibold text-gray-900 dark:text-white truncate">
                                {surah.name}
                              </h4>

                              {/* Icons row (under name) */}
                              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500 dark:text-gray-400 mt-1">
                                {surah.type === "Makki" ? (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                ) : (
                                  <KaabaIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                )}

                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {surah.ayahs}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Arabic name on the right */}
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-base sm:text-[30px]  font-arabic text-gray-900 dark:text-white leading-tight"
                                style={{ fontFamily: 'SuraName, Amiri, serif' }}

                            >
                              {surahNameUnicodes[surah.number]
      ? String.fromCharCode(
          parseInt(surahNameUnicodes[surah.number].replace('U+', ''), 16)
        )
      : surah.arabic}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Juz;