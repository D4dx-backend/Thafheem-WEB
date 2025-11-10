import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { fetchArticlesList } from '../api/apifunction';

const EndofProphethoodNavbar = ({ activeSection, setActiveSection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
const data = await fetchArticlesList();
setNavigationItems(data);

        // Set first item as active if none selected
        if (!activeSection && data.length > 0) {
setActiveSection(data[0]);
        }
      } catch (err) {
        console.error("Error loading articles:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleItemClick = (item) => {
    setActiveSection(item);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden bg-white dark:bg-[#2A2C38] border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white mb-3">
            End of Prophethood page
          </h1>
          {error && (
            <div className="mb-3 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded">
              Using offline content
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-left"
            >
              <span className="text-sm text-black dark:text-white truncate pr-2">
                {activeSection?.title || "Select an article"}
              </span>
              {isDropdownOpen ? (
                <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
              )}
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2A2C38] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {navigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                      activeSection?.aid === item.aid
                        ? 'bg-[#D9D9D9] dark:bg-gray-900 text-black dark:text-white font-medium'
                        : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
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
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 shadow-lg h-screen overflow-y-auto dark:bg-[#2A2C38] m-4">
        <div className="border-b border-gray-300 p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            End of Prophethood page
          </h1>
          {error && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
              Using offline content
            </div>
          )}
        </div>

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
                <li key={index} className='flex justify-center'>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-[284px] text-left px-4 py-3 text-sm transition-all duration-200 ${
                      activeSection?.aid === item.aid
                        ? 'bg-[#D9D9D9] dark:bg-gray-900 border-l-black text-black dark:text-white font-medium'
                        : 'border-l-transparent text-gray-700 hover:border-l-gray-400 dark:text-white'
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

export default EndofProphethoodNavbar;