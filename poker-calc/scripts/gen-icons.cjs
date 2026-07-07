const sharp = require('sharp');
const path = require('path');

const svg = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="32" fill="#1a2c38"/>
  <text x="96" y="110" text-anchor="middle" font-size="80" font-family="sans-serif" fill="#2d9cdb">♠</text>
  <text x="96" y="150" text-anchor="middle" font-size="32" font-family="sans-serif" fill="white" font-weight="bold">Poker+</text>
</svg>`;

const out = path.resolve(__dirname, '..', 'public');

Promise.all([
  sharp(Buffer.from(svg)).resize(192, 192).png().toFile(path.join(out, 'icon-192.png')),
  sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(out, 'icon-512.png')),
]).then(() => console.log('Icons generated'));
