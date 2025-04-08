/**
 * Direct Supabase Table Checker
 * 
 * This script uses a direct approach to check for tables in Supabase
 * by attempting to access them individually.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or Service Key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// List of potential tables to check
// This is an expanded list covering common table names
const potentialTables = [
  // Common application tables
  'songs', 'artists', 'albums', 'playlists', 'tracks',
  'users', 'profiles', 'user_profiles', 'accounts',
  'categories', 'genres', 'tags',
  'ratings', 'user_ratings', 'user_song_ratings', 'reviews',
  
  // Auth related tables
  'auth_users', 'auth_identities', 'auth_sessions',
  'auth_refresh_tokens', 'auth_mfa_factors',
  
  // Storage related tables
  'buckets', 'objects', 'storage_buckets', 'storage_objects',
  
  // Migration related tables
  'migrations', 'schema_migrations', '_prisma_migrations',
  'knex_migrations', 'knex_migrations_lock',
  
  // Configuration tables
  'settings', 'config', 'app_settings', 'app_config',
  
  // Supabase specific tables
  'supabase_functions', 'supabase_migrations',
  
  // Other common tables
  'comments', 'posts', 'messages', 'notifications',
  'favorites', 'likes', 'follows', 'subscriptions'
];

// Check if a table exists and get its structure
async function checkTable(tableName) {
  try {
    console.log(`Checking table: ${tableName}...`);
    
    // Try to select a single row
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') {
        return { exists: false, reason: 'Table does not exist' };
      } else {
        return { exists: false, reason: error.message };
      }
    }
    
    // If we get here, the table exists
    // Now get the count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    // Try to determine column structure
    let columns = [];
    if (data && data.length > 0) {
      columns = Object.keys(data[0]).map(col => ({
        name: col,
        sample: data[0][col],
        type: typeof data[0][col]
      }));
    }
    
    return {
      exists: true,
      name: tableName,
      rowCount: countError ? 'Unknown' : count,
      columns: columns,
      sample: data && data.length > 0 ? data[0] : null
    };
  } catch (e) {
    return { exists: false, reason: e.message };
  }
}

// Main function
async function findTables() {
  console.log('='.repeat(60));
  console.log('DIRECT SUPABASE TABLE CHECKER');
  console.log(`URL: ${supabaseUrl}`);
  console.log('='.repeat(60));
  
  try {
    // First check connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Connection Error:', authError.message);
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase\n');
    
    // Check each potential table
    const results = {
      existingTables: [],
      nonExistingTables: []
    };
    
    for (const table of potentialTables) {
      const result = await checkTable(table);
      
      if (result.exists) {
        results.existingTables.push(result);
        console.log(`✅ Table "${table}" exists with ${result.rowCount} rows`);
      } else {
        results.nonExistingTables.push({
          name: table,
          reason: result.reason
        });
        console.log(`❌ Table "${table}" does not exist`);
      }
    }
    
    // Print summary
    console.log('\n='.repeat(60));
    console.log('RESULTS SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`Total tables checked: ${potentialTables.length}`);
    console.log(`Tables found: ${results.existingTables.length}`);
    console.log(`Tables not found: ${results.nonExistingTables.length}`);
    
    if (results.existingTables.length > 0) {
      console.log('\n='.repeat(60));
      console.log('EXISTING TABLES');
      console.log('='.repeat(60));
      
      results.existingTables.forEach(table => {
        console.log(`\nTable: ${table.name}`);
        console.log(`Rows: ${table.rowCount}`);
        
        if (table.columns && table.columns.length > 0) {
          console.log('Columns:');
          table.columns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
          });
        } else {
          console.log('Columns: Could not determine (no data)');
        }
        
        console.log('-'.repeat(40));
      });
    } else {
      console.log('\nNo tables were found in your Supabase database.');
      console.log('This suggests that your database is empty or the tables have different names.');
    }
    
  } catch (error) {
    console.error('Error during table check:', error.message);
  }
}

// Run the function
findTables();
