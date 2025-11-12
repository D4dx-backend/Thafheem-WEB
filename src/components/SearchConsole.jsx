import React, { useEffect, useState } from "react";
import { Search,  X } from "lucide-react";

const SearchConsole = ({ onClose }) => {
  const [englishPhraseType, setEnglishPhraseType] = useState("Translation");
  const [englishPhraseSearch, setEnglishPhraseSearch] = useState("");
  const [arabicPhraseSearch, setArabicPhraseSearch] = useState("");
  const [quranSubjectSearch, setQuranSubjectSearch] = useState("");
  const [glossaryLanguage, setGlossaryLanguage] = useState("Arabic");
  const [glossarySearch, setGlossarySearch] = useState("");

  // ✅ Missing state for toggle
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = () => {
    setActiveTab("search");
    const searchData = {
      englishPhrase: {
        type: englishPhraseType,
        query: englishPhraseSearch,
      },
      arabicPhrase: arabicPhraseSearch,
      quranSubject: quranSubjectSearch,
      glossary: {
        language: glossaryLanguage,
        query: glossarySearch,
      },
    };

// Implement your search logic here
  };

  const handleAdvancedSearch = () => {
    setActiveTab("advanced");
// Implement advanced search options
  };
  const SlidersHorizontal = ({ className }) => (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.5 5.47656H2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 10.4766H2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 15.4766H2.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.166 15.4766C15.5467 15.4766 16.666 14.3573 16.666 12.9766C16.666 11.5959 15.5467 10.4766 14.166 10.4766C12.7853 10.4766 11.666 11.5959 11.666 12.9766C11.666 14.3573 12.7853 15.4766 14.166 15.4766Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.4993 16.3099L15.916 14.7266"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[200]"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 right-0 z-[210] w-full max-w-xs sm:max-w-sm md:max-w-[360px] bg-white dark:bg-[#2A2C38] font-poppins shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Search</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Header Toggle Buttons */}
        <div className="px-4 sm:px-5 pt-4">
          <div className="flex justify-center">
            <div className="flex rounded-full bg-gray-100 dark:bg-black p-1 w-full max-w-[250px]">
              {/* Search Button */}
              <button
                onClick={handleSearch}
                className={`px-6 py-2 rounded-full transition-all flex items-center justify-center w-[134px] ${
                  activeTab === "search"
                    ? "bg-white shadow text-gray-900 dark:text-white dark:bg-[#2A2C38]"
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                <Search size={20} />
              </button>

              {/* Advanced Search Button */}
              <button
                onClick={handleAdvancedSearch}
                className={`px-6 py-2 rounded-full transition-all flex items-center justify-center w-[134px] ${
                  activeTab === "advanced"
                    ? "bg-white shadow text-gray-900 dark:text-white dark:bg-[#2A2C38] "
                    : "text-gray-600 hover:text-gray-800 dark:text-white"
                }`}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-6">
          <div className="mt-6 space-y-5">
            {/* English Phrase Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                English phrase
              </h3>

              {/* Radio buttons */}
              <div className="flex items-center space-x-8 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Translation"
                    checked={englishPhraseType === "Translation"}
                    onChange={(e) => setEnglishPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 dark:text-white dark:focus:ring-white focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Translation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Interpretation"
                    checked={englishPhraseType === "Interpretation"}
                    onChange={(e) => setEnglishPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-white dark:text-white dark:focus:ring-white"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Interpretation</span>
                </label>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={englishPhraseSearch}
                  onChange={(e) => setEnglishPhraseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:text-white dark:bg-black dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Arabic Phrase Section */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4 italic dark:text-white">
                Arabic phrase
              </h3>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={arabicPhraseSearch}
                  onChange={(e) => setArabicPhraseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm dark:bg-black dark:text-white dark:placeholder-white bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Quran Subject Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                Quran Subject
              </h3>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={quranSubjectSearch}
                  onChange={(e) => setQuranSubjectSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-black dark:text-white dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Glossary Search Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                Glossary Search
              </h3>

              {/* Radio buttons */}
              <div className="flex items-center space-x-8 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="English"
                    checked={glossaryLanguage === "English"}
                    onChange={(e) => setGlossaryLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">English</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Arabic"
                    checked={glossaryLanguage === "Arabic"}
                    onChange={(e) => setGlossaryLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Arabic</span>
                </label>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-black dark:text-white dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  dir={glossaryLanguage === "Arabic" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchConsole;
