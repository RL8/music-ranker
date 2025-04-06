/**
 * Simple script to fetch Taylor Swift's albums and songs from MusicBrainz API
 * and save them as static JSON files for use in the application.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Taylor Swift's MusicBrainz ID
const TAYLOR_SWIFT_MBID = '20244d07-534f-4eff-b4d4-930878889970';

// Delay between requests to respect rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch Taylor Swift's artist info
async function fetchArtistInfo() {
  try {
    console.log('Fetching Taylor Swift artist info...');
    const response = await axios.get(`https://musicbrainz.org/ws/2/artist/${TAYLOR_SWIFT_MBID}`, {
      params: {
        fmt: 'json',
        inc: 'url-rels+aliases'
      },
      headers: {
        'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching artist info:', error.message);
    return null;
  }
}

// Fetch Taylor Swift's albums
async function fetchAlbums() {
  try {
    console.log('Fetching Taylor Swift albums...');
    const response = await axios.get(`https://musicbrainz.org/ws/2/release-group`, {
      params: {
        artist: TAYLOR_SWIFT_MBID,
        type: 'album',
        fmt: 'json',
        limit: 100
      },
      headers: {
        'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)'
      }
    });
    
    return response.data['release-groups'];
  } catch (error) {
    console.error('Error fetching albums:', error.message);
    return [];
  }
}

// Fetch songs for a specific album
async function fetchAlbumSongs(releaseGroupId, albumTitle) {
  try {
    console.log(`Fetching songs for album: ${albumTitle}...`);
    
    // First get the releases in this release group
    const releaseResponse = await axios.get(`https://musicbrainz.org/ws/2/release-group/${releaseGroupId}`, {
      params: {
        fmt: 'json',
        inc: 'releases'
      },
      headers: {
        'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)'
      }
    });
    
    // Wait to respect rate limiting
    await delay(1100);
    
    if (releaseResponse.data.releases && releaseResponse.data.releases.length > 0) {
      const releaseId = releaseResponse.data.releases[0].id;
      
      // Then get the recordings (songs) in this release
      const recordingsResponse = await axios.get(`https://musicbrainz.org/ws/2/release/${releaseId}`, {
        params: {
          fmt: 'json',
          inc: 'recordings'
        },
        headers: {
          'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)'
        }
      });
      
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
                releaseGroupId: releaseGroupId,
                albumTitle: albumTitle
              });
            });
          }
        });
      }
      
      return songs;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching songs for album ${albumTitle}:`, error.message);
    return [];
  }
}

// Main function to fetch all data and save to files
async function main() {
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Fetch artist info
  const artistInfo = await fetchArtistInfo();
  if (artistInfo) {
    fs.writeFileSync(
      path.join(dataDir, 'taylor-swift-info.json'),
      JSON.stringify(artistInfo, null, 2)
    );
    console.log('Saved Taylor Swift artist info');
  }
  
  // Wait to respect rate limiting
  await delay(1100);
  
  // Fetch albums
  const albums = await fetchAlbums();
  if (albums.length > 0) {
    fs.writeFileSync(
      path.join(dataDir, 'taylor-swift-albums.json'),
      JSON.stringify(albums, null, 2)
    );
    console.log(`Saved ${albums.length} Taylor Swift albums`);
    
    // Fetch songs for each album
    const allSongs = [];
    for (const album of albums) {
      // Wait to respect rate limiting
      await delay(1100);
      
      const songs = await fetchAlbumSongs(album.id, album.title);
      if (songs.length > 0) {
        allSongs.push(...songs);
        console.log(`Saved ${songs.length} songs for album "${album.title}"`);
      }
    }
    
    if (allSongs.length > 0) {
      fs.writeFileSync(
        path.join(dataDir, 'taylor-swift-songs.json'),
        JSON.stringify(allSongs, null, 2)
      );
      console.log(`Saved ${allSongs.length} Taylor Swift songs in total`);
    }
  }
  
  console.log('Data fetching complete!');
}

// Run the script
main().catch(error => {
  console.error('Error in main function:', error);
});
