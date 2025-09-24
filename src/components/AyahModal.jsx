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
import { useAuth } from "../context/AuthContext";
import BookmarkService from "../services/bookmarkService";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

// Fallback interpretation content for common verses
const getFallbackInterpretation = (surahId, verseId) => {
  const fallbackContent = {
    '2:163': [{
      interpret_text: `This verse establishes the fundamental Islamic belief in the oneness of Allah (Tawhid). It declares that Allah is the one and only God, and there is no deity except Him. The verse emphasizes Allah's attributes of mercy (Ar-Rahman and Ar-Raheem), highlighting that He is the Most Merciful and the Especially Merciful. This verse is often recited in prayers and serves as a reminder of the core principle of Islamic monotheism.`,
      interptn_no: 1
    }],
    '2:255': [{
      interpret_text: `This is the famous Ayat al-Kursi (Verse of the Throne), one of the most powerful verses in the Quran. It describes Allah's sovereignty, knowledge, and power. The verse emphasizes that Allah's throne extends over the heavens and earth, and that maintaining them does not tire Him. It also highlights Allah's unique attributes and His position as the Most High and Most Great.`,
      interptn_no: 1
    }],
    '1:1': [{
      interpret_text: `This is the opening verse of the Quran, known as Al-Fatiha. It begins with "Bismillah" (In the name of Allah), which is a fundamental Islamic practice. The verse establishes the proper way to begin any action - in the name of Allah, the Most Gracious, the Most Merciful. This phrase is recited before starting any important task in Islamic tradition.`,
      interptn_no: 1
    }],
    '112:1': [{
      interpret_text: `This is the first verse of Surah Al-Ikhlas (The Sincerity), which is considered equivalent to one-third of the Quran. It declares the absolute oneness of Allah, stating "Say: He is Allah, One." This verse establishes the fundamental principle of Islamic monotheism and is often recited in prayers and supplications.`,
      interptn_no: 1
    }]
  };
  
  const key = `${surahId}:${verseId}`;
  return fallbackContent[key] || [{
    interpret_text: `Interpretation for Surah ${surahId}, Verse ${verseId} is currently unavailable. This may be due to API limitations or the specific verse not having interpretation data in the current system. The verse content is still available above for your reference.`,
    interptn_no: 1
  }];
};

// Fallback translation content for common verses
const getFallbackTranslation = (surahId, verseId) => {
  const fallbackTranslations = {
    '2:163': 'And your God is one God. There is no deity except Him, the Entirely Merciful, the Especially Merciful.',
    '2:255': 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    '1:1': 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    '1:2': 'All praise is due to Allah, Lord of the worlds.',
    '1:3': 'The Entirely Merciful, the Especially Merciful.',
    '1:4': 'Sovereign of the Day of Recompense.',
    '1:5': 'It is You we worship and You we ask for help.',
    '1:6': 'Guide us to the straight path.',
    '1:7': 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
    '112:1': 'Say, "He is Allah, [who is] One,',
    '112:2': 'Allah, the Eternal Refuge.',
    '112:3': 'He neither begets nor is born,',
    '112:4': 'Nor is there to Him any equivalent."'
  };
  
  const key = `${surahId}:${verseId}`;
  return fallbackTranslations[key] || null;
};

