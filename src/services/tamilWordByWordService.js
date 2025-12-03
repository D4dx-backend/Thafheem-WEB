// Tamil Word-by-Word Service
// Fetches Tamil word-by-word translations from MySQL database via API

import apiService from './apiService.js';

class TamilWordByWordService {
  constructor() {
    this.language = 'tamil';
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
    this.pendingRequests = new Map();
  }

  generateCacheKey(surahId, ayahNumber) {
    return `tamil_word_${surahId}_${ayahNumber}`;
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

  // Parse Tamil translation text into word-by-word format
  parseTamilTranslation(translationText) {
    if (!translationText) return [];
    const words = translationText
      .split(/[\s,\.;:!?]+/)
      .filter(word => word.trim().length > 0)
      .map(word => word.trim());
    return words;
  }

  // Get Tamil word-by-word data for a specific surah and ayah
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
        console.warn(`⚠️ No Tamil word-by-word data for ${surahId}:${ayahNumber}`);
        return null;
      }

      // Format words for frontend
      const formattedWords = words.map((word, index) => ({
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
          text: word.WordMeaning || word.translation?.text || '',
          language_name: 'Tamil',
          resource_name: 'Local Tamil Database'
        },
        transliteration: {
          text: word.transliteration?.text || word.WordPhrase || '',
          language_name: 'English'
        }
      }));

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
      console.error(`❌ Error fetching Tamil word-by-word data for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get word-by-word data with Arabic text
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      const tamilData = await this.getWordByWordData(surahId, ayahNumber);
      if (!tamilData) {
        console.warn(`⚠️ No Tamil data found for ${surahId}:${ayahNumber}, falling back to English`);
        return await this.getEnglishFallback(surahId, ayahNumber);
      }

      // Fetch Arabic text from our API
      try {
        const arabicData = await apiService.getArabicText(surahId, ayahNumber);
        return {
          ...tamilData,
          text_uthmani: arabicData.text_uthmani || tamilData.text_uthmani || '',
          text_simple: arabicData.text_simple || tamilData.text_simple || ''
        };
      } catch (arabicError) {
        console.warn('⚠️ Could not fetch Arabic text, using Tamil data only');
        // Construct text_uthmani from words if available
        if (tamilData.words && tamilData.words.length > 0) {
          const constructedText = tamilData.words
            .map(word => word.text_uthmani || word.WordPhrase || '')
            .filter(Boolean)
            .join(' ');
          return {
            ...tamilData,
            text_uthmani: tamilData.text_uthmani || constructedText,
            text_simple: tamilData.text_simple || constructedText
          };
        }
      }

      return tamilData;
    } catch (error) {
      console.error(`❌ Error fetching Tamil word-by-word with Arabic for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getEnglishFallback(surahId, ayahNumber) {
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
            language_name: 'English (Tamil not available)',
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

export default new TamilWordByWordService();
