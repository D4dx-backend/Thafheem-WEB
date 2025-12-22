import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Verse from '../pages/Verse';
import JuzNavigate from '../pages/JuzNavigate';
import DemoItems from '../pages/DemoItems';
import { useSurahData } from '../hooks/useSurahData';
import { useTheme } from '../context/ThemeContext';

// Custom Kaaba Icon Component (Makkah)
const KaabaIcon = ({ className }) => (
  <svg
    viewBox="0 0 11 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
      stroke="currentColor"
      strokeLinejoin="round"
    />
  </svg>
);

// Madina Icon Component
const MadinaIcon = ({ className }) => (
  <svg
    width="11"
    height="15"
    viewBox="0 0 11 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5.625 1.0498C5.96379 1.0415 6.15318 1.43447 5.9375 1.69434L5.93848 1.69531C5.8059 1.85727 5.73354 2.06001 5.7334 2.26953C5.73364 2.7733 6.13675 3.17749 6.63965 3.17773C6.8485 3.17752 7.05247 3.1038 7.21484 2.9707C7.35907 2.84911 7.5516 2.85714 7.68555 2.94922C7.82703 3.0465 7.89339 3.22605 7.83203 3.42188C7.62359 4.1963 6.95559 4.74982 6.16699 4.82324V4.96973C6.38842 5.29376 6.73956 5.57803 7.17188 5.86035C7.39553 6.00639 7.63673 6.14949 7.88672 6.29688C8.13549 6.44354 8.39372 6.59442 8.64746 6.75391C9.69542 7.41265 10.702 8.26832 10.7217 9.86133C10.7302 10.5552 10.5894 11.4633 9.97949 12.293C10.3948 12.3364 10.7226 12.6925 10.7227 13.1182V13.9834C10.7235 14.202 10.5466 14.3792 10.3281 14.3789V14.3799H1.21582C0.998036 14.379 0.822454 14.2011 0.823242 13.9834V13.1182C0.823351 12.6643 1.19496 12.2891 1.65039 12.2891H8.89941C9.63381 11.6946 9.91674 10.8407 9.93359 9.86035C9.95344 8.7001 9.20568 8.05633 8.22656 7.4209C7.99002 7.26739 7.75176 7.12838 7.51562 6.99219C7.28064 6.85666 7.04583 6.72296 6.82227 6.58398C6.43649 6.34416 6.0728 6.08117 5.77148 5.74121C5.46708 6.08406 5.09223 6.35958 4.7002 6.60547C4.47252 6.74826 4.23591 6.88329 4.00293 7.0166C3.76878 7.15058 3.53754 7.28322 3.31543 7.42285C2.42056 7.98548 1.62622 8.63485 1.61133 9.86523C1.6014 10.6849 1.83171 11.2575 2.07324 11.6484H2.07227C2.13777 11.7504 2.15412 11.8634 2.12402 11.9678C2.0949 12.0686 2.02647 12.1474 1.94727 12.1963C1.86807 12.2451 1.76716 12.2711 1.66406 12.252C1.55623 12.2319 1.46123 12.1657 1.39941 12.0596V12.0586C1.0886 11.5539 0.816533 10.8308 0.823242 9.8623C0.83371 8.36129 1.75222 7.45412 2.89844 6.75293C3.41821 6.43497 3.92281 6.1624 4.37598 5.86426C4.80764 5.58025 5.15748 5.29245 5.37891 4.9668V4.72949C4.62425 4.47414 4.07622 3.76183 4.07617 2.9209C4.07617 2.19418 4.55355 1.26045 5.59473 1.05273L5.61035 1.0498H5.625ZM1.62207 13.0869C1.61745 13.0916 1.61137 13.1013 1.61133 13.1182V13.5908H9.93457V13.1182C9.93452 13.1022 9.92888 13.093 9.92383 13.0879C9.91879 13.0828 9.90931 13.0771 9.89355 13.0771H1.65039C1.63521 13.0771 1.6266 13.0825 1.62207 13.0869ZM4.95801 2.47852C4.89845 2.61488 4.86542 2.76443 4.86523 2.9209L4.87109 3.03613C4.92841 3.60447 5.40474 4.04371 5.98926 4.04395C6.14409 4.04376 6.29155 4.00941 6.42676 3.95117C5.66139 3.85413 5.05306 3.24442 4.95801 2.47852Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.35469"
    />
  </svg>
);

