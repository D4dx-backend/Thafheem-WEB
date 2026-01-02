import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Copy, Share2, X } from "lucide-react";
import { fetchCompleteSurahInfo, fetchNoteById } from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import NotePopup from "./NotePopup";

const SurahInfoModal = ({ surahId, onClose }) => {
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const { translationLanguage } = useTheme();
  const navigate = useNavigate();
  const [notePopupState, setNotePopupState] = useState({
    isOpen: false,
    noteId: null,
    loading: false,
    error: null,
    content: null,
  });

  // Helper function to clean HTML content
  const cleanHtmlContent = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.replace(/\s+/g, ' ').trim();
  };

  useEffect(() => {
    const loadSurahInfo = async () => {
      if (!surahId) return;
      try {
        setLoading(true);
        setError(null);
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

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  // Parse HTML content into titled sections (keeps <h2> headings from API)
  const parseContentSections = useMemo(
    () => (htmlString) => {
      if (!htmlString) return [];

      const sections = [];
      const parts = htmlString.split(/<h2[^>]*>/);

      parts.forEach((part, index) => {
        if (index === 0 && !part.includes("</h2>")) {
          // Intro text before any h2
          const intro = cleanHtmlContent(part);
          if (intro) {
            sections.push({ title: "Introduction", content: intro });
          }
        } else {
          const h2End = part.indexOf("</h2>");
          if (h2End !== -1) {
            const title = part.substring(0, h2End).trim();
            const content = part.substring(h2End + 5).trim();
            const cleanContent = cleanHtmlContent(content);

            if (cleanHtmlContent(title) || cleanContent) {
              sections.push({
                title: cleanHtmlContent(title) || "Section",
                content: cleanContent,
              });
            }
          }
        }
      });

      return sections;
    },
    []
  );

  const parsedThafheemSections = surahInfo?.thafheem?.PrefaceText
    ? parseContentSections(surahInfo.thafheem.PrefaceText)
    : [];

  // Fallback: parse detailed.text (chapter-info) into sections if preface not available
  const parsedDetailedSections =
    !parsedThafheemSections.length && surahInfo?.detailed?.text
      ? parseContentSections(surahInfo.detailed.text)
      : [];

  // Metric helpers
  const revelationPlace =
    surahInfo?.basic?.revelation_place ||
    surahInfo?.thafheem?.SuraType ||
    surahInfo?.surah?.type ||
    "Unknown";

  const revelationOrder =
    surahInfo?.basic?.revelation_order ||
    surahInfo?.thafheem?.RevOrder ||
    surahInfo?.surah?.revelation_order ||
    "Unknown";

  const versesCount =
    surahInfo?.basic?.verses_count ||
    surahInfo?.thafheem?.TotalAyas ||
    surahInfo?.surah?.ayahs ||
    "Unknown";

  const thafheemVolume = (() => {
    const vol =
      surahInfo?.thafheem?.ThafVolume ||
      surahInfo?.basic?.ThafVolume ||
      null;
    if (!vol || vol === "0") return "—";
    return vol;
  })();

  const malayalamPrefaceSections = Array.isArray(surahInfo?.thafheem?.PrefaceSections)
    ? surahInfo.thafheem.PrefaceSections.filter(
      (section) => (section?.subtitle && section.subtitle.trim()) || (section?.text && section.text.trim())
    )
    : [];

  const shouldShowMalayalamPrefaceOnly = translationLanguage === "mal" && malayalamPrefaceSections.length > 0;

  const paragraphCount =
    (Array.isArray(surahInfo?.thafheem?.PrefaceSections) &&
      surahInfo.thafheem.PrefaceSections.length) ||
    (Array.isArray(surahInfo?.thafheem?.PrefaceEntries) &&
      surahInfo.thafheem.PrefaceEntries.length) ||
    parsedThafheemSections.length ||
    "—";

  // Hide English preface sections when Hindi is selected so Hindi intro can show
  const hasPrefaceSections =
    translationLanguage !== "hi" && parsedThafheemSections.length > 0;
  const hasDetailed = Boolean(surahInfo?.detailed?.text);
  const shouldShowOverview =
    !shouldShowMalayalamPrefaceOnly &&
    surahInfo?.detailed?.short_text &&
    !hasPrefaceSections; // avoid duplicate headings when preface sections present
  const shouldShowDetailed =
    !shouldShowMalayalamPrefaceOnly &&
    hasDetailed &&
    !hasPrefaceSections; // avoid showing the same content twice

  const handlePrefaceContentClick = (event) => {
    if (translationLanguage !== "mal") return;
    const clickable = event.target.closest("sup, a");
    if (!clickable) return;

    const rawText = (clickable.innerText || clickable.textContent || "").trim();
    if (!rawText) return;

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
      const content = data?.NoteText || 
                     data?.note_text ||
                     data?.content || 
                     data?.html || 
                     data?.text || 
                     data?.body ||
                     (typeof data === 'string' ? data : null);
      
      setNotePopupState((prev) => ({
        ...prev,
        loading: false,
        content: content || "Note content unavailable.",
      }));
    } catch (fetchError) {
      console.error('Error fetching note:', fetchError);
      setNotePopupState((prev) => ({
        ...prev,
        loading: false,
        error: fetchError?.message || "Unable to load this note at the moment. Please try again.",
      }));
    }
  };

  const getAllContentAsText = () => {
    if (!surahInfo) return '';
    const surahName = surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`;
    const arabicName = surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || '';

    let content = `${surahName}\n`;
    if (arabicName) content += `${arabicName}\n\n`;

    content += `Revelation: ${surahInfo?.basic?.revelation_place || surahInfo?.thafheem?.SuraType || surahInfo?.surah?.type || 'Unknown'}\n`;
    content += `Revelation Order: ${surahInfo?.basic?.revelation_order || surahInfo?.thafheem?.RevOrder || 'Unknown'}\n`;
    content += `Verses: ${surahInfo?.basic?.verses_count || surahInfo?.thafheem?.TotalAyas || surahInfo?.surah?.ayahs || 'Unknown'}\n`;

    if (surahInfo?.thafheem) {
      content += `Thafheem Vol: ${surahInfo.thafheem.ThafVolume || 'Unknown'}\n`;
      content += `Type: ${surahInfo.thafheem.SuraType || 'Unknown'}\n`;
    }
    content += '\n';

    if (surahInfo?.detailed?.short_text) {
      content += `OVERVIEW\n${cleanHtmlContent(surahInfo.detailed.short_text)}\n\n`;
    }

    if (surahInfo?.detailed?.text) {
      content += `DETAILED INFORMATION\n${cleanHtmlContent(surahInfo.detailed.text)}\n\n`;
    }

    if (parsedThafheemSections.length > 0) {
      content += `THAFHEEM COMMENTARY\n\n`;
      parsedThafheemSections.forEach((section) => {
        content += `${section.title}\n${section.content}\n\n`;
      });
    }

    if (!surahInfo?.detailed?.text && parsedThafheemSections.length === 0) {
      content += `BASIC INFORMATION\n\n`;
      if (surahInfo?.basic?.translated_name?.name) content += `English Name: ${surahInfo.basic.translated_name.name}\n`;
      if (surahInfo?.basic?.name_simple) content += `Simple Name: ${surahInfo.basic.name_simple}\n`;
      if (surahInfo?.basic?.revelation_place) content += `Place of Revelation: ${surahInfo.basic.revelation_place}\n`;
      if (surahInfo?.basic?.pages) content += `Pages: ${surahInfo.basic.pages[0]} to ${surahInfo.basic.pages[1]}\n`;
    }

    content += `\n— ${surahName} (Surah ${surahId})`;
    return content;
  };

  const handleCopyAll = async () => {
    const contentToCopy = getAllContentAsText();
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    const surahName = surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`;
    const shareText = getAllContentAsText();
    const shareUrl = `${window.location.origin}/surah/${surahId}`;
    const shareData = {
      title: `${surahName} - Surah Information`,
      text: shareText,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const shareableContent = `${shareText}\n\nRead more: ${shareUrl}`;
        await navigator.clipboard.writeText(shareableContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Portal Root
  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full sm:w-auto sm:max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slideUp sm:animate-fadeIn overflow-hidden">

          {/* Drag Handle (Mobile) */}
          <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h2 
              className={`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white ${
                translationLanguage === 'mal' ? 'font-malayalam' : ''
              }`}
              style={
                translationLanguage === 'mal'
                  ? { fontFamily: "'Noto Sans Malayalam'" }
                  : {}
              }
            >
              {surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`}
            </h2>
            <div className="flex items-center gap-2">
              {!loading && !error && (
                <>
                  <button
                    onClick={handleCopyAll}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative text-gray-500 dark:text-gray-400"
                    title="Copy all content"
                  >
                    {copied ? <span className="text-green-500 font-bold text-xs">Copied!</span> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading Surah information...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 text-lg mb-2">Failed to load Surah information</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">Try Again</button>
              </div>
            ) : (
              <div className="font-poppins">
                {/* Arabic Title */}
                <div className="text-center mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-arabic text-black mb-4 sm:mb-6 dark:text-white px-2">
                    {surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || `Surah ${surahId}`}
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-center">
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="text-cyan-500 text-xs sm:text-sm">Revelation</div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base capitalize">{revelationPlace}</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="text-cyan-500 text-xs sm:text-sm">Revelation Order</div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base">{revelationOrder}</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="text-cyan-500 text-xs sm:text-sm">Verses</div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base">{versesCount}</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="text-cyan-500 text-xs sm:text-sm">Thafheem Vol</div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base">{thafheemVolume}</div>
                    </div>
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 sm:px-4 sm:py-3">
                      <div className="text-cyan-500 text-xs sm:text-sm">Paragraphs</div>
                      <div className="text-gray-900 font-semibold text-sm sm:text-base">{paragraphCount}</div>
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                {shouldShowMalayalamPrefaceOnly && (
                  <div className="mb-6 sm:mb-8">
                    {translationLanguage === "mal" && (
                      <style>{`
                        .surah-preface-content sup.f-noteno, .surah-preface-content a.crs { color: #2AA0BF !important; cursor: pointer !important; text-decoration: none !important; }
                        .surah-preface-content sup.f-noteno:hover, .surah-preface-content a.crs:hover { text-decoration: underline !important; }
                      `}</style>
                    )}
                    <div className="text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base space-y-4 surah-preface-content" onClick={handlePrefaceContentClick}>
                      {malayalamPrefaceSections.map((section, index) => (
                        <div key={index} className="space-y-3">
                          {section.subtitle && <h4 className="text-base sm:text-lg font-semibold text-cyan-500">{section.subtitle}</h4>}
                          {getPrefaceParagraphs(section.text).map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!shouldShowMalayalamPrefaceOnly && surahInfo?.detailed?.short_text && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-cyan-600 mb-3 sm:mb-4">Overview</h3>
                    <p className="text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base">{cleanHtmlContent(surahInfo.detailed.short_text)}</p>
                  </div>
                )}

                {!shouldShowMalayalamPrefaceOnly && surahInfo?.detailed?.text && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-cyan-600 mb-3 sm:mb-4">Detailed Information</h3>
                    <div className="text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base space-y-6">
                      {parsedDetailedSections.length > 0
                        ? parsedDetailedSections.map((section, index) => (
                            <div key={index} className="space-y-2">
                              {section.title && (
                                <h4 className="text-base sm:text-lg font-semibold text-cyan-500">
                                  {section.title}
                                </h4>
                              )}
                              {section.content
                                .split('\n')
                                .filter((p) => p.trim())
                                .map((p, i) => (
                                  <p key={i} className="mb-2">
                                    {p.trim()}
                                  </p>
                                ))}
                            </div>
                          ))
                        : cleanHtmlContent(surahInfo.detailed.text)
                            .split('\n\n')
                            .map((p, i) => <p key={i}>{p.trim()}</p>)}
                    </div>
                  </div>
                )}

                {!shouldShowMalayalamPrefaceOnly && parsedThafheemSections.length > 0 && translationLanguage !== "hi" && (
                  <div className="mb-6 sm:mb-8">
                
                    <div className="space-y-6">
                      {parsedThafheemSections.map((section, index) => (
                        <div key={index}>
                          <h4 className="text-base sm:text-lg font-semibold text-cyan-500 mb-2">{section.title}</h4>
                          <div className="text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base">
                            {section.content.split('\n').filter(p => p.trim()).map((p, i) => <p key={i} className="mb-3">{p.trim()}</p>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
        onClose={() => setNotePopupState((prev) => ({ ...prev, isOpen: false }))}
      />
    </>,
    modalRoot
  );
};

export default SurahInfoModal;

