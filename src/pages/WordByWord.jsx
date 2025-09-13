import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  fetchWordByWordMeaning,
  fetchThafheemWordMeanings,
  fetchSurahs,
} from "../api/apifunction";
import WordNavbar from "../components/WordNavbar";

const WordByWord = ({ selectedVerse, surahId, onClose, onNavigate }) => {
  const [wordData, setWordData] = useState(null);
  const [thafheemWords, setThafheemWords] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWordData = async () => {
      if (!selectedVerse || !surahId) return;

      try {
        setLoading(true);
        setError(null);

        const [quranComData, thafheemData, surahsData] = await Promise.all([
          fetchWordByWordMeaning(surahId, selectedVerse),
          fetchThafheemWordMeanings(surahId, selectedVerse).catch(() => []),
          fetchSurahs()
            .then((surahs) =>
              surahs.find((s) => s.number === parseInt(surahId))
            )
            .catch(() => null),
        ]);

        setWordData(quranComData);
        setThafheemWords(thafheemData || []);
        setSurahInfo(surahsData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching word data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWordData();
  }, [selectedVerse, surahId]);

  const handlePrevious = () => {
    if (selectedVerse > 1 && onNavigate) {
      onNavigate(selectedVerse - 1);
    }
  };

  const handleNext = () => {
    if (onNavigate) {
      onNavigate(selectedVerse + 1);
    }
  };

  if (loading) {
    return (
      <>
        <WordNavbar
          surahId={surahId}
          selectedVerse={selectedVerse}
          surahInfo={surahInfo}
          onNavigate={onNavigate}
          onClose={onClose}
        />
        <div className="max-w-4xl mx-auto p-6 dark:bg-[#2A2C38] bg-white rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              Word by Word
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            )}
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading word meanings...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <WordNavbar
          surahId={surahId}
          selectedVerse={selectedVerse}
          surahInfo={surahInfo}
          onNavigate={onNavigate}
          onClose={onClose}
        />
        <div className="max-w-4xl mx-auto p-6 dark:bg-[#2A2C38] bg-white rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">
              Word by Word
            </h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            )}
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 mb-2">
              Failed to load word meanings
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WordNavbar
        surahId={surahId}
        selectedVerse={selectedVerse}
        surahInfo={surahInfo}
        onNavigate={onNavigate}
        onClose={onClose}
      />

      <div className="max-w-4xl mx-auto p-6 dark:bg-[#2A2C38] bg-white rounded-lg">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-600 pb-4">
            <div>
              <h2 className="text-xl font-semibold dark:text-white">
                Word by Word
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Surah {surahId}, Verse {selectedVerse}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>
            )}
          </div>

          {/* Complete Verse */}
          {wordData && (
            <div className="text-center border-b border-gray-300 dark:border-gray-600 pb-6">
              <div className="text-2xl sm:text-3xl text-gray-700 dark:text-white font-arabic mb-4 leading-loose">
                {wordData.text_uthmani ||
                  (wordData.words &&
                    wordData.words
                      .map((word) => word.text_uthmani || word.text_simple)
                      .join(" ")) ||
                  "Verse text not available"}
              </div>
              {wordData.translations && wordData.translations.length > 0 && (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {wordData.translations[0].text}
                </p>
              )}
            </div>
          )}

          {/* Word by Word Breakdown */}
          {wordData && wordData.words && wordData.words.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white mb-4">
                Word Breakdown:
              </h3>

              <div className="grid gap-3">
                {wordData.words.map((word, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {/* Arabic Word */}
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl text-gray-700 dark:text-white font-arabic">
                        {word.text_uthmani || word.text_simple || "N/A"}
                      </div>
                      {word.text_simple &&
                        word.text_uthmani !== word.text_simple && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {word.text_simple}
                          </div>
                        )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        #{word.word_number || index + 1}
                      </div>
                    </div>

                    {/* Translation/Meaning */}
                    <div className="text-left max-w-[60%]">
                      {word.translation && word.translation.text ? (
                        <p className="text-lg text-gray-800 dark:text-white mb-1">
                          {word.translation.text}
                        </p>
                      ) : (
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-1 italic">
                          Translation not available
                        </p>
                      )}
                      {word.class_name && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {word.class_name}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no word data */}
          {wordData && (!wordData.words || wordData.words.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Word-by-word breakdown not available for this verse.
              </p>
            </div>
          )}

          {/* Thafheem Word Meanings */}
          {thafheemWords.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold dark:text-white">
                Thafheem Word Meanings:
              </h3>
              <div className="grid gap-3">
                {thafheemWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="text-right">
                      <span className="text-lg font-arabic dark:text-white">
                        {word.WordPhrase}
                      </span>
                    </div>
                    <div className="text-left ">
                      <span className="text-gray-700 dark:text-gray-300 font-malayalam">
                        {word.Meaning}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <button
              onClick={handlePrevious}
              disabled={selectedVerse <= 1}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2A2C38] dark:text-white text-gray-600 hover:text-gray-800 dark:hover:text-white hover:border-gray-400 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Previous Ayah</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#2A2C38] dark:text-white text-gray-600 hover:text-gray-800 dark:hover:text-white hover:border-gray-400 transition-colors bg-white"
            >
              <span>Next Ayah</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WordByWord;
