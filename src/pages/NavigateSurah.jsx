// import React, { useState } from "react";
// import NavigateQuran from "../components/NavigateQuran";

// const NavigateSurah = ({ onSurahSelect }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const surahs = [
//     { id: 1, name: "Al-Fatihah" },
//     { id: 2, name: "Al-Baqarah" },
//     { id: 3, name: "Aal-E-Imran" },
//     { id: 4, name: "An-Nisa" },
//     { id: 5, name: "Al-Maidah" },
//     { id: 6, name: "Al-Anam" },
//     { id: 7, name: "Al-Araf" },
//     { id: 8, name: "Al-Anfal" },
//     { id: 9, name: "At-Tawbah" },
//     { id: 10, name: "Yunus" },
//     { id: 11, name: "Hud" },
//     { id: 12, name: "Yusuf" },
//     { id: 13, name: "Ar-Rad" },
//     { id: 14, name: "Ibrahim" },
//     { id: 15, name: "Al-Hijr" },
//     { id: 16, name: "An-Nahl" },
//     { id: 17, name: "Al-Isra" },
//     { id: 18, name: "Al-Kahf" },
//     { id: 19, name: "Maryam" },
//     { id: 20, name: "Ta-Ha" },
//     { id: 21, name: "Al-Anbiya" },
//     { id: 22, name: "Al-Hajj" },
//     { id: 23, name: "Al-Muminun" },
//     { id: 24, name: "An-Nur" },
//     { id: 25, name: "Al-Furqan" },
//     { id: 26, name: "Ash-Shu'ara" },
//     { id: 27, name: "An-Naml" },
//     { id: 28, name: "Al-Qasas" },
//     { id: 29, name: "Al-Ankabut" },
//     { id: 30, name: "Ar-Rum" },
//     { id: 31, name: "Luqman" },
//     { id: 32, name: "As-Sajda" },
//     { id: 33, name: "Al-Ahzab" },
//     { id: 34, name: "Saba" },
//     { id: 35, name: "Fatir" },
//     { id: 36, name: "Ya-Sin" },
//     { id: 37, name: "As-Saffat" },
//     { id: 38, name: "Sad" },
//     { id: 39, name: "Az-Zumar" },
//     { id: 40, name: "Ghafir" },
//     { id: 41, name: "Fussilat" },
//     { id: 42, name: "Ash-Shura" },
//     { id: 43, name: "Az-Zukhruf" },
//     { id: 44, name: "Ad-Dukhan" },
//     { id: 45, name: "Al-Jathiya" },
//     { id: 46, name: "Al-Ahqaf" },
//     { id: 47, name: "Muhammad" },
//     { id: 48, name: "Al-Fath" },
//     { id: 49, name: "Al-Hujraat" },
//     { id: 50, name: "Qaf" },
//     { id: 51, name: "Adh-Dhariyat" },
//     { id: 52, name: "At-Tur" },
//     { id: 53, name: "An-Najm" },
//     { id: 54, name: "Al-Qamar" },
//     { id: 55, name: "Ar-Rahman" },
//     { id: 56, name: "Al-Waqia" },
//     { id: 57, name: "Al-Hadid" },
//     { id: 58, name: "Al-Mujadila" },
//     { id: 59, name: "Al-Hashr" },
//     { id: 60, name: "Al-Mumtahana" },
//     { id: 61, name: "As-Saff" },
//     { id: 62, name: "Al-Jumua" },
//     { id: 63, name: "Al-Munafiqoon" },
//     { id: 64, name: "At-Taghabun" },
//     { id: 65, name: "At-Talaq" },
//     { id: 66, name: "At-Tahrim" },
//     { id: 67, name: "Al-Mulk" },
//     { id: 68, name: "Al-Qalam" },
//     { id: 69, name: "Al-Haaqqa" },
//     { id: 70, name: "Al-Maarij" },
//     { id: 71, name: "Nuh" },
//     { id: 72, name: "Al-Jinn" },
//     { id: 73, name: "Al-Muzzammil" },
//     { id: 74, name: "Al-Muddathir" },
//     { id: 75, name: "Al-Qiyama" },
//     { id: 76, name: "Al-Insan" },
//     { id: 77, name: "Al-Mursalat" },
//     { id: 78, name: "An-Naba" },
//     { id: 79, name: "An-Nazi'at" },
//     { id: 80, name: "Abasa" },
//     { id: 81, name: "At-Takwir" },
//     { id: 82, name: "Al-Infitar" },
//     { id: 83, name: "Al-Mutaffifin" },
//     { id: 84, name: "Al-Inshiqaq" },
//     { id: 85, name: "Al-Buruj" },
//     { id: 86, name: "At-Tariq" },
//     { id: 87, name: "Al-Ala" },
//     { id: 88, name: "Al-Ghashiya" },
//     { id: 89, name: "Al-Fajr" },
//     { id: 90, name: "Al-Balad" },
//     { id: 91, name: "Ash-Shams" },
//     { id: 92, name: "Al-Lail" },
//     { id: 93, name: "Ad-Duhaa" },
//     { id: 94, name: "Ash-Sharh" },
//     { id: 95, name: "At-Tin" },
//     { id: 96, name: "Al-Alaq" },
//     { id: 97, name: "Al-Qadr" },
//     { id: 98, name: "Al-Bayyina" },
//     { id: 99, name: "Az-Zalzala" },
//     { id: 100, name: "Al-Adiyat" },
//     { id: 101, name: "Al-Qaria" },
//     { id: 102, name: "At-Takathur" },
//     { id: 103, name: "Al-Asr" },
//     { id: 104, name: "Al-Humaza" },
//     { id: 105, name: "Al-Fil" },
//     { id: 106, name: "Quraish" },
//     { id: 107, name: "Al-Maun" },
//     { id: 108, name: "Al-Kawthar" },
//     { id: 109, name: "Al-Kafiroon" },
//     { id: 110, name: "An-Nasr" },
//     { id: 111, name: "Al-Masad" },
//     { id: 112, name: "Al-Ikhlas" },
//     { id: 113, name: "Al-Falaq" },
//     { id: 114, name: "An-Nas" }
//   ];
  

