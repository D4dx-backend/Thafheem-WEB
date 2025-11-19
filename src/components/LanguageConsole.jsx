import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

const LanguageConsole = ({ onClose, onLanguageSelect, selectedLanguage = 'English' }) => {
  const [currentSelected, setCurrentSelected] = useState(selectedLanguage);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setCurrentSelected(selectedLanguage);
  }, [selectedLanguage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const languages = [
    {
      id: 'english',
      name: 'English',
      nativeName: 'English',
      code: 'en',
      icon: 'E',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    },
    {
      id: 'malayalam',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      code: 'ml',
      icon: 'മ',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    },
    {
      id: 'urdu',
      name: 'Urdu',
      nativeName: 'اردو',
      code: 'ur',
      icon: 'ا',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    },
    {
      id: 'bangla',
      name: 'Bangla',
      nativeName: 'বাংলা',
      code: 'bn',
      icon: 'ব',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    },
    {
      id: 'tamil',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      code: 'ta',
      icon: 'த',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      code: 'hi',
      icon: 'हि',
      color: 'bg-[#b7e3ef] text-[#2aa0bf] dark:bg-[#225B6A] dark:text-[#b7e3ef]'
    }
  ];

  const handleLanguageSelect = (language) => {
    setCurrentSelected(language.name);
    if (onLanguageSelect) {
      onLanguageSelect(language);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  };

  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center font-poppins">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full sm:w-[550px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isClosing ? 'translate-y-full sm:translate-y-10 opacity-0' : 'animate-slideUp sm:animate-fadeIn'}`}>

        {/* Drag Handle (Mobile) */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing" onClick={handleClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Choose Translation Language
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => handleLanguageSelect(language)}
                className={`relative flex items-center justify-between w-full p-4 rounded-xl transition-all border h-[88px] group ${currentSelected === language.name
                    ? "border-[#2AA0BF] bg-white dark:bg-gray-800 shadow-sm ring-1 ring-[#2AA0BF]"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#2AA0BF]/50 hover:shadow-md"
                  }`}
              >
                {/* Left: Icon + Text */}
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold transition-colors ${language.color}`}
                  >
                    {language.icon}
                  </div>
                  <div className="text-left">
                    <div
                      className="font-bold text-gray-900 dark:text-white text-base mb-0.5"
                      dir={language.code === "ur" ? "rtl" : "ltr"}
                    >
                      {language.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {language.nativeName}
                    </div>
                  </div>
                </div>

                {/* Right: Checkmark */}
                {currentSelected === language.name && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-sm animate-fadeIn">
                    <Check size={12} className="text-white stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default LanguageConsole;