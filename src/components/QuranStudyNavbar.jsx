import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { fetchMalarticles } from "../api/apifunction";

const QuranStudyNavbar = ({ activeItem, setActiveItem }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMalarticles = async () => {
      try {
        setLoading(true);
        const data = await fetchMalarticles(0, "muk");

        // Extract articles with both ID and title from the API response
        const items = data.map((article) => ({
          id: article.aid,
          title: article.title,
        }));
        setNavigationItems(items);

        // Set the first item as active if no active item is set
        if (!activeItem && items.length > 0) {
          setActiveItem(items[0]);
        }
      } catch (err) {
        console.error("Error loading malarticles:", err);
        setError(err.message);

        // Fallback to hardcoded items with IDs
        const fallbackItems = [
          { id: 1, title: "Note" },
          { id: 2, title: "An introduction to study of the Quran" },
          { id: 3, title: "Unique book" },
          { id: 4, title: "Some basic facts" },
          { id: 5, title: "What kind of book?" },
          { id: 6, title: "The basis of the Quran" },
          { id: 7, title: "Theme and theme" },
          { id: 8, title: "Pearls strung on a necklace" },
          { id: 9, title: "Presentation stages" },
          { id: 10, title: "Instruction book" },
          { id: 11, title: "Why the repetition?" },
          { id: 12, title: "Codification" },
          { id: 13, title: "Book illustration" },
        ];
        setNavigationItems(fallbackItems);

        if (!activeItem) {
          setActiveItem(fallbackItems[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMalarticles();
  }, [activeItem, setActiveItem]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsDropdownOpen(false); // Close dropdown on mobile after selection
  };

  if (loading) {
    return (
      <div className="lg:hidden bg-white dark:bg-[#2A2C38] border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white mb-3">
            Qur'an Study - Preface
          </h1>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-12 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden bg-white dark:bg-[#2A2C38] border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white mb-3">
            Qur'an Study - Preface
          </h1>
          {error && (
            <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded">
              Using offline content due to connection issue
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#1A1C28] border border-gray-200 dark:border-gray-600 rounded-lg text-left text-black dark:text-white"
            >
              <span className="truncate">
                {activeItem?.title || "Select an article"}
              </span>
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
                      activeItem?.id === item.id
                        ? "bg-[#D9D9D9] dark:bg-gray-900 text-black dark:text-white font-medium"
                        : "text-gray-700 dark:text-white"
                    }`}
                  >
                    {item.title}
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
          {error && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
              Using offline content
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="py-2">
          {loading ? (
            <div className="space-y-2 px-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded"
                ></div>
              ))}
            </div>
          ) : (
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li key={index} className="flex justify-center">
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-[284px] text-left px-4 py-3 text-sm transition-all duration-200  ${
                      activeItem?.id === item.id
                        ? "bg-[#D9D9D9]  dark:border-0  text-black dark:bg-gray-900 dark:text-white font-medium"
                        : "border-l-transparent text-gray-700 dark:text-white hover:border-l-gray-300"
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </>
  );
};

export default QuranStudyNavbar;
