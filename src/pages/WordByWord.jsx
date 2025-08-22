import React from 'react';
import WordNavbar from '../components/WordNavbar';

const WordByWord = () => {
  return (
    <>
    <WordNavbar/>
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="space-y-8">
        {/* Verse Header */}
        <div className="text-center border-b border-gray-300 pb-4">
          <div className="text-2xl text-gray-700">
          الٓمٓ﴿١﴾
          </div>
        </div>

        {/* Main Word Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-lg text-gray-800">Alif, Lam, Mim.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-gray-700 font-arabic">
                الۤمّۤ
              </div>
            </div>
          </div>
        </div>

        {/* Verse End Marker */}
        <div className="text-right">
          <div className="text-2xl text-gray-600">
          =﴿١﴾
          </div>
        </div>

        {/* Empty Space for Content */}
        <div className="min-h-[200px]">
          {/* This space can be used for additional word-by-word content */}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
            <span className="mr-2">←</span>
            <span>Previous Ayah</span>
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors bg-white">
            <span>Next Ayah</span>
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
    </>

  );
};

export default WordByWord;