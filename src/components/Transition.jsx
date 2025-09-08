
import { ChevronDown, BookOpen, Notebook } from "lucide-react"; // swapped icons
import { useState } from "react";
import NavigateSurah from "../pages/NavigateSurah";

const Transition = ({ showPageInfo = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState({
    id: 2,
    name: "Al-Baqarah",
  });

  const [activeView, setActiveView] = useState("book"); // "book" or "notebook"

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

            {/* NavigateSurah Dropdown */}
            {/* {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 z-10">
                <NavigateSurah onSurahSelect={handleSurahSelect} />
              </div>
            )} */}
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
              <span className="font-medium text-gray-700 ml-1 dark:text-white">Page 2</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700 dark:text-white">Page 2</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transition;
