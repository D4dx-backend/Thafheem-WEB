/**
 * Dynamic service loader for lazy loading translation services
 * Reduces initial bundle size by loading services only when needed
 */

// Cache for loaded services to avoid re-importing
const serviceCache = new Map();

/**
 * Lazy load a translation service by language code
 * @param {string} language - Language code (mal, hi, ur, bn, ta, E)
 * @returns {Promise<Object>} The translation service module
 */
export const loadTranslationService = async (language) => {
  // Return cached service if already loaded
  if (serviceCache.has(language)) {
    return serviceCache.get(language);
  }

  let service;
  
  try {
    switch (language) {
      case 'mal':
        // Malayalam is handled by the main API, no separate service needed
        return null;
        
      case 'hi':
        service = await import('../services/hindiTranslationService.js');
        break;
        
      case 'ur':
        service = await import('../services/urduTranslationService.js');
        break;
        
      case 'bn':
        service = await import('../services/banglaTranslationService.js');
        break;
        
      case 'ta':
        service = await import('../services/tamilTranslationService.js');
        break;
        
      case 'E':
        service = await import('../services/englishTranslationService.js');
        break;
        
      default:
        console.warn(`Unknown language: ${language}`);
        return null;
    }
    
    // Cache the loaded service
    const serviceModule = service.default || service;
    serviceCache.set(language, serviceModule);
    
    return serviceModule;
  } catch (error) {
    console.error(`Failed to load service for language ${language}:`, error);
    return null;
  }
};

/**
 * Lazy load word-by-word service by language code
 * @param {string} language - Language code
 * @returns {Promise<Object>} The word-by-word service module
 */
export const loadWordByWordService = async (language) => {
  const cacheKey = `wbw_${language}`;
  
  if (serviceCache.has(cacheKey)) {
    return serviceCache.get(cacheKey);
  }

  let service;
  
  try {
    switch (language) {
      case 'hi':
        service = await import('../services/hindiWordByWordService.js');
        break;
        
      case 'bn':
        service = await import('../services/banglaWordByWordService.js');
        break;
        
      case 'ta':
        service = await import('../services/tamilWordByWordService.js');
        break;
        
      default:
        return null;
    }
    
    const serviceModule = service.default || service;
    serviceCache.set(cacheKey, serviceModule);
    
    return serviceModule;
  } catch (error) {
    console.error(`Failed to load word-by-word service for language ${language}:`, error);
    return null;
  }
};

/**
 * Lazy load interpretation service by language code
 * @param {string} language - Language code
 * @returns {Promise<Object>} The interpretation service module
 */
export const loadInterpretationService = async (language) => {
  const cacheKey = `interp_${language}`;
  
  if (serviceCache.has(cacheKey)) {
    return serviceCache.get(cacheKey);
  }

  let service;
  
  try {
    switch (language) {
      case 'bn':
        service = await import('../services/banglaInterpretationService.js');
        break;
        
      default:
        return null;
    }
    
    const serviceModule = service.default || service;
    serviceCache.set(cacheKey, serviceModule);
    
    return serviceModule;
  } catch (error) {
    console.error(`Failed to load interpretation service for language ${language}:`, error);
    return null;
  }
};

/**
 * Preload services for a specific language
 * Useful for preloading when user selects a language
 * @param {string} language - Language code
 */
export const preloadLanguageServices = async (language) => {
  const promises = [
    loadTranslationService(language),
    loadWordByWordService(language),
    loadInterpretationService(language)
  ];
  
  await Promise.allSettled(promises);
};

/**
 * Clear service cache (useful for memory management or testing)
 */
export const clearServiceCache = () => {
  serviceCache.clear();
};

/**
 * Get cache size (for debugging/monitoring)
 */
export const getServiceCacheSize = () => {
  return serviceCache.size;
};


