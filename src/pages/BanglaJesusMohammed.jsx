import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchBanglaJesusMohammed } from '../api/apifunction';

const BanglaJesusMohammed = () => {
  const navigate = useNavigate();
  const { translationLanguage } = useTheme();
  const isBangla = translationLanguage === 'bn';

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBanglaJesusMohammed();
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
          {isBangla ? '← পিছনে' : '← Back'}
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${isBangla ? 'font-bengali' : ''}`}>
            {isBangla ? 'যীশু ও মুহাম্মদ' : 'Jesus and Mohammed'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isBangla ? 'তাফহীম সংস্থান থেকে বাংলা বিষয়বস্তু।' : 'Bangla content from Thafheem resources.'}
          </p>
          <div className="mt-4 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            {isBangla ? 'বিষয়বস্তু লোড হচ্ছে...' : 'Loading content...'}
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            {isBangla ? 'বিষয়বস্তু এই মুহূর্তে উপলব্ধ নয়।' : 'Content is not available at the moment.'}
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
                    className={`mb-4 prose prose-lg dark:prose-invert max-w-none ${isBangla ? 'font-bengali' : ''}`}
                    dangerouslySetInnerHTML={{ __html: section.title }}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 ${isBangla ? 'font-bengali' : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.text || '' }}
                  style={{
                    lineHeight: 1.8,
                    textAlign: 'justify',
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

export default BanglaJesusMohammed;

