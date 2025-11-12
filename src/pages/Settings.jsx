import React, { useState, useEffect } from "react";
import {
  X,
  Sun,
  Moon,
  Minus,
  Plus,
  ChevronDown,
  RotateCcw,
  Save,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Helper function to convert language code to display name
const getLanguageNameFromCode = (code) => {
  const languageMap = {
    'mal': 'Malayalam',
    'E': 'English',
    'hi': 'Hindi',
    'bn': 'Bangla',
    'ur': 'Urdu',
    'ta': 'Tamil',
  };
  return languageMap[code] || 'Malayalam';
};

// Helper function to convert display name to language code
const getLanguageCodeFromName = (name) => {
  const codeMap = {
    'Malayalam': 'mal',
    'English': 'E',
    'Hindi': 'hi',
    'Bangla': 'bn',
    'Urdu': 'ur',
    'Tamil': 'ta',
  };
  return codeMap[name] || 'mal';
};

const VIEW_TYPE_SUPPORTED_LANGUAGES = ["mal", "E"];

const Settings = ({ onClose }) => {

  const {
    theme: contextTheme,
    toggleTheme,
    quranFont: contextQuranFont,
    setQuranFont: setContextQuranFont,
    fontSize: contextFontSize,
    setFontSize: setContextFontSize,
    translationFontSize: contextTranslationFontSize,
    setTranslationFontSize: setContextTranslationFontSize,
    viewType: contextViewType,
    setViewType: setContextViewType,
    translationLanguage: contextTranslationLanguage,
    setTranslationLanguage: setContextTranslationLanguage,
  } = useTheme();

  const [theme, setTheme] = useState(
    contextTheme === "dark" ? "Dark" : "Light"
  );
  const [quranFont, setQuranFont] = useState(contextQuranFont);
  const [fontSize, setFontSize] = useState(contextFontSize);
  const [language, setLanguage] = useState(() => 
    getLanguageNameFromCode(contextTranslationLanguage)
  );

  // Prevent body scroll when Settings is open
  useEffect(() => {
    // Disable body scroll
    document.body.style.overflow = "hidden";
    
    // Cleanup: restore body scroll when component unmounts or closes
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync language state when translationLanguage changes externally
  useEffect(() => {
    setLanguage(getLanguageNameFromCode(contextTranslationLanguage));
  }, [contextTranslationLanguage]);
  const [translationFontSize, setTranslationFontSize] = useState(
    contextTranslationFontSize
  );
  const [viewType, setViewType] = useState(contextViewType);
  const [quranAudio, setQuranAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [rhythm, setRhythm] = useState(1.0);
  const [reciter, setReciter] = useState(() => {
    const savedReciter = localStorage.getItem("reciter");
    return savedReciter || "al-afasy";
  });

  const languages = [
    "Malayalam",
    "English",
    "Hindi",
    "Bangla",
    "Urdu",
    "Tamil",
  ];
  const reciters = [
    { value: "al-afasy", label: "Mishari Rashid al-`Afasy" },
    { value: "al-ghamidi", label: "Saad Al Ghamidi" },
    { value: "al-hudaify", label: "Al-Hudaify" },
  ];

  const viewTypeAvailable = VIEW_TYPE_SUPPORTED_LANGUAGES.includes(contextTranslationLanguage);

  useEffect(() => {
    setViewType(contextViewType);
  }, [contextViewType]);

  useEffect(() => {
    if (!VIEW_TYPE_SUPPORTED_LANGUAGES.includes(contextTranslationLanguage) && (contextViewType !== "Ayah Wise" || viewType !== "Ayah Wise")) {
      setViewType("Ayah Wise");
      setContextViewType("Ayah Wise");
    }
  }, [contextTranslationLanguage, contextViewType, viewType, setContextViewType]);

  const handleReset = () => {
    setTheme("Light");
    if (contextTheme === "dark") {
      toggleTheme();
    }
    setQuranFont("Amiri Quran");
    setContextQuranFont("Amiri Quran");
    setFontSize(26);
    setContextFontSize(26);
    setLanguage("Malayalam");
    setContextTranslationLanguage("mal");
    setTranslationFontSize(12);
    setContextTranslationFontSize(12);
    setViewType("Ayah Wise");
    setContextViewType("Ayah Wise");
    setQuranAudio(true);
    setPlaybackSpeed(1.0);
    setRhythm(1.0);
    setReciter("al-afasy");
    localStorage.setItem("reciter", "al-afasy");
  };

  const handleSave = () => {
    // Save font settings to context
    setContextQuranFont(quranFont);
    setContextFontSize(fontSize);
    setContextTranslationFontSize(translationFontSize);
    const normalizedViewType = viewTypeAvailable ? viewType : "Ayah Wise";
    setViewType(normalizedViewType);
    setContextViewType(normalizedViewType);
    // Save reciter to localStorage
    localStorage.setItem("reciter", reciter);
if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[200]"
        onClick={onClose}
      ></div>
      
      {/* Settings Panel */}
      <div className="fixed inset-y-0 right-0 z-[210] flex flex-col w-[342px] bg-white dark:bg-[#2A2C38] font-poppins shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 shadow-md border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-normal text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-5">
          {/* Theme */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-normal text-gray-900 mb-3 dark:text-white">
              Theme
            </h3>

            {/* Wrapper */}
            <div className="flex rounded-full bg-gray-100 p-1 dark:bg-gray-950 w-full max-w-sm">
              {/* Light Button */}
              <button
                onClick={() => {
                  setTheme("Light");
                  if (contextTheme === "dark") {
                    toggleTheme();
                  }
                }}
                className={`flex items-center justify-center space-x-2 px-4 py-2 flex-1 rounded-full transition-all ${
                  theme === "Light"
                    ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-white"
                }`}
              >
                <Sun size={18} />
                <span className="text-sm font-medium">Light</span>
              </button>

              {/* Dark Button */}
              <button
                onClick={() => {
                  setTheme("Dark");
                  if (contextTheme === "light") {
                    toggleTheme();
                  }
                }}
                className={`flex items-center justify-center space-x-2 px-4 py-2 flex-1 rounded-full transition-all ${
                  theme === "Dark"
                    ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-white"
                }`}
              >
                <Moon size={18} />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>

          {/* Quran Font */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-3">
              Quran Font
            </h3>

            <div className="flex rounded-full bg-gray-100 dark:bg-gray-950 p-1 w-full max-w-sm">
              {/* ScheherazadeNew Button */}
              <button
                onClick={() => setQuranFont("ScheherazadeNew-Regular")}
                className={`flex-1 px-4 py-2 rounded-full transition-all text-center text-sm font-medium ${
                  quranFont === "ScheherazadeNew-Regular"
                    ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                Scheherazade
              </button>

              {/* Amiri Quran Button */}
              <button
                onClick={() => setQuranFont("Amiri Quran")}
                className={`flex-1 px-4 py-2 rounded-full transition-all text-center text-sm font-medium ${
                  quranFont === "Amiri Quran"
                    ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                Amiri Quran
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">
                Font Size
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                  className="p-2 rounded-lg transition-colors dark:text-white dark:border-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minus size={18} />
                </button>
                <span className="font-medium text-lg w-12 text-center dark:text-white">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize(Math.min(48, fontSize + 1))}
                  className="p-2 bg-[#B3B3B3] rounded-full transition-colors dark:bg-white dark:text-black dark:border-0 hover:bg-[#999999]"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div
              className="p-3 w-full bg-gray-50 rounded-lg text-center dark:bg-gray-950 mt-3"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: quranFont,
                direction: "rtl",
              }}
            >
              <p className="text-black dark:text-white" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-sm text-black dark:text-white mt-1" dir="rtl">
                (٧) وَلَا ٱلضَّآلِّينَ
              </p>
            </div>
          </div>

          {/* Language */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-normal text-gray-900 dark:text-white">Language</h3>
            <div className="relative flex items-center">
              <select
                value={language}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedCode = getLanguageCodeFromName(selectedName);
                  setLanguage(selectedName);
                  setContextTranslationLanguage(selectedCode);
                  if (!VIEW_TYPE_SUPPORTED_LANGUAGES.includes(selectedCode)) {
                    if (viewType !== "Ayah Wise") {
                      setViewType("Ayah Wise");
                    }
                    if (contextViewType !== "Ayah Wise") {
                      setContextViewType("Ayah Wise");
                    }
                  }
                }}
                className="w-[120px] h-[36px] pr-8 pl-3 border text-[#2AA0BF] 
                 dark:bg-[#323A3F] dark:border-none dark:text-[#4FAEC7] border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 appearance-none bg-white text-sm cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 
                 text-[#2AA0BF] dark:text-[#4FAEC7] pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Translation Font Size */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">
                Translation Font Size
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setTranslationFontSize(
                      Math.max(10, translationFontSize - 1)
                    )
                  }
                  className="p-2 rounded-lg transition-colors dark:text-white dark:border-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minus size={18} />
                </button>

                <span className="font-medium text-lg w-10 text-center dark:text-white">
                  {translationFontSize}
                </span>

                <button
                  onClick={() =>
                    setTranslationFontSize(
                      Math.min(19, translationFontSize + 1)
                    )
                  }
                  className="p-2 bg-[#B3B3B3] dark:bg-[#2A2C38] rounded-full transition-colors dark:text-white dark:border-0 hover:bg-[#999999]"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="bg-[#F8F9FA] p-3 rounded-lg h-[100px] w-full dark:bg-gray-950 mt-3">
              <p
                className="text-gray-600 dark:text-white"
                style={{ fontSize: `${translationFontSize}px` }}
              >
                Verse wise format in the Quran, establish prayer and spend out
                of what We have provided for them.
              </p>
            </div>
          </div>

          {/* View Type */}
          {viewTypeAvailable && (
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-normal text-gray-900 mb-3 dark:text-white">
              View Type
            </h3>
            <div className="flex rounded-full bg-gray-100 w-full p-1 dark:bg-gray-950">
              {/* Ayah Wise Button */}
              <button
                onClick={() => {
                  setViewType("Ayah Wise");
                  setContextViewType("Ayah Wise");
                }}
                className={`px-6 py-2 rounded-full flex-1 transition-all ${
                  viewType === "Ayah Wise"
                    ? "bg-white shadow text-gray-900 dark:text-white dark:border-0 dark:bg-[#2A2C38]"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                Ayah Wise
              </button>

              {/* Block Wise Button */}
              <button
                onClick={() => {
                  setViewType("Block Wise");
                  setContextViewType("Block Wise");
                }}
                className={`px-6 py-2 rounded-full flex-1 transition-all ${
                  viewType === "Block Wise"
                    ? "bg-white shadow text-gray-900 dark:text-white dark:border-0 dark:bg-[#2A2C38]"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                Block Wise
              </button>
            </div>
          </div>
          )}

          {/* Quran Audio */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">
                Quran Audio
              </h3>
              <button
                onClick={() => setQuranAudio(!quranAudio)}
                className="relative inline-flex h-[26px] w-[47px] items-center rounded-full bg-gray-200 transition-colors duration-200 focus:outline-none"
              >
                <span
                  className={`inline-block h-[22px] w-[22px] transform rounded-full transition-all duration-200 ${
                    quranAudio
                      ? "translate-x-[22px] bg-[#2AA0BF] shadow-md"
                      : "translate-x-[2px] bg-white shadow-sm"
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Playback Speed */}
          <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white">
                Playback Speed
              </h3>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {playbackSpeed.toFixed(1)}x
              </span>
            </div>

            <div className="relative w-full">
              {/* Slider */}
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider relative z-10"
                style={{
                  background: `linear-gradient(to right, #2AA0BF ${
                    ((playbackSpeed - 0.5) / 1.5) * 100
                  }%, #e5e7eb ${((playbackSpeed - 0.5) / 1.5) * 100}%)`,
                }}
              />

              {/* Dots aligned on slider track */}
              <div className="absolute top-1/2 left-0 w-full flex justify-between px-[10px] -translate-y-1/2 pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-1.5 rounded-full"
                    style={{ background: "#757575" }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Reciter */}
          <div className="pb-2">
            <div className="flex flex-col space-y-2">
              {/* Label */}
              <label className="text-sm font-normal text-gray-700 dark:text-gray-300">
                Selected Reciter
              </label>

              {/* Select wrapper */}
              <div className="relative">
                <select
                  value={reciter}
                  onChange={(e) => {
                    setReciter(e.target.value);
                    localStorage.setItem("reciter", e.target.value);
                  }}
                  className="w-full text-base text-gray-900 
                   bg-white border border-gray-300 rounded-lg 
                   pl-3 pr-10 py-2.5 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   cursor-pointer appearance-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {reciters.map((rec) => (
                    <option
                      key={rec.value}
                      value={rec.value}
                      className="text-base font-normal text-gray-700 dark:text-gray-300"
                    >
                      {rec.label}
                    </option>
                  ))}
                </select>

                {/* Chevron Icon */}
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-500 dark:text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2C38] shadow-lg">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 
             text-[#2AA0BF] dark:text-white 
             rounded-lg transition-colors 
             shadow shadow-gray-300 dark:shadow-white/20 
             hover:text-gray-800 dark:hover:text-gray-200"
        >
          <span>Reset Settings</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-[#2AA0BF] dark:text-white text-white rounded-lg  t"
        >
          <span>Save Settings</span>
        </button>
      </div>
      </div>
    </>
  );
};

export default Settings;
