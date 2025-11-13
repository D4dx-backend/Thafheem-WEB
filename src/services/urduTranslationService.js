import { USE_API, API_BASE_PATH, CACHE_ENABLED, CACHE_TTL } from '../config/apiConfig.js';
import apiService from './apiService.js';

class UrduTranslationService {
  constructor() {
    this.language = 'urdu';
    this.useApi = USE_API;
    this.apiBasePath = API_BASE_PATH;
    this.cacheEnabled = CACHE_ENABLED;
    this.cacheTtl = CACHE_TTL;
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  _assertApiEnabled() {
    if (!this.useApi) {
      throw new Error('Urdu API is disabled (VITE_USE_API=false).');
    }
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

  async getAyahTranslation(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAyahTranslation', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAyahTranslationInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAyahTranslationInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getTranslation(this.language, surahNo, ayahNo);
      const translation = response?.translation_text ?? response?.translation ?? '';

      this.setCachedData(cacheKey, translation);
      return translation;
    } catch (error) {
      console.error(`❌ Urdu translation API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getSurahTranslations(surahNo) {
    const cacheKey = this.generateCacheKey('getSurahTranslations', { surahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getSurahTranslationsInternal(surahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getSurahTranslationsInternal(surahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getSurahTranslations(this.language, surahNo);
      const translations = Array.isArray(response?.translations)
        ? response.translations.map(verse => ({
            verse_number: verse.verse_number,
            translation_text: verse.translation_text ?? '',
          }))
        : [];

      translations.forEach(verse => {
        const ayahKey = this.generateCacheKey('getAyahTranslation', {
          surahNo,
          ayahNo: verse.verse_number,
        });
        if (verse.translation_text) {
          this.setCachedData(ayahKey, verse.translation_text);
        }
      });

      this.setCachedData(cacheKey, translations);
      return translations;
    } catch (error) {
      console.error(`❌ Urdu surah translation API failed for ${surahNo}:`, error);
      throw error;
    }
  }

  async getWordByWordData(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getWordByWordData', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getWordByWordDataInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getWordByWordDataInternal(surahNo, ayahNo, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.getWordByWord(this.language, surahNo, ayahNo);
      const wordsSource = Array.isArray(response?.words) ? response.words : [];

      if (wordsSource.length === 0) {
        console.warn(`⚠️ No Urdu word-by-word data for ${surahNo}:${ayahNo}`);
        return [];
      }

      const words = wordsSource.map((word, index) => ({
        id: word.id ?? word.WordId ?? word.word_id ?? index + 1,
        position: word.position ?? word.WordId ?? word.word_id ?? index + 1,
        audio_url: word.audio_url ?? null,
        char_type_name: word.char_type_name ?? 'word',
        code_v1: word.code_v1 ?? '',
        code_v2: word.code_v2 ?? '',
        line_number: word.line_number ?? 1,
        page_number: word.page_number ?? 1,
        text_uthmani: word.text_uthmani ?? '',
        text_simple: word.text_simple ?? '',
        translation: {
          text: word.translation?.text ?? word.WordMeaning ?? '',
          language_name: word.translation?.language_name ?? 'Urdu',
          resource_name: word.translation?.resource_name ?? 'Thafheem Urdu Word Database',
        },
        transliteration: {
          text: word.transliteration?.text ?? word.WordPhrase ?? '',
          language_name: word.transliteration?.language_name ?? 'Urdu',
        },
      }));

      this.setCachedData(cacheKey, words);
      return words;
    } catch (error) {
      console.error(`❌ Urdu word-by-word API failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getFootnoteExplanation(footnoteId) {
    const cacheKey = this.generateCacheKey('getFootnoteExplanation', { footnoteId });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getFootnoteExplanationInternal(footnoteId, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getFootnoteExplanationInternal(footnoteId, cacheKey) {
    this._assertApiEnabled();
    try {
      const response = await apiService.makeRequest(`/urdu/footnote/${footnoteId}`);
      const explanation = response?.footnote_text ?? 'Explanation not available';

      this.setCachedData(cacheKey, explanation);
      return explanation;
    } catch (error) {
      const message = error?.message || '';
      const footnoteNotFound =
        message.includes('Footnote not found') || message.includes('404');

      if (footnoteNotFound) {
        console.warn(`⚠️ Urdu footnote ${footnoteId} not found in API, skipping.`);
        this.setCachedData(cacheKey, null);
        return null;
      }

      console.error(`❌ Urdu footnote API failed for ${footnoteId}:`, error);
      throw error;
    }
  }

  async getAllExplanations(surahNo, ayahNo) {
    const cacheKey = this.generateCacheKey('getAllExplanations', { surahNo, ayahNo });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAllExplanationsInternal(surahNo, ayahNo, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAllExplanationsInternal(surahNo, ayahNo, cacheKey) {
    try {
      const translation = await this.getAyahTranslation(surahNo, ayahNo);
      if (!translation || translation.trim() === '') {
        this.setCachedData(cacheKey, []);
        return [];
      }

      const explanations = await this.extractExplanationsFromFootnotes(translation, surahNo, ayahNo);
      this.setCachedData(cacheKey, explanations);
      return explanations;
    } catch (error) {
      console.error(`❌ Urdu explanations failed for ${surahNo}:${ayahNo}:`, error);
      throw error;
    }
  }

  async getExplanation(surahNo, ayahNo) {
    const explanations = await this.getAllExplanations(surahNo, ayahNo);
    if (explanations.length > 0) {
      return explanations[0].explanation;
    }

    const translation = await this.getAyahTranslation(surahNo, ayahNo);
    return translation || 'N/A';
  }

  async extractExplanationsFromFootnotes(translationText, surahNo, ayahNo) {
    const explanations = [];
    if (!translationText) return explanations;

    const footnoteRegex = /<sup[^>]*foot_note="([^"]+)"[^>]*>(\d+)<\/sup>/g;
    const footnoteIds = new Map();
    let match;

    while ((match = footnoteRegex.exec(translationText)) !== null) {
      const footnoteId = match[1];
      const footnoteNumber = parseInt(match[2], 10);
      if (!footnoteIds.has(footnoteId)) {
        footnoteIds.set(footnoteId, footnoteNumber);
      }
    }

    const entries = Array.from(footnoteIds.entries())
      .sort((a, b) => a[1] - b[1]);

    for (const [footnoteId, footnoteNumber] of entries) {
      try {
        const explanation = await this.getFootnoteExplanation(footnoteId);
        if (explanation && explanation.trim() !== '' && explanation !== 'Explanation not available') {
          explanations.push({
            explanation,
            explanation_no: footnoteNumber,
          });
        }
      } catch (error) {
        console.warn(`⚠️ Unable to load Urdu explanation for footnote ${footnoteId}:`, error);
      }
    }

    return explanations;
  }

  parseUrduTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const supTags = tempDiv.querySelectorAll('sup[foot_note]');
    supTags.forEach(element => {
      const footnoteId = element.getAttribute('foot_note');
      const footnoteNumber = element.textContent.trim();

      if (footnoteId && /^\d+$/.test(footnoteNumber)) {
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

        element.setAttribute('data-footnote-id', footnoteId);
        element.setAttribute('data-footnote-number', footnoteNumber);
        element.setAttribute('data-surah', surahNo);
        element.setAttribute('data-ayah', ayahNo);
        element.setAttribute('title', `Click to view explanation ${footnoteNumber}`);
        element.className = 'urdu-footnote-link';
        element.removeAttribute('foot_note');
      }
    });

    return tempDiv.innerHTML;
  }

  async fetchBlockwiseUrdu(surahNo, startAyah, endAyah) {
    const cacheKey = this.generateCacheKey('fetchBlockwiseUrdu', { surahNo, startAyah, endAyah });
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const ayahNumbers = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      ayahNumbers.push(ayah);
    }

    const translations = await Promise.all(
      ayahNumbers.map(async ayah => ({
        ayah,
        translation: await this.getAyahTranslation(surahNo, ayah),
      })),
    );

    this.setCachedData(cacheKey, translations);
    return translations;
  }

  async isAvailable() {
    try {
      this._assertApiEnabled();
      await apiService.checkLanguageHealth(this.language);
      return true;
    } catch (error) {
      console.error('❌ Urdu service not available:', error);
      return false;
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  destroy() {
    this.clearCache();
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheEnabled: this.cacheEnabled,
      cacheTtl: this.cacheTtl,
      mode: 'API-only',
    };
  }
}

export default new UrduTranslationService();



