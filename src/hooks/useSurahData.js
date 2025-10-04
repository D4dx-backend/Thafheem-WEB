import { useState, useEffect, useCallback } from 'react';
import { fetchSurahs, listSurahNames } from '../api/apifunction';

// In-memory cache for surah data
let surahCache = null;
let surahNamesCache = null;
let surahCachePromise = null;
let surahNamesCachePromise = null;

/**
 * Custom hook for fetching and caching surah data
 * Prevents duplicate API calls across components
 */
export const useSurahData = () => {
  const [surahs, setSurahs] = useState(surahCache || []);
  const [loading, setLoading] = useState(!surahCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahs = async () => {
      // Return cached data if available
      if (surahCache) {
        setSurahs(surahCache);
        setLoading(false);
        return;
      }

      // If a fetch is already in progress, wait for it
      if (surahCachePromise) {
        try {
          const data = await surahCachePromise;
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
        
        surahCachePromise = fetchSurahs();
        const data = await surahCachePromise;
        
        surahCache = data;
        setSurahs(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching surahs:', err);
      } finally {
        setLoading(false);
        surahCachePromise = null;
      }
    };

    loadSurahs();
  }, []);

  const retry = useCallback(async () => {
    surahCache = null;
    surahCachePromise = null;
    setLoading(true);
    setError(null);
    
    try {
      surahCachePromise = fetchSurahs();
      const data = await surahCachePromise;
      surahCache = data;
      setSurahs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching surahs:', err);
    } finally {
      setLoading(false);
      surahCachePromise = null;
    }
  }, []);

  return { surahs, loading, error, retry };
};

/**
 * Custom hook for fetching and caching surah names only
 * More lightweight for components that only need names
 */
export const useSurahNames = () => {
  const [surahNames, setSurahNames] = useState(surahNamesCache || []);
  const [loading, setLoading] = useState(!surahNamesCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSurahNames = async () => {
      // Return cached data if available
      if (surahNamesCache) {
        setSurahNames(surahNamesCache);
        setLoading(false);
        return;
      }

      // If a fetch is already in progress, wait for it
      if (surahNamesCachePromise) {
        try {
          const data = await surahNamesCachePromise;
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
        
        surahNamesCachePromise = listSurahNames();
        const data = await surahNamesCachePromise;
        
        surahNamesCache = data;
        setSurahNames(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching surah names:', err);
      } finally {
        setLoading(false);
        surahNamesCachePromise = null;
      }
    };

    loadSurahNames();
  }, []);

  const retry = useCallback(async () => {
    surahNamesCache = null;
    surahNamesCachePromise = null;
    setLoading(true);
    setError(null);
    
    try {
      surahNamesCachePromise = listSurahNames();
      const data = await surahNamesCachePromise;
      surahNamesCache = data;
      setSurahNames(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching surah names:', err);
    } finally {
      setLoading(false);
      surahNamesCachePromise = null;
    }
  }, []);

  return { surahNames, loading, error, retry };
};

/**
 * Clear all caches (useful for logout or data refresh)
 */
export const clearSurahCache = () => {
  surahCache = null;
  surahNamesCache = null;
  surahCachePromise = null;
  surahNamesCachePromise = null;
};





