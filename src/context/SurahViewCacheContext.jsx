import { createContext, useContext, useMemo, useRef } from 'react';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 6;

const SurahViewCacheContext = createContext(null);

const normalizeKey = (surahId, language) => {
  const normalizedSurah = String(surahId ?? '').trim();
  const normalizedLanguage = String(language ?? 'mal').trim().toLowerCase();
  return `${normalizedSurah}::${normalizedLanguage}`;
};

const pruneOldestEntry = (cacheMap) => {
  if (cacheMap.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  let oldestKey = null;
  let oldestTimestamp = Number.POSITIVE_INFINITY;

  cacheMap.forEach((value, key) => {
    if (value?.timestamp < oldestTimestamp) {
      oldestTimestamp = value.timestamp;
      oldestKey = key;
    }
  });

  if (oldestKey) {
    cacheMap.delete(oldestKey);
  }
};

const readFromCache = (cacheMap, key) => {
  const entry = cacheMap.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cacheMap.delete(key);
    return null;
  }

  return entry.payload;
};

const writeToCache = (cacheMap, key, payload) => {
  if (!payload) {
    return;
  }

  cacheMap.set(key, {
    timestamp: Date.now(),
    payload: {
      ...payload,
      __meta: {
        ...(payload.__meta || {}),
        cachedAt: Date.now(),
      },
    },
  });
  pruneOldestEntry(cacheMap);
};

const removeFromCache = (cacheMap, key) => {
  cacheMap.delete(key);
};

export const SurahViewCacheProvider = ({ children }) => {
  const ayahCacheRef = useRef(new Map());
  const blockCacheRef = useRef(new Map());

  const value = useMemo(() => {
    const buildCacheHelpers = (cacheRef) => ({
      get: (surahId, language) => {
        if (!surahId) return null;
        const key = normalizeKey(surahId, language);
        return readFromCache(cacheRef.current, key);
      },
      set: (surahId, language, payload) => {
        if (!surahId || !payload) return;
        const key = normalizeKey(surahId, language);
        writeToCache(cacheRef.current, key, {
          ...payload,
          __meta: {
            ...payload.__meta,
            language: String(language ?? 'mal').toLowerCase(),
            surahId: String(surahId ?? '').trim(),
          },
        });
      },
      clear: (surahId, language) => {
        if (!surahId) return;
        const key = normalizeKey(surahId, language);
        removeFromCache(cacheRef.current, key);
      },
      clearAll: () => {
        cacheRef.current.clear();
      },
    });

    const ayahHelpers = buildCacheHelpers(ayahCacheRef);
    const blockHelpers = buildCacheHelpers(blockCacheRef);

    return {
      getAyahViewCache: ayahHelpers.get,
      setAyahViewCache: ayahHelpers.set,
      clearAyahViewCache: ayahHelpers.clear,
      getBlockViewCache: blockHelpers.get,
      setBlockViewCache: blockHelpers.set,
      clearBlockViewCache: blockHelpers.clear,
      clearAllSurahCaches: () => {
        ayahHelpers.clearAll();
        blockHelpers.clearAll();
      },
    };
  }, []);

  return (
    <SurahViewCacheContext.Provider value={value}>
      {children}
    </SurahViewCacheContext.Provider>
  );
};

export const useSurahViewCache = () => {
  const context = useContext(SurahViewCacheContext);
  if (!context) {
    throw new Error('useSurahViewCache must be used within a SurahViewCacheProvider');
  }
  return context;
};

