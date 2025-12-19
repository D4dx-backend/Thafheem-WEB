import React, { useEffect, useState } from "react";
import { fetchUrduJesusMohammed } from "../api/apifunction";

const UrduJesusMohammed = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUrduJesusMohammed();
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

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen" dir="rtl">
      <style>{`
        .urdu-jesus-mohammed-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
      `}</style>
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <h2 className="text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2" dir="rtl">
          Jesus and Mohammed
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
          <div className="space-y-8" dir="rtl">
            {sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7"
              >
                {section.title && (
                  <div 
                    className="mb-4 text-right prose prose-lg dark:prose-invert max-w-none
                      prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:text-gray-900 dark:prose-h1:text-white
                      prose-h2:text-xl prose-h2:font-bold prose-h2:mb-3 prose-h2:text-gray-900 dark:prose-h2:text-white
                      prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-3 prose-h3:text-gray-900 dark:prose-h3:text-white"
                    dangerouslySetInnerHTML={{ __html: section.title }}
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
                    text-gray-800 dark:text-gray-200 font-urdu-nastaliq urdu-jesus-mohammed-content"
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
      </div>
    </div>
  );
};

export default UrduJesusMohammed;

