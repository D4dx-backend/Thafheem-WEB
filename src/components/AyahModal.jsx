import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import AyathNavbar from "./AyathNavbar";
import WordByWord from "../pages/WordByWord";
import { useNavigate } from "react-router-dom";
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
import {
  getCalligraphicSurahName,
  surahNameFontFamily,
} from "../utils/surahNameUtils.js";

// Cache for surahs data to prevent redundant API calls
let surahsCache = null;
let surahsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const AyahModal = ({ surahId, verseId, onClose }) => {
  const { quranFont, fontSize, translationFontSize, translationLanguage } = useTheme();
  const { toasts, removeToast } = useToast();
  const navigate = useNavigate();

  const [activeSurahId, setActiveSurahId] = useState(() => {
    const parsed = parseInt(surahId, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });

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

  useEffect(() => {
    const parsed = parseInt(surahId, 10);
    if (!Number.isNaN(parsed)) {
      setActiveSurahId(parsed);
    }
  }, [surahId]);

  // Fetch data when activeSurahId or currentVerseId changes
  useEffect(() => {
    let isCancelled = false;

    const loadVerseData = async () => {
      if (!activeSurahId || !currentVerseId) return;

      try {
        setLoading(true);
        setError(null);
        setInterpretationData(null);
        setVerseData(null);

        const verseNumberForRequest = currentVerseId;

        // For Malayalam, use fetchAllInterpretations to get all interpretations for the verse
        const interpretationPromise = translationLanguage === 'mal'
          ? fetchAllInterpretations(activeSurahId, verseNumberForRequest, 'mal')
            .then(interpretations => interpretations || [])
            .catch(error => {
              console.error('❌ Error fetching Malayalam interpretations:', error);
              return [];
            })
          : translationLanguage === 'ta'
            ? (() => {
              return tamilTranslationService.getAyahTranslation(activeSurahId, verseNumberForRequest)
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
                return hindiTranslationService.getAllExplanations(activeSurahId, verseNumberForRequest)
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
                  return urduTranslationService.getAllExplanations(activeSurahId, verseNumberForRequest)
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
                    return banglaTranslationService.getAllExplanations(activeSurahId, verseNumberForRequest)
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
                        const translation = await englishTranslationService.getAyahTranslation(activeSurahId, verseNumberForRequest);

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
                            activeSurahId,
                            verseNumberForRequest,
                            'mal'
                          );
                          return allInterpretations;
                        }

                        return await fetchInterpretation(
                          activeSurahId,
                          verseNumberForRequest,
                          1,
                          translationLanguage
                        );
                      } catch (error) {
                        if (activeSurahId === 114) {
                          return null;
                        }
                        return null;
                      }
                    })();

        const translationPromise = (translationLanguage === 'ta' || translationLanguage === 'hi' || translationLanguage === 'bn' || translationLanguage === 'E')
          ? Promise.resolve(null)
          : fetchAyahAudioTranslations(activeSurahId, verseNumberForRequest);

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
          fetchArabicVerses(activeSurahId),
          translationPromise,
          interpretationPromise,
        ]);

        if (isCancelled) return;

        const currentSurah = surahsData.find(
          (s) => s.number === activeSurahId
        );
        setSurahInfo(
          currentSurah || { arabic: "Unknown Surah", number: activeSurahId }
        );
        setTotalVerses(currentSurah?.ayahs || 0);

        const arabicVerse = arabicVerses.find(
          (v) => v.verse_key === `${activeSurahId}:${verseNumberForRequest}`
        );

        const translationVerse = translationData
          ? (Array.isArray(translationData)
            ? translationData.find((t) => t.contiayano === verseNumberForRequest)
            : translationData)
          : null;

        let englishTranslation = "";
        if (translationLanguage === 'E') {
          try {
            englishTranslation = await englishTranslationService.getAyahTranslation(activeSurahId, verseNumberForRequest);
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
          verseKey: `${activeSurahId}:${verseNumberForRequest}`,
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
  }, [activeSurahId, currentVerseId, translationLanguage]);

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

  const handleInterpretationContentClick = (event) => {
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

    if (/^N\d+$/.test(normalized)) {
      handled = true;
      if (onClose) {
        onClose();
      }
      navigate(`/note/${normalized}`);
    } else {
      const verseMatch = rawText.match(/(\d+)\s*[:：]\s*(\d+)/);
      if (verseMatch) {
        const surahRef = parseInt(verseMatch[1], 10);
        const ayahRef = parseInt(verseMatch[2], 10);
        if (Number.isFinite(surahRef) && Number.isFinite(ayahRef)) {
          handled = true;
          setActiveSurahId(surahRef);
          setCurrentVerseId(ayahRef);
        }
      }
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
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

  // Portal target
  const modalRoot = document.getElementById('modal-root') || document.body;

  // Loading state
  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="relative w-full sm:w-auto sm:min-w-[600px] lg:min-w-[800px] max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-[#2A2C38] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">
          <AyathNavbar
            surahId={activeSurahId}
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
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading verse data...
              </p>
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  }

  // Error state
  if (error) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full sm:w-auto sm:min-w-[600px] max-w-4xl flex flex-col bg-white dark:bg-[#2A2C38] rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">
          <AyathNavbar
            surahId={activeSurahId}
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
          <div className="flex-1 flex items-center justify-center min-h-[300px] p-6">
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
      </div>,
      modalRoot
    );
  }

  const isEnglishTranslation =
    typeof translationLanguage === "string" &&
    ["e", "en"].includes(translationLanguage.toLowerCase());

  const accessibleSurahName =
    surahInfo?.arabic || (activeSurahId ? `Surah ${activeSurahId}` : "Surah");
  const calligraphicSurahName = getCalligraphicSurahName(
    activeSurahId,
    accessibleSurahName
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full sm:w-auto sm:min-w-[600px] lg:min-w-[800px] max-w-4xl xl:max-w-[1073px] max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-xl shadow-2xl transform transition-all duration-300 overflow-hidden animate-slideUp sm:animate-fadeIn">

        {/* Mobile Drag Handle */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" onClick={onClose}>
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        <AyathNavbar
          surahId={activeSurahId}
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
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900/50">
          {/* Verse Info Header */}
          <div className="mb-4 sm:mb-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-2">
              <h3
                className="text-2xl sm:text-3xl font-medium text-gray-800 dark:text-gray-200"
                style={{
                  fontFamily: surahNameFontFamily,
                }}
                aria-label={accessibleSurahName}
              >
                {calligraphicSurahName}
              </h3>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                Verse {currentVerseId} of {totalVerses}
              </span>
            </div>
          </div>

          {/* Arabic Text */}
          {verseData && (
            <div className="text-right mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl dark:text-white text-gray-900 leading-[2.2] px-2 sm:px-0"
                style={{
                  fontFamily: quranFont,
                  fontSize: `${fontSize}px`,
                }}
                dir="rtl"
              >
                {verseData.arabic}
              </h1>
            </div>
          )}

          {/* Translation */}
          {verseData && !isEnglishTranslation && (
            <div className="mb-6 sm:mb-8">
              {translationLanguage === 'bn' ? (
                <div
                  className="text-gray-700 leading-[1.8] font-bengali dark:text-gray-200 px-2 sm:px-0 prose dark:prose-invert max-w-none"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: banglaTranslationService.parseBanglaTranslationWithClickableExplanations(
                      verseData.translation,
                      activeSurahId,
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'hi' ? (
                <div
                  className="text-gray-700 leading-[1.8] font-hindi dark:text-gray-200 px-2 sm:px-0 prose dark:prose-invert max-w-none"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{
                    __html: hindiTranslationService.parseHindiTranslationWithClickableExplanations(
                      verseData.translation,
                      activeSurahId,
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'ur' ? (
                <div
                  className="text-gray-700 leading-[1.8] font-urdu dark:text-gray-200 px-2 sm:px-0 text-right prose dark:prose-invert max-w-none"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dir="rtl"
                  dangerouslySetInnerHTML={{
                    __html: urduTranslationService.parseUrduTranslationWithClickableFootnotes(
                      verseData.translation,
                      activeSurahId,
                      currentVerseId
                    )
                  }}
                />
              ) : translationLanguage === 'ta' ? (
                <div
                  className="text-gray-700 leading-[1.8] font-tamil dark:text-gray-200 px-2 sm:px-0 prose dark:prose-invert max-w-none"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: verseData.translation }}
                />
              ) : (
                <p
                  className="text-gray-700 leading-[1.8] font-poppins dark:text-gray-200 px-2 sm:px-0"
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
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary-light mb-4 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary dark:bg-primary-light"></span>
                Tafheem-ul-Quran
              </h4>
              {translationLanguage === "mal" && (
                <style>
                  {`
                    .ayah-interpretation-content sup.f-intprno,
                    .ayah-interpretation-content sup.f-noteno,
                    .ayah-interpretation-content a.crs {
                      color: #0F766E !important;
                      cursor: pointer !important;
                      text-decoration: none !important;
                      font-weight: bold;
                    }
                    .dark .ayah-interpretation-content sup.f-intprno,
                    .dark .ayah-interpretation-content sup.f-noteno,
                    .dark .ayah-interpretation-content a.crs {
                      color: #14B8A6 !important;
                    }

                    .ayah-interpretation-content sup.f-intprno:hover,
                    .ayah-interpretation-content sup.f-noteno:hover,
                    .ayah-interpretation-content a.crs:hover {
                      text-decoration: underline !important;
                    }
                  `}
                </style>
              )}
              <div
                className="space-y-4 ayah-interpretation-content"
                onClick={handleInterpretationContentClick}
              >
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

                  const interpretationText =
                    interpretationTextCandidates.find(
                      (value) =>
                        typeof value === "string" && value.trim().length > 0
                    ) || "No interpretation available";

                  const interpretationHtml =
                    typeof interpretationText === "string"
                      ? interpretationText
                      : String(interpretationText ?? "");

                  // For Hindi, Urdu, and English, show explanation/interpretation numbers
                  const explanationNumber =
                    translationLanguage === "hi"
                      ? interpretation.explanation_no_BN ||
                      interpretation.explanation_no_EN ||
                      index + 1
                      : translationLanguage === "bn"
                        ? interpretation.explanation_no_BNG ||
                        interpretation.explanation_no_EN ||
                        index + 1
                        : translationLanguage === "ur"
                          ? interpretation.explanation_no || index + 1
                          : isEnglishTranslation
                            ? interpretation.interptn_no ||
                            interpretation.number ||
                            index + 1
                            : interpretation.resolvedInterpretationNo ||
                            interpretation.InterpretationNo ||
                            interpretation.Interpretation_No ||
                            interpretation.interptn_no ||
                            interpretation.number ||
                            interpretation.requestedInterpretationNo ||
                            index + 1;

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    >
                      {(translationLanguage === "hi" ||
                        translationLanguage === "ur") && (
                          <div className="mb-3 text-sm font-bold text-primary dark:text-primary-light">
                            Explanation {explanationNumber}:
                          </div>
                        )}
                      {isEnglishTranslation && null}
                      <div
                        className="text-gray-700 leading-[1.8] font-poppins dark:text-gray-300 text-sm sm:text-base"
                        style={{ fontSize: `${translationFontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: interpretationHtml }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No interpretation message */}
          {(!interpretationData || interpretationData.length === 0) && (
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                Interpretation
              </h4>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-sm italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                  {(() => {
                    return activeSurahId === 114
                      ? "Interpretation data is not available for Surah An-Nas (114)."
                      : "No interpretation available for this verse.";
                  })()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Bottom Navigation Buttons */}
        <div className="flex justify-between gap-3 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handlePreviousAyah}
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
            onClick={handleNextAyah}
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
      </div>

      {showWordByWord && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden">
          <div className="bg-white dark:bg-[#2A2C38] rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-6xl max-w-[95vw]">
            <WordByWord
              selectedVerse={currentVerseId}
              surahId={activeSurahId}
              onClose={handleWordByWordClose}
              onNavigate={setCurrentVerseId}
            />
          </div>
        </div>,
        modalRoot
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>,
    modalRoot
  );
};

export default AyahModal;
