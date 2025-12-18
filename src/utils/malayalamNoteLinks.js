/**
 * Utility function to process Malayalam interpretation text
 * and convert B, H, N, P, X followed by digits into clickable links
 * Example: B123, H456, N789, P2151, X123
 */

// Global state for note popup
let notePopupState = {
  isOpen: false,
  noteId: null,
  onOpen: null,
  onClose: null,
};

/**
 * Set note popup handlers (called from components)
 */
export const setNotePopupHandlers = (onOpen, onClose) => {
  notePopupState.onOpen = onOpen;
  notePopupState.onClose = onClose;
};

/**
 * Process Malayalam interpretation text and convert B, H, N, P, X followed by digits to clickable links
 * @param {string} text - The interpretation text to process
 * @returns {string} - Processed HTML with clickable note links
 */
export const processMalayalamNoteLinks = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Pattern to match B, H, N, P, X immediately followed by one or more digits
  // Examples: B123, H456, N789, P2151, X123, B123abc (matches B123 part)
  const noteLinkPattern = /([BHNPX])(\d+)/g;

  return text.replace(noteLinkPattern, (match, letter, number) => {
    // Check if already wrapped in a link element
    if (match.includes('malayalam-note-link')) {
      return match;
    }

    // Create clickable link with styling
    const noteId = `${letter}${number}`;
    const displayText = match; // Show as-is: B123, H456, etc.
    
    return `<a href="#" class="malayalam-note-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors font-semibold" data-note-id="${noteId}" title="Click to view note ${noteId}"><sup>${displayText}</sup></a>`;
  });
};

/**
 * Handle click on Malayalam note links
 * @param {Event} e - Click event
 */
export const handleMalayalamNoteLinkClick = (e) => {
  const target = e.target.closest('.malayalam-note-link');
  if (!target) return;

  e.preventDefault();
  e.stopPropagation();

  const noteId = target.getAttribute('data-note-id');

  if (noteId && notePopupState.onOpen) {
    // Open note popup
    notePopupState.onOpen(noteId);
  }
};

