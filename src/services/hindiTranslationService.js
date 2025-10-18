// Hindi Translation & Explanation Service
// Loads from public/quran_hindi.db using SQL.js

class HindiTranslationService {
  constructor() {
    this.dbPath = '/quran_hindi.db';
    this.dbPromise = null;
    this.translationCache = new Map();
    this.explanationCache = new Map();
  }

  async initHindiDB() {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = (async () => {
      // Wait until SQL.js loader is available (same pattern as Tamil service)
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
        throw new Error(`Failed to fetch Hindi DB: ${response.status} ${response.statusText}`);
      }
      const buffer = await response.arrayBuffer();
      return new SQL.Database(new Uint8Array(buffer));
    })();

    return this.dbPromise;
  }

  async getAyahTranslation(chapterNumber, verseNumber) {
    const cacheKey = `${chapterNumber}:${verseNumber}`;
    if (this.translationCache.has(cacheKey)) return this.translationCache.get(cacheKey);

    const db = await this.initHindiDB();
    const stmt = db.prepare(
      `SELECT translation_text FROM hindi_translation WHERE chapter_number = ? AND verse_number = ?`
    );
    const row = stmt.getAsObject([chapterNumber, verseNumber]);
    stmt.free();
    const text = row && row.translation_text ? row.translation_text : '';
    this.translationCache.set(cacheKey, text);
    return text;
  }

  // Parse Hindi translation text and make footnotes clickable
  parseHindiTranslationWithClickableFootnotes(htmlContent, surahNo, ayahNo) {
    if (!htmlContent) return "";


    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Find all footnote sup tags - try different selectors
    let supTags = tempDiv.querySelectorAll("sup.f-note a");
    
    if (supTags.length === 0) {
      // Try alternative selectors
      supTags = tempDiv.querySelectorAll("sup a");
    }
    if (supTags.length === 0) {
      // Try finding any sup with numbers
      supTags = tempDiv.querySelectorAll("sup");
    }

    supTags.forEach((element, index) => {
      let footnoteNumber = '';
      let sup = element;
      
      
      // Extract footnote number from different possible structures
      if (element.tagName === 'A') {
        footnoteNumber = element.textContent.trim();
        sup = element.parentElement;
      } else if (element.tagName === 'SUP') {
        // Check if sup contains an anchor
        const link = element.querySelector('a');
        if (link) {
          footnoteNumber = link.textContent.trim();
        } else {
          footnoteNumber = element.textContent.trim();
        }
      }

      
      if (/^\d+$/.test(footnoteNumber)) {
        // Style as clickable button (similar to interpretation system)
        sup.style.cssText = `
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
        sup.setAttribute("data-footnote", footnoteNumber);
        sup.setAttribute("data-surah", surahNo);
        sup.setAttribute("data-ayah", ayahNo);
        sup.setAttribute("title", `Click to view explanation ${footnoteNumber}`);
        sup.className = "hindi-footnote-link";
        
        // Remove the inner link and just keep the number
        sup.innerHTML = footnoteNumber;
      } else {
      }
    });

    const result = tempDiv.innerHTML;
    return result;
  }

  // Get explanation by footnote number
  async getExplanationByFootnote(surahNo, ayahNo, footnoteNumber) {
    try {
      
      const cacheKey = `${surahNo}:${ayahNo}:${footnoteNumber}`;
      if (this.explanationCache.has(cacheKey)) {
        return this.explanationCache.get(cacheKey);
      }

      const db = await this.initHindiDB();
      
      
      // First, let's check what data exists for this surah/ayah
      const checkStmt = db.prepare(
        `SELECT * FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ?`
      );
      const allRows = [];
      while (checkStmt.step()) {
        const row = checkStmt.getAsObject();
        allRows.push(row);
      }
      checkStmt.free();
      
      // Try both column names to see which one has the data
      let row = null;
      let usedColumn = null;
      
      // Try explanation_no_BN first
      const stmtBN = db.prepare(
        `SELECT explanation FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ? AND explanation_no_BN = ?`
      );
      const rowBN = stmtBN.getAsObject([surahNo, ayahNo, footnoteNumber]);
      stmtBN.free();
      
      if (rowBN && rowBN.explanation) {
        row = rowBN;
        usedColumn = 'explanation_no_BN';
      } else {
        // Try explanation_no_EN
        const stmtEN = db.prepare(
          `SELECT explanation FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ? AND explanation_no_EN = ?`
        );
        const rowEN = stmtEN.getAsObject([surahNo, ayahNo, footnoteNumber]);
        stmtEN.free();
        
        if (rowEN && rowEN.explanation) {
          row = rowEN;
          usedColumn = 'explanation_no_EN';
        }
      }
      
      
      // If no specific footnote found, try to find any explanation for this surah/ayah
      if (!row || !row.explanation) {
        if (process.env.NODE_ENV === 'development') {
        }
        try {
          const generalStmt = db.prepare(
            `SELECT explanation FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ? LIMIT 1`
          );
          const generalRow = generalStmt.getAsObject([surahNo, ayahNo]);
          generalStmt.free();
          
          if (generalRow && generalRow.explanation) {
            if (process.env.NODE_ENV === 'development') {
            }
            const text = `Footnote ${footnoteNumber}: ${generalRow.explanation}`;
            this.explanationCache.set(cacheKey, text);
            return text;
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
          }
        }
      }
      
      const text = row && row.explanation ? row.explanation : 'Explanation not available';
      this.explanationCache.set(cacheKey, text);
      return text;
    } catch (error) {
      console.error('❌ Error in getExplanationByFootnote:', error);
      console.error('Error details:', error.stack);
      return `Error loading explanation: ${error.message}`;
    }
  }

  async getExplanation(surahNo, ayahNo) {
    const cacheKey = `${surahNo}:${ayahNo}`;
    if (this.explanationCache.has(cacheKey)) return this.explanationCache.get(cacheKey);

    const db = await this.initHindiDB();
    const stmt = db.prepare(
      `SELECT explanation FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ?`
    );
    const row = stmt.getAsObject([surahNo, ayahNo]);
    stmt.free();
    const text = row && row.explanation ? row.explanation : 'N/A';
    this.explanationCache.set(cacheKey, text);
    return text;
  }

  // Get all explanations for an ayah (returns array of explanations)
  async getAllExplanations(surahNo, ayahNo) {
    const cacheKey = `${surahNo}:${ayahNo}:all`;
    if (this.explanationCache.has(cacheKey)) return this.explanationCache.get(cacheKey);

    const db = await this.initHindiDB();
    const stmt = db.prepare(
      `SELECT explanation, explanation_no_BN, explanation_no_EN FROM hindi_explanation WHERE surah_no = ? AND ayah_no = ? ORDER BY explanation_no_BN ASC, explanation_no_EN ASC`
    );
    stmt.bind([surahNo, ayahNo]);
    
    const explanations = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      if (row.explanation && row.explanation.trim() !== '') {
        explanations.push({
          explanation: row.explanation,
          explanation_no_BN: row.explanation_no_BN,
          explanation_no_EN: row.explanation_no_EN
        });
      }
    }
    stmt.free();
    
    this.explanationCache.set(cacheKey, explanations);
    return explanations;
  }

  async fetchBlockwiseHindi(surahNo, startAyah, endAyah) {
    const db = await this.initHindiDB();

    // Fetch translations in range
    const translationsStmt = db.prepare(
      `SELECT verse_number, translation_text FROM hindi_translation WHERE chapter_number = ? AND verse_number >= ? AND verse_number <= ? ORDER BY verse_number ASC`
    );
    translationsStmt.bind([surahNo, startAyah, endAyah]);
    const translations = new Map();
    while (translationsStmt.step()) {
      const row = translationsStmt.getAsObject();
      translations.set(row.verse_number, row.translation_text || '');
    }
    translationsStmt.free();

    // Fetch explanations in range
    const explanationsStmt = db.prepare(
      `SELECT ayah_no, explanation FROM hindi_explanation WHERE surah_no = ? AND ayah_no >= ? AND ayah_no <= ? ORDER BY ayah_no ASC`
    );
    explanationsStmt.bind([surahNo, startAyah, endAyah]);
    const explanations = new Map();
    while (explanationsStmt.step()) {
      const row = explanationsStmt.getAsObject();
      explanations.set(row.ayah_no, row.explanation || 'N/A');
    }
    explanationsStmt.free();

    const items = [];
    for (let ayah = startAyah; ayah <= endAyah; ayah += 1) {
      items.push({
        ayah,
        translation: translations.get(ayah) || '',
        explanation: explanations.get(ayah) || 'N/A',
      });
    }
    return items;
  }
}

const hindiTranslationService = new HindiTranslationService();

// Debug functions (development only)
if (process.env.NODE_ENV === 'development') {
  window.debugHindiDB = async function() {
    try {
      const db = await hindiTranslationService.initHindiDB();
      
      // Get table schema
      const schemaStmt = db.prepare("PRAGMA table_info(hindi_explanation)");
      const columns = [];
      while (schemaStmt.step()) {
        const row = schemaStmt.getAsObject();
        columns.push(row);
      }
      schemaStmt.free();
      
      // Check all data for Surah 5, Ayah 2 (the one being tested)
      const allDataStmt = db.prepare("SELECT * FROM hindi_explanation WHERE surah_no = 5 AND ayah_no = 2");
      const allData = [];
      while (allDataStmt.step()) {
        const row = allDataStmt.getAsObject();
        allData.push(row);
      }
      allDataStmt.free();
      
      return { columns, data: allData };
    } catch (error) {
      console.error('❌ Debug error:', error);
      return null;
    }
  };
  
  // Clear cache function
  window.clearHindiCache = function() {
    hindiTranslationService.explanationCache.clear();
  };
}

export default hindiTranslationService;



