import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  RotateCcw,
} from "lucide-react";
import {
  fetchSurahs,
  fetchAyaRanges,
  fetchWordMeanings,
} from "../api/apifunction";
import { useTheme } from "../context/ThemeContext";

const DragDropQuiz = () => {
  const { translationLanguage } = useTheme();
  const [score, setScore] = useState(0);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [showSurahSelector, setShowSurahSelector] = useState(false);
  const dropdownRef = useRef(null);
  const [currentSurah, setCurrentSurah] = useState({
    id: 1,
    name: "Al-Fatiha",
    range: "1-7",
  });
  const [dynamicArabicTexts, setDynamicArabicTexts] = useState([]);
  const [dynamicTranslationOptions, setDynamicTranslationOptions] = useState([]);
  const [loadingWordMeanings, setLoadingWordMeanings] = useState(false);

  // Pagination states
  const [currentWordPage, setCurrentWordPage] = useState(0);
  const [wordsPerPage] = useState(9);

  // Surah selector state
  const [selectedSurahId, setSelectedSurahId] = useState(1);
  const [selectedRangeId, setSelectedRangeId] = useState(null);
  const [surahs, setSurahs] = useState([]);
  const [ayahRanges, setAyahRanges] = useState([]);
  const [loadingRanges, setLoadingRanges] = useState(false);

  const quranFont = "Amiri Quran";

  // Get font class based on language
  const getTranslationFontClass = () => {
    if (translationLanguage === 'hi') return 'font-hindi';
    if (translationLanguage === 'ur') return 'font-urdu-nastaliq';
    if (translationLanguage === 'bn') return 'font-bengali';
    if (translationLanguage === 'ta') return 'font-tamil';
    if (translationLanguage === 'mal') return 'font-malayalam';
    return 'font-poppins';
  };

  // Get language label
  const getLanguageLabel = () => {
    if (translationLanguage === 'E' || translationLanguage === 'en') return 'English';
    if (translationLanguage === 'hi') return 'Hindi';
    if (translationLanguage === 'ur') return 'Urdu';
    if (translationLanguage === 'bn') return 'Bangla';
    if (translationLanguage === 'ta') return 'Tamil';
    return 'Malayalam';
  };

  // Get score label based on language
  const getScoreLabel = () => {
    if (translationLanguage === 'mal') return 'മാർക്ക്';
    if (translationLanguage === 'E' || translationLanguage === 'en') return 'Score';
    if (translationLanguage === 'hi') return 'स्कोर';
    if (translationLanguage === 'ur') return 'اسکور';
    if (translationLanguage === 'bn') return 'স্কোর';
    if (translationLanguage === 'ta') return 'மதிப்பெண்';
    return 'Score';
  };

  // Fetch surahs data from API
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahsData = await fetchSurahs();
        setSurahs(surahsData);
      } catch (error) {
        console.error("Failed to load surahs:", error);
        // Fallback data
        setSurahs([
          { number: 1, name: "Al-Fatiha", arabic: "الفاتحة", ayahs: 7 },
          { number: 2, name: "Al-Baqarah", arabic: "البقرة", ayahs: 286 },
        ]);
      }
    };
    loadSurahs();
  }, []);

  // Fetch ayah ranges when surah is selected
  useEffect(() => {
    const loadAyahRanges = async () => {
      if (!selectedSurahId) return;

      try {
        setLoadingRanges(true);
        const ranges = await fetchAyaRanges(selectedSurahId, translationLanguage);

        // Ensure ranges is an array
        const rangesArray = Array.isArray(ranges) ? ranges : [];
        setAyahRanges(rangesArray);

        // Auto-select first range if available
        if (rangesArray.length > 0) {
          // Use ID field from API response
          const firstRangeId =
            rangesArray[0].ID !== undefined ? rangesArray[0].ID : 0;
          setSelectedRangeId(firstRangeId);
        }
      } catch (error) {
        console.error("Failed to load ayah ranges:", error);
        setAyahRanges([]);
      } finally {
        setLoadingRanges(false);
      }
    };

    loadAyahRanges();
  }, [selectedSurahId, translationLanguage]);

  // Fetch word meanings when current ayah changes
  useEffect(() => {
    const loadWordMeanings = async () => {
      if (!currentSurah.id || !currentAyah) return;

      try {
        setLoadingWordMeanings(true);
        const response = await fetchWordMeanings(
          currentSurah.id,
          currentAyah,
          translationLanguage
        );
        
        // Handle the API response format: { words: [...] }
        const wordsArray = response?.words || [];
        
        if (wordsArray && Array.isArray(wordsArray) && wordsArray.length > 0) {
          // Filter out empty meanings and verse numbers
          // The API returns raw database rows with fields like WordPhrase, WordMeaning, MalMeaning, EngMeaning
          const validWords = wordsArray
            .map((word) => {
              // Extract WordPhrase (Arabic text)
              const wordPhrase = word.WordPhrase || '';
              
              // Extract meaning based on language
              // For Malayalam: MalMeaning or WordMeaning
              // For English: EngMeaning or WordMeaning
              // For other languages: WordMeaning
              const meaning = word.MalMeaning || 
                              word.EngMeaning || 
                              word.WordMeaning || 
                              '';
              
              return {
                WordPhrase: wordPhrase,
                Meaning: meaning
              };
            })
            .filter(
              (word) =>
                word.WordPhrase &&
                word.Meaning &&
                word.Meaning.trim() !== "" &&
                !word.WordPhrase.includes("﴿") && // Filter out verse numbers
                !word.WordPhrase.trim().match(/^[\d\s]+$/) // Filter out pure numbers
            );

          if (validWords.length > 0) {
            // Transform API data to component format
            const arabicTexts = validWords.map((word, index) => ({
              id: `word_${index + 1}`,
              text: word.WordPhrase,
              correctTranslation: word.Meaning,
            }));

            // Create all possible options (correct + some distractors)
            const allMeanings = validWords.map((word) => word.Meaning);

            // Add some shuffled meanings as distractors
            const shuffledMeanings = [...allMeanings].sort(
              () => Math.random() - 0.5
            );
            const translationOptions = shuffledMeanings.map((meaning, index) => ({
              id: `opt${index + 1}`,
              text: meaning,
            }));

            setDynamicArabicTexts(arabicTexts);
            setDynamicTranslationOptions(translationOptions);
            setCurrentWordPage(0); // Reset to first page when new data loads
          } else {
            // No valid words found
            setDynamicArabicTexts([]);
            setDynamicTranslationOptions([]);
            setCurrentWordPage(0);
          }
        } else {
          // Reset to fallback data if no API data
          setDynamicArabicTexts([]);
          setDynamicTranslationOptions([]);
          setCurrentWordPage(0);
        }
      } catch (error) {
        console.error("Failed to load word meanings:", error);
        // Reset to fallback data on error
        setDynamicArabicTexts([]);
        setDynamicTranslationOptions([]);
        setCurrentWordPage(0);
      } finally {
        setLoadingWordMeanings(false);
      }
    };

    loadWordMeanings();
  }, [currentSurah.id, currentAyah, translationLanguage]);

  // Fallback data (Malayalam) - used when API data is not available
  const arabicTexts = [
    {
      id: "word_1",
      text: "بِسْمِ",
      correctTranslation: "അല്ലാഹുവിന്റെ നാമത്തിൽ",
    },
    { id: "word_2", text: "اللَّهِ", correctTranslation: "അല്ലാഹു" },
    { id: "word_3", text: "الرَّحْمَٰنِ", correctTranslation: "പരമകാരുണികനായ" },
    { id: "word_4", text: "الرَّحِيمِ", correctTranslation: "പരമദയാലുവായ" },
  ];

  const fallbackTranslationOptions = [
    { id: "opt1", text: "നിദ്രാനിമഗ്നമായവനു" },
    { id: "opt2", text: "പരമകാരുണികനായവനു" },
    { id: "opt3", text: "അല്ലാഹുവിന്റെ നാമത്തിൽ" },
    { id: "opt4", text: "അല്ലാഹു" },
    { id: "opt5", text: "പരമകാരുണികനായ" },
    { id: "opt6", text: "പരമദയാലുവായ" },
  ];

  const allArabicTexts =
    dynamicArabicTexts.length > 0 ? dynamicArabicTexts : arabicTexts;
  const allTranslationOptions =
    dynamicTranslationOptions.length > 0
      ? dynamicTranslationOptions
      : fallbackTranslationOptions;

  // Get current page words
  const startIndex = currentWordPage * wordsPerPage;
  const endIndex = startIndex + wordsPerPage;
  const currentArabicTexts = allArabicTexts.slice(startIndex, endIndex);

  // Get corresponding translation options for current page
  const currentPageMeanings = currentArabicTexts.map(
    (word) => word.correctTranslation
  );
  const currentTranslationOptions = allTranslationOptions.filter((option) =>
    currentPageMeanings.includes(option.text)
  );

  // Calculate pagination info
  const totalPages = Math.ceil(allArabicTexts.length / wordsPerPage);
  const hasNextPage = currentWordPage < totalPages - 1;
  const hasPrevPage = currentWordPage > 0;

  // Check if there are more ayahs available
  const [, endVerse] = currentSurah.range.split("-").map(Number);
  const hasNextAyah = currentAyah < endVerse;
  const canShowNext = hasNextPage || hasNextAyah;

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedItem) {
      const targetArabic = currentArabicTexts.find(
        (item) => item.id === targetId
      );
      const isCorrect =
        targetArabic && targetArabic.correctTranslation === draggedItem.text;

      setDroppedItems((prev) => {
        const newDropped = { ...prev };

        // Remove the dragged item from its previous location if it was already dropped somewhere
        for (const key in newDropped) {
          if (newDropped[key]?.text === draggedItem.text) {
            delete newDropped[key];
          }
        }

        // Add the item to the new target location
        newDropped[targetId] = { text: draggedItem.text, correct: isCorrect };

        return newDropped;
      });

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      setDraggedItem(null);
    }
  };

  const getDroppedItem = (targetId) => {
    return droppedItems[targetId];
  };

  const handlePrevious = () => {
    const [startVerse] = currentSurah.range.split("-").map(Number);
    if (currentAyah > startVerse) {
      setCurrentAyah(currentAyah - 1);
      setDroppedItems({}); // Reset dropped items for new ayah
      setCurrentWordPage(0); // Reset to first page
    }
  };

  const handleNext = () => {
    const [, endVerse] = currentSurah.range.split("-").map(Number);
    if (currentAyah < endVerse) {
      setCurrentAyah(currentAyah + 1);
      setDroppedItems({}); // Reset dropped items for new ayah
      setCurrentWordPage(0); // Reset to first page
    }
  };

  // Word pagination handlers
  const handleNextWordPage = () => {
    if (hasNextPage) {
      setCurrentWordPage(currentWordPage + 1);
      setDroppedItems({}); // Reset dropped items for new page
    } else {
      // If no more pages in current ayah, move to next ayah
      const [, endVerse] = currentSurah.range.split("-").map(Number);
      if (currentAyah < endVerse) {
        setCurrentAyah(currentAyah + 1);
        setDroppedItems({}); // Reset dropped items for new ayah
        setCurrentWordPage(0); // Reset to first page
      }
    }
  };

  const handlePrevWordPage = () => {
    if (hasPrevPage) {
      setCurrentWordPage(currentWordPage - 1);
      setDroppedItems({}); // Reset dropped items for new page
    }
  };

  const getAvailableOptions = () => {
    const usedTexts = Object.values(droppedItems).map((item) => item.text);
    return currentTranslationOptions.filter(
      (option) => !usedTexts.includes(option.text)
    );
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleSurahSelect = () => {
    const selectedSurah = surahs.find((s) => s.number === selectedSurahId);
    const selectedRange = ayahRanges.find((r) => r.ID === selectedRangeId);

    if (selectedSurah && selectedRange) {
      const rangeText = `${selectedRange.AyaFrom}-${selectedRange.AyaTo}`;
      setCurrentSurah({
        id: selectedSurahId,
        name: selectedSurah.name,
        range: rangeText,
      });
      setCurrentAyah(selectedRange.AyaFrom);
      setShowSurahSelector(false);
      setDroppedItems({});
      setScore(0);
      setCurrentWordPage(0); // Reset to first page
    }
  };

  const handleSurahChange = (surahId) => {
    setSelectedSurahId(surahId);
    setSelectedRangeId(null); // Reset range selection
    setAyahRanges([]); // Clear previous ranges
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSurahSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 dark:text-white">
              Start Game
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 dark:text-white">
              Are you ready to begin the game? Let's go!
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {}}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 dark:text-white hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGame}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors order-1 sm:order-2"
                style={{ backgroundColor: "#2AA0BF" }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-[#2A2C38]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 sm:gap-4 relative"
              ref={dropdownRef}
            >
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-1 sm:px-2 py-1 rounded transition-colors"
                onClick={() => setShowSurahSelector(!showSurahSelector)}
              >
                <span className="text-gray-800 font-medium dark:text-white text-sm sm:text-base font-poppins">
                  {currentSurah.name}
                </span>
                <ChevronRight
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${
                    showSurahSelector ? "rotate-90" : "rotate-90"
                  }`}
                />
              </div>
              <span className="text-gray-400 dark:text-white">|</span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-white">
                {currentSurah.range}
              </span>

              {/* Dropdown Menu */}
              {showSurahSelector && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                      Select Surah & Range
                    </h3>
                    <button
                      onClick={() => setShowSurahSelector(false)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 max-h-96 overflow-y-auto">
                    {/* Surah Selection */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Surah
                      </label>
                      <select
                        value={selectedSurahId}
                        onChange={(e) =>
                          handleSurahChange(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {surahs.map((surah) => (
                          <option key={surah.number} value={surah.number}>
                            {surah.number}. {surah.name} ({surah.arabic}) -{" "}
                            {surah.ayahs} verses
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Ayah Range Selection */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Ayah Ranges
                      </label>
                      {loadingRanges ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                          <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                            Loading ranges...
                          </span>
                        </div>
                      ) : ayahRanges.length > 0 ? (
                        <select
                          value={selectedRangeId || ""}
                          onChange={(e) =>
                            setSelectedRangeId(Number(e.target.value))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select a range</option>
                          {ayahRanges.map((range, index) => (
                            <option
                              key={range.ID || index}
                              value={range.ID || index}
                            >
                              Verses {range.AyaFrom}-{range.AyaTo} (
                              {range.AyaTo - range.AyaFrom + 1} verses)
                            </option>
                          ))}
                        </select>
                      ) : selectedSurahId ? (
                        <div className="text-xs text-gray-500 dark:text-gray-400 py-2">
                          No ayah ranges available for this surah
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 py-2">
                          Please select a surah first
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-700">
                      <button
                        onClick={() => setShowSurahSelector(false)}
                        className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSurahSelect}
                        disabled={!selectedSurahId || selectedRangeId === null}
                        className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#2AA0BF" }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <ArrowLeft className="hidden sm:inline w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-white relative top-8 sm:top-10 left-4 sm:left-30" />
      </div>

      {/* Header */}
      <div className="sm:border-b dark:bg-gray-900 w-full max-w-[884px] mx-auto">
        <div className="mx-auto px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-25">
              <h1
                className="text-lg sm:text-xl font-semibold font-poppins"
                style={{ color: "#2AA0BF" }}
              >
                Drag & Drop
              </h1>
            </div>
            <div className="hidden sm:block text-xs sm:text-sm text-gray-600 dark:text-white">
              <span>Ayah: {currentAyah}</span>
              {totalPages > 1 && (
                <span className="ml-4">
                  Page: {currentWordPage + 1}/{totalPages}
                </span>
              )}
              <span className="ml-4">{getScoreLabel()}: {score}</span>
            </div>
          </div>
          <div className="sm:hidden border-t border-gray-300 mt-2 pt-2 text-xs text-gray-600 dark:text-white flex justify-end gap-4">
            <span>Ayah: {currentAyah}</span>
            {totalPages > 1 && (
              <span>
                Page: {currentWordPage + 1}/{totalPages}
              </span>
            )}
            <span>{getScoreLabel()}: {score}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-6">
            {loadingWordMeanings && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading word meanings...
                </span>
              </div>
            )}
            {!loadingWordMeanings && currentArabicTexts.length > 0 && (
              <>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
                  <div className="flex flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
                    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 order-1">
                      <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
                        Arabic Text
                      </h3>
                      {currentArabicTexts.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white p-3 sm:p-4 rounded text-center w-[164px] sm:w-48 lg:w-50 h-10 sm:h-12 flex items-center justify-center"
                        >
                          <span
                            className="text-base sm:text-lg font-semibold"
                            style={{ fontFamily: `'${quranFont}', serif` }}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 order-2">
                      <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
                        Drop Here
                      </h3>
                      {currentArabicTexts.map((item) => {
                        const droppedItem = getDroppedItem(item.id);
                        return (
                          <div
                            key={`drop-${item.id}`}
                            draggable={!!droppedItem}
                            onDragStart={(e) =>
                              droppedItem && handleDragStart(e, droppedItem)
                            }
                            className={`w-full ${getTranslationFontClass()} sm:w-56 lg:w-64 h-10 sm:h-12 border rounded-lg flex items-center justify-center text-xs sm:text-sm transition-colors ${
                              droppedItem
                                ? droppedItem.correct
                                  ? "border-green-400 bg-green-100 text-green-700"
                                  : "border-red-400 bg-red-100 text-red-700"
                                : "border-gray-300 bg-[#EBEEF0] hover:border-blue-300 dark:bg-[#323A3F]"
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item.id)}
                          >
                            {droppedItem && (
                              <span className="px-2 text-center">
                                {droppedItem.text}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-3 order-3">
                    <h3 className="text-sm sm:text-base font-medium text-center mb-2 text-gray-700 dark:text-white lg:hidden">
                      {getLanguageLabel()} Options
                    </h3>
                    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-1 ${getTranslationFontClass()}`}>
                      {getAvailableOptions().map((option) => {
                        const handleOptionDrop = (e) => {
                          e.preventDefault();
                          if (draggedItem) {
                            const newDropped = { ...droppedItems };
                            for (const key in newDropped) {
                              if (newDropped[key]?.text === draggedItem.text) {
                                delete newDropped[key];
                              }
                            }
                            setDroppedItems(newDropped);
                            setDraggedItem(null);
                          }
                        };

                        return (
                          <div
                            key={option.id}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, option)}
                            onDragOver={handleDragOver}
                            onDrop={handleOptionDrop}
                            className="border rounded text-xs sm:text-sm w-full sm:w-60 lg:w-70 h-10 sm:h-12 flex items-center justify-center transition-shadow bg-white dark:bg-gray-900 dark:text-white border-gray-300 cursor-move hover:shadow-md"
                          >
                            {option.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Word Navigation Controls */}
                <div className="flex justify-center gap-4 mt-4 mb-4">
                  {hasPrevPage && (
                    <button
                      onClick={handlePrevWordPage}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 text-sm"
                      style={{ backgroundColor: "#2AA0BF" }}
                    >
                      <ChevronLeft className="w-3 h-3" />
                      Previous Words
                    </button>
                  )}

                  <span className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentWordPage + 1} of {totalPages}
                  </span>

                  {canShowNext && (
                    <button
                      onClick={handleNextWordPage}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 text-sm"
                      style={{ backgroundColor: "#2AA0BF" }}
                    >
                      {hasNextPage ? "Next Words" : "Next Ayah"}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </>
            )}

            {!loadingWordMeanings && currentArabicTexts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No word meanings available for this ayah.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Please select a different surah or ayah range.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;
