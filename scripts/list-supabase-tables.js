/**
 * List Supabase Tables
 * 
 * This script connects to Supabase and lists all available tables
 * in the public schema and other accessible schemas.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Supabase credentials are missing in .env file');
  process.exit(1);
}

console.log('=== SUPABASE TABLE LISTING ===');
console.log(`URL: ${supabaseUrl}`);
console.log('===============================\n');

// Initialize Supabase clients - one with anon key, one with service key
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey) : null;

async function listTables() {
  console.log('Attempting to list tables with anonymous key...\n');
  
  try {
    // Try to query information_schema.tables with anon key
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('information_schema.tables')
      .select('table_schema, table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (anonError) {
      console.log('❌ Could not list tables with anonymous key:', anonError.message);
      console.log('This is expected if the anon key does not have access to system tables.\n');
    } else {
      console.log('✅ Tables accessible with anonymous key:');
      if (anonData && anonData.length > 0) {
        anonData.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      } else {
        console.log('   No tables found in the public schema.');
      }
      console.log();
    }
    
    // Try a different approach - query each expected table
    console.log('Testing access to common tables with anonymous key...');
    const expectedTables = [
      'songs', 'artists', 'albums', 'playlists', 'user_song_ratings',
      'users', 'profiles', 'auth', 'categories', 'genres'
    ];
    
    for (const table of expectedTables) {
      try {
        const { data, error } = await supabaseAnon
          .from(table)
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          if (error.code === '42P01') {
            console.log(`   ❌ Table "${table}" does not exist`);
          } else {
            console.log(`   ❌ Error accessing "${table}": ${error.message}`);
          }
        } else {
          const count = data[0]?.count || 0;
          console.log(`   ✅ Table "${table}" exists with ${count} rows`);
        }
      } catch (e) {
        console.log(`   ❌ Exception when checking "${table}": ${e.message}`);
      }
    }
    
    // If we have a service key, try to list all tables with it
    if (supabaseAdmin) {
      console.log('\nAttempting to list tables with service role key...\n');
      
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_schema, table_name')
        .in('table_schema', ['public', 'auth', 'storage'])
        .order('table_schema, table_name');
      
      if (adminError) {
        console.log('❌ Could not list tables with service role key:', adminError.message);
        
        // Try a direct RPC call to list tables
        try {
          const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('get_tables');
          
          if (rpcError) {
            console.log('❌ RPC call to get_tables failed:', rpcError.message);
          } else {
            console.log('✅ Tables retrieved via RPC:');
            console.log(rpcData);
          }
        } catch (e) {
          console.log('❌ Exception during RPC call:', e.message);
        }
      } else {
        console.log('✅ Tables accessible with service role key:');
        
        if (adminData && adminData.length > 0) {
          // Group tables by schema
          const tablesBySchema = {};
          
          adminData.forEach(table => {
            if (!tablesBySchema[table.table_schema]) {
              tablesBySchema[table.table_schema] = [];
            }
            tablesBySchema[table.table_schema].push(table.table_name);
          });
          
          // Print tables by schema
          Object.keys(tablesBySchema).sort().forEach(schema => {
            console.log(`\n   Schema: ${schema}`);
            tablesBySchema[schema].forEach(tableName => {
              console.log(`     - ${tableName}`);
            });
          });
        } else {
          console.log('   No tables found in the database.');
        }
      }
    }
    
    console.log('\n=== SUMMARY ===');
    console.log('If no tables were found, you may need to:');
    console.log('1. Create the required tables in Supabase');
    console.log('2. Check permissions for your API keys');
    console.log('3. Verify your Supabase project is properly set up');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the function
listTables();
