// API Service
// Centralized service for making API calls to the backend
// Handles error handling and fallback logic

import { API_BASE_URL, API_BASE_PATH } from '../config/apiConfig.js';

class ApiService {
  constructor() {
    this.requestQueue = new Map(); // Prevent duplicate requests
  }

  // Make API request with deduplication
  async makeRequest(endpoint, params = {}, options = {}) {
    const cacheKey = this.generateCacheKey(endpoint, params);

    // Check if request is already in progress
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    // Create request promise
    const requestPromise = this._makeActualRequest(endpoint, params, options);
    this.requestQueue.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      return data;
    } finally {
      // Remove from request queue
      this.requestQueue.delete(cacheKey);
    }
  }

  // Generate cache key for API requests
  generateCacheKey(endpoint, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  }

  // Actual API request implementation
  async _makeActualRequest(endpoint, params = {}, options = {}) {
    const basePath = API_BASE_PATH || `${API_BASE_URL}/api/v1`;
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${basePath}${sanitizedEndpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return data;
  }

  // Get translation for specific ayah
  async getTranslation(language, surah, ayah) {
    return this.makeRequest(`/${language}/translation/${surah}/${ayah}`);
  }

  // Get all translations for a surah
  async getSurahTranslations(language, surah, params = {}) {
    return this.makeRequest(`/${language}/surah/${surah}`, params);
  }

  // Get interpretation/explanation for specific ayah
  async getInterpretation(language, surah, ayah, explanationNo = null) {
    // For English blockwise: use /api/english/interpretation/{surahId}/{explanationNo}
    const endpoint = (language === 'english' && explanationNo)
      ? `/${language}/interpretation/${surah}/${explanationNo}`
      : `/${language}/interpretation/${surah}/${ayah}`;
    const params = (language === 'english' && explanationNo) ? {} : (explanationNo ? { explanationNo } : {});
    return this.makeRequest(endpoint, params);
  }

  // Get word-by-word data for specific ayah
  async getWordByWord(language, surah, ayah) {
    return this.makeRequest(`/${language}/word-by-word/${surah}/${ayah}`);
  }

  // Get Urdu footnote
  async getUrduFootnote(footnoteId) {
    return this.makeRequest(`/urdu/footnote/${footnoteId}`);
  }

  // Get English footnote
  async getEnglishFootnote(footnoteId) {
    return this.makeRequest(`/english/footnote/${footnoteId}`);
  }

  // Get Malayalam footnote
  async getMalayalamFootnote(footnoteId) {
    return this.makeRequest(`/malayalam/footnote/${footnoteId}`);
  }

  // Get Arabic text
  async getArabicText(surah, ayah) {
    return this.makeRequest(`/arabic/text/${surah}/${ayah}`);
  }

  // Check language health
  async checkLanguageHealth(language) {
    return this.makeRequest(`/${language}/health`);
  }
}

// Export singleton instance
export default new ApiService();
