/**
 * Direct SQL Query for Tables
 * 
 * This script uses a direct SQL query approach to list tables
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Create client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
  try {
    // Try to use the RPC function if it exists
    const { data: rpcData, error: rpcError } = await supabase.rpc('list_tables');
    
    if (!rpcError) {
      console.log('Tables found via RPC:');
      console.log(rpcData);
      return;
    }
    
    console.log('RPC function not available, trying alternative methods...\n');
    
    // Try direct query approach - test if tables exist by querying them
    console.log('Testing for common table names:');
    
    const possibleTables = [
      'songs', 'artists', 'albums', 'playlists', 'users', 'profiles',
      'auth_users', 'auth_identities', 'auth_sessions', 'buckets', 'objects',
      'migrations', 'schema_migrations', '_prisma_migrations', 'categories',
      'genres', 'user_ratings', 'user_song_ratings', 'settings', 'config'
    ];
    
    let foundTables = [];
    
    for (const tableName of possibleTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
        
        if (!error) {
          foundTables.push({
            name: tableName,
            count: data[0]?.count || 0
          });
          console.log(`✓ Found table: ${tableName}`);
        }
      } catch (e) {
        // Ignore errors - table likely doesn't exist
      }
    }
    
    if (foundTables.length > 0) {
      console.log('\nTables found in database:');
      console.log('========================');
      foundTables.forEach(table => {
        console.log(`- ${table.name} (${table.count} rows)`);
      });
      console.log(`\nTotal: ${foundTables.length} tables found`);
    } else {
      console.log('\nNo tables found. The database appears to be empty.');
      console.log('You may need to create tables or check your Supabase project setup.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listTables();
