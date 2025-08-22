import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const SearchConsole = ({ onClose }) => {
  const [englishPhraseType, setEnglishPhraseType] = useState('Translation');
  const [englishPhraseSearch, setEnglishPhraseSearch] = useState('');
  const [arabicPhraseSearch, setArabicPhraseSearch] = useState('');
  const [quranSubjectSearch, setQuranSubjectSearch] = useState('');
  const [glossaryLanguage, setGlossaryLanguage] = useState('Arabic');
  const [glossarySearch, setGlossarySearch] = useState('');

  const handleSearch = () => {
    const searchData = {
      englishPhrase: {
        type: englishPhraseType,
        query: englishPhraseSearch
      },
      arabicPhrase: arabicPhraseSearch,
      quranSubject: quranSubjectSearch,
      glossary: {
        language: glossaryLanguage,
        query: glossarySearch
      }
    };
    
    console.log('Search data:', searchData);
    // Implement your search logic here
  };

  const handleAdvancedSearch = () => {
    console.log('Advanced search clicked');
    // Implement advanced search options
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg border border-gray-200">
      {/* Header Buttons */}
      <div className="p-4 flex space-x-3">
        <button
          onClick={handleSearch}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Search size={18} className="text-gray-600" />
        </button>
        <button
          onClick={handleAdvancedSearch}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <SlidersHorizontal size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="px-4 pb-4 space-y-6">
        {/* English Phrase Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">English phrase</h3>
          
          {/* Radio buttons */}
          <div className="flex items-center space-x-6 mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="Translation"
                checked={englishPhraseType === 'Translation'}
                onChange={(e) => setEnglishPhraseType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Translation</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="Interpretation"
                checked={englishPhraseType === 'Interpretation'}
                onChange={(e) => setEnglishPhraseType(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Interpretation</span>
            </label>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={englishPhraseSearch}
              onChange={(e) => setEnglishPhraseSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Arabic Phrase Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Arabic phrase</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={arabicPhraseSearch}
              onChange={(e) => setArabicPhraseSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              dir="rtl"
            />
          </div>
        </div>

        {/* Quran Subject Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Quran Subject</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={quranSubjectSearch}
              onChange={(e) => setQuranSubjectSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Glossary Search Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">Glossary Search</h3>
          
          {/* Radio buttons */}
          <div className="flex items-center space-x-6 mb-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="English"
                checked={glossaryLanguage === 'English'}
                onChange={(e) => setGlossaryLanguage(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">English</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="Arabic"
                checked={glossaryLanguage === 'Arabic'}
                onChange={(e) => setGlossaryLanguage(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Arabic</span>
            </label>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              dir={glossaryLanguage === 'Arabic' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSearch}
            className="flex-1 px-4 py-3 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchConsole;
