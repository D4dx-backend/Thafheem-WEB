import { useState, useEffect, useCallback } from 'react';
import { fetchSurahs, listSurahNames } from '../api/apifunction';

// In-memory cache for surah data (language-specific)
const surahCache = {};
const surahNamesCache = {};
const surahCachePromise = {};
const surahNamesCachePromise = {};

/**
 * Custom hook for fetching and caching surah data
 * Prevents duplicate API calls across components
 * @param {string} language - Optional language code to fetch language-specific surah names
 */
export const useSurahData = (language = null) => {
  const cacheKey = language || 'default';
  const [surahs, setSurahs] = useState(surahCache[cacheKey] || []);
  const [loading, setLoading] = useState(!surahCache[cacheKey]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahs = async () => {
      // Return cached data if available for this language
      if (surahCache[cacheKey]) {
        setSurahs(surahCache[cacheKey]);
        setLoading(false);
        return;
      }

      // If a fetch is already in progress for this language, wait for it
      if (surahCachePromise[cacheKey]) {
        try {
          const data = await surahCachePromise[cacheKey];
          setSurahs(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      // Start new fetch
      try {
        setLoading(true);
        setError(null);
        
        surahCachePromise[cacheKey] = fetchSurahs({ language });
        const data = await surahCachePromise[cacheKey];
        
        surahCache[cacheKey] = data;
        setSurahs(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching surahs:', err);
      } finally {
        setLoading(false);
        surahCachePromise[cacheKey] = null;
      }
    };

    loadSurahs();
  }, [language, cacheKey]);

  const retry = useCallback(async () => {
    surahCache[cacheKey] = null;
    surahCachePromise[cacheKey] = null;
    setLoading(true);
    setError(null);
    
    try {
      surahCachePromise[cacheKey] = fetchSurahs({ language });
      const data = await surahCachePromise[cacheKey];
      surahCache[cacheKey] = data;
      setSurahs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching surahs:', err);
    } finally {
      setLoading(false);
      surahCachePromise[cacheKey] = null;
    }
  }, [language, cacheKey]);

  return { surahs, loading, error, retry };
};

/**
 * Custom hook for fetching and caching surah names only
 * More lightweight for components that only need names
 * @param {string} language - Optional language code to fetch language-specific surah names
 */
export const useSurahNames = (language = null) => {
  const cacheKey = language || 'default';
  const [surahNames, setSurahNames] = useState(surahNamesCache[cacheKey] || []);
  const [loading, setLoading] = useState(!surahNamesCache[cacheKey]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahNames = async () => {
      // Return cached data if available for this language
      if (surahNamesCache[cacheKey]) {
        setSurahNames(surahNamesCache[cacheKey]);
        setLoading(false);
        return;
      }

      // If a fetch is already in progress for this language, wait for it
      if (surahNamesCachePromise[cacheKey]) {
        try {
          const data = await surahNamesCachePromise[cacheKey];
          setSurahNames(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
        return;
      }

      // Start new fetch
      try {
        setLoading(true);
        setError(null);
        
        surahNamesCachePromise[cacheKey] = listSurahNames(language);
        const data = await surahNamesCachePromise[cacheKey];
        
        surahNamesCache[cacheKey] = data;
        setSurahNames(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching surah names:', err);
      } finally {
        setLoading(false);
        surahNamesCachePromise[cacheKey] = null;
      }
    };

    loadSurahNames();
  }, [language, cacheKey]);

  const retry = useCallback(async () => {
    surahNamesCache[cacheKey] = null;
    surahNamesCachePromise[cacheKey] = null;
    setLoading(true);
    setError(null);
    
    try {
      surahNamesCachePromise[cacheKey] = listSurahNames(language);
      const data = await surahNamesCachePromise[cacheKey];
      surahNamesCache[cacheKey] = data;
      setSurahNames(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching surah names:', err);
    } finally {
      setLoading(false);
      surahNamesCachePromise[cacheKey] = null;
    }
  }, [language, cacheKey]);

  return { surahNames, loading, error, retry };
};

/**
 * Clear all caches (useful for logout or data refresh)
 */
export const clearSurahCache = () => {
  Object.keys(surahCache).forEach(key => delete surahCache[key]);
  Object.keys(surahNamesCache).forEach(key => delete surahNamesCache[key]);
  Object.keys(surahCachePromise).forEach(key => delete surahCachePromise[key]);
  Object.keys(surahNamesCachePromise).forEach(key => delete surahNamesCachePromise[key]);
};





