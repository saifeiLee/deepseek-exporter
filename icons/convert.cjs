const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

async function convertSvgToPng() {
    for (const size of sizes) {
        const svgPath = path.join(__dirname, `icon${size}.svg`);
        const pngPath = path.join(__dirname, `icon${size}.png`);

        await sharp(svgPath)
            .png()
            .toFile(pngPath);

        console.log(`Converted icon${size}.svg to icon${size}.png`);
    }
}

convertSvgToPng().catch(err => console.error('Error converting icons:', err));