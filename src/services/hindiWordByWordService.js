// Hindi Word-by-Word Service
// Fetches Hindi word-by-word translations from SQLite database file

class HindiWordByWordService {
  constructor() {
    // Database file served from public directory
    // Use BASE_URL from Vite config to handle base path correctly
    const baseUrl = import.meta.env.BASE_URL || '/';
    this.dbPath = `${baseUrl}quran_hindi.db`.replace(/\/+/g, '/'); // Normalize slashes
    this.cache = new Map();
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
        // Try with base path first, then fallback to root path
        let response;
        let dbPath = this.dbPath;
response = await fetch(dbPath);
        
        if (!response.ok) {
          // Fallback to root path if base path fails (common in development)
          const rootPath = '/quran_hindi.db';
          if (dbPath !== rootPath) {
            console.warn(`⚠️ Failed to fetch from ${dbPath} (${response.status}), trying root path: ${rootPath}`);
            dbPath = rootPath;
            response = await fetch(rootPath);
            if (!response.ok) {
              console.error(`❌ Failed to fetch Hindi word-by-word DB from ${rootPath}: ${response.status} ${response.statusText}`);
              throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
            }
          } else {
            console.error(`❌ Failed to fetch Hindi word-by-word DB from ${dbPath}: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch database: ${response.status} ${response.statusText}`);
          }
        }
        
const buffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(buffer));
        
        // Verify database structure
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        
        // Test query to verify data exists
        const testQuery = db.exec("SELECT COUNT(*) as count FROM hindi_wordmeanings");
        const totalRows = testQuery[0]?.values[0]?.[0] || 0;
        
        // Mark as downloaded/available since we successfully loaded from public path
        this.isDownloaded = true;
        
