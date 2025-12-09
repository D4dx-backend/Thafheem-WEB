import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamFinalityOfProphethood, fetchMalayalamFootnote } from '../api/apifunction';

const MalayalamFinalityOfProphethood = () => {
  const navigate = useNavigate();
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteModal, setNoteModal] = useState({
    open: false,
    code: '',
    content: '',
    loading: false,
    error: null,
  });

  // Determine container width based on content length
  const determineContainerWidth = (contentLength = 0) => {
    if (contentLength <= 400) {
      return "max-w-lg";
    }
    if (contentLength <= 1200) {
      return "max-w-2xl";
    }
    if (contentLength <= 2000) {
      return "max-w-3xl";
    }
    return "max-w-4xl";
  };

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMalayalamFinalityOfProphethood();
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

  const handleNoteClick = async (event, section) => {
    const target = event.target.closest('.note-marker');
    if (!target) return;

    const code = target.getAttribute('data-code');
    setNoteModal({
      open: true,
      code,
      content: 'Loading...',
      loading: true,
      error: null,
    });

    try {
      let noteContent = '';

      // Try Notes API (accepts alphanumeric IDs like P/H/N1234)
      const data = await fetchMalayalamFootnote(code);
      if (data?.footnote_text) {
        noteContent = data.footnote_text;
      } else if (data?.error) {
        throw new Error(data.error);
      }

      // Fallback: pull any note-like field from the raw row
      if (!noteContent) {
        const raw = section?.raw || {};
        noteContent =
          raw.notes ||
          raw.Notes ||
          raw.note ||
          raw.Note ||
          raw.comments ||
          raw.Comments ||
          raw.commentary ||
          raw.Commentary ||
          '';
      }

      setNoteModal({
        open: true,
        code,
        content: noteContent || 'Note content not available.',
        loading: false,
        error: null,
      });
    } catch (err) {
      setNoteModal({
        open: true,
        code,
        content: 'Note content not available.',
        loading: false,
        error: err?.message || 'Unable to load note.',
      });
    }
  };

  const processNotes = (html, section) => {
    if (!html) return html;
    // Wrap note markers (P#### / H#### / N####) with clickable buttons
    return html.replace(/\b([PHN]\d{1,5})\b/g, (match, code) => {
      return `<button type="button" class="note-marker" data-code="${code}">${code}</button>`;
    });
  };

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
          ← Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}
          >
            {isMalayalam ? 'പ്രവാചകത്വത്തിന്റെ അന്ത്യം' : 'The Finality of Prophethood'}
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
                onClick={(e) => handleNoteClick(e, section)}
              >
                {section.title && (
                  <div
                    className={`mb-4 prose prose-lg dark:prose-invert max-w-none ${
                      isMalayalam ? 'font-malayalam' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: processNotes(section.title, section) }}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 ${
                    isMalayalam ? 'font-malayalam' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: processNotes(section.text || '', section) }}
                  style={{
                    lineHeight: 1.8,
                    textAlign: 'justify',
                  }}
                />
              </section>
            ))}
          </div>
        )}
        {/* Note Modal */}
        {noteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full ${determineContainerWidth(noteModal.content?.length || 0)} max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700`}>
              {/* Header - Fixed */}
              <div className="flex items-start justify-between p-5 sm:p-6 pb-3 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-malayalam">കുറിപ്പ്</p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{noteModal.code}</h3>
                </div>
                <button
                  onClick={() =>
                    setNoteModal({ open: false, code: '', content: '', loading: false, error: null })
                  }
                  className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              {/* Content - Scrollable */}
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <div className="p-5 sm:p-6 pt-4 overflow-y-auto flex-1">
                  {noteModal.loading ? (
                    <div className="text-sm text-gray-600 dark:text-gray-300">Loading...</div>
                  ) : (
                    <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-malayalam whitespace-pre-wrap break-words text-justify" style={{ textAlign: 'justify' }}>
                      {noteModal.content}
                    </div>
                  )}
                  {noteModal.error && (
                    <div className="mt-3 text-xs text-red-600 dark:text-red-300">
                      {noteModal.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <style>{`
          .note-marker {
            color: #0891b2;
            border: none;
            background: transparent;
            padding: 0 2px;
            font-size: 0.95rem;
            cursor: pointer;
            transition: color 0.15s ease;
          }
          .note-marker:hover {
            color: #04748d;
          }
          .note-marker:focus {
            outline: none;
            text-decoration: underline;
          }
        `}</style>
      </div>
    </div>
  );
};

export default MalayalamFinalityOfProphethood;


