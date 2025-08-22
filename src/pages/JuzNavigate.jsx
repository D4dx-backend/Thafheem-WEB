import React, { useState } from "react";

const JuzNavigate = () => {
  const [juzSearch, setJuzSearch] = useState("");

  const juzList = [
    { id: 1, number: 1, name: "Juz 1", startSurah: "Al-Fatihah", startVerse: 1 },
    { id: 2, number: 2, name: "Juz 2", startSurah: "Al-Baqarah", startVerse: 142 },
    { id: 3, number: 3, name: "Juz 3", startSurah: "Al-Baqarah", startVerse: 253 },
    { id: 4, number: 4, name: "Juz 4", startSurah: "Al-Imran", startVerse: 93 },
    { id: 5, number: 5, name: "Juz 5", startSurah: "An-Nisa", startVerse: 24 },
    { id: 6, number: 6, name: "Juz 6", startSurah: "An-Nisa", startVerse: 148 },
    { id: 7, number: 7, name: "Juz 7", startSurah: "Al-Maidah", startVerse: 82 },
    { id: 8, number: 8, name: "Juz 8", startSurah: "Al-Anam", startVerse: 111 },
    { id: 9, number: 9, name: "Juz 9", startSurah: "Al-Araf", startVerse: 88 },
    { id: 10, number: 10, name: "Juz 10", startSurah: "Al-Anfal", startVerse: 41 },
    { id: 11, number: 11, name: "Juz 11", startSurah: "At-Tawbah", startVerse: 93 },
    { id: 12, number: 12, name: "Juz 12", startSurah: "Hud", startVerse: 6 },
    { id: 13, number: 13, name: "Juz 13", startSurah: "Yusuf", startVerse: 53 },
    { id: 14, number: 14, name: "Juz 14", startSurah: "Al-Hijr", startVerse: 1 },
    { id: 15, number: 15, name: "Juz 15", startSurah: "Al-Isra", startVerse: 1 },
    { id: 16, number: 16, name: "Juz 16", startSurah: "Al-Kahf", startVerse: 75 },
    { id: 17, number: 17, name: "Juz 17", startSurah: "Al-Anbya", startVerse: 1 },
    { id: 18, number: 18, name: "Juz 18", startSurah: "Al-Muminun", startVerse: 1 },
    { id: 19, number: 19, name: "Juz 19", startSurah: "Al-Furqan", startVerse: 21 },
    { id: 20, number: 20, name: "Juz 20", startSurah: "An-Naml", startVerse: 56 },
    { id: 21, number: 21, name: "Juz 21", startSurah: "Al-Ankabut", startVerse: 46 },
    { id: 22, number: 22, name: "Juz 22", startSurah: "Al-Ahzab", startVerse: 31 },
    { id: 23, number: 23, name: "Juz 23", startSurah: "Ya-Sin", startVerse: 28 },
    { id: 24, number: 24, name: "Juz 24", startSurah: "Az-Zumar", startVerse: 32 },
    { id: 25, number: 25, name: "Juz 25", startSurah: "Fussilat", startVerse: 47 },
    { id: 26, number: 26, name: "Juz 26", startSurah: "Al-Ahqaf", startVerse: 1 },
    { id: 27, number: 27, name: "Juz 27", startSurah: "Adh-Dhariyat", startVerse: 31 },
    { id: 28, number: 28, name: "Juz 28", startSurah: "Al-Mujadalah", startVerse: 1 },
    { id: 29, number: 29, name: "Juz 29", startSurah: "Al-Mulk", startVerse: 1 },
    { id: 30, number: 30, name: "Juz 30", startSurah: "An-Naba", startVerse: 1 },
  ];

  // filter by juz number or name
  const filteredJuz = juzList.filter(
    (juz) =>
      juz.name.toLowerCase().includes(juzSearch.toLowerCase()) ||
      juz.number.toString().includes(juzSearch) ||
      juz.startSurah.toLowerCase().includes(juzSearch.toLowerCase())
  );

  return (
    <>
      <div className="bg-white w-90 max-h-96 flex flex-col shadow rounded-lg">
        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search juz"
            value={juzSearch}
            onChange={(e) => setJuzSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Juz List */}
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          {filteredJuz.length > 0 ? (
            <div className="space-y-2">
              {filteredJuz.map((juz) => (
                <div
                  key={juz.id}
                  className="cursor-pointer text-gray-800 hover:text-blue-600 transition-colors py-1"
                >
                  {juz.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No juz found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default JuzNavigate;