const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Load album data
const albumsData = require('../src/data/static-albums.json');
const outputDir = path.join(__dirname, '../public/img/covers');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate placeholder images for each album
albumsData.forEach(album => {
  const canvas = createCanvas(300, 300);
  const ctx = canvas.getContext('2d');
  
  // Background color from album data
  ctx.fillStyle = album.color || '#cccccc';
  ctx.fillRect(0, 0, 300, 300);
  
  // Album title
  ctx.fillStyle = getContrastColor(album.color || '#cccccc');
  ctx.font = 'bold 24px Arial';
  
  // Split title into lines if needed
  const words = album.title.split(' ');
  let lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    if (ctx.measureText(currentLine + ' ' + words[i]).width < 280) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);
  
  // Draw title lines
  const lineHeight = 30;
  const startY = 150 - ((lines.length - 1) * lineHeight / 2);
  
  lines.forEach((line, index) => {
    const textWidth = ctx.measureText(line).width;
    ctx.fillText(line, (300 - textWidth) / 2, startY + index * lineHeight);
  });
  
  // Draw year
  ctx.font = 'bold 18px Arial';
  const yearText = album.year.toString();
  const yearWidth = ctx.measureText(yearText).width;
  ctx.fillText(yearText, (300 - yearWidth) / 2, 220);
  
  // Save the image
  const outputPath = path.join(outputDir, path.basename(album.coverImageUrl));
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Generated placeholder for ${album.title}`);
});

console.log('All placeholder images generated successfully');

// Helper function to determine contrasting text color
function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
