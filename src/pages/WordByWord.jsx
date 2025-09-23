import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, ChevronDown, Bookmark, Share2, NotepadText } from "lucide-react";
import {
  fetchWordByWordMeaning,
  fetchThafheemWordMeanings,
  fetchSurahs,
} from "../api/apifunction";
import WordNavbar from "../components/WordNavbar";
import AyahModal from "../components/AyahModal";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/Toast";

const WordByWord = ({ selectedVerse, surahId, onClose, onNavigate }) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use URL parameters if available, otherwise fall back to props
  const currentSurahId = params.surahId || surahId;
  const currentVerseId = params.verseId ? parseInt(params.verseId) : selectedVerse;
  const { quranFont, fontSize, translationFontSize } = useTheme();
  
  const [wordData, setWordData] = useState(null);
  const [thafheemWords, setThafheemWords] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [totalVerses, setTotalVerses] = useState(0);
  const [showAyahModal, setShowAyahModal] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    const loadWordData = async () => {
      if (!currentVerseId || !currentSurahId) return;

      try {
        setLoading(true);
        setError(null);

        const [quranComData, thafheemData, surahsData] = await Promise.all([
          fetchWordByWordMeaning(currentSurahId, currentVerseId),
          fetchThafheemWordMeanings(currentSurahId, currentVerseId).catch(() => []),
          fetchSurahs()
            .then((surahs) =>
              surahs.find((s) => s.number === parseInt(currentSurahId))
            )
            .catch(() => null),
        ]);

        setWordData(quranComData);
        setThafheemWords(thafheemData || []);
        setSurahInfo(surahsData);
        setTotalVerses(surahsData?.ayahs || 0);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching word data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWordData();
  }, [currentVerseId, currentSurahId]);

  const handlePrevious = () => {
    if (currentVerseId > 1) {
      if (onNavigate) {
        onNavigate(currentVerseId - 1);
      } else {
        navigate(`/word-by-word/${currentSurahId}/${currentVerseId - 1}`);
      }
    }
  };

  const handleNext = () => {
    if (onNavigate) {
      onNavigate(currentVerseId + 1);
    } else {
      navigate(`/word-by-word/${currentSurahId}/${currentVerseId + 1}`);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Navigate back to the previous page or home
      const from = location.state?.from;
      if (from) {
        navigate(from);
      } else {
        navigate(-1);
      }
    }
  };

  const handleShowAyahModal = (verseNumber) => {
    setShowAyahModal(true);
  };

  const handleSurahChange = (newSurahId) => {
    if (onNavigate) {
      onNavigate(1); // Navigate to first verse of new surah
    } else {
      navigate(`/word-by-word/${newSurahId}/1`);
    }
  };

  const handleVerseChange = (newVerseId) => {
    if (onNavigate) {
      onNavigate(newVerseId);
    } else {
      navigate(`/word-by-word/${currentSurahId}/${newVerseId}`);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    // You can add language-specific logic here if needed
  };

  const handleCloseAyahModal = () => {
    setShowAyahModal(false);
  };

  if (loading) {
    return (
      <>
        <WordNavbar
          surahId={currentSurahId}
          selectedVerse={currentVerseId}
          surahInfo={surahInfo}
          onNavigate={onNavigate}
          onClose={handleClose}
          onSurahChange={handleSurahChange}
          onVerseChange={handleVerseChange}
          onLanguageChange={handleLanguageChange}
          wordData={wordData}
          showSuccess={showSuccess}
          showError={showError}
        />
        <div className="max-w-4xl mx-auto p-6 dark:bg-[#2A2C38] bg-white rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              Word by Word
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            )}
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading word meanings...
            </p>
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <WordNavbar
          surahId={currentSurahId}
          selectedVerse={currentVerseId}
          surahInfo={surahInfo}
          onNavigate={onNavigate}
          onClose={handleClose}
          onSurahChange={handleSurahChange}
          onVerseChange={handleVerseChange}
          onLanguageChange={handleLanguageChange}
          wordData={wordData}
          showSuccess={showSuccess}
          showError={showError}
        />
        <div className="max-w-4xl mx-auto p-6 dark:bg-[#2A2C38] bg-white rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              Word by Word
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            )}
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-2">
              Failed to load word meanings
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
      <WordNavbar
        surahId={currentSurahId}
        selectedVerse={currentVerseId}
        surahInfo={surahInfo}
        onNavigate={onNavigate}
        onClose={handleClose}
        onShowAyahModal={handleShowAyahModal}
        onSurahChange={handleSurahChange}
        onVerseChange={handleVerseChange}
        onLanguageChange={handleLanguageChange}
        wordData={wordData}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Scrollable Content */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
        {/* Verse Info Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300"
              style={{
                fontFamily: quranFont,
                fontSize: `${fontSize}px`,
              }}
            >
              {surahInfo?.arabic || `Surah ${currentSurahId}`}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Verse {currentVerseId} of {totalVerses}
            </span>
          </div>
        </div>


        {/* Complete Verse */}
        {wordData && (
          <div className="text-right mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-600 pb-3 sm:pb-4">
<h1
  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-white text-gray-900 leading-loose px-2 sm:px-0"
  style={{
    fontFamily: quranFont,
    fontSize: `${fontSize}px`,
  }}
>
  {wordData.text_uthmani ||
    (wordData.words &&
      wordData.words
        .map((word) => word.text_uthmani || word.text_simple)
        .join(" ")) ||
    "Verse text not available"}{' '}
</h1>


          </div>
        )}

        {/* Translation */}
        {wordData && wordData.translations && wordData.translations.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Translation:
            </h4>
            <p
              className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {wordData.translations[0].text}
            </p>
          </div>
        )}

        {/* Word by Word Breakdown */}
        {wordData && wordData.words && wordData.words.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Word Breakdown:
            </h4>
            <div className="space-y-3">
              {wordData.words.map((word, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex flex-row-reverse justify-between items-center">
                    {/* Arabic Word */}
                    <div className="text-right">
                      <div
                        className="text-2xl sm:text-3xl text-gray-700 dark:text-white font-arabic"
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
                      {/* <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        #{word.word_number || index + 1}
                      </div> */}
                    </div>

                    {/* Translation/Meaning */}
                    <div className="text-left max-w-[60%]">
                      {word.translation && word.translation.text ? (
                        <p
                          className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white mb-1"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          {word.translation.text}
                        </p>
                      ) : (
                        <p
                          className="text-gray-500 dark:text-gray-400 mb-1 italic"
                          style={{ fontSize: `${translationFontSize}px` }}
                        >
                          Translation not available
                        </p>
                      )}
                      {word.class_name && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {word.class_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no word data */}
        {wordData && (!wordData.words || wordData.words.length === 0) && (
          <div className="mb-6 sm:mb-8">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Word Breakdown:
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Word-by-word breakdown not available for this verse.
              </p>
            </div>
          </div>
        )}

        {/* Thafheem Word Meanings */}
        {thafheemWords.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Thafheem Word Meanings:
            </h4>
            <div className="space-y-3">
              {thafheemWords.map((word, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex flex-row-reverse justify-between items-center">
                    <div className="text-right">
                      <span
                        className="text-lg font-arabic dark:text-white"
                        style={{
                          fontFamily: quranFont,
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        {word.WordPhrase}
                      </span>
                    </div>
                    <div className="text-left max-w-[60%]">
                      <span
                        className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white font-malayalam"
                        style={{ fontSize: `${translationFontSize}px` }}
                      >
                        {word.Meaning}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation Buttons */}
      <div className="flex justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2C38]">
        <button
          onClick={handlePrevious}
          disabled={currentVerseId <= 1}
          className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] ${
            currentVerseId <= 1
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600"
              : "text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
          }`}
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-medium">Previous Ayah</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentVerseId >= totalVerses}
          className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] ${
            currentVerseId >= totalVerses
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600"
              : "text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
          }`}
        >
          <span className="text-xs sm:text-sm font-medium">Next Ayah</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
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
  );
};

export default WordByWord;
