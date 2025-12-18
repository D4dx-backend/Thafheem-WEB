/**
 * Utility function to process Malayalam interpretation text
 * and convert M1, M2, M3, etc. patterns into clickable links
 */

import { API_BASE_PATH } from '../config/apiConfig';

// Global state for media popup
let mediaPopupState = {
  isOpen: false,
  mediaId: null,
  onOpen: null,
  onClose: null,
};

/**
 * Set media popup handlers (called from components)
 */
export const setMediaPopupHandlers = (onOpen, onClose) => {
  mediaPopupState.onOpen = onOpen;
  mediaPopupState.onClose = onClose;
};

/**
 * Process Malayalam interpretation text and convert M1, M2, etc. to clickable links
 * @param {string} text - The interpretation text to process
 * @returns {string} - Processed HTML with clickable M1, M2 links
 */
export const processMalayalamMediaLinks = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Pattern to match M immediately followed by one or more digits (M1, M2, M10, M123, M123abc, etc.)
  const mediaLinkPattern = /M(\d+)/g;

    return text.replace(mediaLinkPattern, (match, number) => {
      // Check if already wrapped in a link element
      if (match.includes('malayalam-media-link')) {
        return match;
      }

      // Create clickable link with styling
      const mediaId = `M${number}`;
      const displayText = `Map ${number}`;
      
      return `<a href="#" class="malayalam-media-link inline-block cursor-pointer text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-600 dark:decoration-cyan-400/50 dark:hover:decoration-cyan-300 transition-colors font-semibold" data-media-id="${mediaId}" title="Click to view media ${mediaId}"><sup>${displayText}</sup></a>`;
    });
};

/**
 * Handle click on Malayalam media links
 * @param {Event} e - Click event
 */
export const handleMalayalamMediaLinkClick = (e) => {
  const target = e.target.closest('.malayalam-media-link');
  if (!target) return;

  e.preventDefault();
  e.stopPropagation();

  const mediaId = target.getAttribute('data-media-id');

  if (mediaId && mediaPopupState.onOpen) {
    // Open media popup
    mediaPopupState.onOpen(mediaId);
  }
};

