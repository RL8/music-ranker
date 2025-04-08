/**
 * Simple Supabase Connection Test
 * 
 * This script performs a basic test of the Supabase connection
 * using the credentials from .env file
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials are missing in .env file');
  process.exit(1);
}

console.log('Environment variables:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key: ${supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}` : 'MISSING'}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function
async function testConnection() {
  console.log('\n🔍 Testing Supabase connection...');
  
  try {
    // First, check if we can connect at all by getting the server timestamp
    console.log('\n1. Testing basic connection...');
    const { data: timeData, error: timeError } = await supabase.rpc('now');
    
    if (timeError) {
      if (timeError.message && timeError.message.includes('function "now" does not exist')) {
        // Try a direct query instead
        const { data: directData, error: directError } = await supabase
          .from('_dummy_query_for_connection_test')
          .select('*')
          .limit(1);
          
        if (directError && directError.code === '42P01') {
          // This is expected - table doesn't exist but connection works
          console.log('✅ Basic connection successful (expected error about non-existent table)');
        } else if (directError) {
          console.error('❌ Basic connection test failed with unexpected error:');
          console.error(`   Code: ${directError.code || 'unknown'}`);
          console.error(`   Message: ${directError.message || 'No message'}`);
        } else {
          console.log('✅ Basic connection successful');
        }
      } else {
        console.error('❌ Basic connection test failed:', timeError.message);
      }
    } else {
      console.log('✅ Basic connection successful with server time:', timeData);
    }
    
    // Check if the database has the expected schema
    console.log('\n2. Checking database schema...');
    
    // List all tables in the public schema
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (tablesError) {
      console.error('❌ Unable to query schema information:', tablesError.message);
      
      if (tablesError.code === '42501') {
        console.log('   Note: This may be due to permission restrictions on the anon key');
      }
    } else {
      if (tablesData && tablesData.length > 0) {
        console.log('✅ Found tables in public schema:');
        tablesData.forEach(t => console.log(`   - ${t.table_name}`));
        
        // Now try to access each table
        const expectedTables = ['songs', 'artists', 'albums', 'user_song_ratings', 'playlists'];
        console.log('\n3. Testing access to expected tables:');
        
        for (const table of expectedTables) {
          const exists = tablesData.some(t => t.table_name === table);
          
          if (exists) {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1);
              
            if (error) {
              console.log(`   ❌ Table "${table}" exists but access failed: ${error.message}`);
            } else {
              console.log(`   ✅ Table "${table}" is accessible (${data.length} rows retrieved)`);
            }
          } else {
            console.log(`   ❌ Table "${table}" does not exist in the database`);
          }
        }
      } else {
        console.log('❌ No tables found in public schema');
        console.log('   This suggests the database may be empty or the anon key lacks permissions');
      }
    }
    
    // Try to get auth configuration
    console.log('\n4. Testing auth configuration...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth configuration test failed:', authError.message);
    } else {
      console.log('✅ Auth configuration is working');
      console.log('   Session:', authData.session ? 'Active' : 'None (expected for new connection)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error during connection test:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    console.log('\n==================================');
    if (success) {
      console.log('🎉 Supabase connection test completed');
    } else {
      console.log('❌ Supabase connection test failed');
      process.exit(1);
    }
  });
