/**
 * MusicBrainz API Service
 * 
 * This service provides functions to fetch Taylor Swift's music data from the MusicBrainz API.
 * It includes methods for retrieving artist information, albums, and songs.
 */

import { MusicBrainzApi } from 'musicbrainz-api';

// Configure the MusicBrainz API client with proper rate limiting and user agent
const mbApi = new MusicBrainzApi({
  appName: 'MusicRanker',
  appVersion: '1.0.0',
  appContactInfo: 'your-email@example.com' // Replace with your contact info
});

// Taylor Swift's MusicBrainz ID
const TAYLOR_SWIFT_MBID = '20244d07-534f-4eff-b4d4-930878889970';

/**
 * Fetch Taylor Swift's artist information from MusicBrainz
 * @returns {Promise<Object>} Artist information
 */
export async function fetchTaylorSwiftInfo() {
  try {
    return await mbApi.lookupArtist(TAYLOR_SWIFT_MBID, ['url-rels', 'aliases']);
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
    // Browse release-groups by artist to get albums
    const result = await mbApi.browseReleaseGroups({
      artist: TAYLOR_SWIFT_MBID,
      type: 'album',
      limit: 100
    });
    
    return result['release-groups'];
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
    // First get the releases in this release group
    const releases = await mbApi.browseReleases({
      releaseGroup: releaseGroupId,
      limit: 1 // Just get the first release (main release)
    });
    
    if (releases.releases && releases.releases.length > 0) {
      const releaseId = releases.releases[0].id;
      
      // Then get the recordings (songs) in this release
      const result = await mbApi.lookupRelease(releaseId, ['recordings']);
      
      // Extract and format the songs
      if (result.media && result.media.length > 0) {
        return result.media[0].tracks.map(track => ({
          title: track.title,
          position: track.position,
          length: track.length,
          recordingId: track.recording.id
        }));
      }
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching songs for album ${releaseGroupId}:`, error);
    throw error;
  }
}

/**
 * Fetch all Taylor Swift songs across all her albums
 * This is a convenience method that fetches all albums and then all songs
 * @returns {Promise<Array>} List of all songs with album information
 */
export async function fetchAllTaylorSwiftSongs() {
  try {
    // Get all albums
    const albums = await fetchTaylorSwiftAlbums();
    
    // For each album, get the songs
    const songsPromises = albums.map(async album => {
      const songs = await fetchAlbumSongs(album.id);
      
      // Add album information to each song
      return songs.map(song => ({
        ...song,
        album: {
          id: album.id,
          title: album.title,
          releaseDate: album['first-release-date']
        }
      }));
    });
    
    // Wait for all promises to resolve and flatten the array
    const songsArrays = await Promise.all(songsPromises);
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
    const url = `https://coverartarchive.org/release/${releaseId}/front`;
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return url;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching artwork for release ${releaseId}:`, error);
    return null;
  }
}
