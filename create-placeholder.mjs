import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createPlaceholder() {
  const width = 1024;
  const height = 1024;
  const backgroundColor = '#FFF9E0'; // Lemon Yellow
  const textColor = '#000000'; // Black

  // Create SVG for text
  const svgImage = `
    <svg width="${width}" height="${height}">
      <style>
        .title { fill: ${textColor}; font-size: 200px; font-family: sans-serif; font-weight: bold; }
      </style>
      <rect width="100%" height="100%" fill="${backgroundColor}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="title">SWIM</text>
    </svg>
  `;

  const outputPath = path.resolve('public/master-icon.png');

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(outputPath);

  console.log('Placeholder master-icon.png created.');
}

createPlaceholder().catch(console.error);