//   const filteredSurahs = surahs.filter((s) =>
//     s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.id.toString().includes(searchTerm)
//   );

//   const handleSurahClick = (surah) => {
//     if (onSurahSelect) {
//       onSurahSelect(surah);
//     }
//   };

//   return (
//     <>
//     <NavigateQuran/>
//     <div className="bg-white  w-96 max-h-96 flex flex-col">
//       {/* Search Bar */}
//       <div className="p-3">
//         <input
//           type="text"
//           placeholder="Search Surah"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Surah List */}
//       <div className="flex-1 overflow-y-auto px-4 pb-3">
//         {filteredSurahs.length > 0 ? (
//           <ol className="list-decimal list-inside space-y-2">
//             {filteredSurahs.map((surah) => (
//               <li
//                 key={surah.id}
//                 onClick={() => handleSurahClick(surah)}
//                 className="cursor-pointer text-gray-800 hover:text-blue-600 transition-colors"
//               >
//                 {surah.name}
//               </li>
//             ))}
//           </ol>
//         ) : (
//           <p className="text-sm text-gray-400 text-center py-4">
//             No surahs found
//           </p>
//         )}
//       </div>
//     </div>
//     </>

//   );
// };

// export default NavigateSurah;



import React, { useState } from 'react';
import { X } from 'lucide-react';
import Verse from '../pages/Verse';
import JuzNavigate from '../pages/JuzNavigate';
import DemoItems from '../pages/DemoItems';



