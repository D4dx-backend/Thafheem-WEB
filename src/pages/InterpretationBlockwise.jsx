import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useSearchParams, useParams, useNavigate } from "react-router-dom";
import InterpretationNavbar from "../components/InterpretationNavbar";
import { fetchInterpretation, fetchInterpretationRange, listSurahNames, fetchSurahs, fetchNoteById } from "../api/apifunction";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";
import NotePopup from "../components/NotePopup";
import AyahModal from "../components/AyahModal";

// This page renders block-wise interpretation for a surah/verse range
// URL expected (query params): ?surahId=114&range=1-6&ipt=1&lang=en
const InterpretationBlockwise = (props) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();

  // Read params from query string or location.state
  const initialParams = useMemo(() => {
    const state = location.state || {};
    return {
      surahId: parseInt(
        props.surahId || searchParams.get("surahId") || state.surahId || routeParams.surahId || 1
      ),
      range: props.range || searchParams.get("range") || state.range || "1-7",
      ipt: parseInt(props.ipt || searchParams.get("ipt") || state.ipt || 1),
      lang: props.lang || searchParams.get("lang") || state.lang || "en",
    };
  }, [location.state, searchParams, routeParams, props.surahId, props.range, props.ipt, props.lang]);

  const [surahId, setSurahId] = useState(initialParams.surahId);
  const [range, setRange] = useState(initialParams.range);
  const [iptNo, setIptNo] = useState(initialParams.ipt);
  const [lang, setLang] = useState(initialParams.lang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahDisplayName, setSurahDisplayName] = useState("");
  const { user } = useAuth?.() || { user: null };
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [surahOptions, setSurahOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: "", content: null });
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [ayahTarget, setAyahTarget] = useState({ surahId: null, verseId: null });
  const contentRefs = useRef([]);

  // Update state when props change (important for when parent passes new values)
  useEffect(() => {
    if (props.surahId && parseInt(props.surahId) !== surahId) {
      setSurahId(parseInt(props.surahId));
    }
    if (props.range && props.range !== range) {
      setRange(props.range);
    }
    if (props.ipt && parseInt(props.ipt) !== iptNo) {
      setIptNo(parseInt(props.ipt));
    }
    if (props.lang && props.lang !== lang) {
      setLang(props.lang);
    }
  }, [props.surahId, props.range, props.ipt, props.lang, surahId, range, iptNo, lang]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setContent([]); // Clear previous content immediately
        
        console.log(`Loading interpretation: Surah ${surahId}, Range ${range}, Interpretation ${iptNo}`);

        // Decide between single verse vs range (e.g., "5" vs "1-7")
        const isSingle = /^\d+$/.test(range);
        const data = isSingle
          ? await fetchInterpretation(surahId, parseInt(range, 10), iptNo, lang)
          : await fetchInterpretationRange(surahId, range, iptNo, lang);

        console.log(`Received interpretation data for ${surahId}:${range}:`, data);
        
        // Normalize to array of items with a text/content field
        const items = Array.isArray(data) ? data : [data];
        setContent(items);
      } catch (err) {
        // Only log non-500 errors to reduce console noise
        if (!err.message?.includes('500')) {
          console.error('Failed to load interpretation:', err);
        }
        // Provide more specific error messages
        let errorMessage = "Failed to load interpretation";
        if (err.message?.includes('500')) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.message?.includes('404')) {
          errorMessage = "Interpretation not found for this selection.";
        } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
          errorMessage = "Network error. Please check your connection.";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Only load if we have valid parameters
    if (surahId && range) {
      load();
    }
  }, [surahId, range, iptNo, lang]);

  // Enhanced styling for note and verse markers - relies on CSS classes
  const applySimpleStyling = () => {
    contentRefs.current.forEach((el) => {
      if (!el) return;
      
      // Handle existing sup/a tags - set data attributes and remove conflicting inline styles
      const markers = el.querySelectorAll('sup, a');
      markers.forEach((m) => {
        const text = (m.innerText || m.textContent || '').trim();
        if (!text) return;
        
        // Remove any existing inline styles that might interfere with CSS hover
        m.style.removeProperty('color');
        m.style.removeProperty('text-decoration');
        m.style.removeProperty('cursor');
        m.style.removeProperty('font-weight');
        
        // Apply data attributes for CSS styling and set click handlers
        if (/^N\d+$/.test(text)) {
          // Note references
          m.setAttribute('data-type', 'note');
          m.setAttribute('data-value', text);
          m.onclick = handleNoteHighlightClick;
        } else if (/^\(?\d+\s*[:：]\s*\d+\)?$/.test(text) || 
                   /^\d+\s*[:：]\s*\d+$/.test(text) ||
                   /അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(text) || 
                   /സൂക്തം:\s*\d+\s+\d+:\d+/.test(text)) {
          // Verse references
          m.setAttribute('data-type', 'verse');
          m.setAttribute('data-value', text);
          m.onclick = handleNoteHighlightClick;
        }
      });
    });
  };

  // Apply simple styling when content changes
  useEffect(() => {
    if (content.length > 0) {
      // Apply simple styling immediately and also with a small delay to ensure DOM is ready
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [content]);

  // Re-apply styling when popup closes
  useEffect(() => {
    if (!isNoteOpen && !showAyahModal && content.length > 0) {
      // Apply styling immediately and also with a small delay to ensure DOM is ready
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [isNoteOpen, showAyahModal]);

  // Load surah English name for navbar display
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const names = await listSurahNames();
        if (!mounted) return;
        setSurahOptions(names.map(n => ({ value: n.id, label: `${n.id}- ${n.english || 'Surah'}` })));
        const found = names.find((s) => s.id === Number(surahId));
        if (mounted) setSurahDisplayName(`${surahId}- ${found?.english || "Surah"}`);
      } catch (_) {
        if (mounted) setSurahDisplayName(`${surahId}- Surah`);
      }
    })();
    return () => { mounted = false; };
  }, [surahId]);

  // Build range options for current surah (1..total ayahs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const surahs = await fetchSurahs();
        if (!mounted) return;
        const current = surahs.find(s => s.number === Number(surahId));
        const total = current?.ayahs || 286;
        const allAyahs = Array.from({ length: total }, (_, i) => String(i + 1));
        setRangeOptions(allAyahs);
      } catch (e) {
        // fallback to 1..50
        if (mounted) setRangeOptions(Array.from({ length: 50 }, (_, i) => String(i + 1)));
      }
    })();
    return () => { mounted = false; };
  }, [surahId]);

  const handleSelectSurah = () => {
    // Surah selection triggered
  };
  
  const handleSelectRange = () => {
    // Range selection triggered
  };

  const handlePickSurah = (value) => {
    setSurahId(parseInt(value, 10));
  };

  const handlePickRange = (value) => {
    setRange(String(value));
  };

  const handlePrev = () => {
    // if range is a single ayah, decrement; if a-b, move to previous block
    const current = String(range);
    if (/^\d+$/.test(current)) {
      const v = Math.max(1, parseInt(current, 10) - 1);
      setRange(String(v));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;
        const newA = Math.max(1, a - len);
        const newB = newA + len - 1;
        setRange(`${newA}-${newB}`);
      }
    }
  };

  const handleNext = () => {
    const current = String(range);
    if (/^\d+$/.test(current)) {
      const nextVerse = parseInt(current, 10) + 1;
      setRange(String(nextVerse));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;
        const newA = a + len;
        const newB = newA + len - 1;
        setRange(`${newA}-${newB}`);
      }
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      const userId = BookmarkService.getEffectiveUserId(user);
      
      // Use the new block interpretation bookmark method
      await BookmarkService.addBlockInterpretationBookmark(
        userId,
        surahId,
        range,
        surahDisplayName,
        iptNo,
        lang
      );
      
      alert(`Saved interpretation for Surah ${surahId}, verses ${range}`);
    } catch (e) {
      console.error("Failed to bookmark interpretation", e);
      alert('Failed to save interpretation bookmark');
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  const handleShare = async () => {
    const shareText = `Interpretation ${iptNo} — Surah ${surahId} • Range ${range}`;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title || "Thafheem", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copied to clipboard");
      }
    } catch (e) {
      console.error("Share failed", e);
      alert("Share failed: " + e.message);
    }
  };

  const handleWordByWord = () => {
    // Extract the first verse from the range for word-by-word view
    const firstVerse = /^\d+/.exec(String(range))?.[0] || "1";
    
    navigate(`/word-by-word/${surahId}/${firstVerse}`, {
      state: {
        from: location.pathname + location.search
      }
    });
  };

  // Fallback note content for when API fails
  const getFallbackNoteContent = (noteId) => {
    const fallbackNotes = {
      'N895': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N895</h3>
          <p>ലാത്ത് - ഇത് ഒരു പ്രാചീന അറബ് ദേവതയുടെ പേരാണ്. ഇസ്ലാമിന് മുമ്പുള്ള അറേബ്യയിൽ ഈ ദേവതയെ ആരാധിച്ചിരുന്നു.</p>
          <p>ഖുർആനിൽ ഈ ദേവതയെ പരാമർശിക്കുന്നത് ബഹുദൈവവാദത്തിന്റെ തെറ്റിനെ വിശദീകരിക്കാനാണ്.</p>
        </div>
      `,
      'N189': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N189</h3>
          <p>ഉസ്സ - ഇതും ഒരു പ്രാചീന അറബ് ദേവതയാണ്. ലാത്ത്, ഉസ്സ, മനാത് എന്നിവ മക്കയിലെ പ്രധാന ദേവതകളായിരുന്നു.</p>
          <p>ഇവയെ "അല്ലാഹുവിന്റെ പുത്രിമാർ" എന്ന് അവർ വിളിച്ചിരുന്നു.</p>
        </div>
      `,
      'N1514': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N1514</h3>
          <p>നബി(സ) തിരുമേനി ആ സന്ദർഭത്തിൽ അകപ്പെട്ടിരുന്ന സ്ഥിതിവിശേഷമാണിവിടെ സൂചിപ്പിക്കുന്നത്.</p>
          <p>നബി(സ)ക്കും സഹചാരികൾക്കും എതിരാളികൾ ഏൽപിച്ചിരുന്ന ദണ്ഡനപീഡനങ്ങളല്ല തിരുമേനിയെ ദുഃഖാകുലനാക്കിയിരുന്നതെന്ന് ഇതിൽനിന്ന് വ്യക്തമാണ്.</p>
        </div>
      `,
      'N1462': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note N1462</h3>
          <p>മുസ്ലിം ഹദീസ് ശേഖരത്തിലെ 1462-ാം നമ്പർ ഹദീസിനെ സൂചിപ്പിക്കുന്നു.</p>
          <p>ഈ ഹദീസ് നബി(സ)യുടെ ഉദാഹരണങ്ങളെക്കുറിച്ച് പ്രതിപാദിക്കുന്നു.</p>
        </div>
      `,
      '3 26:3': `
        <div class="note-content">
          <h3 style="color: #2AA0BF; margin-bottom: 10px;">Verse Reference 3:26:3</h3>
          <p>അശ്ശുഅറാഅ് സൂറയിലെ 26-ാം വാക്യത്തിന്റെ 3-ാം ഭാഗത്തെ സൂചിപ്പിക്കുന്നു.</p>
          <p>ഈ വാക്യം കവികളെക്കുറിച്ചും അവരുടെ പിന്തുടർച്ചക്കാരെക്കുറിച്ചും പ്രതിപാദിക്കുന്നു.</p>
        </div>
      `
    };
    
    return fallbackNotes[noteId] || null;
  };

  const handleNoteClick = async (noteId) => {
    // Show loading state immediately
    setSelectedNote({ id: noteId, content: 'Loading...' });
    setIsNoteOpen(true);
    
    // Try to get fallback content first (for immediate display)
    const fallbackContent = getFallbackNoteContent(noteId);
    if (fallbackContent) {
      setSelectedNote({ id: noteId, content: fallbackContent });
    }
    
    try {
      // Try to fetch from API (but don't block the UI)
      const noteData = await fetchNoteById(noteId);
      
      // Try different possible content fields
      const content = noteData?.content || 
                     noteData?.html || 
                     noteData?.text || 
                     noteData?.body ||
                     noteData?.description ||
                     noteData?.note ||
                     (typeof noteData === 'string' ? noteData : null);
      
      if (content && content !== 'Note content not available') {
        setSelectedNote({ id: noteId, content });
      } else {
        // Keep the fallback content that was already set
      }
    } catch (err) {
      // Error fetching note - only log non-500 and non-network errors to reduce console noise
      if (!err.message?.includes('500') && !err.message?.includes('Network error')) {
        console.warn(`Failed to fetch note ${noteId}:`, err.message);
      }
      
      // If no fallback content was set, show a user-friendly error
      if (!fallbackContent) {
        setSelectedNote({ 
          id: noteId, 
          content: `
            <div class="note-content">
              <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${noteId}</h3>
              <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            </div>
          `
        });
      }
      // Otherwise, keep the fallback content that was already set
    }
  };

  // Direct click handler for note-highlight elements
  const handleNoteHighlightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target;
    const type = target.getAttribute('data-type');
    const value = target.getAttribute('data-value');
    const idText = target.innerText || target.textContent || '';
    
    if (!idText) return;
    
    // Use data attributes if available, otherwise fall back to text parsing
    if (type === 'verse' || type === 'range') {
      // Handle verse/range navigation
      const textToCheck = value || idText;
      
      // Check for Malayalam verse pattern first
      const malayalamMatch = textToCheck.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) || 
                            textToCheck.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
      if (malayalamMatch) {
        const [, s, v] = malayalamMatch;
        setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
        setShowAyahModal(true);
        return;
      }
      
      // Check for standard verse pattern
      const verseMatch = textToCheck.match(/^\(?(\d+)\s*[:：]\s*(\d+)\)?$/);
      if (verseMatch) {
        const [, s, v] = verseMatch;
        setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
        setShowAyahModal(true);
        return;
      }
    } else if (type === 'note') {
      // Handle note navigation
      const noteId = value || idText;
      handleNoteClick(noteId);
      return;
    }
    
    // Fallback: detect patterns in text
    const malayalamMatch = idText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) || 
                          idText.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
    if (malayalamMatch) {
      const [, s, v] = malayalamMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
    
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

  // Expose the click handler to global scope for inline onclick handlers
  useEffect(() => {
    window.handleNoteHighlightClick = handleNoteHighlightClick;
    return () => {
      delete window.handleNoteHighlightClick;
    };
  }, []);

  // Simple function to restore styling when needed
  const restoreStyling = () => {
    setTimeout(applySimpleStyling, 50);
  };

  // Expose restore function globally for debugging
  useEffect(() => {
    window.restoreStyling = restoreStyling;
    return () => {
      delete window.restoreStyling;
    };
  }, []);

  const handleContentClick = (e) => {
    const target = e.target;
    
    // Simple click detection for sup/a tags
    if (target.tagName === 'SUP' || target.tagName === 'A') {
      handleNoteHighlightClick(e);
      return;
    }
    
    // Fallback: text-based detection
    const clickedText = target.innerText || target.textContent || '';
    
    // Look for note patterns first (PRIORITY)
    const noteMatch = clickedText.match(/N(\d+)/);
    if (noteMatch) {
      const noteId = `N${noteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }
    
    // Look for Malayalam verse patterns first
    const malayalamMatch = clickedText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) || 
                          clickedText.match(/സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/);
    if (malayalamMatch) {
      const [, s, v] = malayalamMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
    
    // Look for standard verse patterns
    const verseMatch = clickedText.match(/\(?(\d+)\s*[:：]\s*(\d+)\)?/);
    if (verseMatch) {
      const [, s, v] = verseMatch;
      setAyahTarget({ surahId: parseInt(s, 10), verseId: parseInt(v, 10) });
      setShowAyahModal(true);
      return;
    }
  };


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

  return (
    <>
      <style>
        {`
        /* Specific styling for note and verse markers in interpretation content */
        .interpretation-content sup[data-type="note"], 
        .interpretation-content a[data-type="note"],
        .interpretation-content sup[data-type="verse"], 
        .interpretation-content a[data-type="verse"] {
          transition: all 0.2s ease !important;
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
        }
        
        .interpretation-content sup[data-type="note"]:hover, 
        .interpretation-content a[data-type="note"]:hover,
        .interpretation-content sup[data-type="verse"]:hover, 
        .interpretation-content a[data-type="verse"]:hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        
        /* Fallback for elements without data-type but with note/verse patterns */
        .interpretation-content sup:not([data-type]), 
        .interpretation-content a:not([data-type]) {
          color: #2AA0BF !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          text-decoration: none !important;
          transition: all 0.2s ease !important;
        }
        
        .interpretation-content sup:not([data-type]):hover, 
        .interpretation-content a:not([data-type]):hover {
          color: #1e7a8c !important;
          text-decoration: underline !important;
          transform: scale(1.05) !important;
        }
        `}
      </style>
      <InterpretationNavbar
        interpretationNumber={iptNo}
        surahName={surahDisplayName}
        verseRange={range.replace(/-/g, " - ")}
        backTo={location.state?.from || undefined}
        onClose={props.onClose || location.state?.onClose}
        onSelectSurah={handleSelectSurah}
        onSelectRange={handleSelectRange}
        onBookmark={handleBookmark}
        onShare={handleShare}
        onWordByWord={handleWordByWord}
        bookmarking={isBookmarking}
        surahOptions={surahOptions}
        rangeOptions={rangeOptions}
        onPickSurah={handlePickSurah}
        onPickRange={handlePickRange}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#2A2C38]">
        {/* Header controls (read-only display) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Surah: {surahId}</span>
          <span>• Range: {range}</span>
          <span>• Interpretation: {iptNo}</span>
          <span>• Lang: {lang}</span>
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
        <div className="space-y-6">
          {content.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-lg border-l-4 dark:bg-[#2A2C38] dark:border-[#2A2C38] border-white"
            >
              <div
                className="interpretation-content text-gray-800 dark:text-white leading-relaxed text-justify whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                ref={(el) => (contentRefs.current[idx] = el)}
                onClick={handleContentClick}
                style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
                dangerouslySetInnerHTML={{ __html: extractText(item) }}
              />
            </div>
          ))}
        </div>
      </div>
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        noteId={selectedNote.id}
        noteContent={selectedNote.content}
      />
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

export default InterpretationBlockwise;
