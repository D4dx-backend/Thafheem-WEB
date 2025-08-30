import React, { useState } from "react";

const Verse = () => {
  const [surahSearch, setSurahSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");

  const verses = [
    { id: 1, surah: "Al-Fatihah", verse: 1 },
    { id: 2, surah: "Al-Fatihah", verse: 2 },
    { id: 3, surah: "Al-Fatihah", verse: 3 },
    { id: 4, surah: "Al-Fatihah", verse: 4 },
    { id: 5, surah: "Al-Fatihah", verse: 5 },
    { id: 6, surah: "Al-Fatihah", verse: 6 },
    { id: 7, surah: "Al-Fatihah", verse: 7 },
    { id: 8, surah: "Al-Baqarah", verse: 1 },
    { id: 9, surah: "Al-Baqarah", verse: 2 },
    { id: 10, surah: "Al-Baqarah", verse: 3 },
    { id: 11, surah: "Al-Baqarah", verse: 4 },
  ];

  const filteredVerses = verses.filter(
    (v) =>
      v.surah.toLowerCase().includes(surahSearch.toLowerCase()) &&
      (verseSearch === "" || v.verse.toString().includes(verseSearch))
  );

  return (
    <div className="bg-white dark:bg-[#2A2C38] w-full max-w-md h-96 flex flex-col shadow rounded-lg">
      {/* Search Bar */}
      <div className="p-3 flex space-x-2">
        <input
          type="text"
          placeholder="Search Surah"
          value={surahSearch}
          onChange={(e) => setSurahSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-50 dark:bg-black dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Verse"
          value={verseSearch}
          onChange={(e) => setVerseSearch(e.target.value)}
          className="w-24 px-4 py-2 text-sm text-gray-600 dark:bg-black dark:text-white bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Verse List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-3">
        {filteredVerses.length > 0 ? (
          <ul className="space-y-2">
            {filteredVerses.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-gray-800 dark:text-white hover:text-blue-600 transition-colors"
              >
                <span className="truncate">{item.surah}</span>
                <span>{item.verse}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            No verses found
          </p>
        )}
      </div>
    </div>
  );
};

export default Verse;
