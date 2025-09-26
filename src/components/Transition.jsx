
import { ChevronDown, BookOpen, Notebook } from "lucide-react"; // swapped icons
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import NavigateSurah from "../pages/NavigateSurah";
import { listSurahNames } from "../api/apifunction";
import { PAGE_RANGES_API } from "../api/apis";

const Transition = ({ showPageInfo = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState({
    id: 2,
    name: "Al-Baqarah",
  });
  const [surahNames, setSurahNames] = useState([]);
  const [currentPage, setCurrentPage] = useState(2);

  const { surahId } = useParams();
  const location = useLocation();

  const [activeView, setActiveView] = useState("book"); // "book" or "notebook"

  // Fetch surah names and update selected surah based on URL
  useEffect(() => {
    const loadSurahNames = async () => {
      try {
        const surahs = await listSurahNames();
        setSurahNames(surahs);
        
        // Update selected surah based on current URL
        if (surahId) {
          const currentSurah = surahs.find(s => s.id === parseInt(surahId));
          if (currentSurah) {
            setSelectedSurah({
              id: currentSurah.id,
              name: currentSurah.english
            });
          }
        }
      } catch (error) {
        console.error("Error loading surah names:", error);
      }
    };

    loadSurahNames();
  }, [surahId]);

  // Calculate page number based on surah using page ranges API
  useEffect(() => {
    const calculatePageNumber = async () => {
      if (surahId && surahNames.length > 0) {
        try {
          const surahIdNum = parseInt(surahId);
          
          // Fetch page ranges to get accurate page information
          const response = await fetch(PAGE_RANGES_API);
          if (response.ok) {
            const pageRanges = await response.json();
            
            // Find the first page range for this surah
            const surahPageRange = pageRanges.find(range => 
              range.SuraId === surahIdNum
            );
            
            if (surahPageRange) {
              setCurrentPage(surahPageRange.PageId);
            } else {
              // Fallback calculation if no page range found
              const pageNumber = Math.max(1, Math.min(604, surahIdNum + 1));
              setCurrentPage(pageNumber);
            }
          } else {
            // Fallback calculation if API fails
            const pageNumber = Math.max(1, Math.min(604, surahIdNum + 1));
            setCurrentPage(pageNumber);
          }
        } catch (error) {
          console.error("Error calculating page number:", error);
          // Fallback calculation if there's an error
          const surahIdNum = parseInt(surahId);
          const pageNumber = Math.max(1, Math.min(604, surahIdNum + 1));
          setCurrentPage(pageNumber);
        }
      }
    };

    calculatePageNumber();
  }, [surahId, surahNames]);

  const handleSurahSelect = (surah) => {
    setSelectedSurah(surah);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full bg-white dark:bg-[#2A2C38] border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between ">
        {/* Left Section - Chapter Selector */}
        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-white  rounded-lg transition-colors"
            >
              <span className="font-medium">{selectedSurah.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
  <div className="absolute top-full left-0 mt-1 z-10">
    <NavigateSurah 
      onSurahSelect={handleSurahSelect} 
      onClose={() => setIsDropdownOpen(false)} // ✅ pass down
    />
  </div>
)}

          </div>
        </div>


        {/* Right Section - Page Indicator */}
        <div className="flex items-center">
          {showPageInfo ? (
            <div className="flex items-center text-sm text-gray-500">
              <span>Juz 1 | Hizb 1 | </span>
              <span className="font-medium text-gray-700 ml-1 dark:text-white">Page {currentPage}</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700 dark:text-white">Page {currentPage}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transition;
