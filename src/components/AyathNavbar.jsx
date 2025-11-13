import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  X,
  NotepadText,
  List,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSurahs } from "../api/apifunction";
import { useAuth } from "../context/AuthContext";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";

const AyathNavbar = ({
  surahId,
  verseId,
  totalVerses,
  surahInfo,
  onVerseChange,
  onSurahChange,
  onClose,
  onWordByWordClick,
  verseData, // Add verseData prop to get verse text for bookmarking
  selectedQari,
  onQariChange,
}) => {
  const [visible, setVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [verseDropdownOpen, setVerseDropdownOpen] = useState(false);
  const [allSurahs, setAllSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

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

  // Check if current verse is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (user && surahId && verseId) {
        try {
          const bookmarked = await BookmarkService.isBookmarked(
            user.uid,
            surahId,
            verseId,
            "interpretation"
          );
          setIsBookmarked(bookmarked);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };

    checkBookmarkStatus();
  }, [user, surahId, verseId]);

  // Generate verse numbers array
  const verseNumbers = Array.from(
    { length: totalVerses || 10 },
    (_, i) => i + 1
  );

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
}
    setVerseDropdownOpen(false);
  };

  const handleBookmark = async () => {
    // Check if user is authenticated
    if (!user) {
      navigate("/sign");
      return;
    }

    try {
      setBookmarkLoading(true);

      if (isBookmarked) {
        // Remove bookmark - we need to find the bookmark first
        const bookmarks = await BookmarkService.getBookmarks(
          user.uid,
          "interpretation"
        );
        const bookmark = bookmarks.find(
          (b) =>
            b.surahId === parseInt(surahId) && b.verseId === parseInt(verseId)
        );

        if (bookmark) {
          await BookmarkService.deleteBookmark(bookmark.id, user.uid);
          setIsBookmarked(false);
          showSuccess("Bookmark removed successfully");
        }
      } else {
        // Add bookmark
        const surahName =
          surahInfo?.name || surahInfo?.arabic || `Surah ${surahId}`;
        const verseText = verseData?.translation || verseData?.arabic || "";

        await BookmarkService.addBookmark(
          user.uid,
          surahId,
          verseId,
          "interpretation", // Use 'interpretation' type for AyathNavbar bookmarks
          surahName,
          verseText
        );

        setIsBookmarked(true);
        showSuccess("Verse bookmarked successfully");
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
      showError("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="bg-white dark:bg-gray-900 px-3 sm:px-4 py-3 space-y-3 relative">
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
                      surah.number === parseInt(surahId)
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
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
                      verse === parseInt(verseId)
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:bg-gray-950"
            title="Close"
            onClick={onClose || (() => navigate(-1))}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-row items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-2">
          {/* Language and Qari dropdowns removed as requested */}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg  transition-colors"
            title="Copy"
          >
            <NotepadText className="w-4 sm:w-5 h-4 sm:h-5 dark:text-white text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            onClick={handleBookmark}
            disabled={bookmarkLoading}
          >
            {bookmarkLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b border-current"></div>
            ) : (
              <Bookmark
                className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${
                  isBookmarked
                    ? "text-cyan-500 fill-cyan-500 dark:text-cyan-400 dark:fill-cyan-400"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              />
            )}
          </button>
          <button
            className="relative group p-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
            title="Word by Word"
            aria-label="Word by Word"
            onClick={() => onWordByWordClick && onWordByWordClick(verseId)}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-white dark:text-gray-900 z-50">
              Word by Word
            </span>
          </button>
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AyathNavbar;
