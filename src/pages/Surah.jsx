import {
  Play,
  Bookmark,
  Share2,
  Copy,
  FileText,
  AlignLeft,
  ChevronDown,
  BookOpen,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { useState } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../components/Transition";
import WordByWord from "./WordByWord";

const Surah = () => {
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [selectedVerseForWordByWord, setSelectedVerseForWordByWord] =
    useState(null);
  const navigate = useNavigate();

  const handleWordByWordClick = (verseNumber) => {
    setSelectedVerseForWordByWord(verseNumber);
    setShowWordByWord(true);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    navigate("/bookmarkblock");
  };

  const verses = [
    {
      number: 1,
      arabic: "الٓمٓ",
      translation: "Alif, Lam, Mim,",
    },
    {
      number: 2,
      arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
      translation:
        "This is the Book! There is no doubt about it—a guide for those mindful of Allah,",
    },
    {
      number: 3,
      arabic:
        "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
    },
    {
      number: 4,
      arabic:
        "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
    },
    {
      number: 5,
      arabic:
        "أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
    },
    {
      number: 6,
      arabic:
        "إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ",
      translation:
        "and who believe in what has been revealed to you ˹O Prophet˺ and what was revealed before you, and have sure faith in the Hereafter.",
    },
    {
      number: 7,
      arabic:
        "خَتَمَ اللَّهُ عَلَىٰ قُلُوبِهِمْ وَعَلَىٰ سَمْعِهِمْ ۖ وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ ۖ وَلَهُمْ عَذَابٌ عَظِيمٌ",
      translation:
        "who believe in the unseen, establish prayer, and donate from what We have provided for them,",
    },
  ];

  return (
    <>
      {/* <HomepageNavbar /> */}
      <Transition />

      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-white dark:bg-black px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Toggle Buttons */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-100 dark:bg-[#323A3F] rounded-full p-1">
                <div className="flex items-center">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-black dark:text-white  text-gray-900 rounded-full text-sm font-medium shadow-sm">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                    <span>Translation</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-white dark:hover:bg-gray-800 dark:text-white  hover:bg-gray-50 rounded-full text-sm font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10,9 9,9 8,9" />
                    </svg>
                    <Link to="/reading">
                      <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                        Reading
                      </span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>

            {/* Surah Title */}
            <div className="mb-6">
              <h1 className="text-5xl font-arabic dark:text-white text-gray-900 mb-4">
                البقرة
              </h1>

              {/* Action Icons */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button className="p-2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 dark:text-white hover:text-gray-600 transition-colors"
                  onClick={handleBookmarkClick}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Bismillah */}
              <div className="mb-8 relative">
                <p className="text-3xl font-arabic text-gray-800 dark:text-white leading-relaxed">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>

                {/* Ayah wise / Block wise buttons */}
                <div className="absolute top-0 right-0">
                  <div className="flex bg-gray-100  dark:bg-[#323A3F] rounded-full p-1 shadow-sm">
                    <button className="px-4 py-1.5 bg-white dark:bg-black dark:text-white  text-gray-900  rounded-full text-sm font-medium shadow transition-colors">
                      Ayah wise
                    </button>
                    <button
                      className="px-4 py-1.5 text-gray-500 rounded-full  dark:hover:bg-gray-800 dark:text-white text-sm font-medium hover:text-gray-700 transition-colors"
                      onClick={() => navigate("/blockwise")}
                    >
                      Block wise
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-900 dark:bg-white rounded-full"></div>
                  <Link to="/surahinfo">
                    <span className="text-sm text-gray-600 dark:text-white cursor-pointer hover:underline">
                      Surah Info
                    </span>
                  </Link>
                </div>

                <button className="flex items-center space-x-2 text-cyan-500 hover:text-cyan-600 transition-colors">
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Play Audio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verses */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {verses.map((verse) => (
              <div
                key={verse.number}
                className={`bg-white rounded-lg dark:bg-black shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                  selectedVerse === verse.number
                    ? "ring-2 ring-cyan-500 border-cyan-200"
                    : "hover:shadow-md"
                }`}
                onClick={() =>
                  setSelectedVerse(
                    selectedVerse === verse.number ? null : verse.number
                  )
                }
              >
                {/* Verse Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {verse.number}
                    </div>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                      onClick={handleBookmarkClick}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                      <Play className="w-4 h-4" />
                    </button>
                  </div> */}
                </div>

                {/* Arabic Text */}
                <div className="text-right mb-4">
                  <p className="text-2xl font-arabic leading-loose dark:text-white text-gray-900">
                    {verse.arabic}
                  </p>
                </div>

                {/* Translation */}
                <div className="mb-3">
                  <p className="text-gray-700 dark:text-white leading-relaxed">
                    {verse.translation}
                  </p>
                </div>

                {/* Action Icons */}
                <div className="flex items-center justify-start space-x-6 py-3">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/ayah/${verse.number}`);
                    }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWordByWordClick(verse.number);
                    }}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleBookmarkClick}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t dark:bg-black border-gray-200 px-4 py-4 mt-8">
          <div className="max-w-4xl mx-auto flex items-center justify-center space-x-6">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <ArrowUp className="w-4 h-4" />
              <span>Beginning of Surah</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 dark:bg-[#323A3F] dark:text-white hover:text-gray-900">
              <span>Next Surah</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overlay Popup for Word by Word */}
        {showWordByWord && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-5xl max-h-[90vh] overflow-y-auto relative w-full mx-4">
              <WordByWord selectedVerse={selectedVerseForWordByWord} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Surah;
