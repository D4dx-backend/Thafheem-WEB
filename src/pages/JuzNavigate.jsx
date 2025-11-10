import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJuzData } from "../api/apifunction";

const JuzNavigate = ({ onClose }) => {
  const [juzSearch, setJuzSearch] = useState("");
  const [juzData, setJuzData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Juz data from API
  useEffect(() => {
    const loadJuzData = async () => {
      try {
        setLoading(true);
        const data = await fetchJuzData();
setJuzData(data.juzData || []);
      } catch (error) {
        console.error('Error loading Juz data:', error);
        // Fallback to hardcoded data if API fails
        setJuzData(fallbackJuzList);
      } finally {
        setLoading(false);
      }
    };
    loadJuzData();
  }, []);

  // Fallback hardcoded Juz data (in case API fails)
  const fallbackJuzList = [
    { 
      id: 1, 
      title: "Juz 1", 
      surahs: [{ number: 1, name: "Al-Fatihah", verses: "1-7" }] 
    },
    { 
      id: 2, 
      title: "Juz 2", 
      surahs: [{ number: 2, name: "Al-Baqarah", verses: "142-252" }] 
    },
    { 
      id: 3, 
      title: "Juz 3", 
      surahs: [{ number: 2, name: "Al-Baqarah", verses: "253-286" }] 
    },
    { 
      id: 4, 
      title: "Juz 4", 
      surahs: [{ number: 3, name: "Al-Imran", verses: "93-200" }] 
    },
    { 
      id: 5, 
      title: "Juz 5", 
      surahs: [{ number: 4, name: "An-Nisa", verses: "24-147" }] 
    },
    { 
      id: 6, 
      title: "Juz 6", 
      surahs: [{ number: 4, name: "An-Nisa", verses: "148-176" }] 
    },
    { 
      id: 7, 
      title: "Juz 7", 
      surahs: [{ number: 5, name: "Al-Maidah", verses: "82-120" }] 
    },
    { 
      id: 8, 
      title: "Juz 8", 
      surahs: [{ number: 6, name: "Al-Anam", verses: "111-165" }] 
    },
    { 
      id: 9, 
      title: "Juz 9", 
      surahs: [{ number: 7, name: "Al-Araf", verses: "88-206" }] 
    },
    { 
      id: 10, 
      title: "Juz 10", 
      surahs: [{ number: 8, name: "Al-Anfal", verses: "41-75" }] 
    },
    { 
      id: 11, 
      title: "Juz 11", 
      surahs: [{ number: 9, name: "At-Tawbah", verses: "93-129" }] 
    },
    { 
      id: 12, 
      title: "Juz 12", 
      surahs: [{ number: 11, name: "Hud", verses: "6-123" }] 
    },
    { 
      id: 13, 
      title: "Juz 13", 
      surahs: [{ number: 12, name: "Yusuf", verses: "53-111" }] 
    },
    { 
      id: 14, 
      title: "Juz 14", 
      surahs: [{ number: 15, name: "Al-Hijr", verses: "1-99" }] 
    },
    { 
      id: 15, 
      title: "Juz 15", 
      surahs: [{ number: 17, name: "Al-Isra", verses: "1-111" }] 
    },
    { 
      id: 16, 
      title: "Juz 16", 
      surahs: [{ number: 18, name: "Al-Kahf", verses: "75-110" }] 
    },
    { 
      id: 17, 
      title: "Juz 17", 
      surahs: [{ number: 21, name: "Al-Anbya", verses: "1-112" }] 
    },
    { 
      id: 18, 
      title: "Juz 18", 
      surahs: [{ number: 23, name: "Al-Muminun", verses: "1-118" }] 
    },
    { 
      id: 19, 
      title: "Juz 19", 
      surahs: [{ number: 25, name: "Al-Furqan", verses: "21-77" }] 
    },
    { 
      id: 20, 
      title: "Juz 20", 
      surahs: [{ number: 27, name: "An-Naml", verses: "56-93" }] 
    },
    { 
      id: 21, 
      title: "Juz 21", 
      surahs: [{ number: 29, name: "Al-Ankabut", verses: "46-69" }] 
    },
    { 
      id: 22, 
      title: "Juz 22", 
      surahs: [{ number: 33, name: "Al-Ahzab", verses: "31-73" }] 
    },
    { 
      id: 23, 
      title: "Juz 23", 
      surahs: [{ number: 36, name: "Ya-Sin", verses: "28-83" }] 
    },
    { 
      id: 24, 
      title: "Juz 24", 
      surahs: [{ number: 39, name: "Az-Zumar", verses: "32-75" }] 
    },
    { 
      id: 25, 
      title: "Juz 25", 
      surahs: [{ number: 41, name: "Fussilat", verses: "47-54" }] 
    },
    { 
      id: 26, 
      title: "Juz 26", 
      surahs: [{ number: 46, name: "Al-Ahqaf", verses: "1-35" }] 
    },
    { 
      id: 27, 
      title: "Juz 27", 
      surahs: [{ number: 51, name: "Adh-Dhariyat", verses: "31-60" }] 
    },
    { 
      id: 28, 
      title: "Juz 28", 
      surahs: [{ number: 58, name: "Al-Mujadalah", verses: "1-22" }] 
    },
    { 
      id: 29, 
      title: "Juz 29", 
      surahs: [{ number: 67, name: "Al-Mulk", verses: "1-30" }] 
    },
    { 
      id: 30, 
      title: "Juz 30", 
      surahs: [{ number: 78, name: "An-Naba", verses: "1-40" }] 
    },
  ];

  // filter by juz number or name
  const filteredJuz = (juzData.length > 0 ? juzData : fallbackJuzList).filter(
    (juz) =>
      juz.title?.toLowerCase().includes(juzSearch.toLowerCase()) ||
      juz.name?.toLowerCase().includes(juzSearch.toLowerCase()) ||
      juz.id?.toString().includes(juzSearch) ||
      juz.number?.toString().includes(juzSearch)
  );

  const handleJuzClick = (juz) => {
// Navigate to the first surah and verse of this Juz
    if (juz.surahs && juz.surahs.length > 0) {
      const firstSurah = juz.surahs[0];
// Extract the first verse number from the verses string (e.g., "142-252" -> 142)
      const firstVerse = firstSurah.verses.split('-')[0].split(',')[0].trim();
      const targetUrl = `/surah/${firstSurah.number}#verse-${firstVerse}`;
      
navigate(targetUrl);
    } else {
      // Fallback: navigate to Juz page if no surah data
navigate(`/juz/${juz.id}`);
    }
    
    // Close the navigation modal
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="bg-white w-full h-full dark:bg-[#2A2C38]  flex flex-col  rounded-lg font-poppins">
        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search juz"
            value={juzSearch}
            onChange={(e) => setJuzSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-600 dark:bg-black dark:text-white bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Juz List */}
        <div className="flex-1 overflow-y-auto px-4 pb-3 ">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading Juz data...</p>
          ) : filteredJuz.length > 0 ? (
            <div className="space-y-2">
              {filteredJuz.map((juz) => (
                <div
                  key={juz.id}
                  onClick={() => handleJuzClick(juz)}
                  className="cursor-pointer text-gray-800 dark:text-white hover:text-blue-600 transition-colors py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  {juz.title || juz.name}
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