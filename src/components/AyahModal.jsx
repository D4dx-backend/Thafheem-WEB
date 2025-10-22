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
import { API_BASE_URL } from "../api/apis";
import tamilTranslationService from "../services/tamilTranslationService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import banglaTranslationService from "../services/banglaTranslationService";
import banglaInterpretationService from "../services/banglaInterpretationService";
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
    const loadVerseData = async () => {
      if (!surahId || !currentVerseId) return;

      try {
        setLoading(true);
        setError(null);

        // Debug: Log the current language
        console.log('🔍 Current translation language:', translationLanguage);
        console.log('🔍 Translation language type:', typeof translationLanguage);
        console.log('🔍 Translation language === "E":', translationLanguage === 'E');
        console.log('🔍 Translation language === "en":', translationLanguage === 'en');
        
        // For Tamil, Hindi, Urdu, and Bangla, use their respective translation services instead of interpretation API
        const interpretationPromise = translationLanguage === 'ta' 
          ? (() => {
              console.log('🔍 Taking Tamil translation path');
              return tamilTranslationService.getAyahTranslation(parseInt(surahId), currentVerseId)
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
                console.log('🔍 Taking Hindi translation path');
                return hindiTranslationService.getAllExplanations(parseInt(surahId), currentVerseId)
                  .then(explanations => explanations && explanations.length > 0 ? explanations.map(exp => ({ 
                    interpretation: exp.explanation, 
                    AudioIntrerptn: exp.explanation,
                    text: exp.explanation,
                    content: exp.explanation,
                    explanation_no_BNG: exp.explanation_no_BNG,
                    explanation_no_EN: exp.explanation_no_EN
                  })) : [])
                  .catch(() => []);
              })()
          : translationLanguage === 'ur'
            ? (() => {
                console.log('🔍 Taking Urdu translation path');
                return urduTranslationService.getAllExplanations(parseInt(surahId), currentVerseId)
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
                console.log('🔍 Taking Bangla interpretation path');
                return banglaInterpretationService.getAllExplanations(parseInt(surahId), currentVerseId)
                  .then(explanations => {
                    console.log('🔍 Bangla explanations received:', explanations);
                    return explanations && explanations.length > 0 ? explanations.map(exp => ({ 
                      interpretation: exp.explanation, 
                      AudioIntrerptn: exp.explanation,
                      text: exp.explanation,
                      content: exp.explanation,
                      explanation_no_BNG: exp.explanation_no_BNG,
                      explanation_no_EN: exp.explanation_no_EN
                    })) : [];
                  })
                  .catch(error => {
                    console.error('❌ Error fetching Bangla explanations in AyahModal:', error);
                    return [];
                  });
              })()
            : translationLanguage === 'E'
              ? (() => {
                  console.log('🔍 [AyahModal v2.5] Taking English fetchAllInterpretations path');
                  return fetchAllInterpretations(parseInt(surahId), currentVerseId, translationLanguage)
                    .then(interpretations => {
                      console.log('🔍 English interpretations received:', interpretations);
                      console.log('🔍 English interpretations type:', typeof interpretations);
                      console.log('🔍 English interpretations isArray:', Array.isArray(interpretations));
                      console.log('🔍 English interpretations length:', interpretations?.length);
                      
                      if (interpretations && interpretations.length > 0) {
                        // For English, show only the first/primary interpretation to avoid showing "whole" content
                        const primaryInterpretation = interpretations[0];
                        console.log('🔍 Using primary English interpretation:', primaryInterpretation);
                        
                        const processed = {
                          interpretation: primaryInterpretation.Interpretation || primaryInterpretation.AudioIntrerptn || primaryInterpretation.interpretation || primaryInterpretation.text || primaryInterpretation.content,
                          AudioIntrerptn: primaryInterpretation.Interpretation || primaryInterpretation.AudioIntrerptn || primaryInterpretation.interpretation || primaryInterpretation.text || primaryInterpretation.content,
                          text: primaryInterpretation.Interpretation || primaryInterpretation.AudioIntrerptn || primaryInterpretation.interpretation || primaryInterpretation.text || primaryInterpretation.content,
                          content: primaryInterpretation.Interpretation || primaryInterpretation.AudioIntrerptn || primaryInterpretation.interpretation || primaryInterpretation.text || primaryInterpretation.content,
                          interptn_no: primaryInterpretation.InterpretationNo || primaryInterpretation.interptn_no || primaryInterpretation.number
                        };
                        console.log('🔍 Processed primary interpretation:', processed);
                        return [processed]; // Return as single-item array to match expected format
                      }
                      console.log('🔍 No interpretations to process, returning empty array');
                      return [];
                    })
                    .catch(async (error) => {
                      console.log('❌ English interpretation fetchAllInterpretations failed, trying fallback:', error);
                      // Fallback: Try to fetch multiple interpretations using direct API calls
                      console.log('🔍 Trying fallback with direct API calls for multiple interpretations');
                      console.log('🔍 Fallback - surahId:', surahId, 'currentVerseId:', currentVerseId);
                      
                      // Try to fetch interpretations sequentially and stop when we don't find valid ones
                      const validInterpretations = [];
                      let consecutiveFailures = 0;
                      const maxConsecutiveFailures = 2; // Stop after 2 consecutive failures
                      
                      for (let i = 1; i <= 10; i++) {
                        // If we've had too many consecutive failures, stop trying
                        if (consecutiveFailures >= maxConsecutiveFailures) {
                          console.log(`🔍 Stopping interpretation fetch after ${consecutiveFailures} consecutive failures`);
                          break;
                        }
                        
                        const directUrl = `${API_BASE_URL}/interpret/${parseInt(surahId)}/${parseInt(currentVerseId)}/${i}/E`;
                        console.log(`🔍 Trying direct API call for interpretation ${i}:`, directUrl);
                        
                        try {
                          const resp = await fetch(directUrl);
                          if (!resp.ok) {
                            console.log(`🔍 Interpretation ${i} API call failed with status:`, resp.status);
                            consecutiveFailures++;
                            continue;
                          }
                          
                          const data = await resp.json();
                          
                          // Check if the response indicates no interpretation exists
                          if (!data || !data.Interpretation || data.Interpretation.trim().length === 0) {
                            console.log(`🔍 Interpretation ${i} does not exist (empty response)`);
                            consecutiveFailures++;
                            continue;
                          }
                          
                          // Check if this interpretation is different from previous ones
                          const isDuplicate = validInterpretations.some(existing => 
                            existing.Interpretation === data.Interpretation
                          );
                          
                          if (!isDuplicate) {
                            console.log(`🔍 Interpretation ${i} received:`, data.Interpretation.substring(0, 100) + '...');
                            validInterpretations.push(data);
                            consecutiveFailures = 0; // Reset counter on success
                          } else {
                            console.log(`🔍 Interpretation ${i} is duplicate, skipping`);
                            consecutiveFailures++;
                          }
                        } catch (err) {
                          console.log(`🔍 Interpretation ${i} not available:`, err.message);
                          consecutiveFailures++;
                        }
                      }
                      
                      console.log('🔍 Valid interpretations found:', validInterpretations.length);
                      if (consecutiveFailures >= maxConsecutiveFailures) {
                        console.log(`🔍 Stopped early after ${consecutiveFailures} consecutive failures`);
                      }
                      
                      // Process the valid interpretations
                      const processedInterpretations = validInterpretations.map((fallbackData, index) => ({
                        interpretation: fallbackData.Interpretation,
                        AudioIntrerptn: fallbackData.Interpretation,
                        text: fallbackData.Interpretation,
                        content: fallbackData.Interpretation,
                        interptn_no: fallbackData.InterpretationNo || fallbackData.ID || (index + 1)
                      }));
                      
                      console.log('🔍 Processed interpretations:', processedInterpretations);
                      
                      return processedInterpretations;
                    });
                })()
              : (() => {
                  console.log('🔍 Taking default fetchInterpretation path');
                  return fetchInterpretation(
                    parseInt(surahId),
                    currentVerseId,
                    1,
                    translationLanguage
                  ).catch(
                    (error) => {
                      console.log("Interpretation API error:", error);
                      // Special handling for Surah 114
                      if (parseInt(surahId) === 114) {
                        console.log(`🔍 Interpretation fetch failed for Surah 114, Verse ${currentVerseId}. This may be expected if no interpretation data exists.`);
                      }
                      return null;
                    }
                  );
                })();

        // Only fetch translation data if not using Tamil/Hindi/Bangla services
        const translationPromise = (translationLanguage === 'ta' || translationLanguage === 'hi' || translationLanguage === 'bn') 
          ? Promise.resolve(null) 
          : fetchAyahAudioTranslations(parseInt(surahId), currentVerseId);

        // Use cached surahs data if available and not expired
        const now = Date.now();
        const getSurahsData = async () => {
          if (surahsCache && (now - surahsCacheTime) < CACHE_DURATION) {
            console.log('Using cached surahs data');
            return surahsCache;
          }
          console.log('Fetching fresh surahs data');
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

        // Get translation (only if translationData exists)
        const translationVerse = translationData 
          ? (Array.isArray(translationData)
              ? translationData.find((t) => t.contiayano === currentVerseId)
              : translationData)
          : null;

        // Combine verse data
        setVerseData({
          number: currentVerseId,
          arabic: arabicVerse?.text_uthmani || "",
          translation: translationVerse?.AudioText
            ? translationVerse.AudioText
                .replace(/<sup[^>]*foot_note[^>]*>\d+<\/sup>/g, "")
                .replace(/\s+/g, " ")
                .trim()
            : "",
          verseKey: `${surahId}:${currentVerseId}`,
        });

        // Set interpretation data - handle different response structures
        console.log('🔍 Raw interpretation response:', interpretationResponse);
        console.log('🔍 Translation language when processing:', translationLanguage);
        console.log('🔍 Interpretation response type:', typeof interpretationResponse);
        console.log('🔍 Interpretation response isArray:', Array.isArray(interpretationResponse));
        
        if (interpretationResponse) {
          if (Array.isArray(interpretationResponse)) {
            console.log('🔍 Setting array interpretation data:', interpretationResponse);
            console.log('🔍 Array length:', interpretationResponse.length);
            setInterpretationData(interpretationResponse);
          } else if (
            interpretationResponse.data &&
            Array.isArray(interpretationResponse.data)
          ) {
            console.log('🔍 Setting nested array interpretation data:', interpretationResponse.data);
            setInterpretationData(interpretationResponse.data);
          } else if (typeof interpretationResponse === "object") {
            console.log('🔍 Setting single object interpretation data:', [interpretationResponse]);
            setInterpretationData([interpretationResponse]);
          } else {
            console.log('🔍 Setting null interpretation data - invalid type:', typeof interpretationResponse);
            setInterpretationData(null);
          }
        } else {
          console.log('🔍 Setting null interpretation data - no response');
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
                  console.log('🔍 Label logic - translationLanguage:', translationLanguage);
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
                  dangerouslySetInnerHTML={{ __html: verseData.translation }}
                />
              ) : translationLanguage === 'ur' ? (
                <div
                  className="text-gray-700 leading-[1.6] font-urdu sm:leading-[1.7] lg:leading-[1.8] dark:text-white px-2 sm:px-0"
                  style={{ fontSize: `${translationFontSize}px` }}
                  dangerouslySetInnerHTML={{ __html: verseData.translation }}
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
            console.log('🔍 Interpretation display check - interpretationData:', interpretationData);
            console.log('🔍 Interpretation display check - length:', interpretationData?.length);
            console.log('🔍 Interpretation display check - translationLanguage:', translationLanguage);
            console.log('🔍 Interpretation display check - isArray:', Array.isArray(interpretationData));
            if (interpretationData && interpretationData.length > 0) {
              console.log('🔍 Interpretation display check - first item:', interpretationData[0]);
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
                  console.log(`🔍 Processing interpretation ${index}:`, interpretation);
                  const interpretationText =
                    interpretation.AudioIntrerptn ||
                    interpretation.interpretation ||
                    interpretation.text ||
                    interpretation.content ||
                    "No interpretation available";
                  console.log(`🔍 Interpretation text for ${index}:`, interpretationText);

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
                    console.log('🔍 No interpretation message - interpretationData:', interpretationData);
                    console.log('🔍 No interpretation message - length:', interpretationData?.length);
                    console.log('🔍 No interpretation message - surahId:', surahId);
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
