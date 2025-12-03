// Malayalam Translation Service
// Fetches Malayalam translations from MySQL database via API

import { API_BASE_PATH } from '../config/apiConfig.js';
import apiService from './apiService.js';

class MalayalamTranslationService {
  constructor() {
    this.language = 'malayalam';
    this.apiBasePath = API_BASE_PATH;
    this.pendingRequests = new Map();
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
  }

  generateCacheKey(method, params) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${method}${paramString ? `?${paramString}` : ''}`;
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

  async getAyahTranslation(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahId, ayahNumber });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAyahTranslationInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAyahTranslationInternal(surahId, ayahNumber, cacheKey) {
    try {
      const response = await apiService.getTranslation(this.language, surahId, ayahNumber);
      const translation = response?.translation_text ?? response?.translation ?? null;

      if (!translation) {
        console.warn(`⚠️ No Malayalam translation returned for ${surahId}:${ayahNumber}`);
        return null;
      }

      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Malayalam translation API failed for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahId) {
    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahId });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahId, cacheKey) {
    try {
      const response = await apiService.getSurahTranslations(this.language, surahId);
      const translations = Array.isArray(response?.translations)
        ? response.translations.map(verse => ({
            number: verse.verse_number,
            ArabicText: '',
            Translation: verse.translation_text ?? '',
          }))
        : [];

      this.setCachedData(cacheKey, translations);
      return translations;
    } catch (error) {
      console.error(`❌ Malayalam surah translation API failed for ${surahId}:`, error);
      throw error;
    }
  }

  async getInterpretation(surahId, ayahNumber, interpretationNo = null) {
    const cacheKey = this.generateCacheKey('getInterpretation', { surahId, ayahNumber, interpretationNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getInterpretationInternal(surahId, ayahNumber, interpretationNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getInterpretationInternal(surahId, ayahNumber, interpretationNo, cacheKey) {
    try {
      const response = await apiService.getInterpretation(this.language, surahId, ayahNumber, interpretationNo);
      const interpretations = Array.isArray(response?.explanations) ? response.explanations : [];

      this.setCachedData(cacheKey, interpretations);
      return interpretations;
    } catch (error) {
      console.error(`❌ Malayalam interpretation API failed for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getWordByWordData(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahId, ayahNumber });
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
        console.warn(`⚠️ No Malayalam word-by-word data for ${surahId}:${ayahNumber}`);
        return null;
      }

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
          text: word.MalMeaning || word.WordMeaning || word.translation?.text || '',
          language_name: 'Malayalam',
          resource_name: 'Thafheem Malayalam Word Database',
        },
        transliteration: {
          text: word.transliteration?.text || word.WordPhrase || '',
          language_name: 'English',
        },
      }));

      const result = {
        text_uthmani: response?.text_uthmani || '',
        words: formattedWords,
        translations: response?.translations || [],
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Malayalam word-by-word API failed for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  // Get word-by-word data with Arabic text
  async getWordByWordDataWithArabic(surahId, ayahNumber) {
    try {
      const malayalamData = await this.getWordByWordData(surahId, ayahNumber);
      if (!malayalamData) {
        console.warn(`⚠️ No Malayalam data found for ${surahId}:${ayahNumber}, falling back to English`);
        return await this.getEnglishFallback(surahId, ayahNumber);
      }

      // Fetch Arabic text from our API
      try {
        const arabicData = await apiService.getArabicText(surahId, ayahNumber);
        return {
          ...malayalamData,
          text_uthmani: arabicData.text_uthmani || malayalamData.text_uthmani,
          text_simple: arabicData.text_simple || malayalamData.text_simple
        };
      } catch (arabicError) {
        console.warn('⚠️ Could not fetch Arabic text, using Malayalam data only');
      }

      return malayalamData;
    } catch (error) {
      console.error(`❌ Error fetching Malayalam word-by-word with Arabic for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getEnglishFallback(surahId, ayahNumber) {
    try {
      const response = await apiService.getWordByWord('english', surahId, ayahNumber);
      const words = Array.isArray(response?.words) ? response.words : [];
      
      if (words.length === 0) {
        return null;
      }

      const formattedWords = words.map((word, index) => ({
        id: word.WordId || word.id || index + 1,
        position: word.WordId || word.id || index + 1,
        text_uthmani: word.text_uthmani || word.WordPhrase || '',
        text_simple: word.text_simple || word.WordPhrase || '',
        translation: {
          text: word.EngMeaning || word.WordMeaning || word.translation?.text || '',
          language_name: 'English',
          resource_name: 'Thafheem English Word Database',
        },
      }));

      return {
        text_uthmani: response?.text_uthmani || '',
        words: formattedWords,
        translations: response?.translations || [],
      };
    } catch (error) {
      console.error(`❌ English fallback failed for ${surahId}:${ayahNumber}:`, error);
      return null;
    }
  }

  async getFootnote(footnoteId) {
    const cacheKey = this.generateCacheKey('getFootnote', { footnoteId });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await apiService.getMalayalamFootnote(footnoteId);
      const footnote = response?.footnote_text || '';
      this.setCachedData(cacheKey, footnote);
      return footnote;
    } catch (error) {
      console.error(`❌ Malayalam footnote API failed for ${footnoteId}:`, error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export default new MalayalamTranslationService();





