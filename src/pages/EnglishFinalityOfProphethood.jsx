import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEnglishFinalityOfProphethood } from "../api/apifunction";

const EnglishFinalityOfProphethood = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        </div>
      </div>
    </>
  );
};

export default EnglishFinalityOfProphethood;

