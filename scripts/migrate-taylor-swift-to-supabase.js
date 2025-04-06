/**
 * Migration script to convert Taylor Swift JSON data to Supabase tables
 * 
 * This script:
 * 1. Reads the Taylor Swift album and song data from JSON files
 * 2. Transforms the data to match the Supabase table structure
 * 3. Uploads the data to Supabase
 * 
 * Usage: 
 * 1. Ensure you have the correct Supabase credentials in your .env.local file
 * 2. Run this script with: node migrate-taylor-swift-to-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env.local file');
  console.error('Make sure you have VUE_APP_SUPABASE_URL and VUE_APP_SUPABASE_KEY defined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Paths to the JSON files
const albumsPath = path.resolve(__dirname, '../src/data/taylor-swift-albums.json');
const songsPath = path.resolve(__dirname, '../src/data/taylor-swift-songs.json');

// Helper function to determine era based on release date
function getEra(releaseDate) {
  if (!releaseDate) return "Unknown";
  
  try {
    const year = parseInt(releaseDate.substring(0, 4));
    
    if (year >= 2006 && year < 2008) return "Taylor Swift";
    else if (year >= 2008 && year < 2010) return "Fearless";
    else if (year >= 2010 && year < 2012) return "Speak Now";
    else if (year >= 2012 && year < 2014) return "Red";
    else if (year >= 2014 && year < 2017) return "1989";
    else if (year >= 2017 && year < 2019) return "Reputation";
    else if (year >= 2019 && year < 2020) return "Lover";
    else if (year >= 2020 && year < 2022) return "Folklore/Evermore";
    else if (year >= 2022 && year < 2024) return "Midnights";
    else if (year >= 2024) return "Tortured Poets Department";
    else return "Unknown";
  } catch (e) {
    console.error(`Error parsing release date: ${releaseDate}`, e);
    return "Unknown";
  }
}

// Function to check if a table exists
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

// Helper function to determine Taylor Swift eras based on release date
function determineEra(releaseDate) {
  if (!releaseDate) return null;
  
  const date = new Date(releaseDate);
  const year = date.getFullYear();
  
  // Determine era based on release year
  if (year <= 2008) return 'Debut Era';
  if (year <= 2010) return 'Fearless Era';
  if (year <= 2012) return 'Speak Now Era';
  if (year <= 2014) return 'Red Era';
  if (year <= 2017) return '1989 Era';
  if (year <= 2019) return 'Reputation Era';
  if (year <= 2020) return 'Lover Era';
  if (year <= 2021) return 'Folklore/Evermore Era';
  return 'Midnights Era';
}

// Helper function to check if an album title indicates it's a Taylor's Version
function isTaylorsVersion(title) {
  if (!title) return false;
  return title.toLowerCase().includes("taylor's version");
}

// Helper function to check if a song is from the vault
function isFromVault(title) {
  if (!title) return false;
  return title.toLowerCase().includes("from the vault");
}

// Helper function to detect live albums based on title or type
function isLiveAlbum(album) {
  if (!album) return false;
  
  // Check title for live indicators
  if (album.title && (
    album.title.toLowerCase().includes('live') ||
    album.title.toLowerCase().includes('tour') ||
    album.title.toLowerCase().includes('concert')
  )) {
    return true;
  }
  
  // Check secondary types for "live" indicator
  if (album.secondaryTypes && 
      Array.isArray(album.secondaryTypes) && 
      album.secondaryTypes.some(type => type.toLowerCase() === 'live')) {
    return true;
  }
  
  return false;
}

// Helper function to determine the version type of a song appearance
function determineVersionType(song, album) {
  if (isLiveAlbum(album)) {
    return 'live';
  }
  
  if (song.title) {
    const title = song.title.toLowerCase();
    if (title.includes('acoustic')) return 'acoustic';
    if (title.includes('remix')) return 'remix';
    if (title.includes('demo')) return 'demo';
    if (title.includes('voice memo')) return 'voice memo';
  }
  
  return 'studio';
}

// Helper to generate a deterministic UUID v5 (if needed for reproducible IDs)
function generateDeterministicId(input) {
  // This is a placeholder. In a real implementation, you'd use a UUID v5 generator
  // For now, we'll rely on Supabase's uuid_generate_v4() for simplicity
  return null;
}

// Main migration function
async function migrateData() {
  console.log('Starting Taylor Swift data migration to Supabase...');
  
  try {
    // Read JSON files
    console.log('Reading JSON files...');
    const albumsData = JSON.parse(fs.readFileSync(albumsPath, 'utf8'));
    const songsData = JSON.parse(fs.readFileSync(songsPath, 'utf8'));
    
    console.log(`Found ${albumsData.length} albums and ${songsData.length} songs`);
    
    // Track the mapping between old IDs and new UUIDs
    const albumIdMap = new Map();
    const songIdMap = new Map();
    const uniqueSongTitles = new Map(); // Track unique songs by title to avoid duplicates
    
    // 1. Insert albums
    console.log('Step 1: Inserting albums...');
    for (const album of albumsData) {
      // Prepare album data for insertion
      const albumData = {
        // We'll let Supabase generate UUID
        title: album.title || 'Unknown Album',
        first_release_date: album.first_release_date || album.release_date || null,
        album_types: album.types || [],
        secondary_types: album.secondaryTypes || [],
        era: determineEra(album.first_release_date || album.release_date),
        is_taylors_version: isTaylorsVersion(album.title),
        artwork_url: album.cover?.url || null,
        description: album.disambiguation || null,
        metadata: {
          original_id: album.id,
          mbid: album.mbid || null,
          arid: album.arid || null
        }
      };
      
      // Insert album into Supabase
      const { data: insertedAlbum, error } = await supabase
        .from('taylor_swift_albums')
        .insert(albumData)
        .select()
        .single();
      
      if (error) {
        console.error(`Error inserting album "${album.title}":`, error);
        continue;
      }
      
      // Store the mapping between old ID and new UUID
      albumIdMap.set(album.id, insertedAlbum.id);
      console.log(`Inserted album: ${insertedAlbum.title} (${insertedAlbum.id})`);
    }
    
    // 2. Insert unique songs first
    console.log('\nStep 2: Inserting unique songs...');
    for (const song of songsData) {
      // Skip songs without titles
      if (!song.title) continue;
      
      // Check if we've already processed this song title
      if (!uniqueSongTitles.has(song.title)) {
        // Get the canonical album for this song (first appearance)
        const canonicalAlbumId = song.releaseGroupId ? albumIdMap.get(song.releaseGroupId) : null;
        
        // Prepare song data for insertion
        const songData = {
          // We'll let Supabase generate UUID
          title: song.title,
          canonical_album_id: canonicalAlbumId,
          length_ms: song.length || null,
          is_taylors_version: isTaylorsVersion(song.title),
          is_from_vault: isFromVault(song.title),
          metadata: {
            original_id: song.id,
            work_id: song.workId || null
          }
        };
        
        // Insert song into Supabase
        const { data: insertedSong, error } = await supabase
          .from('taylor_swift_songs')
          .insert(songData)
          .select()
          .single();
        
        if (error) {
          console.error(`Error inserting song "${song.title}":`, error);
          continue;
        }
        
        // Store the mapping and mark this title as processed
        songIdMap.set(song.id, insertedSong.id);
        uniqueSongTitles.set(song.title, insertedSong.id);
        console.log(`Inserted song: ${insertedSong.title} (${insertedSong.id})`);
      } else {
        // This is a duplicate song title, just record the mapping
        songIdMap.set(song.id, uniqueSongTitles.get(song.title));
      }
    }
    
    // 3. Create song appearances (junction table entries)
    console.log('\nStep 3: Creating song appearances on albums...');
    for (const song of songsData) {
      // Skip songs without titles or release group
      if (!song.title || !song.releaseGroupId) continue;
      
      // Get the mapped IDs
      const newSongId = songIdMap.get(song.id);
      const newAlbumId = albumIdMap.get(song.releaseGroupId);
      
      if (!newSongId || !newAlbumId) {
        console.warn(`Missing mapping for song "${song.title}" or its album. Skipping.`);
        continue;
      }
      
      // Find the album object
      const album = albumsData.find(a => a.id === song.releaseGroupId);
      
      // Prepare appearance data
      const appearanceData = {
        song_id: newSongId,
        album_id: newAlbumId,
        position: song.position || null,
        disc_number: song.medium || 1,
        is_bonus_track: song.isBonus || false,
        version_type: determineVersionType(song, album)
      };
      
      // Insert appearance into Supabase
      const { data: insertedAppearance, error } = await supabase
        .from('taylor_swift_song_appearances')
        .insert(appearanceData)
        .select()
        .single();
      
      if (error) {
        console.error(`Error creating appearance for "${song.title}" on album ID ${newAlbumId}:`, error);
        continue;
      }
      
      console.log(`Created appearance: "${song.title}" (Track ${appearanceData.position}) on album ID ${newAlbumId}`);
    }
    
    console.log('\nMigration completed successfully!');
    console.log(`Inserted ${albumIdMap.size} albums, ${uniqueSongTitles.size} unique songs, and ${songIdMap.size} song appearances.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateData().catch(console.error);
