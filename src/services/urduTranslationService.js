/**
 * Urdu Translation Service - Hybrid Mode
 * API-first approach with SQL.js fallback
 * 
 * Features:
 * - Primary: REST API calls
 * - Fallback: SQL.js local database
 * - Toggle: Environment variable control
 * - Caching: In-memory with TTL
 * - HTML Parsing: Clickable footnotes
 * - Compatibility: Same method signatures
 */
import { USE_API, API_BASE_URL, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';

class UrduTranslationService {
  constructor() {
    // Configuration
    this.useApi = USE_API;
    this.apiBaseUrl = API_BASE_URL;
    this.language = 'urdu';
    
    // SQL.js configuration
    this.dbPath = '/quran_urdu.db';
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
  async initUrduDB() {
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
        throw new Error(`Failed to fetch Urdu DB: ${response.status} ${response.statusText}`);
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
        const response = await apiService.get(`/api/urdu/translation/${surahNo}/${ayahNo}`);
        return response.translation_text || '';
      },
      // SQL.js fallback
      async () => {
        const db = await this.initUrduDB();
        const stmt = db.prepare(
          `SELECT translation_text FROM urdu_tranlations WHERE chapter_number = ? AND verse_number = ?`
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
        const response = await apiService.get(`/api/urdu/translation/${surahNo}`);
        return response.translations || [];
      },
      // SQL.js fallback
      async () => {
        const db = await this.initUrduDB();
        const stmt = db.prepare(
          `SELECT verse_number, translation_text FROM urdu_tranlations WHERE chapter_number = ? ORDER BY verse_number ASC`
        );
        stmt.bind([surahNo]);
        
        const translations = [];
        while (stmt.step()) {
          const row = stmt.getAsObject();
          translations.push({
            verse_number: row.verse_number,
            translation_text: row.translation_text || ''
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
        const response = await apiService.get(`/api/urdu/word-by-word/${surahNo}/${ayahNo}`);
        return response.words || [];
      },
      // SQL.js fallback
      async () => {
        const db = await this.initUrduDB();
        const stmt = db.prepare(
          `SELECT * FROM urdu_wordmeanings WHERE SuraId = ? AND AyaId = ? ORDER BY WordId ASC`
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
   * Get footnote explanation by footnote ID
   * @param {string} footnoteId - Footnote ID
   * @returns {Promise<string>} Footnote text
   */
  async getFootnoteExplanation(footnoteId) {
    return this.apiCallWithFallback(
      'getFootnoteExplanation',
      { footnoteId },
      // API call
      async () => {
        const response = await apiService.get(`/api/urdu/footnote/${footnoteId}`);
        return response.footnote_text || 'Explanation not available';
      },
      // SQL.js fallback
      async () => {
        const db = await this.initUrduDB();
        const stmt = db.prepare(
          `SELECT footnote_text FROM urdu_footnotes WHERE id = ?`
        );
        const row = stmt.getAsObject([footnoteId]);
        stmt.free();
        return row && row.footnote_text ? row.footnote_text : 'Explanation not available';
      }
    );
  }

  /**
   * Get explanation for an ayah (fallback method)
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<string>} Explanation text
   */
  async getExplanation(surahNo, ayahNo) {
    try {
      // Try to get from urdu_explanation table first
      const db = await this.initUrduDB();
      const stmt = db.prepare(
        `SELECT explanation FROM urdu_explanation WHERE surah_no = ? AND ayah_no = ?`
      );
      const row = stmt.getAsObject([surahNo, ayahNo]);
      stmt.free();
      
      if (row && row.explanation) {
        return row.explanation;
      }
    } catch (tableError) {
      // Table doesn't exist, try alternative approach
    }
    
    // If no explanation table, return the translation as explanation
    const translation = await this.getAyahTranslation(surahNo, ayahNo);
    return translation || 'N/A';
  }

  /**
   * Get all explanations for an ayah
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Array of explanations
   */
  async getAllExplanations(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAllExplanations', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached !== null) return cached;

    try {
      const db = await this.initUrduDB();
      
      // First try to get from urdu_explanation table
      try {
        const stmt = db.prepare(
          `SELECT explanation, explanation_no FROM urdu_explanation WHERE surah_no = ? AND ayah_no = ? ORDER BY explanation_no ASC`
        );
        stmt.bind([surahNo, ayahNo]);
        
        const explanations = [];
        while (stmt.step()) {
          const row = stmt.getAsObject();
          if (row.explanation && row.explanation.trim() !== '') {
            explanations.push({
              explanation: row.explanation,
              explanation_no: row.explanation_no
            });
          }
        }
        stmt.free();
        
        if (explanations.length > 0) {
          this.setCachedData(cacheKey, explanations);
          return explanations;
        }
      } catch (tableError) {
        // Table doesn't exist, try footnote-based approach
      }
      
      // Extract explanations from footnotes in the translation
      const translation = await this.getAyahTranslation(surahNo, ayahNo);
      if (translation && translation.trim() !== '') {
        const explanations = await this.extractExplanationsFromFootnotes(translation, surahNo, ayahNo);
        if (explanations.length > 0) {
          this.setCachedData(cacheKey, explanations);
          return explanations;
        }
      }
      
      return [];
    } catch (error) {
      console.error('❌ Error in getAllExplanations:', error);
      return [];
    }
  }

  /**
   * Extract explanations from footnotes in translation text
   * @param {string} translationText - Translation text with footnotes
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {Promise<Array>} Array of explanations
   */
  async extractExplanationsFromFootnotes(translationText, surahNo, ayahNo) {
    try {
      const explanations = [];
      
      // Parse the translation text to find footnote references
      const footnoteRegex = /<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;
      let match;
      const footnoteIds = new Set();
      
      while ((match = footnoteRegex.exec(translationText)) !== null) {
        const footnoteId = match[1];
        const footnoteNumber = match[2];
        footnoteIds.add(footnoteId);
      }
      
      // Get explanations for each footnote
      let explanationIndex = 1;
      for (const footnoteId of footnoteIds) {
        try {
          const explanation = await this.getFootnoteExplanation(footnoteId);
          if (explanation && explanation.trim() !== '' && explanation !== 'Explanation not available') {
            explanations.push({
              explanation: explanation,
              explanation_no: explanationIndex
            });
            explanationIndex++;
          }
        } catch (error) {
          console.warn(`Failed to get explanation for footnote ${footnoteId}:`, error);
        }
      }
      
      return explanations;
    } catch (error) {
      console.error('❌ Error extracting explanations from footnotes:', error);
      return [];
    }
  }

  /**
   * Parse Urdu translation text and make footnotes clickable
   * @param {string} htmlContent - HTML content with footnotes
   * @param {number} surahNo - Surah number
   * @param {number} ayahNo - Ayah number
   * @returns {string} Parsed HTML with clickable footnotes
   */
  parseUrduTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Find all footnote sup tags with foot_note attribute
    const supTags = tempDiv.querySelectorAll("sup[foot_note]");

    supTags.forEach((element) => {
      const footnoteId = element.getAttribute("foot_note");
      const footnoteNumber = element.textContent.trim();

      if (footnoteId && /^\d+$/.test(footnoteNumber)) {
        // Style as clickable button (similar to Hindi system)
        element.style.cssText = `
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
          border-radius: 8px !important;
          position: relative !important;
          top: 0 !important;
          min-width: 20px !important;
          min-height: 20px !important;
          text-align: center !important;
          transition: all 0.2s ease-in-out !important;
        `;
        
        // Add data attributes for click handling
        element.setAttribute("data-footnote-id", footnoteId);
        element.setAttribute("data-footnote-number", footnoteNumber);
        element.setAttribute("data-surah", surahNo);
        element.setAttribute("data-ayah", ayahNo);
        element.setAttribute("title", `Click to view explanation ${footnoteNumber}`);
        element.className = "urdu-footnote-link";
        
        // Remove the foot_note attribute to clean up
        element.removeAttribute("foot_note");
      }
    });

    const result = tempDiv.innerHTML;
    return result;
  }

  /**
   * Fetch blockwise Urdu translations
   * @param {number} surahNo - Surah number
   * @param {number} startAyah - Start ayah
   * @param {number} endAyah - End ayah
   * @returns {Promise<Array>} Array of translations
   */
  async fetchBlockwiseUrdu(surahNo, startAyah, endAyah) {
    return this.apiCallWithFallback(
      'fetchBlockwiseUrdu',
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
        const db = await this.initUrduDB();
        const stmt = db.prepare(
          `SELECT verse_number, translation_text FROM urdu_tranlations WHERE chapter_number = ? AND verse_number >= ? AND verse_number <= ? ORDER BY verse_number ASC`
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
        await apiService.get(`/api/urdu/translation/1/1`);
        return true;
      } else {
        // Test SQL.js database
        await this.initUrduDB();
        return true;
      }
    } catch (error) {
      return false;
    }
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

const urduTranslationService = new UrduTranslationService();

// Debug functions (development only)
if (process.env.NODE_ENV === 'development') {
  window.debugUrduDB = async function() {
    try {
      const db = await urduTranslationService.initUrduDB();
      
      // Get table schema
      const schemaStmt = db.prepare("PRAGMA table_info(urdu_tranlations)");
      const columns = [];
      while (schemaStmt.step()) {
        const row = schemaStmt.getAsObject();
        columns.push(row);
      }
      schemaStmt.free();
      
      // Check sample data
      const sampleStmt = db.prepare("SELECT * FROM urdu_tranlations WHERE chapter_number = 1 AND verse_number = 1");
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
  window.clearUrduCache = function() {
    urduTranslationService.clearCache();
  };
}

export default urduTranslationService;