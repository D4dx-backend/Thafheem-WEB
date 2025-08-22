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
      onClose(); // only works if parent passes onClose
    }
  };
  

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg min-h-[80vh] max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Choose Translation Language</h2>
          {/* <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button> */}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto min-h-[50vh] max-h-[calc(95vh-180px)]">
          {/* Available Languages Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageSelect(language)}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  currentSelected === language.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Selection Checkmark */}
                {currentSelected === language.name && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                {/* Language Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-semibold ${language.color}`}>
                  {language.icon}
                </div>

                {/* Language Names */}
                <div>
                  <div className="font-medium text-gray-900 text-base mb-2" dir={language.code === 'ur' ? 'rtl' : 'ltr'}>
                    {language.nativeName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language.name}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming Languages Section */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">Upcoming Language</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 leading-relaxed">
                {upcomingLanguages.map((lang, index) => (
                  <span key={lang}>
                    {lang}
                    {index < upcomingLanguages.length - 1 && ', '}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                More languages coming soon...
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const selectedLang = languages.find(lang => lang.name === currentSelected);
                if (selectedLang && onLanguageSelect) {
                  onLanguageSelect(selectedLang);
                }
                handleClose();
              }}
              className="flex-1 px-4 py-3 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageConsole;