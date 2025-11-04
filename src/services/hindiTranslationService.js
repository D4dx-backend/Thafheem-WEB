// Hindi Translation Service - Hybrid API-first with SQL.js fallback
// Supports both API and SQL.js modes with automatic fallback
import { API_BASE_URL, USE_API, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';
class HindiTranslationService {
  constructor() {
    this.language = 'hindi';
    this.useApi = USE_API;
    this.cacheEnabled = CACHE_ENABLED;
    this.cacheTtl = CACHE_TTL;
    this.cache = new Map();
    this.pendingRequests = new Map();
    // SQL.js fallback properties
    // Use BASE_URL from Vite config to handle base path correctly
    const baseUrl = import.meta.env.BASE_URL || '/';
    this.dbPath = `${baseUrl}quran_hindi.db`.replace(/\/+/g, '/'); // Normalize slashes
    this.dbPromise = null;
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
   * Check if cached data is still valid
   * @param {number} timestamp - Cache timestamp
   * @returns {boolean} Is valid
   */
  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheTtl;
  }
  /**
   * Get cached data if valid
   * @param {string} cacheKey - Cache key
   * @returns {*} Cached data or null
   */
  getCachedData(cacheKey) {
    if (!this.cacheEnabled) return null;
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    // Remove expired cache
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
    if (!this.cacheEnabled) return;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  /**
   * Make API request with error handling
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} API response
   */
  async makeApiRequest(endpoint) {
    try {
      // Use fetch directly like Bangla service, or use apiService.makeRequest
      const url = new URL(`${API_BASE_URL}/api${endpoint}`);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
  /**
   * Initialize SQL.js database
   * @returns {Promise<Object>} SQL.js database instance
   */
  async initDB() {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = (async () => {
      // Wait until SQL.js loader is available
      await new Promise((resolve) => {
        const wait = () => {
          if (window.initSqlJs) resolve();
          else setTimeout(wait, 100);
        };
        wait();
      });
      const SQL = await window.initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
      });
      // Try fetching with base path first, then fallback to root path
      let response;
      let dbPath = this.dbPath;
      console.log(`📥 Fetching Hindi database from: ${dbPath}`);
      response = await fetch(dbPath);
      
      if (!response.ok) {
        // Fallback to root path if base path fails (common in development)
        const rootPath = '/quran_hindi.db';
        if (dbPath !== rootPath) {
          console.warn(`⚠️ Failed to fetch from ${dbPath} (${response.status}), trying root path: ${rootPath}`);
          dbPath = rootPath;
          response = await fetch(rootPath);
          if (!response.ok) {
            console.error(`❌ Failed to fetch Hindi DB from ${rootPath}: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch Hindi DB: ${response.status} ${response.statusText}`);
          }
        } else {
          console.error(`❌ Failed to fetch Hindi DB from ${dbPath}: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch Hindi DB: ${response.status} ${response.statusText}`);
        }
      }
      
      const buffer = await response.arrayBuffer();
      console.log(`✅ Successfully loaded Hindi database from: ${dbPath}`);
      return new SQL.Database(new Uint8Array(buffer));
    })();
    return this.dbPromise;
  }
  /**
   * Get ayah translation - API-first with SQL.js fallback
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
   * Get all surah translations - API-first with SQL.js fallback
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
   * Get word-by-word data - API-first with SQL.js fallback
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Array of word-by-word objects
   */
  async getWordByWordData(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahNo, ayahNo });
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
    const requestPromise = this._getWordByWordDataInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  /**
   * Get explanation/interpretation - API-first with SQL.js fallback
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<string|null>} Explanation text
   */
  async getExplanation(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getExplanation', { surahNo, ayahNo });
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
    const requestPromise = this._getExplanationInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  /**
   * Get all explanations/interpretations - API-first with SQL.js fallback
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Array of explanation objects
   */
  async getAllExplanations(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAllExplanations', { surahNo, ayahNo });
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      const pendingResult = await this.pendingRequests.get(cacheKey);
      return pendingResult;
    }
    // Create request promise
    const requestPromise = this._getAllExplanationsInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  /**
   * Get explanation by number - API-first with SQL.js fallback
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} explanationNumber - Explanation number
   * @returns {Promise<string|null>} Explanation text
   */
  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    const cacheKey = this.generateCacheKey('getExplanationByNumber', { surahNo, ayahNo, explanationNumber });
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
    const requestPromise = this._getExplanationByNumberInternal(surahNo, ayahNo, explanationNumber, cacheKey);
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
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/translation/${surahNo}/${ayahNo}`);
        if (apiResponse && apiResponse.translation_text) {
          // Cache the result
          this.setCachedData(cacheKey, apiResponse.translation_text);
          return apiResponse.translation_text;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for translation ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT translation_text 
        FROM hindi_translation 
        WHERE chapter_number = ? AND verse_number = ?
      `);
      stmt.bind([surahNo, ayahNo]);
      let translation = '';
      if (stmt.step()) {
        const row = stmt.getAsObject();
        translation = row.translation_text || '';
      }
      stmt.free();
      // Cache the result
      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Error fetching translation for ${surahNo}:${ayahNo}:`, error);
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
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/surah/${surahNo}`);
        if (apiResponse && apiResponse.translations && apiResponse.translations.length > 0) {
          // Map API response to expected format
          const mappedTranslations = apiResponse.translations.map(translation => ({
            number: translation.verse_number,
            ArabicText: '',
            Translation: translation.translation_text || ''
          }));
          // Cache the result
          this.setCachedData(cacheKey, mappedTranslations);
          return mappedTranslations;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for surah translations ${surahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT verse_number, translation_text 
        FROM hindi_translation 
        WHERE chapter_number = ? 
        ORDER BY verse_number ASC
      `);
      stmt.bind([surahNo]);
      const translations = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        translations.push({
          number: row.verse_number,
          ArabicText: '',
          Translation: row.translation_text || ''
        });
      }
      stmt.free();
      if (translations.length > 0) {
        // Cache the result
        this.setCachedData(cacheKey, translations);
        return translations;
      } else {
        console.warn(`⚠️ No translations found for ${surahNo}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching surah translations for ${surahNo}:`, error);
      throw error;
    }
  }
  /**
   * Internal method for getting word-by-word data
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of word-by-word objects
   */
  async _getWordByWordDataInternal(surahNo, ayahNo, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/wordbyword/${surahNo}/${ayahNo}`);
        if (apiResponse && apiResponse.words && apiResponse.words.length > 0) {
          // Cache the result
          this.setCachedData(cacheKey, apiResponse.words);
          return apiResponse.words;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for word-by-word ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT word, translation, transliteration 
        FROM hindi_wordbyword 
        WHERE surah_no = ? AND ayah_no = ? 
        ORDER BY word_order ASC
      `);
      stmt.bind([surahNo, ayahNo]);
      const words = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        words.push({
          word: row.word,
          translation: row.translation,
          transliteration: row.transliteration
        });
      }
      stmt.free();
      if (words.length > 0) {
        // Cache the result
        this.setCachedData(cacheKey, words);
        return words;
      } else {
        console.warn(`⚠️ No word-by-word data found for ${surahNo}:${ayahNo}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching word-by-word data for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }
  /**
   * Internal method for getting explanation
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string|null>} Explanation text
   */
  async _getExplanationInternal(surahNo, ayahNo, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/interpretation/${surahNo}/${ayahNo}`);
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          // Return the first explanation (main explanation)
          const explanation = apiResponse.explanations[0].explanation;
          // Cache the result
          this.setCachedData(cacheKey, explanation);
          return explanation;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for explanation ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT explanation, explanation_no_BN, explanation_no_EN 
        FROM hindi_explanation 
        WHERE surah_no = ? AND ayah_no = ?
        ORDER BY explanation_no_EN ASC
      `);
      stmt.bind([surahNo, ayahNo]);
      let explanation = null;
      if (stmt.step()) {
        const row = stmt.getAsObject();
        explanation = row.explanation;
      }
      stmt.free();
      if (explanation) {
        // Cache the result
        this.setCachedData(cacheKey, explanation);
        return explanation;
      } else {
        console.warn(`⚠️ No explanation found for ${surahNo}:${ayahNo}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching explanation for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }
  /**
   * Internal method for getting all explanations
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of explanation objects
   */
  async _getAllExplanationsInternal(surahNo, ayahNo, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/interpretation/${surahNo}/${ayahNo}`);
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          // Return all explanations
          const explanations = apiResponse.explanations.map(exp => ({
            explanation: exp.explanation,
            explanation_no_BN: exp.explanation_no_local,
            explanation_no_EN: exp.explanation_no_en
          }));
          // Cache the result
          this.setCachedData(cacheKey, explanations);
          return explanations;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for all explanations ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT explanation, explanation_no_BN, explanation_no_EN 
        FROM hindi_explanation 
        WHERE surah_no = ? AND ayah_no = ?
        ORDER BY explanation_no_EN ASC
      `);
    stmt.bind([surahNo, ayahNo]);
      const explanations = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
        explanations.push({
          explanation: row.explanation,
          explanation_no_BN: row.explanation_no_BN,
          explanation_no_EN: row.explanation_no_EN
        });
    }
    stmt.free();
      if (explanations.length > 0) {
        // Cache the result
        this.setCachedData(cacheKey, explanations);
    return explanations;
      } else {
        console.warn(`⚠️ No explanations found for ${surahNo}:${ayahNo}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching all explanations for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }
  /**
   * Internal method for getting explanation by number
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {string} explanationNumber - Explanation number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string|null>} Explanation text
   */
  async _getExplanationByNumberInternal(surahNo, ayahNo, explanationNumber, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/interpretation/${surahNo}/${ayahNo}`);
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          // Find explanation by number
          const explanation = apiResponse.explanations.find(exp => 
            exp.explanation_no_local === explanationNumber || 
            exp.explanation_no_en.toString() === explanationNumber
          );
          if (explanation) {
            // Cache the result
            this.setCachedData(cacheKey, explanation.explanation);
            return explanation.explanation;
          }
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for explanation by number ${surahNo}:${ayahNo}:${explanationNumber}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT explanation 
        FROM hindi_explanation 
        WHERE surah_no = ? AND ayah_no = ? AND (explanation_no_BN = ? OR explanation_no_EN = ?)
      `);
      stmt.bind([surahNo, ayahNo, explanationNumber, explanationNumber]);
      let explanation = null;
      if (stmt.step()) {
        const row = stmt.getAsObject();
        explanation = row.explanation;
      }
      stmt.free();
      if (explanation) {
        // Cache the result
        this.setCachedData(cacheKey, explanation);
        return explanation;
      } else {
        console.warn(`⚠️ No explanation found for ${surahNo}:${ayahNo}:${explanationNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching explanation by number for ${surahNo}:${ayahNo}:${explanationNumber}:`, error);
      throw error;
    }
  }
  /**
   * Check if service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isAvailable() {
    try {
      if (this.useApi) {
        // Test API availability
        await this.makeApiRequest(`/${this.language}/health`);
        return true;
      } else {
        // Test SQL.js availability
        const db = await this.initDB();
        return db !== null;
      }
    } catch (error) {
      console.warn(`⚠️ Service not available:`, error.message);
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
   * Parse Hindi translation text and make explanation numbers clickable
   * @param {string} htmlContent - HTML content with explanation numbers
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {string} HTML with clickable explanation numbers
   */
  parseHindiTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    // Find all sup tags with footnote links
    const supTags = tempDiv.querySelectorAll("sup.f-note");
    supTags.forEach((sup) => {
      const link = sup.querySelector("a");
      if (link) {
        const explanationNumber = link.textContent.trim();
        // Check if it's a valid Hindi number (१, २, ३, etc.) or English number
        if (/^[\d१२३४५६७८९०]+$/.test(explanationNumber)) {
          // Apply clickable button styling
          sup.style.cssText = `
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
          sup.addEventListener('mouseenter', () => {
            sup.style.backgroundColor = '#0ea5e9';
            sup.style.transform = 'scale(1.1)';
          });
          sup.addEventListener('mouseleave', () => {
            sup.style.backgroundColor = '#19B5DD';
            sup.style.transform = 'scale(1)';
          });
          // Set data attributes for click handling
          sup.setAttribute("data-footnote", explanationNumber);
          sup.setAttribute("data-surah", surahNo);
          sup.setAttribute("data-ayah", ayahNo);
          sup.setAttribute("title", `Click to view explanation ${explanationNumber}`);
          sup.className = "hindi-footnote-link";
          sup.innerHTML = explanationNumber;
        }
      }
    });
    return tempDiv.innerHTML;
  }
  /**
   * Destroy service and cleanup
   */
  destroy() {
    this.clearCache();
    this.dbPromise = null;
  }
}
// Export singleton instance
export default new HindiTranslationService();