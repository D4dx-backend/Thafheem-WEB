import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  fetchQuizWithSurahInfo,
  fetchRandomQuizQuestions,
  fetchQuizQuestionsForRange,
  fetchSurahs,
  validateQuizData,
  transformQuizData,
  createFallbackQuizData,
} from "../api/apifunction";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Track answers for each question
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // Track which questions have been submitted
  const [score, setScore] = useState(0);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("Surah");
  const [quizCompleted, setQuizCompleted] = useState(false);

  // API related state
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState({
    id: 1,
    name: "Al-Fatihah",
  });
  const [selectedRange, setSelectedRange] = useState("1-7");
  const [isEntireSurah, setIsEntireSurah] = useState(true);
  const [isEntireThafheem, setIsEntireThafheem] = useState(false);
  const [surahList, setSurahList] = useState([]);

  // Load surahs on component mount
  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const surahs = await fetchSurahs();
        setSurahList(surahs);
      } catch (error) {
        console.error("Error loading surahs:", error);
      }
    };
    loadSurahs();
  }, []);

  // Load quiz data when surah or range changes
  useEffect(() => {
    const loadQuizData = async () => {
      if (!selectedSurah.id) return;

      try {
        setLoading(true);
        setError(null);
        setCurrentQuestion(1);
        setSelectedAnswer("");
        setShowAnswer(false);
        setUserAnswers({});
        setSubmittedQuestions({});
        setScore(0);
        setQuizCompleted(false);

        console.log("Loading quiz data for:", {
          surahId: selectedSurah.id,
          range: selectedRange,
          isEntireSurah,
          isEntireThafheem,
        });

        let quizResponse;
        let rawData;

        if (isEntireThafheem) {
          console.log("Fetching random questions for entire Thafheem");
          rawData = await fetchRandomQuizQuestions(selectedSurah.id, 10);
          const transformedQuestions = transformQuizData(rawData);
          quizResponse = {
            questions: transformedQuestions,
            surahInfo: selectedSurah,
            totalQuestions: transformedQuestions.length,
          };
        } else if (isEntireSurah) {
          console.log("Fetching questions for entire surah");
          quizResponse = await fetchQuizWithSurahInfo(
            selectedSurah.id,
            selectedRange
          );
        } else {
          console.log("Fetching questions for specific range");
          const [start, end] = selectedRange.split("-").map(Number);
          rawData = await fetchQuizQuestionsForRange(
            selectedSurah.id,
            start,
            end || start
          );
          const transformedQuestions = transformQuizData(rawData);
          quizResponse = {
            questions: transformedQuestions,
            surahInfo: selectedSurah,
            totalQuestions: transformedQuestions.length,
          };
        }

        // Validate the transformed data
        if (
          quizResponse &&
          quizResponse.questions &&
          validateQuizData(quizResponse.questions)
        ) {
          setQuizData({
            title: "തഹാഫീസ് പ്രശ്നോത്തരി",
            totalQuestions: quizResponse.questions.length,
            questions: quizResponse.questions,
            surahInfo: quizResponse.surahInfo || selectedSurah,
          });
        } else {
          console.warn("Quiz data validation failed, using fallback data");
          const fallbackData = createFallbackQuizData(selectedSurah.id);
          setQuizData({
            title: "തഹാഫീസ് പ്രശ്നോത്തരി (Debug Mode)",
            ...fallbackData,
          });
        }
      } catch (err) {
        console.error("Detailed error loading quiz data:", err);
        setError(err.message);
        const fallbackData = createFallbackQuizData(selectedSurah.id);
        setQuizData({
          title: "തഹാഫീസ് പ്രശ്നോത്തരി (Error Mode)",
          ...fallbackData,
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [selectedSurah, selectedRange, isEntireSurah, isEntireThafheem]);

  const currentQuestionData = quizData?.questions[currentQuestion - 1];

  const handleAnswerSelect = (answerId) => {
    // Only allow selection if question hasn't been submitted
    if (submittedQuestions[currentQuestion]) {
      return;
    }

    setSelectedAnswer(answerId);

    // Store the answer for this question
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerId,
    }));

    // Don't show answer or update score until submitted
    setShowAnswer(false);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || submittedQuestions[currentQuestion]) {
      return;
    }

    // Mark this question as submitted
    setSubmittedQuestions((prev) => ({
      ...prev,
      [currentQuestion]: true,
    }));

    // Show the answer
    setShowAnswer(true);

    // Only increment score if answer is correct
    if (
      String(selectedAnswer).trim() ===
      String(currentQuestionData?.correctAnswer).trim()
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);

      // Load previous answer if exists
      const prevAnswer = userAnswers[prevQuestion] || "";
      setSelectedAnswer(prevAnswer);

      // Show answer if question was previously submitted
      setShowAnswer(!!submittedQuestions[prevQuestion]);
    }
  };

  const handleNext = () => {
    // Don't navigate if current question hasn't been submitted
    if (!submittedQuestions[currentQuestion]) {
      alert(
        "Please submit your answer before proceeding to the next question."
      );
      return;
    }

    if (currentQuestion < (quizData?.totalQuestions || 0)) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);

      // Load next answer if exists
      const nextAnswer = userAnswers[nextQuestion] || "";
      setSelectedAnswer(nextAnswer);

      // Show answer if question was previously submitted
      setShowAnswer(!!submittedQuestions[nextQuestion]);
    }
  };

  const handleSubmitQuiz = () => {
    if (!submittedQuestions[currentQuestion]) {
      alert("Please submit your answer before finishing the quiz.");
      return;
    }

    setQuizCompleted(true);
    alert(
      `Quiz completed! Your final score: ${score} out of ${quizData?.totalQuestions}`
    );
  };

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah);
    setSelectedRange("1-7");
    setShowSurahDropdown(false);
  };

  const handleScopeChange = (scope) => {
    setIsEntireSurah(scope === "entireSurah");
    setIsEntireThafheem(scope === "entireThafheem");
  };

  const toggleSurahDropdown = () => {
    setShowSurahDropdown(!showSurahDropdown);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-900 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading quiz questions...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Surah: {selectedSurah.name}, Range: {selectedRange}
          </p>
        </div>
      </div>
    );
  }

  const isLastQuestion = currentQuestion === quizData?.totalQuestions;
  const hasSubmittedCurrent = submittedQuestions[currentQuestion];

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-700 relative">
        <div className="w-full mx-auto px-2 sm:px-4 py-2 dark:bg-[#2A2C38]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex flex-row sm:flex-row items-start sm:items-center gap-2 sm:gap-3 relative w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex items-center gap-2 cursor-pointer px-2 sm:px-3 py-1 rounded"
                  onClick={toggleSurahDropdown}
                >
                  <span className="text-black font-medium dark:text-white text-sm sm:text-base">
                    {selectedSurah.name}
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white" />
                </div>

                <span className="text-xs sm:text-sm text-black dark:text-white">
                  {selectedRange}
                </span>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={isEntireSurah}
                    onChange={() => handleScopeChange("entireSurah")}
                    className="form-radio text-black focus:ring-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Entire Surah
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    checked={isEntireThafheem}
                    onChange={() => handleScopeChange("entireThafheem")}
                    className="form-radio text-black focus:ring-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Entire Thafheem
                  </span>
                </label>
              </div>

              {/* Surah Dropdown */}
              {showSurahDropdown && (
                <div className="fixed inset-0 flex items-center justify-center sm:absolute sm:left-0 sm:top-full sm:inset-auto sm:mt-2 sm:flex-none sm:items-start sm:justify-start bg-gray-500/70 bg-opacity-50 sm:bg-transparent z-50">
                  <div className="bg-white dark:bg-[#2A2C38] sm:rounded-2xl shadow-xl w-[320px] sm:w-80 h-[600px] sm:h-96 overflow-hidden rounded-2xl">
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                      <div className="flex bg-[#F8F9FA] w-full max-w-[244px] h-[40px] sm:h-[45px] dark:bg-gray-900 rounded-full p-1">
                        <button
                          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full transition flex-1 ${
                            activeTab === "Surah"
                              ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("Surah")}
                        >
                          Surah
                        </button>
                        <button
                          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full transition flex-1 ${
                            activeTab === "Verse"
                              ? "bg-white shadow text-gray-900 dark:bg-[#2A2C38] dark:text-white"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("Verse")}
                        >
                          Verse
                        </button>
                      </div>
                      <button
                        onClick={toggleSurahDropdown}
                        className="text-black hover:text-gray-600 ml-3"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="p-3 sm:p-4 border-b flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="w-3 h-3 sm:w-4 sm:h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search Surah"
                          className="w-full pl-8 sm:pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Verse"
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
                      />
                    </div>

                    <div className="overflow-y-auto h-full pb-20 sm:pb-4 font-poppins">
                      {surahList.map((surah) => (
                        <div
                          key={surah.number}
                          className={`flex items-center justify-between px-3 sm:px-4 py-3 sm:py-2 cursor-pointer text-xs sm:text-sm ${
                            surah.number === selectedSurah.id
                              ? "bg-gray-100 dark:bg-black dark:text-white rounded-lg mx-2"
                              : "hover:bg-gray-50 dark:hover:bg-black"
                          }`}
                          onClick={() =>
                            handleSurahSelect({
                              id: surah.number,
                              name: surah.name,
                            })
                          }
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-black w-6 dark:text-white">
                              {surah.number}.
                            </span>
                            <span className="text-black dark:text-white">
                              {surah.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-black dark:text-white">
                            <span>{surah.ayahs} verses</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div>
        <ArrowLeft className="hidden sm:inline w-4 h-4 sm:w-5 sm:h-5 text-gray-600 relative top-6 sm:top-8 left-4 sm:left-10" />
      </div>

      <div className="bg-white dark:bg-gray-900">
        <div className="w-full max-w-[884px] mx-auto border-b px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <h1
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "#2AA0BF" }}
              >
                {quizData?.title || "Loading..."}
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-white"
            
            >
              <span  className="font-malayalam">മാർക്ക്: {score}</span>
              <span className="ml-4">
                Total: {quizData?.totalQuestions || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {error && (
        <div className="w-full max-w-[884px] mx-auto px-3 sm:px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm font-medium">
              Debug Information:
            </p>
            <p className="text-yellow-700 text-xs mt-1">API Error: {error}</p>
            <p className="text-yellow-700 text-xs">
              Check browser console for detailed API response
            </p>
            <p className="text-yellow-700 text-xs">
              Using fallback data for testing
            </p>
          </div>
        </div>
      )}

      {/* Quiz Completion Message */}
      {quizCompleted && (
        <div className="w-full max-w-[884px] mx-auto px-3 sm:px-4 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-lg font-medium">
              🎉 Quiz Completed!
            </p>
            <p className="text-green-700 text-sm mt-1">
              Your final score:{" "}
              <strong>
                {score} out of {quizData?.totalQuestions}
              </strong>
            </p>
            <p className="text-green-700 text-sm">
              Percentage:{" "}
              <strong>
                {Math.round((score / quizData?.totalQuestions) * 100)}%
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {quizData && currentQuestionData && (
        <div className="w-full max-w-[884px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="dark:bg-gray-900 rounded-lg p-4 sm:p-6 mb-4">
            <div className="bg-[#EBEEF0] dark:bg-[#323A3F] p-3 sm:p-2 mb-4 rounded-lg">
              <div className="mb-3 sm:mb-4">
                <span className="text-xs sm:text-lg text-gray-600 dark:text-white font-malayalam">
                  ചോദ്യം: {currentQuestion} / {quizData.totalQuestions}
                </span>
              </div>
              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-lg text-gray-800 leading-relaxed dark:text-white font-malayalam">
                  {currentQuestionData.question}
                </p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 ">
              {currentQuestionData.options.map((option, optionIndex) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                    hasSubmittedCurrent
                      ? "cursor-default"
                      : "cursor-pointer hover:bg-gray-50 dark:hover:bg-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="flex  items-center p-3 sm:p-4 justify-center w-[40px] h-[35px] sm:w-[47px] sm:h-[40px] rounded-lg bg-[#EBEEF0] text-gray-800 dark:bg-[#323A3F] dark:text-white text-sm sm:text-base">
                      {option.id}
                    </span>
                    <input
                      type="radio"
                      name="answer"
                      value={option.id}
                      checked={selectedAnswer === option.id}
                      onChange={() => handleAnswerSelect(option.id)}
                      disabled={hasSubmittedCurrent}
                    />
                  </div>
                  <div className="flex items-center p-3 sm:p-4 w-full rounded-lg bg-[#EBEEF0] text-gray-800 dark:bg-[#323A3F] dark:text-white">
                    <span className="text-gray-700 dark:text-white text-sm sm:text-lg font-malayalam">
                      {option.text || `Option ${option.id} - No text available`}
                    </span>
                  </div>
                </label>
              ))}
            </div>


            {/* Submit Answer Button */}
            {selectedAnswer && !hasSubmittedCurrent && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleSubmitAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Answer
                </button>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-row sm:flex-row justify-center items-center gap-4 sm:gap-12">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-gray-900 dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Previous
                Question
              </button>

              <button
                onClick={handleNext}
                disabled={
                  !hasSubmittedCurrent ||
                  currentQuestion === quizData?.totalQuestions
                }
                className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-gray-900 dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                Next Question <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {showAnswer && (
            <div className="flex justify-center sm:justify-start">
              <div
                className={`border-2 rounded-lg p-3 sm:p-4 w-[350px] sm:w-full text-center sm:text-left ${
                  String(selectedAnswer).trim() ===
                  String(currentQuestionData.correctAnswer).trim()
                    ? "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700"
                }`}
              >
                <div className="text-black">
                  <p className="font-medium mb-1 dark:text-white text-sm sm:text-base">
                    {String(selectedAnswer).trim() ===
                    String(currentQuestionData.correctAnswer).trim()
                      ? "🎉 Correct!"
                      : "❌ Sorry...!"}
                  </p>
                  <p className="text-xs sm:text-sm dark:text-white text-black">
                    Correct Answer:{" "}
                    <span style={{ color: "#2AA0BF" }}>
                      {currentQuestionData.correctAnswer}){" "}
                      {
                        currentQuestionData.options.find(
                          (opt) => opt.id === currentQuestionData.correctAnswer
                        )?.text
                      }
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Quiz;
