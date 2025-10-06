import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchInterpretation } from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

const InterpretationModal = ({ surahId, verseId, interpretationNo, language, onClose }) => {
  const { translationFontSize } = useTheme();
  const { toasts, removeToast } = useToast();

  // State management
  const [interpretationData, setInterpretationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interpretation data when component mounts or props change
  useEffect(() => {
    const loadInterpretationData = async () => {
      if (!surahId || !verseId) return;

      try {
        setLoading(true);
        setError(null);

        console.log(`🔄 Loading interpretation ${interpretationNo} for ${surahId}:${verseId} in ${language}`);

        const interpretationResponse = await fetchInterpretation(
          parseInt(surahId), 
          parseInt(verseId), 
          interpretationNo || 1, 
          language || "en"
        ).catch((error) => {
          // Special handling for Surah 114
          if (parseInt(surahId) === 114) {
            console.log(`🔍 Interpretation fetch failed for Surah 114, Verse ${verseId}. This may be expected if no interpretation data exists.`);
          }
          throw error;
        });

        console.log(`✅ Received interpretation data:`, interpretationResponse);

        // Handle different response structures
        if (interpretationResponse) {
          if (Array.isArray(interpretationResponse)) {
            setInterpretationData(interpretationResponse);
          } else if (
            interpretationResponse.data &&
            Array.isArray(interpretationResponse.data)
          ) {
            setInterpretationData(interpretationResponse.data);
          } else if (typeof interpretationResponse === "object") {
            setInterpretationData([interpretationResponse]);
          } else {
            setInterpretationData(null);
          }
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
  }, [surahId, verseId, interpretationNo, language]);

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

