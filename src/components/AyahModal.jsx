import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AyathNavbar from "./AyathNavbar";
import WordByWord from "../pages/WordByWord";
import {
  fetchInterpretation,
  fetchAllInterpretations,
  fetchArabicVerses,
  fetchAyahAudioTranslations,
  fetchSurahs,
} from "../api/apifunction";
import { API_BASE_PATH } from "../api/apis";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import banglaTranslationService from "../services/banglaTranslationService";
import englishTranslationService from "../services/englishTranslationService";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

// Cache for surahs data to prevent redundant API calls
let surahsCache = null;
let surahsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const AyahModal = ({ surahId, verseId, onClose }) => {
  const { quranFont, fontSize, translationFontSize, translationLanguage } = useTheme();
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

  // Audio functionality states
  const [playingAyah, setPlayingAyah] = useState(null);
  const [selectedQari, setSelectedQari] = useState('al-afasy');
  const [audioType, setAudioType] = useState('qirath');

  // Initialize verse from props
  useEffect(() => {
    if (verseId) {
      setCurrentVerseId(parseInt(verseId));
    }
  }, [verseId]);

  // Fetch data when surahId or currentVerseId changes
  useEffect(() => {
    let isCancelled = false;

    const loadVerseData = async () => {
      if (!surahId || !currentVerseId) return;

      try {
        setLoading(true);
        setError(null);
        setInterpretationData(null);
        setVerseData(null);

        const verseNumberForRequest = currentVerseId;

        // For Malayalam, use fetchAllInterpretations to get all interpretations for the verse
        const interpretationPromise = translationLanguage === 'mal'
          ? fetchAllInterpretations(parseInt(surahId), verseNumberForRequest, 'mal')
              .then(interpretations => interpretations || [])
              .catch(error => {
                console.error('❌ Error fetching Malayalam interpretations:', error);
                return [];
              })
          : translationLanguage === 'ta' 
          ? (() => {
    return tamilTranslationService.getAyahTranslation(parseInt(surahId), verseNumberForRequest)
                .then(translation => translation ? [{ 
                  interpretation: translation, 
                  AudioIntrerptn: translation,
                  text: translation,
                  content: translation 
                }] : [])
                .catch(() => []);
            })()
          : translationLanguage === 'hi'
            ? (() => {
    return hindiTranslationService.getAllExplanations(parseInt(surahId), verseNumberForRequest)
                  .then(explanations => {
    const mappedExplanations = explanations && explanations.length > 0 ? explanations.map(exp => ({ 
                      interpretation: exp.explanation, 
                      AudioIntrerptn: exp.explanation,
                      text: exp.explanation,
                      content: exp.explanation,
                      explanation_no_BN: exp.explanation_no_BN,
                      explanation_no_EN: exp.explanation_no_EN
                    })) : [];

                    return mappedExplanations;
                  })
                  .catch(error => {
                    console.error('❌ Error fetching Hindi explanations in AyahModal:', error);
                    return [];
                  });
              })()
          : translationLanguage === 'ur'
            ? (() => {
    return urduTranslationService.getAllExplanations(parseInt(surahId), verseNumberForRequest)
                  .then(explanations => explanations && explanations.length > 0 ? explanations.map(exp => ({ 
                    interpretation: exp.explanation, 
                    AudioIntrerptn: exp.explanation,
                    text: exp.explanation,
                    content: exp.explanation,
                    explanation_no: exp.explanation_no
                  })) : [])
                  .catch(() => []);
              })()
          : translationLanguage === 'bn'
            ? (() => {
    return banglaTranslationService.getAllExplanations(parseInt(surahId), verseNumberForRequest)
                  .then(explanations => {
    const mappedExplanations = explanations && explanations.length > 0 ? explanations.map(exp => ({ 
                      interpretation: exp.explanation, 
                      AudioIntrerptn: exp.explanation,
                      text: exp.explanation,
                      content: exp.explanation,
                      explanation_no_BNG: exp.explanation_no_BNG,
                      explanation_no_EN: exp.explanation_no_EN
                    })) : [];

                    return mappedExplanations;
                  })
                  .catch(error => {
                    console.error('❌ Error fetching Bangla explanations in AyahModal:', error);
                    return [];
                  });
              })()
            : translationLanguage === 'E'
              ? (async () => {
                  try {
                    const translation = await englishTranslationService.getAyahTranslation(parseInt(surahId), verseNumberForRequest);

                    if (!translation) return [];

                    const footnoteIds = [];
                    const footnoteRegex = /<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;
                    let match;

                    while ((match = footnoteRegex.exec(translation)) !== null) {
                      const footnoteId = match[1];
                      footnoteIds.push(footnoteId);
                    }

if (footnoteIds.length === 0) return [];

                    const footnotePromises = footnoteIds.map((footnoteId) => {
                      return fetch(`${API_BASE_PATH}/english/footnote/${footnoteId}`)
                        .then(response => {
                          if (response.ok) {
                            return response.json().then(data => ({
                              footnote_id: footnoteId,
                              text: data.footnote_text,
                              content: data.footnote_text,
                              explanation: data.footnote_text
                            }));
                          }
                          return null;
                        })
                        .catch(error => {
                          console.error(`❌ Error fetching footnote ${footnoteId}:`, error);
                          return null;
                        });
                    });

                    const footnotes = await Promise.all(footnotePromises);
                    const validFootnotes = footnotes.filter(f => f !== null);

return validFootnotes.map((footnote, index) => ({
                      interpretation: footnote.text,
                      AudioIntrerptn: footnote.text,
                      text: footnote.text,
                      content: footnote.text,
                      interptn_no: footnote.footnote_id || (index + 1)
                    }));
                  } catch (error) {
                    console.error(`❌ [AyahModal] Error fetching English translation for verse ${verseNumberForRequest}:`, error);
                    return [];
                  }
                })()
              : (async () => {
                  try {
                    if (translationLanguage === 'mal') {
                      const allInterpretations = await fetchAllInterpretations(
                        parseInt(surahId),
                        verseNumberForRequest,
                        'mal'
                      );
                      return allInterpretations;
                    }

                    return await fetchInterpretation(
                      parseInt(surahId),
                      verseNumberForRequest,
                      1,
                      translationLanguage
                    );
                  } catch (error) {
                    if (parseInt(surahId) === 114) {
                      return null;
                    }
                    return null;
                  }
                })();

        const translationPromise = (translationLanguage === 'ta' || translationLanguage === 'hi' || translationLanguage === 'bn' || translationLanguage === 'E') 
          ? Promise.resolve(null) 
          : fetchAyahAudioTranslations(parseInt(surahId), verseNumberForRequest);

        const now = Date.now();
        const getSurahsData = async () => {
          if (surahsCache && (now - surahsCacheTime) < CACHE_DURATION) {
    return surahsCache;
          }

          const data = await fetchSurahs();
          surahsCache = data;
          surahsCacheTime = now;
          return data;
        };

        const [
          surahsData,
          arabicVerses,
          translationData,
          interpretationResponse,
        ] = await Promise.all([
          getSurahsData(),
          fetchArabicVerses(parseInt(surahId)),
          translationPromise,
          interpretationPromise,
        ]);

        if (isCancelled) return;

        const currentSurah = surahsData.find(
          (s) => s.number === parseInt(surahId)
        );
        setSurahInfo(
          currentSurah || { arabic: "Unknown Surah", number: parseInt(surahId) }
        );
        setTotalVerses(currentSurah?.ayahs || 0);

        const arabicVerse = arabicVerses.find(
          (v) => v.verse_key === `${surahId}:${verseNumberForRequest}`
        );

        const translationVerse = translationData 
          ? (Array.isArray(translationData)
              ? translationData.find((t) => t.contiayano === verseNumberForRequest)
              : translationData)
          : null;

        let englishTranslation = "";
        if (translationLanguage === 'E') {
          try {
            englishTranslation = await englishTranslationService.getAyahTranslation(parseInt(surahId), verseNumberForRequest);
            englishTranslation = englishTranslation
              ? englishTranslation
                  .replace(/<sup[^>]*foot_note[^>]*>\d+<\/sup>/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
              : "";
          } catch (error) {
            console.error('Error fetching English translation:', error);
            englishTranslation = "";
          }
        }

        if (isCancelled) return;

        setVerseData({
          number: verseNumberForRequest,
          arabic: arabicVerse?.text_uthmani || "",
          translation: translationLanguage === 'E' 
            ? englishTranslation
            : (translationVerse?.AudioText
                ? translationVerse.AudioText
                    .replace(/<sup[^>]*foot_note[^>]*>\d+<\/sup>/g, "")
                    .replace(/\s+/g, " ")
                    .trim()
                : ""),
          verseKey: `${surahId}:${verseNumberForRequest}`,
        });

        if (isCancelled) return;

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
        if (isCancelled) return;
        setError(err.message);
        console.error("Error fetching verse data:", err);
      } finally {
        if (isCancelled) return;
        setLoading(false);
      }
    };

    loadVerseData();

    return () => {
      isCancelled = true;
    };
  }, [surahId, currentVerseId, translationLanguage]);

  // Handle clicks on Bangla explanation numbers
  useEffect(() => {
    const handleBanglaExplanationClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".bangla-explanation-link");
      if (target) {
        const explanationNumber = target.getAttribute("data-explanation-number");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (explanationNumber && surahNo && ayahNo) {
          try {
            const explanation = await banglaTranslationService.getExplanationByNumber(
              parseInt(surahNo), 
              parseInt(ayahNo), 
              explanationNumber
            );

            if (explanation) {
              // Show explanation in a simple alert for now
              // You can replace this with a modal or toast notification
              alert(`Explanation ${explanationNumber}:\n\n${explanation}`);
            } else {
              alert('Explanation not found.');
            }
          } catch (error) {
            console.error('❌ Error loading Bangla explanation:', error);
            alert('Error loading explanation.');
          }
        }
      }
    };

    document.addEventListener("click", handleBanglaExplanationClick);
    return () => {
      document.removeEventListener("click", handleBanglaExplanationClick);
    };
  }, []);

  // Handle clicks on Hindi explanation numbers
  useEffect(() => {
    const handleHindiExplanationClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".hindi-explanation-link");
      if (target) {
        const explanationNumber = target.getAttribute("data-explanation-number");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (explanationNumber && surahNo && ayahNo) {
          try {
            const explanation = await hindiTranslationService.getExplanationByNumber(
              parseInt(surahNo), 
              parseInt(ayahNo), 
              explanationNumber
            );

            if (explanation) {
              // Show explanation in a modal or alert
              alert(`Explanation ${explanationNumber}:\n\n${explanation}`);
            } else {
              alert(`Explanation ${explanationNumber} not found.`);
            }
          } catch (error) {
            console.error('❌ Error loading Hindi explanation:', error);
            alert('Error loading explanation.');
          }
        }
      }
    };

    document.addEventListener("click", handleHindiExplanationClick);
    return () => {
      document.removeEventListener("click", handleHindiExplanationClick);
    };
  }, []);

  // Handle clicks on Urdu footnote numbers
  useEffect(() => {
    const handleUrduFootnoteClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target.closest(".urdu-footnote-link");
      if (target) {
        const footnoteId = target.getAttribute("data-footnote-id");
        const footnoteNumber = target.getAttribute("data-footnote-number");
        const surahNo = target.getAttribute("data-surah");
        const ayahNo = target.getAttribute("data-ayah");

        if (footnoteId && surahNo && ayahNo) {
          try {
            const explanation = await urduTranslationService.getFootnoteExplanation(footnoteId);

            if (explanation && explanation.trim() !== '' && explanation !== 'Explanation not available') {
              setInterpretationData([{
                interpretation: explanation,
                AudioIntrerptn: explanation,
                text: explanation,
                content: explanation
              }]);
              setShowInterpretationModal(true);
            } else {
              showToast('Footnote explanation not available', 'warning');
            }
          } catch (error) {
            console.error('Error fetching Urdu footnote:', error);
            showToast('Failed to load footnote explanation', 'error');
          }
        }
      }
    };

    document.addEventListener("click", handleUrduFootnoteClick);
    return () => {
      document.removeEventListener("click", handleUrduFootnoteClick);
    };
  }, []);

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

  // Prevent body scroll when word-by-word modal is open
  useEffect(() => {
    if (showWordByWord) {
      // Save current body overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Restore on cleanup
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showWordByWord]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-start justify-center z-[99999] pt-24 sm:pt-28 lg:pt-32 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-hidden">
        <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden">
          <AyathNavbar
            surahId={surahId}
            verseId={currentVerseId}
            totalVerses={totalVerses}
            surahInfo={surahInfo}
            onVerseChange={setCurrentVerseId}
            onClose={onClose}
            onWordByWordClick={handleWordByWordClick}
            verseData={verseData}
            selectedQari={selectedQari}
            onQariChange={setSelectedQari}
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
      <div className="fixed inset-0 flex items-start justify-center z-[99999] pt-24 sm:pt-28 lg:pt-32 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-hidden">
        <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden">
          <AyathNavbar
            surahId={surahId}
            verseId={currentVerseId}
            totalVerses={totalVerses}
            surahInfo={surahInfo}
            onVerseChange={setCurrentVerseId}
            onClose={onClose}
            onWordByWordClick={handleWordByWordClick}
            verseData={verseData}
            selectedQari={selectedQari}
            onQariChange={setSelectedQari}
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
    <div className="fixed inset-0 flex items-start justify-center z-[99999] pt-24 sm:pt-28 lg:pt-32 p-2 sm:p-4 lg:p-6 bg-gray-500/70 dark:bg-black/70 overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden">
        <AyathNavbar
          surahId={surahId}
          verseId={currentVerseId}
          totalVerses={totalVerses}
          surahInfo={surahInfo}
          onVerseChange={setCurrentVerseId}
          onClose={onClose}
          onWordByWordClick={handleWordByWordClick}
          verseData={verseData}
          selectedQari={selectedQari}
          onQariChange={setSelectedQari}
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
                {(() => {
    if (translationLanguage === 'hi' || translationLanguage === 'ur' || translationLanguage === 'bn') {
                    return 'Explanation:';
                  } else if (translationLanguage === 'E') {
                    return 'Interpretation:';
                  } else {
                    return 'Translation:';
                  }
                })()}
              </h4>
              {translationLanguage === 'bn' ? (
                <div
                  className="text-gray-700 leading-[1.6] font-bengali sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ 
                    __html: banglaTranslationService.parseBanglaTranslationWithClickableExplanations(
                      verseData.translation, 
                      parseInt(surahId), 
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'hi' ? (
                <div
                  className="text-gray-700 leading-[1.6] font-hindi sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ 
                    __html: hindiTranslationService.parseHindiTranslationWithClickableExplanations(
                      verseData.translation, 
                      parseInt(surahId), 
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'ur' ? (
                <div
                  className="text-gray-700 leading-[1.6] font-urdu sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ 
                    __html: urduTranslationService.parseUrduTranslationWithClickableFootnotes(
                      verseData.translation, 
                      parseInt(surahId), 
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'ta' ? (
                <div
                  className="text-gray-700 leading-[1.6] font-tamil sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: verseData.translation }}
                />
              ) : (
                <p
                  className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                >
                  {verseData.translation}
                </p>
              )}
            </div>
          )}

          {/* Interpretation */}
          {(() => {

            if (interpretationData && interpretationData.length > 0) {
  }
            return null;
          })()}
          {interpretationData && interpretationData.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {/* Tafheem-ul-Quran (Interpretation): */}
              </h4>
              <div className="space-y-3">
                {interpretationData.map((interpretation, index) => {
    const interpretationTextCandidates = [
                      interpretation.AudioIntrerptn,
                      interpretation.interpretation,
                      interpretation.Interpretation,
                      interpretation.text,
                      interpretation.content,
                      interpretation?.interpretation_text,
                      interpretation?.InterpretationText,
                    ];

                    const interpretationText = interpretationTextCandidates.find(
                      (value) =>
                        typeof value === "string" && value.trim().length > 0
                    ) || "No interpretation available";

                  // For Hindi, Urdu, and English, show explanation/interpretation numbers
                  const explanationNumber = translationLanguage === 'hi' 
                    ? (interpretation.explanation_no_BN || interpretation.explanation_no_EN || index + 1)
                    : translationLanguage === 'bn'
                    ? (interpretation.explanation_no_BNG || interpretation.explanation_no_EN || index + 1)
                    : translationLanguage === 'ur'
                    ? (interpretation.explanation_no || index + 1)
                    : translationLanguage === 'E'
                    ? (interpretation.interptn_no || interpretation.number || index + 1)
                    : (interpretation.interptn_no || interpretation.number || index + 1);

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4"
                    >
                      {(translationLanguage === 'hi' || translationLanguage === 'ur') && (
                        <div className="mb-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                          Explanation {explanationNumber}:
                        </div>
                      )}
                      {translationLanguage === 'E' && (
                        <div className="mb-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                          Interpretation {explanationNumber}:
                        </div>
                      )}
                      <p
                        className="text-gray-700 leading-[1.6] font-poppins sm:leading-[1.7] lg:leading-[1.8] dark:text-white text-xs sm:text-sm lg:text-base"
                        style={{ fontSize: `${translationFontSize}px` }}
                      >
                        {interpretationText}
                      </p>
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
                  {(() => {
    return parseInt(surahId) === 114 
                      ? "Interpretation data is not available for Surah An-Nas (114). This surah may not have interpretation content in the current database."
                      : "No interpretation available for this verse. The interpretation API may be temporarily unavailable.";
                  })()}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[99999] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden">
          <div className="bg-white dark:bg-[#2A2C38] rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1">
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
