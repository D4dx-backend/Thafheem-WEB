import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const DragDropQuiz = () => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions] = useState(5);
  const [draggedItem, setDraggedItem] = useState(null);
  const [droppedItems, setDroppedItems] = useState({
    'বিসমিল্লাহ': { text: 'അല്ലാഹുവിന്റെ നാമത്തിൽ', correct: true },
    'আল্লাহ': { text: 'নামাক كाটিकา', correct: false }
  });

  const arabicTexts = [
    { id: 'বিসমিল্লাহ', text: 'بِسْمِ', correctTranslation: 'അല്ലാഹുവിന്റെ നാമത്തിൽ' },
    { id: 'আল্লাহ', text: 'اللَّهِ', correctTranslation: 'അല്ലാഹു' },
    { id: 'রহমান', text: 'الرَّحْمَٰنِ', correctTranslation: 'പരമകാരുണികനായ' },
    { id: 'রহীম', text: 'الرَّحِيمِ', correctTranslation: 'പരമദയാലുവായ' },
    { id: 'হামদ', text: 'الْحَمْدُ', correctTranslation: 'സ്തുതി' },
    { id: 'লিল্লাহ', text: 'لِلَّهِ', correctTranslation: 'അല്ലാഹുവിനു' },
    { id: 'রব্বে', text: 'رَبِّ', correctTranslation: 'നാഥനു' },
    { id: 'আলামীন', text: 'الْعَالَمِينَ', correctTranslation: 'സകലജഗത്തുകളുടെയും' }
  ];

  const malayalamOptions = [
    { id: 'opt1', text: 'നിദ്രാനിമഗ്നമായവനു' },
    { id: 'opt2', text: 'പരമകാരുണികനായവനു' },
    { id: 'opt3', text: 'സർവലോകങ്ങളുടെയും' },
    { id: 'opt4', text: 'സ്തുതി' },
    { id: 'opt5', text: 'അല്ലാഹുവിനു' },
    { id: 'opt6', text: 'അല്ലാഹുവിന്റെ' },
    { id: 'opt7', text: 'നാഥനു, നാഥനായവനു' }
  ];

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedItem) {
      const targetArabic = arabicTexts.find(item => item.id === targetId);
      const isCorrect = targetArabic && targetArabic.correctTranslation === draggedItem.text;
      
      setDroppedItems(prev => ({
        ...prev,
        [targetId]: { text: draggedItem.text, correct: isCorrect }
      }));
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      
      setDraggedItem(null);
    }
  };

  const getDroppedItem = (targetId) => {
    return droppedItems[targetId];
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const getAvailableOptions = () => {
    const usedTexts = Object.values(droppedItems).map(item => item.text);
    return malayalamOptions.filter(option => !usedTexts.includes(option.text));
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleCancelGame = () => {
    // Could redirect back or close the application
    console.log('Game cancelled');
  };
  const [gameStarted, setGameStarted] = useState(false);

  // Show start game modal if game hasn't started
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Start Game</h2>
            
            {/* Modal Content */}
            <p className="text-gray-600 mb-6">
              Are you ready to begin the game? Let's go!
            </p>
            
            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelGame}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartGame}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                style={{ backgroundColor: '#2AA0BF' }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game content - shows after start button is clicked
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
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
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <h1 className="text-xl font-semibold" style={{ color: '#2AA0BF' }}>
                Drag & Drop
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              <span>മാർക്ക്: {score}</span>
              <span className="ml-4">Total: {totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          
          {/* Drag & Drop Area */}
          <div className="flex gap-8 justify-center">
            
            {/* Arabic Text Column */}
            <div className="flex flex-col gap-4">
              {arabicTexts.map((item) => (
                <div key={item.id} className="bg-gray-200 p-4 rounded text-center w-24 h-12 flex items-center justify-center">
                  <span className="text-lg font-semibold" style={{ fontFamily: 'Arabic, serif' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Drop Zones Column */}
            <div className="flex flex-col gap-4">
              {arabicTexts.map((item) => {
                const droppedItem = getDroppedItem(item.id);
                
                return (
                  <div
                    key={`drop-${item.id}`}
                    className={`w-64 h-12 border-2 border-dashed rounded flex items-center justify-center text-sm transition-colors ${
                      droppedItem 
                        ? droppedItem.correct 
                          ? 'border-green-400 bg-green-100 text-green-700' 
                          : 'border-red-400 bg-red-100 text-red-700'
                        : 'border-gray-300 bg-white hover:border-blue-300'
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

            {/* Malayalam Options Column */}
            <div className="flex flex-col gap-3">
              {getAvailableOptions().map((option) => (
                <div
                  key={option.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                  className="bg-white border border-gray-300 p-3 rounded cursor-move hover:shadow-md transition-shadow text-sm w-48 h-12 flex items-center justify-center"
                >
                  {option.text}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 border-t mt-8">
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
              disabled={currentQuestion === totalQuestions}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropQuiz;