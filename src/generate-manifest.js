const fs = require('fs');
const path = require('path');

// Detect user's system language
function detectSystemLanguage() {
  // In Node.js, we can use the LANG environment variable as a fallback
  const lang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES || 'en-US';
  
  // Check if the language starts with 'zh'
  if (lang.startsWith('zh')) {
    return 'zh';
  }
  
  // Default to English for all other languages
  return 'en';
}

// Get the language
const language = detectSystemLanguage();

// Read the appropriate manifest file
const manifestPath = path.join(__dirname, `manifest_${language}.json`);
const outputPath = path.join(__dirname, '..', 'dist', 'manifest.json');

// Ensure the dist directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
}

// Copy the manifest file
fs.copyFileSync(manifestPath, outputPath);

console.log(`Generated manifest.json for language: ${language}`); 