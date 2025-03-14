// This is a simple Node.js script to create placeholder SVG icons
// You can run this with Node.js to generate the icon files
// Or you can create your own custom icons and replace these files

const fs = require('fs');
const path = require('path');

// SVG template for the icon
const createSvgIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size/8}" fill="#4285f4"/>
  <path d="M${size*0.75} ${size*0.625}v${size*0.167}a${size*0.083} ${size*0.083} 0 0 1-${size*0.083} ${size*0.083}H${size*0.208}a${size*0.083} ${size*0.083} 0 0 1-${size*0.083}-${size*0.083}v-${size*0.167}" 
        stroke="white" stroke-width="${size*0.042}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="${size*0.292} ${size*0.417} ${size*0.5} ${size*0.625} ${size*0.708} ${size*0.417}" 
            stroke="white" stroke-width="${size*0.042}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="${size*0.5}" y1="${size*0.625}" x2="${size*0.5}" y2="${size*0.125}" 
        stroke="white" stroke-width="${size*0.042}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`.trim();

// Create icons of different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const svgContent = createSvgIcon(size);
  const filePath = path.join(__dirname, `icon${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created icon: ${filePath}`);
});

console.log('Icon creation complete. Convert these SVGs to PNG files for use in the extension.');
console.log('You can use online tools or software like Inkscape to convert SVG to PNG.'); 