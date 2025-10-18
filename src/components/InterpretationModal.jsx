import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { fetchInterpretation, fetchAyaRanges, fetchInterpretationRange } from "../api/apifunction";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import banglaInterpretationService from "../services/banglaInterpretationService";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

const InterpretationModal = ({ surahId, verseId, interpretationNo, language, onClose }) => {
  const { translationFontSize, translationLanguage } = useTheme();
  const { toasts, removeToast } = useToast();

  // State management
  const [interpretationData, setInterpretationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // For Tamil and Hindi, use their respective translation services
        if (effectiveLang === 'ta') {
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
            console.log("Tamil translation error:", error);
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
            console.log("Hindi translation error:", error);
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
            console.log("Urdu translation error:", error);
          }
        } else if (effectiveLang === 'bn') {
          try {
            const banglaExplanation = await banglaInterpretationService.getExplanation(parseInt(surahId), parseInt(verseId));
            if (banglaExplanation && banglaExplanation !== 'N/A') {
              interpretationResponse = [{
                interpretation: banglaExplanation,
                AudioIntrerptn: banglaExplanation,
                text: banglaExplanation,
                content: banglaExplanation
              }];
            }
          } catch (error) {
            console.log("Bangla interpretation error:", error);
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
          } catch (_) {}

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
            } catch (_) {}
          }
        }

        // 3) Fallback to verse-based fetch (Malayalam or if English strategies failed)
        if (!interpretationResponse || isEmptyInterpretation(interpretationResponse)) {
          interpretationResponse = await fetchInterpretation(
            parseInt(surahId),
            parseInt(verseId),
            interpretationNo || 1,
            effectiveLang
          );
        }

        if (!interpretationResponse || isEmptyInterpretation(interpretationResponse)) throw new Error('No interpretation content available');

        console.log(`✅ Received interpretation data:`, interpretationResponse);

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

  // Extract interpretation text from data
  const extractInterpretationText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    
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
        return item[key];
      }
    }
    
    // Fallback: find any string field with substantial content
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) {
        console.log(`📝 Extracted interpretation text from fallback field: ${k}`);
        return v;
      }
    }
    
    return `<p class="text-gray-500 italic">No interpretation content available</p>`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
        <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Interpretation {interpretationNo || 1} - Surah {surahId}, Verse {verseId}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading interpretation...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
        <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Interpretation {interpretationNo || 1} - Surah {surahId}, Verse {verseId}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
      <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Interpretation {interpretationNo || 1} - Surah {surahId}, Verse {verseId}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
          {/* Interpretation Content */}
          {interpretationData && interpretationData.length > 0 ? (
            <div className="space-y-4">
              {interpretationData.map((interpretation, index) => {
                const interpretationText = extractInterpretationText(interpretation);

                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6"
                  >
                    <div
                      className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-sm sm:text-base lg:text-lg prose prose-sm dark:prose-invert max-w-none"
                      style={{ fontSize: `${translationFontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: interpretationText }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic text-center">
                {parseInt(surahId) === 114 
                  ? "Interpretation data is not available for Surah An-Nas (114). This surah may not have interpretation content in the current database."
                  : "No interpretation available for this verse. The interpretation API may be temporarily unavailable."
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default InterpretationModal;

