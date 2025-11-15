import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  searchMalEngTranslations,
  searchArabicPhrases,
  fetchQuranSubjects,
  fetchGlossaryEntries,
} from "../api/apifunction";

const SearchConsole = ({ onClose }) => {
  const [englishPhraseType, setEnglishPhraseType] = useState("Translation");
  const [englishPhraseSearch, setEnglishPhraseSearch] = useState("");
  const [malayalamPhraseType, setMalayalamPhraseType] = useState("Translation");
  const [malayalamPhraseSearch, setMalayalamPhraseSearch] = useState("");
  const [englishResults, setEnglishResults] = useState([]);
  const [malayalamResults, setMalayalamResults] = useState([]);
  const [englishLoading, setEnglishLoading] = useState(false);
  const [malayalamLoading, setMalayalamLoading] = useState(false);
  const [englishError, setEnglishError] = useState(null);
  const [malayalamError, setMalayalamError] = useState(null);
  const [englishHasSearched, setEnglishHasSearched] = useState(false);
  const [malayalamHasSearched, setMalayalamHasSearched] = useState(false);
  const [arabicPhraseSearch, setArabicPhraseSearch] = useState("");
  const [arabicResults, setArabicResults] = useState([]);
  const [arabicLoading, setArabicLoading] = useState(false);
  const [arabicError, setArabicError] = useState(null);
  const [arabicHasSearched, setArabicHasSearched] = useState(false);
  const [quranSubjectSearch, setQuranSubjectSearch] = useState("");
  const [quranSubjectLanguage, setQuranSubjectLanguage] = useState("E");
  const [quranSubjectCategory, setQuranSubjectCategory] = useState(1);
  const [quranSubjectResults, setQuranSubjectResults] = useState([]);
  const [quranSubjectLoading, setQuranSubjectLoading] = useState(false);
  const [quranSubjectError, setQuranSubjectError] = useState(null);
  const [showSubjectResults, setShowSubjectResults] = useState(false);
  const [subjectDisplayCount, setSubjectDisplayCount] = useState(20);
  const [glossaryLanguage, setGlossaryLanguage] = useState("Arabic");
  const [glossarySearch, setGlossarySearch] = useState("");
  const [glossaryEntries, setGlossaryEntries] = useState([]);
  const [glossaryLoading, setGlossaryLoading] = useState(false);
  const [glossaryError, setGlossaryError] = useState(null);
  const [showGlossaryResults, setShowGlossaryResults] = useState(false);
  const [glossaryDisplayCount, setGlossaryDisplayCount] = useState(20);

  const normalizedSubjectFilter = quranSubjectSearch.trim().toLowerCase();
  const filteredSubjects = quranSubjectResults.filter((subject) =>
    subject.SubjText?.toLowerCase().includes(normalizedSubjectFilter)
  );
  const normalizedGlossaryFilter = glossarySearch.trim().toLowerCase();
  const filteredGlossary = glossaryEntries.filter((entry) => {
    if (!normalizedGlossaryFilter) {
      return true;
    }
    const englishMatch =
      glossaryLanguage === "English" &&
      (entry.engtitleglossary?.toLowerCase().includes(normalizedGlossaryFilter) ||
        entry.glossarytext?.toLowerCase().includes(normalizedGlossaryFilter));
    const arabicMatch =
      glossaryLanguage === "Arabic" &&
      (entry.arrtitleglossary?.toLowerCase().includes(normalizedGlossaryFilter) ||
        entry.glossarytext?.toLowerCase().includes(normalizedGlossaryFilter));
    return englishMatch || arabicMatch;
  });

  const searchTrackerRef = useRef({
    english: 0,
    malayalam: 0,
    arabic: 0,
    subjects: 0,
    glossary: 0,
  });
  const navigate = useNavigate();

  const normalizeResultText = (result) => {
    const rawText =
      typeof result?.Interpretation === "string" && result.Interpretation.trim().length > 0
        ? result.Interpretation
        : result?.TranslationText || result?.AyaHText;
    if (!rawText) {
      return "Text not available";
    }
    return rawText.replace(/\t+/g, " ").replace(/\s+/g, " ").trim();
  };

  const getResultMetaLabel = (result) => {
    if (result?.InterpretationNo) {
      return `Interpretation ${result.InterpretationNo}`;
    }
    const ayahSource = result?.AyaFrom ?? result?.ayaid ?? result?.AyaID;
    if (ayahSource != null) {
      const label = ayahSource.toString();
      return label.includes("-") ? `Verses ${label}` : `Ayah ${label}`;
    }
    return "View details";
  };

  const extractFirstVerseNumber = (...values) => {
    for (const value of values) {
      if (!value) {
        continue;
      }
      const match = value.toString().match(/\d+/);
      if (match) {
        return match[0];
      }
    }
      return null;
  };

  const normalizePositiveInteger = (value) => {
    if (value == null) {
      return null;
    }
    const numberValue = Number(value);
    if (Number.isFinite(numberValue) && numberValue > 0) {
      return Math.trunc(numberValue);
    }
    return null;
  };

  const handleResultNavigation = (result) => {
    const surahIdValue =
      result?.SuraID ?? result?.suraid ?? result?.SuraId ?? result?.SuraNo ?? result?.suraNo;
    const surahId = normalizePositiveInteger(surahIdValue);
    if (!surahId) {
      return;
    }
    const verseCandidate =
      normalizePositiveInteger(result.ayaid) ??
      normalizePositiveInteger(result.AyaID) ??
      normalizePositiveInteger(result.AyaFrom);
    const extractedFallback = extractFirstVerseNumber(
      result.ayaid,
      result.AyaID,
      result.AyaFrom,
      typeof result.TranslationText === "string" ? result.TranslationText : null,
      typeof result.Interpretation === "string" ? result.Interpretation : null,
      result.AyaHText,
      result.contiayano
    );
    const verseNumber =
      verseCandidate ?? normalizePositiveInteger(extractedFallback);

    const navigationState =
      verseNumber != null
        ? {
            scrollToVerse: verseNumber.toString(),
            highlightVerse: `${surahId}:${verseNumber}`,
          }
        : undefined;
    const targetUrl =
      verseNumber != null
        ? `/surah/${surahId}#verse-${verseNumber}`
        : `/surah/${surahId}`;
    navigate(targetUrl, navigationState ? { state: navigationState } : undefined);
    onClose?.();
  };

  const renderResultSection = ({
    id,
    languageLabel,
    query,
    isLoading,
    error,
    results,
    hasSearched,
    isMalayalam = false,
    isArabic = false,
    isSubject = false,
  }) => {
    if (!isSubject && !query.trim() && !hasSearched && !isLoading) {
      return null;
    }

    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
            {languageLabel}
          </p>
          {!isLoading && results.length > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {results.length} {results.length === 1 ? "result" : "results"}
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
              <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-500 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
          {!isLoading && !error && !isSubject && hasSearched && results.length === 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500">No matches found</p>
          )}
          {results.map((result) => (
            <button
              key={`${id}-${result.ID}-${result.SuraID}-${result.AyaFrom ?? result.InterpretationNo ?? "0"}`}
              type="button"
              onClick={() => handleResultNavigation(result)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {!isSubject ? (
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Surah {result.SuraID ?? result.suraid ?? result.SuraId}</span>
                  <span>{getResultMetaLabel(result)}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Subject #{result.ID}</span>
                </div>
              )}
              <p
                className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed"
                dir={isMalayalam || isArabic ? "rtl" : isSubject && quranSubjectLanguage === "M" ? "rtl" : "ltr"}
                lang={
                  isMalayalam
                    ? "ml"
                    : isArabic
                    ? "ar"
                    : isSubject
                    ? quranSubjectLanguage === "M"
                      ? "ml"
                      : "en"
                    : "en"
                }
              >
                {isSubject ? result.SubjText : normalizeResultText(result)}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const trimmedQuery = englishPhraseSearch.trim();
    if (!trimmedQuery) {
      setEnglishResults([]);
      setEnglishHasSearched(false);
      setEnglishLoading(false);
      setEnglishError(null);
      return;
    }

    const searchType =
      englishPhraseType === "Interpretation" ? "interpretation" : "translation";

    setEnglishHasSearched(true);
    setEnglishLoading(true);
    setEnglishError(null);
    const requestId = ++searchTrackerRef.current.english;

    const debounceId = setTimeout(async () => {
      try {
        const payload = await searchMalEngTranslations({
          query: trimmedQuery,
          language: "E",
          type: searchType,
        });
        if (searchTrackerRef.current.english !== requestId) {
          return;
        }
        setEnglishResults(payload);
      } catch (error) {
        if (searchTrackerRef.current.english !== requestId) {
          return;
        }
        setEnglishResults([]);
        setEnglishError(error.message || "Failed to fetch results.");
      } finally {
        if (searchTrackerRef.current.english === requestId) {
          setEnglishLoading(false);
        }
      }
    }, 450);

    return () => clearTimeout(debounceId);
  }, [englishPhraseSearch, englishPhraseType]);

  useEffect(() => {
    const trimmedQuery = malayalamPhraseSearch.trim();
    if (!trimmedQuery) {
      setMalayalamResults([]);
      setMalayalamHasSearched(false);
      setMalayalamLoading(false);
      setMalayalamError(null);
      return;
    }

    const searchType =
      malayalamPhraseType === "Interpretation" ? "interpretation" : "translation";

    setMalayalamHasSearched(true);
    setMalayalamLoading(true);
    setMalayalamError(null);
    const requestId = ++searchTrackerRef.current.malayalam;

    const debounceId = setTimeout(async () => {
      try {
        const payload = await searchMalEngTranslations({
          query: trimmedQuery,
          language: "M",
          type: searchType,
        });
        if (searchTrackerRef.current.malayalam !== requestId) {
          return;
        }
        setMalayalamResults(payload);
      } catch (error) {
        if (searchTrackerRef.current.malayalam !== requestId) {
          return;
        }
        setMalayalamResults([]);
        setMalayalamError(error.message || "Failed to fetch results.");
      } finally {
        if (searchTrackerRef.current.malayalam === requestId) {
          setMalayalamLoading(false);
        }
      }
    }, 450);

    return () => clearTimeout(debounceId);
  }, [malayalamPhraseSearch, malayalamPhraseType]);

  useEffect(() => {
    const trimmedQuery = arabicPhraseSearch.trim();
    if (!trimmedQuery) {
      setArabicResults([]);
      setArabicHasSearched(false);
      setArabicLoading(false);
      setArabicError(null);
      return;
    }

    setArabicHasSearched(true);
    setArabicLoading(true);
    setArabicError(null);
    const requestId = ++searchTrackerRef.current.arabic;

    const debounceId = setTimeout(async () => {
      try {
        const payload = await searchArabicPhrases(trimmedQuery);
        if (searchTrackerRef.current.arabic !== requestId) {
          return;
        }
        setArabicResults(payload);
      } catch (error) {
        if (searchTrackerRef.current.arabic !== requestId) {
          return;
        }
        setArabicResults([]);
        setArabicError(error.message || "Failed to fetch Arabic matches.");
      } finally {
        if (searchTrackerRef.current.arabic === requestId) {
          setArabicLoading(false);
        }
      }
    }, 450);

    return () => clearTimeout(debounceId);
  }, [arabicPhraseSearch]);

  useEffect(() => {
    if (quranSubjectLanguage === "E" && quranSubjectCategory !== 1) {
      setQuranSubjectCategory(1);
    }
  }, [quranSubjectLanguage, quranSubjectCategory]);

  useEffect(() => {
    if (!showSubjectResults) {
      return;
    }
    const requestId = ++searchTrackerRef.current.subjects;
    setQuranSubjectLoading(true);
    setQuranSubjectError(null);

    const loadSubjects = async () => {
      try {
        const payload = await fetchQuranSubjects({
          category: quranSubjectCategory,
          language: quranSubjectLanguage,
        });
        if (searchTrackerRef.current.subjects !== requestId) {
          return;
        }
        setQuranSubjectResults(payload || []);
      } catch (error) {
        if (searchTrackerRef.current.subjects !== requestId) {
          return;
        }
        setQuranSubjectResults([]);
        setQuranSubjectError(error.message || "Failed to load Quran subjects.");
      } finally {
        if (searchTrackerRef.current.subjects === requestId) {
          setQuranSubjectLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      // no cleanup needed besides requestId guard
    };
  }, [quranSubjectCategory, quranSubjectLanguage, showSubjectResults]);

  useEffect(() => {
    if (!showGlossaryResults) {
      return;
    }
    const requestId = ++searchTrackerRef.current.glossary;
    setGlossaryLoading(true);
    setGlossaryError(null);

    const loadGlossary = async () => {
      try {
        const payload = await fetchGlossaryEntries();
        if (searchTrackerRef.current.glossary !== requestId) {
          return;
        }
        setGlossaryEntries(payload || []);
      } catch (error) {
        if (searchTrackerRef.current.glossary !== requestId) {
          return;
        }
        setGlossaryEntries([]);
        setGlossaryError(error.message || "Failed to load glossary entries.");
      } finally {
        if (searchTrackerRef.current.glossary === requestId) {
          setGlossaryLoading(false);
        }
      }
    };

    loadGlossary();
  }, [showGlossaryResults]);
  
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[200]"
        onClick={onClose}
      ></div>
      <div className="fixed inset-y-0 right-0 z-[210] w-full max-w-xs sm:max-w-sm md:max-w-[360px] bg-white dark:bg-[#2A2C38] font-poppins shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Search</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-6">
          <div className="mt-6 space-y-5">
            {/* English Phrase Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                English phrase
              </h3>

              {/* Radio buttons */}
              <div className="flex items-center space-x-8 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Translation"
                    checked={englishPhraseType === "Translation"}
                    onChange={(e) => setEnglishPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 dark:text-white dark:focus:ring-white focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Translation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Interpretation"
                    checked={englishPhraseType === "Interpretation"}
                    onChange={(e) => setEnglishPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-white dark:text-white dark:focus:ring-white"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Interpretation</span>
                </label>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={englishPhraseSearch}
                  onChange={(e) => setEnglishPhraseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:text-white dark:bg-black dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
              {renderResultSection({
                id: "english",
                languageLabel: `English ${englishPhraseType}`,
                query: englishPhraseSearch,
                isLoading: englishLoading,
                error: englishError,
                results: englishResults,
                hasSearched: englishHasSearched,
              })}
            </div>

            {/* Malayalam Phrase Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                Malayalam phrase
              </h3>

              <div className="flex items-center space-x-8 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Translation"
                    checked={malayalamPhraseType === "Translation"}
                    onChange={(e) => setMalayalamPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 dark:text-white dark:focus:ring-white focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Translation</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Interpretation"
                    checked={malayalamPhraseType === "Interpretation"}
                    onChange={(e) => setMalayalamPhraseType(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-white dark:text-white dark:focus:ring-white"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Interpretation</span>
                </label>
              </div>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Search in Malayalam..."
                  value={malayalamPhraseSearch}
                  onChange={(e) => setMalayalamPhraseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:text-white dark:bg-black dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  dir="auto"
                />
              </div>
              {renderResultSection({
                id: "malayalam",
                languageLabel: `Malayalam ${malayalamPhraseType}`,
                query: malayalamPhraseSearch,
                isLoading: malayalamLoading,
                error: malayalamError,
                results: malayalamResults,
                hasSearched: malayalamHasSearched,
                isMalayalam: true,
              })}
            </div>

            {/* Arabic Phrase Section */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4 italic dark:text-white">
                Arabic phrase
              </h3>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={arabicPhraseSearch}
                  onChange={(e) => setArabicPhraseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm dark:bg-black dark:text-white dark:placeholder-white bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  dir="rtl"
                />
              </div>
              {renderResultSection({
                id: "arabic",
                languageLabel: "Arabic phrase",
                query: arabicPhraseSearch,
                isLoading: arabicLoading,
                error: arabicError,
                results: arabicResults,
                hasSearched: arabicHasSearched,
                isArabic: true,
              })}
            </div>

            {/* Quran Subject Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                Quran Subject
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={quranSubjectLanguage}
                    onChange={(e) => setQuranSubjectLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="E">English</option>
                    <option value="M">Malayalam</option>
                  </select>
                  <select
                    value={quranSubjectCategory}
                    onChange={(e) => setQuranSubjectCategory(Number(e.target.value))}
                    disabled={quranSubjectLanguage === "E"}
                    className={`px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-sm text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      quranSubjectLanguage === "E" ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value={1}>Translation Subjects</option>
                    <option value={2}>Thafheem Subjects</option>
                  </select>
                </div>
                {quranSubjectLanguage === "E" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thafheem subjects currently available only in Malayalam.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Filter subjects..."
                      value={quranSubjectSearch}
                      onChange={(e) => {
                        setQuranSubjectSearch(e.target.value);
                        setSubjectDisplayCount(20);
                      }}
                      className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-black dark:text-white dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      disabled={!showSubjectResults}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!showSubjectResults) {
                        setShowSubjectResults(true);
                      } else {
                        setShowSubjectResults(false);
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {showSubjectResults ? "Hide subjects" : "Load subjects"}
                  </button>
                </div>
              </div>
              {showSubjectResults &&
                renderResultSection({
                  id: "subjects",
                  languageLabel: `Subjects • ${
                    quranSubjectLanguage === "M" ? "Malayalam" : "English"
                  } ${quranSubjectCategory === 2 ? "Thafheem" : "Translation"}`,
                  query: quranSubjectSearch,
                  isLoading: quranSubjectLoading,
                  error: quranSubjectError,
                  results: filteredSubjects.slice(0, subjectDisplayCount),
                  hasSearched: true,
                  isSubject: true,
                })}
              {showSubjectResults &&
                !quranSubjectLoading &&
                filteredSubjects.length > subjectDisplayCount && (
                  <button
                    type="button"
                    onClick={() =>
                      setSubjectDisplayCount((prev) => Math.min(prev + 20, filteredSubjects.length))
                    }
                    className="mt-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Load more subjects
                  </button>
                )}
            </div>

            {/* Glossary Search Section */}
            <div>
              <h3 className="text-sm text-gray-500 dark:text-white mb-4 italic">
                Glossary Search
              </h3>

              {/* Radio buttons */}
              <div className="flex items-center space-x-8 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="English"
                    checked={glossaryLanguage === "English"}
                    onChange={(e) => setGlossaryLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">English</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Arabic"
                    checked={glossaryLanguage === "Arabic"}
                    onChange={(e) => setGlossaryLanguage(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">Arabic</span>
                </label>
              </div>

              {/* Search input */}
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Search glossary..."
                    value={glossarySearch}
                    onChange={(e) => {
                      setGlossarySearch(e.target.value);
                      setGlossaryDisplayCount(20);
                    }}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 dark:bg-black dark:text-white dark:placeholder-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    dir={glossaryLanguage === "Arabic" ? "rtl" : "ltr"}
                    disabled={!showGlossaryResults}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!showGlossaryResults) {
                      setShowGlossaryResults(true);
                    } else {
                      setShowGlossaryResults(false);
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover.bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {showGlossaryResults ? "Hide glossary" : "Load glossary"}
                </button>
              </div>
              {showGlossaryResults && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Glossary ({glossaryLanguage})
                    </p>
                    {!glossaryLoading && filteredGlossary.length > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {filteredGlossary.length} entries
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {glossaryLoading && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark.text-gray-300">
                        <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-500 animate-spin" />
                        <span>Loading glossary...</span>
                      </div>
                    )}
                    {glossaryError && (
                      <p className="text-xs text-red-500 dark:text-red-400">{glossaryError}</p>
                    )}
                    {!glossaryLoading && !glossaryError && filteredGlossary.length === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No entries found</p>
                    )}
                    {filteredGlossary.slice(0, glossaryDisplayCount).map((entry) => (
                      <div
                        key={`glossary-${entry.id}-${entry.engtitleglossary}`}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/30"
                      >
                        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                          <span>{entry.engtitleglossary}</span>
                          <span dir="rtl" className="text-sm">
                            {entry.arrtitleglossary}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                          {entry.glossarytext}
                        </p>
                      </div>
                    ))}
                  </div>
                  {!glossaryLoading && filteredGlossary.length > glossaryDisplayCount && (
                    <button
                      type="button"
                      onClick={() =>
                        setGlossaryDisplayCount((prev) =>
                          Math.min(prev + 20, filteredGlossary.length)
                        )
                      }
                      className="mt-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      Load more glossary entries
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchConsole;
