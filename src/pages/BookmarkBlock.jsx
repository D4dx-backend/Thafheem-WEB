import React from 'react';
import { Trash2 } from 'lucide-react';
import BookmarkNavbar from '../components/BookmarkNavbar';
import StarNumber from '../components/StarNumber';

const BookmarkBlock = () => {
  const bookmarkedBlocks = [
    { id: 1, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' },
    { id: 2, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' },
    { id: 3, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' }
  ];

  const handleDelete = (id) => {
    // Handle delete functionality
    console.log('Delete bookmark block with id:', id);
  };

  return (
    <>
    <BookmarkNavbar/>
    <div className="w-full mx-auto min-h-screen p-6 bg-white dark:bg-black">
    <div className="max-w-6xl mx-auto">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarkedBlocks.map((block) => (
          <div key={block.id} className="flex items-center justify-between p-4 bg-gray-50  rounded-lg border  dark:bg-black dark:text-white dark:hover:bg-gray-800 border-gray-200 hover:bg-gray-100 transition-colors">
            {/* Left Section - Block Info */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {/* <span className="text-lg font-semibold text-gray-800 dark:text-white">{block.number}</span> */}
                <StarNumber number={block.number} />


              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">{block.surah}</h3>
                <p className="text-sm text-gray-500">{block.verses}</p>
              </div>
            </div>

            {/* Right Section - Delete Button */}
            <button
              onClick={() => handleDelete(block.id)}
              className="p-2 text-black hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Delete bookmark block"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>

    </>

  );
};

export default BookmarkBlock;