const AyahModal = ({ surahId, verseId, onClose, interpretationNo = 1, language = "en" }) => {
  const { quranFont, fontSize, translationFontSize } = useTheme();
  const { user } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  
  // Debug: Log when toast functions are available
  useEffect(() => {
    console.log('AyahModal: Toast functions available:', {
      showSuccess: typeof showSuccess,
      showError: typeof showError,
      toasts: toasts.length
    });
  }, [showSuccess, showError, toasts]);

  // State management
  const [currentVerseId, setCurrentVerseId] = useState(verseId ? parseInt(verseId) : 1);
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

        // Fetch core data with timeout handling
        const [surahsData, arabicVerses, interpretationResponse] = await Promise.allSettled([
          fetchSurahs(),
          fetchArabicVerses(parseInt(surahId)),
          fetchInterpretation(parseInt(surahId), currentVerseId, interpretationNo, language),
        ]).then(results => [
          results[0].status === 'fulfilled' ? results[0].value : [],
          results[1].status === 'fulfilled' ? results[1].value : [],
          results[2].status === 'fulfilled' ? results[2].value : null,
        ]);

        // Try to fetch translation data, but don't fail if it's not available
        let translationData = null;
        try {
          translationData = await fetchAyahAudioTranslations(parseInt(surahId), currentVerseId);
        } catch (err) {
          // Translation API is not available yet, continue without it
          console.log('Translation API not available, using fallback');
        }

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

        // Get translation (with fallback if API is not available)
        const translationVerse = translationData 
          ? (Array.isArray(translationData)
              ? translationData.find((t) => t.contiayano === currentVerseId)
              : translationData)
          : null;

        // Get fallback translation if API translation is not available
        const fallbackTranslation = getFallbackTranslation(surahId, currentVerseId);

        // Combine verse data
        setVerseData({
          number: currentVerseId,
          arabic: arabicVerse?.text_uthmani || "",
          translation: translationVerse?.AudioText
            ? translationVerse.AudioText.replace(
                /<sup[^>]*foot_note[^>]*>\d+<\/sup>/g,
                ""
              )
                .replace(/\s+/g, " ")
                .trim()
            : fallbackTranslation || `Translation for Surah ${surahId}, Verse ${currentVerseId} is currently unavailable.`,
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
            // Set fallback interpretation content for common verses
            console.log('Setting fallback interpretation for response type issue');
            const fallbackInterpretation = getFallbackInterpretation(surahId, currentVerseId);
            setInterpretationData(fallbackInterpretation);
          }
        } else {
          // This should not happen now since API function returns fallback data
          console.log('No interpretation response received, setting fallback');
          const fallbackInterpretation = getFallbackInterpretation(surahId, currentVerseId);
          setInterpretationData(fallbackInterpretation);
        }
      } catch (err) {
        console.warn("Error fetching verse data:", err.message);
        setError('Unable to load verse data. The API server may be temporarily unavailable. Please try again later.');
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

  // Test function to verify toast system
  const testToast = () => {
    console.log('Testing toast system...');
    if (showSuccess) {
      showSuccess('Test toast message - AyahModal working!');
    } else {
      console.error('showSuccess function not available');
    }
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
            showSuccess={showSuccess}
            showError={showError}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading verse data...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  const userId = BookmarkService.getEffectiveUserId(user);
                  await BookmarkService.addAyahInterpretationBookmark(
                    userId,
                    surahId,
                    currentVerseId,
                    surahInfo?.arabic || `Surah ${surahId}`
                  );
                } catch (e) {
                  console.error('Failed to save ayah-interpretation bookmark', e);
                }
              }}
              className="text-xs px-2 py-1 border rounded text-gray-600 dark:text-white border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Bookmark Interpretation
            </button>
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
            showSuccess={showSuccess}
            showError={showError}
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
                {surahInfo?.arabic || `Surah ${surahId}`}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Verse {currentVerseId} of {totalVerses}
                </span>
                {/* Temporary test button */}
                <button
                  onClick={testToast}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Test Toast
                </button>
              </div>
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
          {(() => {
            return interpretationData && interpretationData.length > 0;
          })() && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {/* Tafheem-ul-Quran (Interpretation): */}
              </h4>
              <div className="space-y-3">
                {interpretationData.map((interpretation, index) => {
                  const interpretationText =
                    interpretation.AudioIntrerptn ||
                    interpretation.interpretation ||
                    interpretation.interpret_text ||
                    interpretation.Interpretation ||
                    interpretation.text ||
                    interpretation.content ||
                    "No interpretation available";

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4"
                    >
                      <div
                        className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-xs sm:text-sm lg:text-base"
                        style={{ fontSize: `${translationFontSize}px` }}
                      >
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: interpretationText }}
                        />
                      </div>
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
        <div className="flex justify-between gap-3 sm:gap-0 p-3 sm:p-4 bg-white dark:bg-gray-900">
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
