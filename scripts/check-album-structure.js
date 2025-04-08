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

async function checkAlbumStructure() {
  console.log('Checking Albums table structure...');
  
  // Get a sample from the Albums table to understand its structure
  const { data, error } = await supabase
    .from('Albums')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error getting Albums table data:', error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Albums table columns:');
    console.log(Object.keys(data[0]));
  } else {
    console.log('No data found in Albums table');
  }
  
  // Find the album by ID
  const { data: albumById, error: albumByIdError } = await supabase
    .from('Albums')
    .select('*')
    .eq('albumId', 'ALBUM_TS')
    .limit(1);
  
  if (albumByIdError) {
    console.error('Error finding album by ID:', albumByIdError.message);
  } else if (albumById && albumById.length > 0) {
    console.log('\nAlbum found by ID:');
    console.log(albumById[0]);
  } else {
    console.log('\nNo album found with ID "ALBUM_TS"');
  }
  
  // Find the Debut album
  const { data: debutAlbum, error: debutAlbumError } = await supabase
    .from('Albums')
    .select('*')
    .ilike('albumTitle', 'debut')
    .limit(10);
  
  if (debutAlbumError) {
    console.error('Error finding album by title:', debutAlbumError.message);
  } else if (debutAlbum && debutAlbum.length > 0) {
    console.log('\nAlbum(s) found with title "Debut":');
    debutAlbum.forEach(a => console.log(a));
  } else {
    console.log('\nNo album found with title "Debut"');
  }
}

checkAlbumStructure()
  .catch(err => console.error('Unexpected error:', err))
  .finally(() => console.log('Check complete'));
