import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamJesusMohammed } from '../api/apifunction';

const MalayalamJesusMohammed = () => {
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMalayalamJesusMohammed();
        if (!isMounted) return;

        setSections(data.sections || []);
        if (data.error) {
          setError('Unable to fetch content from the server.');
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load content. Please try again later.');
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
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <style>{`
        .malayalam-jesus-content p {
          margin-bottom: 1.5rem !important;
        }
        .malayalam-jesus-content p:last-child {
          margin-bottom: 0 !important;
        }
      `}</style>
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}
            style={isMalayalam ? { fontFamily: "'NotoSansMalayalam'" } : {}}
          >
            {isMalayalam ? 'യേശുവും മുഹമ്മദും' : 'Jesus and Mohammed'}
          </h1>
          
          <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            {isMalayalam ? 'ഉള്ളടക്കം ലോഡുചെയ്യുന്നു...' : 'Loading content...'}
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            {isMalayalam
              ? 'ഇപ്പോൾ ഉള്ളടക്കം ലഭ്യമല്ല.'
              : 'Content is not available at the moment.'}
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
                  <div
                    className={`mb-4 prose prose-lg dark:prose-invert max-w-none ${
                      isMalayalam ? 'font-malayalam' : ''
                    }`}
                    style={isMalayalam ? { fontFamily: "'NotoSansMalayalam'" } : {}}
                    dangerouslySetInnerHTML={{ __html: section.title }}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 malayalam-jesus-content ${
                    isMalayalam ? 'font-malayalam' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: section.text || '' }}
                  style={{
                    lineHeight: 1.8,
                    textAlign: 'justify',
                    ...(isMalayalam ? { fontFamily: "'NotoSansMalayalam'" } : {}),
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

export default MalayalamJesusMohammed;
