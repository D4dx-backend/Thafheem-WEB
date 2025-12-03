import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamTechnicalTerms } from '../api/apifunction';

const TechnicalTerms = () => {
  const navigate = useNavigate();
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isMalayalam) {
      setContent(null);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMalayalamTechnicalTerms();
        if (!isMounted) return;

        setContent(data);
        if (data.error) {
          setError('Unable to fetch content from the server.');
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load content. Please try again later.');
          setContent(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, [isMalayalam]);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button
          onClick={handleBack}
          className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}>
            {isMalayalam ? 'സാങ്കേതിക പദങ്ങൾ' : 'Technical Terms'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isMalayalam
              ? 'തഫ്ഹീമിന്റെ മലയാളം സ്രോതസുകളില്‍നിന്നുള്ള ഉള്ളടക്കം.'
              : 'Technical terms and definitions.'}
          </p>
          <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Malayalam content from API */}
        {isMalayalam && (
          <>
            {loading && (
              <div className="py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam">
                ഉള്ളടക്കം ലോഡുചെയ്യുന്നു...
              </div>
            )}

            {!loading && error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                {error}
              </div>
            )}

            {!loading && !error && (!content || !content.text) && (
              <div className="py-10 text-center text-gray-600 dark:text-gray-300 font-malayalam">
                ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല.
              </div>
            )}

            {!loading && !error && content && content.text && (() => {
              // Process image URLs - convert relative paths to absolute if needed
              const processImageUrls = (html) => {
                if (!html) return html;
                
                // Base URL for articles assets - adjust this to match your server setup
                const baseUrl = import.meta.env.PROD 
                  ? 'https://thafheem.net' 
                  : 'http://localhost:5000';
                
                // Replace relative image paths with absolute URLs
                return html.replace(
                  /src=["'](\/articles\/[^"']+)["']/g,
                  (match, path) => {
                    // If path already starts with http/https, keep it as is
                    if (path.startsWith('http://') || path.startsWith('https://')) {
                      return match;
                    }
                    // Convert relative path to absolute
                    return `src="${baseUrl}${path}"`;
                  }
                );
              };

              const processedTitle = content.title ? processImageUrls(content.title) : null;
              const processedText = processImageUrls(content.text);

              return (
                <div className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7">
                  {processedTitle && (
                    <div
                      className="mb-4 prose prose-lg dark:prose-invert max-w-none font-malayalam"
                      dangerouslySetInnerHTML={{ __html: processedTitle }}
                    />
                  )}
                  <div
                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam"
                    dangerouslySetInnerHTML={{ __html: processedText }}
                    style={{
                      lineHeight: 1.8,
                      textAlign: 'justify',
                    }}
                  />
                  {/* Add styles for images in tables */}
                  <style>{`
                    .sooji img.s-img {
                      max-width: 100%;
                      height: auto;
                    }
                    .sooji table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .sooji td {
                      padding: 8px;
                    }
                  `}</style>
                </div>
              );
            })()}
          </>
        )}

        {/* English/Other languages placeholder */}
        {!isMalayalam && (
          <div className="dark:text-white text-gray-800 leading-relaxed">
            <div className="prose prose-base dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                This section will be available soon. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalTerms;


