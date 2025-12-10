import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTamilJesusMohammed } from "../api/apifunction";

const TamilJesusMohammed = () => {
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
        const data = await fetchTamilJesusMohammed();
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
        .tamil-jesus-mohammed-content {
          font-family: 'Bamini', serif !important;
          text-align: justify !important;
          text-justify: inter-word !important;
          line-height: 1.8 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        .tamil-jesus-mohammed-content p {
          margin-bottom: 1.5em !important;
          text-align: justify !important;
          text-justify: inter-word !important;
          font-family: 'Bamini', serif !important;
          font-size: 16px !important;
          line-height: 1.8 !important;
        }
        .tamil-jesus-mohammed-content h1,
        .tamil-jesus-mohammed-content h2,
        .tamil-jesus-mohammed-content h3,
        .tamil-jesus-mohammed-content h4,
        .tamil-jesus-mohammed-content strong {
          font-family: 'Bamini', serif !important;
          text-align: justify !important;
        }
      `}</style>
      <div className="min-h-screen bg-white dark:bg-gray-900 font-tamil overflow-x-hidden">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white font-tamil">
              இயேசு மற்றும் முஹம்மது
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
            <div className="space-y-8">
              {sections.map((section, index) => (
                <section
                  key={section.id || index}
                  className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7"
                >
                  {section.title && (
                    <h3
                      className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 font-tamil"
                      dangerouslySetInnerHTML={{ __html: section.title }}
                      style={{
                        fontFamily: "'Bamini', serif",
                        textAlign: "justify",
                      }}
                    />
                  )}
                  <div
                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 break-words overflow-wrap-anywhere tamil-jesus-mohammed-content"
                    dangerouslySetInnerHTML={{ __html: section.text || "" }}
                    style={{
                      lineHeight: 1.8,
                      textAlign: "justify",
                      textJustify: "inter-word",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      fontFamily: "'Bamini', serif",
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

export default TamilJesusMohammed;

