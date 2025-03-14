// This script converts SVG icons to PNG
// To use this script:
// 1. Install Node.js if you don't have it already
// 2. Run: npm install sharp
// 3. Run: node convert.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

async function convertSvgToPng() {
  console.log('Starting conversion of SVG icons to PNG...');
  
  for (const size of sizes) {
    const svgPath = path.join(__dirname, 'icons', `icon${size}.svg`);
    const pngPath = path.join(__dirname, 'icons', `icon${size}.png`);
    
    if (!fs.existsSync(svgPath)) {
      console.error(`Error: ${svgPath} does not exist`);
      continue;
    }
    
    try {
      await sharp(svgPath)
        .png()
        .toFile(pngPath);
        
      console.log(`✓ Converted icon${size}.svg to icon${size}.png`);
    } catch (err) {
      console.error(`Error converting icon${size}.svg:`, err.message);
    }
  }
  
  console.log('Conversion complete!');
}

convertSvgToPng().catch(err => console.error('Error converting icons:', err)); 