import React, { useState, useEffect } from "react";
import HomepageNavbar from "../components/HomeNavbar";
import HomepageSearch from "../components/HomeSearch";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import StarNumber from "../components/StarNumber";
import { Play, Book, Circle, BookOpen, ArrowLeft } from "lucide-react";
import { surahNameUnicodes } from "../components/surahNameUnicodes";
import { fetchPageRanges } from "../api/apifunction";
//mee
const Juz = () => {
  // State management
  const [juzData, setJuzData] = useState([]);
  const [surahNames, setSurahNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { juzId } = useParams(); // Get Juz ID from URL if present

  const KaabaIcon = ({ className }) => (
    <svg
      viewBox="0 0 11 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 4.05096L5.50813 6.87531M1 4.05096L5.50813 1.22656L10.0017 4.05096M1 4.05096V5.72135M5.50813 12.2306L1 9.44877V5.72135M5.50813 12.2306L10.0017 9.44877V5.72135M5.50813 12.2306V8.52443M5.50813 6.87531L10.0017 4.05096M5.50813 6.87531V8.52443M10.0017 4.05096V5.72135M10.0017 5.72135L5.50813 8.52443M5.50813 8.52443L1 5.72135"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
  

  const madIcon = (
    <svg
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#3FA5C0] "
    >
      <path
        d="M5.625 1.0498C5.96379 1.0415 6.15318 1.43447 5.9375 1.69434L5.93848 1.69531C5.8059 1.85727 5.73354 2.06001 5.7334 2.26953C5.73364 2.7733 6.13675 3.17749 6.63965 3.17773C6.8485 3.17752 7.05247 3.1038 7.21484 2.9707C7.35907 2.84911 7.5516 2.85714 7.68555 2.94922C7.82703 3.0465 7.89339 3.22605 7.83203 3.42188C7.62359 4.1963 6.95559 4.74982 6.16699 4.82324V4.96973C6.38842 5.29376 6.73956 5.57803 7.17188 5.86035C7.39553 6.00639 7.63673 6.14949 7.88672 6.29688C8.13549 6.44354 8.39372 6.59442 8.64746 6.75391C9.69542 7.41265 10.702 8.26832 10.7217 9.86133C10.7302 10.5552 10.5894 11.4633 9.97949 12.293C10.3948 12.3364 10.7226 12.6925 10.7227 13.1182V13.9834C10.7235 14.202 10.5466 14.3792 10.3281 14.3789V14.3799H1.21582C0.998036 14.379 0.822454 14.2011 0.823242 13.9834V13.1182C0.823351 12.6643 1.19496 12.2891 1.65039 12.2891H8.89941C9.63381 11.6946 9.91674 10.8407 9.93359 9.86035C9.95344 8.7001 9.20568 8.05633 8.22656 7.4209C7.99002 7.26739 7.75176 7.12838 7.51562 6.99219C7.28064 6.85666 7.04583 6.72296 6.82227 6.58398C6.43649 6.34416 6.0728 6.08117 5.77148 5.74121C5.46708 6.08406 5.09223 6.35958 4.7002 6.60547C4.47252 6.74826 4.23591 6.88329 4.00293 7.0166C3.76878 7.15058 3.53754 7.28322 3.31543 7.42285C2.42056 7.98548 1.62622 8.63485 1.61133 9.86523C1.6014 10.6849 1.83171 11.2575 2.07324 11.6484H2.07227C2.13777 11.7504 2.15412 11.8634 2.12402 11.9678C2.0949 12.0686 2.02647 12.1474 1.94727 12.1963C1.86807 12.2451 1.76716 12.2711 1.66406 12.252C1.55623 12.2319 1.46123 12.1657 1.39941 12.0596V12.0586C1.0886 11.5539 0.816533 10.8308 0.823242 9.8623C0.83371 8.36129 1.75222 7.45412 2.89844 6.75293C3.41821 6.43497 3.92281 6.1624 4.37598 5.86426C4.80764 5.58025 5.15748 5.29245 5.37891 4.9668V4.72949C4.62425 4.47414 4.07622 3.76183 4.07617 2.9209C4.07617 2.19418 4.55355 1.26045 5.59473 1.05273L5.61035 1.0498H5.625ZM1.62207 13.0869C1.61745 13.0916 1.61137 13.1013 1.61133 13.1182V13.5908H9.93457V13.1182C9.93452 13.1022 9.92888 13.093 9.92383 13.0879C9.91879 13.0828 9.90931 13.0771 9.89355 13.0771H1.65039C1.63521 13.0771 1.6266 13.0825 1.62207 13.0869ZM4.95801 2.47852C4.89845 2.61488 4.86542 2.76443 4.86523 2.9209L4.87109 3.03613C4.92841 3.60447 5.40474 4.04371 5.98926 4.04395C6.14409 4.04376 6.29155 4.00941 6.42676 3.95117C5.66139 3.85413 5.05306 3.24442 4.95801 2.47852Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.35469"
      />
    </svg>
  );
  // Use this corrected useEffect (remove the first one):
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch page ranges data using the API function
        const pageRangesData = await fetchPageRanges();

        // Fetch surah names for mapping using the proxy
        const surahNamesResponse = await fetch("/api/thafheem/suranames/all");
        if (!surahNamesResponse.ok) {
          throw new Error(`HTTP error! status: ${surahNamesResponse.status}`);
        }
        const surahNamesData = await surahNamesResponse.json();

        // Create surah names mapping - FIXED TYPE MAPPING
        const surahNamesMap = {};
        surahNamesData.forEach((surah) => {
          surahNamesMap[surah.SuraID] = {
            name: surah.ESuraName,
            arabic: surah.ASuraName,
            type: surah.SuraType === "Makkan" ? "Makki" : "Madani", // FIXED: was "M", now "Makkan"
            totalAyas: surah.TotalAyas,
          };
        });
        setSurahNames(surahNamesMap);

        // Process and group page ranges by Juz
        const juzMap = {};

        pageRangesData.forEach((range) => {
          const juzId = range.juzid;
          const suraId = range.SuraId;

          if (!juzMap[juzId]) {
            juzMap[juzId] = {};
          }

          if (!juzMap[juzId][suraId]) {
            juzMap[juzId][suraId] = [];
          }

          juzMap[juzId][suraId].push({
            ayaFrom: range.ayafrom,
            ayaTo: range.ayato,
            pageId: range.PageId,
          });
        });

        // Transform to component format
        const transformedJuzData = [];
        Object.keys(juzMap).forEach((juzId) => {
          const juzSurahs = [];

          Object.keys(juzMap[juzId]).forEach((suraId) => {
            const ranges = juzMap[juzId][suraId];
            const surahInfo = surahNamesMap[parseInt(suraId)];

            if (surahInfo) {
              const ayaFrom = Math.min(...ranges.map((r) => r.ayaFrom));
              const ayaTo = Math.max(...ranges.map((r) => r.ayaTo));
              const ayaRange = `${ayaFrom}-${ayaTo}`;

              juzSurahs.push({
                number: parseInt(suraId),
                name: surahInfo.name,
                arabic: surahInfo.arabic,
                verses: ayaRange, // Use the actual verse range for this Juz
                type: surahInfo.type,
                ayahs: surahInfo.totalAyas,
                startVerse: ayaFrom, // Add start verse for navigation
                endVerse: ayaTo, // Add end verse for reference
              });
            }
          });

          juzSurahs.sort((a, b) => a.number - b.number);

          if (juzSurahs.length > 0) {
            transformedJuzData.push({
              id: parseInt(juzId),
              title: `Juz ${juzId}`,
              surahs: juzSurahs,
            });
          }
        });

        transformedJuzData.sort((a, b) => a.id - b.id);
        setJuzData(transformedJuzData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching juz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Split juz data into three columns for display (1-19, 20-28, 29-30)
  const getColumnData = (columnIndex) => {
    let result;
    if (columnIndex === 0) {
      // First column: Juz 1-19
      result = juzData.filter(juz => juz.id >= 1 && juz.id <= 19);
    } else if (columnIndex === 1) {
      // Second column: Juz 20-28
      result = juzData.filter(juz => juz.id >= 20 && juz.id <= 28);
    } else {
      // Third column: Juz 29-30
      result = juzData.filter(juz => juz.id >= 29 && juz.id <= 30);
    }
return result;
  };

  // Get current Juz data if juzId is provided
  const getCurrentJuz = () => {
    if (!juzId) return null;
    return juzData.find(juz => juz.id === parseInt(juzId));
  };

  // Handle juz click - navigate to first surah and verse of the selected Juz
  const handleJuzClick = (juzId) => {
    const selectedJuz = juzData.find((juz) => juz.id === juzId);
    if (selectedJuz && selectedJuz.surahs.length > 0) {
      const firstSurah = selectedJuz.surahs[0];
      
      // Extract the first verse number from the verses string (e.g., "142-252" -> 142)
      const firstVerse = firstSurah.verses.split('-')[0].split(',')[0].trim();
      const targetUrl = `/surah/${firstSurah.number}#verse-${firstVerse}?fromJuz=${juzId}`;
      
navigate(targetUrl);
    }
  };

  // Handle surah click within juz
  const handleSurahClick = (surahOrId) => {
    // Support both object (with verses) and plain id
    if (typeof surahOrId === 'object' && surahOrId !== null) {
      const firstVerse = surahOrId.startVerse ? String(surahOrId.startVerse) : '1';
      const targetUrl = `/surah/${surahOrId.number}#verse-${firstVerse}`;
navigate(targetUrl);
      return;
    }

    // Fallback: plain id
    navigate(`/surah/${surahOrId}`);
  };

  // Handle back to all Juz
  const handleBackToAllJuz = () => {
    navigate('/juz');
  };

  // Loading state
  if (loading) {
    return (
      <>
        <HomepageSearch />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading Juz data...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <HomepageSearch />
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 text-lg mb-4">
              Error loading juz data: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Get current Juz for individual page
  const currentJuz = getCurrentJuz();

  return (
    <>
      <HomepageSearch />
      <div className="min-h-screen bg-white dark:bg-gray-900 p-3 sm:p-4 mx-auto">
        <div className="w-full max-w-[1290px] mx-auto px-2 sm:px-4">
          {/* Header Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => navigate("/")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/"
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Surah
              </button>
              <button
                onClick={() => navigate("/juz")}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors min-h-[48px] flex items-center ${
                  location.pathname === "/juz" || location.pathname.startsWith("/juz/")
                    ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Juz
              </button>
            </div>
          </div>

          {/* Conditional Rendering: Individual Juz or All Juz Grid */}
          {currentJuz ? (
            /* Individual Juz Page */
            <div className="pt-4 sm:pt-6">
              {/* Back Button */}
              <div className="mb-4 sm:mb-6">
                <button
                  onClick={handleBackToAllJuz}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to All Juz</span>
                </button>
              </div>

              {/* Juz Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentJuz.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentJuz.surahs.length} Surahs in this Juz
                </p>
              </div>

              {/* Surah List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {currentJuz.surahs.map((surah, index) => (
                  <div
                    key={`${currentJuz.id}-${surah.number}-${index}`}
                    onClick={() => handleSurahClick(surah.number)}
                    className="bg-white dark:bg-[#323A3F] rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-4 sm:p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-cyan-500 dark:hover:border-cyan-400"
                  >
                    {/* Surah Card */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {/* Star Badge */}
                      <div className="flex-shrink-0">
                        <StarNumber
                          number={surah.number}
                          color="#E5E7EB"
                          textColor="#000"
                        />
                      </div>

                      {/* Surah Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {surah.name}
                        </h3>
                        
                        {/* Icons and Info */}
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                          {surah.type === "Makki" ? (
                            <KaabaIcon className="h-4 w-4 flex-shrink-0 text-[#3FA5C0]" />
                          ) : (
                            <div className="h-4 w-4 flex-shrink-0">
                              {madIcon}
                            </div>
                          )}

                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                          <BookOpen className="h-4 w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">
                            {surah.verses}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* All Juz Grid - panel style in 3 columns */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
              {/* Render three columns */}
              {[0, 1, 2].map((columnIndex) => (
                <div key={columnIndex} className="w-full">
                  {getColumnData(columnIndex).map((juz) => (
                    <div
                      key={juz.id}
                      className="bg-[#EBEEF0] dark:bg-[#323A3F] rounded-xl shadow-sm border-gray-100 overflow-hidden m-2 sm:m-4 w-full max-w-[400px] mx-auto lg:mx-0"
                    >
                      {/* Header */}
                      <div className="bg-[#EBEEF0] dark:bg-[#323A3F] dark:text-white px-3 sm:px-4 py-1 flex justify-between items-center">
                        <h3 className="text-sm font-medium font-poppins text-gray-700 dark:text-white">
                          {juz.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleJuzClick(juz.id)}
                          className="text-xs font-semibold font-poppins min-h-[28px] px-3 py-1 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                          Read Juz
                        </button>
                      </div>

                      {/* Surah List (no inner scroll) */}
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        {juz.surahs.map((surah, index) => (
                          <div
                            key={`${juz.id}-${surah.number}-${index}`}
                            onClick={() => handleSurahClick(surah)}
                            className="w-full min-h-[76px] flex flex-col p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white dark:bg-gray-900 hover:shadow-md hover:border-cyan-500 dark:hover:border-cyan-400 border border-transparent"
                          >
                            {/* Top Row: Number + English + Arabic */}
                            <div className="flex items-center justify-between">
                              {/* Left side: Number + Name + Icons */}
                              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                {/* Star Badge */}
                                <div className="flex-shrink-0">
                                  <StarNumber
                                    number={surah.number}
                                    color="#E5E7EB"
                                    textColor="#000"
                                  />
                                </div>

                                {/* Name + Icons stacked */}
                                <div className="flex flex-col min-w-0 flex-1">
                                  <h4 className="text-sm sm:text-[16px] font-poppins font-semibold text-gray-900 dark:text-white truncate">
                                    {surah.name}
                                  </h4>

                                  {/* Icons row (under name) */}
                                  <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500 dark:text-gray-400 mt-1">
                                    {surah.type === "Makki" ? (
                                      <KaabaIcon className="text-[#3FA5C0] h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    ) : (
                                      <div className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0">
                                        {madIcon}
                                      </div>
                                    )}

                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>

                                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium">
                                      {surah.verses}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Arabic name on the right */}
                              <div className="text-right flex-shrink-0 ml-2">
                                <p
                                  className="text-2xl sm:text-[30px] font-arabic text-gray-900 dark:text-white leading-tight"
                                  style={{ fontFamily: "SuraName, Amiri, serif" }}
                                >
                                  {surahNameUnicodes[surah.number]
                                    ? String.fromCharCode(
                                        parseInt(
                                          surahNameUnicodes[surah.number].replace("U+", ""),
                                          16
                                        )
                                      )
                                    : surah.arabic}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* No data state */}
          {juzData.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No Juz data available.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Juz;
