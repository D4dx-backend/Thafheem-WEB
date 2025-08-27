import React from "react";
import { Trash2 } from "lucide-react";
import BookmarkNavbar from "../components/BookmarkNavbar";

const BookVerse = () => {
  const bookmarkedVerses = [
    { id: 1, number: 2, surah: "Al-Baqarah", ayah: "Ayah 1" },
    { id: 2, number: 2, surah: "Al-Baqarah", ayah: "Ayah 1" },
    { id: 3, number: 2, surah: "Al-Baqarah", ayah: "Ayah 1" },
  ];

  const handleDelete = (id) => {
    // Handle delete functionality
    console.log("Delete bookmark with id:", id);
  };

  return (
    <>
      <BookmarkNavbar />
      <div className="w-full mx-auto p-6 min-h-screen bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedVerses.map((verse) => (
            <div
              key={verse.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black dark:hover:bg-gray-800 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {/* Left Section - Verse Info */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {verse.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {verse.surah}
                  </h3>
                  <p className="text-sm text-gray-500">{verse.ayah}</p>
                </div>
              </div>

              {/* Right Section - Delete Button */}
              <button
                onClick={() => handleDelete(verse.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                aria-label="Delete bookmark"
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

export default BookVerse;
