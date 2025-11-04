import { useNavigate } from 'react-router-dom';
import { handleNavigation, isModifierKeyPressed } from '../utils/navigation';

/**
 * Custom hook for navigation with modifier key support (Ctrl/Cmd+Click)
 * 
 * @example
 * ```jsx
 * const navigateWithModifier = useNavigateWithModifier();
 * 
 * <button 
 *   data-url="/surah/1"
 *   onClick={navigateWithModifier}
 * >
 *   Click me
 * </button>
 * ```
 * 
 * @example
 * ```jsx
 * const navigateWithModifier = useNavigateWithModifier();
 * 
 * <button 
 *   onClick={(e) => navigateWithModifier(e, '/surah/1')}
 * >
 *   Click me
 * </button>
 * ```
 */
export const useNavigateWithModifier = () => {
  const navigate = useNavigate();

  /**
   * Navigation handler with modifier key support
   * @param {MouseEvent} event - Click event
   * @param {string|null} url - Optional URL (if not provided, reads from data-url attribute)
   * @param {Object} options - Additional options
   * @param {Function} options.onNavigate - Callback after normal navigation
   * @param {Function} options.onNewTab - Callback after opening new tab
   */
  const navigateHandler = (event, url = null, options = {}) => {
    // Get URL from parameter or data-url attribute
    const targetUrl = url || event.currentTarget?.getAttribute('data-url');
    
    if (!targetUrl) {
      console.warn('No URL provided for navigation. Use data-url attribute or pass URL as parameter.');
      return;
    }

    // Check if modifier key is pressed
    if (isModifierKeyPressed(event)) {
      // Open in new tab
      event.preventDefault();
      event.stopPropagation();
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if (options.onNewTab) options.onNewTab();
    } else {
      // Normal navigation
      event.preventDefault();
      event.stopPropagation();
      navigate(targetUrl);
      if (options.onNavigate) options.onNavigate();
    }
  };

  return navigateHandler;
};

