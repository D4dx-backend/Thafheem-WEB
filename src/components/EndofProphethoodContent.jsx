import React, { useState, useEffect } from 'react';
import { fetchArticleById } from '../api/apifunction';

const EndofProphethoodContent = ({ onPlayAudio, activeSection, showPlayButton = true }) => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!activeSection?.aid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Loading article with ID:", activeSection.aid);
        const data = await fetchArticleById(activeSection.aid);
        console.log("Article data received:", data);
        setCurrentArticle(data);
      } catch (err) {
        console.error("Error loading article:", err);
        setError(err.message);
        setCurrentArticle({
          id: activeSection.aid,
          title: activeSection.title,
          matter: "Content not available offline. Please check your internet connection.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [activeSection]);

  return (
    <div className="flex-1 bg-white h-screen overflow-y-auto dark:bg-[#2A2C38] lg:m-4">
      <div className="border-b border-gray-300 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-black dark:text-white">
            {currentArticle?.title || activeSection?.title || "Select an article"}
          </h1>
          {showPlayButton && (
            <button
              onClick={onPlayAudio}
              className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 text-[#2AA0BF] hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors duration-200 rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Play Audio</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-5/6"></div>
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded">
                  Content loaded from offline cache
                </div>
              )}
              <p className="text-black text-sm sm:text-base  dark:text-white whitespace-pre-wrap">
                {currentArticle?.matter || "Please select an article to view its content."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndofProphethoodContent;