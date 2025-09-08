import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  Search,
  ChevronDown,
} from "lucide-react";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("B");
  const [showAnswer, setShowAnswer] = useState(true);
  const [score, setScore] = useState(0);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("Surah");

  const quizData = {
    title: "തഹാഫീസ് പ്രശ്നോത്തരി",
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question:
          "ഖുർആന്റെ പാരായണത്തിനായി ക്ഷേത്രനിർമാണ് അല്ലാഹു പഠിപ്പിച്ച പ്രാർത്ഥന?",
        options: [
          { id: "A", text: "തത്ത്വ കത്തിത" },
          { id: "B", text: "തഖ്വീർ" },
          { id: "C", text: "ആയത്തുൽ കുര്സി 191, 193" },
        ],
        correctAnswer: "A",
      },
    ],
  };

  const surahList = [
    { id: 1, name: "Al-Fatihah", verseStart: 1, verseEnd: 7 },
    { id: 2, name: "Al-Fatihah", verseStart: 8, verseEnd: 20 },
    { id: 3, name: "Al-Fatihah", verseStart: 30, verseEnd: 39 },
    { id: 4, name: "Al-Fatihah", verseStart: 40, verseEnd: 46 },
    { id: 5, name: "Al-Fatihah", verseStart: 47, verseEnd: 59 },
    { id: 6, name: "Al-Fatihah", verseStart: 60, verseEnd: 61 },
    { id: 7, name: "Al-Fatihah", verseStart: 62, verseEnd: 71 },
    { id: 8, name: "Al-Fatihah", verseStart: 72, verseEnd: 82 },
    { id: 9, name: "Al-Fatihah", verseStart: 83, verseEnd: 86 },
    { id: 10, name: "Al-Fatihah", verseStart: 87, verseEnd: 96 },
    { id: 11, name: "Al-Fatihah", verseStart: 97, verseEnd: 103 },
  ];

  const currentQuestionData = quizData.questions[currentQuestion - 1];

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const toggleSurahDropdown = () => {
    setShowSurahDropdown(!showSurahDropdown);
  };

  return (
    <div className="min-h-screen dark:bg-black bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-700 relative">
        <div className="w-full mx-auto px-2 sm:px-4 py-2 dark:bg-[#2A2C38]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            {/* Left: Surah + Range */}
            <div className="flex flex-row sm:flex-row items-start sm:items-center gap-2 sm:gap-3 relative w-full sm:w-auto">
              {/* Surah Dropdown Button */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Dropdown */}
                <div
                  className="flex items-center gap-2 cursor-pointer px-2 sm:px-3 py-1 rounded"
                  onClick={toggleSurahDropdown}
                >
                  <span className="text-black font-medium dark:text-white text-sm sm:text-base">
                    Al-Fatihah
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white" />
                </div>

                {/* Verse Range */}
                <span className="text-xs sm:text-sm text-black dark:text-white">
                  1 - 7
                </span>

                {/* Radio Buttons */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="scope"
                    defaultChecked
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
                    className="form-radio text-black focus:ring-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-300">
                    Entire Thafheem
                  </span>
                </label>
              </div>

              {/* Dropdown (Positioned Below Button) */}
              {showSurahDropdown && (
                <div className="fixed inset-0 flex items-center justify-center sm:absolute sm:left-0 sm:top-full sm:inset-auto sm:mt-2 sm:flex-none sm:items-start sm:justify-start bg-gray-500/70 bg-opacity-50 sm:bg-transparent z-50">
                  <div className="bg-white dark:bg-[#2A2C38] sm:rounded-2xl shadow-xl w-[320px] sm:w-80 h-[600px] sm:h-96 overflow-hidden rounded-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                      {/* Tabs */}
                      <div className="flex bg-[#F8F9FA] w-full max-w-[244px] h-[40px] sm:h-[45px] dark:bg-black rounded-full p-1">
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

                      {/* Close Button */}
                      <button
                        onClick={toggleSurahDropdown}
                        className="text-black hover:text-gray-600 ml-3 "
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    {/* Search Fields */}
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
                        className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-xs sm:text-sm bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black dark:placeholder:text-white dark:text-white"
                      />
                    </div>

                    {/* Surah List */}
                    <div className="overflow-y-auto h-full pb-20 sm:pb-4">
                      {surahList.map((surah) => (
                        <div
                          key={surah.id}
                          className={`flex items-center justify-between px-3 sm:px-4 py-3 sm:py-2 cursor-pointer text-xs sm:text-sm ${
                            surah.id === 1
                              ? "bg-gray-100 dark:bg-black dark:text-white rounded-lg mx-2"
                              : "hover:bg-gray-50 dark:hover:bg-black"
                          }`}
                          onClick={() => setShowSurahDropdown(false)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-black w-6 dark:text-white">
                              {surah.id}.
                            </span>
                            <span className="text-black dark:text-white">
                              {surah.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-black dark:text-white">
                            <span>{surah.verseStart}</span>
                            <span>-</span>
                            <span>{surah.verseEnd}</span>
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

      <div className="bg-white dark:bg-black">
        <div className="w-full max-w-[884px] mx-auto border-b px-3 sm:px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <h1
                className="text-lg sm:text-xl font-semibold"
                style={{ color: "#2AA0BF" }}
              >
                {quizData.title}
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-white">
              <span>മാർക്ക്: {score}</span>
              <span className="ml-4">Total: {quizData.totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[884px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Question */}
        <div className="dark:bg-black rounded-lg p-4 sm:p-6 mb-4">
          <div className="bg-[#EBEEF0] dark:bg-[#323A3F] p-3 sm:p-2 mb-4 rounded-lg">
            <div className="mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-white">
                ചോദ്യം: {currentQuestion} / {quizData.totalQuestions}
              </span>
            </div>
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-md text-gray-800 leading-relaxed dark:text-white">
                {currentQuestionData.question}
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {currentQuestionData.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer dark:hover:bg-transparent hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="flex items-center p-3 sm:p-4 justify-center w-[40px] h-[35px] sm:w-[47px] sm:h-[40px] rounded-lg bg-[#EBEEF0] text-gray-800 dark:bg-[#323A3F] dark:text-white text-sm sm:text-base">
                    {option.id}
                  </span>
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={selectedAnswer === option.id}
                    onChange={() => handleAnswerSelect(option.id)}
                  />
                </div>
                <div className="flex items-center p-3 sm:p-4 w-full rounded-lg bg-[#EBEEF0] text-gray-800 dark:bg-[#323A3F] dark:text-white">
                  <span className="text-gray-700 dark:text-white text-sm sm:text-base">
                    {option.text}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-gray-600 mb-4 dark:text-white">
            <p>
              അടുത്ത ചോദ്യത്തിലേക്ക് പ്രവേശിക്കുന്നതിനായി ഉത്തരം തെരഞ്ഞടുക്കുക.
            </p>
          </div>

          <div className="flex flex-row sm:flex-row justify-center items-center gap-4 sm:gap-12">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-black dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Previous
              Question
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestion === quizData.totalQuestions}
              className="flex items-center gap-2 px-4 py-2 bg-white border dark:bg-black dark:text-white dark:border rounded-2xl text-gray-600 hover:text-gray-800 disabled:opacity-50 w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              Next Question <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {showAnswer && (
          <div className="flex justify-center sm:justify-start">
            <div className="bg-[#EBEEF0] dark:bg-[#323A3F] border-red-200 rounded-lg p-3 sm:p-4 w-[350px] sm:w-full text-center sm:text-left">
              <div className="text-black">
                <p className="font-medium mb-1 dark:text-white text-sm sm:text-base">
                  Sorry...!
                </p>
                <p className="text-xs sm:text-sm dark:text-white text-black">
                  Answer:{" "}
                  <span style={{ color: "#2AA0BF" }}>A) തത്ത്വ കത്തിത</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input[type="radio"] {
          appearance: none;
          width: 16px;
          height: 16px;
          border: 3px solid black;
          border-radius: 50%;
          background-color: white;
          position: relative;
          cursor: pointer;
        }

        @media (min-width: 640px) {
          input[type="radio"] {
            width: 20px;
            height: 20px;
          }
        }

        input[type="radio"]:checked {
          background-color: white;
        }

        input[type="radio"]:checked::after {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: black;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @media (min-width: 640px) {
          input[type="radio"]:checked::after {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Quiz;
