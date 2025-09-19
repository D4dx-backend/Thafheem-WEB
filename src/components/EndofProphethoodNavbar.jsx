import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EndofProphethoodNavbar = ({ activeSection, setActiveSection }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigationItems = [
    'The end of prophethood',
    'The meaning of Khatamunnabiyyin',
    "The Prophet's sayings regarding the end of the world",
    'The consensus of the Companions',
    'The consensus of religious scholars',
    'The Promised Messiah'
  ];

  const handleItemClick = (item) => {
    setActiveSection(item);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden bg-white dark:bg-[#2A2C38] border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white mb-3">End of Prophethood page</h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-left"
            >
              <span className="text-sm text-black dark:text-white truncate pr-2">
                {activeSection}
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
                      activeSection === item
                        ? 'bg-[#D9D9D9] dark:bg-gray-900 text-black dark:text-white font-medium'
                        : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
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
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200 shadow-lg h-screen overflow-y-auto dark:bg-[#2A2C38] m-4">
        {/* Header */}
        <div className="border-b border-gray-300 p-4">
          <h1 className="text-lg font-semibold text-black dark:text-white">End of Prophethood page</h1>
        </div>

        {/* Navigation List */}
        <nav className="py-2">
          <ul className="space-y-1">
            {navigationItems.map((item, index) => (
              <li key={index} className='flex justify-center'>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-[284px] text-left px-4 py-3 text-sm transition-all duration-200 ${
                    activeSection === item
                      ? 'bg-[#D9D9D9] dark:bg-gray-900 border-l-black text-black dark:text-white font-medium'
                      : 'border-l-transparent text-gray-700 hover:border-l-gray-400 dark:text-white'
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

export default EndofProphethoodNavbar;