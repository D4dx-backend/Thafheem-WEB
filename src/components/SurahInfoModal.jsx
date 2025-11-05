import { useState, useEffect } from "react";
import { Copy, Share2 } from "lucide-react";
import { fetchCompleteSurahInfo } from "../api/apifunction";

const SurahInfoModal = ({ surahId, onClose }) => {
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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
      if (!surahId) return;
      
      try {
        setLoading(true);
        setError(null);
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

  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save the current overflow style
    const originalOverflow = document.body.style.overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore the original overflow style when modal closes
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Parse Thafheem content into sections if available
  const thafheemSections = surahInfo?.thafheem?.PrefaceText 
    ? parseContentSections(surahInfo.thafheem.PrefaceText)
    : [];

  // Function to get all content as formatted text
  const getAllContentAsText = () => {
    if (!surahInfo) return '';

    const surahName = surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`;
    const arabicName = surahInfo?.basic?.name_arabic || surahInfo?.surah?.arabic || '';
    
    let content = `${surahName}\n`;
    if (arabicName) {
      content += `${arabicName}\n\n`;
    }

    // Basic information
    content += `Revelation: ${surahInfo?.basic?.revelation_place || surahInfo?.thafheem?.SuraType || surahInfo?.surah?.type || 'Unknown'}\n`;
    content += `Revelation Order: ${surahInfo?.basic?.revelation_order || surahInfo?.thafheem?.RevOrder || 'Unknown'}\n`;
    content += `Verses: ${surahInfo?.basic?.verses_count || surahInfo?.thafheem?.TotalAyas || surahInfo?.surah?.ayahs || 'Unknown'}\n`;
    
    if (surahInfo?.thafheem) {
      content += `Thafheem Vol: ${surahInfo.thafheem.ThafVolume || 'Unknown'}\n`;
      content += `Type: ${surahInfo.thafheem.SuraType || 'Unknown'}\n`;
    }
    
    content += '\n';

    // Overview
    if (surahInfo?.detailed?.short_text) {
      content += `OVERVIEW\n`;
      content += `${cleanHtmlContent(surahInfo.detailed.short_text)}\n\n`;
    }

    // Detailed Information
    if (surahInfo?.detailed?.text) {
      content += `DETAILED INFORMATION\n`;
      content += `${cleanHtmlContent(surahInfo.detailed.text)}\n\n`;
    }

    // Thafheem Commentary
    if (thafheemSections.length > 0) {
      content += `THAFHEEM COMMENTARY\n\n`;
      thafheemSections.forEach((section) => {
        content += `${section.title}\n`;
        content += `${section.content}\n\n`;
      });
    }

    // Fallback basic info
    if (!surahInfo?.detailed?.text && thafheemSections.length === 0) {
      content += `BASIC INFORMATION\n\n`;
      if (surahInfo?.basic?.translated_name?.name) {
        content += `English Name: ${surahInfo.basic.translated_name.name}\n`;
      }
      if (surahInfo?.basic?.name_simple) {
        content += `Simple Name: ${surahInfo.basic.name_simple}\n`;
      }
      if (surahInfo?.basic?.revelation_place) {
        content += `Place of Revelation: ${surahInfo.basic.revelation_place}\n`;
      }
      if (surahInfo?.basic?.pages) {
        content += `Pages: ${surahInfo.basic.pages[0]} to ${surahInfo.basic.pages[1]}\n`;
      }
    }

    content += `\n— ${surahName} (Surah ${surahId})`;
    return content;
  };

  // Handle copy all content
  const handleCopyAll = async () => {
    const contentToCopy = getAllContentAsText();
    
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = contentToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
    }
  };

  // Handle share content
  const handleShare = async () => {
    const surahName = surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`;
    const shareText = getAllContentAsText();
    const shareUrl = `${window.location.origin}/surah/${surahId}`;

    const shareData = {
      title: `${surahName} - Surah Information`,
      text: shareText,
      url: shareUrl,
    };

    try {
      // Check if Web Share API is supported
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy shareable link to clipboard
        const shareableContent = `${shareText}\n\nRead more: ${shareUrl}`;
        await navigator.clipboard.writeText(shareableContent);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        // User cancelled the share dialog
        return;
      }

      console.error("Error sharing:", error);

      // Final fallback: Copy to clipboard
      try {
        const shareableContent = `${shareText}\n\nRead more: ${shareUrl}`;
        await navigator.clipboard.writeText(shareableContent);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (clipboardError) {
        console.error("Failed to copy to clipboard:", clipboardError);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4 sm:p-6 bg-gray-500/70 dark:bg-black/70"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-[#2A2C38] rounded-lg shadow-xl w-full max-w-xs sm:max-w-2xl lg:max-w-4xl xl:max-w-[1073px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {surahInfo?.basic?.name_simple || surahInfo?.surah?.name || `Surah ${surahId}`}
          </h2>
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            {!loading && !error && (
              <button
                onClick={handleCopyAll}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                title="Copy all content"
              >
                {copied ? (
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs text-green-500 font-medium hidden sm:inline">Copied!</span>
                  </div>
                ) : (
                  <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            )}

            {/* Share Button */}
            {!loading && !error && (
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Share surah information"
              >
                <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading Surah information...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
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
          ) : (
            <div className="font-poppins">
              {/* Arabic Title */}
              <div className="text-center mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 sm:pb-6">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SurahInfoModal;

