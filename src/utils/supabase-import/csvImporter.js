import { supabase } from '../../lib/supabase/client'
import { executeRawSql } from '../../lib/supabase/admin-client'

/**
 * Utility for importing CSV data into Supabase tables
 * Specifically designed for the Taylor Swift discography data
 */

/**
 * Parse CSV text into an array of objects
 * @param {string} csvText - The raw CSV text
 * @returns {Array} - Array of objects with keys from the header row
 */
export const parseCSV = (csvText) => {
  // Split by lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  // Parse header row (first line)
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || null;
    });
    
    return row;
  });
};

/**
 * Parse a single CSV line, handling quoted values with commas
 * @param {string} line - A single line from the CSV
 * @returns {Array} - Array of values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      // Add character to current field
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
};

/**
 * Import data into a Supabase table
 * @param {Array} data - Array of objects to insert
 * @param {string} tableName - Name of the table to insert into
 * @returns {Promise} - Result of the operation
 */
export const importToTable = async (data, tableName) => {
  if (!data || data.length === 0) {
    return { error: 'No data to import' };
  }
  
  try {
    const { error } = await supabase
      .from(tableName)
      .insert(data);
      
    if (error) {
      console.error(`Error importing to ${tableName}:`, error);
      return { error: error.message };
    }
    
    return { success: true, count: data.length };
  } catch (err) {
    console.error(`Exception importing to ${tableName}:`, err);
    return { error: err.message };
  }
};

/**
 * Create tables for the Taylor Swift schema if they don't exist
 * @returns {Promise} - Result of the operation
 */
export const createTaylorSwiftTables = async () => {
  // SQL to create the necessary tables
  const createTablesSQL = `
    -- Create artists table
    CREATE TABLE IF NOT EXISTS taylor_swift_artists (
      artist_id VARCHAR PRIMARY KEY,
      artist_name VARCHAR NOT NULL
    );
    
    -- Create eras table
    CREATE TABLE IF NOT EXISTS taylor_swift_eras (
      era_id VARCHAR PRIMARY KEY,
      era_name VARCHAR NOT NULL,
      primary_album_id VARCHAR,
      era_start_date DATE
    );
    
    -- Create albums table
    CREATE TABLE IF NOT EXISTS taylor_swift_albums (
      album_id VARCHAR PRIMARY KEY,
      album_title VARCHAR NOT NULL,
      release_date DATE,
      album_type VARCHAR,
      era_id VARCHAR REFERENCES taylor_swift_eras(era_id)
    );
    
    -- Create songs table
    CREATE TABLE IF NOT EXISTS taylor_swift_songs (
      song_id VARCHAR PRIMARY KEY,
      canonical_title VARCHAR NOT NULL,
      original_era_id VARCHAR REFERENCES taylor_swift_eras(era_id),
      notes VARCHAR
    );
    
    -- Create recordings table (junction table between songs and albums)
    CREATE TABLE IF NOT EXISTS taylor_swift_recordings (
      recording_id UUID PRIMARY KEY,
      recording_title VARCHAR NOT NULL,
      song_id VARCHAR REFERENCES taylor_swift_songs(song_id),
      album_id VARCHAR REFERENCES taylor_swift_albums(album_id),
      disc_number INTEGER,
      track_number INTEGER,
      version_type VARCHAR,
      artists_json JSONB,
      notes VARCHAR
    );
    
    -- Create user ratings table
    CREATE TABLE IF NOT EXISTS taylor_swift_user_ratings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      song_id VARCHAR REFERENCES taylor_swift_songs(song_id),
      rating INTEGER CHECK (rating >= 1 AND rating <= 10),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, song_id)
    );
  `;
  
  try {
    const result = await executeRawSql(createTablesSQL);
    return result;
  } catch (error) {
    console.error('Error creating Taylor Swift tables:', error);
    return { error: error.message };
  }
};

/**
 * Import all Taylor Swift data from CSV files
 * @param {Object} csvFiles - Object containing CSV text for each entity
 * @returns {Promise} - Results of all import operations
 */
export const importTaylorSwiftData = async (csvFiles) => {
  try {
    // First create tables if they don't exist
    const createResult = await createTaylorSwiftTables();
    if (createResult.error) {
      return { error: `Failed to create tables: ${createResult.error}` };
    }
    
    const results = {};
    
    // Import artists
    if (csvFiles.artists) {
      const artistsData = parseCSV(csvFiles.artists);
      results.artists = await importToTable(
        artistsData.map(a => ({
          artist_id: a.artistId,
          artist_name: a.artistName
        })),
        'taylor_swift_artists'
      );
    }
    
    // Import eras
    if (csvFiles.eras) {
      const erasData = parseCSV(csvFiles.eras);
      results.eras = await importToTable(
        erasData.map(e => ({
          era_id: e.eraId,
          era_name: e.eraName,
          primary_album_id: e.primaryAlbumId,
          era_start_date: e.eraStartDate
        })),
        'taylor_swift_eras'
      );
    }
    
    // Import albums
    if (csvFiles.albums) {
      const albumsData = parseCSV(csvFiles.albums);
      results.albums = await importToTable(
        albumsData.map(a => ({
          album_id: a.albumId,
          album_title: a.albumTitle,
          release_date: a.releaseDate,
          album_type: a.albumType,
          era_id: a.eraId
        })),
        'taylor_swift_albums'
      );
    }
    
    // Import songs
    if (csvFiles.songs) {
      const songsData = parseCSV(csvFiles.songs);
      results.songs = await importToTable(
        songsData.map(s => ({
          song_id: s.songId,
          canonical_title: s.canonicalTitle,
          original_era_id: s.originalEraId,
          notes: s.notes
        })),
        'taylor_swift_songs'
      );
    }
    
    // Import recordings
    if (csvFiles.recordings) {
      const recordingsData = parseCSV(csvFiles.recordings);
      results.recordings = await importToTable(
        recordingsData.map(r => ({
          recording_id: r.recordingId,
          recording_title: r.recordingTitle,
          song_id: r.songId,
          album_id: r.albumId,
          disc_number: parseInt(r.discNumber) || 1,
          track_number: parseInt(r.trackNumber) || null,
          version_type: r.versionType,
          artists_json: r.artistsJson ? JSON.parse(r.artistsJson) : null,
          notes: r.notes
        })),
        'taylor_swift_recordings'
      );
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error importing Taylor Swift data:', error);
    return { error: error.message };
  }
};

export default {
  parseCSV,
  importToTable,
  createTaylorSwiftTables,
  importTaylorSwiftData
};
