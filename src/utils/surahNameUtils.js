import { surahNameUnicodes } from "../components/surahNameUnicodes";

const SURAH_NAME_FONT = "SuraName, Amiri, serif";

export const getCalligraphicSurahName = (surahId, fallbackName) => {
  const numericId = parseInt(surahId, 10);
  if (!Number.isNaN(numericId)) {
    const unicodeValue = surahNameUnicodes[String(numericId)];
    if (unicodeValue) {
      const hex = unicodeValue.replace("U+", "");
      const codePoint = parseInt(hex, 16);
      if (!Number.isNaN(codePoint)) {
        return String.fromCodePoint(codePoint);
      }
    }
  }
  return fallbackName;
};

export const surahNameFontFamily = SURAH_NAME_FONT;