const NavigateSurah = ({ onClose, onSurahSelect }) => {
  const [activeTab, setActiveTab] = useState('Surah');

  const tabs = ['Surah', 'Verse', 'Juz', 'Page'];

  const surahs = [
    { id: 1, name: "Al-Fatihah" },
    { id: 2, name: "Al-Baqarah" },
    { id: 3, name: "Aal-E-Imran" },
    { id: 4, name: "An-Nisa" },
    { id: 5, name: "Al-Maidah" },
    { id: 6, name: "Al-Anam" },
    { id: 7, name: "Al-Araf" },
    { id: 8, name: "Al-Anfal" },
    { id: 9, name: "At-Tawbah" },
    { id: 10, name: "Yunus" },
    { id: 11, name: "Hud" },
    { id: 12, name: "Yusuf" },
    { id: 13, name: "Ar-Rad" },
    { id: 14, name: "Ibrahim" },
    { id: 15, name: "Al-Hijr" },
    { id: 16, name: "An-Nahl" },
    { id: 17, name: "Al-Isra" },
    { id: 18, name: "Al-Kahf" },
    { id: 19, name: "Maryam" },
    { id: 20, name: "Ta-Ha" },
    { id: 21, name: "Al-Anbiya" },
    { id: 22, name: "Al-Hajj" },
    { id: 23, name: "Al-Muminun" },
    { id: 24, name: "An-Nur" },
    { id: 25, name: "Al-Furqan" },
    { id: 26, name: "Ash-Shu'ara" },
    { id: 27, name: "An-Naml" },
    { id: 28, name: "Al-Qasas" },
    { id: 29, name: "Al-Ankabut" },
    { id: 30, name: "Ar-Rum" },
    { id: 31, name: "Luqman" },
    { id: 32, name: "As-Sajda" },
    { id: 33, name: "Al-Ahzab" },
    { id: 34, name: "Saba" },
    { id: 35, name: "Fatir" },
    { id: 36, name: "Ya-Sin" },
    { id: 37, name: "As-Saffat" },
    { id: 38, name: "Sad" },
    { id: 39, name: "Az-Zumar" },
    { id: 40, name: "Ghafir" },
    { id: 41, name: "Fussilat" },
    { id: 42, name: "Ash-Shura" },
    { id: 43, name: "Az-Zukhruf" },
    { id: 44, name: "Ad-Dukhan" },
    { id: 45, name: "Al-Jathiya" },
    { id: 46, name: "Al-Ahqaf" },
    { id: 47, name: "Muhammad" },
    { id: 48, name: "Al-Fath" },
    { id: 49, name: "Al-Hujraat" },
    { id: 50, name: "Qaf" },
    { id: 51, name: "Adh-Dhariyat" },
    { id: 52, name: "At-Tur" },
    { id: 53, name: "An-Najm" },
    { id: 54, name: "Al-Qamar" },
    { id: 55, name: "Ar-Rahman" },
    { id: 56, name: "Al-Waqia" },
    { id: 57, name: "Al-Hadid" },
    { id: 58, name: "Al-Mujadila" },
    { id: 59, name: "Al-Hashr" },
    { id: 60, name: "Al-Mumtahana" },
    { id: 61, name: "As-Saff" },
    { id: 62, name: "Al-Jumua" },
    { id: 63, name: "Al-Munafiqoon" },
    { id: 64, name: "At-Taghabun" },
    { id: 65, name: "At-Talaq" },
    { id: 66, name: "At-Tahrim" },
    { id: 67, name: "Al-Mulk" },
    { id: 68, name: "Al-Qalam" },
    { id: 69, name: "Al-Haaqqa" },
    { id: 70, name: "Al-Maarij" },
    { id: 71, name: "Nuh" },
    { id: 72, name: "Al-Jinn" },
    { id: 73, name: "Al-Muzzammil" },
    { id: 74, name: "Al-Muddathir" },
    { id: 75, name: "Al-Qiyama" },
    { id: 76, name: "Al-Insan" },
    { id: 77, name: "Al-Mursalat" },
    { id: 78, name: "An-Naba" },
    { id: 79, name: "An-Nazi'at" },
    { id: 80, name: "Abasa" },
    { id: 81, name: "At-Takwir" },
    { id: 82, name: "Al-Infitar" },
    { id: 83, name: "Al-Mutaffifin" },
    { id: 84, name: "Al-Inshiqaq" },
    { id: 85, name: "Al-Buruj" },
    { id: 86, name: "At-Tariq" },
    { id: 87, name: "Al-Ala" },
    { id: 88, name: "Al-Ghashiya" },
    { id: 89, name: "Al-Fajr" },
    { id: 90, name: "Al-Balad" },
    { id: 91, name: "Ash-Shams" },
    { id: 92, name: "Al-Lail" },
    { id: 93, name: "Ad-Duhaa" },
    { id: 94, name: "Ash-Sharh" },
    { id: 95, name: "At-Tin" },
    { id: 96, name: "Al-Alaq" },
    { id: 97, name: "Al-Qadr" },
    { id: 98, name: "Al-Bayyina" },
    { id: 99, name: "Az-Zalzala" },
    { id: 100, name: "Al-Adiyat" },
    { id: 101, name: "Al-Qaria" },
    { id: 102, name: "At-Takathur" },
    { id: 103, name: "Al-Asr" },
    { id: 104, name: "Al-Humaza" },
    { id: 105, name: "Al-Fil" },
    { id: 106, name: "Quraish" },
    { id: 107, name: "Al-Maun" },
    { id: 108, name: "Al-Kawthar" },
    { id: 109, name: "Al-Kafiroon" },
    { id: 110, name: "An-Nasr" },
    { id: 111, name: "Al-Masad" },
    { id: 112, name: "Al-Ikhlas" },
    { id: 113, name: "Al-Falaq" },
    { id: 114, name: "An-Nas" }
  ];

  const NavigateSurah = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurahs = surahs.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toString().includes(searchTerm)
    );

    const handleSurahClick = (surah) => {
      if (onSurahSelect) {
        onSurahSelect(surah);
      }
    };

    return (
      <div className="flex flex-col h-full dark:bg-[#2A2C38] ">
        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search Surah"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-600 dark:bg-black dark:text-white bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Surah List */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 ">
          {filteredSurahs.length > 0 ? (
            <ol className="list-decimal list-inside space-y-2">
              {filteredSurahs.map((surah) => (
                <li
                  key={surah.id}
                  onClick={() => handleSurahClick(surah)}
                  className="cursor-pointer text-gray-800 dark:text-white hover:text-blue-600 transition-colors"
                >
                  {surah.name}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No surahs found
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Surah':
        return <NavigateSurah />;
      case 'Verse':
        return <Verse />;
      case 'Juz':
        return <JuzNavigate />;
      case 'Page':
        return <DemoItems/>;
      default:
        return null;
    }
  };

  return (
<div className="bg-white rounded-lg dark:bg-[#2A2C38]  shadow-lg w-96 max-h-[500px] flex flex-col">
  {/* Header with tabs */}
  <div className="flex items-center bg-gray-50 dark:bg-black  rounded-full p-1 m-2">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
          activeTab === tab
            ? 'bg-gray-200 text-gray-900 dark:bg-[#2A2C38] dark:text-white'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Content - make it scrollable */}
  <div className="flex-1 overflow-y-auto px-2 ">
    {renderTabContent()}
  </div>

  {/* Footer tip */}
  <div className="px-4 py-2 text-xs text-gray-400 border-t dark:bg-[#2A2C38]  border-gray-100 bg-gray-50">
    Tip: try navigating with{" "}
    <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl k</kbd>
  </div>
</div>

  );
};

export default NavigateSurah;