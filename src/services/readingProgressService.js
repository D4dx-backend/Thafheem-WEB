const STORAGE_KEY = "thafheem:last-reading";

const isBrowserEnvironment = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readStorage = () => {
  if (!isBrowserEnvironment()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.surahId) return null;
    return parsed;
  } catch (error) {
    console.error("Failed to read last reading from storage:", error);
    return null;
  }
};

export const saveLastReading = ({ surahId, verseId = null, path, viewType = "surah" }) => {
  if (!isBrowserEnvironment()) return;
  if (!surahId) return;

  try {
    const payload = {
      surahId: String(surahId),
      verseId: verseId ? String(verseId) : null,
      viewType,
      path: path || `/surah/${surahId}`,
      timestamp: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Failed to save last reading to storage:", error);
  }
};

export const getLastReading = () => readStorage();

export const clearLastReading = () => {
  if (!isBrowserEnvironment()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear last reading from storage:", error);
  }
};

export const LAST_READING_STORAGE_KEY = STORAGE_KEY;

