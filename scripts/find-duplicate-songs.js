/**
 * Script to find Taylor Swift songs that appear on multiple albums
 * This script analyzes the JSON data to identify songs that are present
 * on more than one album, which could include re-recordings, live versions, etc.
 */

const fs = require('fs');
const path = require('path');

// Paths to the JSON files
const albumsPath = path.resolve(__dirname, '../src/data/taylor-swift-albums.json');
const songsPath = path.resolve(__dirname, '../src/data/taylor-swift-songs.json');

// Load the data
const albums = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
const songs = JSON.parse(fs.readFileSync(songsPath, 'utf8'));

console.log(`Loaded ${albums.length} albums and ${songs.length} songs`);

// Create a map of album IDs to album titles for easier reference
const albumMap = {};
albums.forEach(album => {
  albumMap[album.id] = album.title || 'Unknown Album';
});

// Map song titles to their appearances
const songAppearances = {};

songs.forEach(song => {
  const title = song.title;
  const albumId = song.releaseGroupId;
  const albumTitle = albumMap[albumId] || 'Unknown Album';
  
  // Skip songs without proper titles
  if (!title || title.trim() === '') return;
  
  // Initialize if this is the first time seeing this song
  if (!songAppearances[title]) {
    songAppearances[title] = [];
  }
  
  // Add this appearance
  songAppearances[title].push({
    songId: song.id,
    albumId: albumId,
    albumTitle: albumTitle,
    position: song.position || 'Unknown Position',
    length: song.length
  });
});

// Find songs with multiple appearances
const songsOnMultipleAlbums = {};
Object.entries(songAppearances).forEach(([title, appearances]) => {
  if (appearances.length > 1) {
    songsOnMultipleAlbums[title] = appearances;
  }
});

// Count and output the results
const multipleCount = Object.keys(songsOnMultipleAlbums).length;
console.log(`\n===== SUMMARY =====`);
console.log(`Found ${multipleCount} songs that appear on multiple albums`);

// Calculate some statistics
const appearanceCounts = Object.values(songsOnMultipleAlbums).map(appearances => appearances.length);
const maxAppearances = Math.max(...appearanceCounts);
const avgAppearances = appearanceCounts.reduce((sum, count) => sum + count, 0) / appearanceCounts.length;

console.log(`Maximum appearances for a single song: ${maxAppearances}`);
console.log(`Average appearances per song that appears multiple times: ${avgAppearances.toFixed(2)}`);

// Identify the top 10 songs with the most appearances
const songsByAppearanceCount = Object.entries(songsOnMultipleAlbums)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10);

console.log('\n===== TOP 10 SONGS BY NUMBER OF APPEARANCES =====');
songsByAppearanceCount.forEach(([title, appearances], index) => {
  console.log(`\n${index + 1}. "${title}" (${appearances.length} appearances):`);
  appearances.slice(0, 5).forEach(appearance => {
    console.log(`   - Album: "${appearance.albumTitle}" (Track ${appearance.position})`);
  });
  
  if (appearances.length > 5) {
    console.log(`   - and ${appearances.length - 5} more appearances...`);
  }
});

// Count songs that appear as "Taylor's Version"
const taylorsVersionSongs = Object.entries(songsOnMultipleAlbums)
  .filter(([title, _]) => title.toLowerCase().includes("taylor's version"))
  .length;

console.log(`\n===== RE-RECORDINGS STATISTICS =====`);
console.log(`Songs with "Taylor's Version" in the title: ${taylorsVersionSongs}`);

// Analyze by album - which albums share the most songs?
const albumOverlap = {};
albums.forEach(album => {
  const albumId = album.id;
  const albumTitle = album.title || 'Unknown Album';
  
  albumOverlap[albumId] = {
    title: albumTitle,
    sharedSongs: {}
  };
});

Object.entries(songsOnMultipleAlbums).forEach(([songTitle, appearances]) => {
  // For each song on multiple albums
  for (let i = 0; i < appearances.length; i++) {
    const albumId1 = appearances[i].albumId;
    
    for (let j = i + 1; j < appearances.length; j++) {
      const albumId2 = appearances[j].albumId;
      
      // Skip if same album (could happen with different versions/mixes)
      if (albumId1 === albumId2) continue;
      
      // Update album1's overlap
      if (!albumOverlap[albumId1].sharedSongs[albumId2]) {
        albumOverlap[albumId1].sharedSongs[albumId2] = [];
      }
      albumOverlap[albumId1].sharedSongs[albumId2].push(songTitle);
      
      // Update album2's overlap
      if (!albumOverlap[albumId2].sharedSongs[albumId1]) {
        albumOverlap[albumId2].sharedSongs[albumId1] = [];
      }
      albumOverlap[albumId2].sharedSongs[albumId1].push(songTitle);
    }
  }
});

// Find the pairs of albums with the most shared songs
const albumPairs = [];
Object.entries(albumOverlap).forEach(([albumId1, albumData1]) => {
  Object.entries(albumData1.sharedSongs).forEach(([albumId2, sharedSongs]) => {
    // Only add each pair once (when albumId1 < albumId2)
    if (albumId1 < albumId2) {
      albumPairs.push({
        album1: albumData1.title,
        album2: albumOverlap[albumId2].title,
        sharedCount: sharedSongs.length,
        sharedSongs: sharedSongs
      });
    }
  });
});

// Sort by number of shared songs
albumPairs.sort((a, b) => b.sharedCount - a.sharedCount);

console.log('\n===== TOP 5 ALBUM PAIRS WITH SHARED SONGS =====');
albumPairs.slice(0, 5).forEach((pair, index) => {
  console.log(`\n${index + 1}. "${pair.album1}" and "${pair.album2}" share ${pair.sharedCount} songs:`);
  pair.sharedSongs.slice(0, 3).forEach(song => {
    console.log(`   - "${song}"`);
  });
  if (pair.sharedSongs.length > 3) {
    console.log(`   - and ${pair.sharedSongs.length - 3} more...`);
  }
});
