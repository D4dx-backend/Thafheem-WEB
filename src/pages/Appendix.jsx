import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { fetchAppendix } from "../api/apifunction";

const PAGE_CONFIG = {
  malayalam: {
    title: "Malayalam Appendix",
    
    apiLanguage: "malayalam",
  },
  english: {
    title: "English Appendix",
    
    apiLanguage: "english",
  },
  urdu: {
    title: "Urdu Appendix",
    
    apiLanguage: "urdu",
  },
  hindi: {
    title: "Hindi Appendix",
   
    apiLanguage: "hindi",
  },
  bangla: {
    title: "Bangla Appendix",

    apiLanguage: "bangla",
  },
  tamil: {
    title: "Tamil Appendix",

    apiLanguage: "tamil",
  },
};

const Appendix = () => {
  const { lang } = useParams();
  const { translationLanguage } = useTheme();
  const normalized = String(lang || "english").toLowerCase();
  
  // Priority: URL parameter over theme context for language detection
  const pageConfig = useMemo(() => {
    // Check Tamil first to avoid conflicts with other languages
    if (normalized === "ta" || normalized === "tamil") {
      return PAGE_CONFIG.tamil;
    }
    if (normalized.startsWith("mal")) {
      return PAGE_CONFIG.malayalam;
    }
    if (normalized.startsWith("urdu") || normalized === "u") {
      return PAGE_CONFIG.urdu;
    }
    if (normalized.startsWith("hindi") || normalized === "hi") {
      return PAGE_CONFIG.hindi;
    }
    if (normalized.startsWith("bangla") || normalized === "bn") {
      return PAGE_CONFIG.bangla;
    }
    return PAGE_CONFIG.english;
  }, [normalized]);

  // Language flags based on URL parameter (not theme context) to avoid conflicts
  const isTamil = normalized === "ta" || normalized === "tamil" || normalized.startsWith("tamil");
  const isUrdu = normalized.startsWith("urdu") || normalized === "u";
  const isMalayalam = normalized.startsWith("mal");
  const isBangla = normalized.startsWith("bangla") || normalized === "bn";
  const isHindi = normalized.startsWith("hindi") || normalized === "hi";
  const isEnglish = !isTamil && !isUrdu && !isMalayalam && !isBangla && !isHindi;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAppendix = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAppendix(pageConfig.apiLanguage);
        if (!isMounted) {
          return;
        }
        setSections(data.sections || []);
        if (data.error) {
          setError("Unable to fetch appendix content from the server.");
        }
      } catch (err) {
        if (isMounted) {
          setError("Unable to load appendix content. Please try again later.");
          setSections([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAppendix();
    return () => {
      isMounted = false;
    };
  }, [pageConfig.apiLanguage]);

  // Fix question mark position in English text within parentheses for Urdu content
  const fixQuestionMarkPosition = (html) => {
    if (!isUrdu || !html) return html;
    // Match pattern like ")?WHY ALLAH SENT PROPHETS AND MESSENGERS(" and fix it to "(WHY ALLAH SENT PROPHETS AND MESSENGERS?)"
    // Also handle the normal pattern "(?WHY ALLAH SENT PROPHETS AND MESSENGERS)" 
    return html
      .replace(/\)\?([A-Z][^(]+)\(/g, '($1?)')  // Fix reversed pattern: )?...(
      .replace(/\(\?([A-Z][^)]+)\)/g, '($1?)'); // Fix normal pattern: (?...)
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      {isUrdu && (
        <style>{`
          .urdu-appendix-content p {
            text-align: right !important;
            font-size: 16px !important;
            line-height: 2.6 !important;
            margin-bottom: 10px !important;
            font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
          }
        `}</style>
      )}
      {isEnglish && (
        <style>{`
          .english-appendix-content {
            text-align: justify !important;
          }
          .english-appendix-content p {
            text-align: justify !important;
          }
        `}</style>
      )}
      {isMalayalam && (
        <style>{`
          .malayalam-appendix-content {
            font-family: 'Noto Sans Malayalam' !important;
          }
          .malayalam-appendix-content p {
            text-align: justify !important;
            margin-bottom: 2em !important;
            font-family: 'Noto Sans Malayalam';
            font-size: 16px;
            line-height: 1.7;
          }
        `}</style>
      )}
      {isBangla && (
        <style>{`
          .bangla-appendix-content {
            text-align: justify !important;
            font-family: 'Noto Sans Bengali', 'Kalpurush', sans-serif !important;
          }
          .bangla-appendix-content p {
            text-align: justify !important;
            margin-bottom: 1em !important;
            font-family: 'Noto Sans Bengali', 'Kalpurush', sans-serif !important;
            font-size: 16px !important;
            line-height: 1.7 !important;
          }
        `}</style>
      )}
      {isTamil && (
        <style>{`
          .tamil-appendix-content {
            font-family: 'Bamini', serif !important;
            text-align: justify !important;
            text-justify: inter-word !important;
            line-height: 1.8 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .tamil-appendix-content p {
            margin-bottom: 1.5em !important;
            text-align: justify !important;
            text-justify: inter-word !important;
            font-family: 'Bamini', serif !important;
            font-size: 16px !important;
            line-height: 1.8 !important;
          }
          .tamil-appendix-content h1,
          .tamil-appendix-content h2,
          .tamil-appendix-content h3,
          .tamil-appendix-content h4,
          .tamil-appendix-content strong {
            font-family: 'Bamini', serif !important;
            text-align: justify !important;
          }
        `}</style>
      )}
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <h2 className="text-2xl font-bold mb-2 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-2">
          {pageConfig.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {pageConfig.description}
        </p>

        {loading && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Loading appendix...
          </div>
        )}

        {!loading && error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div className="py-10 text-center text-gray-600 dark:text-gray-300">
            Appendix content is not available at the moment.
          </div>
        )}

        {!loading && !error && sections.length > 0 && (
          <div className="space-y-8" dir={isUrdu ? "rtl" : "ltr"}>
            {sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7"
              >
                {section.title && (
                  <h3 
                    className={`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 ${isBangla ? 'font-bengali' : ''} ${isUrdu ? 'font-urdu-nastaliq' : ''} ${isMalayalam ? 'font-malayalam' : ''} ${isTamil ? 'font-tamil' : ''}`}
                    dangerouslySetInnerHTML={{ __html: fixQuestionMarkPosition(section.title) }}
                    style={isUrdu ? { textAlign: 'right', fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif" } : isMalayalam ? { fontFamily: "'Noto Sans Malayalam'" } : isTamil ? { fontFamily: "'Bamini', serif", textAlign: 'justify' } : {}}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-7 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 ${isBangla ? 'font-bengali bangla-appendix-content' : ''} ${isUrdu ? 'font-urdu-nastaliq urdu-appendix-content' : ''} ${isEnglish ? 'english-appendix-content' : ''} ${isMalayalam ? 'malayalam-appendix-content' : ''} ${isTamil ? 'tamil-appendix-content' : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.text || "" }}
                  style={isUrdu ? {
                    textAlign: 'right',
                    fontSize: '16px',
                    lineHeight: '2.6',
                    fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                  } : isEnglish ? {
                    textAlign: 'justify',
                    fontFamily: "'Poppins', sans-serif"
                  } : isMalayalam ? {
                    fontFamily: "'Noto Sans Malayalam'"
                  } : isBangla ? {
                    textAlign: 'justify',
                    fontFamily: "'Noto Sans Bengali', 'Kalpurush', sans-serif"
                  } : isTamil ? {
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    fontFamily: "'Bamini', serif",
                    lineHeight: '1.8',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  } : {}}
                />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appendix;


