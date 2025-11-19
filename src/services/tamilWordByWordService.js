// Tamil Word-by-Word Service
// Fetches Tamil word-by-word translations from SQLite database file

class TamilWordByWordService {
  constructor() {
    // Database file served from public directory
    this.dbPath = '/quran_tamil.db';
    this.dbPromise = null;
    this.isDownloaded = false;
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

  // Parse Tamil translation text into word-by-word format
  parseTamilTranslation(translationText) {
    if (!translationText) return [];

    // Split by common Tamil word separators and clean up
    const words = translationText
      .split(/[\s,\.;:!?]+/)
      .filter(word => word.trim().length > 0)
      .map(word => word.trim());

    return words;
  }

  // Get Tamil word-by-word data for a specific surah and ayah
  async getWordByWordData(surahId, ayahNumber) {
    try {
      const db = await this.initDB();
      
      // Query the database for Tamil translation
      const stmt = db.prepare(`
        SELECT translation_text 
        FROM tamil_translations 
        WHERE chapter_number = ? AND verse_number = ?
      `);
      
      const result = stmt.getAsObject([surahId, ayahNumber]);
      stmt.free();
      
      if (result && result.translation_text) {
        const translationText = result.translation_text;
        
        // Parse the translation into words
        const words = this.parseTamilTranslation(translationText);
        
        // Create word-by-word data structure similar to quran.com API
        const wordByWordData = {
          text_uthmani: '', // We'll need to get this from another source
          words: words.map((word, index) => ({
            id: index + 1,
            position: index + 1,
            audio_url: null,
            char_type_name: 'word',
            code_v1: '',
            code_v2: '',
            line_number: 1,
            page_number: 1,
            text_uthmani: '', // Arabic word - we'll need to get this
            text_simple: '', // Arabic word - we'll need to get this
            translation: {
              text: word,
              language_name: 'Tamil',
              resource_name: 'Local Tamil Database'
            },
            transliteration: {
              text: '', // We don't have transliteration
              language_name: 'English'
            }
          })),
          translations: [{
            text: translationText,
            language_name: 'Tamil',
            resource_name: 'Local Tamil Database'
          }]
        };
        
        return wordByWordData;
      }
      
      console.warn(`⚠️ No Tamil translation found for ${surahId}:${ayahNumber}`);
      return null;
    } catch (error) {
      console.error(`❌ Error fetching Tamil word-by-word data for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get Tamil word-by-word data with Arabic words (requires additional API call)
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      // First get the Tamil translation from our database
      const tamilData = await this.getWordByWordData(surahId, ayahNumber);
      
      if (!tamilData) {
        console.warn(`⚠️ No Tamil data found for ${surahId}:${ayahNumber}, falling back to English`);
        // Fallback to English word-by-word from quran.com API
        return await this.getEnglishFallback(surahId, ayahNumber);
      }

      // Get Arabic words from quran.com API (without translation)
      const verseKey = `${surahId}:${ayahNumber}`;
      const url = `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arabicData = await response.json();
        
        if (arabicData.verse && arabicData.verse.words) {
          // Combine Arabic words with Tamil translations
          const combinedWords = arabicData.verse.words.map((arabicWord, index) => {
            const tamilWord = tamilData.words[index];
            return {
              ...arabicWord,
              translation: tamilWord ? tamilWord.translation : {
                text: 'Translation not available',
                language_name: 'Tamil',
                resource_name: 'Local Tamil Database'
              }
            };
          });

          return {
            ...arabicData.verse,
            words: combinedWords,
            translations: tamilData.translations
          };
        }
      } catch (apiError) {
        console.warn('Failed to fetch Arabic words from API, using Tamil-only data:', apiError);
        // Return Tamil data without Arabic words
        return tamilData;
      }

      return tamilData;
    } catch (error) {
      console.error(`❌ Error fetching combined Tamil word-by-word data for ${surahId}:${ayahNumber}:`, error);
      // If there's an error with Tamil data, try English fallback
      console.warn(`⚠️ Error with Tamil data, falling back to English for ${surahId}:${ayahNumber}`);
      return await this.getEnglishFallback(surahId, ayahNumber);
    }
  }

  // Fallback method to get English word-by-word data from quran.com API
  async getEnglishFallback(surahId, ayahNumber) {
    try {
      const verseKey = `${surahId}:${ayahNumber}`;
      const url = `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs,translation&translation_fields=resource_name,language_name&language=en&translations=131`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.verse) {
        // Mark this as a fallback in the translations
        if (data.verse.translations && data.verse.translations.length > 0) {
          data.verse.translations[0].resource_name = 'English Fallback (Tamil not available)';
        }
        return data.verse;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error fetching English fallback for ${surahId}:${ayahNumber}:`, error);
      return null;
    }
  }

  // Check if database is available
  async isAvailable() {
    try {
      await this.initDB();
      return true;
    } catch (error) {
      console.warn('Tamil word-by-word service not available:', error.message);
      return false;
    }
  }

  // Check if database is downloaded
  isDatabaseDownloaded() {
    return this.isDownloaded;
  }
}

// Create and export a singleton instance
const tamilWordByWordService = new TamilWordByWordService();
export default tamilWordByWordService;
