import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUrduFinalityOfProphethood, fetchUrduFinalityFootnote } from "../api/apifunction";

const UrduFinalityOfProphethood = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [footnoteModal, setFootnoteModal] = useState({
    open: false,
    footnoteId: '',
    content: '',
    loading: false,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUrduFinalityOfProphethood();
        if (!isMounted) {
          return;
        }
        setSections(data.sections || []);
        if (data.error) {
          setError("Unable to fetch content from the server.");
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load content. Please try again later.");
          setSections([]);
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
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleFootnoteClick = async (event) => {
    // Handle clicks on sup tags with footnote-link class (from backend)
    const target = event.target.closest('.footnote-link') || event.target.closest('sup.footnote-link');
    if (!target) return;

    const footnoteId = target.getAttribute('data-footnote-id');
    if (!footnoteId) {
      console.log('No footnote ID found on target:', target);
      return;
    }

    // Prevent default link behavior if it's a link
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Footnote clicked:', footnoteId);

    setFootnoteModal({
      open: true,
      footnoteId,
      content: 'Loading...',
      loading: true,
      error: null,
    });

    try {
      const data = await fetchUrduFinalityFootnote(footnoteId);
      if (data?.footnote_text) {
        setFootnoteModal({
          open: true,
          footnoteId,
          content: data.footnote_text,
          loading: false,
          error: null,
        });
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Footnote content not available');
      }
    } catch (err) {
      setFootnoteModal({
        open: true,
        footnoteId,
        content: 'Footnote content not available.',
        loading: false,
        error: err?.message || 'Unable to load footnote.',
      });
    }
  };

  const determineContainerSize = (contentLength = 0) => {
    // Determine width based on content length - optimal width for Urdu readability
    let widthClass = "max-w-3xl"; // Default width
    let minWidth = 'min(85vw, 500px)';
    let maxWidth = 'min(90vw, 800px)';
    
    if (contentLength <= 300) {
      widthClass = "max-w-xl";
      minWidth = 'min(80vw, 450px)';
      maxWidth = 'min(85vw, 576px)';
    } else if (contentLength <= 800) {
      widthClass = "max-w-2xl";
      minWidth = 'min(85vw, 500px)';
      maxWidth = 'min(90vw, 672px)';
    } else if (contentLength <= 1500) {
      widthClass = "max-w-3xl";
      minWidth = 'min(85vw, 550px)';
      maxWidth = 'min(90vw, 768px)';
    } else {
      // For very large content, slightly wider but still reasonable
      widthClass = "max-w-4xl";
      minWidth = 'min(88vw, 600px)';
      maxWidth = 'min(92vw, 896px)';
    }
    
    // Always enable max-height constraint for content longer than 500 chars to ensure scrolling
    const needsMaxHeight = contentLength > 500;
    
    return { widthClass, needsMaxHeight, minWidth, maxWidth };
  };

  return (
    <>
      <style>{`
        .urdu-finality-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .urdu-finality-content .footnote-link,
        .footnote-link {
          color: #06b6d4 !important;
          background: transparent !important;
          border: none !important;
          padding: 0 2px !important;
          cursor: pointer !important;
          text-decoration: underline !important;
          font-size: inherit !important;
          font-family: inherit !important;
          transition: color 0.15s ease !important;
          display: inline !important;
        }
        .urdu-finality-content .footnote-link:hover,
        .footnote-link:hover {
          color: #0891b2 !important;
          text-decoration: underline !important;
        }
        .urdu-finality-content .footnote-link:focus,
        .footnote-link:focus {
          outline: 2px solid #06b6d4 !important;
          outline-offset: 2px !important;
        }
        /* Ensure sup tags with footnote-link are styled correctly */
        sup.footnote-link,
        .urdu-finality-content sup.footnote-link {
          vertical-align: super !important;
          font-size: 0.85em !important;
          color: #06b6d4 !important;
          cursor: pointer !important;
          text-decoration: underline !important;
          font-weight: normal !important;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 1px !important;
        }
        sup.footnote-link:hover,
        .urdu-finality-content sup.footnote-link:hover {
          color: #0891b2 !important;
        }
        /* Prevent any link behavior from markdown parser */
        sup.footnote-link a,
        .urdu-finality-content sup.footnote-link a {
          color: inherit !important;
          text-decoration: inherit !important;
          pointer-events: none !important;
        }
        /* Remove any href attributes that might cause navigation */
        sup.footnote-link[href],
        .urdu-finality-content sup.footnote-link[href] {
          pointer-events: none !important;
        }
        /* Modal animation */
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .footnote-modal-container {
          animation: modalFadeIn 0.2s ease-out;
        }
        /* Urdu modal content styling */
        .footnote-modal-container [dir="rtl"] {
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .footnote-modal-container [dir="rtl"] p,
        .footnote-modal-container [dir="rtl"] div,
        .footnote-modal-container [dir="rtl"] span {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
        }
        /* Ensure proper justification for RTL Urdu text */
        .urdu-footnote-content {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        .urdu-footnote-content * {
          text-align: justify !important;
          text-align-last: right !important;
        }
        .urdu-footnote-content div {
          text-align: justify !important;
          text-align-last: right !important;
          direction: rtl !important;
        }
        /* Remove any inline styles that might override justification */
        .urdu-footnote-content [style*="text-align"] {
          text-align: justify !important;
          text-align-last: right !important;
        }
        /* Smooth scrolling for modal content */
        .footnote-modal-container .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        /* Dark mode scrollbar */
        .dark .footnote-modal-container .overflow-y-auto {
          scrollbar-color: #475569 #1e293b;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .dark .footnote-modal-container .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    <div className="p-6 dark:bg-gray-900 min-h-screen" dir="rtl">
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <button
          onClick={handleBack}
          className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4 text-left"
          style={{ direction: 'ltr' }}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2" dir="rtl">
          اب نبی کی آخر ضرورت کیا ہے؟
        </h2>
        

        {loading && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Loading content...
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Content is not available at the moment.
          </div>
        )}

        {!loading && !error && sections.length > 0 && (
          <div className="space-y-8 ml-4 sm:ml-6 md:ml-8 lg:ml-12" dir="rtl">
            {sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7"
                onClick={handleFootnoteClick}
              >
                {section.title && (
                  <div 
                    className="mb-4 text-right prose prose-lg dark:prose-invert max-w-none font-urdu-nastaliq
                      prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:text-gray-900 dark:prose-h1:text-white
                      prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
                      prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:text-gray-900 dark:prose-h3:text-white"
                    dangerouslySetInnerHTML={{ __html: section.title }}
                    style={{ 
                      textAlign: 'right',
                      fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                    }}
                  />
                )}
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed 
                    prose-headings:text-right prose-p:text-right prose-p:mb-4 prose-p:text-justify
                    prose-ul:text-right prose-ol:text-right prose-li:text-right prose-li:mb-2
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:text-right prose-blockquote:border-r-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
                    prose-h1:text-right prose-h2:text-right prose-h3:text-right prose-h4:text-right
                    prose-h1:font-bold prose-h2:font-bold prose-h3:font-semibold
                    text-gray-800 dark:text-gray-200 font-urdu-nastaliq urdu-finality-content"
                  dangerouslySetInnerHTML={{ __html: section.text || "" }}
                  style={{ 
                    textAlign: 'right',
                    fontSize: '16px',
                    lineHeight: '2.6',
                    fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                  }}
                />
              </section>
            ))}
          </div>
        )}

        {/* Footnote Modal */}
        {footnoteModal.open && (() => {
          const contentLength = footnoteModal.content?.length || 0;
          const { widthClass, needsMaxHeight, minWidth, maxWidth } = determineContainerSize(contentLength);
          
          return (
            <div 
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20 pb-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setFootnoteModal({ open: false, footnoteId: '', content: '', loading: false, error: null });
                }
              }}
            >
              <div 
                className={`footnote-modal-container bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full ${widthClass} max-h-[90vh] max-w-[95vw] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200`}
                style={{
                  minWidth: minWidth,
                  maxWidth: maxWidth,
                  height: needsMaxHeight ? '90vh' : 'auto',
                  maxHeight: '90vh',
                }}
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
              >
                {/* Header - Fixed */}
                <div className="flex items-start justify-between p-4 sm:p-5 pb-3 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif" }}>
                      حاشیہ {footnoteModal.footnoteId}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setFootnoteModal({ open: false, footnoteId: '', content: '', loading: false, error: null })
                    }
                    className="text-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Content - Auto-sizing with scroll only when needed */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                  <div className="p-4 sm:p-5 pt-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                    {footnoteModal.loading ? (
                      <div className="text-sm text-gray-600 dark:text-gray-300 text-center py-4" style={{ fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif" }}>لوڈ ہو رہا ہے...</div>
                    ) : (
                      <div 
                        className="urdu-footnote-content text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words"
                        style={{ 
                          textAlign: 'justify',
                          textAlignLast: 'right',
                          fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif",
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          fontSize: '16px',
                          lineHeight: '2.6',
                          direction: 'rtl',
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: footnoteModal.content
                            ? (() => {
                                let processedContent = footnoteModal.content;
                                
                                // Remove anchor tags and other unwanted elements
                                processedContent = processedContent.replace(/\[\{#anchor-\d+\}\]/g, '');
                                
                                // Remove trailing backslashes (they seem to be line continuation markers)
                                processedContent = processedContent.replace(/\\\s*\n/g, ' ');
                                
                                // Split by double line breaks (paragraph breaks)
                                let paragraphs = processedContent.split(/\r\n\r\n|\n\n|\r\r/);
                                
                                // If no double breaks found, try splitting by single breaks but group them
                                if (paragraphs.length === 1) {
                                  // Split by single line breaks
                                  let lines = processedContent.split(/\r\n|\n|\r/);
                                  paragraphs = [];
                                  let currentParagraph = [];
                                  
                                  for (let line of lines) {
                                    line = line.trim();
                                    if (line.length === 0) {
                                      // Empty line = paragraph break
                                      if (currentParagraph.length > 0) {
                                        paragraphs.push(currentParagraph.join(' '));
                                        currentParagraph = [];
                                      }
                                    } else {
                                      currentParagraph.push(line);
                                    }
                                  }
                                  // Add last paragraph if exists
                                  if (currentParagraph.length > 0) {
                                    paragraphs.push(currentParagraph.join(' '));
                                  }
                                }
                                
                                // Wrap each paragraph in a p tag with proper styling
                                processedContent = paragraphs
                                  .map(p => p.trim())
                                  .filter(p => p.length > 0)
                                  .map(p => `<p style="text-align: justify; text-align-last: right; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif; line-height: 2.6; margin-bottom: 1.5em; margin-top: 0;">${p}</p>`)
                                  .join('');
                                
                                // Wrap all paragraphs in a container div
                                return `<div style="text-align: justify; text-align-last: right; direction: rtl; font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif;">${processedContent}</div>`;
                              })()
                            : ''
                        }}
                      />
                    )}
                    {footnoteModal.error && (
                      <div className="mt-3 text-xs text-red-600 dark:text-red-300" style={{ fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif" }}>
                        {footnoteModal.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
    </>
  );
};

export default UrduFinalityOfProphethood;

