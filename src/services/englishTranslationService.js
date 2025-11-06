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
      // If API returns 503 (database not available), try Quran.com fallback
      if (error.message?.includes('503') || error.message?.includes('database not available')) {
        console.warn(`⚠️ English database not available, using Quran.com fallback for ${surahNo}:${ayahNo}`);
        return await this._getQuranComAyahFallback(surahNo, ayahNo, cacheKey);
      }
      console.error(`Error fetching English translation for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  /**
   * Fallback to Quran.com API for single ayah translation
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string>} Translation text
   */
  async _getQuranComAyahFallback(surahNo, ayahNo, cacheKey) {
    try {
      // Use Quran.com API translation ID 131 (Sahih International)
      const verseKey = `${surahNo}:${ayahNo}`;
      const response = await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${verseKey}?translations=131&fields=text_uthmani,translations`
      );
      if (!response.ok) {
        throw new Error(`Quran.com API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Get the translation text
      const translation = data.verse?.translations?.[0]?.text || '';
      
      // Cache the result
      if (translation) {
        this.setCachedData(cacheKey, translation);
      }
      return translation;
    } catch (error) {
      console.error(`Error fetching Quran.com fallback for ${surahNo}:${ayahNo}:`, error);
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
      // If API returns 503 (database not available), try Quran.com fallback
      if (error.message?.includes('503') || error.message?.includes('database not available')) {
        console.warn(`⚠️ English database not available, using Quran.com fallback for surah ${surahNo}`);
        return await this._getQuranComFallback(surahNo, cacheKey);
      }
      console.error(`Error fetching English surah translations for ${surahNo}:`, error);
      throw error;
    }
  }

  /**
   * Fallback to Quran.com API for English translations
   * @param {number} surahNo - Surah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of translation objects
   */
  async _getQuranComFallback(surahNo, cacheKey) {
    try {
      // Get chapter info first to get verse count
      const chapterResponse = await fetch(`https://api.quran.com/api/v4/chapters/${surahNo}`);
      if (!chapterResponse.ok) {
        throw new Error(`Quran.com API error: ${chapterResponse.status}`);
      }
      const chapterData = await chapterResponse.json();
      const verseCount = chapterData.chapter?.verses_count || 0;
      
      // Fetch all verses for the surah using verses endpoint
      const translations = [];
      for (let verseNum = 1; verseNum <= verseCount; verseNum++) {
        try {
          const verseKey = `${surahNo}:${verseNum}`;
          const verseResponse = await fetch(
            `https://api.quran.com/api/v4/verses/by_key/${verseKey}?translations=131&fields=text_uthmani,translations`
          );
          if (verseResponse.ok) {
            const verseData = await verseResponse.json();
            const translation = verseData.verse?.translations?.[0]?.text || '';
            translations.push({
              number: verseNum,
              ArabicText: '',
              Translation: translation
            });
          }
        } catch (verseError) {
          // Continue with next verse if one fails
          translations.push({
            number: verseNum,
            ArabicText: '',
            Translation: ''
          });
        }
      }
      
      // Cache the result
      if (translations.length > 0) {
        this.setCachedData(cacheKey, translations);
      }
      return translations;
    } catch (error) {
      console.error(`Error fetching Quran.com fallback for surah ${surahNo}:`, error);
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
      // Use backend base URL from config
      const response = await fetch(`${API_BASE_URL}/english/footnote/${footnoteId}`);
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
    
    // Fallback 1: handle <sup>n</sup> without foot_note attribute
    const bareSupElements = tempDiv.querySelectorAll("sup:not([foot_note])");
    bareSupElements.forEach((element) => {
      const num = (element.textContent || "").trim();
      if (!/^[0-9]+$/.test(num)) return;
      const button = document.createElement('span');
      button.className = 'english-footnote-link';
      button.setAttribute("data-footnote-id", num);
      button.setAttribute("data-surah", surahNo);
      button.setAttribute("data-ayah", ayahNo);
      button.setAttribute("title", `Click to view explanation ${num}`);
      button.textContent = num;
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
      element.parentNode.replaceChild(button, element);
    });

    // Fallback 2: replace plain text markers like (1), (2) with clickable spans
    function wrapPlainMarkers(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      const targets = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue;
        if (!text) continue;
        if (/\(\d+\)/.test(text)) {
          targets.push(node);
        }
      }
      targets.forEach((textNode) => {
        const frag = document.createDocumentFragment();
        const parts = textNode.nodeValue.split(/(\(\d+\))/g);
        parts.forEach((part) => {
          const m = part.match(/^\((\d+)\)$/);
          if (m) {
            const num = m[1];
            const span = document.createElement('span');
            span.className = 'english-footnote-link';
            span.setAttribute('data-footnote-id', num);
            span.setAttribute('data-surah', surahNo);
            span.setAttribute('data-ayah', ayahNo);
            span.setAttribute('title', `Click to view explanation ${num}`);
            span.textContent = num;
            span.style.cssText = `
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
            frag.appendChild(span);
          } else {
            frag.appendChild(document.createTextNode(part));
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
    }
    wrapPlainMarkers(tempDiv);
    
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
