import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  X,
  NotepadText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchSurahs } from "../api/apifunction";
import { useAuth } from "../context/AuthContext";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../context/ThemeContext";

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
  interpretationData, // Add interpretationData prop to get interpretation text for copying
  selectedQari,
  onQariChange,
}) => {
  const { translationLanguage } = useTheme();
  const [visible, setVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [verseDropdownOpen, setVerseDropdownOpen] = useState(false);
  const [allSurahs, setAllSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Helper function to extract plain text from HTML
  const extractPlainText = (content) => {
    if (content == null) return "";
    if (typeof content !== "string") return String(content);
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      return tempDiv.textContent || tempDiv.innerText || "";
    }
    return content.replace(/<[^>]+>/g, " ");
  };

  // Helper function to extract interpretation text from data item
  const extractInterpretationText = (item) => {
    if (!item || typeof item !== "object") return "";

    // For Malayalam, check AudioIntrerptn first (from quranaya endpoint)
    // Then check the mapped Interpretation field
    const preferredKeys = [
      "AudioIntrerptn",  // Malayalam quranaya endpoint field (check first)
      "Interpretation",  // Mapped field from apifunction
      "interpretation",
      "AudioText",       // Also from quranaya endpoint
      "interpret_text",
      "InterpretText",
      "Interpret_Text",
      "text",
      "Text",
      "content",
      "Content",
      "meaning",
      "Meaning",
      "body",
      "Body",
      "desc",
      "Desc",
      "description",
      "Description",
    ];

    // Try each preferred key
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0) {
        return item[key];
      }
    }

    // Fallback: find any string field with substantial content
    // Lower the threshold for Malayalam data which might have shorter fields
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 10) {
        // Skip common non-content fields
        if (!["InterpretationNo", "Interpretation_No", "interptn_no", "contiayano", "ayaid", "Ayaid", "suraid", "pageid", "QAudioUrl", "TransUrl", "InterPtnUrl", "ASuraName"].includes(k)) {
          return v;
        }
      }
    }

    return "";
  };

  const handleCopy = async () => {
    if (!verseData && !interpretationData) {
      showError("No data available to copy");
      return;
    }

    try {
      // Build text to copy: Arabic text, translation, and interpretation
      const parts = [];
      
      // Add Arabic text
      if (verseData?.arabic) {
        parts.push(verseData.arabic);
      }
      
      // Add translation
      if (verseData?.translation) {
        parts.push(verseData.translation);
      }

      // Add interpretation(s)
      if (interpretationData) {
        const interpretationTexts = [];
        
        if (Array.isArray(interpretationData)) {
          interpretationData.forEach((item, index) => {
            // Handle string items directly
            if (typeof item === "string" && item.trim().length > 0) {
              const plainText = extractPlainText(item);
              if (plainText.trim()) {
                const prefix = interpretationData.length > 1 
                  ? `Interpretation ${index + 1}:\n` 
                  : "Interpretation:\n";
                interpretationTexts.push(prefix + plainText.trim());
              }
            } else if (item && typeof item === "object") {
              const interpretationText = extractInterpretationText(item);
              if (interpretationText) {
                const plainText = extractPlainText(interpretationText);
                if (plainText.trim()) {
                  // Add interpretation number if multiple interpretations
                  const prefix = interpretationData.length > 1 
                    ? `Interpretation ${index + 1}:\n` 
                    : "Interpretation:\n";
                  interpretationTexts.push(prefix + plainText.trim());
                }
              }
            }
          });
        } else if (typeof interpretationData === "string") {
          // Handle string interpretation data directly
          const plainText = extractPlainText(interpretationData);
          if (plainText.trim()) {
            interpretationTexts.push("Interpretation:\n" + plainText.trim());
          }
        } else if (typeof interpretationData === "object") {
          const interpretationText = extractInterpretationText(interpretationData);
          if (interpretationText) {
            const plainText = extractPlainText(interpretationText);
            if (plainText.trim()) {
              interpretationTexts.push("Interpretation:\n" + plainText.trim());
            }
          }
        }

        if (interpretationTexts.length > 0) {
          parts.push(interpretationTexts.join("\n\n"));
        } else {
          // Debug: log if interpretation data exists but no text was extracted
          console.warn("Interpretation data exists but no text extracted:", interpretationData);
        }
      }

      // If no content, try to create a basic text
      if (parts.length === 0) {
        const surahName = surahInfo?.name || surahInfo?.arabic || `Surah ${surahId}`;
        parts.push(`${surahName}, Verse ${verseId}`);
      }

      const textToCopy = parts.join("\n\n---\n\n");

      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      showSuccess("Verse and interpretation copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy verse:", error);
      showError("Failed to copy verse. Please try again.");
    }
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
                    <span 
                      className={
                        translationLanguage === 'ur' ? 'font-urdu-nastaliq' : 
                        translationLanguage === 'mal' ? 'font-malayalam' : ''
                      }
                      style={translationLanguage === 'mal' ? { fontFamily: "'NotoSansMalayalam'" } : {}}
                    >
                      {surah.number} - {surah.name}
                    </span>
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
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            title="Copy"
          >
            {copied ? (
              <span className="text-green-500 font-bold text-xs">Copied!</span>
            ) : (
              <NotepadText className="w-4 sm:w-5 h-4 sm:h-5 dark:text-white text-gray-600" />
            )}
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
