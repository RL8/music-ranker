/**
 * Taylor Swift Data Service
 * 
 * This service provides access to Taylor Swift's music data from static JSON files.
 * It's a simple approach that avoids CORS issues and API rate limits.
 */

// Import the static data files
// Note: These files will be created when you run the fetchTaylorSwiftData.js script
import artistInfo from '@/data/taylor-swift-info.json';
import albums from '@/data/taylor-swift-albums.json';
import songs from '@/data/taylor-swift-songs.json';

/**
 * Get Taylor Swift's artist information
 * @returns {Object} Artist information
 */
export function getArtistInfo() {
  return artistInfo;
}

/**
 * Get all Taylor Swift albums
 * @returns {Array} List of albums
 */
export function getAlbums() {
  return albums;
}

/**
 * Get an album by ID
 * @param {string} albumId - The album ID to find
 * @returns {Object|null} The album or null if not found
 */
export function getAlbumById(albumId) {
  return albums.find(album => album.id === albumId) || null;
}

/**
 * Get all Taylor Swift songs
 * @returns {Array} List of songs
 */
export function getAllSongs() {
  return songs;
}

/**
 * Get songs for a specific album
 * @param {string} albumId - The album ID to get songs for
 * @returns {Array} List of songs in the album
 */
export function getSongsByAlbumId(albumId) {
  return songs.filter(song => song.releaseGroupId === albumId);
}

/**
 * Get a song by ID
 * @param {string} songId - The song ID to find
 * @returns {Object|null} The song or null if not found
 */
export function getSongById(songId) {
  return songs.find(song => song.id === songId) || null;
}
