import React, { useState } from "react";
import { X, Sun, Moon, Minus, Plus, ChevronDown, RotateCcw, Save } from "lucide-react";

const Settings = ({ onClose }) => {
  const [theme, setTheme] = useState("Light");
  const [quranFont, setQuranFont] = useState("Uthmani");
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState("English");
  const [translationFontSize, setTranslationFontSize] = useState(12);
  const [viewType, setViewType] = useState("Ayah Wise");
  const [quranAudio, setQuranAudio] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [rhythm, setRhythm] = useState(1.0);
  const [reciter, setReciter] = useState("Mishari Rashid Al-Afasy, The quran");

  const languages = ["English", "Arabic", "Urdu", "French", "Spanish", "Turkish"];
  const reciters = [
    "Mishari Rashid Al-Afasy, The quran",
    "Abdul Basit Abdul Samad",
    "Saad Al Ghamdi",
    "Maher Al Mueaqly",
    "Ahmed Al Ajamy",
    "Yasser Al Dosari"
  ];

  const handleReset = () => {
    setTheme("Light");
    setQuranFont("Uthmani");
    setFontSize(16);
    setLanguage("English");
    setTranslationFontSize(12);
    setViewType("Ayah Wise");
    setQuranAudio(true);
    setPlaybackSpeed(1.0);
    setRhythm(1.0);
    setReciter("Mishari Rashid Al-Afasy, The quran");
  };

  const handleSave = () => {
    console.log("Settings saved");
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 shadow">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-10 max-w-4xl mx-auto">
          {/* Theme */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setTheme("Light")}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl border-2 transition-all ${
                  theme === "Light"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Sun size={20} />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme("Dark")}
                className={`flex items-center space-x-2 px-5 py-3 rounded-xl border-2 transition-all ${
                  theme === "Dark"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Moon size={20} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Quran Font */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quran Font</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setQuranFont("Uthmani")}
                className={`px-5 py-3 rounded-xl border-2 transition-all ${
                  quranFont === "Uthmani"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Uthmani
              </button>
              <button
                onClick={() => setQuranFont("Amiri")}
                className={`px-5 py-3 rounded-xl border-2 transition-all ${
                  quranFont === "Amiri"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Amiri
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Font Size</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-medium text-lg w-12 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center" style={{ fontSize: `${fontSize}px` }}>
              <p className="text-gray-800" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-sm text-gray-600 mt-1" dir="rtl">(٧) وَلَا ٱلضَّآلِّينَ</p>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Translation Font Size */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Translation Font Size</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTranslationFontSize(Math.max(10, translationFontSize - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="font-medium text-lg w-12 text-center">{translationFontSize}</span>
              <button
                onClick={() => setTranslationFontSize(Math.min(20, translationFontSize + 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Verse wise format in the Quran, establish prayer and spend out of what We have provided for them.
            </p>
          </div>

          {/* View Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">View Type</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setViewType("Ayah Wise")}
                className={`px-5 py-3 rounded-xl border-2 transition-all ${
                  viewType === "Ayah Wise"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Ayah Wise
              </button>
              <button
                onClick={() => setViewType("Block Wise")}
                className={`px-5 py-3 rounded-xl border-2 transition-all ${
                  viewType === "Block Wise"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Block Wise
              </button>
            </div>
          </div>

          {/* Quran Audio */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Quran Audio</h3>
              <button
                onClick={() => setQuranAudio(!quranAudio)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  quranAudio ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    quranAudio ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Playback Speed */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Playback Speed</h3>
              <span className="text-sm text-gray-600">{playbackSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Rhythm */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Rhythm</h3>
              <span className="text-sm text-gray-600">{rhythm.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rhythm}
              onChange={(e) => setRhythm(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Reciter */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reciter</h3>
            <div className="relative">
              <select
                value={reciter}
                onChange={(e) => setReciter(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {reciters.map((rec) => (
                  <option key={rec} value={rec}>
                    {rec}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 shadow">
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw size={18} />
          <span>Reset Settings</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Settings;
