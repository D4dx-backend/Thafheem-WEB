// Arabic Text Service
// Fetches Arabic Quran text from MySQL database via API

import apiService from './apiService.js';

class ArabicTextService {
  constructor() {
    this.cache = new Map();
    this.cacheEnabled = true;
    this.cacheTtl = 300000; // 5 minutes
    this.pendingRequests = new Map();
  }

  generateCacheKey(surahId, ayahNumber) {
    return `arabic_${surahId}_${ayahNumber}`;
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

  async getAyahText(surahId, ayahNumber) {
    const cacheKey = this.generateCacheKey(surahId, ayahNumber);
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const requestPromise = this._getAyahTextInternal(surahId, ayahNumber, cacheKey);
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async _getAyahTextInternal(surahId, ayahNumber, cacheKey) {
    try {
      const response = await apiService.getArabicText(surahId, ayahNumber);
      const result = {
        text_uthmani: response?.text_uthmani || '',
        text_simple: response?.text_simple || '',
        surah: response?.surah || surahId,
        ayah: response?.ayah || ayahNumber
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Arabic text API failed for ${surahId}:${ayahNumber}:`, error);
      throw error;
    }
  }

  async getSurahText(surahId) {
    // This would need to be implemented if needed
    // For now, just return empty array
    return [];
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

export default new ArabicTextService();







