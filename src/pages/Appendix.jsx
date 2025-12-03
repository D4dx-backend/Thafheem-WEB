import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { fetchAppendix } from "../api/apifunction";

const PAGE_CONFIG = {
  malayalam: {
    title: "Malayalam Appendix",
    description: "Supplementary Malayalam appendix content compiled from Thafheem archives.",
    apiLanguage: "malayalam",
  },
  english: {
    title: "English Appendix",
    description: "English appendix articles curated from Thafheem resources.",
    apiLanguage: "english",
  },
  urdu: {
    title: "Urdu Appendix",
    description: "Urdu appendix articles curated from Thafheem resources.",
    apiLanguage: "urdu",
  },
  hindi: {
    title: "Hindi Appendix",
    description: "Hindi appendix articles curated from Thafheem resources.",
    apiLanguage: "hindi",
  },
  bangla: {
    title: "Bangla Appendix",
    description: "Bangla appendix articles curated from Thafheem resources.",
    apiLanguage: "bangla",
  },
};

const Appendix = () => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { translationLanguage } = useTheme();
  const normalized = String(lang || "english").toLowerCase();
  const isBangla = normalized.startsWith("bangla") || normalized === "bn" || translationLanguage === "bn";

  const pageConfig = useMemo(() => {
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

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/authorpreface");
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="sm:max-w-[1070px] max-w-[350px] w-full mx-auto font-poppins">
        <button
          onClick={handleBack}
          className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline mb-4"
        >
          ← Back
        </button>

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
          <div className="space-y-8">
            {sections.map((section, index) => (
              <section
                key={section.id || index}
                className="bg-white dark:bg-[#1b1d27] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7"
              >
                {section.title && (
                  <h3 
                    className={`text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 ${isBangla ? 'font-bengali' : ''}`}
                    dangerouslySetInnerHTML={{ __html: section.title }}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-7 prose-a:text-cyan-600 dark:prose-a:text-cyan-400 ${isBangla ? 'font-bengali' : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.text || "" }}
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