const NavigateSurah = ({ onClose, onSurahSelect }) => {
  const [activeTab, setActiveTab] = useState('Surah');
  const navigate = useNavigate();
  const { translationLanguage } = useTheme();

  // Use cached surah data hook to get type information
  const { surahs, loading } = useSurahData(translationLanguage);

  const tabs = ['Surah', 'Verse', 'Juz', 'Page'];

  // Fallback hardcoded surahs (in case API fails)
  const fallbackSurahs = [
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

  const NavigateSurahList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Map surahs to include id for compatibility
    const mappedSurahs = surahs.length > 0
      ? surahs.map(s => ({ ...s, id: s.number }))
      : fallbackSurahs;

    const filteredSurahs = mappedSurahs.filter((s) =>
      s.english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id?.toString().includes(searchTerm) ||
      s.number?.toString().includes(searchTerm)
    );

    const handleSurahClick = (surah) => {
      // Navigate to the surah page
      const surahId = surah.id || surah.number;
      navigate(`/surah/${surahId}`);

      // Call the onSurahSelect callback if provided
      if (onSurahSelect) {
        onSurahSelect({
          ...surah,
          id: surahId,
          number: surah.number ?? surahId,
          name: surah.name,
          english: surah.english || surah.name,
        });
      }

      // Close the navigation modal
      if (onClose) {
        onClose();
      }
    };

    return (
      <div className="bg-white dark:bg-[#2A2C38] flex flex-col h-full font-poppins">
        {/* Search Bar */}
        <div className="px-5 pt-3 pb-4">
          <input
            type="text"
            placeholder="Search Surah"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 text-sm text-gray-600 dark:text-white bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Surah List */}
        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading surahs...</p>
          ) : filteredSurahs.length > 0 ? (
            <ol className="list-decimal list-outside space-y-2 pl-6">
              {filteredSurahs.map((surah) => {
                // Determine icon based on surah type, default to Makki if undefined
                const surahIcon = surah.type === 'Makki' ? (
                  <KaabaIcon className="h-4 w-4 text-primary" />
                ) : surah.type === 'Madani' ? (
                  <MadinaIcon className="h-4 w-4 text-primary" />
                ) : null;

                return (
                  <li
                    key={surah.id || surah.number}
                    onClick={() => handleSurahClick(surah)}
                    className="cursor-pointer text-gray-800 dark:text-white hover:text-blue-600 transition-colors py-1.5 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center">
                      <span className={`flex-1 min-w-0 pr-2 ${
                        translationLanguage === 'ur' ? 'font-urdu-nastaliq' : 
                        translationLanguage === 'mal' ? 'font-malayalam' : 
                        translationLanguage === 'hi' ? 'font-hindi' : 
                        translationLanguage === 'bn' ? 'font-bengali' : 
                        translationLanguage === 'ta' ? 'font-tamil' : ''
                      }`}>{surah.english || surah.name}</span>
                      {surahIcon && (
                        <span className="flex items-center justify-center w-5 h-5 flex-shrink-0 self-center">
                          {surahIcon}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
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
        return <NavigateSurahList />;
      case 'Verse':
        return <Verse onClose={onClose} />;
      case 'Juz':
        return <JuzNavigate onClose={onClose} />;
      case 'Page':
        return <DemoItems onClose={onClose} />;
      default:
        return null;
    }
  };


  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full sm:w-[480px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn overflow-hidden">

        {/* Drag Handle (Mobile) */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header with tabs + Close Icon */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 font-poppins">
            {tabs.map((tab, idx) => (
              <React.Fragment key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeTab === tab
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                  {tab}
                </button>

                {/* Slim Divider */}
                {idx < tabs.length - 1 && (
                  <span className="mx-1 text-gray-300 dark:text-gray-600 text-xs">|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );

};

export default NavigateSurah;