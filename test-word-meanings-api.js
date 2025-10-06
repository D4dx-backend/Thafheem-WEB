// Test script to verify word meanings API connection
const API_BASE_URL = "https://thafheem.net/thafheem-api";

async function testWordMeaningsAPI() {
  console.log("Testing Word Meanings API...");
  
  try {
    // Test with Al-Fatiha, verse 1
    const url = `${API_BASE_URL}/wordmeanings/1/1/M`;
    console.log("Testing URL:", url);
    
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response:", data);
    
    if (data && data.length > 0) {
      console.log("✅ API is working!");
      console.log("Sample word:", data[0]);
      
      // Check the structure
      const firstWord = data[0];
      console.log("Available fields:", Object.keys(firstWord));
      
      // Look for Arabic text field
      const arabicField = firstWord.ArabicText || firstWord.arabic_text || firstWord.Arabic || "Not found";
      console.log("Arabic text field:", arabicField);
      
      // Look for Malayalam meaning field
      const malayalamField = firstWord.MalayalamMeaning || firstWord.malayalam_meaning || firstWord.meaning || "Not found";
      console.log("Malayalam meaning field:", malayalamField);
      
    } else {
      console.log("❌ API returned empty data");
    }
    
  } catch (error) {
    console.error("❌ API test failed:", error.message);
  }
}

// Run the test
testWordMeaningsAPI();