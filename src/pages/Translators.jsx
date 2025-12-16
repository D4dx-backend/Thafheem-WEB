import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamTranslators } from '../api/apifunction';

const Translators = () => {
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
        const data = await fetchMalayalamTranslators();
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
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8 overflow-x-hidden">
        {/* Back */}
        <button
          onClick={handleBack}
          className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4"
        >
          ← Back
        </button>

       

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
              // Translator name mapping based on image filenames
              const translatorNames = {
                "tk.png": "ടി.കെ. ഉബൈദ്",
                "tka.png": "ടി.കെ. അബ്ദുള്ള",
                "ti.png": "ടി. ഇസ്ഹാഖ്",
                "vk.png": "വി.കെ. അലി"
              };

              // Process image URLs - keep public folder paths as-is
              const processImageUrls = (html) => {
                if (!html) return html;
                
                // Base URL for server-side assets (only for non-public paths)
                const baseUrl = import.meta.env.PROD 
                  ? 'https://thafheem.net' 
                  : 'http://localhost:5000';
                
                let processed = html;
                
                // Pattern 1: /articles/... paths are in public folder, keep as-is
                // These paths work directly without base URL modification
                processed = processed.replace(
                  /src=["'](\/articles\/[^"']+)["']/gi,
                  (match, path) => {
                    // If path already starts with http/https, keep it as is
                    if (path.startsWith('http://') || path.startsWith('https://')) {
                      return match;
                    }
                    // Keep /articles/ paths as-is since they're in public folder
                    // Just ensure proper quote handling
                    const quote = match.includes("'") ? "'" : '"';
                    return `src=${quote}${path}${quote}`;
                  }
                );
                
                // Pattern 2: articles/... (without leading slash) - add leading slash
                processed = processed.replace(
                  /src=["'](articles\/[^"']+)["']/gi,
                  (match, path) => {
                    if (path.startsWith('http://') || path.startsWith('https://')) {
                      return match;
                    }
                    const quote = match.includes("'") ? "'" : '"';
                    // Add leading slash for public folder paths
                    return `src=${quote}/${path}${quote}`;
                  }
                );
                
                // Pattern 3: Handle other image paths that might need server URL
                // Only process paths that don't start with / (relative paths from server)
                processed = processed.replace(
                  /src=["']([^"']*\.(png|jpg|jpeg|gif|webp|svg))["']/gi,
                  (match, path) => {
                    // Skip if already absolute URL
                    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
                      return match;
                    }
                    // Skip if already starts with / (public folder or absolute path)
                    if (path.startsWith('/')) {
                      return match;
                    }
                    // Skip if already processed (starts with baseUrl)
                    if (path.startsWith(baseUrl)) {
                      return match;
                    }
                    // For relative paths without /, they might need base URL
                    // But typically these should be kept as-is for browser resolution
                    return match;
                  }
                );
                
                return processed;
              };

              // Clean and fix malformed HTML
              const fixMalformedHtml = (html) => {
                if (!html) return html;
                
                let fixed = html;
                
                // First, protect image tags by temporarily replacing them
                const imagePlaceholders = [];
                let imageIndex = 0;
                fixed = fixed.replace(/<img[^>]*>/gi, (match) => {
                  const placeholder = `__IMG_PLACEHOLDER_${imageIndex}__`;
                  imagePlaceholders.push(match);
                  imageIndex++;
                  return placeholder;
                });
                
                // Fix unclosed or improperly closed p tags
                // Remove closing </p> tags that don't have matching opening tags
                // First, let's count opening and closing p tags
                const openP = (fixed.match(/<p[^>]*>/gi) || []).length;
                const closeP = (fixed.match(/<\/p>/gi) || []).length;
                
                // If there are more closing tags than opening, remove extra closing tags
                if (closeP > openP) {
                  const diff = closeP - openP;
                  let removed = 0;
                  fixed = fixed.replace(/<\/p>/gi, (match) => {
                    if (removed < diff) {
                      removed++;
                      return '';
                    }
                    return match;
                  });
                }
                
                // Ensure all content is wrapped in proper p tags
                // If content starts without a p tag, wrap it
                if (!fixed.trim().startsWith('<')) {
                  fixed = '<p>' + fixed;
                }
                
                // If content ends without a closing p tag, add it
                if (!fixed.trim().endsWith('</p>') && !fixed.trim().endsWith('>')) {
                  fixed = fixed + '</p>';
                }
                
                // Fix cases where </p> appears without opening tag at the start
                fixed = fixed.replace(/^[\s\n]*<\/p>[\s\n]*/gi, '');
                
                // Fix cases where content has </p> followed by content without <p>
                fixed = fixed.replace(/<\/p>[\s\n]*(?=[^<])/gi, '</p><p>');
                
                // Handle content wrapped in divs - but preserve images
                // Only convert divs that don't contain images
                fixed = fixed.replace(/<div[^>]*>([^<]*?)(?!<img)([^<]+)<\/div>/gi, '<p>$1$2</p>');
                
                // Ensure proper structure: wrap orphaned content in p tags
                // Split by </p> and ensure each section is properly wrapped
                const parts = fixed.split('</p>');
                const wrappedParts = parts.map((part, index) => {
                  const trimmed = part.trim();
                  if (!trimmed) return '';
                  
                  // Check if this part contains an image placeholder
                  const hasImagePlaceholder = trimmed.includes('__IMG_PLACEHOLDER_');
                  
                  // If this part doesn't start with a tag, it needs wrapping
                  if (!trimmed.startsWith('<')) {
                    return '<p>' + trimmed + (index < parts.length - 1 ? '</p>' : '');
                  }
                  
                  // If it starts with a tag but not <p>, check if it's an image placeholder or other self-closing tag
                  if (!trimmed.match(/^<p[^>]*>/i) && 
                      !trimmed.match(/^<div[^>]*>/i) && 
                      !trimmed.match(/^<strong[^>]*>/i) && 
                      !trimmed.match(/^<br[^>]*>/i) &&
                      !hasImagePlaceholder) {
                    // If it contains an image placeholder, don't wrap it - images can be in paragraphs
                    if (hasImagePlaceholder) {
                      return trimmed + (index < parts.length - 1 ? '</p>' : '');
                    }
                    return '<p>' + trimmed + (index < parts.length - 1 ? '</p>' : '');
                  }
                  
                  return trimmed + (index < parts.length - 1 ? '</p>' : '');
                });
                
                fixed = wrappedParts.join('');
                
                // Final cleanup: remove empty p tags
                fixed = fixed.replace(/<p[^>]*>[\s\n]*<\/p>/gi, '');
                
                // Remove empty divs
                fixed = fixed.replace(/<div[^>]*>[\s\n]*<\/div>/gi, '');
                
                // Restore image tags in reverse order to avoid index conflicts
                for (let i = imagePlaceholders.length - 1; i >= 0; i--) {
                  fixed = fixed.replace(`__IMG_PLACEHOLDER_${i}__`, imagePlaceholders[i]);
                }
                
                return fixed;
              };

              // Process HTML to remove borders and clean up styling
              const processHtml = (html) => {
                if (!html) return html;
                
                let processed = html;
                
                // First fix malformed HTML
                processed = fixMalformedHtml(processed);
                
                // Add translator names above images
                // Process each translator image - wrap images that aren't already in a wrapper
                Object.keys(translatorNames).forEach(filename => {
                  const translatorName = translatorNames[filename];
                  const escapedFilename = filename.replace('.', '\\.');
                  
                  // Match img tags that contain the filename and are NOT already inside translator-name-wrapper
                  // Negative lookbehind equivalent: match img tags not preceded by translator-name-wrapper opening
                  const imgRegex = new RegExp(`(<img([^>]*?)src=["']([^"']*?)${escapedFilename}([^"']*?)["']([^>]*?)>)`, 'gi');
                  
                  // First, find all image matches with their positions
                  const imageMatches = [];
                  let match;
                  const tempProcessed = processed;
                  while ((match = imgRegex.exec(tempProcessed)) !== null) {
                    imageMatches.push({
                      fullMatch: match[0],
                      index: match.index
                    });
                  }
                  
                  // Process in reverse order to maintain correct indices
                  for (let i = imageMatches.length - 1; i >= 0; i--) {
                    const { fullMatch, index } = imageMatches[i];
                    
                    // Check if already wrapped by examining context before the image
                    const contextBefore = tempProcessed.substring(Math.max(0, index - 300), index);
                    // Simple check: if we see translator-name-wrapper and translator name nearby, likely wrapped
                    if (contextBefore.includes('translator-name-wrapper') && contextBefore.includes(translatorName)) {
                      // More precise: check if there's an unclosed wrapper div
                      const lastWrapperIdx = contextBefore.lastIndexOf('translator-name-wrapper');
                      const lastDivCloseIdx = contextBefore.lastIndexOf('</div>');
                      if (lastWrapperIdx > lastDivCloseIdx) {
                        continue; // Already wrapped, skip this image
                      }
                    }
                    
                    // Wrap the image
                    const wrapped = `<div class="translator-name-wrapper"><div class="translator-name">${translatorName}</div>${fullMatch}</div>`;
                    processed = processed.substring(0, index) + wrapped + processed.substring(index + fullMatch.length);
                  }
                });
                
                // Remove inline border styles
                processed = processed.replace(/\s*style=["'][^"']*border[^"']*["']/gi, '');
                processed = processed.replace(/\s*style=["'][^"']*outline[^"']*["']/gi, '');
                
                // Remove border attributes
                processed = processed.replace(/\s*border=["'][^"']*["']/gi, '');
                processed = processed.replace(/\s*border=\d+/gi, '');
                
                // Remove text-align styles that might interfere
                processed = processed.replace(/\s*style=["'][^"']*text-align[^"']*["']/gi, '');
                
                // Convert @ separators to visual dividers
                processed = processed.replace(/@\s*/g, '<div class="translator-separator"></div>');
                
                // Remove excessive blank lines and empty paragraphs between translator entries
                // Replace multiple consecutive <p></p> or <p> </p> with single spacing
                processed = processed.replace(/<p[^>]*>[\s\n]*<\/p>/gi, '');
                processed = processed.replace(/(<\/p>)\s*(<p[^>]*>)/gi, '$1$2');
                
                // Remove multiple consecutive line breaks and whitespace
                processed = processed.replace(/\n{3,}/g, '\n\n');
                processed = processed.replace(/(<\/p>)\s*\n\s*\n\s*(<p[^>]*>)/gi, '$1$2');
                
                // Ensure all paragraphs have proper structure and are not empty
                // Find all paragraphs and ensure they have content
                processed = processed.replace(/<p[^>]*>([\s\n]*)<\/p>/gi, '');
                
                // Ensure all content is in a single block by wrapping everything in a container
                // This ensures proper rendering of all translator entries together
                if (processed.trim() && !processed.trim().startsWith('<div')) {
                  processed = '<div class="translator-content-block">' + processed + '</div>';
                }
                
                return processed;
              };

              const processedTitle = content.title ? processImageUrls(processHtml(content.title)) : null;
              const processedText = processImageUrls(processHtml(content.text));

              return (
                <>
                  {processedTitle && (
                    <div
                      className="mb-4 prose prose-xl dark:prose-invert max-w-none font-malayalam overflow-hidden text-right py-4"
                      style={{ fontSize: '1.75rem', lineHeight: '2.5rem' }}
                      dangerouslySetInnerHTML={{ __html: processedTitle }}
                    />
                  )}
                  <div className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden">
                    <div
                      className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam overflow-hidden translator-content-wrapper"
                      dangerouslySetInnerHTML={{ __html: processedText }}
                      style={{
                        lineHeight: 1.8,
                        textAlign: 'justify',
                        textJustify: 'inter-word',
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        overflowX: 'hidden',
                        width: '100%',
                      }}
                    />
                  {/* Add styles to remove borders, prevent overflow, and format content */}
                  <style>{`
                    .prose {
                      overflow-x: hidden !important;
                      word-wrap: break-word !important;
                      overflow-wrap: break-word !important;
                      word-break: break-word !important;
                      max-width: 100% !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .prose * {
                      border: none !important;
                      outline: none !important;
                      box-shadow: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                    }
                    /* Ensure all text elements are justified */
                    .prose div,
                    .prose span,
                    .prose p {
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .prose p {
                      margin-bottom: 0.75rem;
                      margin-top: 0;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      overflow-x: hidden !important;
                      line-height: 1.8 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .prose p:last-child {
                      margin-bottom: 0 !important;
                    }
                    /* Ensure translator content flows as single block */
                    .translator-content-wrapper {
                      display: block;
                      width: 100%;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-block {
                      display: block;
                      width: 100%;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-block p {
                      margin-bottom: 0.75rem !important;
                      margin-top: 0 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    /* Remove large gaps between paragraphs in translator block */
                    .translator-content-block p + p {
                      margin-top: 0 !important;
                    }
                    /* Ensure empty paragraphs don't create spacing */
                    .translator-content-block p:empty {
                      display: none !important;
                      margin: 0 !important;
                      padding: 0 !important;
                    }
                    /* Remove excessive spacing in the wrapper */
                    .translator-content-wrapper p {
                      margin-bottom: 0.75rem !important;
                      margin-top: 0 !important;
                      text-align: justify !important;
                      text-justify: inter-word !important;
                    }
                    .translator-content-wrapper p:empty {
                      display: none !important;
                      margin: 0 !important;
                      padding: 0 !important;
                      height: 0 !important;
                    }
                    /* Ensure all divs and spans are also justified */
                    .translator-content-wrapper div,
                    .translator-content-block div {
                      text-align: justify !important;
                    }
                    .translator-content-wrapper span,
                    .translator-content-block span {
                      text-align: justify !important;
                    }
                    .prose img {
                      max-width: 100% !important;
                      width: auto !important;
                      height: auto !important;
                      margin: 1rem auto;
                      padding: 0.75rem;
                      border: none !important;
                      outline: none !important;
                      display: block;
                      object-fit: contain;
                    }
                    .translator-content-wrapper img,
                    .translator-content-block img {
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
                    /* Ensure images in paragraphs are properly displayed */
                    .translator-content-wrapper p img,
                    .translator-content-block p img {
                      display: block !important;
                      margin: 1rem auto !important;
                      padding: 0.75rem !important;
                    }
                    /* Handle broken images gracefully */
                    .prose img[src=""],
                    .prose img:not([src]),
                    .translator-content-wrapper img[src=""],
                    .translator-content-wrapper img:not([src]) {
                      display: none !important;
                    }
                    /* Center images - images are block level so they'll be centered by margin: auto */
                    .translator-content-wrapper img,
                    .translator-content-block img {
                      margin-left: auto !important;
                      margin-right: auto !important;
                      padding: 0.75rem !important;
                    }
                    .prose strong {
                      font-weight: 700 !important;
                      color: #1f2937 !important;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      display: inline !important;
                      margin-right: 0.25rem !important;
                    }
                    .dark .prose strong {
                      color: #f9fafb !important;
                    }
                    .prose p strong {
                      font-weight: 700 !important;
                      display: inline !important;
                    }
                    .prose br {
                      border: none !important;
                      outline: none !important;
                      display: block !important;
                      content: "" !important;
                      margin-top: 0.5rem !important;
                    }
                    .prose span {
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      display: inline-block;
                    }
                    .translator-separator {
                      height: 2px;
                      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
                      margin: 2rem 0;
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow: hidden !important;
                    }
                    .dark .translator-separator {
                      background: linear-gradient(to right, transparent, #374151, transparent);
                    }
                    /* Remove any table borders if present */
                    .prose table {
                      width: 100% !important;
                      max-width: 100% !important;
                      table-layout: auto !important;
                      border-collapse: collapse !important;
                      overflow-x: auto !important;
                      display: block !important;
                    }
                    .prose table td,
                    .prose table th {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                      padding: 0.5rem !important;
                    }
                    /* Remove any list borders */
                    .prose ul,
                    .prose ol {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-x: hidden !important;
                    }
                    .prose li {
                      border: none !important;
                      outline: none !important;
                      max-width: 100% !important;
                      overflow-wrap: break-word !important;
                      word-wrap: break-word !important;
                      word-break: break-word !important;
                    }
                    /* Ensure all text content is visible and properly aligned */
                    .translator-content-wrapper p {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .translator-content-wrapper div:not(.translator-separator) {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    .translator-content-wrapper strong,
                    .translator-content-wrapper span {
                      display: inline !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Ensure proper width and alignment for all content */
                    .translator-content-block * {
                      max-width: 100% !important;
                      box-sizing: border-box !important;
                    }
                    .translator-content-block p {
                      display: block !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    /* Translator name wrapper and name styling */
                    .translator-name-wrapper {
                      margin: 2rem 0 1rem 0 !important;
                      display: block !important;
                      width: 100% !important;
                    }
                    .translator-name {
                      font-size: 1.25rem !important;
                      font-weight: 700 !important;
                      color: #1f2937 !important;
                      margin-bottom: 1rem !important;
                      text-align: left !important;
                      font-family: 'NotoSansMalayalam', sans-serif !important;
                      line-height: 1.5 !important;
                      padding: 0.5rem 0 !important;
                    }
                    .dark .translator-name {
                      color: #f9fafb !important;
                    }
                    .translator-name-wrapper img {
                      margin-top: 0 !important;
                      margin-bottom: 1rem !important;
                    }
                  `}</style>
                  </div>
                </>
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

export default Translators;


