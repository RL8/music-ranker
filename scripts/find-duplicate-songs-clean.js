/**
 * Script to find Taylor Swift songs that appear on multiple albums
 * This script focuses on clearly identifying duplicated songs across albums
 */

const fs = require('fs');
const path = require('path');

// Paths to the JSON files
const albumsPath = path.resolve(__dirname, '../src/data/taylor-swift-albums.json');
const songsPath = path.resolve(__dirname, '../src/data/taylor-swift-songs.json');

// Load the data
try {
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
      position: song.position || 'Unknown Position'
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
  const totalSongs = Object.keys(songAppearances).length;
  const percentDuplicated = ((multipleCount / totalSongs) * 100).toFixed(2);
  
  console.log('\n===== DUPLICATE SONGS ANALYSIS =====');
  console.log(`Total unique song titles: ${totalSongs}`);
  console.log(`Songs appearing on multiple albums: ${multipleCount} (${percentDuplicated}% of all songs)`);

  // Calculate some statistics
  const appearanceCounts = Object.values(songsOnMultipleAlbums).map(appearances => appearances.length);
  const maxAppearances = Math.max(...appearanceCounts);
  const avgAppearances = appearanceCounts.reduce((sum, count) => sum + count, 0) / appearanceCounts.length;
  
  console.log(`Maximum appearances for a single song: ${maxAppearances}`);
  console.log(`Average appearances per duplicated song: ${avgAppearances.toFixed(2)}`);

  // Identify types of duplication
  console.log('\n===== DUPLICATION CATEGORIES =====');
  
  // 1. Re-recordings (Taylor's Version)
  const taylorsVersionSongs = Object.entries(songsOnMultipleAlbums)
    .filter(([title, _]) => title.toLowerCase().includes("taylor's version"))
    .length;
  
  // 2. Live versions
  const liveSongs = Object.entries(songsOnMultipleAlbums)
    .filter(([title, _]) => title.toLowerCase().includes("live"))
    .length;
  
  // 3. Songs on compilation albums
  const compilationAlbums = albums.filter(album => 
    album.title && (
      album.title.toLowerCase().includes("greatest") ||
      album.title.toLowerCase().includes("collection") ||
      album.title.toLowerCase().includes("best of")
    )
  ).map(album => album.id);
  
  let compilationSongs = 0;
  Object.values(songsOnMultipleAlbums).forEach(appearances => {
    const onCompilation = appearances.some(app => compilationAlbums.includes(app.albumId));
    if (onCompilation) compilationSongs++;
  });
  
  console.log(`Re-recordings ("Taylor's Version"): ${taylorsVersionSongs}`);
  console.log(`Live versions: ${liveSongs}`);
  console.log(`Songs appearing on compilation albums: ${compilationSongs}`);

  // Identify the top 10 songs with the most appearances
  const songsByAppearanceCount = Object.entries(songsOnMultipleAlbums)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

  console.log('\n===== TOP 10 MOST DUPLICATED SONGS =====');
  songsByAppearanceCount.forEach(([title, appearances], index) => {
    console.log(`\n${index + 1}. "${title}" (${appearances.length} appearances):`);
    appearances.slice(0, 5).forEach(appearance => {
      console.log(`   - Album: "${appearance.albumTitle}" (Track ${appearance.position})`);
    });
    
    if (appearances.length > 5) {
      console.log(`   - and ${appearances.length - 5} more appearances...`);
    }
  });

  // List albums with the most duplicated content
  const albumDuplicateContent = {};
  albums.forEach(album => {
    albumDuplicateContent[album.id] = {
      title: album.title || 'Unknown Album',
      duplicatedSongs: 0,
      totalSongs: 0
    };
  });

  // Count duplicated songs per album
  songs.forEach(song => {
    const albumId = song.releaseGroupId;
    if (!albumDuplicateContent[albumId]) return;
    
    albumDuplicateContent[albumId].totalSongs++;
    
    if (songsOnMultipleAlbums[song.title]) {
      albumDuplicateContent[albumId].duplicatedSongs++;
    }
  });

  // Find albums with the highest percentage of duplicated content
  const albumsWithDuplicates = Object.values(albumDuplicateContent)
    .filter(album => album.totalSongs > 0)
    .map(album => ({
      ...album,
      duplicatePercentage: (album.duplicatedSongs / album.totalSongs) * 100
    }))
    .sort((a, b) => b.duplicatePercentage - a.duplicatePercentage)
    .slice(0, 10);

  console.log('\n===== TOP 10 ALBUMS WITH HIGHEST PERCENTAGE OF DUPLICATED SONGS =====');
  albumsWithDuplicates.forEach((album, index) => {
    console.log(`${index + 1}. "${album.title}": ${album.duplicatedSongs}/${album.totalSongs} songs (${album.duplicatePercentage.toFixed(2)}%)`);
  });

} catch (error) {
  console.error('Error analyzing song data:', error);
}
