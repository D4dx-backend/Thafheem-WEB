import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  fetchAllTajweedRules,
  fetchSpecificTajweedRule,
  fetchArabicVerseForTajweed,
  fetchArabicAudioForTajweed,
} from "../api/apifunction";
import { FALLBACK_TAJWEED_MAIN_RULES } from "../data/tajweedFallback";

const Tajweed = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tajweedRules, setTajweedRules] = useState([]);
  const [introRule, setIntroRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSubRules, setLoadingSubRules] = useState({});
  const [expandedSubRules, setExpandedSubRules] = useState({});
  const [loadingNestedSubRules, setLoadingNestedSubRules] = useState({});
  const [selectedArabicText, setSelectedArabicText] = useState("");
  const [loadingArabicText, setLoadingArabicText] = useState(false);
  const [currentRuleTitle, setCurrentRuleTitle] = useState("");
  const [exampleReferences, setExampleReferences] = useState([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [currentVerseKey, setCurrentVerseKey] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const { quranFont } = useTheme();
  const audioRef = useRef(null);
  const autoPlayOnLoadRef = useRef(false);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration || 0);
      setAudioLoading(false);

      if (autoPlayOnLoadRef.current) {
        audioEl
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
        autoPlayOnLoadRef.current = false;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioEl.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audioEl.duration || 0);
    };

    const handleAudioError = () => {
      setAudioError("Audio playback failed. Please try again.");
      setAudioLoading(false);
      setIsPlaying(false);
    };

    audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioEl.addEventListener("timeupdate", handleTimeUpdate);
    audioEl.addEventListener("ended", handleEnded);
    audioEl.addEventListener("error", handleAudioError);

    return () => {
      audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
      audioEl.removeEventListener("ended", handleEnded);
      audioEl.removeEventListener("error", handleAudioError);
    };
  }, []);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) {
      return;
    }

    if (!audioUrl) {
      audioEl.removeAttribute("src");
      setDuration(0);
      setCurrentTime(0);
      setAudioLoading(false);
      return;
    }

    autoPlayOnLoadRef.current = true;
    setAudioLoading(true);
    setAudioError("");
    setIsPlaying(false);
    setCurrentTime(0);
    audioEl.src = audioUrl;
    audioEl.load();
  }, [audioUrl]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl || !audioUrl) {
      return;
    }

    if (isPlaying) {
      audioEl.play().catch(() => setIsPlaying(false));
    } else {
      audioEl.pause();
    }
  }, [isPlaying, audioUrl]);

  // Fetch Tajweed rules on component mount
  useEffect(() => {
    const loadTajweedRules = async () => {
      try {
        setLoading(true);
        setError(null);
        setIntroRule(null);

        const rulesData = await fetchAllTajweedRules();
        const rulesArray = Array.isArray(rulesData) ? rulesData : [rulesData];

        const introductionRule = rulesArray.find(
          (rule) => rule && rule.RuleNo === "0"
        );

        if (introductionRule) {
          setIntroRule({
            title: introductionRule.Rule,
            content: introductionRule.Ruledesc,
            examples: introductionRule.Examples || "",
            hasSubRules: introductionRule.Hassub === 1,
          });
        } else {
          setIntroRule(null);
        }

        const transformedRules = rulesArray
          .filter((rule) => rule && rule.RuleNo !== "0")
          .map((rule) => ({
            id: rule.RuleNo,
            title: rule.Rule,
            content: rule.Ruledesc,
            examples: rule.Examples || "",
            hasSubRules: rule.Hassub === 1,
            audioUrl: rule.AudioUrl || "",
            subRules: [],
            subRulesLoaded: false,
          }));

        setTajweedRules(transformedRules);
      } catch (err) {
        console.error("Failed to load Tajweed rules:", err);
        setError(err.message);

        // Set fallback rules if API fails
        const fallbackIntro = FALLBACK_TAJWEED_MAIN_RULES.find(
          (rule) => rule.RuleNo === "0"
        );

        if (fallbackIntro) {
          setIntroRule({
            title: fallbackIntro.Rule,
            content: fallbackIntro.Ruledesc,
            examples: fallbackIntro.Examples || "",
            hasSubRules: fallbackIntro.Hassub === 1,
          });
        }

        const fallbackRules = FALLBACK_TAJWEED_MAIN_RULES.filter(
          (rule) => rule.RuleNo !== "0"
        ).map((rule) => ({
          id: rule.RuleNo,
          title: rule.Rule,
          content: rule.Ruledesc,
          examples: rule.Examples || "",
          hasSubRules: rule.Hassub === 1,
          audioUrl: rule.AudioUrl || "",
          subRules: [],
          subRulesLoaded: false,
        }));

        setTajweedRules(fallbackRules);
      } finally {
        setLoading(false);
      }
    };

    loadTajweedRules();
  }, []);

  const toggleSection = async (section, ruleId) => {
    const isCurrentlyExpanded = expandedSections[section];

    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    // If expanding and rule has sub-rules, fetch sub-rules
    if (!isCurrentlyExpanded && ruleId) {
      const currentRule = tajweedRules.find((rule) => rule.id === ruleId);

      // Only fetch sub-rules if rule has them and they haven't been loaded yet
      if (
        currentRule &&
        currentRule.hasSubRules &&
        !currentRule.subRulesLoaded
      ) {
        try {
          // Set loading state for this specific rule
          setLoadingSubRules((prev) => ({ ...prev, [ruleId]: true }));

          // Convert rule number format for API call (e.g., "1.4" -> "1_4")
          const formattedRuleNo = ruleId.toString().replace(/\./g, "_");
const subRulesData = await fetchSpecificTajweedRule(formattedRuleNo);
// Process sub-rules data
          let processedSubRules = [];
          let allExamples = "";

          if (Array.isArray(subRulesData) && subRulesData.length > 0) {
            // Transform sub-rules to consistent format
            processedSubRules = subRulesData.map((subRule) => ({
              id: subRule.RuleNo,
              title: subRule.Rule,
              description: subRule.Ruledesc,
              examples: subRule.Examples || "",
              hasSubRules: subRule.Hassub === 1,
              nestedSubRules: [], // Initialize empty nested sub-rules array
              nestedSubRulesLoaded: false, // Track if nested sub-rules have been loaded
            }));

            // Collect all examples from sub-rules
            const examplesList = subRulesData
              .filter(
                (subRule) => subRule.Examples && subRule.Examples.trim() !== ""
              )
              .map((subRule) => subRule.Examples.trim());

            allExamples = examplesList.join(", ");
          }

          // Update the specific rule with sub-rules data
          setTajweedRules((prevRules) =>
            prevRules.map((rule) =>
              rule.id === ruleId
                ? {
                    ...rule,
                    examples: allExamples || rule.examples, // Use collected examples if available
                    subRules: processedSubRules,
                    subRulesLoaded: true, // Mark as loaded
                  }
                : rule
            )
          );

} catch (error) {
          console.error("Failed to fetch sub-rules:", error);
          // Mark as loaded even on error to prevent repeated failed attempts
          setTajweedRules((prevRules) =>
            prevRules.map((rule) =>
              rule.id === ruleId ? { ...rule, subRulesLoaded: true } : rule
            )
          );
        } finally {
          // Clear loading state
          setLoadingSubRules((prev) => ({ ...prev, [ruleId]: false }));
        }
      }
    }
  };

  const formatMalayalamContent = (text) => {
    if (!text) return null;

    const paragraphs = text.split(/\n{2,}/);

    return paragraphs.map((paragraph, index) => {
      const lines = paragraph.split("\n");
      return (
        <p
          key={`intro-paragraph-${index}`}
          className="text-xs sm:text-[16px] text-gray-700 leading-relaxed mb-3 sm:mb-4 dark:text-white font-malayalam"
        >
          {lines.map((line, lineIndex) => (
            <React.Fragment key={`intro-line-${index}-${lineIndex}`}>
              {line.trim()}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const togglePlay = () => {
    if (!audioUrl || audioLoading) {
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  const toggleSubRule = async (subRuleId, parentRuleId) => {
    const isCurrentlyExpanded = expandedSubRules[subRuleId];

    setExpandedSubRules((prev) => ({
      ...prev,
      [subRuleId]: !prev[subRuleId],
    }));

    // If expanding and sub-rule has nested sub-rules, fetch them
    if (!isCurrentlyExpanded) {
      const parentRule = tajweedRules.find((rule) => rule.id === parentRuleId);
      const currentSubRule = parentRule?.subRules.find(
        (subRule) => subRule.id === subRuleId
      );

      // Only fetch nested sub-rules if sub-rule has them and they haven't been loaded yet
      if (
        currentSubRule &&
        currentSubRule.hasSubRules &&
        !currentSubRule.nestedSubRulesLoaded
      ) {
        try {
          // Set loading state for this specific sub-rule
          setLoadingNestedSubRules((prev) => ({ ...prev, [subRuleId]: true }));

          // Convert sub-rule number format for API call
          const formattedSubRuleNo = subRuleId.toString().replace(/\./g, "_");
const nestedSubRulesData = await fetchSpecificTajweedRule(
            formattedSubRuleNo
          );
// Process nested sub-rules data
          let processedNestedSubRules = [];
          let allNestedExamples = "";

          if (
            Array.isArray(nestedSubRulesData) &&
            nestedSubRulesData.length > 0
          ) {
            // Transform nested sub-rules to consistent format
            processedNestedSubRules = nestedSubRulesData.map(
              (nestedSubRule) => ({
                id: nestedSubRule.RuleNo,
                title: nestedSubRule.Rule,
                description: nestedSubRule.Ruledesc,
                examples: nestedSubRule.Examples || "",
                hasSubRules: nestedSubRule.Hassub === 1,
              })
            );

            // Collect all examples from nested sub-rules
            const examplesList = nestedSubRulesData
              .filter(
                (nestedSubRule) =>
                  nestedSubRule.Examples && nestedSubRule.Examples.trim() !== ""
              )
              .map((nestedSubRule) => nestedSubRule.Examples.trim());

            allNestedExamples = examplesList.join(", ");
          }

          // Update the specific sub-rule with nested sub-rules data
          setTajweedRules((prevRules) =>
            prevRules.map((rule) =>
              rule.id === parentRuleId
                ? {
                    ...rule,
                    subRules: rule.subRules.map((subRule) =>
                      subRule.id === subRuleId
                        ? {
                            ...subRule,
                            examples: allNestedExamples || subRule.examples,
                            nestedSubRules: processedNestedSubRules,
                            nestedSubRulesLoaded: true,
                          }
                        : subRule
                    ),
                  }
                : rule
            )
          );

} catch (error) {
          console.error("Failed to fetch nested sub-rules:", error);
          // Mark as loaded even on error to prevent repeated failed attempts
          setTajweedRules((prevRules) =>
            prevRules.map((rule) =>
              rule.id === parentRuleId
                ? {
                    ...rule,
                    subRules: rule.subRules.map((subRule) =>
                      subRule.id === subRuleId
                        ? { ...subRule, nestedSubRulesLoaded: true }
                        : subRule
                    ),
                  }
                : rule
            )
          );
        } finally {
          // Clear loading state
          setLoadingNestedSubRules((prev) => ({ ...prev, [subRuleId]: false }));
        }
      }
    }
  };

  // Helper function to extract and clean Arabic text from mixed content
  const extractArabicText = (text) => {
    if (!text) return "";

    // Arabic Unicode ranges
    const arabicPattern =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
    const arabicMatches = text.match(arabicPattern);

    if (arabicMatches && arabicMatches.length > 0) {
      return arabicMatches.join(" ").trim();
    }

    return "";
  };

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = Math.floor(safeSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to convert English numbers to Arabic numbers
  const convertToArabicNumbers = (englishNumber) => {
    const arabicNumbers = {
      '0': '٠',
      '1': '١',
      '2': '٢',
      '3': '٣',
      '4': '٤',
      '5': '٥',
      '6': '٦',
      '7': '٧',
      '8': '٨',
      '9': '٩'
    };
    
    return englishNumber.toString().replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
  };

  const parseVerseReferences = (examplesText = "") => {
    if (!examplesText) {
      return [];
    }

    const versePattern = /(\d+)\s*:\s*(\d+)/g;
    const matches = [...examplesText.matchAll(versePattern)];

    if (!matches || matches.length === 0) {
      return [];
    }

    return matches.map((match) => ({
      verseKey: `${match[1]}:${match[2]}`,
      surahNumber: match[1],
      ayahNumber: match[2],
    }));
  };

  // Function to fetch Arabic ayah text
  const fetchArabicAyah = async (verseKey) => {
    try {
      return await fetchArabicVerseForTajweed(verseKey);
    } catch (error) {
      console.error("Error fetching Arabic ayah:", error);
      return "Arabic text not available";
    }
  };

  const loadAudioForVerse = async (verseKey) => {
    if (!verseKey) {
      setAudioUrl("");
      setAudioError("Audio not available for this example.");
      setAudioLoading(false);
      return;
    }

    try {
      setAudioLoading(true);
      setAudioError("");
      const audioSource = await fetchArabicAudioForTajweed(verseKey);

      if (!audioSource) {
        setAudioUrl("");
        setAudioError("Audio not available for this example.");
        setAudioLoading(false);
        return;
      }

      setAudioUrl(audioSource);
    } catch (error) {
      console.error("Error loading audio for verse:", error);
      setAudioUrl("");
      setAudioError("Audio not available for this example.");
      setAudioLoading(false);
    }
  };

  const loadExampleByIndex = async (references, index) => {
    if (!Array.isArray(references) || !references[index]) {
      return;
    }

    const { verseKey, surahNumber, ayahNumber } = references[index];
    setLoadingArabicText(true);
    setCurrentExampleIndex(index);
    setCurrentVerseKey(verseKey);

    try {
      const arabicText = await fetchArabicAyah(verseKey);
      const arabicAyahNumber = convertToArabicNumbers(ayahNumber);

      const metadataParts = [`Surah ${surahNumber}`, `Ayah ${ayahNumber}`];
      if (references.length > 1) {
        metadataParts.push(`Example ${index + 1}/${references.length}`);
      }

      setSelectedArabicText(
        `${arabicText} ﴿${arabicAyahNumber}﴾\n\n${metadataParts.join(" • ")}`
      );

      await loadAudioForVerse(verseKey);
    } catch (error) {
      console.error("Error loading example:", error);
      setSelectedArabicText("Arabic text not available");
      setAudioUrl("");
      setAudioError("Audio not available for this example.");
      setAudioLoading(false);
    } finally {
      setLoadingArabicText(false);
    }
  };

  const handleExampleNavigation = async (direction) => {
    if (!exampleReferences.length) {
      return;
    }

    const nextIndex = currentExampleIndex + direction;
    if (nextIndex < 0 || nextIndex >= exampleReferences.length) {
      return;
    }

    await loadExampleByIndex(exampleReferences, nextIndex);
  };

  const handleSelectExample = async (index) => {
    if (index === currentExampleIndex || !exampleReferences[index]) {
      return;
    }

    await loadExampleByIndex(exampleReferences, index);
  };

  const seekAudioBy = (seconds) => {
    const audioEl = audioRef.current;
    if (!audioEl || !duration) {
      return;
    }

    const nextTime = Math.min(
      Math.max(audioEl.currentTime + seconds, 0),
      duration
    );
    audioEl.currentTime = nextTime;
  };

  const handleToggleMute = () => {
    const audioEl = audioRef.current;
    if (!audioEl) {
      return;
    }

    const nextMuted = !audioEl.muted;
    audioEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const hasExamples = exampleReferences.length > 0;
  const hasPreviousExample = hasExamples && currentExampleIndex > 0;
  const hasNextExample =
    hasExamples && currentExampleIndex < exampleReferences.length - 1;
  const audioProgress = duration
    ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
    : 0;

  // Function to handle title click and show Arabic text
  const handleTitleClick = async (examples, ruleTitle = "") => {
    setCurrentRuleTitle(ruleTitle);
    setExampleReferences([]);
    setCurrentExampleIndex(0);
    setCurrentVerseKey("");
    setAudioUrl("");
    setAudioError("");
    setAudioLoading(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    autoPlayOnLoadRef.current = false;

    if (!examples || examples.trim() === "") {
      setSelectedArabicText("No examples available");
      setAudioError("Audio not available for this example.");
      return;
    }

    try {
      const references = parseVerseReferences(examples);

      if (references.length > 0) {
        setExampleReferences(references);
        await loadExampleByIndex(references, 0);
        return;
      }

      setLoadingArabicText(true);

      const arabicPattern =
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

      if (arabicPattern.test(examples)) {
        const arabicWords = examples.match(
          /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+/g
        );

        if (arabicWords && arabicWords.length > 0) {
          const cleanedArabicText = arabicWords.join(" ").trim();
          setSelectedArabicText(cleanedArabicText);
        } else {
          setSelectedArabicText(examples);
        }
      } else {
        const transliterationPatterns = [
          { pattern: /min\s+aamana/gi, arabic: "مِنْ آمَنَ" },
          { pattern: /min\s+haadin/gi, arabic: "مِنْ هَادٍ" },
          { pattern: /min\s+ilmin/gi, arabic: "مِنْ عِلْمٍ" },
          { pattern: /bismillah/gi, arabic: "بِسْمِ اللَّهِ" },
          { pattern: /alhamdulillah/gi, arabic: "الْحَمْدُ لِلَّهِ" },
        ];

        let foundTransliteration = false;
        for (const { pattern, arabic } of transliterationPatterns) {
          if (pattern.test(examples)) {
            setSelectedArabicText(arabic);
            foundTransliteration = true;
            break;
          }
        }

        if (!foundTransliteration) {
          setSelectedArabicText(
            `Examples: ${examples}\n\n(Click on rule titles with verse references like "2:255" to see Arabic text)`
          );
        }
      }

      setAudioError("Audio not available for this example.");
    } catch (error) {
      console.error("Error handling title click:", error);
      setSelectedArabicText("Error loading Arabic text");
      setAudioError("Audio not available for this example.");
    } finally {
      setLoadingArabicText(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading Tajweed Rules...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white leading-tight font-malayalam">
              {introRule?.title || "ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-lg dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Failed to load Tajweed rules: {error}
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Introduction Text */}
            <div className="prose prose-gray max-w-none mb-6 sm:mb-8">
              {introRule?.content ? (
                formatMalayalamContent(introRule.content)
              ) : (
                <p className="text-xs sm:text-[16px] text-gray-700 leading-relaxed mb-3 sm:mb-4 dark:text-white font-malayalam">
                  അല്ലാഹു മനുഷ്യര്‍ക്ക് നല്‍കിയ ഏറ്റവും വലിയ അനുഗ്രഹമാണ് പരിശുദ്ധ
                  ഖുര്‍ആന്‍. അതിന്റെ പാരായണവും പഠനവും മനനവും ഏറ്റവും മഹത്തായ
                  പ്രതിഫലവും പുണ്യവും ലഭിക്കുന്ന സല്‍കര്‍മങ്ങളില്‍ പെട്ടതാണ്.
                </p>
              )}
            </div>

            {/* Dynamically Rendered Tajweed Rules from API */}
            {tajweedRules.length > 0
              ? tajweedRules.map((rule, index) => (
                  <div
                    key={rule.id || index}
                    className="border border-gray-200 rounded-lg dark:bg-[#2A2C38]"
                  >
                    <button
                      onClick={() => toggleSection(`rule_${index}`, rule.id)}
                      className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2 pr-2">
                        <h3
                          className="text-sm sm:text-base font-medium text-[#2AA0BF] dark:text-[#2AA0BF] font-malayalam cursor-pointer   transition-colors flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTitleClick(rule.examples, rule.title);
                          }}
                          title="Click to see Arabic examples"
                        >
                          {rule.title}
                          {/* <span className="text-xs opacity-60">📖</span> */}
                        </h3>
                        {/* {rule.hasSubRules && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">
                            {rule.subRulesLoaded
                              ? `${rule.subRules.length} ഉപനിയമങ്ങൾ`
                              : "ഉപനിയമങ്ങളുണ്ട്"}
                          </span>
                        )} */}
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 flex-shrink-0">
                        {expandedSections[`rule_${index}`] ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </span>
                    </button>

                    {expandedSections[`rule_${index}`] && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs sm:text-[16px] text-gray-700 leading-relaxed mt-2 sm:mt-3 dark:text-white font-malayalam">
                          {rule.content}
                        </p>

                        {/* Loading Sub-rules Indicator */}
                        {loadingSubRules[rule.id] && (
                          <div className="mt-4 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              ഉപനിയമങ്ങൾ ലോഡ് ചെയ്യുന്നു...
                            </span>
                          </div>
                        )}

                        {/* Sub-rules Section */}
                        {rule.hasSubRules &&
                          rule.subRulesLoaded &&
                          rule.subRules.length > 0 && (
                            <div className="mt-4 sm:mt-6">
                              {/* <h4 className="text-xs sm:text-sm font-medium text-blue-600 mb-3 sm:mb-4 dark:text-blue-400 font-malayalam">
                                ഉപനിയമങ്ങൾ ({rule.subRules.length}):
                              </h4> */}
                              <div className="space-y-3">
                                {rule.subRules.map((subRule, subIndex) => (
                                  <div
                                    key={subRule.id || subIndex}
                                    className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border-l-4 border-[#2AA0BF]"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h5
                                        className="text-xs sm:text-sm font-medium text-[#2AA0BF] dark:text-[#2AA0BF] font-malayalam flex-1 cursor-pointer transition-colors flex items-center gap-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTitleClick(
                                            subRule.examples,
                                            subRule.title
                                          );
                                        }}
                                        title="Click to see Arabic examples"
                                      >
                                        {subRule.id}. {subRule.title}
                                        <span className="text-xs opacity-60">
                                          📖
                                        </span>
                                      </h5>
                                      {subRule.hasSubRules && (
                                        <button
                                          onClick={() =>
                                            toggleSubRule(subRule.id, rule.id)
                                          }
                                          className="text-xs bg-[#2AA0BF] dark:bg-gray-900 text-white dark:text-[#2AA0BF] px-2 py-0.5 rounded ml-2   transition-colors cursor-pointer"
                                        >
                                          {expandedSubRules[subRule.id] ? (
                                            <>
                                              <ChevronUp className="w-3 h-3 inline mr-1" />
                                              മറയ്ക്കുക
                                            </>
                                          ) : (
                                            <>
                                              <ChevronDown className="w-3 h-3 inline mr-1" />
                                              കൂടുതൽ ഉപവിഭാഗങ്ങൾ
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-malayalam leading-relaxed">
                                      {subRule.description}
                                    </p>
                                    {subRule.examples &&
                                      subRule.examples.trim() !== "" && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                          <p className="text-xs text-gray-600 dark:text-gray-400 font-malayalam">
                                            <span className="font-medium">
                                              ഉദാഹരണങ്ങൾ:
                                            </span>{" "}
                                            {subRule.examples}
                                          </p>
                                        </div>
                                      )}

                                    {/* Loading Nested Sub-rules Indicator */}
                                    {loadingNestedSubRules[subRule.id] && (
                                      <div className="mt-3 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                                          നെസ്റ്റഡ് ഉപനിയമങ്ങൾ ലോഡ്
                                          ചെയ്യുന്നു...
                                        </span>
                                      </div>
                                    )}

                                    {/* Nested Sub-rules Section */}
                                    {expandedSubRules[subRule.id] &&
                                      subRule.nestedSubRulesLoaded &&
                                      subRule.nestedSubRules &&
                                      subRule.nestedSubRules.length > 0 && (
                                        <div className="mt-4 pl-4 ">
                                          {/* <h6 className="text-xs font-medium text-yellow-600 mb-2 dark:text-yellow-400 font-malayalam">
                                            നെസ്റ്റഡ് ഉപനിയമങ്ങൾ (
                                            {subRule.nestedSubRules.length}):
                                          </h6> */}
                                          <div className="space-y-2">
                                            {subRule.nestedSubRules.map(
                                              (nestedSubRule, nestedIndex) => (
                                                <div
                                                  key={
                                                    nestedSubRule.id ||
                                                    nestedIndex
                                                  }
                                                  className="bg-white dark:bg-gray-900 p-2 sm:p-3 rounded border-l-2 border-[#2AA0BF]"
                                                >
                                                  <h6
                                                    className="text-xs font-medium text-[#2AA0BF] dark:text-[#2AA0BF] font-malayalam mb-1 cursor-pointer  transition-colors flex items-center gap-1"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleTitleClick(
                                                        nestedSubRule.examples,
                                                        nestedSubRule.title
                                                      );
                                                    }}
                                                    title="Click to see Arabic examples"
                                                  >
                                                    {nestedSubRule.id}.{" "}
                                                    {nestedSubRule.title}
                                                    <span className="text-xs opacity-60">
                                                      📖
                                                    </span>
                                                  </h6>
                                                  <p className="text-xs text-gray-700 dark:text-gray-300 font-malayalam leading-relaxed">
                                                    {nestedSubRule.description}
                                                  </p>
                                                  {nestedSubRule.examples &&
                                                    nestedSubRule.examples.trim() !==
                                                      "" && (
                                                      <div className="mt-1 pt-1 border-t border-[#2AA0BF] dark:border-[#2AA0BF]">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-malayalam">
                                                          <span className="font-medium">
                                                            ഉദാഹരണങ്ങൾ:
                                                          </span>{" "}
                                                          {
                                                            nestedSubRule.examples
                                                          }
                                                        </p>
                                                      </div>
                                                    )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    {/* No nested sub-rules message */}
                                    {expandedSubRules[subRule.id] &&
                                      subRule.nestedSubRulesLoaded &&
                                      (!subRule.nestedSubRules ||
                                        subRule.nestedSubRules.length ===
                                          0) && (
                                        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                                          <p className="text-xs text-gray-600 dark:text-gray-400 font-malayalam">
                                            ഈ ഉപനിയമത്തിന് കൂടുതൽ വിഭാഗങ്ങൾ
                                            ലഭ്യമല്ല.
                                          </p>
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* No sub-rules message */}
                        {rule.hasSubRules &&
                          rule.subRulesLoaded &&
                          rule.subRules.length === 0 && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <p className="text-sm text-gray-600 dark:text-gray-400 font-malayalam">
                                ഈ നിയമത്തിന് ഉപനിയമങ്ങൾ ലഭ്യമല്ല.
                              </p>
                            </div>
                          )}

                        {/* Audio Player Section - Always show when rule is expanded */}
                        <div className="mt-4 sm:mt-6">
                          {/* Audio Player */}
                          {/* Audio Player */}
                          <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                            {/* Arabic Example Text Display */}
                            <div className="text-center mb-6 sm:mb-8">
                              <div className="w-full flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-4">
                                {/* Left Navigation Button */}
                                <button
                                  onClick={() => handleExampleNavigation(-1)}
                                  disabled={!hasPreviousExample}
                                  className={`p-2 sm:p-3 rounded-full bg-white/40 dark:bg-gray-800/40 transition-all duration-200 shadow-md backdrop-blur-sm flex-shrink-0 self-center ${
                                    hasPreviousExample
                                      ? "hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-lg active:scale-95"
                                      : "opacity-50 cursor-not-allowed"
                                  }`}
                                  aria-label="Previous"
                                >
                                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                                </button>

                                {/* Arabic Text Display */}
                                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 w-full max-w-[406px] min-h-[80px] sm:min-h-[200px] lg:min-h-[132px] flex items-center justify-center shadow-inner border border-gray-300/30 dark:border-gray-700/30 flex-shrink">
                                  {loadingArabicText ? (
                                    <div className="flex flex-col items-center justify-center gap-3">
                                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                                        Loading Arabic text...
                                      </span>
                                    </div>
                                  ) : selectedArabicText ? (
                                    <div className="text-center w-full px-2">
                                      <p
                                        className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white leading-relaxed mb-2"
                                        style={{
                                          fontFamily: `'${quranFont}', serif`,
                                          direction: "rtl",
                                          lineHeight: "2",
                                          textShadow:
                                            "0 1px 2px rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        {selectedArabicText.split("\n\n")[0]}
                                      </p>
                                      {selectedArabicText.includes("\n\n") && (
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 font-malayalam leading-relaxed">
                                          {selectedArabicText.split("\n\n")[1]}
                                        </p>
                                      )}
                                      {hasExamples && (
                                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                                          {exampleReferences.map((reference, idx) => (
                                            <button
                                              key={reference.verseKey}
                                              onClick={() => handleSelectExample(idx)}
                                              className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition-colors ${
                                                idx === currentExampleIndex
                                                  ? "bg-[#2AA0BF] text-white border-[#2AA0BF]"
                                                  : "border-[#2AA0BF]/40 text-[#2AA0BF] hover:bg-[#2AA0BF]/10"
                                              }`}
                                            >
                                              {reference.verseKey}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="text-center px-4">
                                      <p className="text-sm text-gray-600 dark:text-gray-400 font-malayalam mb-3 font-medium">
                                        📖 Click on rule titles to see Arabic
                                        examples
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-500 font-malayalam">
                                        Look for verse references like "2:255"
                                        in examples
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Right Navigation Button */}
                                <button
                                  onClick={() => handleExampleNavigation(1)}
                                  disabled={!hasNextExample}
                                  className={`p-2 sm:p-3 rounded-full bg-white/40 dark:bg-gray-800/40 transition-all duration-200 shadow-md backdrop-blur-sm flex-shrink-0 self-center ${
                                    hasNextExample
                                      ? "hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-lg active:scale-95"
                                      : "opacity-50 cursor-not-allowed"
                                  }`}
                                  aria-label="Next"
                                >
                                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 dark:text-gray-200" />
                                </button>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4 sm:mb-6 px-1 sm:px-2 flex flex-col items-center">
                              <div className="w-full max-w-[406px] bg-gray-400/40 dark:bg-gray-700/40 rounded-full h-1.5 sm:h-2 overflow-hidden shadow-inner backdrop-blur-sm">
                                <div
                                  className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white h-full rounded-full transition-all duration-300 shadow-sm"
                                  style={{
                                  width: `${audioProgress}%`,
                                  }}
                                ></div>
                              </div>

                              <div className="flex justify-between text-xs sm:text-sm text-gray-800 dark:text-gray-200 mt-3 w-full max-w-[406px] font-medium">
                                <span className="font-mono tabular-nums">
                                  {formatTime(currentTime)}
                                </span>
                                <span className="font-mono tabular-nums">
                                  {formatTime(duration)}
                                </span>
                              </div>
                            </div>

                            {/* Audio Controls */}
                            <div className="flex justify-center items-center gap-3 sm:gap-5 lg:gap-6">
                              <button
                                onClick={handleToggleMute}
                                disabled={!audioUrl}
                                className={`p-2 sm:p-3 rounded-full bg-white/40 dark:bg-gray-800/40 transition-all duration-200 shadow-md backdrop-blur-sm ${
                                  audioUrl
                                    ? "hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-lg active:scale-95"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                              >
                                {isMuted ? (
                                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200" />
                                ) : (
                                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200" />
                                )}
                              </button>

                              <button
                                onClick={() => seekAudioBy(-5)}
                                disabled={!audioUrl || audioLoading}
                                className={`p-2 sm:p-3 rounded-full bg-white/40 dark:bg-gray-800/40 transition-all duration-200 shadow-md backdrop-blur-sm ${
                                  audioUrl && !audioLoading
                                    ? "hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-lg active:scale-95"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                                aria-label="Rewind 5 seconds"
                              >
                                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200" />
                              </button>

                              <button
                                onClick={togglePlay}
                                disabled={!audioUrl || audioLoading || !!audioError}
                                className={`p-4 sm:p-5 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white rounded-full text-white dark:text-gray-900 transition-all duration-200 transform shadow-xl ${
                                  audioUrl && !audioLoading && !audioError
                                    ? "hover:scale-110 active:scale-100 hover:shadow-2xl"
                                    : "opacity-60 cursor-not-allowed"
                                }`}
                                aria-label={isPlaying ? "Pause" : "Play"}
                              >
                                {isPlaying ? (
                                  <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
                                ) : (
                                  <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                                )}
                              </button>

                              <button
                                onClick={() => seekAudioBy(5)}
                                disabled={!audioUrl || audioLoading}
                                className={`p-2 sm:p-3 rounded-full bg-white/40 dark:bg-gray-800/40 transition-all duration-200 shadow-md backdrop-blur-sm ${
                                  audioUrl && !audioLoading
                                    ? "hover:bg-white/60 dark:hover:bg-gray-700/60 hover:shadow-lg active:scale-95"
                                    : "opacity-50 cursor-not-allowed"
                                }`}
                                aria-label="Forward 5 seconds"
                              >
                                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 dark:text-gray-200" />
                              </button>
                            </div>
                            <audio ref={audioRef} preload="auto" className="hidden" />
                            {audioLoading && (
                              <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                                <div className="h-3 w-3 rounded-full border-2 border-gray-500 border-t-transparent animate-spin"></div>
                                <span>Loading audio...</span>
                              </div>
                            )}
                            {audioError && !audioLoading && (
                              <p className="mt-4 text-xs text-red-600 dark:text-red-400 text-center">
                                {audioError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              : !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 font-malayalam">
                      ഇപ്പോൾ തജ്വീദ് നിയമങ്ങൾ ലഭ്യമല്ല.
                    </p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tajweed;
