import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Copy, Share2, X } from "lucide-react";
import { fetchInterpretation, fetchAyaRanges, fetchInterpretationRange, fetchAllInterpretations } from "../api/apifunction";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import banglaTranslationService from "../services/banglaTranslationService";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

const determineModalWidthClass = (plainTextLength = 0) => {
  if (plainTextLength <= 400) {
    return "sm:max-w-xl";
  }
  if (plainTextLength <= 1200) {
    return "sm:max-w-3xl";
  }
  if (plainTextLength <= 2500) {
    return "sm:max-w-4xl";
  }
  return "sm:max-w-5xl";
};

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

const InterpretationModal = ({ surahId, verseId, interpretationNo, language, onClose }) => {
  const { adjustedTranslationFontSize, translationLanguage } = useTheme();
  const { toasts, removeToast } = useToast();

  // State management
  const [interpretationData, setInterpretationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const rangesCacheRef = useRef(new Map()); // key: `${surahId}-E` -> ranges

  const isEmptyInterpretation = (resp) => {
    if (!resp) return true;
    const items = Array.isArray(resp) ? resp : [resp];
    if (items.length === 0) return true;
    const getText = (o) => {
      if (!o || typeof o !== 'object') return '';
      return (
        o.Interpretation || o.interpretation || o.AudioIntrerptn || o.text || o.content || ''
      );
    };
    const someText = items.some((o) => {
      const t = getText(o);
      return typeof t === 'string' && t.trim().length > 0;
    });
    return !someText;
  };

  // Fetch interpretation data when component mounts or props change
  useEffect(() => {
    const loadInterpretationData = async () => {
      if (!surahId || !verseId) return;

      try {
        setLoading(true);
        setError(null);


        const effectiveLang = language || translationLanguage;

        let interpretationResponse = null;

        // For Malayalam, use fetchAllInterpretations
        if (effectiveLang === 'mal') {
          try {
            const interpretations = await fetchAllInterpretations(parseInt(surahId), parseInt(verseId), 'mal');
            if (interpretations && interpretations.length > 0) {
              // Filter by interpretation number if specified
              if (interpretationNo) {
                interpretationResponse = interpretations.filter(i => i.InterpretationNo === String(interpretationNo) || i.interptn_no === interpretationNo);
                // If no match, use the first one
                if (interpretationResponse.length === 0) {
                  interpretationResponse = [interpretations[0]];
                }
              } else {
                interpretationResponse = interpretations;
              }
            }
          } catch (error) {
          }
        } else if (effectiveLang === 'ta') {
          try {
            const tamilTranslation = await tamilTranslationService.getAyahTranslation(parseInt(surahId), parseInt(verseId));
            if (tamilTranslation) {
              interpretationResponse = [{
                interpretation: tamilTranslation,
                AudioIntrerptn: tamilTranslation,
                text: tamilTranslation,
                content: tamilTranslation
              }];
            }
          } catch (error) {
          }
        } else if (effectiveLang === 'hi') {
          try {
            const hindiExplanation = await hindiTranslationService.getExplanation(parseInt(surahId), parseInt(verseId));
            if (hindiExplanation && hindiExplanation !== 'N/A') {
              interpretationResponse = [{
                interpretation: hindiExplanation,
                AudioIntrerptn: hindiExplanation,
                text: hindiExplanation,
                content: hindiExplanation
              }];
            }
          } catch (error) {
          }
        } else if (effectiveLang === 'ur') {
          try {
            const urduExplanation = await urduTranslationService.getExplanation(parseInt(surahId), parseInt(verseId));
            if (urduExplanation && urduExplanation !== 'N/A') {
              interpretationResponse = [{
                interpretation: urduExplanation,
                AudioIntrerptn: urduExplanation,
                text: urduExplanation,
                content: urduExplanation
              }];
            }
          } catch (error) {
          }
        } else if (effectiveLang === 'bn') {
          try {
            const banglaExplanation = await banglaTranslationService.getExplanation(parseInt(surahId), parseInt(verseId));
            if (banglaExplanation && banglaExplanation !== 'N/A') {
              interpretationResponse = [{
                interpretation: banglaExplanation,
                AudioIntrerptn: banglaExplanation,
                text: banglaExplanation,
                content: banglaExplanation
              }];
            }
          } catch (error) {
          }
        } else if (effectiveLang === 'E') {
          // 1) Try single-ayah English endpoint (fast path)
          try {
            interpretationResponse = await fetchInterpretation(
              parseInt(surahId),
              parseInt(verseId),
              parseInt(verseId), // interpretNo == ayahId for this endpoint
              'E'
            );
          } catch (_) { }

          // 2) If empty, try mapped English range with the requested interpretation number (one call)
          if (!interpretationResponse || isEmptyInterpretation(interpretationResponse)) {
            try {
              let ranges = rangesCacheRef.current.get(`${surahId}-E`);
              if (!ranges) {
                ranges = await fetchAyaRanges(parseInt(surahId), 'E');
                rangesCacheRef.current.set(`${surahId}-E`, ranges || []);
              }
              const v = parseInt(verseId);
              const match = Array.isArray(ranges) ? ranges.find(r => {
                const from = r.AyaFrom || r.ayafrom || r.from;
                const to = r.AyaTo || r.ayato || r.to || from;
                return from != null && to != null && v >= from && v <= to;
              }) : null;
              const rangeStr = match ? `${match.AyaFrom || match.ayafrom || match.from}-${match.AyaTo || match.ayato || match.to || (match.AyaFrom || match.ayafrom || match.from)}` : `${v}-${v}`;
              interpretationResponse = await fetchInterpretationRange(
                parseInt(surahId),
                rangeStr,
                interpretationNo || 1,
                'E'
              );
            } catch (_) { }
          }
        }

        // 3) Fallback to verse-based fetch (if English strategies failed)
        if (!interpretationResponse || isEmptyInterpretation(interpretationResponse)) {
          interpretationResponse = await fetchInterpretation(
            parseInt(surahId),
            parseInt(verseId),
            interpretationNo || 1,
            effectiveLang
          );
        }

        if (!interpretationResponse || isEmptyInterpretation(interpretationResponse)) throw new Error('No interpretation content available');


        // Handle different response structures
        if (Array.isArray(interpretationResponse)) {
          setInterpretationData(interpretationResponse);
        } else if (interpretationResponse?.data && Array.isArray(interpretationResponse.data)) {
          setInterpretationData(interpretationResponse.data);
        } else if (typeof interpretationResponse === "object") {
          setInterpretationData([interpretationResponse]);
        } else {
          setInterpretationData(null);
        }
      } catch (err) {
        console.error("Error fetching interpretation data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInterpretationData();
  }, [surahId, verseId, interpretationNo, language, translationLanguage]);

  // Process interpretation text to make verse references clickable with cyan blue styling
  const processVerseReferences = (text) => {
    if (!text || typeof text !== "string") return text;
    
    // Pattern to match verse references like (2:163), (1:2), 2:163, etc.
    const versePattern = /\(?(\d+)\s*[:：]\s*(\d+)\)?/g;
    
    return text.replace(versePattern, (match, surah, ayah) => {
      // Check if already wrapped in a clickable element
      if (match.includes('verse-reference-link')) {
        return match;
      }
      
      // Wrap in clickable span with cyan blue styling
      return `<span class="verse-reference-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors" data-surah="${surah}" data-ayah="${ayah}" title="Click to view Surah ${surah}, Verse ${ayah}">${match}</span>`;
    });
  };

  // Extract interpretation text from data
  const extractInterpretationText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") {
      return processVerseReferences(item);
    }

    // Common possible fields for interpretation content
    const preferredKeys = [
      "interpret_text",
      "InterpretText",
      "Interpret_Text",
      "interpretation",
      "Interpretation",
      "AudioIntrerptn",
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
        return processVerseReferences(item[key]);
      }
    }

    // Fallback: find any string field with substantial content
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) {
        return processVerseReferences(v);
      }
    }

    return `<p class="text-gray-500 italic">No interpretation content available</p>`;
  };

  const handleCopy = async () => {
    if (!interpretationData || interpretationData.length === 0) return;
    const textToCopy = interpretationData
      .map(item => extractPlainText(extractInterpretationText(item)))
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toasts.error("Failed to copy text");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/interpretation?surah=${surahId}&verse=${verseId}&no=${interpretationNo || 1}&lang=${language}`;
    const shareText = `Interpretation for Surah ${surahId}, Verse ${verseId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Tafheem-ul-Quran",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  // Portal Root
  const modalRoot = document.getElementById("modal-root") || document.body;
  const effectiveLang = language || translationLanguage || 'mal';
  const isUrdu = effectiveLang === 'ur' || effectiveLang === 'urdu';

  return createPortal(
    <>
      {isUrdu && (
        <style>{`
          .urdu-interpretation-content p {
            text-align: right !important;
            font-size: 16px !important;
            line-height: 2.6 !important;
            margin-bottom: 10px !important;
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
          .urdu-interpretation-content a {
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
            text-align: right !important;
          }
          .urdu-interpretation-content * {
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
          .urdu-interpretation-content sup.interpretation-link,
          .urdu-interpretation-content sup[data-interpretation],
          .urdu-interpretation-content sup.urdu-footnote-link,
          .urdu-interpretation-content sup[data-footnote-id] {
            cursor: pointer !important;
            background-color: transparent !important;
            color: rgb(41, 169, 199) !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            border: none !important;
            display: inline !important;
            font-size: 12px !important;
            vertical-align: super !important;
            line-height: 1 !important;
            position: relative !important;
            top: 3px !important;
            z-index: 10 !important;
            transition: 0.2s ease-in-out !important;
          }
          .urdu-interpretation-content sup.interpretation-link > a,
          .urdu-interpretation-content sup[data-interpretation] > a,
          .urdu-interpretation-content sup.urdu-footnote-link > a,
          .urdu-interpretation-content sup[data-footnote-id] > a {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            color: inherit !important;
            font-weight: inherit !important;
            text-decoration: none !important;
            line-height: 1 !important;
          }
          .urdu-interpretation-content sup.interpretation-link,
          .urdu-interpretation-content sup[data-interpretation],
          .urdu-interpretation-content sup.urdu-footnote-link,
          .urdu-interpretation-content sup[data-footnote-id] {
            line-height: 1 !important;
          }
          .urdu-interpretation-content sup.interpretation-link:hover,
          .urdu-interpretation-content sup[data-interpretation]:hover,
          .urdu-interpretation-content sup.urdu-footnote-link:hover,
          .urdu-interpretation-content sup[data-footnote-id]:hover {
            color: #0891b2 !important;
          }
          .urdu-interpretation-content sup.interpretation-link:active,
          .urdu-interpretation-content sup[data-interpretation]:active,
          .urdu-interpretation-content sup.urdu-footnote-link:active,
          .urdu-interpretation-content sup[data-footnote-id]:active {
            color: #0e7490 !important;
          }
        `}</style>
      )}
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              Interpretation - Surah {surahId}, Verse {verseId}
            </h2>
            <div className="flex items-center gap-2">
              {!loading && !error && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative text-gray-500 dark:text-gray-400"
                    title="Copy"
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
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading interpretation...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 text-lg mb-2">
                  Failed to load interpretation
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : interpretationData && interpretationData.length > 0 ? (
              <div className="font-poppins">
                {interpretationData.map((interpretation, index) => {
                  const interpretationText = extractInterpretationText(interpretation);

                  return (
                    <div key={index} className="mb-6 sm:mb-8">
                      <div
                        className={`text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none text-justify ${isUrdu ? 'font-urdu-nastaliq urdu-interpretation-content' : ''}`}
                        style={{ 
                          fontSize: `${adjustedTranslationFontSize}px`,
                          ...(isUrdu ? {
                            textAlign: 'right',
                            fontSize: '16px',
                            lineHeight: '2.6',
                            fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                          } : {
                            textAlign: 'justify'
                          })
                        }}
                        dir={isUrdu ? 'rtl' : 'ltr'}
                        onClick={(e) => {
                          // Handle clicks on verse reference links
                          const verseLink = e.target.closest('.verse-reference-link');
                          if (verseLink) {
                            e.preventDefault();
                            e.stopPropagation();
                            const surah = verseLink.getAttribute('data-surah');
                            const ayah = verseLink.getAttribute('data-ayah');
                            if (surah && ayah) {
                              // Close current modal first
                              onClose();
                              // Navigate to the verse with language preserved
                              // Use a small delay to ensure modal closes before navigation
                              setTimeout(() => {
                                window.location.href = `/surah/${surah}?ayah=${ayah}&lang=${effectiveLang}`;
                              }, 100);
                            }
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: interpretationText }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    {parseInt(surahId) === 114
                      ? "Interpretation data is not available for Surah An-Nas (114). This surah may not have interpretation content in the current database."
                      : "No interpretation available for this verse. The interpretation API may be temporarily unavailable."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>,
    modalRoot
  );
};

export default InterpretationModal;

