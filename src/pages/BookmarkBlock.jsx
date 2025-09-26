// import React from 'react';
// import { Trash2 } from 'lucide-react';
// import BookmarkNavbar from '../components/BookmarkNavbar';
// import StarNumber from '../components/StarNumber';

// const BookmarkBlock = () => {
//   const bookmarkedBlocks = [
//     { id: 1, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' },
//     { id: 2, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' },
//     { id: 3, number: 2, surah: 'Al-Baqarah', verses: 'Verses 1-7' }
//   ];

//   const handleDelete = (id) => {
//     // Handle delete functionality
//     console.log('Delete bookmark block with id:', id);
//   };

//   return (
//     <>
//     <BookmarkNavbar/>
//     <div className=" mx-auto min-h-screen p-6 bg-white dark:bg-black">
//     <div className="w-[1290px] mx-auto">

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {bookmarkedBlocks.map((block) => (
//           <div key={block.id} className="flex items-center justify-between p-4 bg-gray-50  rounded-lg border  dark:bg-black dark:text-white dark:hover:bg-gray-800 border-gray-200 hover:bg-gray-100 transition-colors">
//             {/* Left Section - Block Info */}
//             <div className="flex items-center space-x-4">
//               <div className="flex-shrink-0">
//                 {/* <span className="text-lg font-semibold text-gray-800 dark:text-white">{block.number}</span> */}
//                 <StarNumber number={block.number} />


//               </div>
//               <div>
//                 <h3 className="text-base font-medium text-gray-900 dark:text-white">{block.surah}</h3>
//                 <p className="text-sm text-gray-500">{block.verses}</p>
//               </div>
//             </div>

//             {/* Right Section - Delete Button */}
//             <button
//               onClick={() => handleDelete(block.id)}
//               className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
//               aria-label="Delete bookmark block"
//             >
//               <Trash2 size={18} />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//     </div>

//     </>

//   );
// };

// export default BookmarkBlock;

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import BookmarkNavbar from '../components/BookmarkNavbar';
import { ArrowLeft } from 'lucide-react';
import StarNumber from '../components/StarNumber';
import { useAuth } from '../context/AuthContext';
import BookmarkService from '../services/bookmarkService';

const BookmarkBlock = () => {
  const { user } = useAuth();
  const [bookmarkedBlocks, setBookmarkedBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      try {
        setLoading(true);
        const blocks = await BookmarkService.getBookmarks(user.uid, 'block');
        const mapped = blocks.map(b => ({
          id: b.id,
          number: b.surahId,
          surah: b.surahName || `Surah ${b.surahId}`,
          verses: `Verses ${b.blockFrom}-${b.blockTo}`
        }));
        setBookmarkedBlocks(mapped);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return;
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await BookmarkService.deleteBookmark(id, user.uid);
      setBookmarkedBlocks(prev => prev.filter(b => b.id !== id));
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
    <BookmarkNavbar/>
    <div className="mx-auto min-h-screen p-3 sm:p-4 lg:p-6 bg-white dark:bg-gray-900 font-poppins">
    <div className="w-full max-w-[1290px] mx-auto">

      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading bookmarks...</div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {bookmarkedBlocks.map((block) => (
          <div key={block.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 border-gray-200 hover:bg-gray-100 transition-colors">
            {/* Left Section - Block Info */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="flex-shrink-0">
                <StarNumber number={block.number} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">{block.surah}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{block.verses}</p>
              </div>
            </div>

            {/* Right Section - Delete Button */}
            <button
              onClick={() => handleDelete(block.id)}
              className="p-2 text-black dark:text-white dark:hover:bg-transparent hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ml-2"
              aria-label="Delete bookmark block"
            >
              {deleteLoading[block.id] ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b border-current"></div>
              ) : (
                <Trash2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              )}
            </button>
          </div>
        ))}
      </div>
      )}
    </div>
    </div>

    </>

  );
};

export default BookmarkBlock;