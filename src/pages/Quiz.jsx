import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, X, Search } from 'lucide-react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('B');
  const [showAnswer, setShowAnswer] = useState(true);
  const [score, setScore] = useState(0);
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('Surah');

  const quizData = {
    title: "തഹാഫീസ് പ്രശ്നോത്തരി",
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        question: "ഖുർആന്റെ പാരായണത്തിനായി ക്ഷേത്രനിർമാണ് അല്ലാഹു പഠിപ്പിച്ച പ്രാർത്ഥന?",
        options: [
          { id: 'A', text: 'തത്ത്വ കത്തിത' },
          { id: 'B', text: 'തഖ്വീർ' },
          { id: 'C', text: 'ആയത്തുൽ കുര്സി 191, 193' }
        ],
        correctAnswer: 'A'
      }
    ]
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
    { id: 11, name: "Al-Fatihah", verseStart: 97, verseEnd: 103 }
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
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                onClick={toggleSurahDropdown}
              >
                <span className="text-gray-800 font-medium">Al-Fatihah</span>
                <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-600">1 - 7</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded"></div>
                <span className="text-sm text-gray-600">Entire Surah</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Entire Thaleem</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <h1 className="text-xl font-semibold" style={{ color: '#2AA0BF' }}>
                {quizData.title}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              <span>മാർക്ക്: {score}</span>
              <span className="ml-4">Total: {quizData.totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Question Container */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-4">
          {/* Question Number */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">
              ചോദ്യം: {currentQuestion} / {quizData.totalQuestions}
            </span>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">
              {currentQuestionData.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestionData.options.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    {option.id}
                  </span>
                  <input
                    type="radio"
                    name="answer"
                    value={option.id}
                    checked={selectedAnswer === option.id}
                    onChange={() => handleAnswerSelect(option.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-600 mb-4">
            <p>നഇറ്റുകള്‍ കപ്രയ്അമ്സ്പദ് പ്രകാശിത്രസന്തിനില്‍ ഇഷത, രമരലത്യവ്ലുക.</p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Question
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentQuestion === quizData.totalQuestions}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Answer Feedback */}
        {showAnswer && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700">
              <p className="font-medium mb-1">Sorry...!</p>
              <p className="text-sm">
                Answer: <span style={{ color: '#2AA0BF' }}>A) തത്ത്വ കത്തിത</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Surah Selection Modal */}
      {showSurahDropdown && (
        <div className="fixed inset-0 bg-gray-50 bg-transparent flex items-start justify-center pt-20 z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-4">
                <button
                  className={`px-3 py-1 rounded text-sm ${activeTab === 'Surah' ? 'bg-gray-100 text-gray-800' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('Surah')}
                >
                  Surah
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm ${activeTab === 'Verse' ? 'bg-gray-100 text-gray-800' : 'text-gray-600'}`}
                  onClick={() => setActiveTab('Verse')}
                >
                  Verse
                </button>
              </div>
              <button 
                onClick={toggleSurahDropdown}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tip */}
            <div className="px-4 py-2 text-xs text-gray-500 border-b">
              Tip: try navigating with <kbd className="bg-gray-100 px-1 rounded">Ctrl</kbd> <kbd className="bg-gray-100 px-1 rounded">K</kbd>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Surah"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Verse"
                  className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Surah List */}
            <div className="max-h-64 overflow-y-auto">
              {surahList.map((surah) => (
                <div 
                  key={surah.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setShowSurahDropdown(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-6">{surah.id}.</span>
                    <span className="text-sm text-gray-800">{surah.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
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
  );
};

export default Quiz;