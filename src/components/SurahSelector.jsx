import React, { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { fetchSurahs, fetchPageRanges } from "../api/apifunction";

const SurahSelector = ({ isOpen, onClose, onSelect, currentSurahId }) => {
  const [surahs, setSurahs] = useState([]);
  const [pageRanges, setPageRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [showRanges, setShowRanges] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [surahsData, rangesData] = await Promise.all([
          fetchSurahs(),
          fetchPageRanges()
        ]);
        setSurahs(surahsData);
        setPageRanges(rangesData);
      } catch (error) {
        console.error("Error loading surah data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
    setShowRanges(true);
  };

  const handleRangeSelect = (range) => {
    onSelect({
      surahId: selectedSurah.number,
      surahName: selectedSurah.name,
      range: `${range.ayafrom}-${range.ayato}`,
      pageId: range.PageId
    });
    onClose();
  };

  const handleBackToSurahs = () => {
    setShowRanges(false);
    setSelectedSurah(null);
  };

  const getSurahRanges = (surahId) => {
    return pageRanges.filter(range => range.SuraId === surahId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {showRanges ? `${selectedSurah?.name} - Verse Ranges` : "Select Surah"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : showRanges ? (
            /* Ranges View */
            <div>
              <button
                onClick={handleBackToSurahs}
                className="flex items-center gap-2 p-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-600"
              >
                <ChevronRight className="w-4 h-4 rotate-180 text-gray-600 dark:text-white" />
                <span className="text-sm text-gray-600 dark:text-white">Back to Surahs</span>
              </button>
              
              {getSurahRanges(selectedSurah.number).map((range, index) => (
                <div
                  key={index}
                  onClick={() => handleRangeSelect(range)}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        Verses {range.ayafrom}-{range.ayato}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Page {range.PageId}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Surahs View */
            <div>
              {surahs.map((surah) => (
                <div
                  key={surah.number}
                  onClick={() => handleSurahClick(surah)}
                  className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600 last:border-b-0 ${
                    surah.number === currentSurahId ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {surah.number}. {surah.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {surah.arabic} • {surah.ayahs} verses • {surah.type}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurahSelector;