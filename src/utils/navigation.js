/**
 * Utility functions for handling navigation with modifier key support
 * Supports Ctrl+Click (Windows/Linux) or Cmd+Click (Mac) to open in new tab
 */

/**
 * Checks if a modifier key (Ctrl or Cmd) is pressed
 * @param {MouseEvent|KeyboardEvent} event - The event object
 * @returns {boolean} - True if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
 */
export const isModifierKeyPressed = (event) => {
  return event.ctrlKey || event.metaKey;
};

/**
 * Handles navigation with modifier key support
 * - If Ctrl/Cmd is pressed: opens URL in new tab
 * - Otherwise: navigates normally using React Router
 * 
 * @param {string} url - The URL to navigate to
 * @param {Function} navigate - React Router navigate function
 * @param {MouseEvent} event - The click event
 * @param {Object} options - Additional options
 * @param {Function} options.onNavigate - Callback after normal navigation
 * @param {Function} options.onNewTab - Callback after opening new tab
 */
export const handleNavigation = (url, navigate, event, options = {}) => {
  const { onNavigate, onNewTab } = options;

  if (isModifierKeyPressed(event)) {
    // Open in new tab
    event.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onNewTab) onNewTab();
  } else {
    // Normal navigation
    event.preventDefault();
    navigate(url);
    if (onNavigate) onNavigate();
  }
};

/**
 * Creates a click handler that supports modifier keys
 * Works with elements that have a data-url attribute or a provided URL
 * 
 * @param {Function} navigate - React Router navigate function
 * @param {string|null} url - Optional URL (if not provided, reads from data-url attribute)
 * @param {Object} options - Additional options
 * @returns {Function} - Click handler function
 */
export const createNavigationHandler = (navigate, url = null, options = {}) => {
  return (event) => {
    // Get URL from parameter or data attribute
    const targetUrl = url || event.currentTarget?.getAttribute('data-url');
    
    if (!targetUrl) {
      console.warn('No URL provided for navigation');
      return;
    }

    handleNavigation(targetUrl, navigate, event, options);
  };
};

