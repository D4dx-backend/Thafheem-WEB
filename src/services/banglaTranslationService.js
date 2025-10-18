// Bangla Translation Service
// Fetches Bangla translations from SQLite database file
// Version: 1.1 - Fixed SQL.js API calls

class BanglaTranslationService {
  constructor() {
    // Database file served from public directory
    // In Vite, files in public/ are served from root path
    this.dbPath = '/quran_bangla.db';
    this.db = null;
    this.dbPromise = null;
    this.cache = new Map();
    this.isDownloaded = false;
  }

  // Simulate database download (placeholder for future cloud integration)
  async downloadDatabase() {
    try {
      console.log('📥 Downloading Bangla translation database...');
      
      // Simulate download progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as downloaded
      this.isDownloaded = true;
      
      console.log('✅ Bangla translation database downloaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to download Bangla database:', error);
      throw new Error('Failed to download Bangla translation database');
    }
  }

  // Initialize SQL.js and load the database
  async initDB() {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = (async () => {
      try {
        console.log('🔄 Initializing Bangla database...');
        
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
        
        console.log('✅ SQL.js library loaded');
        
        // Initialize SQL.js
        const SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        console.log('📥 Fetching database from:', this.dbPath);
        
        // Load the database file from public directory
        const response = await fetch(this.dbPath);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
        }
        
        const buffer = await response.arrayBuffer();
        console.log(`📊 Database file size: ${(buffer.byteLength / 1024 / 1024).toFixed(2)} MB`);
        
        const db = new SQL.Database(new Uint8Array(buffer));
        
        // Verify database structure
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('📋 Database tables:', tables[0]?.values?.map(row => row[0]) || []);
        
        // Test query to verify data exists
        const testQuery = db.exec("SELECT COUNT(*) as count FROM bangla_translations");
        const totalRows = testQuery[0]?.values[0]?.[0] || 0;
        console.log(`📈 Total Bangla translations: ${totalRows}`);
        
        // Mark as downloaded/available since we successfully loaded from public path
        this.isDownloaded = true;
        
        return db;
      } catch (error) {
        console.error('❌ Failed to load Bangla database:', error);
        throw new Error(`Failed to load Bangla translation database: ${error.message}`);
      }
    })();

    return this.dbPromise;
  }

  // Get Bangla translation for a specific surah and ayah
  async getAyahTranslation(surahId, ayahNumber) {
    const cacheKey = `${surahId}-${ayahNumber}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📦 Cache hit for Bangla translation: ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    try {
      const db = await this.initDB();
      
      // Query the database for Bangla translation
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
        this.cache.set(cacheKey, translation);
        console.log(`✅ Fetched Bangla translation for Surah ${surahId}, Ayah ${ayahNumber}`);
        
        return translation;
      } else {
        console.warn(`⚠️ No Bangla translation found for Surah ${surahId}, Ayah ${ayahNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching Bangla translation for ${cacheKey}:`, error);
      throw error;
    }
  }

  // Get all Bangla translations for a surah
  async getSurahTranslations(surahId) {
    const cacheKey = `surah-${surahId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📦 Cache hit for Bangla surah translations: ${cacheKey}`);
      return this.cache.get(cacheKey);
    }

    try {
      const db = await this.initDB();
      
      // Query the database for all translations in the surah
      const stmt = db.prepare(`
        SELECT verse_number, translation_text 
        FROM bangla_translations 
        WHERE chapter_number = ?
        ORDER BY verse_number ASC
      `);
      
      console.log('🔄 Fetching Bangla translations with corrected SQL.js API');
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
        const ayahCacheKey = `${surahId}-${row.verse_number}`;
        this.cache.set(ayahCacheKey, row.translation_text);
        count += 1;
      }
      stmt.free();
      
      // Cache the full surah translations
      this.cache.set(cacheKey, translations);
      
      console.log(`✅ Fetched ${translations.length} Bangla translations for Surah ${surahId}`);
      
      return translations;
    } catch (error) {
      console.error(`❌ Error fetching Bangla surah translations for ${surahId}:`, error);
      throw error;
    }
  }

  // Check if Bangla translations are available
  async isAvailable() {
    try {
      await this.initDB();
      return this.isDownloaded;
    } catch (error) {
      console.error('❌ Bangla translation service not available:', error);
      return false;
    }
  }

  // Parse Bangla translation text and make explanation numbers clickable with round UI
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

  // Get explanation by Bangla explanation number
  async getExplanationByNumber(surahNo, ayahNo, explanationNumber) {
    try {
      const db = await this.initDB();
      
      // Query the bengla_explanations table
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
        console.log(`✅ Found Bangla explanation ${explanationNumber} for Surah ${surahNo}, Ayah ${ayahNo}`);
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

  // Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🧹 Bangla translation cache cleared');
  }
}

// Export singleton instance
export default new BanglaTranslationService();
