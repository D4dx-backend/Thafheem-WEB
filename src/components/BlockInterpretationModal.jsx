import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  fetchInterpretationRange,
  fetchInterpretation,
  listSurahNames,
  fetchNoteById,
  fetchSurahs,
} from "../api/apifunction";
import NotePopup from "./NotePopup";
import AyahModal from "./AyahModal";
import InterpretationNavbar from "./InterpretationNavbar";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";

const BlockInterpretationModal = ({
  surahId,
  range,
  interpretationNo = 1,
  language = "en",
  onClose,
}) => {
  const { user } = useAuth?.() || { user: null };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahDisplayName, setSurahDisplayName] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: "", content: null });
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [ayahTarget, setAyahTarget] = useState({
    surahId: null,
    verseId: null,
  });
  const contentRefs = useRef([]);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [surahOptions, setSurahOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [currentSurahId, setCurrentSurahId] = useState(surahId);
  const [currentRange, setCurrentRange] = useState(range);
  const [currentInterpretationNo, setCurrentInterpretationNo] =
    useState(interpretationNo);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  // Load surah name and options
  useEffect(() => {
    const loadSurahData = async () => {
      try {
        const names = await listSurahNames();
        setSurahOptions(
          names.map((n) => ({
            value: n.id,
            label: `${n.id}- ${n.english || "Surah"}`,
          }))
        );
        const found = names.find((s) => s.id === Number(currentSurahId));
        setSurahDisplayName(`${currentSurahId}- ${found?.english || "Surah"}`);
      } catch (err) {
        setSurahDisplayName(`${currentSurahId}- Surah`);
      }
    };

    if (currentSurahId) {
      loadSurahData();
    }
  }, [currentSurahId]);

  // Build range options for current surah (1..total ayahs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const surahs = await fetchSurahs();
        if (!mounted) return;
        const current = surahs.find((s) => s.number === Number(currentSurahId));
        const total = current?.ayahs || 286;
        const allAyahs = Array.from({ length: total }, (_, i) => String(i + 1));
        setRangeOptions(allAyahs);
      } catch (e) {
        // fallback to 1..50
        if (mounted)
          setRangeOptions(Array.from({ length: 50 }, (_, i) => String(i + 1)));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentSurahId]);

  // Load interpretation content
  useEffect(() => {
    const loadInterpretation = async () => {
      if (!currentSurahId || !currentRange) return;

      try {
        setLoading(true);
        setError(null);
        setContent([]);

        console.log(
          `Loading interpretation: Surah ${currentSurahId}, Range ${currentRange}, Interpretation ${currentInterpretationNo}`
        );

        // Decide between single verse vs range (e.g., "5" vs "1-7")
        const isSingle = /^\d+$/.test(currentRange);
        const data = isSingle
          ? await fetchInterpretation(
              currentSurahId,
              parseInt(currentRange, 10),
              currentInterpretationNo,
              currentLanguage
            )
          : await fetchInterpretationRange(
              currentSurahId,
              currentRange,
              currentInterpretationNo,
              currentLanguage
            );

        console.log(
          `Received interpretation data for ${currentSurahId}:${currentRange}:`,
          data
        );

        // Normalize to array of items with a text/content field
        const items = Array.isArray(data) ? data : [data];
        setContent(items);
      } catch (err) {
        console.error("Failed to load interpretation:", err);
        let errorMessage = "Failed to load interpretation";
        if (err.message?.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.message?.includes("404")) {
          errorMessage = "Interpretation not found for this selection.";
        } else if (
          err.message?.includes("network") ||
          err.message?.includes("fetch")
        ) {
          errorMessage = "Network error. Please check your connection.";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInterpretation();
  }, [currentSurahId, currentRange, currentInterpretationNo, currentLanguage]);

  // Enhanced styling for note and verse markers
  const applySimpleStyling = () => {
    contentRefs.current.forEach((el) => {
      if (!el) return;

      // Handle existing sup/a tags - set data attributes and remove conflicting inline styles
      const markers = el.querySelectorAll("sup, a");
      markers.forEach((m) => {
        const text = (m.innerText || m.textContent || "").trim();
        if (!text) return;

        // Remove any existing inline styles that might interfere with CSS hover
        m.style.removeProperty("color");
        m.style.removeProperty("text-decoration");
        m.style.removeProperty("cursor");
        m.style.removeProperty("font-weight");

        // Apply data attributes for CSS styling and set click handlers
        if (/^N\d+$/.test(text)) {
          // Note references
          m.setAttribute("data-type", "note");
          m.setAttribute("data-value", text);
          m.onclick = handleNoteHighlightClick;
        } else if (
          /^\(?\d+\s*[:：]\s*\d+\)?$/.test(text) ||
          /^\d+\s*[:：]\s*\d+$/.test(text) ||
          /അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(text) ||
          /സൂക്തം:\s*\d+\s+\d+:\d+/.test(text)
        ) {
          // Verse references
          m.setAttribute("data-type", "verse");
          m.setAttribute("data-value", text);
          m.onclick = handleNoteHighlightClick;
        }
      });
    });
  };

  // Apply simple styling when content changes
  useEffect(() => {
    if (content.length > 0) {
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [content]);

  // Re-apply styling when popup closes
  useEffect(() => {
    if (!isNoteOpen && !showAyahModal && content.length > 0) {
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [isNoteOpen, showAyahModal]);

  // Fallback note content for when API fails
  const getFallbackNoteContent = (noteId) => {
    const fallbackNotes = {
      N895: `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N895</h3>
          <p>ലാത്ത് - ഇത് ഒരു പ്രാചീന അറബ് ദേവതയുടെ പേരാണ്. ഇസ്ലാമിന് മുമ്പുള്ള അറേബ്യയിൽ ഈ ദേവതയെ ആരാധിച്ചിരുന്നു.</p>
          <p>ഖുർആനിൽ ഈ ദേവതയെ പരാമർശിക്കുന്നത് ബഹുദൈവവാദത്തിന്റെ തെറ്റിനെ വിശദീകരിക്കാനാണ്.</p>
        </div>
      `,
      N189: `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N189</h3>
          <p>ഉസ്സ - ഇതും ഒരു പ്രാചീന അറബ് ദേവതയാണ്. ലാത്ത്, ഉസ്സ, മനാത് എന്നിവ മക്കയിലെ പ്രധാന ദേവതകളായിരുന്നു.</p>
          <p>ഇവയെ "അല്ലാഹുവിന്റെ പുത്രിമാർ" എന്ന് അവർ വിളിച്ചിരുന്നു.</p>
        </div>
      `,
    };

    return fallbackNotes[noteId] || null;
  };

  const handleNoteClick = async (noteId) => {
    // Show loading state immediately
    setSelectedNote({ id: noteId, content: "Loading..." });
    setIsNoteOpen(true);

    // Try to get fallback content first (for immediate display)
    const fallbackContent = getFallbackNoteContent(noteId);
    if (fallbackContent) {
      setSelectedNote({ id: noteId, content: fallbackContent });
    }

    try {
      // Try to fetch from API (but don't block the UI)
      const noteData = await fetchNoteById(noteId);

      // Try different possible content fields
      const content =
        noteData?.content ||
        noteData?.html ||
        noteData?.text ||
        noteData?.body ||
        noteData?.description ||
        noteData?.note ||
        (typeof noteData === "string" ? noteData : null);

      if (content && content !== "Note content not available") {
        setSelectedNote({ id: noteId, content });
      }
    } catch (err) {
      // Error fetching note - only log non-500 and non-network errors to reduce console noise
      if (
        !err.message?.includes("500") &&
        !err.message?.includes("Network error")
      ) {
        console.warn(`Failed to fetch note ${noteId}:`, err.message);
      }

      // If no fallback content was set, show a user-friendly error
      if (!fallbackContent) {
        setSelectedNote({
          id: noteId,
          content: `
            <div class="note-content">
              <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${noteId}</h3>
              <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            </div>
          `,
        });
      }
    }
  };

  // Direct click handler for note-highlight elements
  const handleNoteHighlightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const type = target.getAttribute("data-type");
    const value = target.getAttribute("data-value");
    const idText = target.innerText || target.textContent || "";

    if (!idText) return;

    // Use data attributes if available, otherwise fall back to text parsing
    if (type === "verse" || type === "range") {
      // Handle verse/range navigation
      const textToCheck = value || idText;

      // Check for Malayalam verse pattern first
      const malayalamMatch =
        textToCheck.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
        textToCheck.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
      if (malayalamMatch) {
        const [, s, v] = malayalamMatch;
        setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
        setShowAyahModal(true);
        return;
      }

      // Check for standard verse pattern
      const verseMatch = textToCheck.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);
      if (verseMatch) {
        const [, s, v] = verseMatch;
        setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
        setShowAyahModal(true);
        return;
      }
    } else if (type === "note") {
      // Handle note navigation
      const noteId = value || idText;
      handleNoteClick(noteId);
      return;
    }

    // Fallback: detect patterns in text
    const malayalamMatch =
      idText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
      idText.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
    if (malayalamMatch) {
      const [, s, v] = malayalamMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }

    const verseMatch = idText.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);
    if (verseMatch) {
      const [, s, v] = verseMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }

    // Otherwise treat as note id
    handleNoteClick(idText);
  };

  const handleContentClick = (e) => {
    const target = e.target;

    // Simple click detection for sup/a tags
    if (target.tagName === "SUP" || target.tagName === "A") {
      handleNoteHighlightClick(e);
      return;
    }

    // Fallback: text-based detection
    const clickedText = target.innerText || target.textContent || "";

    // Look for note patterns first (PRIORITY)
    const noteMatch = clickedText.match(/N(\d+)/);
    if (noteMatch) {
      const noteId = `N${noteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }

    // Look for Malayalam verse patterns first
    const malayalamMatch =
      clickedText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
      clickedText.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
    if (malayalamMatch) {
      const [, s, v] = malayalamMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }

    // Look for standard verse patterns
    const verseMatch = clickedText.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);
    if (verseMatch) {
      const [, s, v] = verseMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
  };

  // Navbar handler functions
  const handlePickSurah = (value) => {
    setCurrentSurahId(parseInt(value, 10));
  };

  const handlePickRange = (value) => {
    setCurrentRange(String(value));
  };

  const handlePrev = () => {
    // if range is a single ayah, decrement; if a-b, move to previous block
    const current = String(currentRange);
    if (/^\d+$/.test(current)) {
      const v = Math.max(1, parseInt(current, 10) - 1);
      setCurrentRange(String(v));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;
        const newA = Math.max(1, a - len);
        const newB = newA + len - 1;
        setCurrentRange(`${newA}-${newB}`);
      }
    }
  };

  const handleNext = () => {
    const current = String(currentRange);
    if (/^\d+$/.test(current)) {
      const nextVerse = parseInt(current, 10) + 1;
      setCurrentRange(String(nextVerse));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;
        const newA = a + len;
        const newB = newA + len - 1;
        setCurrentRange(`${newA}-${newB}`);
      }
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const userId = BookmarkService.getEffectiveUserId(user);

      // Use the new block interpretation bookmark method
      await BookmarkService.addBlockInterpretationBookmark(
        userId,
        currentSurahId,
        currentRange,
        surahDisplayName,
        currentInterpretationNo,
        currentLanguage
      );

      alert(
        `Saved interpretation for Surah ${currentSurahId}, verses ${currentRange}`
      );
    } catch (e) {
      console.error("Failed to bookmark interpretation", e);
      alert("Failed to save interpretation bookmark");
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  const handleShare = async () => {
    const shareText = `Interpretation ${currentInterpretationNo} — Surah ${currentSurahId} • Range ${currentRange}`;
    const shareUrl = `${window.location.origin}/interpretation-blockwise?surahId=${currentSurahId}&range=${currentRange}&ipt=${currentInterpretationNo}&lang=${currentLanguage}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title || "Thafheem",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copied to clipboard");
      }
    } catch (e) {
      console.error("Share failed", e);
      alert("Share failed: " + e.message);
    }
  };

  const handleWordByWord = () => {
    // Extract the first verse from the range for word-by-word view
    const firstVerse = /^\d+/.exec(String(currentRange))?.[0] || "1";

    // Since we're in a modal, we'll open the word-by-word in a new tab/window
    const wordByWordUrl = `/word-by-word/${currentSurahId}/${firstVerse}`;
    window.open(wordByWordUrl, "_blank");
  };

  const extractText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    // Common possible fields
    const preferredKeys = [
      "interpret_text",
      "interpretation",
      "text",
      "content",
      "meaning",
      "body",
      "desc",
      "description",
    ];
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0)
        return item[key];
    }
    // Fallback: first long string field
    for (const [, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) return v;
    }
    // Final fallback
    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  };

  return (
    <>
      <style>
        {`
        /* Specific styling for note and verse markers in interpretation content */
        .interpretation-content sup[data-type="note"], 
        .interpretation-content a[data-type="note"],
        .interpretation-content sup[data-type="verse"], 
        .interpretation-content a[data-type="verse"] {
          transition: all 0.2s ease !important;
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
        }
        
        .interpretation-content sup[data-type="note"]:hover, 
        .interpretation-content a[data-type="note"]:hover,
        .interpretation-content sup[data-type="verse"]:hover, 
        .interpretation-content a[data-type="verse"]:hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        
        /* Fallback for elements without data-type but with note/verse patterns */
        .interpretation-content sup:not([data-type]), 
        .interpretation-content a:not([data-type]) {
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
        }
        
        .interpretation-content sup:not([data-type]):hover, 
        .interpretation-content a:not([data-type]):hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        `}
      </style>

      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
          {/* Interpretation Navbar */}
          <InterpretationNavbar
            interpretationNumber={currentInterpretationNo}
            surahName={surahDisplayName}
            verseRange={currentRange.replace(/-/g, " - ")}
            onClose={onClose}
            onBookmark={handleBookmark}
            onShare={handleShare}
            onWordByWord={handleWordByWord}
            bookmarking={isBookmarking}
            surahOptions={surahOptions}
            rangeOptions={rangeOptions}
            onPickSurah={handlePickSurah}
            onPickRange={handlePickRange}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading interpretation...
                </p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 text-lg mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && content.length === 0 && (
              <div className="text-center py-10 text-gray-600 dark:text-gray-300">
                No interpretation found for this selection.
              </div>
            )}

            {/* Header controls (read-only display) */}
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
              <span>Surah: {currentSurahId}</span>
              <span>• Range: {currentRange}</span>
              <span>• Interpretation: {currentInterpretationNo}</span>
              <span>• Lang: {currentLanguage}</span>
            </div>

            {/* Interpretation Content */}
            <div className="space-y-6">
              {content.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-6 rounded-lg border-l-4 dark:bg-[#2A2C38] dark:border-[#2A2C38] border-white"
                >
                  <div
                    className="interpretation-content text-gray-800 dark:text-white leading-relaxed text-justify whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                    ref={(el) => (contentRefs.current[idx] = el)}
                    onClick={handleContentClick}
                    style={{
                      pointerEvents: "auto",
                      position: "relative",
                      zIndex: 1,
                    }}
                    dangerouslySetInnerHTML={{ __html: extractText(item) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Note Popup */}
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        noteId={selectedNote.id}
        noteContent={selectedNote.content}
      />

      {/* Ayah Modal */}
      {showAyahModal && ayahTarget.surahId && ayahTarget.verseId && (
        <AyahModal
          surahId={ayahTarget.surahId}
          verseId={ayahTarget.verseId}
          onClose={() => setShowAyahModal(false)}
          interpretationNo={currentInterpretationNo}
          language={currentLanguage}
        />
      )}
    </>
  );
};

export default BlockInterpretationModal;
