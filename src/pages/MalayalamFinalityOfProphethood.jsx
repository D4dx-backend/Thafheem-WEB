import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { fetchMalayalamFinalityOfProphethood, fetchNoteById } from '../api/apifunction';
import NotePopup from '../components/NotePopup';

const MalayalamFinalityOfProphethood = () => {
  const { translationLanguage } = useTheme();
  const isMalayalam = translationLanguage === 'mal';

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notePopup, setNotePopup] = useState({
    isOpen: false,
    noteId: null,
    noteName: null,
    noteText: null,
    loading: false,
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

  const handleNoteClick = async (event) => {
    const target = event.target.closest('.p-note-link');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const noteId = target.getAttribute('data-note-id');
    if (!noteId) return;

    setNotePopup({
      isOpen: true,
      noteId,
      noteName: null,
      noteText: null,
      loading: true,
    });

    try {
      const noteData = await fetchNoteById(noteId);
      const noteName = noteData?.NoteName || null;
      const noteText = noteData?.NoteText || noteData?.note_text || noteData?.content || noteData?.html || noteData?.text || noteData?.body || noteData?.description || noteData?.note || null;
      
      setNotePopup({
        isOpen: true,
        noteId,
        noteName,
        noteText: noteText || '<p style="color: #666;">Note content is not available.</p>',
        loading: false,
      });
    } catch (err) {
      console.error(`Failed to fetch note ${noteId}:`, err.message);
      setNotePopup({
        isOpen: true,
        noteId,
        noteName: null,
        noteText: '<p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>',
        loading: false,
      });
    }
  };

  const processNotes = (html) => {
    if (!html) return html;
    // Process B, H, N, P, X followed by digits (B123, H456, N789, P2151, X123, etc.)
    // Pattern: letter immediately followed by one or more digits
    return html.replace(/([BHNPX])(\d+)/g, (match, letter, number) => {
      // Check if already wrapped in a link element
      if (match.includes('p-note-link')) {
        return match;
      }
      const noteId = `${letter}${number}`;
      return `<a href="#" class="p-note-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors font-semibold" data-note-id="${noteId}" title="Click to view note ${noteId}"><sup>${match}</sup></a>`;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-poppins">
      <div className="max-w-[1070px] w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-3xl font-bold text-gray-900 mb-2 dark:text-white ${isMalayalam ? 'font-malayalam' : ''}`}
            style={isMalayalam ? { fontFamily: "'Noto Sans Malayalam'" } : {}}
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
                onClick={handleNoteClick}
              >
                {section.title && (
                  <div
                    className={`mb-4 prose prose-lg dark:prose-invert max-w-none ${
                      isMalayalam ? 'font-malayalam' : ''
                    }`}
                    style={isMalayalam ? { fontFamily: "'Noto Sans Malayalam'" } : {}}
                    dangerouslySetInnerHTML={{ __html: processNotes(section.title) }}
                  />
                )}
                <div
                  className={`prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-200 ${
                    isMalayalam ? 'font-malayalam' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: processNotes(section.text || '') }}
                  style={{
                    lineHeight: 1.8,
                    textAlign: 'justify',
                    ...(isMalayalam ? { fontFamily: "'Noto Sans Malayalam'" } : {}),
                  }}
                />
              </section>
            ))}
          </div>
        )}
        {/* Note Popup for P notes */}
        <NotePopup
          isOpen={notePopup.isOpen}
          onClose={() => setNotePopup({ isOpen: false, noteId: null, noteName: null, noteText: null, loading: false })}
          noteId={notePopup.noteId}
          noteContent={notePopup.loading ? 'Loading...' : notePopup.noteText}
          noteName={notePopup.noteName}
          loading={notePopup.loading}
        />
      </div>
    </div>
  );
};

export default MalayalamFinalityOfProphethood;


