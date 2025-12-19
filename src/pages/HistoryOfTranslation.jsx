import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamHistoryOfTranslation } from '../api/apifunction';

const HistoryOfTranslation = () => {
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
        const data = await fetchMalayalamHistoryOfTranslation();
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
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
              // Process image URLs - keep public folder paths as-is
              // This runs after HTML entities are decoded
              const processImageUrls = (html) => {
                if (!html) return html;
                
                // Get base path from Vite config (defaults to '/')
                const basePath = import.meta.env.BASE_URL || '/';
                
                let processed = html;
                
                // Pattern 1: Handle /articles/... paths (with or without quotes, with extra spaces)
                // Match: <img   src="/articles/..."> or <img src="/articles/..."> or <img src='/articles/...'>
                // Also handle unquoted: <img src=/articles/...>
                processed = processed.replace(
                  /src\s*=\s*["']?(\/articles\/[^"'\s>]+)["']?/gi,
                  (match, path) => {
                    // Normalize to src="/path" format (or with base path if configured)
                    const normalizedPath = basePath === '/' ? path : `${basePath}${path.substring(1)}`;
                    return `src="${normalizedPath}"`;
                  }
                );
                
                // Pattern 2: Handle articles/... (without leading slash) - add leading slash
                processed = processed.replace(
                  /src\s*=\s*["']?(articles\/[^"'\s>]+)["']?/gi,
                  (match, path) => {
                    // Skip if already absolute URL
                    if (path.startsWith('http://') || path.startsWith('https://')) {
                      return match;
                    }
                    // Add leading slash for public folder paths (or base path)
                    const normalizedPath = basePath === '/' ? `/${path}` : `${basePath}${path}`;
                    return `src="${normalizedPath}"`;
                  }
                );
                
                // Pattern 3: Handle other image paths that start with / (absolute paths)
                processed = processed.replace(
                  /src\s*=\s*["']?(\/[^"'\s>]+\.(png|jpg|jpeg|gif|webp|svg))["']?/gi,
                  (match, path) => {
                    // Skip if already absolute URL
                    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
                      return match;
                    }
                    // Normalize to src="/path" format (or with base path if configured)
                    const normalizedPath = basePath === '/' ? path : `${basePath}${path.substring(1)}`;
                    return `src="${normalizedPath}"`;
                  }
                );
                
                return processed;
              };

              // Process HTML to remove borders and clean up styling
              const processHtml = (html) => {
                if (!html) return html;
                
                // First, protect image tags by temporarily replacing them
                // Handle images with extra spaces and various formats (including <img   src=...>)
                const imagePlaceholders = [];
                let imageIndex = 0;
                
                // Match img tags with any amount of whitespace and attributes
                // This handles: <img src=...>, <img   src=...>, <img src=.../>, etc.
                let processed = html.replace(/<img\s+[^>]*(?:\/>|>)/gi, (match) => {
                  const placeholder = `__IMG_PLACEHOLDER_${imageIndex}__`;
                  imagePlaceholders.push(match);
                  imageIndex++;
                  return placeholder;
                });
                
                // Remove inline border styles
                processed = processed.replace(/\s*style=["'][^"']*border[^"']*["']/gi, '');
                processed = processed.replace(/\s*style=["'][^"']*outline[^"']*["']/gi, '');
                
                // Remove border attributes
                processed = processed.replace(/\s*border=["'][^"']*["']/gi, '');
                processed = processed.replace(/\s*border=\d+/gi, '');
                
                // Restore image tags in reverse order to avoid index conflicts
                for (let i = imagePlaceholders.length - 1; i >= 0; i--) {
                  processed = processed.replace(`__IMG_PLACEHOLDER_${i}__`, imagePlaceholders[i]);
                }
                
                return processed;
              };

              // Ensure content is a string and not escaped
              const ensureString = (value) => {
                if (!value) return '';
                if (typeof value !== 'string') return String(value);
                return value;
              };

              // Decode HTML entities FIRST before any other processing
              const decodeHtmlEntities = (html) => {
                if (!html) return html;
                if (typeof html !== 'string') return html;
                
                // Check if HTML is escaped (contains entities like &lt; or &gt;)
                if (html.includes('&lt;') || html.includes('&gt;') || html.includes('&amp;') || html.includes('&quot;')) {
                  // Use textarea to decode HTML entities while preserving the structure
                  const textarea = document.createElement('textarea');
                  textarea.innerHTML = html;
                  const decoded = textarea.value;
                  // If decoding didn't work, try manual replacement
                  if (decoded === html || decoded.includes('&lt;')) {
                    return html
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>')
                      .replace(/&amp;/g, '&')
                      .replace(/&quot;/g, '"')
                      .replace(/&#39;/g, "'")
                      .replace(/&#x27;/g, "'");
                  }
                  return decoded;
                }
                
                // If not escaped, return as-is
                return html;
              };

              // Get raw content and decode HTML entities first
              const titleContent = decodeHtmlEntities(ensureString(content.title));
              const textContent = decodeHtmlEntities(ensureString(content.text));
              
              // Process images, then clean HTML
              const processedTitle = titleContent ? processHtml(processImageUrls(titleContent)) : null;
              const processedText = processHtml(processImageUrls(textContent));

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
                  {/* Add styles to remove borders and format content */}
                  <style>{`
                    .prose * {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                    }
                    .prose p {
                      margin-bottom: 1rem;
                      border: none !important;
                      outline: none !important;
                    }
                    .prose img {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      object-fit: contain !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure images in paragraphs with thafheem class are displayed */
                    .prose p.thafheem img,
                    p.thafheem img,
                    .prose p.thafheem img[src*="/articles/"],
                    p.thafheem img[src*="/articles/"] {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure all images with /articles/ paths are visible */
                    .prose img[src*="/articles/"],
                    img[src*="/articles/"] {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Handle broken images gracefully */
                    .prose img[src=""],
                    .prose img:not([src]) {
                      display: none !important;
                    }
                    .prose strong {
                      font-weight: 600;
                      border: none !important;
                      outline: none !important;
                    }
                    .prose br {
                      border: none !important;
                      outline: none !important;
                    }
                    .prose a {
                      color: #0891b2;
                      text-decoration: none;
                    }
                    .prose a:hover {
                      text-decoration: underline;
                    }
                    .prose span.m1 {
                      display: block;
                      margin-top: 2rem;
                      text-align: right;
                      font-style: italic;
                    }
                    /* Remove any table borders if present */
                    .prose table,
                    .prose table td,
                    .prose table th {
                      border: none !important;
                      outline: none !important;
                    }
                    /* Remove any list borders */
                    .prose ul,
                    .prose ol,
                    .prose li {
                      border: none !important;
                      outline: none !important;
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

export default HistoryOfTranslation;


