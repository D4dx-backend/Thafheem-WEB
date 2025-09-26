import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PAGE_RANGES_API } from "../api/apis";
import { listSurahNames } from "../api/apifunction";

const DemoItems = ({ onClose }) => {
  const [pageSearch, setPageSearch] = useState("");
  const [pages, setPages] = useState([]);
  const [surahNames, setSurahNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch page data from API
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch page ranges and surah names concurrently
        const [pageRangesResponse, surahNamesResponse] = await Promise.all([
          fetch(PAGE_RANGES_API),
          listSurahNames()
        ]);

        if (!pageRangesResponse.ok) {
          throw new Error(`HTTP error! status: ${pageRangesResponse.status}`);
        }

        const pageRanges = await pageRangesResponse.json();
        
        // Create surah names mapping
        const surahNamesMap = {};
        surahNamesResponse.forEach((surah) => {
          surahNamesMap[surah.id] = surah.english;
        });
        setSurahNames(surahNamesMap);

        // Process page ranges to create page list
        const pageMap = {};
        pageRanges.forEach((range) => {
          const pageId = range.PageId;
          if (!pageMap[pageId]) {
            pageMap[pageId] = {
              id: pageId,
              number: pageId,
              name: `Page ${pageId}`,
              surahs: [],
              startSurah: surahNamesMap[range.SuraId] || `Surah ${range.SuraId}`,
              startVerse: range.ayafrom,
              endVerse: range.ayato
            };
          }
          
          // Add surah info to this page
          const surahInfo = {
            surahId: range.SuraId,
            surahName: surahNamesMap[range.SuraId] || `Surah ${range.SuraId}`,
            startVerse: range.ayafrom,
            endVerse: range.ayato
          };
          
          // Check if this surah is already added to this page
          const existingSurah = pageMap[pageId].surahs.find(s => s.surahId === range.SuraId);
          if (!existingSurah) {
            pageMap[pageId].surahs.push(surahInfo);
          }
        });

        // Convert to array and sort by page number
        const pageList = Object.values(pageMap).sort((a, b) => a.number - b.number);
        setPages(pageList);

      } catch (err) {
        setError(err.message);
        console.error("Error loading page data:", err);
        
        // Fallback to hardcoded data if API fails
        const fallbackPages = Array.from({ length: 604 }, (_, index) => ({
          id: index + 1,
          number: index + 1,
          name: `Page ${index + 1}`,
          startSurah: index < 10 ? "Al-Fatihah" : index < 50 ? "Al-Baqarah" : "Various",
        }));
        setPages(fallbackPages);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // Filter pages based on search
  const filteredPages = pages.filter(
    (page) =>
      page.name.toLowerCase().includes(pageSearch.toLowerCase()) ||
      page.number.toString().includes(pageSearch) ||
      page.startSurah.toLowerCase().includes(pageSearch.toLowerCase())
  );

  // Handle page click navigation
  const handlePageClick = (page) => {
    // Navigate to the first surah on this page with specific verse range
    if (page.surahs && page.surahs.length > 0) {
      const firstSurah = page.surahs[0];
      const targetUrl = `/surah/${firstSurah.surahId}#verse-${firstSurah.startVerse}`;
      
      console.log('Page navigation:', {
        page: page.name,
        surah: firstSurah.surahName,
        surahId: firstSurah.surahId,
        startVerse: firstSurah.startVerse,
        endVerse: firstSurah.endVerse,
        targetUrl
      });
      
      // Navigate to the specific verse range on this page
      navigate(targetUrl);
    } else {
      // Fallback navigation
      navigate(`/surah/1`);
    }
    
    // Close the navigation modal
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-[#2A2C38] w-full  h-full flex flex-col  rounded-lg font-poppins">
        {/* Search Bar */}
        <div className="p-3">
          <input
            type="text"
            placeholder="Search Page"
            value={pageSearch}
            onChange={(e) => setPageSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-600 dark:bg-black dark:text-white bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 text-xs text-red-500">{error}</div>
        )}

        {/* Page List */}
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading pages...</p>
          ) : filteredPages.length > 0 ? (
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  onClick={() => handlePageClick(page)}
                  className="cursor-pointer text-gray-800 dark:text-white hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors py-2 px-2 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{page.name}</span>
                    {page.surahs && page.surahs.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {page.surahs[0].surahName}
                      </span>
                    )}
                  </div>
                  {page.surahs && page.surahs.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {page.surahs.length > 1 
                        ? `${page.surahs.length} surahs` 
                        : `Verse ${page.surahs[0].startVerse}-${page.surahs[0].endVerse}`
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No page found
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DemoItems;
