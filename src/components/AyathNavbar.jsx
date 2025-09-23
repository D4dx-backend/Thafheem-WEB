import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  X
} from "lucide-react";
import WordByWordIcon from "./WordByWordIcon";
import { useNavigate } from "react-router-dom";
import { fetchSurahs } from "../api/apifunction";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";

const AyathNavbar = ({ 
  surahId, 
  verseId, 
  totalVerses, 
  surahInfo,
  onVerseChange,
  onSurahChange,
  onClose,
  onWordByWordClick,
  verseData = null, // Add verse data for bookmark/share
  showSuccess = null, // Add toast functions
  showError = null,
}) => {
  const [visible, setVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [verseDropdownOpen, setVerseDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [allSurahs, setAllSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth?.() || { user: null };

  const languages = ["English", "Malayalam", "Arabic"];

  // Fetch all surahs for dropdown
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahs = await fetchSurahs();
        setAllSurahs(surahs);
      } catch (error) {
        console.error("Error loading surahs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  // Generate verse numbers array
  const verseNumbers = Array.from({ length: totalVerses || 10 }, (_, i) => i + 1);

  const currentSurahDisplay = surahInfo 
    ? `${surahInfo.number} - ${surahInfo.name || surahInfo.arabic}`
    : `${surahId} - Loading...`;

  const handleSurahChange = (newSurahId) => {
    if (onSurahChange) {
      onSurahChange(newSurahId);
    } else {
      // Navigate to surah page with verse 1
      navigate(`/surah/${newSurahId}`);
    }
    setIsDropdownOpen(false);
  };

  const handleVerseChange = (newVerseId) => {
    if (onVerseChange) {
      onVerseChange(newVerseId);
    } else {
      // Just update the verse in the current modal
      console.log(`Changing to verse ${newVerseId}`);
    }
    setVerseDropdownOpen(false);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setLanguageDropdownOpen(false);
    // You can add language-specific logic here if needed
    console.log(`Language changed to: ${language}`);
  };

  // Handle bookmark functionality
  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const userId = BookmarkService.getEffectiveUserId(user);
      const surahName = surahInfo?.arabic || surahInfo?.name || `Surah ${surahId}`;
      const verseText = verseData?.arabic || verseData?.translation || '';
      
      console.log('Bookmarking verse:', {
        userId,
        surahId,
        verseId,
        surahName,
        verseText: verseText.substring(0, 50) + '...'
      });
      
      const result = await BookmarkService.addBookmark(
        userId,
        surahId,
        verseId,
        'translation',
        surahName,
        verseText
      );
      
      console.log('Bookmark saved successfully:', result);
      
      // Show success toast
      if (showSuccess) {
        showSuccess(`Verse bookmarked successfully!`);
        console.log('Success toast triggered');
      } else {
        console.warn('showSuccess function not available');
      }
    } catch (error) {
      console.error("Failed to bookmark verse:", error);
      // Show error toast
      if (showError) {
        showError('Failed to save bookmark. Please try again.');
        console.log('Error toast triggered');
      } else {
        console.warn('showError function not available');
      }
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      const surahName = surahInfo?.arabic || surahInfo?.name || `Surah ${surahId}`;
      const arabicText = verseData?.arabic || '';
      const translation = verseData?.translation || '';
      
      // Create shareable content
      let shareText = `${surahName}, Verse ${verseId}\n\n`;
      if (arabicText) {
        shareText += `Arabic: ${arabicText}\n\n`;
      }
      if (translation) {
        shareText += `Translation: ${translation}\n\n`;
      }
      shareText += `Shared from Thafheem - Quran Study`;
      const shareUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: `${surahName}, Verse ${verseId}`,
          text: shareText,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        const shareMessage = `${shareText}\n\nView full content: ${shareUrl}`;
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareMessage);
          if (showSuccess) {
            showSuccess('Verse content copied to clipboard for sharing');
          }
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
          if (showSuccess) {
            showSuccess('Verse content copied to clipboard for sharing');
          }
        }
      }
    } catch (error) {
      console.error('Failed to share verse:', error);
      if (error.name !== 'AbortError' && showError) {
        showError('Failed to share verse: ' + error.message);
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
        onClick={onClose || (() => navigate(-1))}
      >
        <X className="w-4 h-4 text-gray-600 dark:text-white" />
      </button>

      {/* First Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:space-x-3 pr-12 sm:pr-0">
          {/* Chapter Selector with Dropdown */}
          <div className="relative">
  <button
    onClick={() => setIsDropdownOpen((prev) => !prev)}
    className="flex font-poppins items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
  >
    <span>{currentSurahDisplay}</span>
    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
  </button>

  {isDropdownOpen && !loading && (
    <div className="absolute sm:text-sm text-sm top-full left-0 mt-2 bg-white dark:bg-[#2A2C38] shadow-lg rounded-lg overflow-auto w-80 sm:w-45 h-[calc(100vh-100px)] z-50">
      {allSurahs.map((surah) => (
        <div
          key={surah.number}
          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white ${
            surah.number === parseInt(surahId) ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
          onClick={() => handleSurahChange(surah.number)}
        >
          {surah.number} - {surah.name}
        </div>
      ))}
    </div>
  )}
</div>

          {/* Verse Selector */}
          <div className="relative">
  <button
    onClick={() => setVerseDropdownOpen((prev) => !prev)}
    className="flex font-poppins items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
  >
    <span> {verseId}</span>
    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
  </button>

  {verseDropdownOpen && (
    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-[#2A2C38] shadow-lg rounded-lg overflow-auto w-auto max-h-60 z-50">
      {verseNumbers.map((verse) => (
        <div
          key={verse}
          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white ${
            verse === parseInt(verseId) ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
          onClick={() => handleVerseChange(verse)}
        >
           {verse}
        </div>
      ))}
    </div>
  )}
</div>

        </div>

        {/* Close Button */}
        <div className="hidden sm:flex items-center">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-white"
            title="Close"
            onClick={onClose || (() => navigate(-1))}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="relative">
          <button 
            onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            className="flex font-poppins items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-[#323A3F] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
          >
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white" />
          </button>
          
          {/* Language Dropdown */}
          {languageDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#323A3F] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50">
              {languages.map((language) => (
                <button
                  key={language}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                    language === selectedLanguage ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => handleLanguageChange(language)}
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Word by Word"
            onClick={() => onWordByWordClick && onWordByWordClick(verseId)}
          >
            <WordByWordIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Share verse content"
          >
            <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AyathNavbar;
