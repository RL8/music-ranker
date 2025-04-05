/**
 * Taylor Swift Data Service
 * 
 * This service handles fetching, transforming, and storing Taylor Swift's music data.
 * It combines the MusicBrainz API and caching services to provide a seamless data experience.
 */

import { supabase } from '@/lib/supabase/client';
import * as mbApi from './api';
import * as mbCache from './cache';

/**
 * Initialize Taylor Swift data
 * This function checks the cache first, then fetches from MusicBrainz if needed
 * @returns {Promise<Object>} Object containing artist, albums, and songs data
 */
export async function initializeTaylorSwiftData() {
  try {
    // Check if data exists in cache
    if (mbCache.cacheExists() && !mbCache.isCacheStale()) {
      console.log('Using cached Taylor Swift data');
      
      // Return data from cache
      return {
        artist: mbCache.getCachedArtistData(),
        albums: mbCache.getCachedAlbumsData(),
        songs: mbCache.getCachedSongsData()
      };
    }
    
    console.log('Fetching Taylor Swift data from MusicBrainz');
    
    // Fetch data from MusicBrainz
    const artist = await mbApi.fetchTaylorSwiftInfo();
    const albums = await mbApi.fetchTaylorSwiftAlbums();
    const songs = await fetchAllSongsWithDetails();
    
    // Cache the data
    mbCache.cacheArtistData(artist);
    mbCache.cacheAlbumsData(albums);
    mbCache.cacheSongsData(songs);
    
    return { artist, albums, songs };
  } catch (error) {
    console.error('Error initializing Taylor Swift data:', error);
    throw error;
  }
}

/**
 * Fetch all songs with additional details
 * @returns {Promise<Array>} Enhanced songs data
 */
async function fetchAllSongsWithDetails() {
  const songs = await mbApi.fetchAllTaylorSwiftSongs();
  
  // Process songs in batches to avoid overwhelming the API
  const enhancedSongs = [];
  const batchSize = 10;
  
  for (let i = 0; i < songs.length; i += batchSize) {
    const batch = songs.slice(i, i + batchSize);
    const enhancedBatch = await Promise.all(
      batch.map(async (song) => {
        // Add additional details if needed
        return song;
      })
    );
    
    enhancedSongs.push(...enhancedBatch);
    
    // Add a small delay to avoid rate limiting
    if (i + batchSize < songs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return enhancedSongs;
}

/**
 * Store Taylor Swift data in Supabase
 * @param {Object} data - Object containing artist, albums, and songs data
 * @returns {Promise<Object>} Result of the storage operation
 */
export async function storeTaylorSwiftDataInSupabase(data) {
  try {
    // First, check if Taylor Swift already exists in the database
    const { data: existingArtist } = await supabase
      .from('artists')
      .select('id')
      .eq('name', 'Taylor Swift')
      .single();
    
    let artistId;
    
    if (existingArtist) {
      // Use existing artist ID
      artistId = existingArtist.id;
    } else {
      // Insert Taylor Swift as an artist
      const { data: newArtist, error: artistError } = await supabase
        .from('artists')
        .insert({
          name: 'Taylor Swift',
          genre: 'Pop',
          description: data.artist.disambiguation || 'American singer-songwriter',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards.png'
        })
        .select()
        .single();
      
      if (artistError) throw artistError;
      artistId = newArtist.id;
    }
    
    // Process each song and insert into database
    const songsToInsert = data.songs.map(song => ({
      title: song.title,
      artist_id: artistId,
      album: song.album.title,
      release_year: song.album.releaseDate ? parseInt(song.album.releaseDate.split('-')[0], 10) : null,
      genre: 'Pop',
      duration: song.length ? Math.floor(song.length / 1000) : null, // Convert from ms to seconds
      image_url: null // Will be updated later if available
    }));
    
    // Insert songs in batches to avoid overwhelming the database
    const batchSize = 50;
    const results = { inserted: 0, errors: [] };
    
    for (let i = 0; i < songsToInsert.length; i += batchSize) {
      const batch = songsToInsert.slice(i, i + batchSize);
      
      const { data: insertedSongs, error } = await supabase
        .from('songs')
        .insert(batch)
        .select();
      
      if (error) {
        results.errors.push(error);
      } else if (insertedSongs) {
        results.inserted += insertedSongs.length;
      }
    }
    
    return {
      success: results.errors.length === 0,
      artistId,
      songsInserted: results.inserted,
      errors: results.errors
    };
  } catch (error) {
    console.error('Error storing Taylor Swift data in Supabase:', error);
    throw error;
  }
}

/**
 * Check if Taylor Swift data needs updating
 * @returns {Promise<Object>} Status object with needsUpdate flag and message
 */
export async function checkForUpdates() {
  try {
    // Check if cache is stale
    const isCacheStale = mbCache.isCacheStale(30); // 30 days
    
    // Check if we have Taylor Swift data in Supabase
    const { count, error } = await supabase
      .from('songs')
      .select('id', { count: 'exact', head: true })
      .eq('artist_id', (await supabase
        .from('artists')
        .select('id')
        .eq('name', 'Taylor Swift')
        .single()).data?.id || '');
    
    if (error) throw error;
    
    const needsUpdate = isCacheStale || !count || count === 0;
    
    return {
      needsUpdate,
      message: needsUpdate 
        ? 'Taylor Swift data needs to be updated or initialized' 
        : 'Taylor Swift data is up to date'
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return {
      needsUpdate: true,
      message: 'Error checking for updates, assuming update is needed',
      error
    };
  }
}
