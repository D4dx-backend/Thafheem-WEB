import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  List,
  Bookmark,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import WordByWordIcon from "./WordByWordIcon";
import { useNavigate } from "react-router-dom";

const InterpretationNavbar = ({
  interpretationNumber = 1,
  surahName = "2- Al-Baqarah",
  verseRange = "1 - 7",
  backTo,
  onClose,
  onSelectSurah,
  onSelectRange,
  onBookmark,
  onShare,
  onWordByWord,
  bookmarking = false,
  surahOptions = [], // [{value: 1, label: '1- Al-Fatihah'}]
  rangeOptions = [], // ['1-7', '8-14', '15-21'] or ['5', '6']
  onPickSurah,
  onPickRange,
  onPrev,
  onNext,
}) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // 'surah' | 'range' | null
  const surahBtnRef = useRef(null);
  const rangeBtnRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!surahBtnRef.current && !rangeBtnRef.current) return;
      if (
        surahBtnRef.current?.contains(e.target) ||
        rangeBtnRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpenMenu(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#2A2C38]">
      <div className="mx-auto max-w-[1073px] border-b dark:border-gray-600">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Top Row - Dropdowns and Close */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative inline-block" ref={surahBtnRef}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === "surah" ? null : "surah")
                  }
                  className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white transition-colors"
                >
                  <span className="text-sm font-medium truncate max-w-[140px]">
                    {surahName}
                  </span>
                  <ChevronDown size={16} />
                </button>
                {openMenu === "surah" && (
                  <div className="absolute top-full left-0 z-[1000] mt-2 w-64 max-h-64 overflow-auto bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {surahOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                        No options
                      </div>
                    )}
                    {surahOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onPickSurah && onPickSurah(opt.value);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative inline-block" ref={rangeBtnRef}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === "range" ? null : "range")
                  }
                  className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white transition-colors"
                >
                  <span className="text-sm font-medium">{verseRange}</span>
                  <ChevronDown size={16} />
                </button>
                {openMenu === "range" && (
                  <div className="absolute top-full left-0 z-[1000] mt-2 w-48 max-h-64 overflow-auto bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {rangeOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                        No options
                      </div>
                    )}
                    {rangeOptions.map((opt, idx) => (
                      <button
                        key={`${opt}-${idx}`}
                        onClick={() => {
                          onPickRange && onPickRange(opt);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Close button clicked in mobile navbar");
                handleClose();
              }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors ml-2"
            >
              <X size={20} className="text-black dark:text-white" />
            </button>
          </div>

          {/* Middle Row - Title + Action Icons */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-600">
            <h1 className="text-sm sm:text-lg font-medium text-[#2AA0BF]">
              Interpretation {interpretationNumber}
            </h1>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-[#2AA0BF] hover:text-[#1e8ba3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Word-by-word button clicked in navbar");
                  if (onWordByWord) {
                    onWordByWord();
                  }
                }}
              >
                <WordByWordIcon className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button
                className={`p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors relative ${
                  bookmarking ? "opacity-70 pointer-events-none" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Bookmark button clicked in navbar");
                  if (onBookmark) {
                    onBookmark();
                  }
                }}
              >
                <Bookmark
                  className={`w-4 h-4 sm:w-6 sm:h-6 ${
                    bookmarking ? "animate-pulse" : ""
                  }`}
                />
              </button>
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Share button clicked in navbar");
                  if (onShare) {
                    onShare();
                  }
                }}
              >
                <Share2 className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="relative inline-block" ref={surahBtnRef}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === "surah" ? null : "surah")
                  }
                  className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium">{surahName}</span>
                  <ChevronDown size={16} />
                </button>
                {openMenu === "surah" && (
                  <div className="absolute top-full left-0 z-[1000] mt-2 w-72 max-h-72 overflow-auto bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {surahOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                        No options
                      </div>
                    )}
                    {surahOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onPickSurah && onPickSurah(opt.value);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative inline-block" ref={rangeBtnRef}>
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === "range" ? null : "range")
                  }
                  className="flex items-center space-x-2 rounded-full px-4 py-2 bg-[#EBEEF0] dark:bg-[#323A3F] text-black dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium">{verseRange}</span>
                  <ChevronDown size={16} />
                </button>
                {openMenu === "range" && (
                  <div className="absolute top-full left-0 z-[1000] mt-2 w-56 max-h-72 overflow-auto bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {rangeOptions.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                        No options
                      </div>
                    )}
                    {rangeOptions.map((opt, idx) => (
                      <button
                        key={`${opt}-${idx}`}
                        onClick={() => {
                          onPickRange && onPickRange(opt);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-lg font-medium text-[#2AA0BF]">
                Interpretation {interpretationNumber}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-[#2AA0BF] hover:text-[#1e8ba3] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Word-by-word button clicked in desktop navbar");
                  if (onWordByWord) {
                    onWordByWord();
                  }
                }}
              >
                <WordByWordIcon className="w-5 h-5" />
              </button>
              <button
                className={`p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors relative ${
                  bookmarking ? "opacity-70 pointer-events-none" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Bookmark button clicked in desktop navbar");
                  if (onBookmark) {
                    onBookmark();
                  }
                }}
              >
                <Bookmark
                  size={20}
                  className={`${bookmarking ? "animate-pulse" : ""}`}
                />
              </button>
              <button
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Share button clicked in desktop navbar");
                  if (onShare) {
                    onShare();
                  }
                }}
              >
                <Share2 size={20} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Close button clicked in desktop navbar");
                  handleClose();
                }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 transition-colors ml-2"
              >
                <X size={20} className="text-black dark:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center justify-center py-3 bg-gray-50 dark:bg-[#2A2C38] border-t border-gray-100 dark:border-gray-600">
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Previous navigation button clicked");
                if (onPrev) {
                  onPrev();
                }
              }}
              className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
              click to navigate
            </span>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("Next navigation button clicked");
                if (onNext) {
                  onNext();
                }
              }}
              className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterpretationNavbar;
