import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listSurahVerseIndex } from "../api/apifunction";

const Verse = ({ onClose }) => {
  const [surahSearch, setSurahSearch] = useState("");
  const [verseSearch, setVerseSearch] = useState("");
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listSurahVerseIndex();
        setVerses(
          data.map((v) => ({ 
            id: v.id, 
            surah: v.english, 
            verse: v.verse,
            surahId: v.surahId 
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  

  const filteredVerses = verses.filter(
    (v) =>
      v.surah.toLowerCase().includes(surahSearch.toLowerCase()) &&
      (verseSearch === "" || v.verse.toString().includes(verseSearch))
  );

  const handleVerseClick = (verse) => {
    const targetUrl = `/surah/${verse.surahId}#verse-${verse.verse}`;
    
    // Check if we're already on the same surah
    const currentPath = window.location.pathname;
    const targetPath = `/surah/${verse.surahId}`;
    
    if (currentPath === targetPath) {
      // Same surah - force refresh to ensure scroll works
      window.location.href = targetUrl;
    } else {
      // Different surah - use normal navigation
      navigate(targetUrl);
    }
    
    // Close the navigation modal
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="bg-white dark:bg-[#2A2C38] w-full  h-full max-w-md  flex flex-col  rounded-lg font-poppins">
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

      {error && (
        <div className="px-4 text-xs text-red-500">{error}</div>
      )}

      <div className="overflow-y-auto overflow-x-hidden px-4 pb-3">
  {loading ? (
    <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
  ) : filteredVerses.length > 0 ? (
    <ul className="space-y-2">
      {filteredVerses.map((item, index) => (
        <li
          key={item.id}
          onClick={() => handleVerseClick(item)}
          className="flex justify-between text-gray-800 dark:text-white hover:text-blue-600 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2"
        >
          {/* SL No */}
          <span className="w-10 text-center">{index + 1}.</span>

          {/* Surah */}
          <span className="flex-1 truncate">{item.surah}</span>

          {/* Verse */}
          <span className="mr-10">{item.verse}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-400 text-center py-4">No verses found</p>
  )}
</div>

    </div>
  );
};

export default Verse;


