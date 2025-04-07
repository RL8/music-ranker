/**
 * Taylor Swift Data Migration Script
 * 
 * This script migrates Taylor Swift data from local JSON files to the Supabase database
 * using the improved schema with junction tables for song appearances.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL and service key must be set in .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Load data from JSON files
const loadJsonData = (filename) => {
  try {
    const filePath = path.resolve(__dirname, '../src/data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
};

// Main migration function
async function migrateData() {
  console.log('Starting Taylor Swift data migration...');
  
  try {
    // Load data from JSON files
    const artistInfo = loadJsonData('taylor-swift-info.json');
    const albums = loadJsonData('taylor-swift-albums.json');
    const songs = loadJsonData('taylor-swift-songs.json');
    
    if (!artistInfo || !albums || !songs) {
      console.error('Failed to load required data files');
      process.exit(1);
    }
    
    console.log(`Loaded data: ${albums.length} albums, ${songs.length} songs`);
    
    // Create a map to track unique songs by title (for deduplication)
    const uniqueSongs = new Map();
    const songIdMap = new Map(); // Maps original song IDs to new UUIDs
    
    // First pass: identify unique songs
    for (const song of songs) {
      const normalizedTitle = song.title.trim().toLowerCase();
      
      if (!uniqueSongs.has(normalizedTitle)) {
        uniqueSongs.set(normalizedTitle, {
          title: song.title,
          duration_ms: song.duration_ms || 0,
          explicit: song.explicit || false,
          spotify_id: song.spotify_id || null,
          originalIds: [song.id] // Track original IDs
        });
      } else {
        // Add this occurrence's ID to the list
        uniqueSongs.get(normalizedTitle).originalIds.push(song.id);
      }
    }
    
    console.log(`Found ${uniqueSongs.size} unique songs out of ${songs.length} total songs`);
    
    // Insert albums
    console.log('Inserting albums...');
    const albumIdMap = new Map(); // Maps original album IDs to new UUIDs
    
    for (const album of albums) {
      const { data: albumData, error: albumError } = await supabase
        .from('taylor_swift_albums')
        .insert({
          title: album.title,
          era: album.era || 'Unknown',
          release_date: album.first_release_date || new Date().toISOString().split('T')[0],
          is_taylors_version: album.title.includes("(Taylor's Version)"),
          cover_image_url: album.cover_image_url || null,
          spotify_id: album.spotify_id || null,
          total_tracks: album.total_tracks || 0
        })
        .select('id')
        .single();
      
      if (albumError) {
        console.error(`Error inserting album ${album.title}:`, albumError);
        continue;
      }
      
      // Map the original ID to the new UUID
      albumIdMap.set(album.id, albumData.id);
      console.log(`Inserted album: ${album.title} (${albumData.id})`);
    }
    
    // Insert unique songs
    console.log('Inserting unique songs...');
    for (const [normalizedTitle, songData] of uniqueSongs.entries()) {
      const { data: insertedSong, error: songError } = await supabase
        .from('taylor_swift_songs')
        .insert({
          title: songData.title,
          duration_ms: songData.duration_ms,
          explicit: songData.explicit,
          spotify_id: songData.spotify_id
        })
        .select('id')
        .single();
      
      if (songError) {
        console.error(`Error inserting song ${songData.title}:`, songError);
        continue;
      }
      
      // Map all original IDs to the new UUID
      for (const originalId of songData.originalIds) {
        songIdMap.set(originalId, insertedSong.id);
      }
      
      console.log(`Inserted song: ${songData.title} (${insertedSong.id})`);
    }
    
    // Insert song appearances (junction table entries)
    console.log('Inserting song appearances...');
    const appearances = [];
    
    for (const song of songs) {
      const newSongId = songIdMap.get(song.id);
      const newAlbumId = albumIdMap.get(song.releaseGroupId);
      
      if (!newSongId || !newAlbumId) {
        console.warn(`Skipping appearance for song ${song.title}: missing mapped IDs`);
        continue;
      }
      
      appearances.push({
        song_id: newSongId,
        album_id: newAlbumId,
        position: song.position || 1,
        disc_number: song.disc_number || 1,
        version_type: determineVersionType(song.title)
      });
    }
    
    // Insert appearances in batches to avoid API limits
    const batchSize = 50;
    for (let i = 0; i < appearances.length; i += batchSize) {
      const batch = appearances.slice(i, i + batchSize);
      const { error: appearanceError } = await supabase
        .from('taylor_swift_song_appearances')
        .insert(batch);
      
      if (appearanceError) {
        console.error(`Error inserting song appearances batch ${i / batchSize + 1}:`, appearanceError);
      } else {
        console.log(`Inserted ${batch.length} song appearances (batch ${i / batchSize + 1})`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error during migration:', error);
    process.exit(1);
  }
}

/**
 * Determine the version type of a song based on its title
 * @param {string} title - Song title
 * @returns {string} - Version type (studio, live, acoustic, demo, etc.)
 */
function determineVersionType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('(live)') || lowerTitle.includes(' live ')) {
    return 'live';
  } else if (lowerTitle.includes('(acoustic)') || lowerTitle.includes(' acoustic ')) {
    return 'acoustic';
  } else if (lowerTitle.includes('(demo)') || lowerTitle.includes(' demo ')) {
    return 'demo';
  } else if (lowerTitle.includes('(voice memo)') || lowerTitle.includes('voice memo')) {
    return 'voice memo';
  } else if (lowerTitle.includes('(taylor\'s version)') || lowerTitle.includes('(taylors version)')) {
    return 'taylors version';
  } else if (lowerTitle.includes('(from the vault)') || lowerTitle.includes('from the vault')) {
    return 'from the vault';
  } else if (lowerTitle.includes('remix') || lowerTitle.includes('(remix)')) {
    return 'remix';
  }
  
  return 'studio';
}

// Run the migration
migrateData();
