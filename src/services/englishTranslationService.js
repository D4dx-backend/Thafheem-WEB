// English Translation Service - Database-only approach
// Uses local English database for translations, explanations, and ayah ranges
import { API_BASE_PATH } from '../config/apiConfig.js';
import apiService from './apiService.js';

const DEFAULT_PAGE_SIZE = 40;
const MAX_PAGE_SIZE = 200;

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
   * @param {Object} options - Pagination options
   * @returns {Promise<Array|Object>} Translation array or paginated result
   */
  async getSurahTranslations(surahNo, options = {}) {
    const hasPagination = options && (options.page !== undefined || options.limit !== undefined);
    const page = Number.isInteger(options.page) && options.page > 0 ? options.page : 1;
    const requestedLimit = Number.isInteger(options.limit) && options.limit > 0 ? options.limit : DEFAULT_PAGE_SIZE;
    const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
    const cacheKey = this.generateCacheKey('getSurahTranslations', hasPagination ? { surahNo, page, limit } : { surahNo });
    
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
    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey, { page, limit, hasPagination });
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
   * @param {Object} options - Pagination context
   * @returns {Promise<Array|Object>} Translation data
   */
  async _getSurahTranslationsInternal(surahNo, cacheKey, { page, limit, hasPagination }) {
    try {
      const params = hasPagination ? { page, limit } : {};
      const response = await apiService.getSurahTranslations('english', surahNo, params);
      
      // Transform response from unified API format to expected format
      const translations = response?.translations?.map(verse => ({
        number: verse.verse_number,
        ArabicText: '',
        Translation: verse.translation_text || '',
        footnote_metadata: verse.footnote_metadata || null,
        interpretations: verse.interpretations || [],
        interpretationCount: verse.interpretationCount || 0
      })) || [];
      
      if (!hasPagination) {
        this.setCachedData(cacheKey, translations);
        return translations;
      }

      const pagination = response?.pagination
        ? {
            page: response.pagination.page ?? page,
            limit: response.pagination.limit ?? limit,
            totalItems: response.pagination.totalItems ?? response.pagination.total ?? null,
            totalPages: response.pagination.totalPages ?? null,
            hasNext: response.pagination.hasNext ?? false,
            hasPrev: response.pagination.hasPrev ?? page > 1,
            from: response.pagination.from ?? null,
            to: response.pagination.to ?? null,
          }
        : {
            page,
            limit,
            totalItems: response?.count ?? null,
            totalPages: response?.count ? Math.ceil(response.count / limit) : null,
            hasNext: translations.length === limit,
            hasPrev: page > 1,
            from: translations[0]?.number ?? null,
            to: translations[translations.length - 1]?.number ?? null,
          };

      const result = { translations, pagination };
      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`Error fetching English surah translations for ${surahNo}:`, error);
      throw error;
    }
  }

  /**
   * Get all interpretations for a specific ayah from database (no regex parsing)
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Array of interpretation objects
   */
  async getAllInterpretations(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAllInterpretations', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const request = this._getAllInterpretationsInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, request);

    try {
      return await request;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Internal method for getting all interpretations
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of interpretation objects
   */
  async _getAllInterpretationsInternal(surahNo, ayahNo, cacheKey) {
    try {
      // Fetch all interpretations directly from database (no regex parsing)
      const response = await fetch(`${API_BASE_PATH}/english/interpretation/all/${surahNo}/${ayahNo}`);
      if (!response.ok) {
        if (response.status === 404) {
          // No interpretations found - return empty array
          this.setCachedData(cacheKey, []);
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const interpretations = data.interpretations || [];
      
      // Cache the result
      this.setCachedData(cacheKey, interpretations);
      return interpretations;
    } catch (error) {
      console.error(`Error fetching all English interpretations for ${surahNo}:${ayahNo}:`, error);
      // Return empty array on error instead of throwing
      this.setCachedData(cacheKey, []);
      return [];
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
      const response = await fetch(`${API_BASE_PATH}/english/footnote/${footnoteId}`);
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

    const SUP_WRAPPER_STYLES = `
      vertical-align: super !important;
      font-size: 0.75em !important;
      line-height: 1 !important;
      margin-left: 2px !important;
      margin-right: 2px !important;
      font-weight: 600 !important;
    `;

    const FOOTNOTE_BADGE_STYLES = `
      cursor: pointer !important;
      background-color: #19B5DD !important;
      color: #ffffff !important;
      font-weight: 600 !important;
      text-decoration: none !important;
      border: none !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 11px !important;
      line-height: 1 !important;
      border-radius: 9999px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      text-align: center !important;
      transition: all 0.2s ease-in-out !important;
      padding-left: 4px !important;
      padding-right: 4px !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    `;

    const decorateFootnote = (supEl, number, attrs = {}) => {
      if (!supEl || !/^\d+$/.test(number)) {
        return null;
      }

      supEl.innerHTML = '';
      supEl.style.cssText = SUP_WRAPPER_STYLES;

      const badge = document.createElement('span');
      badge.className = 'english-footnote-link';
      badge.style.cssText = FOOTNOTE_BADGE_STYLES;
      badge.textContent = number;

      Object.entries(attrs || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          badge.setAttribute(key, value);
        }
      });

      badge.addEventListener('mouseenter', () => {
        badge.style.backgroundColor = '#0ea5e9';
        badge.style.transform = 'scale(1.05)';
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.backgroundColor = '#19B5DD';
        badge.style.transform = 'scale(1)';
      });

      supEl.appendChild(badge);
      supEl.setAttribute('data-english-processed', 'true');
      return badge;
    };

    const footnoteElements = tempDiv.querySelectorAll("sup[foot_note]");

    footnoteElements.forEach((element) => {
      const footnoteId = element.getAttribute('foot_note');
      const footnoteNumber = element.textContent.trim();

      if (footnoteId && footnoteNumber) {
        decorateFootnote(
          element,
          footnoteNumber,
          {
            "data-footnote-id": footnoteId,
            "data-surah": surahNo,
            "data-ayah": ayahNo,
            "data-footnote-number": footnoteNumber,
          }
        );
      }
    });

    return tempDiv.innerHTML;
  }

  async getInterpretationByNumber(surahNo, ayahNo, interpretationNo) {
    if (!Number.isFinite(surahNo) || !Number.isFinite(ayahNo) || !interpretationNo) {
      return '';
    }

    const cacheKey = this.generateCacheKey('englishInterpretation', {
      surahNo,
      ayahNo,
      interpretationNo
    });

    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await apiService.getInterpretation('english', surahNo, ayahNo, interpretationNo);
      const explanations = response?.explanations || [];
      const explanation =
        explanations.find((exp) => {
          const localNo = exp.explanation_no_local ?? exp.InterpretationNo ?? exp.interptn_no;
          const globalNo = exp.explanation_no_en ?? exp.InterpretationNo ?? exp.interptn_no;
          return String(localNo ?? globalNo ?? '').trim() === String(interpretationNo).trim();
        }) || explanations[0];

      const content = explanation?.explanation || '';
      this.setCachedData(cacheKey, content);
      return content;
    } catch (error) {
      console.error(`Error fetching English interpretation ${surahNo}:${ayahNo} [${interpretationNo}]:`, error);
      throw error;
    }
  }

  async getInterpretationById(interpretationId) {
    const numericId = Number.parseInt(interpretationId, 10);
    if (!Number.isFinite(numericId)) {
      return '';
    }

    const cacheKey = this.generateCacheKey('englishInterpretationId', { interpretationId: numericId });
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await apiService.makeRequest(`/english/interpretation/id/${numericId}`);
      const interpretation = response?.interpretation_text || response?.Interpretation || '';
      this.setCachedData(cacheKey, interpretation);
      return interpretation;
    } catch (error) {
      console.error(`Error fetching English interpretation by ID ${interpretationId}:`, error);
      throw error;
    }
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
