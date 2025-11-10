const fs = require('fs');
const path = require('path');

// Files to clean
const files = [
  'src/services/banglaTranslationService.js',
  'src/services/HindiTranslationService.js',
  'src/config/apiConfig.js',
  'src/api/apis.js',
  'src/services/banglaWordByWordService.js',
  'src/components/AyahModal.jsx'
];

// Debug log patterns to remove
const debugPatterns = [
  /console\.log\([^)]*[💾🔧📥✅🌐⚠️📦⏳🔍][^)]*\);/g,
  /console\.log\(`[^`]*[💾🔧📥✅🌐⚠️📦⏳🔍][^`]*`\);/g,
  /console\.log\(`[^`]*API configuration[^`]*`\);/g,
  /console\.log\(`[^`]*API base URL[^`]*`\);/g,
  /console\.log\(`[^`]*Bangla WordByWord Service initialized[^`]*`\);/g,
  /console\.log\(`[^`]*🔍[^`]*`\);/g,
  /console\.log\(`[^`]*🌐[^`]*`\);/g,
  /console\.log\(`[^`]*💾[^`]*`\);/g,
  /console\.log\(`[^`]*✅[^`]*`\);/g,
  /console\.log\(`[^`]*⏳[^`]*`\);/g,
  /console\.log\(`[^`]*📦[^`]*`\);/g,
  /console\.log\(`[^`]*🔧[^`]*`\);/g,
  /console\.log\(`[^`]*📥[^`]*`\);/g,
  /console\.log\(`[^`]*⚠️[^`]*`\);/g
];

function cleanFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let originalLength = content.length;

    // Remove debug logs
    debugPatterns.forEach(pattern => {
      content = content.replace(pattern, '');
    });

    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Remove standalone logging statements
    content = content.replace(/^\s*console\.log\([^)]*\);\s*$/gm, '');
    
    // Remove logging statements with emojis
    content = content.replace(/^\s*console\.log\(`[^`]*[💾🔧📥✅🌐⚠️📦⏳🔍][^`]*`\);\s*$/gm, '');
    
    // Clean up multiple empty lines
    content = content.replace(/\n{3,}/g, '\n\n');

    if (content.length !== originalLength) {
      fs.writeFileSync(fullPath, content, 'utf8');
} else {
}
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
  }
}

// Clean all files
files.forEach(cleanFile);