        return db;
      } catch (error) {
        console.error('❌ Failed to load Hindi database:', error);
        throw new Error(`Failed to load Hindi translation database: ${error.message}`);
      }
    })();

    return this.dbPromise;
  }

  // Check if a word is in Hindi (contains Devanagari script)
  isHindiWord(word) {
    if (!word) return false;
    // Check for Devanagari Unicode range (U+0900 to U+097F)
    return /[\u0900-\u097F]/.test(word);
  }

  // Check if a word is in English (contains only Latin characters)
  isEnglishWord(word) {
    if (!word) return false;
    // Remove common punctuation and check if only Latin characters remain
    const cleanWord = word.replace(/[()[\]{}.,;:!?'"]/g, '').trim();
    return /^[a-zA-Z\s]+$/.test(cleanWord) && cleanWord.length > 0;
  }

  // Get Hindi word-by-word data for a specific surah and ayah
  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = `wordbyword-${surahId}-${ayahNumber}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const db = await this.initDB();
      
      // Query the database for Hindi word meanings
      const stmt = db.prepare(`
        SELECT WordId, WordPhrase, WordMeaning 
        FROM hindi_wordmeanings 
        WHERE SuraId = ? AND AyaId = ?
        ORDER BY WordId ASC
      `);
      
      stmt.bind([surahId, ayahNumber]);
      const words = [];
      let count = 0;
      
      while (stmt.step()) {
        const row = stmt.getAsObject();
        const wordMeaning = row.WordMeaning || '';
        
        // Include all words, but mark language appropriately
        if (this.isHindiWord(wordMeaning)) {
          // Pure Hindi translation
          words.push({
            id: row.WordId || count + 1,
            position: count + 1,
            audio_url: null,
            char_type_name: 'word',
            code_v1: '',
            code_v2: '',
            line_number: 1,
            page_number: 1,
            text_uthmani: row.WordPhrase || '',
            text_simple: row.WordPhrase || '',
            translation: {
              text: wordMeaning,
              language_name: 'Hindi',
              resource_name: 'Local Hindi Database'
            },
            transliteration: {
              text: '',
              language_name: 'English'
            }
          });
          count += 1;
        } else if (this.isEnglishWord(wordMeaning)) {
          // English translation as fallback (but still include it)
          words.push({
            id: row.WordId || count + 1,
            position: count + 1,
            audio_url: null,
            char_type_name: 'word',
            code_v1: '',
            code_v2: '',
            line_number: 1,
            page_number: 1,
            text_uthmani: row.WordPhrase || '',
            text_simple: row.WordPhrase || '',
            translation: {
              text: wordMeaning,
              language_name: 'English (Hindi not available)',
              resource_name: 'Local Hindi Database (English fallback)'
            },
            transliteration: {
              text: '',
              language_name: 'English'
            }
          });
count += 1;
        } else {
          // Other languages or empty - include with generic label
          words.push({
            id: row.WordId || count + 1,
            position: count + 1,
            audio_url: null,
            char_type_name: 'word',
            code_v1: '',
            code_v2: '',
            line_number: 1,
            page_number: 1,
            text_uthmani: row.WordPhrase || '',
            text_simple: row.WordPhrase || '',
            translation: {
              text: wordMeaning || 'Translation not available',
              language_name: 'Mixed',
              resource_name: 'Local Hindi Database'
            },
            transliteration: {
              text: '',
              language_name: 'English'
            }
          });
          count += 1;
        }
      }
      stmt.free();
      
      if (words.length > 0) {
        // Create word-by-word data structure similar to quran.com API
        const wordByWordData = {
          text_uthmani: words.map(word => word.text_uthmani).join(' '),
          words: words,
          translations: [{
            text: words.map(word => word.translation.text).join(' '),
            language_name: 'Hindi',
            resource_name: 'Local Hindi Database'
          }]
        };
        
        const hindiWords = words.filter(w => w.translation.language_name === 'Hindi').length;
        const englishWords = words.filter(w => w.translation.language_name === 'English (Hindi not available)').length;
// Cache the result
        this.cache.set(cacheKey, wordByWordData);
        
        return wordByWordData;
      }
      
      console.warn(`⚠️ No Hindi word meanings found for ${surahId}:${ayahNumber}`);
      
      // Let's also check if there are any records for this surah at all
      const checkStmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM hindi_wordmeanings 
        WHERE SuraId = ?
      `);
      const surahCount = checkStmt.getAsObject([surahId]);
      checkStmt.free();
      
return null;
    } catch (error) {
      console.error(`❌ Error fetching Hindi word-by-word data for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get Hindi word-by-word data with Arabic words (requires additional API call)
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      // First get the Hindi word meanings from our database
      const hindiData = await this.getWordByWordData(surahId, ayahNumber);
      
      if (!hindiData) {
        console.warn(`⚠️ No Hindi data found for ${surahId}:${ayahNumber}, falling back to English`);
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
// Combine Arabic words with Hindi meanings
          const combinedWords = arabicData.verse.words.map((arabicWord, index) => {
            // Try to find matching Hindi word by position first, then by Arabic text similarity
            let hindiWord = hindiData.words[index];
            
            // If no word at this index or if the Arabic text doesn't match, try to find a better match
            if (!hindiWord || (hindiWord.text_uthmani && hindiWord.text_uthmani !== arabicWord.text_uthmani)) {
              // Try to find a word with matching Arabic text
              hindiWord = hindiData.words.find(hw => 
                hw.text_uthmani === arabicWord.text_uthmani || 
                hw.text_simple === arabicWord.text_simple
              );
            }
            
            return {
              ...arabicWord,
              translation: hindiWord ? hindiWord.translation : {
                text: 'Translation not available',
                language_name: 'Hindi',
                resource_name: 'Local Hindi Database'
              }
            };
          });

          return {
            ...arabicData.verse,
            words: combinedWords,
            translations: hindiData.translations
          };
        }
      } catch (apiError) {
        console.warn('Failed to fetch Arabic words from API, using Hindi-only data:', apiError);
        // Return Hindi data without Arabic words
        return hindiData;
      }

      return hindiData;
    } catch (error) {
      console.error(`❌ Error fetching combined Hindi word-by-word data for ${surahId}:${ayahNumber}:`, error);
      // If there's an error with Hindi data, try English fallback
      console.warn(`⚠️ Error with Hindi data, falling back to English for ${surahId}:${ayahNumber}`);
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
          data.verse.translations[0].resource_name = 'English Fallback (Hindi not available)';
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
      console.warn('Hindi word-by-word service not available:', error.message);
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
const hindiWordByWordService = new HindiWordByWordService();
export default hindiWordByWordService;
