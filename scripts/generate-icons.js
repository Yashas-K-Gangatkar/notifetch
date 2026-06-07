const sharp = require('sharp');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(__dirname, '..', 'public', 'icons');

async function generateIcon(size) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#bg)"/>
    <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" 
          font-family="Arial,sans-serif" font-weight="900" 
          font-size="${Math.round(size * 0.4)}" fill="white">&#9889;</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `icon-${size}x${size}.png`));
  console.log(`Generated icon-${size}x${size}.png`);
}

(async () => {
  for (const size of sizes) await generateIcon(size);
  await sharp(path.join(outDir, 'icon-192x192.png'))
    .resize(32, 32)
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
  console.log('Generated favicon.png');
})();
