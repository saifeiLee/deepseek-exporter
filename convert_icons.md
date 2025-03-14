# Converting SVG Icons to PNG

For the Chrome extension to work properly, you need to convert the SVG icons to PNG format. Here are a few ways to do this:

## Option 1: Online Converters

You can use online tools to convert the SVG files to PNG:

1. [Convertio](https://convertio.co/svg-png/)
2. [SVG to PNG Converter](https://svgtopng.com/)
3. [CloudConvert](https://cloudconvert.com/svg-to-png)

## Option 2: Using Inkscape (Free Software)

1. Download and install [Inkscape](https://inkscape.org/)
2. Open the SVG file in Inkscape
3. Go to File > Export PNG Image
4. Set the export size and save the PNG file

## Option 3: Using Node.js and sharp

If you have Node.js installed, you can use the sharp library:

1. Install sharp: `npm install sharp`
2. Create a file named `convert.js` with the following content:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

async function convertSvgToPng() {
  for (const size of sizes) {
    const svgPath = path.join(__dirname, 'icons', `icon${size}.svg`);
    const pngPath = path.join(__dirname, 'icons', `icon${size}.png`);
    
    await sharp(svgPath)
      .png()
      .toFile(pngPath);
      
    console.log(`Converted icon${size}.svg to icon${size}.png`);
  }
}

convertSvgToPng().catch(err => console.error('Error converting icons:', err));
```

3. Run the script: `node convert.js`

## Option 4: Using ImageMagick

If you have ImageMagick installed:

```bash
convert icons/icon16.svg icons/icon16.png
convert icons/icon48.svg icons/icon48.png
convert icons/icon128.svg icons/icon128.png
```

After converting, make sure to place the PNG files in the `icons` directory with the correct names: `icon16.png`, `icon48.png`, and `icon128.png`. 