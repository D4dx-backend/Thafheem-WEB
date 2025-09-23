import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  BookOpen,

  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSurahs } from "../api/apifunction";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";

const WordNavbar = ({
  surahId,
  selectedVerse,
  surahInfo,
  onNavigate,
  onClose,
  onShowAyahModal,
  onSurahChange,
  onVerseChange,
  onLanguageChange,
  wordData = null, // Add wordData prop for bookmark/share content
  showSuccess = null, // Add toast functions
  showError = null,
}) => {
  const [visible, setVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [surahs, setSurahs] = useState([]);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [showVerseDropdown, setShowVerseDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth?.() || { user: null };

  const languages = ["English", "Malayalam", "Arabic"];
  const totalVerses = surahInfo?.ayahs || 0;

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await fetchSurahs();
        setSurahs(surahsData);
      } catch (error) {
        console.error("Failed to load surahs:", error);
      }
    };
    loadSurahs();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowSurahDropdown(false);
        setShowVerseDropdown(false);
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSurahSelect = (selectedSurah) => {
    setShowSurahDropdown(false);
    if (onSurahChange) {
      onSurahChange(selectedSurah.number);
    }
  };

  const handleVerseSelect = (verseNumber) => {
    setShowVerseDropdown(false);
    if (onVerseChange) {
      onVerseChange(verseNumber);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  // Generate verse numbers array
  const verseNumbers = Array.from({ length: totalVerses }, (_, i) => i + 1);

  // Handle bookmark functionality
  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const userId = BookmarkService.getEffectiveUserId(user);
      const surahName = surahInfo?.name || `Surah ${surahId}`;
      const verseText = wordData?.text_uthmani || wordData?.translations?.[0]?.text || '';
      
      await BookmarkService.addBookmark(
        userId,
        surahId,
        selectedVerse,
        'word-by-word',
        surahName,
        verseText
      );
      
      // Show success toast
      if (showSuccess) {
        showSuccess(`Word-by-word content bookmarked successfully!`);
      }
    } catch (error) {
      console.error("Failed to bookmark word-by-word content:", error);
      // Show error toast
      if (showError) {
        showError('Failed to save bookmark. Please try again.');
      }
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      const surahName = surahInfo?.name || `Surah ${surahId}`;
      const verseText = wordData?.text_uthmani || wordData?.translations?.[0]?.text || '';
      const translation = wordData?.translations?.[0]?.text || '';
      
      // Create shareable content
      let shareText = `Word by Word - ${surahName}, Verse ${selectedVerse}\n\n`;
      shareText += `Arabic: ${verseText}\n\n`;
      if (translation) {
        shareText += `Translation: ${translation}\n\n`;
      }
      
      // Add word-by-word breakdown if available
      if (wordData?.words && wordData.words.length > 0) {
        shareText += `Word Breakdown:\n`;
        wordData.words.slice(0, 5).forEach((word, index) => {
          const arabicWord = word.text_uthmani || word.text_simple || '';
          const meaning = word.translation?.text || 'N/A';
          shareText += `${index + 1}. ${arabicWord} - ${meaning}\n`;
        });
        if (wordData.words.length > 5) {
          shareText += `... and ${wordData.words.length - 5} more words\n`;
        }
        shareText += '\n';
      }
      
      shareText += `Shared from Thafheem - Word by Word Study`;
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: `Word by Word - ${surahName}, Verse ${selectedVerse}`,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        const shareMessage = `${shareText}\n\nView full content: ${shareUrl}`;
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareMessage);
          alert('Word-by-word content copied to clipboard for sharing');
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = shareMessage;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Word-by-word content copied to clipboard for sharing');
        }
      }
    } catch (error) {
      console.error('Failed to share word-by-word content:', error);
      if (error.name !== 'AbortError') {
        alert('Failed to share content: ' + error.message);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="bg-white dark:bg-[#2A2C38] px-3 sm:px-4 py-3 space-y-3 relative">
      {/* Mobile Close Button - Positioned absolute on mobile */}
      <button
        className="absolute top-2 right-2 sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors bg-white dark:bg-gray-600 shadow-sm z-10"
        title="Close"
        onClick={() => navigate(-1)}
      >
        <X className="w-4 h-4 text-gray-600 dark:text-white" />
      </button>

      {/* First Row - Chapter/Verse Selectors and Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        {/* Left side - Chapter and Verse Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-3 pr-12 sm:pr-0">
          {/* Chapter Selector */}
          <div className="relative dropdown-container">
            <button 
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
              onClick={() => setShowSurahDropdown(!showSurahDropdown)}
            >
              <span>
                {surahId
                  ? `${surahId} - ${surahInfo?.name || "Loading..."}`
                  : "Select Surah"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
            
            {/* Surah Dropdown */}
            {showSurahDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white dark:bg-[#323A3F] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                {surahs.map((surah) => (
                  <button
                    key={surah.number}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                    onClick={() => handleSurahSelect(surah)}
                  >
                    <div className="flex justify-between items-center">
                      <span>{surah.number} - {surah.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{surah.ayahs} verses</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verse Selector */}
          <div className="relative dropdown-container">
            <button 
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
              onClick={() => setShowVerseDropdown(!showVerseDropdown)}
            >
              <span>{selectedVerse || "1"}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
            
            {/* Verse Dropdown */}
            {showVerseDropdown && (
              <div className="absolute top-full left-0 mt-1 w-32 max-h-60 overflow-y-auto bg-white dark:bg-[#323A3F] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                {verseNumbers.map((verseNumber) => (
                  <button
                    key={verseNumber}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                      verseNumber === selectedVerse ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleVerseSelect(verseNumber)}
                  >
                    {verseNumber}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Action buttons (Desktop only close button) */}
        <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-auto">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Ayah Details"
            onClick={() => onShowAyahModal && onShowAyahModal(selectedVerse)}
          >
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarking
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={isBookmarking ? "Saving..." : "Bookmark this verse"}
          >
            <Bookmark className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Share word-by-word content"
          >
            <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {/* Desktop Close Button */}
          {onClose && (
            <button
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-white"
              title="Close"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Second Row - Language Selector and Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Center - Navigation */}
   
        <div className="relative dropdown-container">
            <button 
              className="flex font-poppins items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
            </button>
            
            {/* Language Dropdown */}
            {showLanguageDropdown && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#323A3F] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
                {languages.map((language) => (
                  <button
                    key={language}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                      language === selectedLanguage ? 'bg-blue-100 dark:bg-blue-900' : ''
                    }`}
                    onClick={() => handleLanguageSelect(language)}
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>
        {/* Right side - Empty space for alignment */}
        <div className="hidden sm:block w-[140px]"></div>
      </div>
    </div>
  );
};

export default WordNavbar;
