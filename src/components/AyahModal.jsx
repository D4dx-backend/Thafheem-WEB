import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AyathNavbar from "./AyathNavbar";
import WordByWord from "../pages/WordByWord";
import {
  fetchInterpretation,
  fetchArabicVerses,
  fetchAyahAudioTranslations,
  fetchSurahs,
} from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

const AyahModal = ({ surahId, verseId, onClose }) => {
  const { quranFont, fontSize, translationFontSize } = useTheme();
  const { toasts, removeToast } = useToast();

  // State management
  const [currentVerseId, setCurrentVerseId] = useState(1);
  const [surahInfo, setSurahInfo] = useState(null);
  const [verseData, setVerseData] = useState(null);
  const [interpretationData, setInterpretationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVerses, setTotalVerses] = useState(0);
  const [showWordByWord, setShowWordByWord] = useState(false);

  // Initialize verse from props
  useEffect(() => {
    if (verseId) {
      setCurrentVerseId(parseInt(verseId));
    }
  }, [verseId]);

  // Fetch data when surahId or currentVerseId changes
  useEffect(() => {
    const loadVerseData = async () => {
      if (!surahId || !currentVerseId) return;

      try {
        setLoading(true);
        setError(null);

        const [
          surahsData,
          arabicVerses,
          translationData,
          interpretationResponse,
        ] = await Promise.all([
          fetchSurahs(),
          fetchArabicVerses(parseInt(surahId)),
          fetchAyahAudioTranslations(parseInt(surahId), currentVerseId),
          fetchInterpretation(parseInt(surahId), currentVerseId, 1, "en").catch(
            (error) => {
              console.log("Interpretation API error:", error);
              return null;
            }
          ),
        ]);

        // Get surah info
        const currentSurah = surahsData.find(
          (s) => s.number === parseInt(surahId)
        );
        setSurahInfo(
          currentSurah || { arabic: "Unknown Surah", number: parseInt(surahId) }
        );
        setTotalVerses(currentSurah?.ayahs || 0);

        // Get Arabic verse
        const arabicVerse = arabicVerses.find(
          (v) => v.verse_key === `${surahId}:${currentVerseId}`
        );

        // Get translation
        const translationVerse = Array.isArray(translationData)
          ? translationData.find((t) => t.contiayano === currentVerseId)
          : translationData;

        // Combine verse data
        setVerseData({
          number: currentVerseId,
          arabic: arabicVerse?.text_uthmani || "",
          translation:
            translationVerse?.AudioText?.replace(
              /<sup[^>]*foot_note[^>]*>\d+<\/sup>/g,
              ""
            )
              ?.replace(/\s+/g, " ")
              ?.trim() || "",
          verseKey: `${surahId}:${currentVerseId}`,
        });

        // Set interpretation data - handle different response structures
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
        setError(err.message);
        console.error("Error fetching verse data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVerseData();
  }, [surahId, currentVerseId]);

  const handleNextAyah = () => {
    if (currentVerseId < totalVerses) {
      setCurrentVerseId(currentVerseId + 1);
    }
  };

  const handlePreviousAyah = () => {
    if (currentVerseId > 1) {
      setCurrentVerseId(currentVerseId - 1);
    }
  };

  const handleWordByWordClick = (verseNumber) => {
    setShowWordByWord(true);
  };

  const handleWordByWordClose = () => {
    setShowWordByWord(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70">
        <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
          <AyathNavbar
            surahId={surahId}
            verseId={currentVerseId}
            totalVerses={totalVerses}
            surahInfo={surahInfo}
            onVerseChange={setCurrentVerseId}
            onClose={onClose}
            onWordByWordClick={handleWordByWordClick}
            verseData={verseData}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading verse data...
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
          <AyathNavbar
            surahId={surahId}
            verseId={currentVerseId}
            totalVerses={totalVerses}
            surahInfo={surahInfo}
            onVerseChange={setCurrentVerseId}
            onClose={onClose}
            onWordByWordClick={handleWordByWordClick}
            verseData={verseData}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 dark:text-red-400 text-lg mb-2">
                Failed to load verse data
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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
        <AyathNavbar
          surahId={surahId}
          verseId={currentVerseId}
          totalVerses={totalVerses}
          surahInfo={surahInfo}
          onVerseChange={setCurrentVerseId}
          onClose={onClose}
          onWordByWordClick={handleWordByWordClick}
          verseData={verseData}
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
                {surahInfo?.arabic || `Surah ${surahId}`}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Verse {currentVerseId} of {totalVerses}
              </span>
            </div>
          </div>

          {/* Arabic Text */}
          {verseData && (
            <div className="text-right mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-600 pb-3 sm:pb-4">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl dark:text-white text-gray-900 leading-loose px-2 sm:px-0"
                style={{
                  fontFamily: quranFont,
                  fontSize: `${fontSize}px`,
                }}
              >
                {verseData.arabic}
              </h1>
            </div>
          )}

          {/* Translation */}
          {verseData && (
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Translation:
              </h4>
              <p
                className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                style={{ fontSize: `${translationFontSize}px` }}
              >
                {verseData.translation}
              </p>
            </div>
          )}

          {/* Interpretation */}
          {interpretationData && interpretationData.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {/* Tafheem-ul-Quran (Interpretation): */}
              </h4>
              <div className="space-y-3">
                {interpretationData.map((interpretation, index) => {
                  const interpretationText =
                    interpretation.AudioIntrerptn ||
                    interpretation.interpretation ||
                    interpretation.text ||
                    interpretation.content ||
                    "No interpretation available";

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4"
                    >
                      <p
                        className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-xs sm:text-sm lg:text-base"
                        style={{ fontSize: `${translationFontSize}px` }}
                      >
                        {interpretationText}
                      </p>
                      {/* {(interpretation.interptn_no ||
                        interpretation.number) && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Interpretation{" "}
                          {interpretation.interptn_no || interpretation.number}
                        </div>
                      )} */}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No interpretation message */}
          {(!interpretationData || interpretationData.length === 0) && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tafheem-ul-Quran (Interpretation):
              </h4>
              <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 sm:p-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                  No interpretation available for this verse.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Navigation Buttons */}
        <div className="flex justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={handlePreviousAyah}
            disabled={currentVerseId <= 1}
            className={`flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] ${
              currentVerseId <= 1
                ? "text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-gray-600"
                : "text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">
              Previous Ayah
            </span>
          </button>

          <button
            onClick={handleNextAyah}
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
      </div>

      {/* WordByWord Modal */}
      {showWordByWord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-[#2A2C38] rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="overflow-y-auto max-h-[90vh]">
              <WordByWord
                selectedVerse={currentVerseId}
                surahId={surahId}
                onClose={handleWordByWordClose}
                onNavigate={setCurrentVerseId}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AyahModal;
