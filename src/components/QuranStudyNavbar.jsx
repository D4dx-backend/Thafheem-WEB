import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const QuranStudyNavbar = ({ activeItem, setActiveItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigationItems = [
    "Note",
    "An introduction to study of the Quran",
    "Unique book",
    "Some basic facts",
    "What kind of book?",
    "The basis of the Quran",
    "Theme and theme",
    "Pearls strung on a necklace",
    "Presentation stages",
    "Instruction book",
    "Why the repetition?",
    "Codification",
    "Book illustration",
  ];

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsDropdownOpen(false); // Close dropdown on mobile after selection
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden bg-white dark:bg-[#2A2C38] border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white mb-3">
            Qur'an Study - Preface
          </h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#1A1C28] border border-gray-200 dark:border-gray-600 rounded-lg text-left text-black dark:text-white"
            >
              <span className="truncate">{activeItem}</span>
              {isDropdownOpen ? (
                <ChevronUp size={20} className="ml-2 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="ml-2 flex-shrink-0" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#1A1C28] ${
                      activeItem === item
                        ? "bg-[#D9D9D9] dark:bg-gray-900 text-black dark:text-white font-medium"
                        : "text-gray-700 dark:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[332px] bg-white border-r border-gray-200 shadow-lg h-screen overflow-y-auto dark:bg-[#2A2C38] m-4">
        {/* Header */}
        <div className="bg-white dark:text-white text-black p-4 dark:bg-[#2A2C38] shadow-md">
          <h1 className="text-lg font-semibold">Qur'an Study - Preface</h1>
        </div>

        {/* Navigation List */}
        <nav className="py-2">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={index} className="flex justify-center">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-[284px] text-left px-4 py-3 text-sm transition-all duration-200  ${
                    activeItem === item
                      ? "bg-[#D9D9D9]  dark:border-0  text-black dark:bg-gray-900 dark:text-white font-medium"
                      : "border-l-transparent text-gray-700 dark:text-white hover:border-l-gray-300"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default QuranStudyNavbar;
