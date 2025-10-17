// Urdu Translation & Explanation Service
// Loads from public/quran_urdu.db using SQL.js

class UrduTranslationService {
  constructor() {
    this.dbPath = '/quran_urdu.db';
    this.dbPromise = null;
    this.translationCache = new Map();
    this.footnoteCache = new Map();
  }

  async initUrduDB() {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = (async () => {
      // Wait until SQL.js loader is available (same pattern as Hindi service)
      await new Promise((resolve) => {
        const wait = () => {
          if (window.initSqlJs) resolve();
          else setTimeout(wait, 100);
        };
        wait();
      });

      const SQL = await window.initSqlJs({
        locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
      });

      const response = await fetch(this.dbPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch Urdu DB: ${response.status} ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      return new SQL.Database(new Uint8Array(buffer));
    })();

    return this.dbPromise;
  }

  async getAyahTranslation(chapterNumber, verseNumber) {
    const cacheKey = `${chapterNumber}:${verseNumber}`;
    if (this.translationCache.has(cacheKey)) return this.translationCache.get(cacheKey);

    const db = await this.initUrduDB();
    const stmt = db.prepare(
      `SELECT translation_text FROM urdu_tranlations WHERE chapter_number = ? AND verse_number = ?`
    );
    const row = stmt.getAsObject([chapterNumber, verseNumber]);
    stmt.free();
    const text = row && row.translation_text ? row.translation_text : '';
    this.translationCache.set(cacheKey, text);
    return text;
  }

  // Parse Urdu translation text and make footnotes clickable
  parseUrduTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Find all footnote sup tags with foot_note attribute
    const supTags = tempDiv.querySelectorAll("sup[foot_note]");

    supTags.forEach((element) => {
      const footnoteId = element.getAttribute("foot_note");
      const footnoteNumber = element.textContent.trim();

      if (footnoteId && /^\d+$/.test(footnoteNumber)) {
        // Style as clickable button (similar to Hindi system)
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
        
        // Add data attributes for click handling
        element.setAttribute("data-footnote-id", footnoteId);
        element.setAttribute("data-footnote-number", footnoteNumber);
        element.setAttribute("data-surah", surahNo);
        element.setAttribute("data-ayah", ayahNo);
        element.setAttribute("title", `Click to view explanation ${footnoteNumber}`);
        element.className = "urdu-footnote-link";
        
        // Remove the foot_note attribute to clean up
        element.removeAttribute("foot_note");
      }
    });

    const result = tempDiv.innerHTML;
    return result;
  }

  // Get footnote explanation by footnote ID
  async getFootnoteExplanation(footnoteId) {
    try {
      const cacheKey = `footnote:${footnoteId}`;
      if (this.footnoteCache.has(cacheKey)) {
        return this.footnoteCache.get(cacheKey);
      }

      const db = await this.initUrduDB();
      const stmt = db.prepare(
        `SELECT footnote_text FROM urdu_footnotes WHERE id = ?`
      );
      const row = stmt.getAsObject([footnoteId]);
      stmt.free();
      
      const text = row && row.footnote_text ? row.footnote_text : 'Explanation not available';
      this.footnoteCache.set(cacheKey, text);
      return text;
    } catch (error) {
      console.error('❌ Error in getFootnoteExplanation:', error);
      return `Error loading explanation: ${error.message}`;
    }
  }

  async fetchBlockwiseUrdu(surahNo, startAyah, endAyah) {
    const db = await this.initUrduDB();

    // Fetch translations in range
    const translationsStmt = db.prepare(
      `SELECT verse_number, translation_text FROM urdu_tranlations WHERE chapter_number = ? AND verse_number >= ? AND verse_number <= ? ORDER BY verse_number ASC`
    );
    translationsStmt.bind([surahNo, startAyah, endAyah]);
    const translations = new Map();
    while (translationsStmt.step()) {
      const row = translationsStmt.getAsObject();
      translations.set(row.verse_number, row.translation_text || '');
    }
    translationsStmt.free();

    const items = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah += 1) {
      items.push({
        ayah,
        translation: translations.get(ayah) || '',
      });
    }
    return items;
  }
}

const urduTranslationService = new UrduTranslationService();

// Debug functions (development only)
if (process.env.NODE_ENV === 'development') {
  window.debugUrduDB = async function() {
    try {
      const db = await urduTranslationService.initUrduDB();
      
      // Get table schema
      const schemaStmt = db.prepare("PRAGMA table_info(urdu_tranlations)");
      const columns = [];
      while (schemaStmt.step()) {
        const row = schemaStmt.getAsObject();
        columns.push(row);
      }
      schemaStmt.free();
      
      // Check sample data
      const sampleStmt = db.prepare("SELECT * FROM urdu_tranlations WHERE chapter_number = 1 AND verse_number = 1");
      const sampleData = [];
      while (sampleStmt.step()) {
        const row = sampleStmt.getAsObject();
        sampleData.push(row);
      }
      sampleStmt.free();
      
      return { columns, data: sampleData };
    } catch (error) {
      console.error('❌ Debug error:', error);
      return null;
    }
  };
  
  // Clear cache function
  window.clearUrduCache = function() {
    urduTranslationService.translationCache.clear();
    urduTranslationService.footnoteCache.clear();
  };
}

export default urduTranslationService;
