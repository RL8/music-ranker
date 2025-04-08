require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or service key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTaylorsVersionSongs() {
  console.log('Finding all Taylor\'s Version recordings...');
  
  // Query for recordings with versionType containing "Taylor's Version"
  const { data: recordings, error } = await supabase
    .from('Recordings')
    .select('*')
    .ilike('versionType', '%taylor%version%')
    .order('albumId')
    .order('discNumber')
    .order('trackNumber');
  
  if (error) {
    console.error('Error fetching Taylor\'s Version recordings:', error.message);
    return;
  }
  
  if (!recordings || recordings.length === 0) {
    console.log('No Taylor\'s Version recordings found');
    return;
  }
  
  // Get all songs to map songId to song title
  const { data: songs, error: songsError } = await supabase
    .from('Songs')
    .select('*');
  
  if (songsError) {
    console.error('Error fetching songs:', songsError.message);
  }
  
  // Get all albums to map albumId to album title
  const { data: albums, error: albumsError } = await supabase
    .from('Albums')
    .select('*');
  
  if (albumsError) {
    console.error('Error fetching albums:', albumsError.message);
  }
  
  // Create lookup maps
  const songMap = {};
  if (songs) {
    songs.forEach(song => {
      songMap[song.songId] = song;
    });
  }
  
  const albumMap = {};
  if (albums) {
    albums.forEach(album => {
      albumMap[album.albumId] = album;
    });
  }
  
  console.log(`Found ${recordings.length} Taylor's Version recordings:\n`);
  
  // Group by album for better readability
  const albumGroups = {};
  
  recordings.forEach(recording => {
    const albumId = recording.albumId;
    const album = albumMap[albumId] || { albumTitle: 'Unknown Album' };
    const song = songMap[recording.songId] || { canonicalTitle: 'Unknown Song' };
    
    if (!albumGroups[albumId]) {
      albumGroups[albumId] = {
        title: album.albumTitle,
        recordings: []
      };
    }
    
    albumGroups[albumId].recordings.push({
      trackNumber: recording.trackNumber,
      discNumber: recording.discNumber,
      recordingTitle: recording.recordingTitle,
      songTitle: song.canonicalTitle,
      versionType: recording.versionType
    });
  });
  
  // Display results grouped by album
  Object.keys(albumGroups).forEach(albumId => {
    const album = albumGroups[albumId];
    console.log(`\n== ${album.title} ==`);
    
    album.recordings.sort((a, b) => {
      if (a.discNumber !== b.discNumber) return a.discNumber - b.discNumber;
      return a.trackNumber - b.trackNumber;
    });
    
    album.recordings.forEach(rec => {
      console.log(`${rec.discNumber}.${rec.trackNumber}. ${rec.recordingTitle} (${rec.versionType})`);
      if (rec.recordingTitle !== rec.songTitle) {
        console.log(`   Original song: ${rec.songTitle}`);
      }
    });
  });
}

listTaylorsVersionSongs()
  .catch(err => console.error('Unexpected error:', err))
  .finally(() => console.log('\nSearch complete'));
