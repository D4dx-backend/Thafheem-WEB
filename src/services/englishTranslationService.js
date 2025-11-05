// English Translation Service - Database-only approach
// Uses local English database for translations, explanations, and ayah ranges
import { API_BASE_URL } from '../config/apiConfig.js';
import apiService from './apiService.js';

class EnglishTranslationService {
  constructor() {
    this.language = 'english';
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Generate cache key for requests
   * @param {string} method - Method name
   * @param {Object} params - Parameters
   * @returns {string} Cache key
   */
  generateCacheKey(method, params) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${method}${paramString ? `?${paramString}` : ''}`;
  }

  /**
   * Get cached data if valid
   * @param {string} cacheKey - Cache key
   * @returns {*} Cached data or null
   */
  getCachedData(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return cached.data;
    }
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  /**
   * Store data in cache
   * @param {string} cacheKey - Cache key
   * @param {*} data - Data to cache
   */
  setCachedData(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get ayah translation from English database
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<string>} Translation text
   */
  async getAyahTranslation(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahNo, ayahNo });
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._getAyahTranslationInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Get all surah translations from English database
   * @param {number} surahNo - Surah number
   * @returns {Promise<Array>} Array of translation objects
   */
  async getSurahTranslations(surahNo) {
    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahNo });
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Get English explanation by footnote ID
   * @param {number} footnoteId - Footnote ID
   * @returns {Promise<string>} Explanation text
   */
  async getExplanation(footnoteId) {
    const cacheKey = this.generateCacheKey('getExplanation', { footnoteId });
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._getExplanationInternal(footnoteId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Get ayah ranges for a surah
   * @param {number} surahNo - Surah number
   * @returns {Promise<Array>} Array of ayah ranges
   */
  async getAyahRanges(surahNo) {
    const cacheKey = this.generateCacheKey('getAyahRanges', { surahNo });
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._getAyahRangesInternal(surahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Internal method for getting ayah translation
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string>} Translation text
   */
  async _getAyahTranslationInternal(surahNo, ayahNo, cacheKey) {
    try {
      const response = await apiService.getTranslation('english', surahNo, ayahNo);
      // Unified API returns: { language, surah, ayah, translation_text }
      const translation = response.translation_text || response.translation || '';
      
      // Cache the result
      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`Error fetching English translation for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  /**
   * Internal method for getting surah translations
   * @param {number} surahNo - Surah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of translation objects
   */
  async _getSurahTranslationsInternal(surahNo, cacheKey) {
    try {
      const response = await apiService.getSurahTranslations('english', surahNo);
      
      // Transform response from unified API format to expected format
      // Unified API returns: { language, surah, count, translations: [{verse_number, translation_text}] }
      // Expected format: [{number, Translation}]
      const translations = response?.translations?.map(verse => ({
        number: verse.verse_number,
        ArabicText: '',
        Translation: verse.translation_text || ''
      })) || [];
      
      // Cache the result
      this.setCachedData(cacheKey, translations);
      return translations;
    } catch (error) {
      console.error(`Error fetching English surah translations for ${surahNo}:`, error);
      throw error;
    }
  }

  /**
   * Internal method for getting explanation
   * @param {number} footnoteId - Footnote ID
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string>} Explanation text
   */
  async _getExplanationInternal(footnoteId, cacheKey) {
    try {
      // Use the correct API endpoint: http://localhost:5000/api/english/footnote/{footnoteId}
      const response = await fetch(`http://localhost:5000/api/english/footnote/${footnoteId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const explanation = data.footnote_text || '';
      
      // Cache the result
      this.setCachedData(cacheKey, explanation);
      return explanation;
    } catch (error) {
      console.error(`Error fetching English explanation for footnote ${footnoteId}:`, error);
      throw error;
    }
  }

  /**
   * Internal method for getting ayah ranges
   * @param {number} surahNo - Surah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of ayah ranges
   */
  async _getAyahRangesInternal(surahNo, cacheKey) {
    try {
      const response = await apiService.makeRequest(`/english/ayahrange/${surahNo}`);
      const ranges = response || [];
      
      // Cache the result
      this.setCachedData(cacheKey, ranges);
      return ranges;
    } catch (error) {
      console.error(`Error fetching English ayah ranges for ${surahNo}:`, error);
      throw error;
    }
  }

  /**
   * Parse English translation text and make footnotes clickable
   * @param {string} htmlContent - HTML content with footnotes
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {string} HTML with clickable footnotes
   */
  parseEnglishTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    
    // Find all <sup> tags with foot_note attributes
    const footnoteElements = tempDiv.querySelectorAll("sup[foot_note]");
    
    footnoteElements.forEach((element) => {
      const footnoteId = element.getAttribute('foot_note');
      const footnoteNumber = element.textContent.trim();
      
      if (footnoteId && footnoteNumber) {
        // Create a clickable button element
        const button = document.createElement('span');
        button.className = 'english-footnote-link';
        button.setAttribute("data-footnote-id", footnoteId);
        button.setAttribute("data-surah", surahNo);
        button.setAttribute("data-ayah", ayahNo);
        button.setAttribute("title", `Click to view explanation ${footnoteNumber}`);
        button.textContent = footnoteNumber;
        
        // Apply clickable button styling
        button.style.cssText = `
          cursor: pointer !important;
          background-color: #19B5DD !important;
          color: #ffffff !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          border: none !important;
          padding: 4px 8px !important;
          margin: 0 4px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 12px !important;
          vertical-align: middle !important;
          line-height: 1 !important;
          border-radius: 50% !important;
          position: relative !important;
          top: 0 !important;
          min-width: 24px !important;
          min-height: 24px !important;
          text-align: center !important;
          transition: all 0.2s ease-in-out !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        `;
        
        // Add hover effects
        button.addEventListener('mouseenter', () => {
          button.style.backgroundColor = '#0ea5e9';
          button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
          button.style.backgroundColor = '#19B5DD';
          button.style.transform = 'scale(1)';
        });
        
        // Replace the original <sup> element with the clickable button
        element.parentNode.replaceChild(button, element);
      }
    });
    
    return tempDiv.innerHTML;
  }

  /**
   * Check if service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isAvailable() {
    try {
      // Test API availability
      await apiService.getTranslation('english', 1, 1);
      return true;
    } catch (error) {
      console.warn('English service not available:', error.message);
      return false;
    }
  }

  /**
   * Clear all caches
   */
  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Destroy service and cleanup
   */
  destroy() {
    this.clearCache();
  }
}

// Export singleton instance
export default new EnglishTranslationService();
