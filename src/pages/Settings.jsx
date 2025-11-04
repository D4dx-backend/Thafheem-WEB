import React, { useState } from "react";
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
  } = useTheme();
  const [theme, setTheme] = useState(
    contextTheme === "dark" ? "Dark" : "Light"
  );
  const [quranFont, setQuranFont] = useState(contextQuranFont);
  const [fontSize, setFontSize] = useState(contextFontSize);
  const [language, setLanguage] = useState("English");
  const [translationFontSize, setTranslationFontSize] = useState(
    contextTranslationFontSize
  );
  const [viewType, setViewType] = useState(contextViewType);
  const [quranAudio, setQuranAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [rhythm, setRhythm] = useState(1.0);
  const [reciter, setReciter] = useState("Mishari Rashid Al-Afasy, The quran");

  const languages = [
    "English",
    "Arabic",
    "Urdu",
    "French",
    "Spanish",
    "Turkish",
  ];
  const reciters = [
    "Mishari Rashid Al-Afasy, The quran",
    "Abdul Basit Abdul Samad",
    "Saad Al Ghamdi",
    "Maher Al Mueaqly",
    "Ahmed Al Ajamy",
    "Yasser Al Dosari",
  ];

  const handleReset = () => {
    setTheme("Light");
    if (contextTheme === "dark") {
      toggleTheme();
    }
    setQuranFont("Amiri Quran");
    setContextQuranFont("Amiri Quran");
    setFontSize(26);
    setContextFontSize(26);
    setLanguage("English");
    setTranslationFontSize(12);
    setContextTranslationFontSize(12);
    setViewType("Ayah Wise");
    setContextViewType("Ayah Wise");
    setQuranAudio(true);
    setPlaybackSpeed(1.0);
    setRhythm(1.0);
    setReciter("Mishari Rashid Al-Afasy, The quran");
  };

  const handleSave = () => {
    // Save font settings to context
    setContextQuranFont(quranFont);
    setContextFontSize(fontSize);
    setContextTranslationFontSize(translationFontSize);
    setContextViewType(viewType);
    console.log("Settings saved");
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[100] flex flex-col w-[342px] bg-white dark:bg-[#2A2C38] font-poppins">
      {/* Header */}
      {/* <div className="flex items-center justify-between p-6 border-b border-gray-200 "> */}
      <div className="flex items-center justify-between p-6 shadow-md">
        <h2 className="text-2xl text-gray-900 dark:text-white">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1  overflow-y-auto p-2">
        <div className="space-y-10 max-w-4xl mx-auto">
          {/* Theme */}
          {/* Theme */}

          <div className="border-b border-gray-200 dark:border-black  pb-4 mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              Theme
            </h3>

            {/* Wrapper */}
            <div className="flex rounded-full bg-gray-100 p-1 dark:bg-gray-950 w-[287px] max-w-sm mx-auto">
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
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quran Font
            </h3>

            <div className="flex rounded-full bg-gray-100 dark:bg-gray-950 p-1 w-[287px] max-w-sm">
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

              {/* Uthmani HAFS Button */}
              <button
                onClick={() => setQuranFont("UthmaniHAFS")}
                className={`flex-1 px-4 py-2 rounded-full transition-all text-center text-sm font-medium ${
                  quranFont === "UthmaniHAFS"
                    ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                Uthmani HAFS
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-gray-900 dark:text-white">
                Font Size
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                  className="p-2  rounded-lg  transition-colors dark:text-white dark:border-0 "
                >
                  <Minus size={18} />
                </button>
                <span className="font-medium text-lg w-12 text-center dark:text-white">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize(Math.min(48, fontSize + 1))}
                  className="p-2 bg-[#B3B3B3] rounded-full  transition-colors dark:bg-white dark:text-black dark:border-0 "
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div
              className="mt-4 p-4 w-[310px] bg-gray-50 rounded-lg text-center dark:bg-gray-950 mx-auto"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: quranFont === "UthmaniHAFS" ? "UthmaniHAFS" : quranFont,
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-gray-900 dark:text-white">Language</h3>
            <div className="relative flex items-center">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-[98px] h-[32px] pr-8 border text-[#2AA0BF] 
                 dark:bg-[#323A3F] dark:border-none dark:text-[#4FAEC7] border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 appearance-none bg-white text-center"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 transform -translate-y-1/2 
                 text-[#2AA0BF] dark:text-[#225B6A] pointer-events-none"
                size={16}
              />
            </div>
          </div>

          {/* Translation Font Size */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg  text-gray-900 dark:text-white">
                Translation Font Size
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setTranslationFontSize(
                      Math.max(10, translationFontSize - 1)
                    )
                  }
                  className="p-2  rounded-lg  transition-colors dark:text-white dark:border-0 "
                >
                  <Minus size={18} />
                </button>

                <span className="font-medium text-lg w-10 text-center dark:text-white">
                  {translationFontSize}
                </span>

                <button
                  onClick={() =>
                    setTranslationFontSize(
                      Math.min(20, translationFontSize + 1)
                    )
                  }
                  className="p-2  bg-[#B3B3B3] dark:bg-[#2A2C38] rounded-full  transition-colors dark:text-white dark:border-0 "
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="border-b border-black  pb-4 mb-4">
              <div className="bg-[#F8F9FA] mt-5 p-2 rounded-sm h-[100px] w-[310px] dark:bg-gray-950 ">
                <p
                  className="text-gray-600 mt-2 dark:text-white"
                  style={{ fontSize: `${translationFontSize}px` }}
                >
                  Verse wise format in the Quran, establish prayer and spend out
                  of what We have provided for them.
                </p>
              </div>
            </div>
          </div>

          {/* View Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
              View Type
            </h3>
            <div className="flex rounded-full bg-gray-100 w-[287px] p-1 dark:bg-gray-950">
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

          {/* Quran Audio */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg  text-black dark:text-white">
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
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Playback Speed
              </h3>
              <span className="text-sm text-gray-600">
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
          <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-950">
            <div className="flex flex-col space-y-1">
              {/* Label */}
              <label className="text-sm font-medium text-gray-500">
                Selected Reciter
              </label>

              {/* Select wrapper */}
              <div className="relative ">
                <select
                  value={reciter}
                  onChange={(e) => setReciter(e.target.value)}
                  className="w-full text-lg  text-gray-900 
                   bg-transparent border border-gray-300 rounded-lg 
                   pl-3 pr-10 py-2 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   cursor-pointer appearance-none dark:border-none dark:text-white"
                >
                  {reciters.map((rec) => (
                    <option
                      key={rec}
                      value={rec}
                      className="text-base font-normal text-gray-700"
                    >
                      {rec}
                    </option>
                  ))}
                </select>

                {/* Chevron Icon */}
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-500 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 shadow dark:bg-[#2A2C38] dark:border-0">
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

      {/* <style jsx>{`
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2AA0BF;
    cursor: pointer;
    border: none;
  }
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #2AA0BF;
    cursor: pointer;
    border: none;
  }
`}</style> */}

    </div>
  );
};

export default Settings;
