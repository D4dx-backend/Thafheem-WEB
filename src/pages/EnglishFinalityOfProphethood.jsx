import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEnglishFinalityOfProphethood, fetchEnglishFinalityFootnote } from "../api/apifunction";

const EnglishFinalityOfProphethood = () => {
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
        const data = await fetchEnglishFinalityOfProphethood();
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
      const data = await fetchEnglishFinalityFootnote(footnoteId);
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
    // Determine width based on content length
    let widthClass = "max-w-lg"; // default
    if (contentLength <= 300) {
      widthClass = "max-w-md";
    } else if (contentLength <= 600) {
      widthClass = "max-w-lg";
    } else if (contentLength <= 1200) {
      widthClass = "max-w-2xl";
    } else if (contentLength <= 2000) {
      widthClass = "max-w-3xl";
    } else {
      widthClass = "max-w-4xl";
    }
    
    // Determine if we need max-height constraint (only for very long content)
    const needsMaxHeight = contentLength > 1500;
    
    return { widthClass, needsMaxHeight };
  };

  return (
    <>
      <style>{`
        .prose-content img {
          max-width: 100% !important;
          height: auto;
        }
        .prose-content table {
          max-width: 100% !important;
          table-layout: auto;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content table td,
        .prose-content table th {
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 0;
        }
        .prose-content pre {
          max-width: 100% !important;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content code {
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        .prose-content blockquote {
          max-width: 100% !important;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content * {
          max-width: 100% !important;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        .prose-content {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .prose-content,
        .prose-content *,
        .prose-content p,
        .prose-content h1,
        .prose-content h2,
        .prose-content h3,
        .prose-content h4,
        .prose-content h5,
        .prose-content h6,
        .prose-content span,
        .prose-content div,
        .prose-content li,
        .prose-content ul,
        .prose-content ol,
        .prose-content strong,
        .prose-content em,
        .prose-content a,
        .prose-content blockquote {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
      <style>{`
        .prose-content .footnote-link,
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
        .prose-content .footnote-link:hover,
        .footnote-link:hover {
          color: #0891b2 !important;
          text-decoration: underline !important;
        }
        .prose-content .footnote-link:focus,
        .footnote-link:focus {
          outline: 2px solid #06b6d4 !important;
          outline-offset: 2px !important;
        }
        /* Ensure sup tags with footnote-link are styled correctly */
        sup.footnote-link,
        .prose-content sup.footnote-link {
          vertical-align: baseline !important;
          font-size: 0.9em !important;
          color: #06b6d4 !important;
          cursor: pointer !important;
          text-decoration: underline !important;
        }
        sup.footnote-link:hover,
        .prose-content sup.footnote-link:hover {
          color: #0891b2 !important;
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
      `}</style>
      <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins overflow-x-hidden">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
            The Finality of Prophethood
          </h1>
          
          <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Loading / Error / Empty */}
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

        {/* Content */}
        {!loading && !error && sections.length > 0 && (
          <div className="space-y-8 overflow-x-hidden">
            {sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7 overflow-hidden"
                onClick={handleFootnoteClick}
              >
                {section.title && (
                  <div
                    className="mb-4 prose prose-lg dark:prose-invert max-w-none break-words overflow-wrap-anywhere prose-content font-poppins"
                    dangerouslySetInnerHTML={{ __html: section.title }}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  />
                )}
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere prose-content font-poppins"
                  dangerouslySetInnerHTML={{ __html: section.text || "" }}
                  style={{
                    lineHeight: 1.8,
                    textAlign: "justify",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
              </section>
            ))}
          </div>
        )}

        {/* Footnote Modal */}
        {footnoteModal.open && (() => {
          const contentLength = footnoteModal.content?.length || 0;
          const { widthClass, needsMaxHeight } = determineContainerSize(contentLength);
          
          return (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setFootnoteModal({ open: false, footnoteId: '', content: '', loading: false, error: null });
                }
              }}
            >
              <div 
                className={`footnote-modal-container bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full ${widthClass} ${needsMaxHeight ? 'max-h-[90vh]' : 'max-h-[95vh]'} max-w-[95vw] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200`}
                style={{
                  minWidth: 'min(90vw, 320px)',
                  maxWidth: 'min(95vw, 896px)', // max-w-4xl = 896px
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Fixed */}
                <div className="flex items-start justify-between p-4 sm:p-5 pb-3 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Footnote {footnoteModal.footnoteId}
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
                <div className={`${needsMaxHeight ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : ''}`}>
                  <div className={`p-4 sm:p-5 pt-4 ${needsMaxHeight ? 'overflow-y-auto flex-1' : ''}`}>
                    {footnoteModal.loading ? (
                      <div className="text-sm text-gray-600 dark:text-gray-300 text-center py-4">Loading...</div>
                    ) : (
                      <div 
                        className="text-sm sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 break-words text-justify prose-content"
                        style={{ 
                          textAlign: 'justify',
                          fontFamily: "'Poppins', sans-serif",
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: footnoteModal.content
                            ? (() => {
                                let processedContent = footnoteModal.content;
                                
                                // Remove leading "footnote X." pattern (case insensitive, handles spacing variations)
                                // This removes duplicate titles like "footnote 1." or "footnote1." or "Footnote 1."
                                // Pattern matches: "footnote" (case insensitive) + optional space + digits + period + optional space/newlines
                                processedContent = processedContent.replace(
                                  /^[\s\r\n]*footnote\s*\d+\.\s*/i,
                                  ''
                                );
                                
                                // Convert line breaks to HTML
                                processedContent = processedContent
                                  .replace(/\r\n/g, '<br>')
                                  .replace(/\n/g, '<br>')
                                  .replace(/\r/g, '<br>');
                                
                                // Trim any leading/trailing whitespace
                                processedContent = processedContent.trim();
                                
                                return processedContent;
                              })()
                            : ''
                        }}
                      />
                    )}
                    {footnoteModal.error && (
                      <div className="mt-3 text-xs text-red-600 dark:text-red-300">
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

export default EnglishFinalityOfProphethood;

