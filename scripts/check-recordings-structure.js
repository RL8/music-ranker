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

async function checkRecordingsStructure() {
  console.log('Checking Recordings table structure...');
  
  // Get a sample from the Recordings table to understand its structure
  const { data, error } = await supabase
    .from('Recordings')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error getting Recordings table data:', error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Recordings table columns:');
    console.log(Object.keys(data[0]));
    console.log('\nSample recording data:');
    console.log(data[0]);
  } else {
    console.log('No data found in Recordings table');
  }
}

checkRecordingsStructure()
  .catch(err => console.error('Unexpected error:', err))
  .finally(() => console.log('Check complete'));
