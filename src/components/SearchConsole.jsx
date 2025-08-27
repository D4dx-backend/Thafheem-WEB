import React, { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

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

    console.log("Search data:", searchData);
    // Implement your search logic here
  };

  const handleAdvancedSearch = () => {
    setActiveTab("advanced");
    console.log("Advanced search clicked");
    // Implement advanced search options
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#2A2C38] w-full max-w-sm mx-auto rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* Header Toggle Buttons */}
        <div className="p-4 flex justify-center">
          <div className="flex rounded-full bg-gray-100 dark:bg-black p-1 w-max">
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className={`px-6 py-2 rounded-full transition-all flex items-center justify-center ${
                activeTab === "search"
                  ? "bg-white shadow text-gray-900 dark:text-white dark:bg-[#2A2C38]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Search size={20} />
            </button>

            {/* Advanced Search Button */}
            <button
              onClick={handleAdvancedSearch}
              className={`px-6 py-2 rounded-full transition-all flex items-center justify-center ${
                activeTab === "advanced"
                  ? "bg-white shadow text-gray-900 dark:text-white dark:bg-[#2A2C38] "
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-6 space-y-6">
          {/* English Phrase Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-white mb-4 italic">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white"
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
            <h3 className="text-sm font-medium text-gray-500 mb-4 italic dark:text-white">
              Arabic phrase
            </h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-white text-gray-400"
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
            <h3 className="text-sm font-medium text-gray-500 dark:text-white mb-4 italic">
              Quran Subject
            </h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white"
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
            <h3 className="text-sm font-medium text-gray-500 dark:text-white mb-4 italic">
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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white"
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
  );
};

export default SearchConsole;
