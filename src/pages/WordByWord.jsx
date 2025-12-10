import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Share2,
  NotepadText,
} from "lucide-react";
import {
  fetchWordByWordMeaning,
  fetchThafheemWordMeanings,
  fetchSurahs,
} from "../api/apifunction";
import tamilWordByWordService from "../services/tamilWordByWordService";
import hindiWordByWordService from "../services/hindiWordByWordService";
import banglaWordByWordService from "../services/banglaWordByWordService";
import malayalamTranslationService from "../services/malayalamTranslationService";
import WordNavbar from "../components/WordNavbar";
import AyahModal from "../components/AyahModal";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

const WordByWord = ({
  selectedVerse,
  surahId,
  onClose,
  onNavigate,
  onSurahChange,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use URL parameters if available, otherwise fall back to props
  const currentSurahId = params.surahId || surahId;
  const currentVerseId = params.verseId
    ? parseInt(params.verseId)
    : selectedVerse;
  const {
    quranFont,
    fontSize,
    adjustedTranslationFontSize,
    translationLanguage,
  } = useTheme();

  const [wordData, setWordData] = useState(null);
  const [thafheemWords, setThafheemWords] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVerses, setTotalVerses] = useState(0);
  const [showAyahModal, setShowAyahModal] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Portal target
  const modalRoot = document.getElementById('modal-root') || document.body;

  useEffect(() => {
    const loadWordData = async () => {
      if (!currentVerseId || !currentSurahId) return;

      try {
        setLoading(true);
        setError(null);

        // For Tamil, Hindi, Bangla, and Malayalam, we use our local databases
        // For other languages, we use the regular word-by-word API
        const promises = [
          translationLanguage === 'ta'
            ? tamilWordByWordService.getWordByWordDataWithArabic(currentSurahId, currentVerseId)
              .catch(async (error) => {
                // Fallback to English if Tamil service fails
                return await fetchWordByWordMeaning(currentSurahId, currentVerseId, 'E');
              })
            : translationLanguage === 'hi'
              ? hindiWordByWordService.getWordByWordDataWithArabic(currentSurahId, currentVerseId)
                .catch(async (error) => {
                  // Fallback to English if Hindi service fails
                  return await fetchWordByWordMeaning(currentSurahId, currentVerseId, 'E');
                })
              : translationLanguage === 'bn'
                ? banglaWordByWordService.getWordByWordDataWithArabic(currentSurahId, currentVerseId)
                  .catch(async (error) => {
                    // Fallback to English if Bangla service fails
                    return await fetchWordByWordMeaning(currentSurahId, currentVerseId, 'E');
                  })
                : translationLanguage === 'mal'
                  ? malayalamTranslationService.getWordByWordDataWithArabic(currentSurahId, currentVerseId)
                    .catch(async (error) => {
                      // Fallback to English if Malayalam service fails
                      return await fetchWordByWordMeaning(currentSurahId, currentVerseId, 'E');
                    })
                  : fetchWordByWordMeaning(currentSurahId, currentVerseId, translationLanguage),
          fetchThafheemWordMeanings(currentSurahId, currentVerseId).catch(() => []),
          // Only fetch surahs if we don't already have surah info
          surahInfo
            ? Promise.resolve(surahInfo)
            : fetchSurahs()
              .then((surahs) =>
                surahs.find((s) => s.number === parseInt(currentSurahId))
              )
              .catch(() => null),
        ];

        const [quranComData, thafheemData, surahsData] = await Promise.all(promises);

        setWordData(quranComData);
        setThafheemWords(thafheemData || []);
        setSurahInfo(surahsData);
        setTotalVerses(surahsData?.ayahs || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWordData();
  }, [currentVerseId, currentSurahId, translationLanguage]);

  const handlePrevious = () => {
    if (currentVerseId > 1) {
      if (onNavigate) {
        onNavigate(currentVerseId - 1);
      } else {
        navigate(`/word-by-word/${currentSurahId}/${currentVerseId - 1}`, {
          state: location.state
        });
      }
    }
  };

  const handleNext = () => {
    if (onNavigate) {
      onNavigate(currentVerseId + 1);
    } else {
      navigate(`/word-by-word/${currentSurahId}/${currentVerseId + 1}`, {
        state: location.state
      });
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Navigate back to the surah page or previous page
      const from = location.state?.from;
      if (from && from !== '/surah/all' && from !== '/surah') {
        navigate(from);
      } else {
        // If no specific 'from' location or if 'from' is the all surahs page,
        // navigate to the current surah page to avoid redirecting to all surahs
        navigate(`/surah/${currentSurahId}`);
      }
    }
  };

  const handleShowAyahModal = (verseNumber) => {
    setShowAyahModal(true);
  };

  const handleSurahChange = (newSurahId) => {
    if (onSurahChange) {
      // Use the parent's surah change handler if provided
      onSurahChange(newSurahId);
    } else if (onNavigate) {
      // When used as a modal, we need to close and navigate to the new surah
      onClose();
      navigate(`/surah/${newSurahId}?wordByWord=1`);
    } else {
      navigate(`/word-by-word/${newSurahId}/1`, {
        state: location.state
      });
    }
  };

  const handleVerseChange = (newVerseId) => {
    if (onNavigate) {
      onNavigate(newVerseId);
    } else {
      navigate(`/word-by-word/${currentSurahId}/${newVerseId}`, {
        state: location.state
      });
    }
  };


  const handleCloseAyahModal = () => {
    setShowAyahModal(false);
  };

  // Map translation language codes to display names
  const getDisplayLanguage = (langCode) => {
    switch (langCode) {
      case 'mal': return 'Malayalam';
      case 'E': return 'English';
      case 'ta': return 'Tamil';
      case 'hi': return 'Hindi';
      case 'ur': return 'Urdu';
      case 'ar': return 'Arabic';
      default: return 'English';
    }
  };

  const currentDisplayLanguage = getDisplayLanguage(translationLanguage);

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        <div className="relative w-full sm:w-auto sm:min-w-[600px] lg:min-w-[800px] max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">
          <div className="flex-shrink-0 z-10 bg-white dark:bg-gray-900">
            <WordNavbar
              surahId={currentSurahId}
              selectedVerse={currentVerseId}
              surahInfo={surahInfo}
              onNavigate={onNavigate}
              onClose={handleClose}
              onShowAyahModal={handleShowAyahModal}
              onSurahChange={handleSurahChange}
              onVerseChange={handleVerseChange}
              wordData={wordData}
              showSuccess={showSuccess}
              showError={showError}
              translationLanguage={translationLanguage}
            />
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-8 min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading word meanings...</p>
            </div>
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>,
      modalRoot
    );
  }

  if (error) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative w-full sm:w-auto sm:min-w-[600px] lg:min-w-[800px] max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">
          <div className="flex-shrink-0 z-10 bg-white dark:bg-gray-900">
            <WordNavbar
              surahId={currentSurahId}
              selectedVerse={currentVerseId}
              surahInfo={surahInfo}
              onNavigate={onNavigate}
              onClose={handleClose}
              onShowAyahModal={handleShowAyahModal}
              onSurahChange={handleSurahChange}
              onVerseChange={handleVerseChange}
              wordData={wordData}
              showSuccess={showSuccess}
              showError={showError}
              translationLanguage={translationLanguage}
            />
          </div>
          <div className="flex-1 flex items-center justify-center px-6 py-8 min-h-[300px]">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 mb-2">Failed to load word meanings</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>,
      modalRoot
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full sm:w-auto sm:min-w-[600px] lg:min-w-[800px] max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">

        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" onClick={handleClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        <div className="flex-shrink-0 z-10 bg-white dark:bg-gray-900">
          <WordNavbar
            surahId={currentSurahId}
            selectedVerse={currentVerseId}
            surahInfo={surahInfo}
            onNavigate={onNavigate}
            onClose={handleClose}
            onShowAyahModal={handleShowAyahModal}
            onSurahChange={handleSurahChange}
            onVerseChange={handleVerseChange}
            wordData={wordData}
            showSuccess={showSuccess}
            showError={showError}
            translationLanguage={translationLanguage}
          />
        </div>

        {/* Scrollable Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900/50">
          {/* Verse Info Header */}
          <div className="mb-4 sm:mb-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-2">
              <h3
                className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-gray-200"
                style={{
                  fontFamily: quranFont,
                  fontSize: `${fontSize}px`,
                }}
              >
                {surahInfo?.arabic || `Surah ${currentSurahId}`}
              </h3>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                Verse {currentVerseId} of {totalVerses}
              </span>
            </div>
          </div>

          {/* Complete Verse */}
          {wordData && (
            <div className="text-right mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl dark:text-white text-gray-900 leading-[2.2] px-2 sm:px-0"
                style={{
                  fontFamily: quranFont,
                  fontSize: `${fontSize}px`,
                }}
                dir="rtl"
              >
                {wordData.text_uthmani ||
                  (wordData.words &&
                    wordData.words
                      .map((word) => word.text_uthmani || word.text_simple)
                      .join(" ")) ||
                  "Verse text not available"}{" "}
              </h1>
            </div>
          )}

          {/* Translation */}
          {wordData &&
            wordData.translations &&
            wordData.translations.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary-light mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary dark:bg-primary-light"></span>
                  Translation
                </h4>
                <p
                  className={`text-gray-700 leading-[1.8] dark:text-gray-200 px-2 sm:px-0 ${translationLanguage === 'hi' ? 'font-hindi' :
                    translationLanguage === 'ur' ? 'font-urdu-nastaliq' :
                      translationLanguage === 'bn' ? 'font-bengali' :
                        translationLanguage === 'ta' ? 'font-tamil' :
                          translationLanguage === 'mal' ? 'font-malayalam' :
                            'font-poppins'
                    }`}
                  style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                >
                  {wordData.translations[0].text}
                </p>
              </div>
            )}

          {/* Word by Word Breakdown */}
          {wordData && wordData.words && wordData.words.length > 0 && (
            <div className="mb-6 sm:mb-8">
              {/* Hide title for Bangla word breakdown */}
              {translationLanguage !== 'bn' && (
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary-light mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-primary dark:bg-primary-light"></span>
                  Word Breakdown ({currentDisplayLanguage})
                </h4>
              )}
              <div className="space-y-4">
                {wordData.words.map((word, index) => {
                  const arabicText = word.text_uthmani || word.text_simple || "";
                  const hasTranslation = !!(word.translation && word.translation.text);

                  // Hide tokens that are just verse numbers (e.g. ﴿١﴾, (١), (1)) with no translation
                  const isArabicDigitOnly =
                    arabicText &&
                    /^[\s()\u0660-\u0669\u06F0-\u06F9\uFD3E\uFD3F0-9]+$/.test(arabicText) &&
                    !hasTranslation;

                  if (isArabicDigitOnly) {
                    return null;
                  }

                  return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex flex-row-reverse justify-between items-center">
                      {/* Arabic Word */}
                      <div className="text-right">
                        <div
                          className="text-2xl sm:text-3xl text-gray-800 dark:text-white font-arabic"
                          style={{
                            fontFamily: quranFont,
                            fontSize: `${fontSize}px`,
                          }}
                        >
                          {word.text_uthmani || word.text_simple || "N/A"}
                        </div>
                        {word.text_simple &&
                          word.text_uthmani !== word.text_simple && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {word.text_simple}
                            </div>
                          )}
                      </div>

                      {/* Translation/Meaning */}
                      <div className="text-left max-w-[60%]">
                        {hasTranslation ? (
                          <p
                            className={`text-gray-700 leading-[1.6] sm:leading-[1.7] lg:leading-[1.8] dark:text-gray-200 mb-1 font-medium ${
                              translationLanguage === 'hi' ? 'font-hindi' :
                              translationLanguage === 'ur' ? 'font-urdu-nastaliq' :
                              translationLanguage === 'bn' ? 'font-bengali' :
                              translationLanguage === 'ta' ? 'font-tamil' :
                              translationLanguage === 'mal' ? 'font-malayalam' :
                              'font-poppins'
                            }`}
                            style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                          >
                            {word.translation.text}
                          </p>
                        ) : (
                          <p
                            className="text-gray-500 dark:text-gray-400 mb-1 italic"
                            style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                          >
                            Translation not available
                          </p>
                        )}
                        {word.class_name && (
                          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 uppercase tracking-wide">
                            {word.class_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* Fallback if no word data */}
          {wordData && (!wordData.words || wordData.words.length === 0) && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Word Breakdown:
              </h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  Word-by-word breakdown not available for this verse.
                </p>
              </div>
            </div>
          )}

          {/* Thafheem Word Meanings - Only show for Malayalam as fallback if wordData doesn't have words */}
          {translationLanguage === 'mal' && 
           (!wordData || !wordData.words || wordData.words.length === 0) && 
           thafheemWords && 
           thafheemWords.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary-light mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary dark:bg-primary-light"></span>
                Word Breakdown (Malayalam)
              </h4>
              <div className="space-y-4">
                {(() => {
                  // Deduplicate words based on WordPhrase to avoid showing the same word twice
                  const uniqueWords = thafheemWords.reduce((acc, word, index) => {
                    const wordPhrase = word.WordPhrase || word.text_uthmani || word.text_simple || '';
                    const existingIndex = acc.findIndex(existing =>
                      (existing.WordPhrase || existing.text_uthmani || existing.text_simple) === wordPhrase
                    );
                    if (existingIndex === -1) {
                      acc.push({ ...word, originalIndex: index });
                    }
                    return acc;
                  }, []);

                  return uniqueWords.map((word, index) => {
                    const wordPhrase = word.WordPhrase || word.text_uthmani || word.text_simple || '';
                    const meaning = word.Meaning || word.translation?.text || '';
                    
                    return (
                      <div
                        key={`${wordPhrase}-${index}`}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex flex-row-reverse justify-between items-center">
                          <div className="text-right">
                            <span
                              className="text-2xl sm:text-3xl font-arabic dark:text-white text-gray-800"
                              style={{
                                fontFamily: quranFont,
                                fontSize: `${fontSize}px`,
                              }}
                            >
                              {wordPhrase}
                            </span>
                          </div>
                          <div className="text-left max-w-[60%]">
                            <span
                              className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-gray-200 font-malayalam font-medium"
                              style={{ fontSize: `${adjustedTranslationFontSize}px` }}
                            >
                              {meaning}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Navigation Buttons */}
        <div className="flex-shrink-0 flex justify-between gap-3 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-10">
          <button
            onClick={handlePrevious}
            disabled={currentVerseId <= 1}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 group ${currentVerseId <= 1
              ? "bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:border-primary-light dark:hover:text-primary-light"
              }`}
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentVerseId >= totalVerses}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 group ${currentVerseId >= totalVerses
              ? "bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-600 dark:border-gray-700 cursor-not-allowed"
              : "bg-primary text-white border-primary hover:bg-primary-dark shadow-lg shadow-primary/20 dark:bg-primary dark:border-primary dark:hover:bg-primary-dark"
              }`}
          >
            <span className="text-sm font-medium">Next Ayah</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* AyahModal */}
        {showAyahModal && (
          <AyahModal
            surahId={currentSurahId}
            verseId={currentVerseId}
            onClose={handleCloseAyahModal}
          />
        )}

        {/* Toast Container */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>,
    modalRoot
  );
};

export default WordByWord;
