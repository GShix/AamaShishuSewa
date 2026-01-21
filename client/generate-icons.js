import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_IMAGE = path.join(__dirname, 'public', 'logo.png'); // Create this file first!
const OUTPUT_DIR = path.join(__dirname, 'public');

// Icon sizes needed for PWA
const ICON_SIZES = [
  { name: 'pwa-64x64.png', size: 64 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.ico', size: 32 },
];

// Maskable icon (with safe zone padding)
const MASKABLE_SIZE = 512;
const MASKABLE_NAME = 'maskable-icon-512x512.png';

async function generateIcons() {
  try {
    // Check if source image exists
    if (!fs.existsSync(SOURCE_IMAGE)) {
      console.error('❌ Source image not found!');
      console.log('📝 Please create a logo.png file in the public/ directory');
      console.log('   Recommended: 1024x1024 PNG with transparent background');
      process.exit(1);
    }

    console.log('🎨 Starting icon generation...\n');

    // Generate standard icons
    for (const icon of ICON_SIZES) {
      const outputPath = path.join(OUTPUT_DIR, icon.name);
      
      await sharp(SOURCE_IMAGE)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate maskable icon (with padding for safe zone)
    const maskablePath = path.join(OUTPUT_DIR, MASKABLE_NAME);
    const padding = Math.floor(MASKABLE_SIZE * 0.2); // 20% padding for safe zone
    const innerSize = MASKABLE_SIZE - (padding * 2);

    await sharp(SOURCE_IMAGE)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for maskable
      })
      .png()
      .toFile(maskablePath);

    console.log(`✅ Generated ${MASKABLE_NAME} (${MASKABLE_SIZE}x${MASKABLE_SIZE}) with safe zone\n`);

    // Generate favicon.ico
    const faviconPath = path.join(OUTPUT_DIR, 'favicon.ico');
    await sharp(SOURCE_IMAGE)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ Generated favicon.ico\n');

    console.log('🎉 All icons generated successfully!');
    console.log('\n📦 Generated files:');
    console.log('   - pwa-64x64.png');
    console.log('   - pwa-192x192.png');
    console.log('   - pwa-512x512.png');
    console.log('   - maskable-icon-512x512.png');
    console.log('   - apple-touch-icon.png');
    console.log('   - favicon.ico');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
