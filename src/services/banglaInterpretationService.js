import initSqlJs from 'sql.js';
import { USE_API } from '../config/apiConfig.js';
import apiService from './apiService.js';

class BanglaInterpretationService {
  constructor() {
    this.db = null;
    this.dbPath = '/quran_bangla.db';
    this.isInitialized = false;
    this.initPromise = null;
    
    // API mode configuration
    this.useApi = USE_API;
  }

  async initDB() {
    if (this.isInitialized) {
      return this.db;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._loadDatabase();
    return this.initPromise;
  }

  async _loadDatabase() {
    try {
      console.log('🔄 Initializing Bangla interpretation database...');
      
      // Load SQL.js
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Fetch the database file
      const response = await fetch(this.dbPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Load the database
      this.db = new SQL.Database(uint8Array);
      this.isInitialized = true;
      
      return this.db;
    } catch (error) {
      console.error('❌ Error initializing Bangla interpretation database:', error);
      this.isInitialized = false;
      this.initPromise = null;
      throw error;
    }
  }

  async getExplanation(surahNo, ayahNo) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await apiService.getInterpretation('bangla', surahNo, ayahNo);
        
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          // Return the first explanation (main explanation)
          const explanation = apiResponse.explanations[0].explanation;
          console.log(`✅ Found Bangla explanation from API for Surah ${surahNo}, Ayah ${ayahNo}`);
          return explanation;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for Bangla explanation ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }

    // SQL.js fallback (either USE_API is false or API failed)
    try {
      await this.initDB();
      
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      console.log(`🔍 Fetching Bangla explanation from SQL.js for Surah ${surahNo}, Ayah ${ayahNo}`);

      // Query the bengla_explanations table
      const query = `
        SELECT explanation, explanation_no_BNG, explanation_no_EN 
        FROM bengla_explanations 
        WHERE surah_no = ? AND ayah_no = ?
        ORDER BY explanation_no_EN ASC
      `;

      const stmt = this.db.prepare(query);
      const result = stmt.getAsObject([surahNo, ayahNo]);
      stmt.free();

      if (result && result.explanation) {
        console.log(`✅ Found Bangla explanation from SQL.js for Surah ${surahNo}, Ayah ${ayahNo}`);
        return result.explanation;
      } else {
        console.log(`⚠️ No Bangla explanation found for Surah ${surahNo}, Ayah ${ayahNo}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching Bangla explanation for Surah ${surahNo}, Ayah ${ayahNo}:`, error);
      throw error;
    }
  }

  async getAllExplanations(surahNo, ayahNo) {
    // Try API first if enabled
    if (this.useApi) {
      try {
        console.log(`🌐 Fetching all Bangla explanations from API: ${surahNo}:${ayahNo}`);
        const apiResponse = await apiService.getInterpretation('bangla', surahNo, ayahNo);
        
        if (apiResponse && apiResponse.explanations && apiResponse.explanations.length > 0) {
          console.log(`✅ Found ${apiResponse.explanations.length} Bangla explanation(s) from API for Surah ${surahNo}, Ayah ${ayahNo}`);
          return apiResponse.explanations;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for Bangla explanations ${surahNo}:${ayahNo}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }

    // SQL.js fallback (either USE_API is false or API failed)
    try {
      await this.initDB();
      
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      console.log(`🔍 Fetching all Bangla explanations from SQL.js for Surah ${surahNo}, Ayah ${ayahNo}`);

      // Query all explanations for the ayah
      const query = `
        SELECT explanation, explanation_no_BNG, explanation_no_EN 
        FROM bengla_explanations 
        WHERE surah_no = ? AND ayah_no = ?
        ORDER BY explanation_no_EN ASC
      `;

      const stmt = this.db.prepare(query);
      stmt.bind([surahNo, ayahNo]);
      const results = [];
      
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();

      if (results.length > 0) {
        console.log(`✅ Found ${results.length} Bangla explanation(s) from SQL.js for Surah ${surahNo}, Ayah ${ayahNo}`);
        return results;
      } else {
        console.log(`⚠️ No Bangla explanations found for Surah ${surahNo}, Ayah ${ayahNo}`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error fetching Bangla explanations for Surah ${surahNo}, Ayah ${ayahNo}:`, error);
      throw error;
    }
  }

  async isAvailable() {
    try {
      await this.initDB();
      return this.isInitialized && this.db !== null;
    } catch (error) {
      console.error('❌ Bangla interpretation service not available:', error);
      return false;
    }
  }

  // Cleanup method
  destroy() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    this.isInitialized = false;
    this.initPromise = null;
  }
}

// Create and export a singleton instance
const banglaInterpretationService = new BanglaInterpretationService();
export default banglaInterpretationService;

