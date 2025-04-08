/**
 * Supabase Table Checker
 * 
 * A simple script that checks for the existence of specific tables
 * in your Supabase database with clear output formatting.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase credentials are missing in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tables we expect to find in the database
const expectedTables = [
  'songs',
  'artists',
  'albums',
  'playlists',
  'user_song_ratings',
  'users',
  'profiles',
  'categories',
  'genres'
];

// Function to check if a table exists
async function checkTable(tableName) {
  try {
    // Attempt to select a single row from the table
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist
        return { exists: false, error: 'Table does not exist' };
      } else {
        // Other error (permissions, etc.)
        return { exists: false, error: error.message };
      }
    }
    
    // Table exists, get count
    const { data: countData, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    const count = countError ? 'Unknown' : (countData.count || 0);
    
    return { 
      exists: true, 
      rowCount: count,
      sample: data && data.length > 0 ? data[0] : null
    };
  } catch (e) {
    return { exists: false, error: e.message };
  }
}

// Main function
async function checkAllTables() {
  console.log('='.repeat(50));
  console.log('SUPABASE TABLE CHECK');
  console.log('URL:', supabaseUrl);
  console.log('='.repeat(50));
  console.log();
  
  // First check if we can connect
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('CONNECTION ERROR:', error.message);
      process.exit(1);
    }
    console.log('✓ Connection established successfully\n');
  } catch (e) {
    console.log('CONNECTION ERROR:', e.message);
    process.exit(1);
  }
  
  // Check each expected table
  console.log('CHECKING TABLES:');
  console.log('-'.repeat(50));
  
  const tableResults = [];
  
  for (const table of expectedTables) {
    process.stdout.write(`Checking "${table}"... `);
    
    const result = await checkTable(table);
    
    if (result.exists) {
      console.log(`✓ EXISTS (${result.rowCount} rows)`);
      tableResults.push({ name: table, exists: true, rowCount: result.rowCount });
    } else {
      console.log(`✗ MISSING (${result.error})`);
      tableResults.push({ name: table, exists: false, error: result.error });
    }
  }
  
  // Summary
  console.log('\nRESULTS SUMMARY:');
  console.log('-'.repeat(50));
  
  const existingTables = tableResults.filter(t => t.exists);
  const missingTables = tableResults.filter(t => !t.exists);
  
  console.log(`Total tables checked: ${tableResults.length}`);
  console.log(`Tables found: ${existingTables.length}`);
  console.log(`Tables missing: ${missingTables.length}`);
  
  if (existingTables.length > 0) {
    console.log('\nEXISTING TABLES:');
    existingTables.forEach(t => {
      console.log(`- ${t.name} (${t.rowCount} rows)`);
    });
  }
  
  if (missingTables.length > 0) {
    console.log('\nMISSING TABLES:');
    missingTables.forEach(t => {
      console.log(`- ${t.name}`);
    });
  }
  
  console.log('\nRECOMMENDATIONS:');
  if (missingTables.length > 0) {
    console.log('- Create the missing tables in your Supabase database');
    console.log('- Run a migration script to set up the required schema');
    console.log('- Check if table names in your code match the actual database tables');
  } else {
    console.log('- All expected tables exist');
    console.log('- Verify table structures match your application requirements');
  }
}

// Run the script
checkAllTables().catch(error => {
  console.error('Script error:', error);
});
