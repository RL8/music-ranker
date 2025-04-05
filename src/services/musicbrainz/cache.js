/**
 * MusicBrainz Caching Service
 * 
 * This service handles caching of Taylor Swift's music data in the browser's local storage.
 * It provides functions to store, retrieve, and check the freshness of cached data.
 */

// Cache keys
const CACHE_KEYS = {
  ARTIST: 'taylorSwift_artist',
  ALBUMS: 'taylorSwift_albums',
  SONGS: 'taylorSwift_songs',
  TIMESTAMP: 'taylorSwift_lastUpdated'
};

/**
 * Store artist data in cache
 * @param {Object} artistData - Artist information to cache
 */
export function cacheArtistData(artistData) {
  try {
    localStorage.setItem(CACHE_KEYS.ARTIST, JSON.stringify(artistData));
    updateTimestamp();
  } catch (error) {
    console.error('Error caching artist data:', error);
  }
}

/**
 * Store albums data in cache
 * @param {Array} albumsData - Albums information to cache
 */
export function cacheAlbumsData(albumsData) {
  try {
    localStorage.setItem(CACHE_KEYS.ALBUMS, JSON.stringify(albumsData));
    updateTimestamp();
  } catch (error) {
    console.error('Error caching albums data:', error);
  }
}

/**
 * Store songs data in cache
 * @param {Array} songsData - Songs information to cache
 */
export function cacheSongsData(songsData) {
  try {
    localStorage.setItem(CACHE_KEYS.SONGS, JSON.stringify(songsData));
    updateTimestamp();
  } catch (error) {
    console.error('Error caching songs data:', error);
  }
}

/**
 * Update the timestamp for when the cache was last updated
 */
function updateTimestamp() {
  localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
}

/**
 * Get artist data from cache
 * @returns {Object|null} Cached artist data or null if not found
 */
export function getCachedArtistData() {
  try {
    const data = localStorage.getItem(CACHE_KEYS.ARTIST);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached artist data:', error);
    return null;
  }
}

/**
 * Get albums data from cache
 * @returns {Array|null} Cached albums data or null if not found
 */
export function getCachedAlbumsData() {
  try {
    const data = localStorage.getItem(CACHE_KEYS.ALBUMS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached albums data:', error);
    return null;
  }
}

/**
 * Get songs data from cache
 * @returns {Array|null} Cached songs data or null if not found
 */
export function getCachedSongsData() {
  try {
    const data = localStorage.getItem(CACHE_KEYS.SONGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached songs data:', error);
    return null;
  }
}

/**
 * Check if cache exists and has data
 * @returns {boolean} True if cache exists and has data
 */
export function cacheExists() {
  return Boolean(
    localStorage.getItem(CACHE_KEYS.ARTIST) &&
    localStorage.getItem(CACHE_KEYS.ALBUMS) &&
    localStorage.getItem(CACHE_KEYS.SONGS) &&
    localStorage.getItem(CACHE_KEYS.TIMESTAMP)
  );
}

/**
 * Get the timestamp of when the cache was last updated
 * @returns {number|null} Timestamp in milliseconds or null if not found
 */
export function getCacheTimestamp() {
  try {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Error retrieving cache timestamp:', error);
    return null;
  }
}

/**
 * Check if the cache is stale (older than the specified time)
 * @param {number} maxAgeInDays - Maximum age of cache in days
 * @returns {boolean} True if cache is stale or doesn't exist
 */
export function isCacheStale(maxAgeInDays = 30) {
  const timestamp = getCacheTimestamp();
  if (!timestamp) return true;
  
  const maxAgeMs = maxAgeInDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  return (now - timestamp) > maxAgeMs;
}

/**
 * Clear all cached data
 */
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEYS.ARTIST);
    localStorage.removeItem(CACHE_KEYS.ALBUMS);
    localStorage.removeItem(CACHE_KEYS.SONGS);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
