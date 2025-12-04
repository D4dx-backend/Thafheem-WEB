import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import {
  fetchInterpretationRange,
  fetchInterpretation,
  fetchAllInterpretations,
  listSurahNames,
  fetchNoteById,
  fetchSurahs,
} from "../api/apifunction";
import NotePopup from "./NotePopup";
import AyahModal from "./AyahModal";
import InterpretationNavbar from "./InterpretationNavbar";
import BookmarkService from "../services/bookmarkService";
import hindiTranslationService from "../services/hindiTranslationService";
import urduTranslationService from "../services/urduTranslationService";
import englishTranslationService from "../services/englishTranslationService";
import { useAuth } from "../context/AuthContext";
import WordByWord from "../pages/WordByWord";

const BlockInterpretationModal = ({
  surahId,
  range,
  interpretationNo = 1,
  language = "en",
  footnoteId = null, // For English footnotes
  interpretationId = null,
  onClose,
  blockRanges = [],
}) => {
  const { user } = useAuth?.() || { user: null };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahDisplayName, setSurahDisplayName] = useState("");
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: "", content: null });
  const [showAyahModal, setShowAyahModal] = useState(false);
  const [ayahTarget, setAyahTarget] = useState({
    surahId: null,
    verseId: null,
  });
  const contentRefs = useRef([]);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [surahOptions, setSurahOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);
  const [currentSurahId, setCurrentSurahId] = useState(surahId);
  const [currentRange, setCurrentRange] = useState(range);
  const [currentInterpretationNo, setCurrentInterpretationNo] =
    useState(interpretationNo);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentFootnoteId, setCurrentFootnoteId] = useState(footnoteId); // For English footnotes
  const [currentInterpretationId, setCurrentInterpretationId] = useState(interpretationId);
  const [footnotesInRange, setFootnotesInRange] = useState([]); // Store footnotes for current range
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false); // Use ref to track closing state across renders
  const parseRangeString = useCallback((value) => {
    if (value == null) {
      return null;
    }
    const str = String(value).trim();
    if (!str) return null;
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      return Number.isFinite(num) ? { start: num, end: num, label: str } : null;
    }
    const match = str.match(/^(\d+)\s*-\s*(\d+)$/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      if (Number.isFinite(start) && Number.isFinite(end)) {
        return {
          start,
          end,
          label: start === end ? `${start}` : `${start}-${end}`,
        };
      }
    }
    return null;
  }, []);
  const normalizedBlockRanges = useMemo(() => {
    if (!Array.isArray(blockRanges) || blockRanges.length === 0) {
      return [];
    }

    const normalizeItem = (item) => {
      if (typeof item === "string" || typeof item === "number") {
        return parseRangeString(item);
      }

      if (item && typeof item === "object") {
        const start =
          item.AyaFrom ??
          item.ayafrom ??
          item.from ??
          item.start ??
          item.begin ??
          item.AyaFromId;
        const end =
          item.AyaTo ??
          item.ayato ??
          item.to ??
          item.end ??
          item.finish ??
          item.AyaToId ??
          start;

        if (start == null && typeof item.Range === "string") {
          return parseRangeString(item.Range);
        }

        if (start == null && typeof item.range === "string") {
          return parseRangeString(item.range);
        }

        const startNum = Number.parseInt(start, 10);
        const endNum = Number.parseInt(end, 10);
        if (Number.isFinite(startNum) && Number.isFinite(endNum)) {
          return {
            start: startNum,
            end: endNum,
            label: startNum === endNum ? `${startNum}` : `${startNum}-${endNum}`,
          };
        }
      }
      return null;
    };

    return blockRanges
      .map((item) => normalizeItem(item))
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)
      .map((block, index) => ({
        ...block,
        index,
      }));
  }, [blockRanges, parseRangeString]);

  // Helper function to extract all footnotes from a range for English
  const extractFootnotesFromRange = useCallback(async (surahId, range) => {
    try {
      const [start, end] = range.includes('-') 
        ? range.split('-').map(n => parseInt(n.trim(), 10))
        : [parseInt(range, 10), parseInt(range, 10)];
      
      const footnotes = [];
      
      // Fetch translation for each verse in the range
      for (let ayah = start; ayah <= end; ayah++) {
        try {
          const translation = await englishTranslationService.getAyahTranslation(surahId, ayah);
          if (translation) {
            // Extract footnotes using regex
            const footnoteRegex = /<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;
            let match;
            while ((match = footnoteRegex.exec(translation)) !== null) {
              const footnoteId = match[1];
              const footnoteNumber = parseInt(match[2], 10);
              footnotes.push({
                footnoteId,
                footnoteNumber,
                ayah
              });
            }
          }
        } catch (err) {
          console.warn(`[BlockInterpretationModal] Failed to fetch translation for ayah ${ayah}:`, err);
        }
      }
      
      // Sort by ayah, then by footnote number
      footnotes.sort((a, b) => {
        if (a.ayah !== b.ayah) return a.ayah - b.ayah;
        return a.footnoteNumber - b.footnoteNumber;
      });
      
      return footnotes;
    } catch (err) {
      console.error('[BlockInterpretationModal] ❌ Error extracting footnotes from range:', err);
      return [];
    }
  }, []); // No dependencies - function only uses parameters

  const moveToAdjacentFootnoteBlock = useCallback(
    async (direction) => {
      if (!normalizedBlockRanges.length || !currentRange) {
        return false;
      }

      const normalizedCurrent = parseRangeString(currentRange);
      if (!normalizedCurrent) {
        return false;
      }

      const currentIndex = normalizedBlockRanges.findIndex(
        (block) =>
          block.label === normalizedCurrent.label ||
          (block.start === normalizedCurrent.start && block.end === normalizedCurrent.end)
      );

      if (currentIndex === -1) {
        return false;
      }

      let nextIndex = currentIndex + direction;
      while (nextIndex >= 0 && nextIndex < normalizedBlockRanges.length) {
        const targetBlock = normalizedBlockRanges[nextIndex];
        try {
          const footnotes = await extractFootnotesFromRange(
            currentSurahId,
            targetBlock.label
          );
          if (Array.isArray(footnotes) && footnotes.length > 0) {
            const targetFootnote =
              direction > 0 ? footnotes[0] : footnotes[footnotes.length - 1];

            setCurrentRange(targetBlock.label);
            setCurrentFootnoteId(targetFootnote.footnoteId);
            setCurrentInterpretationNo(targetFootnote.footnoteNumber);
            setFootnotesInRange(footnotes);
            return true;
          }
        } catch (err) {
          console.warn(
            `[BlockInterpretationModal] Failed to load footnotes for block ${targetBlock.label}:`,
            err
          );
        }
        nextIndex += direction;
      }
      return false;
    },
    [
      normalizedBlockRanges,
      currentRange,
      currentSurahId,
      extractFootnotesFromRange,
      parseRangeString,
    ]
  );

  // Body scroll lock when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Sync props to state when they change
  useEffect(() => {
    setCurrentSurahId(surahId);
    setCurrentRange(range);
    setCurrentInterpretationNo(interpretationNo);
    setCurrentLanguage(language);
    setCurrentFootnoteId(footnoteId);
  }, [surahId, range, interpretationNo, language, footnoteId]);

  useEffect(() => {
    setCurrentInterpretationId(interpretationId);
  }, [surahId, range, interpretationNo, language, interpretationId]);

  // Handle close with animation
  const handleClose = (e) => {
    // Prevent event propagation to avoid triggering parent handlers
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prevent multiple close calls
    if (isClosingRef.current) {
      return;
    }
    
    isClosingRef.current = true;
    setIsClosing(true);
    
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Load surah name and options
  useEffect(() => {
    const loadSurahData = async () => {
      try {
        const names = await listSurahNames();
        setSurahOptions(
          names.map((n) => ({
            value: n.id,
            label: `${n.id}- ${n.english || "Surah"}`,
          }))
        );
        const found = names.find((s) => s.id === Number(currentSurahId));
        setSurahDisplayName(`${currentSurahId}- ${found?.english || "Surah"}`);
      } catch (err) {
        setSurahDisplayName(`${currentSurahId}- Surah`);
      }
    };

    if (currentSurahId) {
      loadSurahData();
    }
  }, [currentSurahId]);

  // Build range options for current surah (1..total ayahs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const surahs = await fetchSurahs();
        if (!mounted) return;
        const current = surahs.find((s) => s.number === Number(currentSurahId));
        const total = current?.ayahs || 286;
        const allAyahs = Array.from({ length: total }, (_, i) => String(i + 1));
        setRangeOptions(allAyahs);
      } catch (e) {
        // fallback to 1..50
        if (mounted)
          setRangeOptions(Array.from({ length: 50 }, (_, i) => String(i + 1)));
      }
    })();
    return () => {
      mounted = false;
    };
  }, [currentSurahId]);

  // Load interpretation content
  useEffect(() => {

    const loadInterpretation = async () => {
      if (!currentSurahId || !currentRange) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setContent([]);

        // For Malayalam, Hindi and Urdu, use their respective services/APIs
        let data;
        if (currentLanguage === 'mal') {
          const isSingle = /^\d+$/.test(currentRange);
          if (isSingle) {
            // Single verse - get all interpretations for that verse
            const interpretations = await fetchAllInterpretations(currentSurahId, parseInt(currentRange, 10), 'mal');
            // Filter by interpretation number if specified
            if (currentInterpretationNo && interpretations.length > 0) {
              const filtered = interpretations.filter(i => i.InterpretationNo === String(currentInterpretationNo) || i.interptn_no === currentInterpretationNo);
              data = filtered.length > 0 ? filtered : [interpretations[0]];
            } else {
              data = interpretations;
            }
          } else {
            // Range - use the range-based endpoint
            data = await fetchInterpretationRange(currentSurahId, currentRange, currentInterpretationNo, 'mal');
          }
        } else if (currentLanguage === 'hi') {
          const isSingle = /^\d+$/.test(currentRange);
          if (isSingle) {
            // Single verse - get explanation for that verse
            const explanation = await hindiTranslationService.getExplanation(currentSurahId, parseInt(currentRange, 10));
            data = explanation && explanation !== 'N/A' ? [{
              Interpretation: explanation,
              AudioIntrerptn: explanation,
              text: explanation,
              content: explanation,
              InterpretationNo: currentInterpretationNo
            }] : [];
          } else {
            // Range - parse range and get block-wise data
            const [startAyah, endAyah] = currentRange.split('-').map(num => parseInt(num.trim(), 10));
            const blockwiseData = await hindiTranslationService.fetchBlockwiseHindi(currentSurahId, startAyah, endAyah);
            data = blockwiseData.map(item => ({
              Interpretation: item.explanation,
              AudioIntrerptn: item.explanation,
              text: item.explanation,
              content: item.explanation,
              InterpretationNo: currentInterpretationNo,
              ayah: item.ayah
            }));
          }
        } else if (currentLanguage === 'ur') {
          const isSingle = /^\d+$/.test(currentRange);
          if (isSingle) {
            // Single verse - get explanation for that verse
            const explanation = await urduTranslationService.getExplanation(currentSurahId, parseInt(currentRange, 10));
            data = explanation && explanation !== 'N/A' ? [{
              Interpretation: explanation,
              AudioIntrerptn: explanation,
              text: explanation,
              content: explanation,
              InterpretationNo: currentInterpretationNo
            }] : [];
          } else {
            // Range - parse range and get block-wise data
            const [startAyah, endAyah] = currentRange.split('-').map(num => parseInt(num.trim(), 10));
            const blockwiseData = await urduTranslationService.fetchBlockwiseUrdu(currentSurahId, startAyah, endAyah);
            data = blockwiseData.map(item => ({
              Interpretation: item.translation, // Urdu blockwise only has translation
              AudioIntrerptn: item.translation,
              text: item.translation,
              content: item.translation,
              InterpretationNo: currentInterpretationNo,
              ayah: item.ayah
            }));
          }
        } else if (currentLanguage === 'E' || currentLanguage === 'en') {
          // For English, check if we have a footnote ID (from blockwise footnote click)
        if (currentFootnoteId || currentInterpretationId) {
          try {
            let explanation = '';
            if (currentInterpretationId) {
              explanation = await englishTranslationService.getInterpretationById(currentInterpretationId);
            } else if (currentFootnoteId) {
              explanation = await englishTranslationService.getExplanation(parseInt(currentFootnoteId, 10));
            }
            
            // Format as interpretation data structure
            data = explanation && explanation !== 'N/A' ? [{
              Interpretation: explanation,
              AudioIntrerptn: explanation,
              text: explanation,
              content: explanation,
              InterpretationNo: String(currentInterpretationNo), // Use displayed number for UI
              footnoteId: currentFootnoteId,
              interpretationId: currentInterpretationId,
            }] : [];
          } catch (footnoteErr) {
            console.error('[BlockInterpretationModal] ❌ Error fetching English interpretation:', {
              error: footnoteErr,
              message: footnoteErr?.message,
              footnoteId: currentFootnoteId,
              interpretationId: currentInterpretationId
            });
            throw footnoteErr;
          }
          } else {
            // For English interpretations (not footnotes), use the original interpretation API
            const isSingle = /^\d+$/.test(currentRange);
            const langCode = 'E'; // English uses 'E'
            
            try {
              if (isSingle) {
                data = await fetchInterpretation(
                  currentSurahId,
                  parseInt(currentRange, 10),
                  currentInterpretationNo,
                  langCode
                );
              } else {
                data = await fetchInterpretationRange(
                  currentSurahId,
                  currentRange,
                  currentInterpretationNo,
                  langCode
                );
              }
            } catch (fetchErr) {
              console.error('[BlockInterpretationModal] ❌ Error fetching interpretation:', {
                error: fetchErr,
                message: fetchErr?.message,
                surahId: currentSurahId,
                range: currentRange,
                interpretationNo: currentInterpretationNo,
                langCode: langCode
              });
              throw fetchErr; // Re-throw to be handled by outer catch
            }
          }
        } else {
          // For other languages, use the original interpretation API
          const isSingle = /^\d+$/.test(currentRange);
          const langCode = currentLanguage;
          
          try {
            if (isSingle) {
              data = await fetchInterpretation(
              currentSurahId,
              parseInt(currentRange, 10),
              currentInterpretationNo,
                langCode
              );
            } else {
              data = await fetchInterpretationRange(
              currentSurahId,
              currentRange,
              currentInterpretationNo,
                langCode
            );
            }
          } catch (fetchErr) {
            console.error('[BlockInterpretationModal] ❌ Error fetching interpretation:', fetchErr);
            throw fetchErr;
          }
        }

        // Normalize to array of items with a text/content field
        const items = Array.isArray(data) ? data : (data ? [data] : []);

        // Check if we got empty or invalid data
        // For English, data comes with 'Interpretation' field
        // For other languages, data comes with 'InterpretationText', 'interpret_text', or 'text' fields
        // Data is valid if at least ONE of these fields has content
        const hasContent = items.length > 0 && items[0] && (
          (items[0].Interpretation && items[0].Interpretation !== '' && items[0].Interpretation !== null && items[0].Interpretation !== undefined) ||
          (items[0].InterpretationText && items[0].InterpretationText !== '' && items[0].InterpretationText !== null && items[0].InterpretationText !== undefined) ||
          (items[0].interpret_text && items[0].interpret_text !== '' && items[0].interpret_text !== null && items[0].interpret_text !== undefined) ||
          (items[0].text && items[0].text !== '' && items[0].text !== null && items[0].text !== undefined)
        );
        const isEmpty = !hasContent;

        if (isEmpty) {
          console.warn(`[BlockInterpretationModal] ⚠️ No interpretation ${currentInterpretationNo} available for range ${currentRange}`, {
            language: currentLanguage,
            items: items
          });

          // Find the first available interpretation for this range
          // Parse the range to get first and last verse
          const rangeMatch = currentRange.match(/^(\d+)(?:-(\d+))?$/);
          const firstVerse = rangeMatch ? parseInt(rangeMatch[1], 10) : null;
          const lastVerse = rangeMatch && rangeMatch[2] ? parseInt(rangeMatch[2], 10) : firstVerse;
          const isSingleVerse = firstVerse === lastVerse;

          // Try to find an available interpretation
          let foundAvailable = false;
          
          // Handle Malayalam and English languages
          if (firstVerse && (currentLanguage === 'mal' || currentLanguage === 'E' || currentLanguage === 'en')) {
            try {
              // For single-verse ranges, use fetchAllInterpretations directly
              if (isSingleVerse) {
                // Use appropriate language code
                const langCode = currentLanguage === 'E' || currentLanguage === 'en' ? 'E' : 'mal';
                const allInterpretations = await fetchAllInterpretations(currentSurahId, firstVerse, langCode);
                if (allInterpretations && allInterpretations.length > 0) {
                  // Helper function to safely extract interpretation number (should be 1-10, not IDs like 671)
                  const getInterpretationNumber = (item, index) => {
                    // Try various fields, but validate the result is reasonable (1-20 max)
                    const candidates = [
                      item.InterpretationNo,
                      item.interpretationNo,
                      item.interptn_no,
                      item.resolvedInterpretationNo,
                      index + 1 // Fallback to index-based (0-indexed, so +1)
                    ];
                    
                    for (const candidate of candidates) {
                      const num = parseInt(String(candidate), 10);
                      // Validate: interpretation numbers should be 1-20 (reasonable range)
                      if (!isNaN(num) && num >= 1 && num <= 20) {
                        return num;
                      }
                    }
                    
                    // Final fallback: use index + 1 (ensures 1-based numbering)
                    return (index + 1) <= 20 ? (index + 1) : 1;
                  };
                  
                  // Try to find the current interpretation number first
                  let selectedInterpretation = allInterpretations.find((i, idx) => {
                    const iNo = getInterpretationNumber(i, idx);
                    return iNo === currentInterpretationNo;
                  });
                  
                  // If current interpretation not found, use the first available
                  if (!selectedInterpretation) {
                    selectedInterpretation = allInterpretations[0];
                  }
                  
                  // Get the index to calculate interpretation number
                  const selectedIndex = allInterpretations.indexOf(selectedInterpretation);
                  const interpretationNo = getInterpretationNumber(selectedInterpretation, selectedIndex);
                  
                  setCurrentInterpretationNo(interpretationNo);
                  setContent([selectedInterpretation]);
                  foundAvailable = true;
                  return; // Successfully loaded, exit early
                }
              } else {
                // For multi-verse ranges, check what interpretations are available for the first verse
                // Use appropriate language code
                const langCode = currentLanguage === 'E' || currentLanguage === 'en' ? 'E' : 'mal';
                const availableInterpretations = await fetchAllInterpretations(currentSurahId, firstVerse, langCode);
                if (availableInterpretations && availableInterpretations.length > 0) {
                  // Helper function to safely extract interpretation number (should be 1-10, not IDs like 671)
                  const getInterpretationNumber = (item, index) => {
                    // Try various fields, but validate the result is reasonable (1-20 max)
                    const candidates = [
                      item.InterpretationNo,
                      item.interpretationNo,
                      item.interptn_no,
                      item.resolvedInterpretationNo,
                      index + 1 // Fallback to index-based (0-indexed, so +1)
                    ];
                    
                    for (const candidate of candidates) {
                      const num = parseInt(String(candidate), 10);
                      // Validate: interpretation numbers should be 1-20 (reasonable range)
                      if (!isNaN(num) && num >= 1 && num <= 20) {
                        return num;
                      }
                    }
                    
                    // Final fallback: use index + 1 (ensures 1-based numbering)
                    return (index + 1) <= 20 ? (index + 1) : 1;
                  };
                  
                  // Try each available interpretation until we find one that works for the range
                  for (let idx = 0; idx < availableInterpretations.length; idx++) {
                    const interpretation = availableInterpretations[idx];
                    const interpretationNo = getInterpretationNumber(interpretation, idx);
                    
                    try {
                      // Use appropriate language code
                      const langCode = currentLanguage === 'E' || currentLanguage === 'en' ? 'E' : 'mal';
                      const rangeData = await fetchInterpretationRange(currentSurahId, currentRange, interpretationNo, langCode);
                      const rangeItems = Array.isArray(rangeData) ? rangeData : [rangeData];
                      
                      // Check if we got valid data
                      if (rangeItems.length > 0 && 
                          rangeItems[0] && 
                          Object.keys(rangeItems[0]).length > 0 &&
                          (rangeItems[0].Interpretation || rangeItems[0].interpret_text || rangeItems[0].text || '').trim() !== '') {
                        setCurrentInterpretationNo(interpretationNo);
                        setContent(rangeItems);
                        foundAvailable = true;
                        return; // Successfully loaded, exit early
                      }
                    } catch (rangeError) {
                      // Continue to next interpretation
                      continue;
                    }
                  }
                }
              }
            } catch (checkError) {
              console.warn('Failed to check available interpretations:', checkError);
            }
          }

          // If we didn't find an available interpretation, try interpretation 1 as fallback
          if (!foundAvailable) {
          if (currentInterpretationNo !== 1) {
            setCurrentInterpretationNo(1);
              // Silent update - will trigger useEffect again with interpretation=1
              return;
          } else {
            // Even interpretation 1 is not available for this range
            setError(`No interpretation available for verses ${currentRange}.`);
            setContent([]);
            }
          }
        } else {
          setContent(items);
        }
      } catch (err) {
        console.error(`[BlockInterpretationModal] ❌ Failed to load interpretation ${currentInterpretationNo}:`, {
          error: err,
          message: err?.message,
          stack: err?.stack,
          surahId: currentSurahId,
          range: currentRange,
          interpretationNo: currentInterpretationNo,
          language: currentLanguage
        });

        let errorMessage = "Failed to load interpretation";
        if (err.message?.includes("500")) {
          errorMessage = `Server error loading interpretation ${currentInterpretationNo}. Please try again later.`;
        } else if (err.message?.includes("404")) {
          errorMessage = `Interpretation ${currentInterpretationNo} not found for this selection.`;
        } else if (
          err.message?.includes("network") ||
          err.message?.includes("fetch")
        ) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = `Interpretation ${currentInterpretationNo} is not available.`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInterpretation();
  }, [currentSurahId, currentRange, currentInterpretationNo, currentLanguage, currentFootnoteId]);

  // Enhanced styling for note and verse markers
  const applySimpleStyling = () => {
    contentRefs.current.forEach((el) => {
      if (!el) return;

      // Handle existing sup/a tags - set data attributes and remove conflicting inline styles
      const markers = el.querySelectorAll("sup, a");
      markers.forEach((m) => {
        const text = (m.innerText || m.textContent || "").trim();
        if (!text) return;

        // Remove any existing inline styles that might interfere with CSS hover
        m.style.removeProperty("color");
        m.style.removeProperty("text-decoration");
        m.style.removeProperty("cursor");
        m.style.removeProperty("font-weight");

        // Apply data attributes for CSS styling and set click handlers
        if (/^N\d+$/.test(text)) {
          // Note references (N-prefixed)
          m.setAttribute("data-type", "note");
          m.setAttribute("data-value", text);
          m.onclick = handleNoteHighlightClick;
        } else if (/^B\d+$/.test(text)) {
          // Note references (B-prefixed)
          m.setAttribute("data-type", "note");
          m.setAttribute("data-value", text);
          m.onclick = handleNoteHighlightClick;
        } else if (/^\d+B\d+$/.test(text)) {
          // Number followed by B note like 1B67
          const bNoteMatch = text.match(/B(\d+)/i);
          if (bNoteMatch) {
            const noteId = `B${bNoteMatch[1]}`;
            m.setAttribute("data-type", "note");
            m.setAttribute("data-value", noteId);
            m.onclick = handleNoteHighlightClick;
          }
        } else if (/^\d+,\d+B\d+$/.test(text)) {
          // Multiple numbers followed by B note like 43,44B70
          const bNoteMatch = text.match(/B(\d+)/i);
          if (bNoteMatch) {
            const noteId = `B${bNoteMatch[1]}`;
            m.setAttribute("data-type", "note");
            m.setAttribute("data-value", noteId);
            m.onclick = handleNoteHighlightClick;
          }
        } else if (
          /^\(?\d+\s*[:：]\s*\d+\)?$/.test(text) ||
          /^\d+\s*[:：]\s*\d+$/.test(text) ||
          /അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*\d+\s+\d+:\d+/.test(text) ||
          /സൂക്തം:\s*\d+\s+\d+:\d+/.test(text)
        ) {
          // Verse references
          m.setAttribute("data-type", "verse");
          m.setAttribute("data-value", text);
          m.onclick = handleNoteHighlightClick;
        }
      });
    });
  };

  // Apply simple styling when content changes
  useEffect(() => {
    if (content.length > 0) {
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [content]);

  // Re-apply styling when popup closes
  useEffect(() => {
    if (!isNoteOpen && !showAyahModal && content.length > 0) {
      applySimpleStyling();
      setTimeout(applySimpleStyling, 100);
    }
  }, [isNoteOpen, showAyahModal]);

  const handleNoteClick = async (noteId) => {
    // Show loading state immediately
    setSelectedNote({ id: noteId, content: "Loading..." });
    setIsNoteOpen(true);

    try {
      // Fetch note from MySQL database via API
      const noteData = await fetchNoteById(noteId);

      // Try different possible content fields - prioritize NoteText from API response
      const content =
        noteData?.NoteText ||
        noteData?.note_text ||
        noteData?.content ||
        noteData?.html ||
        noteData?.text ||
        noteData?.body ||
        noteData?.description ||
        noteData?.note ||
        (typeof noteData === "string" ? noteData : null);

      if (content && content !== "Note content not available") {
        setSelectedNote({ id: noteId, content });
      } else {
        setSelectedNote({
          id: noteId,
          content: `<p style="color: #666;">Note content is not available.</p>`,
        });
      }
    } catch (err) {
      console.error(`Failed to fetch note ${noteId}:`, err.message);

      // Show user-friendly error message
      setSelectedNote({
        id: noteId,
        content: `
          <div class="note-content">
            <h3 style="color: #2AA0BF; margin-bottom: 10px;">Note ${noteId}</h3>
            <p style="color: #666;">Note content is temporarily unavailable. Please try again later.</p>
            <p style="color: #999; font-size: 0.9em; margin-top: 10px;">Error: ${err.message || 'Unknown error'}</p>
          </div>
        `,
      });
    }
  };

  // Direct click handler for note-highlight elements
  const handleNoteHighlightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target;
    const type = target.getAttribute("data-type");
    const value = target.getAttribute("data-value");
    const idText = target.innerText || target.textContent || "";

    if (!idText) return;

    // Use data attributes if available, otherwise fall back to text parsing
    if (type === "verse" || type === "range") {
      // Handle verse/range navigation
      const textToCheck = value || idText;

      // Check for Malayalam verse pattern first
      const malayalamMatch =
        textToCheck.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
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
    } else if (type === "note") {
      // Handle note navigation
      const noteId = value || idText;
      handleNoteClick(noteId);
      return;
    }

    // Fallback: detect patterns in text
    const malayalamMatch =
      idText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
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

  const handleContentClick = (e) => {
    const target = e.target;

    // Check if clicked element is a verse reference link
    const verseLink = target.closest('.verse-reference-link');
    if (verseLink) {
      e.preventDefault();
      e.stopPropagation();
      const surah = verseLink.getAttribute('data-surah');
      const ayah = verseLink.getAttribute('data-ayah');
      if (surah && ayah) {
        setAyahTarget({ surahId: parseInt(surah, 10), verseId: parseInt(ayah, 10) });
        setShowAyahModal(true);
        return;
      }
    }

    // Simple click detection for sup/a tags
    if (target.tagName === "SUP" || target.tagName === "A") {
      handleNoteHighlightClick(e);
      return;
    }

    // Fallback: text-based detection
    const clickedText = target.innerText || target.textContent || "";

    // Look for B-prefixed note patterns first (PRIORITY) - handle complex patterns
    // Patterns like "1B67", "43,44B70", "B67"
    const bNoteMatch = clickedText.match(/(\d+,\d+)?B(\d+)/i) || clickedText.match(/B(\d+)/i);
    if (bNoteMatch) {
      const noteId = `B${bNoteMatch[2] || bNoteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }

    // Look for N-prefixed note patterns
    const nNoteMatch = clickedText.match(/N(\d+)/i);
    if (nNoteMatch) {
      const noteId = `N${nNoteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }

    // Look for H-prefixed note patterns
    const hNoteMatch = clickedText.match(/H(\d+)/i);
    if (hNoteMatch) {
      const noteId = `H${hNoteMatch[1]}`;
      handleNoteClick(noteId);
      return;
    }

    // Look for Malayalam verse patterns first
    const malayalamMatch =
      clickedText.match(/അശ്ശുഅറാഅ്,?\s*സൂക്തം:\s*(\d+)\s+(\d+):(\d+)/) ||
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

  // Navbar handler functions
  const handlePickSurah = (value) => {
    setCurrentSurahId(parseInt(value, 10));
  };

  const handlePickRange = (value) => {
    setCurrentRange(String(value));
  };

  // Load footnotes for current range when opening with a footnote
  useEffect(() => {
    if ((currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId && currentRange) {
      const loadFootnotes = async () => {
        const footnotes = await extractFootnotesFromRange(currentSurahId, currentRange);
        setFootnotesInRange(footnotes);
      };
      loadFootnotes();
    } else {
      setFootnotesInRange([]);
    }
  }, [currentSurahId, currentRange, currentLanguage, currentFootnoteId, extractFootnotesFromRange]);

  // Check if there are more footnotes in adjacent blocks for English (without changing state)
  const checkAdjacentBlockFootnotes = useCallback(async (direction) => {
    if (!normalizedBlockRanges.length || !currentRange) {
      return false;
    }

    const normalizedCurrent = parseRangeString(currentRange);
    if (!normalizedCurrent) {
      return false;
    }

    const currentIndex = normalizedBlockRanges.findIndex(
      (block) =>
        block.label === normalizedCurrent.label ||
        (block.start === normalizedCurrent.start && block.end === normalizedCurrent.end)
    );

    if (currentIndex === -1) {
      return false;
    }

    let nextIndex = currentIndex + direction;
    while (nextIndex >= 0 && nextIndex < normalizedBlockRanges.length) {
      const targetBlock = normalizedBlockRanges[nextIndex];
      try {
        const footnotes = await extractFootnotesFromRange(
          currentSurahId,
          targetBlock.label
        );
        if (Array.isArray(footnotes) && footnotes.length > 0) {
          return true;
        }
      } catch (err) {
        // Continue checking next block
      }
      nextIndex += direction;
    }
    return false;
  }, [normalizedBlockRanges, currentRange, currentSurahId, extractFootnotesFromRange, parseRangeString]);

  // Check if there are more footnotes available (current range or adjacent blocks)
  const [hasNextFootnote, setHasNextFootnote] = useState(true);
  const [hasPrevFootnote, setHasPrevFootnote] = useState(true);

  useEffect(() => {
    if ((currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId && normalizedBlockRanges.length > 0) {
      let isCancelled = false;
      
      const checkAvailability = async () => {
        // Wait for footnotes to load if they're not loaded yet
        if (footnotesInRange.length === 0) {
          // Set defaults, will be updated when footnotes load
          setHasNextFootnote(true);
          setHasPrevFootnote(true);
          return;
        }

        const currentIndex = footnotesInRange.findIndex(f => f.footnoteId === currentFootnoteId);
        
        // Check if there's a next footnote in current range
        const hasNextInCurrent = currentIndex >= 0 && currentIndex < footnotesInRange.length - 1;
        if (hasNextInCurrent) {
          if (!isCancelled) setHasNextFootnote(true);
        } else {
          // Check next block
          const hasNextInNextBlock = await checkAdjacentBlockFootnotes(1);
          if (!isCancelled) setHasNextFootnote(hasNextInNextBlock);
        }

        // Check if there's a previous footnote in current range
        const hasPrevInCurrent = currentIndex > 0;
        if (hasPrevInCurrent) {
          if (!isCancelled) setHasPrevFootnote(true);
        } else {
          // Check previous block
          const hasPrevInPrevBlock = await checkAdjacentBlockFootnotes(-1);
          if (!isCancelled) setHasPrevFootnote(hasPrevInPrevBlock);
        }
      };
      
      checkAvailability();
      
      return () => {
        isCancelled = true;
      };
    } else {
      setHasNextFootnote(true);
      setHasPrevFootnote(true);
    }
  }, [currentLanguage, currentFootnoteId, footnotesInRange, normalizedBlockRanges, checkAdjacentBlockFootnotes]);

  const handlePrev = async () => {
    // Special handling for English footnotes
    if ((currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId) {
      if (footnotesInRange.length === 0) {
        console.warn('[BlockInterpretationModal] ⚠️ No footnotes loaded for range:', currentRange);
      } else {
        // Find current footnote index
        const currentIndex = footnotesInRange.findIndex(f => f.footnoteId === currentFootnoteId);
        
        if (currentIndex > 0) {
          // Go to previous footnote in the same range
          const prevFootnote = footnotesInRange[currentIndex - 1];
          setCurrentFootnoteId(prevFootnote.footnoteId);
          setCurrentInterpretationNo(prevFootnote.footnoteNumber);
          // Keep the same range
          return;
        }
      }

      const moved = await moveToAdjacentFootnoteBlock(-1);
      if (moved) {
        return;
      }
    }

    // First, check if we can navigate to previous interpretation number in the same range
    if (currentInterpretationNo > 1) {
      // Decrement interpretation number for the same range
      setCurrentInterpretationNo(currentInterpretationNo - 1);
      return;
    }

    // If we're at interpretation 1, navigate to previous range/block
    const current = String(currentRange);

    // Check if range is a single ayah (e.g., "5") or a range (e.g., "1-7")
    if (/^\d+$/.test(current)) {
      // Single ayah: decrement to previous ayah
      const v = parseInt(current, 10);
      if (v <= 1) {
        alert('Already at the first verse');
        return;
      }
      const newVerse = v - 1;
      setCurrentRange(String(newVerse));
      // When navigating to previous verse, try to find the highest available interpretation
      if (currentLanguage === 'mal') {
        try {
          const availableInterpretations = await fetchAllInterpretations(currentSurahId, newVerse, 'mal');
          if (availableInterpretations && availableInterpretations.length > 0) {
            // Use the last available interpretation (highest number)
            const lastInterpretation = availableInterpretations[availableInterpretations.length - 1];
            // Helper function to safely extract interpretation number
            const getInterpretationNumber = (item, index) => {
              const candidates = [
                item.InterpretationNo,
                item.interpretationNo,
                item.interptn_no,
                item.resolvedInterpretationNo,
                index + 1
              ];
              for (const candidate of candidates) {
                const num = parseInt(String(candidate), 10);
                if (!isNaN(num) && num >= 1 && num <= 20) {
                  return num;
                }
              }
              return (index + 1) <= 20 ? (index + 1) : 1;
            };
            const lastIndex = availableInterpretations.length - 1;
            const maxInterpretationNo = getInterpretationNumber(lastInterpretation, lastIndex);
            setCurrentInterpretationNo(maxInterpretationNo);
          }
        } catch (err) {
          // If fetching fails, keep interpretation 1
          console.warn('Failed to fetch available interpretations for previous verse:', err);
        }
      }
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      // Range: move to previous block of same size
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;

        if (a <= 1) {
          alert('Already at the first block');
          return;
        }

        const newA = Math.max(1, a - len);
        const newB = newA + len - 1;
        setCurrentRange(`${newA}-${newB}`);
        // When navigating to previous block, try to find the highest available interpretation
        if (currentLanguage === 'mal') {
          try {
            const availableInterpretations = await fetchAllInterpretations(currentSurahId, newA, 'mal');
            if (availableInterpretations && availableInterpretations.length > 0) {
              // Use the last available interpretation (highest number)
              const lastInterpretation = availableInterpretations[availableInterpretations.length - 1];
              // Helper function to safely extract interpretation number
              const getInterpretationNumber = (item, index) => {
                const candidates = [
                  item.InterpretationNo,
                  item.interpretationNo,
                  item.interptn_no,
                  item.resolvedInterpretationNo,
                  index + 1
                ];
                for (const candidate of candidates) {
                  const num = parseInt(String(candidate), 10);
                  if (!isNaN(num) && num >= 1 && num <= 20) {
                    return num;
                  }
                }
                return (index + 1) <= 20 ? (index + 1) : 1;
              };
              const lastIndex = availableInterpretations.length - 1;
              const maxInterpretationNo = getInterpretationNumber(lastInterpretation, lastIndex);
              setCurrentInterpretationNo(maxInterpretationNo);
            }
          } catch (err) {
            // If fetching fails, keep interpretation 1
            console.warn('Failed to fetch available interpretations for previous block:', err);
          }
        }
      }
    }
  };

  const handleNext = async () => {
    // Special handling for English footnotes
    if ((currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId) {
      if (footnotesInRange.length === 0) {
        console.warn('[BlockInterpretationModal] ⚠️ No footnotes loaded for range:', currentRange);
      } else {
        // Find current footnote index
        const currentIndex = footnotesInRange.findIndex(f => f.footnoteId === currentFootnoteId);
        
        if (currentIndex >= 0 && currentIndex < footnotesInRange.length - 1) {
          // Go to next footnote in the same range
          const nextFootnote = footnotesInRange[currentIndex + 1];
          setCurrentFootnoteId(nextFootnote.footnoteId);
          setCurrentInterpretationNo(nextFootnote.footnoteNumber);
          // Keep the same range
          return;
        }
      }

      const moved = await moveToAdjacentFootnoteBlock(1);
      if (moved) {
        return;
      }
    }

    // First, check if we can navigate to next interpretation number in the same range
    const nextInterpretationNo = currentInterpretationNo + 1;
    const rangeMatch = currentRange.match(/^(\d+)(?:-(\d+))?$/);
    const firstVerse = rangeMatch ? parseInt(rangeMatch[1], 10) : null;
    const lastVerse = rangeMatch && rangeMatch[2] ? parseInt(rangeMatch[2], 10) : firstVerse;
    const isSingleVerse = firstVerse === lastVerse;
    
    if (firstVerse && currentLanguage === 'mal') {
      try {
        // Check if next interpretation exists for current range
        let nextInterpretationExists = false;
        
        if (isSingleVerse) {
          // For single verse, check all interpretations
          const availableInterpretations = await fetchAllInterpretations(currentSurahId, firstVerse, 'mal');
          if (availableInterpretations && availableInterpretations.length > 0) {
            const getInterpretationNumber = (item, index) => {
              const candidates = [
                item.InterpretationNo,
                item.interpretationNo,
                item.interptn_no,
                item.resolvedInterpretationNo,
                index + 1
              ];
              for (const candidate of candidates) {
                const num = parseInt(String(candidate), 10);
                if (!isNaN(num) && num >= 1 && num <= 20) {
                  return num;
                }
              }
              return (index + 1) <= 20 ? (index + 1) : 1;
            };
            
            // Check if next interpretation number exists
            for (let idx = 0; idx < availableInterpretations.length; idx++) {
              const interpretationNo = getInterpretationNumber(availableInterpretations[idx], idx);
              if (interpretationNo === nextInterpretationNo) {
                nextInterpretationExists = true;
                break;
              }
            }
          }
        } else {
          // For range, try to fetch the next interpretation to see if it exists
          try {
            const rangeData = await fetchInterpretationRange(currentSurahId, currentRange, nextInterpretationNo, 'mal');
            const rangeItems = Array.isArray(rangeData) ? rangeData : [rangeData];
            
            // Check if we got valid data
            if (rangeItems.length > 0 && 
                rangeItems[0] && 
                Object.keys(rangeItems[0]).length > 0 &&
                (rangeItems[0].Interpretation || rangeItems[0].interpret_text || rangeItems[0].text || '').trim() !== '') {
              nextInterpretationExists = true;
            }
          } catch (rangeErr) {
            // Interpretation doesn't exist for this range
            nextInterpretationExists = false;
          }
        }
        
        // If next interpretation exists in current range, increment
        if (nextInterpretationExists) {
          setCurrentInterpretationNo(nextInterpretationNo);
          return;
        }
        
        // If next interpretation doesn't exist in current range, check next block
        // This handles cases where interpretation 5 starts in block 2-2
        const current = String(currentRange);
        if (/^(\d+)-(\d+)$/.test(current)) {
          const match = current.match(/^(\d+)-(\d+)$/);
          if (match) {
            const [, aStr, bStr] = match;
            const a = parseInt(aStr, 10);
            const b = parseInt(bStr, 10);
            const len = b - a + 1;
            const maxVerse = rangeOptions.length > 0 ? parseInt(rangeOptions[rangeOptions.length - 1], 10) : 286;
            
            // Check next block
            if (b < maxVerse) {
              const nextA = a + len;
              const nextB = Math.min(maxVerse, nextA + len - 1);
              const nextRange = `${nextA}-${nextB}`;
              
              // Try to find if the next interpretation exists in the next block
              try {
                if (nextA === nextB) {
                  // Single verse in next block
                  const nextBlockInterpretations = await fetchAllInterpretations(currentSurahId, nextA, 'mal');
                  if (nextBlockInterpretations && nextBlockInterpretations.length > 0) {
                    const getInterpretationNumber = (item, index) => {
                      const candidates = [
                        item.InterpretationNo,
                        item.interpretationNo,
                        item.interptn_no,
                        item.resolvedInterpretationNo,
                        index + 1
                      ];
                      for (const candidate of candidates) {
                        const num = parseInt(String(candidate), 10);
                        if (!isNaN(num) && num >= 1 && num <= 20) {
                          return num;
                        }
                      }
                      return (index + 1) <= 20 ? (index + 1) : 1;
                    };
                    
                    // Check if next interpretation exists in next block
                    for (let idx = 0; idx < nextBlockInterpretations.length; idx++) {
                      const interpretationNo = getInterpretationNumber(nextBlockInterpretations[idx], idx);
                      if (interpretationNo === nextInterpretationNo) {
                        // Next interpretation exists in next block, navigate there
                        setCurrentRange(nextRange);
                        setCurrentInterpretationNo(nextInterpretationNo);
                        return;
                      }
                    }
                  }
                } else {
                  // Range in next block
                  const nextRangeData = await fetchInterpretationRange(currentSurahId, nextRange, nextInterpretationNo, 'mal');
                  const nextRangeItems = Array.isArray(nextRangeData) ? nextRangeData : [nextRangeData];
                  
                  if (nextRangeItems.length > 0 && 
                      nextRangeItems[0] && 
                      Object.keys(nextRangeItems[0]).length > 0 &&
                      (nextRangeItems[0].Interpretation || nextRangeItems[0].interpret_text || nextRangeItems[0].text || '').trim() !== '') {
                    // Next interpretation exists in next block, navigate there
                    setCurrentRange(nextRange);
                    setCurrentInterpretationNo(nextInterpretationNo);
                    return;
                  }
                }
              } catch (nextBlockErr) {
                // Next interpretation doesn't exist in next block either
                // Continue to normal block navigation below
              }
            }
          }
        }
      } catch (err) {
        // If fetching fails, try incrementing anyway - useEffect will handle it
        console.warn('Failed to fetch available interpretations for next:', err);
      }
    }

    // If we're at the last interpretation, navigate to next range/block
    const current = String(currentRange);

    // Check if range is a single ayah (e.g., "5") or a range (e.g., "1-7")
    if (/^\d+$/.test(current)) {
      // Single ayah: increment to next ayah
      const v = parseInt(current, 10);

      // Check if we're at the last verse of the surah
      const maxVerse = rangeOptions.length > 0 ? parseInt(rangeOptions[rangeOptions.length - 1], 10) : 286;
      if (v >= maxVerse) {
        alert('Already at the last verse of this surah');
        return;
      }

      const nextVerse = v + 1;
      setCurrentRange(String(nextVerse));
      // When navigating to next verse, start with interpretation 1
      setCurrentInterpretationNo(1);
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      // Range: move to next block of same size
      const match = current.match(/^(\d+)-(\d+)$/);
      if (match) {
        const [, aStr, bStr] = match;
        const a = parseInt(aStr, 10);
        const b = parseInt(bStr, 10);
        const len = b - a + 1;

        // Check if we're at the last block
        const maxVerse = rangeOptions.length > 0 ? parseInt(rangeOptions[rangeOptions.length - 1], 10) : 286;
        if (b >= maxVerse) {
          alert('Already at the last block of this surah');
          return;
        }

        const newA = a + len;
        const newB = Math.min(maxVerse, newA + len - 1);
        setCurrentRange(`${newA}-${newB}`);
        // When navigating to next block, start with interpretation 1
        setCurrentInterpretationNo(1);
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
        currentSurahId,
        currentRange,
        surahDisplayName,
        currentInterpretationNo,
        currentLanguage
      );

      alert(
        `Saved interpretation for Surah ${currentSurahId}, verses ${currentRange}`
      );
    } catch (e) {
      console.error("Failed to bookmark interpretation", e);
      alert("Failed to save interpretation bookmark");
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  const handleShare = async () => {
    const shareText = `Interpretation ${currentInterpretationNo} — Surah ${currentSurahId} • Range ${currentRange}`;
    const shareUrl = `${window.location.origin}/interpretation-blockwise?surahId=${currentSurahId}&range=${currentRange}&ipt=${currentInterpretationNo}&lang=${currentLanguage}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title || "Thafheem",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copied to clipboard");
      }
    } catch (e) {
      console.error("Share failed", e);
      alert("Share failed: " + e.message);
    }
  };

  // Word-by-Word modal state
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [wordByWordVerse, setWordByWordVerse] = useState(1);

  const handleWordByWord = () => {
    const firstVerse = /^\d+/.exec(String(currentRange))?.[0] || "1";
    setWordByWordVerse(parseInt(firstVerse));
    setShowWordByWord(true);
  };

  // Process interpretation text to make verse references clickable with cyan blue styling
  const processVerseReferences = (text) => {
    if (!text || typeof text !== "string") return text;
    
    // Pattern to match verse references like (2:163), (1:2), 2:163, etc.
    // This regex matches:
    // - (2:163) - with parentheses
    // - 2:163 - without parentheses
    // - (1:2) - single digit surah/ayah
    const versePattern = /\(?(\d+)\s*[:：]\s*(\d+)\)?/g;
    
    return text.replace(versePattern, (match, surah, ayah) => {
      // Check if already wrapped in a clickable element
      if (match.includes('verse-reference-link')) {
        return match;
      }
      
      // Wrap in clickable span with cyan blue styling
      return `<span class="verse-reference-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors" data-surah="${surah}" data-ayah="${ayah}" title="Click to view Surah ${surah}, Verse ${ayah}">${match}</span>`;
    });
  };

  const extractText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") {
      return processVerseReferences(item);
    }

    // Common possible fields (check both lowercase and capitalized versions)
    const preferredKeys = [
      "interpret_text",
      "InterpretText",
      "Interpret_Text",
      "interpretation",
      "Interpretation",
      "text",
      "Text",
      "content",
      "Content",
      "meaning",
      "Meaning",
      "body",
      "Body",
      "desc",
      "Desc",
      "description",
      "Description",
    ];

    // Try each preferred key
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0) {
        // Removed excessive logging - only log on errors
        return processVerseReferences(item[key]);
      }
    }

    // Fallback: find any string field with substantial content
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) {
        return processVerseReferences(v);
      }
    }

    // If we still have nothing, log the structure and return empty message
    console.warn(`⚠️ No valid interpretation text found in item:`, item);
    return `<p class="text-gray-500 italic">No interpretation content available for interpretation ${currentInterpretationNo}</p>`;
  };

  const modalRoot = document.getElementById("modal-root") || document.body;

  return createPortal(
    <>
      <style>
        {`
        /* Entry animations */
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes modalSlideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
        }
        .animate-backdrop-fade-in {
          animation: backdropFadeIn 0.2s ease-out;
        }
        .animate-modal-slide-up {
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-modal-slide-down {
          animation: modalSlideDown 0.2s ease-in;
        }
        
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
        
        /* Urdu interpretation styling */
        .urdu-interpretation-content p {
          text-align: right !important;
          font-size: 16px !important;
          line-height: 2.6 !important;
          margin-bottom: 10px !important;
          font-family: 'Noto Nastaliq Urdu', 'JameelNoori', serif !important;
        }
        
        /* Urdu interpretation link (superscript) styling - matching Malayalam style */
        .urdu-interpretation-content sup.interpretation-link,
        .urdu-interpretation-content sup[data-interpretation],
        .urdu-interpretation-content sup.urdu-footnote-link,
        .urdu-interpretation-content sup[data-footnote-id] {
          margin-right: 4px !important;
          margin-left: -1px !important;
          margin-top: -15px !important;
          cursor: pointer !important;
          background-color: rgb(41, 169, 199) !important;
          color: rgb(255, 255, 255) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          border: none !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 1 !important;
          border-radius: 9999px !important;
          position: relative !important;
          z-index: 10 !important;
          top: 0px !important;
          min-width: 20px !important;
          min-height: 19px !important;
          text-align: center !important;
          transition: 0.2s ease-in-out !important;
          padding: 0 !important;
        }
        .urdu-interpretation-content sup.interpretation-link > a,
        .urdu-interpretation-content sup[data-interpretation] > a,
        .urdu-interpretation-content sup.urdu-footnote-link > a,
        .urdu-interpretation-content sup[data-footnote-id] > a {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
          color: inherit !important;
          font-weight: inherit !important;
          text-decoration: none !important;
          line-height: 1 !important;
        }
        .urdu-interpretation-content sup.interpretation-link:hover,
        .urdu-interpretation-content sup[data-interpretation]:hover,
        .urdu-interpretation-content sup.urdu-footnote-link:hover,
        .urdu-interpretation-content sup[data-footnote-id]:hover {
          background-color: #0891b2 !important;
          transform: scale(1.05) !important;
        }
        .urdu-interpretation-content sup.interpretation-link:active,
        .urdu-interpretation-content sup[data-interpretation]:active,
        .urdu-interpretation-content sup.urdu-footnote-link:active,
        .urdu-interpretation-content sup[data-footnote-id]:active {
          background-color: #0e7490 !important;
          transform: scale(0.95) !important;
        }
        `}
      </style>

      <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
        />

        {/* Modal Content */}
        <div
          className={`relative w-full ${
            currentLanguage === 'E' || currentLanguage === 'en'
              ? 'sm:w-auto sm:max-w-2xl' // Smaller max-width for English
              : 'sm:w-auto sm:max-w-4xl xl:max-w-[1073px]'
          } ${
            currentLanguage === 'E' || currentLanguage === 'en'
              ? 'sm:max-h-[95vh]' // Max height only, allow auto-sizing for smaller content
              : 'max-h-[85vh] sm:max-h-[90vh]'
          } bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl ${
            currentLanguage === 'E' || currentLanguage === 'en'
              ? 'flex flex-col' // Keep flex for layout but allow natural height
              : 'flex flex-col'
          } animate-slideUp sm:animate-fadeIn ${
            currentLanguage === 'E' || currentLanguage === 'en'
              ? '' // No overflow hidden, let content determine height
              : 'overflow-hidden'
          } ${isClosing ? 'animate-slideDown sm:animate-fadeOut' : ''
            }`}
          onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
          style={{
            ...(currentLanguage === 'E' || currentLanguage === 'en'
              ? {
                  // Auto-size based on content for English
                  maxWidth: '42rem', // Smaller max width (672px)
                  minWidth: 'min(90vw, 20rem)', // Ensure minimum readability
                  height: 'auto', // Natural height based on content
                  maxHeight: '95vh', // But cap at viewport height
                }
              : {})
          }}
        >
          {/* Drag Handle (Mobile) */}
          <div 
            className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab active:cursor-grabbing" 
            onClick={handleClose}
            style={{ pointerEvents: isClosing ? 'none' : 'auto' }}
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
          {/* Interpretation Navbar */}
          <div className="flex-shrink-0 z-10 bg-white dark:bg-gray-900">
            <InterpretationNavbar
              key={`navbar-${currentSurahId}-${currentRange}-${currentInterpretationNo}`}
              interpretationNumber={currentInterpretationNo}
              surahName={surahDisplayName}
              verseRange={currentRange.replace(/-/g, " - ")}
              language={currentLanguage}
              onClose={handleClose}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onWordByWord={handleWordByWord}
              bookmarking={isBookmarking}
              surahOptions={surahOptions}
              rangeOptions={rangeOptions}
              onPickSurah={handlePickSurah}
              onPickRange={handlePickRange}
              onPrev={
                (currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId && footnotesInRange.length > 0
                  ? hasPrevFootnote ? handlePrev : null
                  : handlePrev
              }
              onNext={
                (currentLanguage === 'E' || currentLanguage === 'en') && currentFootnoteId && footnotesInRange.length > 0
                  ? hasNextFootnote ? handleNext : null
                  : handleNext
              }
              isModal={true}
              hideTitle={!!currentFootnoteId} // Hide title for English footnotes
            />
          </div>

          {/* Content */}
          <div 
            className={`${
              currentLanguage === 'E' || currentLanguage === 'en'
                ? 'overflow-y-auto' // Natural height for English, scroll if needed
                : 'flex-1 overflow-y-auto'
            } px-4 sm:px-6 py-6 sm:py-8 ${currentLanguage === 'E' || currentLanguage === 'en' ? '' : 'min-h-0'}`}
            style={{
              ...(currentLanguage === 'E' || currentLanguage === 'en'
                ? {
                    maxHeight: 'calc(95vh - 120px)', // Account for header height
                  }
                : {})
            }}
          >
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading interpretation...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-500 dark:text-red-400 text-lg mb-2">
                  Failed to load interpretation
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && content.length === 0 && (
              <div className="text-center py-10 text-gray-600 dark:text-gray-300">
                No interpretation found for this selection.
              </div>
            )}

            {/* Interpretation Content */}
            <div className="font-poppins space-y-6 sm:space-y-8" key={`block-${currentSurahId}-${currentRange}-${currentInterpretationNo}`}>
              {content.map((item, idx) => {
                const isUrdu = currentLanguage === 'ur' || currentLanguage === 'urdu';
                return (
                  <div
                    key={`${currentSurahId}-${currentRange}-${currentInterpretationNo}-${item?.ID || item?.id || idx}`}
                    className="mb-6 sm:mb-8"
                  >
                    <div
                      className={`interpretation-content text-gray-700 leading-relaxed dark:text-gray-300 text-sm sm:text-base prose dark:prose-invert max-w-none ${isUrdu ? 'font-urdu-nastaliq urdu-interpretation-content' : ''}`}
                      ref={(el) => (contentRefs.current[idx] = el)}
                      onClick={handleContentClick}
                      style={{
                        pointerEvents: "auto",
                        position: "relative",
                        zIndex: 1,
                        ...(isUrdu ? {
                          textAlign: 'right',
                          fontSize: '16px',
                          lineHeight: '2.6',
                          fontFamily: "'Noto Nastaliq Urdu', 'JameelNoori', serif"
                        } : {})
                      }}
                      dir={isUrdu ? 'rtl' : 'ltr'}
                      dangerouslySetInnerHTML={{ __html: extractText(item) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Word-by-Word Modal from Interpretation */}
          {showWordByWord && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-[100000] pt-24 sm:pt-28 lg:pt-32 p-4 overflow-hidden">
              <WordByWord
                selectedVerse={wordByWordVerse}
                surahId={currentSurahId}
                onClose={() => setShowWordByWord(false)}
                onNavigate={setWordByWordVerse}
                onSurahChange={() => { }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Note Popup */}
      <NotePopup
        isOpen={isNoteOpen}
        onClose={() => setIsNoteOpen(false)}
        noteId={selectedNote.id}
        noteContent={selectedNote.content}
      />

      {/* Ayah Modal */}
      {showAyahModal && ayahTarget.surahId && ayahTarget.verseId && (
        <AyahModal
          surahId={ayahTarget.surahId}
          verseId={ayahTarget.verseId}
          onClose={() => setShowAyahModal(false)}
          interpretationNo={currentInterpretationNo}
          language={currentLanguage}
        />
      )}
    </>,
    modalRoot
  );
};

export default BlockInterpretationModal;
