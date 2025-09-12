import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCompleteSurahInfo } from "../api/apifunction";

const SurahInfo = () => {
  const { surahId } = useParams(); // Get surah ID from URL
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to clean HTML content
  const cleanHtmlContent = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Extract text content (automatically removes all HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace and return
    return textContent.replace(/\s+/g, ' ').trim();
  };

  // Function to parse content into sections based on headings
  const parseContentSections = (htmlString) => {
    if (!htmlString) return [];
    
    const sections = [];
    
    // Split by h2 tags to create sections
    const parts = htmlString.split(/<h2[^>]*>/);
    
    parts.forEach((part, index) => {
      if (index === 0 && !part.includes('</h2>')) {
        // First part before any h2 tag
        if (part.trim()) {
          const cleanContent = cleanHtmlContent(part);
          if (cleanContent) {
            sections.push({
              title: 'Introduction',
              content: cleanContent
            });
          }
        }
      } else {
        // Parts that start after h2 tags
        const h2End = part.indexOf('</h2>');
        if (h2End !== -1) {
          const title = part.substring(0, h2End).trim();
          const content = part.substring(h2End + 5).trim();
          const cleanContent = cleanHtmlContent(content);
          
          if (title && cleanContent) {
            sections.push({
              title: cleanHtmlContent(title),
              content: cleanContent
            });
          }
        }
      }
    });
    
    return sections;
  };

  useEffect(() => {
    const loadSurahInfo = async () => {
      try {
        setLoading(true);
        const data = await fetchCompleteSurahInfo(surahId);
        setSurahInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSurahInfo();
  }, [surahId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Surah information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">
            Failed to load Surah information
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Parse Thafheem content into sections if available
  const thafheemSections = surahInfo?.thafheem?.PrefaceText 
    ? parseContentSections(surahInfo.thafheem.PrefaceText)
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white px-3 sm:px-4 lg:px-6 py-4 dark:bg-black">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link to={`/surah/${surahId}`}>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-3 sm:mr-4">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-white" />
            </button>
          </Link>
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
            {surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`}
          </h1>
        </div>
      </div>
 
      {/* Content */}
      <div className="w-full max-w-[1290px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Arabic Title */}
        <div className="text-center mb-6 sm:mb-8 border-b border-gray-200 dark:border-white pb-4 sm:pb-6 font-poppins">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-arabic text-black mb-4 sm:mb-6 dark:text-white px-2">
            {surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || `Surah ${surahId}`}
          </h2>
          
          <div>
            <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-15 gap-y-2 sm:gap-y-4 text-xs sm:text-sm text-center">
              <div>
                <span className="text-black dark:text-white">Revelation: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.revelation_place || 
                   surahInfo?.thafheem?.SuraType || 
                   surahInfo?.surah?.type || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-black dark:text-white">Revelation Order: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.revelation_order || surahInfo?.thafheem?.RevOrder || 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-black dark:text-white">Verses: </span>
                <span className="font-semibold text-black dark:text-white">
                  {surahInfo?.basic?.verses_count || 
                   surahInfo?.thafheem?.TotalAyas || 
                   surahInfo?.surah?.ayahs || 'Unknown'}
                </span>
              </div>
            </div>

            {surahInfo?.thafheem && (
              <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 md:gap-x-12 lg:gap-x-15 gap-y-2 sm:gap-y-4 mt-2 sm:mt-4">
                <div>
                  <span className="text-black dark:text-white text-xs sm:text-sm">Thafheem Vol: </span>
                  <span className="font-semibold text-black dark:text-white text-xs sm:text-sm">
                    {surahInfo.thafheem.ThafVolume || 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-black dark:text-white text-xs sm:text-sm">Type: </span>
                  <span className="font-semibold text-black dark:text-white text-xs sm:text-sm">
                    {surahInfo.thafheem.SuraType || 'Unknown'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="font-poppins">
          {/* Overview from Quran.com API */}
          {surahInfo?.detailed?.short_text && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0">
                {cleanHtmlContent(surahInfo.detailed.short_text)}
              </p>
            </div>
          )}

          {/* Detailed Information from Quran.com API */}
          {surahInfo?.detailed?.text && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Detailed Information
              </h3>
              <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0 space-y-4">
                {cleanHtmlContent(surahInfo.detailed.text).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Thafheem Commentary - Properly parsed sections */}
          {thafheemSections.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Thafheem Commentary
              </h3>
              <div className="space-y-6">
                {thafheemSections.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-cyan-500 mb-2 sm:mb-3">
                      {section.title}
                    </h4>
                    <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0">
                      {section.content.split('\n').filter(p => p.trim()).map((paragraph, pIndex) => (
                        <p key={pIndex} className="mb-3 sm:mb-4">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback content with basic info */}
          {!surahInfo?.detailed?.text && thafheemSections.length === 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-600 mb-3 sm:mb-4">
                Basic Information
              </h3>
              <div className="text-gray-700 leading-relaxed dark:text-white text-sm sm:text-base lg:text-lg px-1 sm:px-0 space-y-4">
                {surahInfo?.basic?.translated_name?.name && (
                  <p>
                    <strong>English Name:</strong> {surahInfo.basic.translated_name.name}
                  </p>
                )}
                {surahInfo?.basic?.name_simple && (
                  <p>
                    <strong>Simple Name:</strong> {surahInfo.basic.name_simple}
                  </p>
                )}
                {surahInfo?.basic?.revelation_place && (
                  <p>
                    <strong>Place of Revelation:</strong> {surahInfo.basic.revelation_place}
                  </p>
                )}
                {surahInfo?.basic?.pages && (
                  <p>
                    <strong>Pages:</strong> {surahInfo.basic.pages[0]} to {surahInfo.basic.pages[1]}
                  </p>
                )}
                
                {/* If no detailed info available */}
                {!surahInfo?.basic?.translated_name && (
                  <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Detailed information for this Surah is not available at the moment.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurahInfo;