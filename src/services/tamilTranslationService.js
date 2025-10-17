// Tamil Translation Service
// Fetches Tamil translations from SQLite database file

class TamilTranslationService {
  constructor() {
    // Database file served from public directory
    // In Vite, files in public/ are served from root path
    this.dbPath = '/quran_tamil.db';
    this.cache = new Map();
    this.dbPromise = null;
    this.isDownloaded = false;
  }

  // Download Tamil database from cloud (placeholder for now)
  async downloadDatabase() {
    try {
      // TODO: Replace with actual cloud download URL
      const downloadUrl = 'https://example.com/quran_tamil.db'; // Placeholder URL
      
      
      // For now, just simulate download and mark as downloaded
      // Later this will be replaced with actual download logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate download time
      
      this.isDownloaded = true;
      
      return true;
    } catch (error) {
      console.error('❌ Failed to download Tamil database:', error);
      throw new Error('Failed to download Tamil translation database');
    }
  }

  // Initialize SQL.js and load the database
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
        
        
        // Load the database file from public directory
        const response = await fetch(this.dbPath);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
        }
        
        const buffer = await response.arrayBuffer();
        
        const db = new SQL.Database(new Uint8Array(buffer));
        
        // Verify database structure
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        
        // Test query to verify data exists
        const testQuery = db.exec("SELECT COUNT(*) as count FROM tamil_translations");
        const totalRows = testQuery[0]?.values[0]?.[0] || 0;
        // Mark as downloaded/available since we successfully loaded from public path
        this.isDownloaded = true;
        
        return db;
      } catch (error) {
        console.error('❌ Failed to load Tamil database:', error);
        throw new Error(`Failed to load Tamil translation database: ${error.message}`);
      }
    })();

    return this.dbPromise;
  }

  // Get Tamil translation for a specific surah and ayah
  async getAyahTranslation(surahId, ayahNumber) {
    const cacheKey = `${surahId}-${ayahNumber}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const db = await this.initDB();
      
      
      // Query the database
      const stmt = db.prepare(`
        SELECT translation_text 
        FROM tamil_translations 
        WHERE chapter_number = ? AND verse_number = ?
      `);
      
      const result = stmt.getAsObject([surahId, ayahNumber]);
      stmt.free();
      
      if (result && result.translation_text) {
        const translation = result.translation_text;
        
        // Cache the result
        this.cache.set(cacheKey, translation);
        
        return translation;
      }
      
      console.warn(`⚠️ No Tamil translation found for ${cacheKey}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching Tamil translation for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get Tamil translations for all ayahs in a surah
  async getSurahTranslations(surahId) {
    try {
      const db = await this.initDB();
      
      
      // Query the database for all verses in the surah
      const stmt = db.prepare(`
        SELECT verse_number, translation_text 
        FROM tamil_translations 
        WHERE chapter_number = ?
        ORDER BY verse_number ASC
      `);
      
      stmt.bind([surahId]);
      const translations = [];
      let count = 0;
      while (stmt.step()) {
        const row = stmt.getAsObject();
        translations.push({
          number: row.verse_number,
          ArabicText: '',
          Translation: row.translation_text || ''
        });
        const cacheKey = `${surahId}-${row.verse_number}`;
        this.cache.set(cacheKey, row.translation_text);
        count += 1;
      }
      stmt.free();
      
      
      return translations;
    } catch (error) {
      console.error(`❌ Error fetching Tamil translations for surah ${surahId}:`, error);
      throw error;
    }
  }

  // Check if database is available
  async isAvailable() {
    try {
      await this.initDB();
      return true;
    } catch (error) {
      console.warn('Tamil translation service not available:', error.message);
      return false;
    }
  }

  // Check if database is downloaded
  isDatabaseDownloaded() {
    return this.isDownloaded;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create and export a singleton instance
const tamilTranslationService = new TamilTranslationService();
export default tamilTranslationService;
