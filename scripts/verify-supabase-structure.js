/**
 * Supabase Structure Verification Script
 * 
 * This script checks if all required tables and views exist in the Supabase database
 * and reports any missing or misconfigured elements.
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local file');
  console.error('Make sure VUE_APP_SUPABASE_URL and VUE_APP_SUPABASE_ANON_KEY are defined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Required tables and views
const requiredStructures = [
  { name: 'Songs', type: 'table' },
  { name: 'Albums', type: 'table' },
  { name: 'Recordings', type: 'table' },
  { name: 'Eras', type: 'table' },
  { name: 'UniqueSongs', type: 'view' },
  { name: 'RecordingEditions', type: 'view or table' },
  { name: 'Editions', type: 'table' },
  { name: 'user_album_rankings', type: 'table' },
  { name: 'user_song_rankings', type: 'table' },
  { name: 'ranking_history', type: 'table' }
];

// Check if a table exists and has data
async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      return { exists: false, error: error.message, count: 0 };
    }
    
    return { 
      exists: true, 
      error: null, 
      count: count,
      sample: data && data.length > 0 ? data[0] : null
    };
  } catch (error) {
    return { exists: false, error: error.message, count: 0 };
  }
}

// Main verification function
async function verifySupabaseStructure() {
  console.log('Verifying Supabase database structure...');
  console.log(`Connected to: ${supabaseUrl}`);
  
  let allValid = true;
  const results = [];
  
  // Check each required structure
  for (const structure of requiredStructures) {
    const result = await checkTable(structure.name);
    
    results.push({
      name: structure.name,
      type: structure.type,
      exists: result.exists,
      error: result.error,
      count: result.count,
      sample: result.sample
    });
    
    if (!result.exists) {
      allValid = false;
    }
  }
  
  // Display results
  console.log('\nVerification Results:');
  console.log('=====================');
  
  results.forEach(result => {
    const status = result.exists ? '✅' : '❌';
    console.log(`${status} ${result.name} (${result.type}): ${result.exists ? `${result.count} records` : `Not found - ${result.error}`}`);
    
    if (result.exists && result.sample) {
      console.log(`  Sample record keys: ${Object.keys(result.sample).join(', ')}`);
    }
  });
  
  console.log('\nSummary:');
  console.log(`${allValid ? '✅ All' : '❌ Not all'} required database structures are available`);
  
  if (!allValid) {
    console.log('\nMissing structures need to be created before the application can fully use Supabase.');
    console.log('Run the SQL scripts in the database directory to create the required tables and views.');
  }
  
  return allValid;
}

// Run the verification
verifySupabaseStructure()
  .then(valid => {
    if (valid) {
      console.log('\nYour Supabase database is ready for the Music Ranker application!');
    }
    process.exit(valid ? 0 : 1);
  })
  .catch(error => {
    console.error('Error during verification:', error);
    process.exit(1);
  });
