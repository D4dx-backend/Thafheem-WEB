import React from 'react';

const QuranStudyContent = ({ activeItem, onPlayAudio }) => {
  const getContentForItem = (item) => {
    // You can expand this to return different content based on the active item
    const contentMap = {
      "Note": "It is not my intention to mention here all the problems that may arise in the mind of the reader while studying the Qur'an. Because most of them arise only when a verse or chapter of the Qur'an comes into view, and the answers to them are given in the 'Tafheem-ul-Quran' in their respective contexts. Therefore, leaving aside such questions, I have dealt here only with comprehensive problems affecting the Holy Qur'an in general. I request the esteemed readers not to judge this introduction as 'incomplete' by reading it alone, but to read the entire book and then bring to my attention any question that needs to be answered, or if they find the answer to any question inadequate. -Abul-A'la Maududi",
      "An introduction to study of the Quran": "Content for introduction to study of the Quran...",
      "Unique book": "Content about the unique nature of the Quran...",
      // Add more content as needed
    };
    
    return contentMap[item] || `Content for ${item} will be displayed here.`;
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto dark:bg-[#2A2C38] lg:w-[711px] lg:h-[626px] lg:m-4 min-h-screen lg:min-h-0">
      {/* Content Header */}
      <div className="border-b border-gray-300 px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-semibold text-black dark:text-white">
            {activeItem}
          </h1>
          <button
            onClick={onPlayAudio}
            className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-[#2AA0BF] transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-[#1A1C28] rounded-lg"
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Play Audio</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-4 lg:px-6 py-6">
        <div className="max-w-4xl">
          <p className="text-black text-sm lg:text-base leading-relaxed dark:text-white">
            {getContentForItem(activeItem)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuranStudyContent;