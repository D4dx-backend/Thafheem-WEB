import React from 'react';
import { Trash2 } from 'lucide-react';
import BookmarkNavbar from '../components/BookmarkNavbar';

const BookInterpretations = () => {
  const ayahWiseInterpretations = [
    { id: 1, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' },
    { id: 2, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' },
    { id: 3, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' }
  ];

  const blockWiseInterpretations = [
    { id: 4, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' },
    { id: 5, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' },
    { id: 6, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' }
  ];

  const handleDelete = (id, type) => {
    // Handle delete functionality
    console.log(`Delete ${type} interpretation with id:`, id);
  };

  const renderInterpretationCard = (interpretation, type) => (
    <div
      key={interpretation.id}
      className="flex items-center justify-between p-4  dark:bg-black dark:text-white dark:hover:bg-gray-800 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    >
      {/* Left Section - Interpretation Info */}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{interpretation.number}</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">{interpretation.surah}</h3>
          <p className="text-sm text-gray-500 ">{interpretation.detail}</p>
        </div>
      </div>

      {/* Right Section - Delete Button */}
      <button
        onClick={() => handleDelete(interpretation.id, type)}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        aria-label="Delete interpretation bookmark"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      <BookmarkNavbar />
      <div className="w-full mx-auto min-h-screen p-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">

        <div className="space-y-8">
          {/* Ayah wise interpretations section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ayah wise interpretations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ayahWiseInterpretations.map((interpretation) =>
                renderInterpretationCard(interpretation, 'ayah-wise')
              )}
            </div>
          </div>

          {/* Block wise interpretations section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Block wise interpretations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockWiseInterpretations.map((interpretation) =>
                renderInterpretationCard(interpretation, 'block-wise')
              )}
            </div>
          </div>
        </div>
      </div>

      </div>
    </>
  );
};

export default BookInterpretations;
