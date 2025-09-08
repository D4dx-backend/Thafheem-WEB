// import React from 'react';
// import { Trash2 } from 'lucide-react';
// import BookmarkNavbar from '../components/BookmarkNavbar';
// import StarNumber from '../components/StarNumber';

// const BookInterpretations = () => {
//   const ayahWiseInterpretations = [
//     { id: 1, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' },
//     { id: 2, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' },
//     { id: 3, number: 2, surah: 'Al-Baqarah', detail: 'Verse number: 1' }
//   ];

//   const blockWiseInterpretations = [
//     { id: 4, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' },
//     { id: 5, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' },
//     { id: 6, number: 2, surah: 'Al-Baqarah', detail: 'Interpretation number: 2-1' }
//   ];

//   const handleDelete = (id, type) => {
//     // Handle delete functionality
//     console.log(`Delete ${type} interpretation with id:`, id);
//   };

//   const renderInterpretationCard = (interpretation, type) => (
//     <div
//       key={interpretation.id}
//       className="flex items-center justify-between p-4  dark:bg-black dark:text-white dark:hover:bg-gray-800 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
//     >
//       {/* Left Section - Interpretation Info */}
//       <div className="flex items-center space-x-4">
//         <div className="flex-shrink-0">
//           {/* <span className="text-lg font-semibold text-gray-800 dark:text-white">{interpretation.number}</span> */}
//           <StarNumber number={interpretation.number} />

//         </div>
//         <div>
//           <h3 className="text-base font-medium text-gray-900 dark:text-white">{interpretation.surah}</h3>
//           <p className="text-sm text-gray-500 ">{interpretation.detail}</p>
//         </div>
//       </div>

//       {/* Right Section - Delete Button */}
//       <button
//         onClick={() => handleDelete(interpretation.id, type)}
//         className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
//         aria-label="Delete interpretation bookmark"
//       >
//         <Trash2 size={18} />
//       </button>
//     </div>
//   );

//   return (
//     <>
//       <BookmarkNavbar />
//       <div className=" mx-auto min-h-screen p-6 bg-white dark:bg-black">
//       <div className="w-[1290px] mx-auto">

//         <div className="space-y-8">
//           {/* Ayah wise interpretations section */}
//           <div>
//             <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Ayah wise interpretations</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ayahWiseInterpretations.map((interpretation) =>
//                 renderInterpretationCard(interpretation, 'ayah-wise')
//               )}
//             </div>
//           </div>

//           {/* Block wise interpretations section */}
//           <div>
//             <h2 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Block wise interpretations</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {blockWiseInterpretations.map((interpretation) =>
//                 renderInterpretationCard(interpretation, 'block-wise')
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       </div>
//     </>
//   );
// };

// export default BookInterpretations;


import React from 'react';
import { Trash2 } from 'lucide-react';
import BookmarkNavbar from '../components/BookmarkNavbar';
import StarNumber from '../components/StarNumber';

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
      className="flex items-center justify-between p-3 sm:p-4 dark:bg-black dark:text-white dark:hover:bg-gray-800 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
    >
      {/* Left Section - Interpretation Info */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <StarNumber number={interpretation.number} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{interpretation.surah}</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{interpretation.detail}</p>
        </div>
      </div>

      {/* Right Section - Delete Button */}
      <button
        onClick={() => handleDelete(interpretation.id, type)}
        className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ml-2"
        aria-label="Delete interpretation bookmark"
      >
        <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );

  return (
    <>
      <BookmarkNavbar />
      <div className="mx-auto min-h-screen p-3 sm:p-4 lg:p-6 bg-white dark:bg-black">
      <div className="w-full max-w-[1290px] mx-auto">

        <div className="space-y-6 sm:space-y-8">
          {/* Ayah wise interpretations section */}
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 sm:mb-4 dark:text-white">Ayah wise interpretations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {ayahWiseInterpretations.map((interpretation) =>
                renderInterpretationCard(interpretation, 'ayah-wise')
              )}
            </div>
          </div>

          {/* Block wise interpretations section */}
          <div>
            <h2 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-3 sm:mb-4 dark:text-white">Block wise interpretations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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