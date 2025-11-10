// Test script to verify word meanings API connection
const API_BASE_URL = "https://thafheem.net/thafheem-api";

async function testWordMeaningsAPI() {
try {
    // Test with Al-Fatiha, verse 1
    const url = `${API_BASE_URL}/wordmeanings/1/1/M`;
const response = await fetch(url);
if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
if (data && data.length > 0) {
// Check the structure
      const firstWord = data[0];
// Look for Arabic text field
      const arabicField = firstWord.ArabicText || firstWord.arabic_text || firstWord.Arabic || "Not found";
// Look for Malayalam meaning field
      const malayalamField = firstWord.MalayalamMeaning || firstWord.malayalam_meaning || firstWord.meaning || "Not found";
} else {
}
    
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

// Run the test
testWordMeaningsAPI();