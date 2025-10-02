import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  fetchAllTajweedRules,
  fetchSpecificTajweedRule,
} from "../api/apifunction";

const Tajweed = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2);
  const [totalTime] = useState(18);
  const [tajweedRules, setTajweedRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSubRules, setLoadingSubRules] = useState({});
  const [expandedSubRules, setExpandedSubRules] = useState({});
  const [loadingNestedSubRules, setLoadingNestedSubRules] = useState({});
  const { quranFont } = useTheme();

  // Fetch Tajweed rules on component mount
  useEffect(() => {
    const loadTajweedRules = async () => {
      try {
        setLoading(true);
        setError(null);

        const rulesData = await fetchAllTajweedRules();
        console.log("Loaded Tajweed rules:", rulesData);

        // Check if rulesData is an array, if not, wrap it in an array
        const rulesArray = Array.isArray(rulesData) ? rulesData : [rulesData];

        // Transform the rules data based on actual API response structure
        // Filter out the introduction (RuleNo: 0) and keep all actual rules
        const transformedRules = rulesArray
          .filter((rule) => rule && rule.RuleNo !== "0") // Keep all rules except introduction
          .map((rule, index) => ({
            id: rule.RuleNo,
            title: rule.Rule,
            content: rule.Ruledesc,
            examples: rule.Examples || "",
            hasSubRules: rule.Hassub === 1, // Convert to boolean for easier handling
            audioUrl: rule.AudioUrl || "",
            subRules: [], // Initialize empty sub-rules array
            subRulesLoaded: false, // Track if sub-rules have been loaded
          }));

        console.log("Transformed rules:", transformedRules);
        setTajweedRules(transformedRules);
      } catch (err) {
        console.error("Failed to load Tajweed rules:", err);
        setError(err.message);

        // Set fallback rules if API fails
        setTajweedRules([
          {
            id: "1.1",
            title: "ഇഴ്ഹാർ (الإظهار)",
            content:
              "നൂൻ സാകിനയ്ക്കും തൻവീനിനും ശേഷം ആറ് അക്ഷരങ്ങൾ വന്നാൽ അവയെ വ്യക്തമായി ഉച്ചരിക്കുന്നതാണ് ഇഴ്ഹാർ. ആ ആറ് അക്ഷരങ്ങൾ: ء، ه، ع، ح، غ، خ",
            examples: "مِنْ آمَنَ - مِنْ هَادٍ - مِنْ عِلْمٍ",
            hasSubRules: false,
            audioUrl: "",
            subRules: [],
            subRulesLoaded: false,
          },
        ]);
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
          console.log(
            `Fetching sub-rules for rule ${ruleId} (formatted as ${formattedRuleNo})`
          );

          const subRulesData = await fetchSpecificTajweedRule(formattedRuleNo);
          console.log("Fetched sub-rules data:", subRulesData);

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

          console.log(
            `Successfully loaded ${processedSubRules.length} sub-rules for rule ${ruleId}`
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
          console.log(
            `Fetching nested sub-rules for sub-rule ${subRuleId} (formatted as ${formattedSubRuleNo})`
          );

          const nestedSubRulesData = await fetchSpecificTajweedRule(
            formattedSubRuleNo
          );
          console.log("Fetched nested sub-rules data:", nestedSubRulesData);

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

          console.log(
            `Successfully loaded ${processedNestedSubRules.length} nested sub-rules for sub-rule ${subRuleId}`
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white leading-tight font-malayalam">
              ഖുർആന്‍ പാരായണ ശാസ്ത്രം (علم التجويد)
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
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
              <p className="text-xs sm:text-[16px] text-gray-700 leading-relaxed mb-3 sm:mb-4 dark:text-white font-malayalam">
                അല്ലാഹു മനുഷ്യര്‍ക്ക് നല്‍കിയ ഏറ്റവും വലിയ അനുഗ്രഹമാണ് പരിശുദ്ധ
                ഖുര്‍ആന്‍. അതിന്റെ പാരായണവും പഠനവും മനനവും ഏറ്റവും മഹത്തായ
                പ്രതിഫലവും പുണ്യവും ലഭിക്കുന്ന സല്‍കര്‍മങ്ങളില്‍ പെട്ടതാണ്.
                ഖുര്‍ആന്‍ അവതരിപ്പിക്കപ്പെട്ട ശൈലിയില്‍ തന്നെ അത് പാരായണം
                ചെയ്യുന്നതാണ് അല്ലാഹു ഇഷ്ടപ്പെടുന്നത്. മലക്ക് ജിബ്‌രീല്‍(അ)
                മുഹമ്മദ് നബി(സ)ക്കും, അദ്ദേഹം തന്റെ അനുചരന്‍മാര്‍ക്കും അവര്‍
                തങ്ങളുടെ പിന്‍ഗാമികള്‍ക്കും എന്ന ക്രമത്തില്‍ ഓതിക്കേള്‍പിച്ചതാണ്
                ആ ശൈലി. 'സാവധാനത്തിലും അക്ഷരസ്ഫുടതയോടും കൂടി നീ ഖുര്‍ആന്‍
                പാരായണം ചെയ്യുക' എന്ന ഖുര്‍ആന്‍ വാക്യവും, 'ഖുര്‍ആനിനെ നിങ്ങളുടെ
                ശബ്ദം കൊണ്ട് അലങ്കരിക്കുക' എന്ന നബിവചനവും ഖുര്‍ആന്‍ പാരായണ
                ശാസ്ത്രത്തിന്റെ അനിവാര്യത വ്യക്തമാക്കുന്നു. അക്ഷരങ്ങളുടെ ഉച്ചാരണ
                രീതി, വിശേഷണങ്ങള്‍, രാഗം, ദീര്‍ഘം, കനം കുറക്കല്‍, കനപ്പിക്കല്‍,
                വിരാമം തുടങ്ങിയ കാര്യങ്ങളാണ് അതിലെ പ്രതിപാദ്യം. അവ പഠിക്കലും
                അതനുസരിച്ച് ഖുര്‍ആന്‍ പാരായണം ചെയ്യലും നിര്‍ബന്ധമാണെന്നാണ്
                പണ്ഡിതമതം. മൂന്ന് രീതികളാണ് ഖുര്‍ആന്‍ പാരായണത്തിന്
                നിശ്ചയിച്ചിട്ടുള്ളത്. 1. സാവധാനത്തിലുള്ള പാരായണം (الترتيل) 2.
                മധ്യനിലക്കുള്ള പാരായണം (التدوير) 3. വേഗതയോടുകൂടിയ പാരായണം
                (الحدر) ഇവ മൂന്നിലും പാരായണ നിയമങ്ങള്‍ പാലിക്കല്‍ നിര്‍ബന്ധമാണ്.
              </p>
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
                        <h3 className="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-400 font-malayalam">
                          {rule.title}
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
                              <h4 className="text-xs sm:text-sm font-medium text-blue-600 mb-3 sm:mb-4 dark:text-blue-400 font-malayalam">
                                ഉപനിയമങ്ങൾ ({rule.subRules.length}):
                              </h4>
                              <div className="space-y-3">
                                {rule.subRules.map((subRule, subIndex) => (
                                  <div
                                    key={subRule.id || subIndex}
                                    className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border-l-4 border-green-500"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h5 className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 font-malayalam flex-1">
                                        {subRule.id}. {subRule.title}
                                      </h5>
                                      {subRule.hasSubRules && (
                                        <button
                                          onClick={() =>
                                            toggleSubRule(subRule.id, rule.id)
                                          }
                                          className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded ml-2 hover:bg-green-200 dark:hover:bg-green-800 transition-colors cursor-pointer"
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
                                        <div className="mt-4 pl-4 border-l-2 border-yellow-400">
                                          <h6 className="text-xs font-medium text-yellow-600 mb-2 dark:text-yellow-400 font-malayalam">
                                            നെസ്റ്റഡ് ഉപനിയമങ്ങൾ (
                                            {subRule.nestedSubRules.length}):
                                          </h6>
                                          <div className="space-y-2">
                                            {subRule.nestedSubRules.map(
                                              (nestedSubRule, nestedIndex) => (
                                                <div
                                                  key={
                                                    nestedSubRule.id ||
                                                    nestedIndex
                                                  }
                                                  className="bg-yellow-50 dark:bg-yellow-900/20 p-2 sm:p-3 rounded border-l-2 border-yellow-500"
                                                >
                                                  <h6 className="text-xs font-medium text-yellow-700 dark:text-yellow-300 font-malayalam mb-1">
                                                    {nestedSubRule.id}.{" "}
                                                    {nestedSubRule.title}
                                                  </h6>
                                                  <p className="text-xs text-gray-700 dark:text-gray-300 font-malayalam leading-relaxed">
                                                    {nestedSubRule.description}
                                                  </p>
                                                  {nestedSubRule.examples &&
                                                    nestedSubRule.examples.trim() !==
                                                      "" && (
                                                      <div className="mt-1 pt-1 border-t border-yellow-200 dark:border-yellow-700">
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

                        {/* Example Section with Audio Player */}
                        {rule.examples && rule.examples.trim() !== "" && (
                          <div className="mt-4 sm:mt-6">
                            <h4 className="text-xs sm:text-sm font-medium text-green-600 mb-3 sm:mb-4 dark:text-green-400 font-malayalam">
                              ഉദാഹരണം:
                            </h4>
                            <div className="mb-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-malayalam">
                                ഉദാഹരണ വാക്യങ്ങൾ:
                              </p>
                              <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded font-malayalam">
                                {rule.examples}
                              </p>
                            </div>

                            {/* Audio Player */}
                            <div className="bg-[#D9D9D9] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:bg-gray-900">
                              {/* Arabic Example Text Display */}
                              <div className="text-center mb-6 sm:mb-8">
                                <div className="w-full">
                                  <div className="bg-[#B3B3B3] dark:bg-[#323A3F] rounded-lg p-3 sm:p-4 lg:p-6 mx-auto h-auto max-w-[406px] min-h-[80px] sm:min-h-[100px] lg:h-[132px] flex items-center justify-center">
                                    <p
                                      className="text-lg sm:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-relaxed text-center px-2 font-malayalam"
                                      style={{
                                        fontFamily: `'${quranFont}', serif`,
                                      }}
                                    >
                                      വാക്യ റഫറൻസുകൾ: {rule.examples}
                                    </p>
                                  </div>
                                </div>

                                {/* Navigation Arrows */}
                                <div className="flex sm:justify-around justify-between sm:gap-50 items-center mb-6 sm:mb-8 mt-4">
                                  <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
                                  </button>
                                  <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" />
                                  </button>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-4 sm:mb-6 px-1 sm:px-2 flex flex-col items-center">
                                <div className="w-full max-w-[406px] bg-gray-600 dark:bg-[#4E4E4E] rounded-full h-1 sm:h-1.5">
                                  <div
                                    className="bg-black dark:bg-white h-1 sm:h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${
                                        (currentTime / totalTime) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>

                                <div className="flex justify-between text-xs sm:text-sm text-black dark:text-white mt-2 w-full max-w-[406px]">
                                  <span className="font-mono">
                                    {formatTime(currentTime)}
                                  </span>
                                  <span className="font-mono">
                                    {formatTime(totalTime)}
                                  </span>
                                </div>
                              </div>

                              {/* Audio Controls */}
                              <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6">
                                <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                                </button>

                                <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                                </button>

                                <button
                                  onClick={togglePlay}
                                  className="p-3 sm:p-4 hover:bg-gray-200 dark:text-white dark:bg-[#A2A2A2] rounded-full text-gray-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                  {isPlaying ? (
                                    <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                                  ) : (
                                    <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
                                  )}
                                </button>

                                <button className="p-2 sm:p-3 rounded-full transition-colors duration-200">
                                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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
