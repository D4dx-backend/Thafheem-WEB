import React, { useState, useEffect, useRef } from "react";
import InterpretationNavbar from "../components/InterpretationNavbar";
import NotePopup from "../components/NotePopup";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AyahModal from "../components/AyahModal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; 
import { fetchInterpretation, fetchInterpretationRange, fetchNoteById } from "../api/apifunction"; 

const MalayalamInterpreter = () => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: '', content: '' });
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [ayahTarget, setAyahTarget] = useState({ surahId: null, verseId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahId, setSurahId] = useState(6); // Default to Al-An'am
  const [range, setRange] = useState("3");
  const [iptNo, setIptNo] = useState(1);
  const [lang, setLang] = useState("en");
  const { quranFont } = useTheme();
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  // Load interpretation content from API
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use URL params if available, otherwise use defaults
        const currentSurahId = params.surahId ? parseInt(params.surahId) : parseInt(searchParams.get('surahId')) || surahId;
        const currentRange = params.range || searchParams.get('range') || range;
        const currentIpt = params.ipt ? parseInt(params.ipt) : parseInt(searchParams.get('ipt')) || iptNo;
        const currentLang = params.lang || searchParams.get('lang') || lang;
        
        setSurahId(currentSurahId);
        setRange(currentRange);
        setIptNo(currentIpt);
        setLang(currentLang);
        
        // Fetch interpretation content
        const isSingle = /^\d+$/.test(currentRange);
        const data = isSingle
          ? await fetchInterpretation(currentSurahId, parseInt(currentRange, 10), currentIpt, currentLang)
          : await fetchInterpretationRange(currentSurahId, currentRange, currentIpt, currentLang);
        
        // Normalize to array
        const items = Array.isArray(data) ? data : [data];
        setContent(items);
      } catch (err) {
        setError(err.message || "Failed to load interpretation");
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [params, searchParams]);

  const handleNoteClick = async (noteId) => {
    // Show loading state immediately
    setSelectedNote({ id: noteId, content: 'Loading...' });
    setIsNoteOpen(true);
    
    try {
      // Fetch note from MySQL database via API
      const noteData = await fetchNoteById(noteId);
      
      // Try different possible content fields - prioritize NoteText from API response
      const content = noteData?.NoteText || 
                     noteData?.note_text ||
                     noteData?.content || 
                     noteData?.html || 
                     noteData?.text || 
                     noteData?.body ||
                     noteData?.description ||
                     noteData?.note ||
                     (typeof noteData === 'string' ? noteData : null);
      
      if (content && content !== 'Note content not available') {
        setSelectedNote({ id: noteId, content });
      } else {
        setSelectedNote({ 
          id: noteId, 
          content: `<p style="color: #666;">Note content is not available.</p>` 
        });
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      
      // Show user-friendly error message
      setSelectedNote({ 
        id: noteId, 
        content: `
          <div class="note-content">
            <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${noteId}</h3>
            <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            <p style="color: #999; font-size: 0.9em; margin-top: 10px;">Error: ${err.message || 'Unknown error'}</p>
          </div>
        `
      });
    }
  };

  const handleContentClick = (e) => {
    const target = e.target;
    
    // Check if clicked element is a highlighted note/verse
    const isHighlightedElement = target.classList.contains('note-highlight') || 
                                 target.closest('.note-highlight') ||
                                 target.closest('sup') || 
                                 target.closest('a');
    
    if (!isHighlightedElement) return;
    
    // Get the text content
    const highlightedElement = target.classList.contains('note-highlight') ? target : target.closest('.note-highlight');
    const sup = target.closest('sup');
    const a = target.closest('a');
    
    // Check if element has data-note-id attribute (set during highlighting)
    // Check all possible elements for the attribute
    const noteIdFromAttr = highlightedElement?.getAttribute('data-note-id') || 
                          sup?.getAttribute('data-note-id') || 
                          a?.getAttribute('data-note-id') ||
                          target.getAttribute('data-note-id');
    if (noteIdFromAttr) {
      handleNoteClick(noteIdFromAttr);
      return;
    }
    
    const idText = (highlightedElement?.innerText || sup?.innerText || a?.innerText || target.innerText || '').trim();
    if (!idText) return;
    
    // Extract B-prefixed note from patterns like "1B67", "43,44B70", "3: 1B67"
    // First try to extract B note from complex patterns
    const bNoteMatch = idText.match(/(\d+,\d+)?B(\d+)/i) || idText.match(/B(\d+)/i);
    if (bNoteMatch) {
      const noteId = `B${bNoteMatch[2] || bNoteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }
    
    // Extract N-prefixed note
    const nNoteMatch = idText.match(/N(\d+)/i);
    if (nNoteMatch) {
      const noteId = `N${nNoteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }
    
    // Detect verse pattern like (2:163) or 2:163
    const verseMatch = idText.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);
    if (verseMatch) {
      const [, s, v] = verseMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
    
    // Otherwise treat as note id
    handleNoteClick(idText);
  };

  // Style inline note markers like N895 or "3 26:3"
  const applyHighlighting = () => {
    if (!contentRef.current) return;
    
    // First, remove any existing highlighting to prevent duplicates
    const existingHighlights = contentRef.current.querySelectorAll('.note-highlight');
    existingHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize(); // Merge adjacent text nodes
    });
    
    // Find all potential note markers - both in sup/a tags and in regular text
    const textNodes = [];
    
    // Get all text nodes
    const walker = document.createTreeWalker(
      contentRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      // Only process text nodes that are not already inside highlighted elements
      if (node.parentElement && 
          !node.parentElement.classList.contains('note-highlight') &&
          !node.parentElement.closest('.note-highlight') &&
          node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    // Process text nodes that contain note patterns
    textNodes.forEach((textNode) => {
      let text = textNode.textContent;
      const parent = textNode.parentElement;
      
      if (!text || text.trim().length === 0) return;
      
      // First, handle B notes - they can appear in various formats
      // Patterns: B\d+, \d+B\d+, \d+,\d+B\d+, \d+:\d+B\d+, \d+:\s*\d+B\d+, etc.
      // We want to highlight just the B\d+ part, not the preceding numbers
      let hasBNotes = false;
      let highlightedText = text;
      
      // Find all B\d+ patterns and highlight them
      // This regex matches B followed by digits, regardless of what comes before
      highlightedText = text.replace(/(B\d+)/gi, (match, bNote) => {
        hasBNotes = true;
        const noteId = bNote.toUpperCase(); // e.g., "B70"
        return `<span class="note-highlight" data-note-id="${noteId}" style="color: #2AA0BF !important; text-decoration: none !important; cursor: pointer !important; font-weight: 600 !important;">${bNote}</span>`;
      });
      
      // Then handle N notes
      if (!hasBNotes || highlightedText === text) {
        const nNotePattern = /N\d+/g;
        if (nNotePattern.test(text)) {
          highlightedText = text.replace(nNotePattern, (match) => {
            return `<span class="note-highlight" data-note-id="${match.toUpperCase()}" style="color: #2AA0BF !important; text-decoration: none !important; cursor: pointer !important; font-weight: 600 !important;">${match}</span>`;
          });
        }
      } else {
        // If we already processed B notes, also check for N notes in the result
        highlightedText = highlightedText.replace(/N\d+/g, (match) => {
          return `<span class="note-highlight" data-note-id="${match.toUpperCase()}" style="color: #2AA0BF !important; text-decoration: none !important; cursor: pointer !important; font-weight: 600 !important;">${match}</span>`;
        });
      }
      
      // Handle verse patterns
      const versePattern = /\(?(\d+)\s*[:：]\s*(\d+)\)?/g;
      if (versePattern.test(text) && highlightedText === text) {
        highlightedText = text.replace(versePattern, (match) => {
          return `<span class="verse-highlight" style="color: #059669 !important; cursor: pointer !important; font-weight: 600 !important;">${match}</span>`;
        });
      }
      
      // Apply the changes if we made any modifications
      if (highlightedText !== text) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = highlightedText;
        
        // Replace the text node with the new content
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        parent.replaceChild(fragment, textNode);
      }
    });
    
    // Also handle existing sup/a tags
    const markers = contentRef.current.querySelectorAll('sup, a');
    markers.forEach((m) => {
      const t = (m.innerText || '').trim();
      // Note ids like N895, N1514
      if (/^N\d+$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
        m.setAttribute('data-note-id', t.toUpperCase());
        return;
      }
      // B-prefixed notes like B67, B68, or patterns like 1B67, 43,44B70
      // Extract just the B part
      const bNoteMatch = t.match(/(B\d+)/i);
      if (bNoteMatch) {
        const noteId = bNoteMatch[1].toUpperCase();
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
        m.setAttribute('data-note-id', noteId);
        return;
      }
      // Verse refs like 2:163 or (2:163)
      if (/^\(?\d+\s*[:：]\s*\d+\)?$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
        return;
      }
      // Range like "3 26:3"
      if (/^\d+\s+\d+:\d+$/.test(t)) {
        m.style.setProperty('color', '#2AA0BF', 'important');
        m.style.setProperty('text-decoration', 'none', 'important');
        m.style.setProperty('cursor', 'pointer', 'important');
        m.style.setProperty('font-weight', '600', 'important');
      }
    });
  };

  // Apply highlighting when content changes
  useEffect(() => {
    applyHighlighting();
  }, [content]);

  // Re-apply highlighting when popup closes to ensure it's still visible
  useEffect(() => {
    if (!isNoteOpen && !showAyahModal) {
      // Small delay to ensure DOM is ready
      setTimeout(applyHighlighting, 100);
    }
  }, [isNoteOpen, showAyahModal]);

  // Use MutationObserver to watch for DOM changes and re-apply highlighting
  useEffect(() => {
    if (!contentRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          shouldReapply = true;
        }
      });
      if (shouldReapply) {
        setTimeout(applyHighlighting, 50);
      }
    });

    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    return () => observer.disconnect();
  }, [content]);

  // Extract text content from API response
  const extractText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    // Common possible fields
    const preferredKeys = [
      "interpret_text",
      "interpretation",
      "text",
      "content",
      "meaning",
      "body",
      "desc",
      "description",
    ];
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0) return item[key];
    }
    // Fallback: first long string field
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) return v;
    }
    // Final fallback
    try { return JSON.stringify(item); } catch { return String(item); }
  };

  // Hardcoded note rendering removed; all note clicks navigate to /note/:id

  return (
    <>
           <style>
             {`
               .note-highlight {
                 color: #2AA0BF !important;
                 text-decoration: none !important;
                 cursor: pointer !important;
                 font-weight: 600 !important;
               }
               sup.note-highlight, a.note-highlight {
                 color: #2AA0BF !important;
                 text-decoration: none !important;
                 cursor: pointer !important;
                 font-weight: 600 !important;
               }
             `}
           </style>
    <InterpretationNavbar 
      interpretationNumber={iptNo} 
      surahName={`${surahId}- Surah`} 
      verseRange={range.replace(/-/g, " - ")}
      language={lang}
      onWordByWord={() => {}} 
    />
      <div className="w-full  mx-auto p-3 sm:p-4 lg:p-6 bg-white dark:bg-[#2A2C38] max-w-[1073px] ">
        <div className="space-y-4 sm:space-y-6">
          {/* Header controls (read-only display) */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <span>Surah: {surahId}</span>
            <span>• Range: {range}</span>
            <span>• Interpretation: {iptNo}</span>
            <span>• Lang: {lang}</span>
            <button 
              onClick={() => handleNoteClick('N189')}
              className="ml-4 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Note N189
            </button>
          </div>

          {loading && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading interpretation…</div>
          )}

          {error && (
            <div className="text-red-600 dark:text-red-400 py-4">{error}</div>
          )}

          {!loading && !error && content.length === 0 && (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">No interpretation found for this selection.</div>
          )}

          {/* Content */}
          {content.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-[#2A2C38] p-3 sm:p-4 lg:p-6 rounded-lg border-l-4 dark:border-[#2A2C38] border-white"
            >
              <div
                className="text-gray-800 dark:text-white leading-relaxed text-justify space-y-3 sm:space-y-4 prose prose-sm dark:prose-invert max-w-none"
                ref={contentRef}
                onClick={handleContentClick}
                style={{ fontFamily: "serif" }}
                dangerouslySetInnerHTML={{ __html: extractText(item) }}
              />
            </div>
          ))}

          {/* Navigation Block */}
      {/* Navigation Block - Fixed Bottom */}
<div className=" bottom-0 left-0 w-full flex justify-between gap-3 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2A2C38] z-50">
  <button
    className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] 
    text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
  >
    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
    <span className="text-xs sm:text-sm font-medium">Previous Ayah</span>
  </button>

  <button
    className="flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors group min-h-[44px] 
    text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-500"
  >
    <span className="text-xs sm:text-sm font-medium">Next Ayah</span>
    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
  </button>
</div>

        </div>
      </div>

      {/* Popups */}
      {isNoteOpen && (
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        noteId={selectedNote.id}
        noteContent={selectedNote.content}
      />
      )}
             {showAyahModal && ayahTarget.surahId && ayahTarget.verseId && (
               <AyahModal
                 surahId={ayahTarget.surahId}
                 verseId={ayahTarget.verseId}
                 onClose={() => setShowAyahModal(false)}
                 interpretationNo={iptNo}
                 language={lang}
               />
             )}
    </>
  );
};

export default MalayalamInterpreter;