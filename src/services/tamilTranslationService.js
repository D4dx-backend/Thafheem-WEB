/**
 * Tamil Translation Service - Hybrid Mode
 * API-first approach with SQL.js fallback
 * 
 * Features:
 * - Primary: REST API calls
 * - Fallback: SQL.js local database
 * - Toggle: Environment variable control
 * - Caching: In-memory with TTL
 * - No Interpretations: Tamil has no explanation/interpretation data
 * - Compatibility: Same method signatures
 * - Updated: Added missing methods for backward compatibility
 */
import { USE_API, API_BASE_URL, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';

class TamilTranslationService {
  constructor() {
    // Configuration
    this.useApi = true; // Force API mode since API is working
    this.apiBaseUrl = API_BASE_URL;
    this.language = 'tamil';
    
    // SQL.js configuration
    this.dbPath = '/quran_tamil.db';
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
   * Set cached data
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
   * Initialize SQL.js database
   * @returns {Promise<SQL.Database>} Database instance
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

      const response = await fetch(this.dbPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch Tamil DB: ${response.status} ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      return new SQL.Database(new Uint8Array(buffer));
    })();

    return this.dbPromise;
  }

  /**
   * API call with fallback to SQL.js
   * @param {string} method - Method name
   * @param {Object} params - Parameters
   * @param {Function} apiCall - API call function
   * @param {Function} fallbackCall - SQL.js fallback function
   * @returns {Promise<*>} Result
   */
  async apiCallWithFallback(method, params, apiCall, fallbackCall) {
    const cacheKey = this.generateCacheKey(method, params);
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = (async () => {
      try {
        // Try API first if enabled
        if (this.useApi) {
          try {
            const result = await apiCall();
            this.setCachedData(cacheKey, result);
            return result;
          } catch (apiError) {
            console.warn(`API call failed for ${method}, falling back to SQL.js:`, apiError.message);
          }
        }

        // Fallback to SQL.js
        const result = await fallbackCall();
        this.setCachedData(cacheKey, result);
        return result;
      } catch (error) {
        console.error(`Both API and SQL.js failed for ${method}:`, error);
        throw error;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Get translation for a specific ayah
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<string>} Translation text
   */
  async getAyahTranslation(surahNo, ayahNo) {
    return this.apiCallWithFallback(
      'getAyahTranslation',
      { surahNo, ayahNo },
      // API call
      async () => {
        const response = await apiService.getTranslation('tamil', surahNo, ayahNo);
        return response.translation_text || '';
      },
      // SQL.js fallback
      async () => {
        const db = await this.initDB();
        const stmt = db.prepare(
          `SELECT translation_text FROM tamil_translations WHERE chapter_number = ? AND verse_number = ?`
        );
        const row = stmt.getAsObject([surahNo, ayahNo]);
        stmt.free();
        return row && row.translation_text ? row.translation_text : '';
      }
    );
  }

  /**
   * Get all translations for a surah
   * @param {number} surahNo - Surah number
   * @returns {Promise<Array>} Array of translations
   */
  async getSurahTranslations(surahNo) {
    return this.apiCallWithFallback(
      'getSurahTranslations',
      { surahNo },
      // API call
      async () => {
        // Tamil API: Fetching surah translations
        const response = await apiService.getSurahTranslations('tamil', surahNo);
        // Tamil API: Received response
        const translations = response.translations || [];
        const mappedTranslations = translations.map(translation => ({
          number: translation.verse_number,
          ArabicText: '',
          Translation: translation.translation_text || ''
        }));
        // Tamil API: Mapped translations
        return mappedTranslations;
      },
      // SQL.js fallback
      async () => {
        const db = await this.initDB();
        const stmt = db.prepare(
          `SELECT verse_number, translation_text FROM tamil_translations WHERE chapter_number = ? ORDER BY verse_number ASC`
        );
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
        return translations;
      }
    );
  }

  /**
   * Get word-by-word data for an ayah
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Word-by-word data
   */
  async getWordByWordData(surahNo, ayahNo) {
    return this.apiCallWithFallback(
      'getWordByWordData',
      { surahNo, ayahNo },
      // API call
      async () => {
        const response = await apiService.getWordByWord('tamil', surahNo, ayahNo);
        return response.words || [];
      },
      // SQL.js fallback
      async () => {
        const db = await this.initDB();
        const stmt = db.prepare(
          `SELECT * FROM tamil_wordmeanings WHERE SuraId = ? AND AyaId = ? ORDER BY WordId ASC`
        );
        stmt.bind([surahNo, ayahNo]);
        
        const words = [];
        while (stmt.step()) {
          const row = stmt.getAsObject();
          words.push(row);
        }
        stmt.free();
        return words;
      }
    );
  }

  /**
   * Tamil has no interpretations - always returns N/A
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<string>} Always returns 'N/A'
   */
  async getExplanation(surahNo, ayahNo) {
    return 'N/A';
  }

  /**
   * Tamil has no interpretations - always returns empty array
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Always returns empty array
   */
  async getAllExplanations(surahNo, ayahNo) {
    return [];
  }

  /**
   * Tamil has no interpretations - always returns N/A
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @param {number} explanationNumber - Explanation number
   * @returns {Promise<string>} Always returns 'N/A'
   */
  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    return 'N/A';
  }

  /**
   * Fetch blockwise Tamil translations
   * @param {number} surahNo - Surah number
   * @param {number} startAyah - Start ayah
   * @param {number} endAyah - End ayah
   * @returns {Promise<Array>} Array of translations
   */
  async fetchBlockwiseTamil(surahNo, startAyah, endAyah) {
    return this.apiCallWithFallback(
      'fetchBlockwiseTamil',
      { surahNo, startAyah, endAyah },
      // API call - fetch individual translations
      async () => {
        const translations = [];
        for (let ayah = startAyah; ayah <= endAyah; ayah++) {
          const translation = await this.getAyahTranslation(surahNo, ayah);
          translations.push({
            ayah,
            translation: translation
          });
        }
        return translations;
      },
      // SQL.js fallback
      async () => {
        const db = await this.initDB();
        const stmt = db.prepare(
          `SELECT verse_number, translation_text FROM tamil_translations WHERE chapter_number = ? AND verse_number >= ? AND verse_number <= ? ORDER BY verse_number ASC`
        );
        stmt.bind([surahNo, startAyah, endAyah]);
        
        const translations = [];
        while (stmt.step()) {
          const row = stmt.getAsObject();
          translations.push({
            ayah: row.verse_number,
            translation: row.translation_text || ''
          });
        }
        stmt.free();
        return translations;
      }
    );
  }

  /**
   * Check if service is available
   * @returns {Promise<boolean>} Is available
   */
  async isAvailable() {
    try {
      if (this.useApi) {
        // Test API endpoint
        await apiService.getTranslation('tamil', 1, 1);
        return true;
      } else {
        // Test SQL.js database
        await this.initDB();
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if interpretations are available (always false for Tamil)
   * @returns {boolean} Always returns false
   */
  hasInterpretations() {
    return false;
  }

  /**
   * Check if database is downloaded (for compatibility with old service)
   * @returns {boolean} Always returns true for hybrid service
   */
  isDatabaseDownloaded() {
    return true;
  }

  /**
   * Download database (for compatibility with old service)
   * @returns {Promise<boolean>} Always returns true for hybrid service
   */
  async downloadDatabase() {
    // For hybrid service, we don't need to download database
    // as it uses API-first approach with SQL.js fallback
    return true;
  }

  /**
   * Clear cache
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
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.dbPromise = null;
  }
}

const tamilTranslationService = new TamilTranslationService();

// Debug: Verify service has required methods
// Tamil service methods and database status

// Debug functions (development only)
if (process.env.NODE_ENV === 'development') {
  window.debugTamilDB = async function() {
    try {
      const db = await tamilTranslationService.initDB();
      
      // Get table schema
      const schemaStmt = db.prepare("PRAGMA table_info(tamil_translations)");
      const columns = [];
      while (schemaStmt.step()) {
        const row = schemaStmt.getAsObject();
        columns.push(row);
      }
      schemaStmt.free();
      
      // Check sample data
      const sampleStmt = db.prepare("SELECT * FROM tamil_translations WHERE chapter_number = 1 AND verse_number = 1");
      const sampleData = [];
      while (sampleStmt.step()) {
        const row = sampleStmt.getAsObject();
        sampleData.push(row);
      }
      sampleStmt.free();
      
      return { columns, data: sampleData };
    } catch (error) {
      console.error('❌ Debug error:', error);
      return null;
    }
  };
  
  // Clear cache function
  window.clearTamilCache = function() {
    tamilTranslationService.clearCache();
  };
}

export default tamilTranslationService;