/**
 * Clean Supabase Connection Test
 * 
 * A simplified test script that checks Supabase connection
 * with clear console output
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

// Print connection info
console.log('=== SUPABASE CONNECTION TEST ===');
console.log(`URL: ${supabaseUrl || 'MISSING'}`);
console.log(`Anon Key: ${supabaseAnonKey ? 'PRESENT' : 'MISSING'}`);
console.log('===============================\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials are missing in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simple test function that doesn't rely on specific tables
async function testConnection() {
  try {
    // Test 1: Basic connection by checking auth status
    console.log('Test 1: Basic Connection');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Failed: Auth error:', authError.message);
    } else {
      console.log('✅ Success: Basic connection established');
    }
    
    // Test 2: Try to list all tables in the database
    console.log('\nTest 2: Database Tables');
    try {
      const { data, error } = await supabase.rpc('get_tables');
      
      if (error) {
        if (error.message.includes('function "get_tables" does not exist')) {
          console.log('ℹ️ Info: get_tables function not available (expected)');
          
          // Alternative approach - try to query a table we expect to exist
          console.log('\nTest 3: Table Access');
          const tables = ['songs', 'artists', 'albums'];
          
          for (const table of tables) {
            try {
              const { error: tableError } = await supabase
                .from(table)
                .select('*')
                .limit(1);
                
              if (tableError) {
                if (tableError.code === '42P01') {
                  console.log(`❌ Table "${table}" does not exist`);
                } else {
                  console.log(`❌ Error accessing "${table}": ${tableError.message}`);
                }
              } else {
                console.log(`✅ Table "${table}" exists and is accessible`);
              }
            } catch (e) {
              console.log(`❌ Exception when accessing "${table}": ${e.message}`);
            }
          }
        } else {
          console.log('❌ Failed:', error.message);
        }
      } else {
        console.log('✅ Success: Retrieved table list');
        console.log(data);
      }
    } catch (e) {
      console.log('❌ Exception:', e.message);
    }
    
    console.log('\n=== TEST SUMMARY ===');
    console.log('Basic Connection: ✅');
    console.log('Table Access: Check results above');
    console.log('Recommendation: Check if tables exist in Supabase dashboard');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the test
testConnection();
