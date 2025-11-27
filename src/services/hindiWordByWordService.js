// Hindi Word-by-Word Service
// Fetches Hindi word-by-word translations from MySQL database via API

import apiService from './apiService.js';

class HindiWordByWordService {
  constructor() {
    this.language = 'hindi';
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
    this.pendingRequests = new Map();
  }

  generateCacheKey(surahId, ayahNumber) {
    return `hindi_word_${surahId}_${ayahNumber}`;
  }

  isCacheValid(timestamp) {
    return Date.now() - timestamp < this.cacheTtl;
  }

  getCachedData(cacheKey) {
    if (!this.cacheEnabled) return null;
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(cacheKey);
    }
    return null;
  }

  setCachedData(cacheKey, data) {
    if (!this.cacheEnabled) return;
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  // Check if a word is in Hindi (contains Devanagari script)
  isHindiWord(word) {
    if (!word) return false;
    return /[\u0900-\u097F]/.test(word);
  }

  // Check if a word is in English (contains only Latin characters)
  isEnglishWord(word) {
    if (!word) return false;
    const cleanWord = word.replace(/[()[\]{}.,;:!?'"]/g, '').trim();
    return /^[a-zA-Z\s]+$/.test(cleanWord) && cleanWord.length > 0;
  }

  // Get Hindi word-by-word data for a specific surah and ayah
  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey(surahId, ayahNumber);
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getWordByWordDataInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getWordByWordDataInternal(surahId, ayahNumber, cacheKey) {
    try {
      const response = await apiService.getWordByWord(this.language, surahId, ayahNumber);
      const words = Array.isArray(response?.words) ? response.words : [];

      if (words.length === 0) {
        console.warn(`⚠️ No Hindi word-by-word data for ${surahId}:${ayahNumber}`);
        return null;
      }

      // Format words for frontend
      const formattedWords = words.map((word, index) => {
        const wordMeaning = word.WordMeaning || word.translation?.text || '';
        const isHindi = this.isHindiWord(wordMeaning);
        const isEnglish = this.isEnglishWord(wordMeaning);

        return {
          id: word.WordId || word.id || index + 1,
          position: word.WordId || word.id || index + 1,
          audio_url: word.audio_url || null,
          char_type_name: word.char_type_name || 'word',
          code_v1: word.code_v1 || '',
          code_v2: word.code_v2 || '',
          line_number: word.line_number || 1,
          page_number: word.page_number || 1,
          text_uthmani: word.text_uthmani || word.WordPhrase || '',
          text_simple: word.text_simple || word.WordPhrase || '',
          translation: {
            text: wordMeaning,
            language_name: isHindi ? 'Hindi' : isEnglish ? 'English (Hindi not available)' : 'Hindi',
            resource_name: isHindi 
              ? 'Local Hindi Database' 
              : isEnglish 
              ? 'Local Hindi Database (English fallback)' 
              : 'Local Hindi Database'
          },
          transliteration: {
            text: word.transliteration?.text || word.WordPhrase || '',
            language_name: word.transliteration?.language_name || 'English'
          }
        };
      });

      // Construct full verse text from words if not provided by backend
      const constructedText = formattedWords
        .map(word => word.text_uthmani || word.WordPhrase || '')
        .filter(Boolean)
        .join(' ');

      const result = {
        text_uthmani: response?.text_uthmani || constructedText,
        words: formattedWords,
        translations: response?.translations || []
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Error fetching Hindi word-by-word data for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get word-by-word data with Arabic text from Quran.com API
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      const hindiData = await this.getWordByWordData(surahId, ayahNumber);
      if (!hindiData) {
        console.warn(`⚠️ No Hindi data found for ${surahId}:${ayahNumber}, falling back to English`);
        return await this.getEnglishFallback(surahId, ayahNumber);
      }

      // Fetch Arabic text from our API
      try {
        const arabicData = await apiService.getArabicText(surahId, ayahNumber);
        return {
          ...hindiData,
          text_uthmani: arabicData.text_uthmani || hindiData.text_uthmani || '',
          text_simple: arabicData.text_simple || hindiData.text_simple || ''
        };
      } catch (arabicError) {
        console.warn('⚠️ Could not fetch Arabic text, using Hindi data only');
        // Construct text_uthmani from words if available
        if (hindiData.words && hindiData.words.length > 0) {
          const constructedText = hindiData.words
            .map(word => word.text_uthmani || word.WordPhrase || '')
            .filter(Boolean)
            .join(' ');
          return {
            ...hindiData,
            text_uthmani: hindiData.text_uthmani || constructedText,
            text_simple: hindiData.text_simple || constructedText
          };
        }
      }

      return hindiData;
    } catch (error) {
      console.error(`❌ Error fetching Hindi word-by-word with Arabic for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getEnglishFallback(surahId, ayahNumber) {
    // Fallback to English word-by-word if Hindi not available
    try {
      const response = await apiService.getWordByWord('english', surahId, ayahNumber);
      const words = Array.isArray(response?.words) ? response.words : [];
      
      return {
        text_uthmani: response?.text_uthmani || '',
        words: words.map((word, index) => ({
          id: word.WordId || index + 1,
          position: word.WordId || index + 1,
          audio_url: word.audio_url || null,
          char_type_name: word.char_type_name || 'word',
          code_v1: word.code_v1 || '',
          code_v2: word.code_v2 || '',
          line_number: word.line_number || 1,
          page_number: word.page_number || 1,
          text_uthmani: word.text_uthmani || '',
          text_simple: word.text_simple || '',
          translation: {
            text: word.EngMeaning || word.translation?.text || '',
            language_name: 'English (Hindi not available)',
            resource_name: 'English Fallback'
          },
          transliteration: {
            text: word.transliteration?.text || '',
            language_name: 'English'
          }
        })),
        translations: response?.translations || []
      };
    } catch (error) {
      console.error(`❌ Error fetching English fallback for ${surahId}:${ayahNumber}:`, error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export default new HindiWordByWordService();
