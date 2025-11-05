// Bangla Word-by-Word Service
// Fetches Bangla word-by-word translations from SQLite database file or API
// Version: 2.0 - Hybrid mode with API fallback
import { USE_API } from '../config/apiConfig.js';
import apiService from './apiService.js';
class BanglaWordByWordService {
  constructor() {
    // Database file served from public directory
    // Use BASE_URL from Vite config to handle base path correctly
    const baseUrl = import.meta.env.BASE_URL || '/';
    this.dbPath = `${baseUrl}quran_bangla.db`.replace(/\/+/g, '/'); // Normalize slashes
    this.db = null;
    this.dbPromise = null;
    this.cache = new Map();
    this.isDownloaded = false;
    // API mode configuration
    this.useApi = USE_API;
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
        // Try fetching with root path first (Vite serves public files from root in dev)
        // Then fallback to base path (for production)
        let response;
        let dbPath;
        const rootPath = '/quran_bangla.db';
        const basePath = this.dbPath;
        
        // In development, try root path first; in production, try base path first
        const isDev = import.meta.env.DEV;
        const pathsToTry = isDev 
          ? [rootPath, basePath] // Dev: try root first, then base
          : [basePath, rootPath]; // Prod: try base first, then root
        
        let lastError = null;
        for (const path of pathsToTry) {
          try {
            console.log(`📥 Trying to fetch Bangla word-by-word database from: ${path}`);
            response = await fetch(path);
            if (response.ok) {
              dbPath = path;
              console.log(`✅ Successfully loaded Bangla word-by-word database from: ${dbPath}`);
              break;
            } else {
              console.warn(`⚠️ Failed to fetch from ${path}: ${response.status} ${response.statusText}`);
              lastError = new Error(`Failed to fetch database from ${path}: ${response.status} ${response.statusText}`);
            }
          } catch (error) {
            console.warn(`⚠️ Error fetching from ${path}:`, error.message);
            lastError = error;
          }
        }
        
        if (!response || !response.ok) {
          console.error(`❌ Failed to fetch Bangla word-by-word DB from all attempted paths`);
          throw lastError || new Error(`Failed to fetch database: All paths failed`);
        }
        
        const buffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(buffer));
        // Verify database structure
        const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('📋 Bangla word-by-word database tables:', tables[0]?.values?.map(row => row[0]) || []);
        // Test query to verify data exists
        const testQuery = db.exec("SELECT COUNT(*) as count FROM bengla_wordmeanings");
        const totalRows = testQuery[0]?.values[0]?.[0] || 0;
        // Mark as downloaded/available since we successfully loaded from public path
        this.isDownloaded = true;
        return db;
      } catch (error) {
        console.error('❌ Failed to load Bangla word-by-word database:', error);
        throw new Error(`Failed to load Bangla word-by-word database: ${error.message}`);
      }
    })();
    return this.dbPromise;
  }
  // Parse Bangla translation text into individual words (legacy method - now using database directly)
  parseBanglaTranslation(translationText) {
    if (!translationText) return [];
    // Split by common Bangla word separators and clean up
    const words = translationText
      .split(/[\s\u200B\u200C\u200D\u2060\u00A0]+/) // Split by whitespace and zero-width characters
      .map(word => word.trim())
      .filter(word => word.length > 0)
      .filter(word => !word.match(/^[\d\s\-\(\)]+$/)); // Remove pure numbers and punctuation
    return words;
  }
  // Get Bangla word-by-word data for a specific surah and ayah (without Arabic words)
  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = `wordbyword-${surahId}-${ayahNumber}`;
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    // Try API first if enabled
    if (this.useApi) {
      try {
        const apiResponse = await apiService.getWordByWord('bangla', surahId, ayahNumber);
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
          this.cache.set(cacheKey, wordByWordData);
          return wordByWordData;
        }
      } catch (apiError) {
        console.warn(`⚠️ API failed for Bangla word-by-word data ${surahId}:${ayahNumber}, falling back to SQL.js:`, apiError.message);
        // Fall through to SQL.js fallback
      }
    }
    // SQL.js fallback (either USE_API is false or API failed)
    try {
      const db = await this.initDB();
      // Query the database for Bangla word meanings
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
          text_uthmani: '', // Arabic word - we'll need to get this
          text_simple: '', // Arabic word - we'll need to get this
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
        // Create word-by-word data structure similar to quran.com API
        const wordByWordData = {
          text_uthmani: '', // We'll need to get this from another source
          words: words,
          translations: [] // Remove duplicate translation to avoid showing under word breakdown
        };
        // Cache the result
        this.cache.set(cacheKey, wordByWordData);
        return wordByWordData;
      } else {
        console.warn(`⚠️ No Bangla word meanings found for: Surah ${surahId}, Ayah ${ayahNumber}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching Bangla word-by-word data for ${cacheKey}:`, error);
      throw error;
    }
  }
  // Get Bangla word-by-word data with Arabic words (requires additional API call)
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      // First get the Bangla word meanings
      const banglaData = await this.getWordByWordData(surahId, ayahNumber);
      if (!banglaData || !banglaData.words || banglaData.words.length === 0) {
        console.warn('No Bangla word data available, falling back to API');
        return null;
      }
      // Get Arabic words from Quran.com API
      const verseKey = `${surahId}:${ayahNumber}`;
      const url = `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=verse_key,word_number,location,text_uthmani,text_simple,class_name,line_number,page_number,code_v1,qpc_uthmani_hafs`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arabicData = await response.json();
        if (arabicData.verse && arabicData.verse.words) {
          // Combine Arabic words with Bangla meanings
          const combinedWords = arabicData.verse.words.map((arabicWord, index) => {
            // Try to find matching Bangla word by position first
            let banglaWord = banglaData.words[index];
            // If no word at this index, try to find a better match or use fallback
            if (!banglaWord) {
              // Try to find a word with similar position
              banglaWord = banglaData.words.find(bw => 
                bw.position === arabicWord.word_number || 
                bw.id === arabicWord.word_number
              );
            }
            return {
              ...arabicWord,
              translation: banglaWord ? banglaWord.translation : {
                text: 'Translation not available',
                language_name: 'English',
                resource_name: 'Local Bangla Database'
              },
              transliteration: banglaWord ? banglaWord.transliteration : {
                text: '',
                language_name: 'Bangla'
              }
            };
          });
          return {
            ...arabicData.verse,
            words: combinedWords,
            translations: [] // Remove duplicate translation to avoid showing under word breakdown
          };
        }
      } catch (apiError) {
        console.warn('Failed to fetch Arabic words from API, using Bangla-only data:', apiError);
        // Return Bangla data without Arabic words
        return banglaData;
      }
      return banglaData;
    } catch (error) {
      console.error(`❌ Error in getWordByWordDataWithArabic for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }
  // Check if Bangla word-by-word translations are available
  async isAvailable() {
    try {
      await this.initDB();
      return this.isDownloaded;
    } catch (error) {
      console.error('❌ Bangla word-by-word service not available:', error);
      return false;
    }
  }
  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}
// Export singleton instance
export default new BanglaWordByWordService();
