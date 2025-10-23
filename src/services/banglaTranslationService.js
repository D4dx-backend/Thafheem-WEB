/**
 * Bangla Translation Service - Hybrid Mode
 * API-first approach with SQL.js fallback
 * 
 * Features:
 * - Primary: REST API calls
 * - Fallback: SQL.js local database
 * - Toggle: Environment variable control
 * - Caching: In-memory with TTL
 * - Compatibility: Same method signatures
 */
import { USE_API, API_BASE_URL, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
class BanglaTranslationService {
  constructor() {
    // Configuration
    this.useApi = USE_API;
    this.apiBaseUrl = API_BASE_URL;
    this.language = 'bangla';
    // SQL.js configuration
    this.dbPath = '/quran_bangla.db';
    this.db = null;
    this.dbPromise = null;
    this.isDownloaded = false;
    // Caching
    this.cache = new Map();
    this.cacheEnabled = CACHE_ENABLED;
    this.cacheTtl = CACHE_TTL;
    // Request deduplication
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
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} API response
   */
  async makeApiRequest(endpoint, params = {}) {
    const url = new URL(`${this.apiBaseUrl}/api/v1${endpoint}`);
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  }
  /**
   * Initialize SQL.js database
   * @returns {Promise<Object>} Database instance
   */
  async initDB() {
    if (this.dbPromise) {
      return this.dbPromise;
    }
    this.dbPromise = (async () => {
      try {
        // Wait for SQL.js to be available
        await new Promise((resolve) => {
          const checkSQL = () => {
            if (window.initSqlJs) {
              resolve();
            } else {
              setTimeout(checkSQL, 100);
            }
          };
          checkSQL();
        });
        // Initialize SQL.js
        const SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        // Load the database file
        const response = await fetch(this.dbPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(buffer));
        // Verify database structure
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('📋 Database tables:', tables[0]?.values?.map(row => row[0]) || []);
        // Test query
        const testQuery = db.exec("SELECT COUNT(*) as count FROM bangla_translations");
        const totalRows = testQuery[0]?.values[0]?.[0] || 0;
        this.isDownloaded = true;
        return db;
      } catch (error) {
        console.error('❌ Failed to load database:', error);
        throw new Error(`Failed to load Bangla database: ${error.message}`);
      }
    })();
    return this.dbPromise;
  }
  /**
   * Get translation for specific ayah - API-first with SQL.js fallback
   * @param {number} surahId - Surah number
   * @param {number} ayahNumber - Ayah number
   * @returns {Promise<string|null>} Translation text
   */
  async getAyahTranslation(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahId, ayahNumber });
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
    const requestPromise = this._getAyahTranslationInternal(surahId, ayahNumber, cacheKey);
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
   * @param {number} surahId - Surah number
   * @param {number} ayahNumber - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<string|null>} Translation text
   */
  async _getAyahTranslationInternal(surahId, ayahNumber, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/translation/${surahId}/${ayahNumber}`);
        if (apiResponse && apiResponse.translation_text) {
          const translation = apiResponse.translation_text;
          // Cache the result
          this.setCachedData(cacheKey, translation);
          return translation;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for ${surahId}:${ayahNumber}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT translation_text 
        FROM bangla_translations 
        WHERE chapter_number = ? AND verse_number = ?
      `);
      stmt.bind([surahId, ayahNumber]);
      let translation = null;
      if (stmt.step()) {
        const row = stmt.getAsObject();
        translation = row.translation_text;
      }
      stmt.free();
      if (translation) {
        // Cache the result
        this.setCachedData(cacheKey, translation);
        return translation;
      } else {
        console.warn(`⚠️ No translation found for ${surahId}:${ayahNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching translation for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }
  /**
   * Get all translations for a surah - API-first with SQL.js fallback
   * @param {number} surahId - Surah number
   * @returns {Promise<Array>} Array of translations
   */
  async getSurahTranslations(surahId) {
    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahId });
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
    const requestPromise = this._getSurahTranslationsInternal(surahId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  /**
   * Internal method for getting surah translations
   * @param {number} surahId - Surah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Array>} Array of translations
   */
  async _getSurahTranslationsInternal(surahId, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/surah/${surahId}`);
        if (apiResponse && apiResponse.translations) {
          // Transform API response to match expected format
          const translations = apiResponse.translations.map(verse => ({
            number: verse.verse_number,
            ArabicText: '',
            Translation: verse.translation_text || ''
          }));
          // Cache individual ayahs
          translations.forEach(verse => {
            const ayahCacheKey = this.generateCacheKey('getAyahTranslation', { 
              surahId, 
              ayahNumber: verse.number 
            });
            this.setCachedData(ayahCacheKey, verse.Translation);
          });
          // Cache the full surah translations
          this.setCachedData(cacheKey, translations);
          return translations;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for surah ${surahId}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT verse_number, translation_text 
        FROM bangla_translations 
        WHERE chapter_number = ?
        ORDER BY verse_number ASC
      `);
      stmt.bind([surahId]);
      const translations = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        translations.push({
          number: row.verse_number,
          ArabicText: '',
          Translation: row.translation_text || ''
        });
        // Cache individual ayahs
        const ayahCacheKey = this.generateCacheKey('getAyahTranslation', { 
          surahId, 
          ayahNumber: row.verse_number 
        });
        this.setCachedData(ayahCacheKey, row.translation_text);
      }
      stmt.free();
      // Cache the full surah translations
      this.setCachedData(cacheKey, translations);
      return translations;
    } catch (error) {
      console.error(`❌ Error fetching surah translations for ${surahId}:`, error);
      throw error;
    }
  }
  /**
   * Get word-by-word data - API-first with SQL.js fallback
   * @param {number} surahId - Surah number
   * @param {number} ayahNumber - Ayah number
   * @returns {Promise<Object|null>} Word-by-word data
   */
  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahId, ayahNumber });
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
    const requestPromise = this._getWordByWordDataInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }
  /**
   * Internal method for getting word-by-word data
   * @param {number} surahId - Surah number
   * @param {number} ayahNumber - Ayah number
   * @param {string} cacheKey - Cache key
   * @returns {Promise<Object|null>} Word-by-word data
   */
  async _getWordByWordDataInternal(surahId, ayahNumber, cacheKey) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await this.makeApiRequest(`/${this.language}/word-by-word/${surahId}/${ayahNumber}`);
        if (apiResponse && apiResponse.words && apiResponse.words.length > 0) {
          // Transform API response to match expected format
          const words = apiResponse.words.map(word => ({
            id: word.WordId || word.id,
            position: word.WordId || word.id,
            audio_url: null,
            char_type_name: 'word',
            code_v1: word.code_v1 || '',
            code_v2: word.code_v2 || '',
            line_number: word.line_number || 1,
            page_number: word.page_number || 1,
            text_uthmani: word.text_uthmani || '',
            text_simple: word.text_simple || '',
            translation: {
              text: word.WordMeaning || word.translation?.text || '',
              language_name: 'English',
              resource_name: 'API Bangla Word Database'
            },
            transliteration: {
              text: word.WordPhrase || word.transliteration?.text || '',
              language_name: 'Bangla'
            }
          }));
          const wordByWordData = {
            text_uthmani: '',
            words: words,
            translations: []
          };
          // Cache the result
          this.setCachedData(cacheKey, wordByWordData);
          return wordByWordData;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for word-by-word ${surahId}:${ayahNumber}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT WordId, WordPhrase, WordMeaning 
        FROM bengla_wordmeanings 
        WHERE SuraId = ? AND AyaId = ?
        ORDER BY WordId ASC
      `);
      stmt.bind([surahId, ayahNumber]);
      const words = [];
      let wordIndex = 0;
      while (stmt.step()) {
        const row = stmt.getAsObject();
        words.push({
          id: row.WordId || wordIndex + 1,
          position: row.WordId || wordIndex + 1,
          audio_url: null,
          char_type_name: 'word',
          code_v1: '',
          code_v2: '',
          line_number: 1,
          page_number: 1,
          text_uthmani: '',
          text_simple: '',
          translation: {
            text: row.WordMeaning || '',
            language_name: 'English',
            resource_name: 'Local Bangla Word Database'
          },
          transliteration: {
            text: row.WordPhrase || '',
            language_name: 'Bangla'
          }
        });
        wordIndex++;
      }
      stmt.free();
      if (words.length > 0) {
        const wordByWordData = {
          text_uthmani: '',
          words: words,
          translations: []
        };
        // Cache the result
        this.setCachedData(cacheKey, wordByWordData);
        return wordByWordData;
      } else {
        console.warn(`⚠️ No word-by-word data found for ${surahId}:${ayahNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching word-by-word data for ${surahId}:${ayahNumber}:`, error);
      throw error;
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
        SELECT explanation, explanation_no_BNG, explanation_no_EN 
        FROM bengla_explanations 
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
            explanation_no_BNG: exp.explanation_no_local,
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
        SELECT explanation, explanation_no_BNG, explanation_no_EN 
        FROM bengla_explanations 
        WHERE surah_no = ? AND ayah_no = ?
        ORDER BY explanation_no_EN ASC
      `);
      stmt.bind([surahNo, ayahNo]);
      const explanations = [];
      while (stmt.step()) {
        const row = stmt.getAsObject();
        explanations.push({
          explanation: row.explanation,
          explanation_no_BNG: row.explanation_no_BNG,
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
   * Check if service is available
   * @returns {Promise<boolean>} Service availability
   */
  async isAvailable() {
    try {
      if (this.useApi) {
        // Test API health
        await this.makeApiRequest(`/${this.language}/health`);
        return true;
      } else {
        // Test SQL.js database
      await this.initDB();
      return this.isDownloaded;
      }
    } catch (error) {
      console.error('❌ Service not available:', error);
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
   * Parse Bangla translation text and make explanation numbers clickable
   * @param {string} htmlContent - HTML content with explanation numbers
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {string} HTML with clickable explanation numbers
   */
  parseBanglaTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    // Find all sup tags with f-note class (explanation numbers)
    const supTags = tempDiv.querySelectorAll("sup.f-note");
    supTags.forEach((sup) => {
      // Get the explanation number from the inner link
      const link = sup.querySelector("a");
      if (link) {
        const explanationNumber = link.textContent.trim();
        // Check if it's a valid explanation number (Bangla or English digits)
        if (/^[\d১২৩৪৫৬৭৮৯০]+$/.test(explanationNumber)) {
          // Style as round clickable button with cyan background
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
          // Add hover effect
          sup.addEventListener('mouseenter', () => {
            sup.style.backgroundColor = '#0ea5e9';
            sup.style.transform = 'scale(1.1)';
          });
          sup.addEventListener('mouseleave', () => {
            sup.style.backgroundColor = '#19B5DD';
            sup.style.transform = 'scale(1)';
          });
          // Add data attributes for click handling
          sup.setAttribute("data-explanation-number", explanationNumber);
          sup.setAttribute("data-surah", surahNo);
          sup.setAttribute("data-ayah", ayahNo);
          sup.setAttribute("title", `Click to view explanation ${explanationNumber}`);
          sup.className = "bangla-explanation-link";
          // Remove the inner link and just keep the number
          sup.innerHTML = explanationNumber;
        }
      }
    });
    return tempDiv.innerHTML;
  }
  /**
   * Get explanation by Bangla explanation number
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
        const apiResponse = await this.makeApiRequest(`/${this.language}/interpretation/${surahNo}/${ayahNo}`, { explanationNo: explanationNumber });
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          // Find the specific explanation by number
          const explanation = apiResponse.explanations.find(exp => 
            exp.explanation_no_local == explanationNumber || 
            exp.explanation_no_en == explanationNumber
          );
          if (explanation && explanation.explanation) {
            // Cache the result
            this.setCachedData(cacheKey, explanation.explanation);
            return explanation.explanation;
          }
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for Bangla explanation by number ${surahNo}:${ayahNo} (${explanationNumber}), falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback
    try {
      const db = await this.initDB();
      const stmt = db.prepare(`
        SELECT explanation, explanation_no_BNG, explanation_no_EN 
        FROM bengla_explanations 
        WHERE surah_no = ? AND ayah_no = ? AND explanation_no_BNG = ?
      `);
      stmt.bind([surahNo, ayahNo, explanationNumber]);
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
        console.warn(`⚠️ No Bangla explanation found for number ${explanationNumber} in Surah ${surahNo}, Ayah ${ayahNo}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching Bangla explanation ${explanationNumber} for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }
  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheEnabled: this.cacheEnabled,
      cacheTtl: this.cacheTtl,
      mode: this.useApi ? 'API-first' : 'SQL.js only'
    };
  }
}
// Export singleton instance
export default new BanglaTranslationService();