import React, { useState } from 'react';

const EndofProphethoodNavbar = () => {
  const [activeItem, setActiveItem] = useState('The end of prophethood');

  const navigationItems = [
    'The end of prophethood',
    'The meaning of Khatamunnabiyyin',
    "The Prophet's sayings regarding the end of the world",
    'The consensus of the Companions',
    'The consensus of religious scholars',
    'The Promised Messiah'
  ];

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-lg h-screen overflow-y-auto dark:bg-[#2A2C38] m-4">
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
                className={`w-[284px] text-left px-4 py-3 text-sm transition-all duration-200   ${
                  activeItem === item
                    ? 'bg-[#D9D9D9] dark:bg-black  border-l-black text-black dark:text-white font-medium'
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
  );
};

export default EndofProphethoodNavbar;