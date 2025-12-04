import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Sun,
  Moon,
  Minus,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ToggleGroup from "../components/ToggleGroup";

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
    document.body.style.overflow = "hidden";
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
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
    return savedSpeed ? parseFloat(savedSpeed) : 1.0;
  });

  const [reciter, setReciter] = useState(() => {
    const savedReciter = localStorage.getItem("reciter");
    return savedReciter || "al-afasy";
  });

  // Listen for playback speed changes from other components (StickyAudioPlayer)
  useEffect(() => {
    const handlePlaybackSpeedChange = (event) => {
      const newSpeed = event.detail.playbackSpeed;
      if (newSpeed !== playbackSpeed) {
        setPlaybackSpeed(newSpeed);
      }
    };

    window.addEventListener('playbackSpeedChange', handlePlaybackSpeedChange);
    return () => {
      window.removeEventListener('playbackSpeedChange', handlePlaybackSpeedChange);
    };
  }, [playbackSpeed]);

  // Listen for reciter changes from other components (StickyAudioPlayer)
  useEffect(() => {
    const handleReciterChange = (event) => {
      const newReciter = event.detail.reciter;
      if (newReciter !== reciter) {
        setReciter(newReciter);
      }
    };

    window.addEventListener('reciterChange', handleReciterChange);
    return () => {
      window.removeEventListener('reciterChange', handleReciterChange);
    };
  }, [reciter]);

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

  // Save playback speed to localStorage when it changes and dispatch event
  useEffect(() => {
    localStorage.setItem("playbackSpeed", playbackSpeed.toString());
    // Dispatch event to sync with other components
    window.dispatchEvent(new CustomEvent('playbackSpeedChange', { detail: { playbackSpeed } }));
  }, [playbackSpeed]);

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
    localStorage.setItem("playbackSpeed", "1.0");
    setReciter("al-afasy");
    localStorage.setItem("reciter", "al-afasy");
    // Dispatch event to sync reciter with other components
    window.dispatchEvent(new CustomEvent('reciterChange', { detail: { reciter: "al-afasy" } }));
  };

  const handleSave = () => {
    setContextQuranFont(quranFont);
    setContextFontSize(fontSize);
    setContextTranslationFontSize(translationFontSize);
    const normalizedViewType = viewTypeAvailable ? viewType : "Ayah Wise";
    setViewType(normalizedViewType);
    setContextViewType(normalizedViewType);
    localStorage.setItem("reciter", reciter);
    localStorage.setItem("playbackSpeed", playbackSpeed.toString());
    // Dispatch event to sync reciter with other components
    window.dispatchEvent(new CustomEvent('reciterChange', { detail: { reciter } }));
    if (onClose) onClose();
  };

  // Portal Root
  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
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

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* Theme */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Theme</h3>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => {
                  setTheme("Light");
                  if (contextTheme === "dark") toggleTheme();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${theme === "Light"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button
                onClick={() => {
                  setTheme("Dark");
                  if (contextTheme === "light") toggleTheme();
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${theme === "Dark"
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>

          {/* Quran Font */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quran Font</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuranFont("ScheherazadeNew-Regular")}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${quranFont === "ScheherazadeNew-Regular"
                    ? "border-primary bg-primary/5 text-primary dark:border-primary dark:bg-primary/10 dark:text-primary-light"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                Scheherazade
              </button>
              <button
                onClick={() => setQuranFont("Amiri Quran")}
                className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${quranFont === "Amiri Quran"
                    ? "border-primary bg-primary/5 text-primary dark:border-primary dark:bg-primary/10 dark:text-primary-light"
                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                Amiri Quran
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Arabic Font Size</h3>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${((fontSize - 12) / (48 - 12)) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setFontSize(Math.min(48, fontSize + 1))}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
              <p
                className="text-gray-900 dark:text-white leading-relaxed transition-all duration-200"
                style={{ fontFamily: quranFont, fontSize: `${fontSize}px` }}
                dir="rtl"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Translation Language</h3>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedCode = getLanguageCodeFromName(selectedName);
                  setLanguage(selectedName);
                  setContextTranslationLanguage(selectedCode);
                  if (!VIEW_TYPE_SUPPORTED_LANGUAGES.includes(selectedCode)) {
                    if (viewType !== "Ayah Wise") setViewType("Ayah Wise");
                    if (contextViewType !== "Ayah Wise") setContextViewType("Ayah Wise");
                  }
                }}
                className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Translation Font Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Translation Size</h3>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{translationFontSize}px</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTranslationFontSize(Math.max(10, translationFontSize - 1))}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${((translationFontSize - 10) / (19 - 10)) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setTranslationFontSize(Math.min(19, translationFontSize + 1))}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <p
                className="text-gray-700 dark:text-gray-300 transition-all duration-200"
                style={{ fontSize: `${translationFontSize}px` }}
              >
                In the name of Allah, the Entirely Merciful, the Especially Merciful.
              </p>
            </div>
          </div>

          {/* View Type */}
          {viewTypeAvailable && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View Type</h3>
              <div className="flex justify-center">
                <ToggleGroup
                  options={["Ayah Wise", "Block Wise"]}
                  value={viewType}
                  onChange={(val) => {
                    setViewType(val);
                    setContextViewType(val);
                  }}
                />
              </div>
            </div>
          )}

          {/* Audio Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Audio Settings</h3>

            {/* Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Quran Audio</span>
              <button
                onClick={() => setQuranAudio(!quranAudio)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${quranAudio ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${quranAudio ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Speed</span>
                <span>{playbackSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Reciter */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Reciter</label>
              <div className="relative">
                <select
                  value={reciter}
                  onChange={(e) => {
                    const newReciter = e.target.value;
                    setReciter(newReciter);
                    localStorage.setItem("reciter", newReciter);
                    // Dispatch event to sync with other components
                    window.dispatchEvent(new CustomEvent('reciterChange', { detail: { reciter: newReciter } }));
                  }}
                  className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {reciters.map((rec) => (
                    <option key={rec.value} value={rec.value}>{rec.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark shadow-lg shadow-primary/20 transition-colors"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>,
    modalRoot
  );
};

export default Settings;
