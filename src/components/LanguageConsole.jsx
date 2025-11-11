import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const LanguageConsole = ({ onClose, onLanguageSelect, selectedLanguage = 'English' }) => {
  const [currentSelected, setCurrentSelected] = useState(selectedLanguage);

  const languages = [
    {
      id: 'english',
      name: 'English',
      nativeName: 'English',
      code: 'en',
      icon: 'E',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    },
    {
      id: 'malayalam',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      code: 'ml',
      icon: 'മ',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    },
    {
      id: 'urdu',
      name: 'Urdu',
      nativeName: 'اردو',
      code: 'ur',
      icon: 'ا',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    },
    {
      id: 'bangla',
      name: 'Bangla',
      nativeName: 'বাংলা',
      code: 'bn',
      icon: 'ব',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    },
    {
      id: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      code: 'ta',
      icon: 'த',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      code: 'hi',
      icon: 'हि',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A]'
    }
  ];

  const upcomingLanguages = [
    'French', 'Spanish', 'Turkish', 'Indonesian', 'German', 'Italian', 'Portuguese'
  ];

  const handleLanguageSelect = (language) => {
    setCurrentSelected(language.name);
    if (onLanguageSelect) {
      onLanguageSelect(language);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/70 flex items-center justify-center z-50 font-poppins">
      {/* Modal Container */}
      <div className="bg-white dark:bg-[#2A2C38] rounded-2xl shadow-xl w-full max-w-sm mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 ">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Choose Translation Language
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
  
        {/* Content */}
        <div className="space-y-3 mb-6 grid grid-cols-2 gap-3 p-4">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageSelect(language)}
              className={`relative flex items-center justify-between w-full p-4 rounded-xl transition-all border h-20 ${
                currentSelected === language.name
                  ? "border-blue-400 bg-blue-50 dark:bg-[#2A2C38] dark:border-[#2A2C38]"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2C38]"
              }`}
            >
              {/* Left: Icon + Text */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-lg font-semibold ${language.color}`}
                >
                  {language.icon}
                </div>
                <div className="text-left">
                  <div
                    className="font-bold text-black dark:text-white text-sm"
                    dir={language.code === "ur" ? "rtl" : "ltr"}
                  >
                    {language.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white">
                    {language.nativeName}
                  </div>
                </div>
              </div>
  
              {/* Right: Checkmark */}
              {currentSelected === language.name && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
  
        {/* Upcoming Languages */}
        {/* <div className="text-lg text-black font-bold mb-4 text-center dark:text-white">
          <h2>Upcoming Languages</h2>
          <p className="text-gray-600 font-normal text-sm dark:text-white">
            French, Spanish, Turkish, Indonesian, German, Italian, Portuguese
          </p>
        </div> */}
      </div>
    </div>
  );
  
};

export default LanguageConsole;