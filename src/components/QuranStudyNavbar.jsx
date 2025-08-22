import React, { useState } from 'react';

const QuranStudyNavbar = () => {
  const [activeItem, setActiveItem] = useState('Note');

  const navigationItems = [
    'Note',
    'An introduction to study of the Quran',
    'Unique book',
    'Some basic facts',
    'What kind of book?',
    'The basis of the Quran',
    'Theme and theme',
    'Pearls strung on a necklace',
    'Presentation stages',
    'Instruction book',
    'Why the repetition?',
    'Codification',
    'Book illustration'
  ];

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 shadow-lg h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-white text-black p-4 shadow-md">
        <h1 className="text-lg font-semibold">Qur'an Study - Preface</h1>
      </div>

      {/* Navigation List */}
      <nav className="py-2">
        <ul className="space-y-1">
          {navigationItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 hover:bg-gray-50 ${
                  activeItem === item
                    ? 'bg-green-50 border-l-green-500 text-black font-medium'
                    : 'border-l-transparent text-gray-700 hover:border-l-gray-300'
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

export default QuranStudyNavbar;