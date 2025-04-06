/**
 * MusicBrainz API Service
 * 
 * This service provides functions to fetch Taylor Swift's music data from the MusicBrainz API.
 * It includes methods for retrieving artist information, albums, and songs.
 * Implementation uses Axios with a proxy server to avoid CORS issues.
 */

import axios from 'axios';

// Taylor Swift's MusicBrainz ID
const TAYLOR_SWIFT_MBID = '20244d07-534f-4eff-b4d4-930878889970';

// Use the local proxy server to avoid CORS issues
const API_BASE_URL = 'http://localhost:3001/api';

// Create an axios instance for the proxy server
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

/**
 * Fetch Taylor Swift's artist information from MusicBrainz
 * @returns {Promise<Object>} Artist information
 */
export async function fetchTaylorSwiftInfo() {
  try {
    const response = await apiClient.get(`/artist/${TAYLOR_SWIFT_MBID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Taylor Swift info:', error);
    throw error;
  }
}

/**
 * Fetch Taylor Swift's albums from MusicBrainz
 * @returns {Promise<Array>} List of albums
 */
export async function fetchTaylorSwiftAlbums() {
  try {
    const response = await apiClient.get('/release-groups', {
      params: {
        artist: TAYLOR_SWIFT_MBID,
        type: 'album',
        limit: 100
      }
    });
    
    return response.data['release-groups'];
  } catch (error) {
    console.error('Error fetching Taylor Swift albums:', error);
    throw error;
  }
}

/**
 * Fetch songs from a specific Taylor Swift album
 * @param {string} releaseGroupId - MusicBrainz release group ID
 * @returns {Promise<Array>} List of songs in the album
 */
export async function fetchAlbumSongs(releaseGroupId) {
  try {
    // First, get the releases in this release group
    const releaseResponse = await apiClient.get(`/release-group/${releaseGroupId}`);
    
    // Use the first release to get the tracks
    if (releaseResponse.data.releases && releaseResponse.data.releases.length > 0) {
      const releaseId = releaseResponse.data.releases[0].id;
      
      // Get recordings (songs) for this release
      const recordingsResponse = await apiClient.get(`/release/${releaseId}`);
      
      // Extract and format the songs
      const songs = [];
      if (recordingsResponse.data.media && recordingsResponse.data.media.length > 0) {
        recordingsResponse.data.media.forEach(medium => {
          if (medium.tracks && medium.tracks.length > 0) {
            medium.tracks.forEach(track => {
              songs.push({
                id: track.recording.id,
                title: track.recording.title,
                length: track.recording.length,
                position: track.position,
                discNumber: medium.position,
                releaseId: releaseId,
                releaseGroupId: releaseGroupId
              });
            });
          }
        });
      }
      
      return songs;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching songs for album ${releaseGroupId}:`, error);
    throw error;
  }
}

/**
 * Fetch all Taylor Swift songs across all her albums
 * @returns {Promise<Array>} List of all songs with album information
 */
export async function fetchAllTaylorSwiftSongs() {
  try {
    // Get all albums first
    const albums = await fetchTaylorSwiftAlbums();
    
    // Fetch songs for each album
    const songsPromises = albums.map(async album => {
      const songs = await fetchAlbumSongs(album.id);
      
      // Add album information to each song
      return songs.map(song => ({
        ...song,
        albumTitle: album.title,
        albumId: album.id,
        firstReleaseDate: album['first-release-date']
      }));
    });
    
    // Wait for all songs to be fetched
    const songsArrays = await Promise.all(songsPromises);
    
    // Flatten the array of arrays into a single array of songs
    return songsArrays.flat();
  } catch (error) {
    console.error('Error fetching all Taylor Swift songs:', error);
    throw error;
  }
}

/**
 * Fetch album artwork URL from the Cover Art Archive
 * @param {string} releaseId - MusicBrainz release ID
 * @returns {Promise<string|null>} URL to the album artwork or null if not found
 */
export async function fetchAlbumArtwork(releaseId) {
  try {
    const response = await apiClient.get(`/cover-art/${releaseId}`);
    
    if (response.data.images && response.data.images.length > 0) {
      // Return the front image if available
      const frontImage = response.data.images.find(image => image.front);
      if (frontImage) {
        return frontImage.image;
      }
      
      // Otherwise return the first image
      return response.data.images[0].image;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching artwork for release ${releaseId}:`, error);
    // Don't throw the error, just return null for missing artwork
    return null;
  }
}
