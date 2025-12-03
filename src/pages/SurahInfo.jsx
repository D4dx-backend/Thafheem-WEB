import { ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { fetchCompleteSurahInfo, fetchNoteById } from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import NotePopup from "../components/NotePopup";

const SurahInfo = () => {
  const { surahId } = useParams(); // Get surah ID from URL
  const { translationLanguage } = useTheme();
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [shareStatus, setShareStatus] = useState(null);
  const [notePopupState, setNotePopupState] = useState({
    isOpen: false,
    noteId: null,
    loading: false,
    error: null,
    content: null,
  });
  const shareResetRef = useRef(null);

  useEffect(() => {
    return () => {
      if (shareResetRef.current) {
        clearTimeout(shareResetRef.current);
      }
    };
  }, []);

  const setShareStatusWithTimeout = useCallback(
    (status) => {
      setShareStatus(status);
      if (shareResetRef.current) {
        clearTimeout(shareResetRef.current);
      }
      if (status) {
        shareResetRef.current = setTimeout(
          () => setShareStatus(null),
          2500
        );
      }
    },
    [shareResetRef]
  );

  // Helper function to clean HTML content
  const cleanHtmlContent = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Extract text content (automatically removes all HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace and return
    return textContent.replace(/\s+/g, ' ').trim();
  };

  // Function to parse content into sections based on headings
  const parseContentSections = (htmlString) => {
    if (!htmlString) return [];
    
    const sections = [];
    
    // Split by h2 tags to create sections
    const parts = htmlString.split(/<h2[^>]*>/);
    
    parts.forEach((part, index) => {
      if (index === 0 && !part.includes('</h2>')) {
        // First part before any h2 tag
        if (part.trim()) {
          const cleanContent = cleanHtmlContent(part);
          if (cleanContent) {
            sections.push({
              title: 'Introduction',
              content: cleanContent
            });
          }
        }
      } else {
        // Parts that start after h2 tags
        const h2End = part.indexOf('</h2>');
        if (h2End !== -1) {
          const title = part.substring(0, h2End).trim();
          const content = part.substring(h2End + 5).trim();
          const cleanContent = cleanHtmlContent(content);
          
          if (title && cleanContent) {
            sections.push({
              title: cleanHtmlContent(title),
              content: cleanContent
            });
          }
        }
      }
    });
    
    return sections;
  };

  useEffect(() => {
    const loadSurahInfo = async () => {
      try {
        setLoading(true);
        const data = await fetchCompleteSurahInfo(surahId, translationLanguage);
        setSurahInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSurahInfo();
  }, [surahId, translationLanguage]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Surah information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">
            Failed to load Surah information
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Parse Thafheem content into sections if available
  const getPrefaceParagraphs = useMemo(
    () => (htmlString) => {
      if (!htmlString) return [];
      return htmlString
        .replace(/\r\n/g, "\n")
        .replace(/\t+/g, " ")
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
    },
    []
  );

  const parsedThafheemSections = surahInfo?.thafheem?.PrefaceText 
    ? parseContentSections(surahInfo.thafheem.PrefaceText)
    : [];

  const malayalamPrefaceSections = Array.isArray(
    surahInfo?.thafheem?.PrefaceSections
  )
    ? surahInfo.thafheem.PrefaceSections.filter(
        (section) =>
          (section?.subtitle && section.subtitle.trim()) ||
          (section?.text && section.text.trim())
      )
    : [];

  const shouldShowMalayalamPrefaceOnly =
    translationLanguage === "mal" && malayalamPrefaceSections.length > 0;

  const getAllContentAsText = useCallback(() => {
    if (!surahInfo) return "";

    const surahName =
      surahInfo?.basic?.name_simple ||
      surahInfo?.surah?.name ||
      `Surah ${surahId}`;
    const arabicName =
      surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || "";

    let content = `${surahName}\n`;
    if (arabicName) {
      content += `${arabicName}\n\n`;
    }

    content += `Revelation: ${
      surahInfo?.basic?.revelation_place ||
      surahInfo?.thafheem?.SuraType ||
      surahInfo?.surah?.type ||
      "Unknown"
    }\n`;
    content += `Revelation Order: ${
      surahInfo?.basic?.revelation_order ||
      surahInfo?.thafheem?.RevOrder ||
      "Unknown"
    }\n`;
    content += `Verses: ${
      surahInfo?.basic?.verses_count ||
      surahInfo?.thafheem?.TotalAyas ||
      surahInfo?.surah?.ayahs ||
      "Unknown"
    }\n`;

    if (surahInfo?.thafheem) {
      content += `Thafheem Vol: ${
        surahInfo.thafheem.ThafVolume || "Unknown"
      }\n`;
      content += `Type: ${surahInfo.thafheem.SuraType || "Unknown"}\n`;
    }
    content += "\n";

    if (surahInfo?.detailed?.short_text) {
      content += `OVERVIEW\n${cleanHtmlContent(
        surahInfo.detailed.short_text
      )}\n\n`;
    }

    if (surahInfo?.detailed?.text) {
      content += `DETAILED INFORMATION\n${cleanHtmlContent(
        surahInfo.detailed.text
      )}\n\n`;
    }

    if (parsedThafheemSections.length > 0) {
      content += `THAFHEEM COMMENTARY\n\n`;
      parsedThafheemSections.forEach((section) => {
        content += `${section.title}\n${section.content}\n\n`;
      });
    }

    if (
      !surahInfo?.detailed?.text &&
      parsedThafheemSections.length === 0
    ) {
      content += `BASIC INFORMATION\n\n`;
      if (surahInfo?.basic?.translated_name?.name) {
        content += `English Name: ${surahInfo.basic.translated_name.name}\n`;
      }
      if (surahInfo?.basic?.name_simple) {
        content += `Simple Name: ${surahInfo.basic.name_simple}\n`;
      }
      if (surahInfo?.basic?.revelation_place) {
        content += `Place of Revelation: ${surahInfo.basic.revelation_place}\n`;
      }
      if (surahInfo?.basic?.pages) {
        content += `Pages: ${surahInfo.basic.pages[0]} to ${surahInfo.basic.pages[1]}\n`;
      }
    }

    content += `\n— ${surahName} (Surah ${surahId})`;
    return content;
  }, [surahId, surahInfo, parsedThafheemSections]);

  const handlePrefaceContentClick = (event) => {
    if (translationLanguage !== "mal") {
      return;
    }

    const clickable = event.target.closest("sup, a");
    if (!clickable) {
      return;
    }

    const rawText = (clickable.innerText || clickable.textContent || "").trim();
    if (!rawText) {
      return;
    }

    let handled = false;
    const normalized = rawText.replace(/[\s()]+/g, "").toUpperCase();

    // Handle notes with prefixes: N (Note), H (Hadith/Hadith reference), B (Book/Book reference)
    if (/^[NHB]\d+$/.test(normalized)) {
      handled = true;
      openNotePopup(normalized);
    } else {
      const verseMatch = rawText.match(/(\d+)\s*[:：]\s*(\d+)/);
      if (verseMatch) {
        const surahRef = parseInt(verseMatch[1], 10);
        const ayahRef = parseInt(verseMatch[2], 10);
        if (Number.isFinite(surahRef) && Number.isFinite(ayahRef)) {
          handled = true;
          navigate(`/reading/${surahRef}?verse=${ayahRef}`);
        }
      }
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleShare = async () => {
    if (!surahInfo) return;
    if (typeof navigator === "undefined") {
      setShareStatusWithTimeout("error");
      return;
    }

    const surahName =
      surahInfo?.basic?.name_simple ||
      surahInfo?.surah?.name ||
      `Surah ${surahId}`;
    const shareText = getAllContentAsText();
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/surah/${surahId}`
        : "";
    const shareData = {
      title: `${surahName} - Surah Information`,
      text: shareText,
      url: shareUrl || undefined,
    };

    try {
      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        setShareStatusWithTimeout("shared");
      } else {
        const fallbackContent = shareUrl
          ? `${shareText}\n\nRead more: ${shareUrl}`
          : shareText;
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(fallbackContent);
          setShareStatusWithTimeout("copied");
        } else {
          setShareStatusWithTimeout("error");
        }
      }
    } catch (error) {
      console.error("Error sharing Surah information:", error);
      setShareStatusWithTimeout("error");
    }
  };

  const openNotePopup = async (noteId) => {
    setNotePopupState({
      isOpen: true,
      noteId,
      loading: true,
      error: null,
      content: null,
    });

    try {
      const data = await fetchNoteById(noteId);
      setNotePopupState((prev) => ({
        ...prev,
        loading: false,
        content:
          (data && (data.NoteText || data.html || data.content || data.text)) ||
          data ||
          "Note content unavailable.",
      }));
    } catch (fetchError) {
      setNotePopupState((prev) => ({
        ...prev,
        loading: false,
        error:
          fetchError?.message ||
          "Unable to load this note at the moment. Please try again.",
      }));
    }
  };

  return (
    <>
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white px-3 sm:px-4 lg:px-6 py-4 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center">
            <Link to={`/surah/${surahId}`}>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-3 sm:mr-4">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-white" />
              </button>
            </Link>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
              {surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              disabled={!surahInfo}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Share Surah information"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {shareStatus && (
              <span
                className={`text-xs sm:text-sm ${
                  shareStatus === "error"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {shareStatus === "copied"
                  ? "Copied"
                  : shareStatus === "shared"
                  ? "Shared"
                  : "Share failed"}
              </span>
            )}
          </div>
        </div>
      </div>
 
      {/* Content */}
      <div className="w-full max-w-[1290px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Arabic Title */}
        <div className="text-center mb-6 sm:mb-8 border-b border-gray-200 dark:border-white pb-4 sm:pb-6 font-poppins">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-arabic text-black mb-4 sm:mb-6 dark:text-white px-2">
            {surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || `Surah ${surahId}`}
          </h2>
          
          <div>
            <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-15 gap-y-2 sm:gap-y-4 text-xs sm:text-sm text-center">
              <div>
                <span className="text-black dark:text-white">Revelation: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.revelation_place || 
                   surahInfo?.thafheem?.SuraType || 
                   surahInfo?.surah?.type || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-black dark:text-white">Revelation Order: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.revelation_order || surahInfo?.thafheem?.RevOrder || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-black dark:text-white">Verses: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.verses_count || 
                   surahInfo?.thafheem?.TotalAyas || 
                   surahInfo?.surah?.ayahs || 'Unknown'}
                </span>
              </div>
            </div>

            {surahInfo?.thafheem && (
              <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-15 gap-y-2 sm:gap-y-4 mt-2 sm:mt-4">
                <div>
                  <span className="text-black dark:text-white text-xs sm:text-sm">Thafheem Vol: </span>
                  <span className="font-semibold text-black dark:text-white text-xs sm:text-sm">
                    {surahInfo.thafheem.ThafVolume || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-black dark:text-white text-xs sm:text-sm">Type: </span>
                  <span className="font-semibold text-black dark:text-white text-xs sm:text-sm">
                    {surahInfo.thafheem.SuraType || 'Unknown'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="font-poppins">
          {/* Malayalam Thafheem Preface */}
          {shouldShowMalayalamPrefaceOnly && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Thafheem Preface (Malayalam)
              </h3>
              {translationLanguage === "mal" && (
                <style>
                  {`
                    .surah-preface-content sup.f-noteno,
                    .surah-preface-content a.crs {
                      color: #2AA0BF !important;
                      cursor: pointer !important;
                      text-decoration: none !important;
                    }

                    .surah-preface-content sup.f-noteno:hover,
                    .surah-preface-content a.crs:hover {
                      text-decoration: underline !important;
                    }
                  `}
                </style>
              )}
              <div
                className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0 space-y-4 surah-preface-content"
                onClick={handlePrefaceContentClick}
              >
                {malayalamPrefaceSections.map((section, index) => {
                  const paragraphs = getPrefaceParagraphs(section.text);
                  return (
                    <div key={index} className="space-y-3">
                      {section.subtitle ? (
                        <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-cyan-500">
                          {section.subtitle}
                        </h4>
                      ) : null}
                      {paragraphs.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="mb-2 sm:mb-3"
                          dangerouslySetInnerHTML={{ __html: paragraph }}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Overview from Quran.com API */}
          {!shouldShowMalayalamPrefaceOnly && surahInfo?.detailed?.short_text && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0">
                {cleanHtmlContent(surahInfo.detailed.short_text)}
              </p>
            </div>
          )}

          {/* Detailed Information from Quran.com API */}
          {!shouldShowMalayalamPrefaceOnly && surahInfo?.detailed?.text && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Detailed Information
              </h3>
              <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0 space-y-4">
                {cleanHtmlContent(surahInfo.detailed.text).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Thafheem Commentary - Properly parsed sections (hidden for Malayalam to avoid duplication) */}
          {!shouldShowMalayalamPrefaceOnly && parsedThafheemSections.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Thafheem Commentary
              </h3>
              <div className="space-y-6">
                {parsedThafheemSections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-cyan-500 mb-2 sm:mb-3">
                      {section.title}
                    </h4>
                    <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0">
                      {section.content.split('\n').filter(p => p.trim()).map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-3 sm:mb-4">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback content with basic info */}
          {!surahInfo?.detailed?.text && parsedThafheemSections.length === 0 && !shouldShowMalayalamPrefaceOnly && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Basic Information
              </h3>
              <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0 space-y-4">
                {surahInfo?.basic?.translated_name?.name && (
                  <p>
                    <strong>English Name:</strong> {surahInfo.basic.translated_name.name}
                  </p>
                )}
                {surahInfo?.basic?.name_simple && (
                  <p>
                    <strong>Simple Name:</strong> {surahInfo.basic.name_simple}
                  </p>
                )}
                {surahInfo?.basic?.revelation_place && (
                  <p>
                    <strong>Place of Revelation:</strong> {surahInfo.basic.revelation_place}
                  </p>
                )}
                {surahInfo?.basic?.pages && (
                  <p>
                    <strong>Pages:</strong> {surahInfo.basic.pages[0]} to {surahInfo.basic.pages[1]}
                  </p>
                )}
                
                {/* If no detailed info available */}
                {!surahInfo?.basic?.translated_name && (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Detailed information for this Surah is not available at the moment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <NotePopup
      isOpen={notePopupState.isOpen}
      noteId={notePopupState.noteId}
      noteContent={notePopupState.content}
      loading={notePopupState.loading}
      error={notePopupState.error}
      onClose={() =>
        setNotePopupState((prev) => ({ ...prev, isOpen: false }))
      }
    />
    </>
  );
};

export default SurahInfo;