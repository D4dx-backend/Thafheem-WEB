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
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'malayalam',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      code: 'ml',
      icon: 'മ',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      id: 'urdu',
      name: 'Urdu',
      nativeName: 'اردو',
      code: 'ur',
      icon: 'ا',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'bangla',
      name: 'Bangla',
      nativeName: 'বাংলা',
      code: 'bn',
      icon: 'ব',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      code: 'ta',
      icon: 'த',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      code: 'hi',
      icon: 'हि',
      color: 'bg-red-100 text-red-600'
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
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 w-full max-w-md mx-auto">

    <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#2A2C38] rounded-2xl shadow-xl w-full max-w-sm mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Choose Translation Language</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Available Languages Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageSelect(language)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  currentSelected === language.name
                    ? 'border-blue-500 dark:bg-[#304454] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 dark:hover:bg-[#304454] hover:bg-gray-50'
                }`}
              >
                {/* Selection Checkmark */}
                {currentSelected === language.name && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}

                {/* Language Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 text-lg font-semibold ${language.color}`}>
                  {language.icon}
                </div>

                {/* Language Names */}
                <div>
                  <div className="font-medium text-gray-900 text-sm mb-1 dark:text-white" dir={language.code === 'ur' ? 'rtl' : 'ltr'}>
                    {language.nativeName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-white">
                    {language.name}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming Languages Section */}
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Upcoming Language</h3>
            <div className="bg-gray-50 dark:bg-[#2A2C38] rounded-xl p-4">
              <div className="text-sm text-gray-600 leading-relaxed dark:text-white">
                sexdcrftvgbyhnjimkodrtgvhujivbn m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default LanguageConsole;