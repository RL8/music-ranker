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

async function updateAlbumName() {
  console.log('Starting album name update process...');
  
  // First, verify the album exists
  const { data: album, error: findError } = await supabase
    .from('Albums')
    .select('*')
    .eq('albumId', 'ALBUM_TS')
    .single();
  
  if (findError) {
    console.error('Error finding album:', findError.message);
    return;
  }
  
  if (!album) {
    console.log('Album with ID "ALBUM_TS" not found');
    return;
  }
  
  console.log('Found album to update:', album);
  
  // Confirm with user before proceeding
  console.log('\nAbout to update album name from "Taylor Swift" to "Debut"');
  console.log('Press Ctrl+C now to cancel if this is not correct\n');
  
  // Wait 5 seconds to give user time to cancel if needed
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Update the album name
  const { data: updatedAlbum, error: updateError } = await supabase
    .from('Albums')
    .update({ albumTitle: 'Debut' })
    .eq('albumId', 'ALBUM_TS')
    .select();
  
  if (updateError) {
    console.error('Error updating album name:', updateError.message);
    return;
  }
  
  console.log('Album name successfully updated:');
  console.log(updatedAlbum);
}

updateAlbumName()
  .catch(err => console.error('Unexpected error:', err))
  .finally(() => console.log('Update process complete'));
