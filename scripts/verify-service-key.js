/**
 * Script to verify that the Supabase service role key is working
 * This performs a simple test operation that requires admin privileges
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const serviceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;
const anonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Supabase URL and service key must be set in .env.local file');
  process.exit(1);
}

// Initialize Supabase clients
const supabaseAdmin = createClient(supabaseUrl, serviceKey);
const supabaseAnon = createClient(supabaseUrl, anonKey);

async function verifyServiceKey() {
  console.log('Verifying Supabase service role key...');
  
  try {
    // Test 1: List all tables (requires admin privileges)
    console.log('\nTest 1: Listing tables with service role key');
    const { data: adminTables, error: adminError } = await supabaseAdmin
      .from('pg_catalog.pg_tables')
      .select('schemaname, tablename')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (adminError) {
      console.error('Error with service role key:', adminError);
      console.log('Service role key verification FAILED');
    } else {
      console.log('Successfully accessed tables with service role key');
      console.log(`Found ${adminTables.length} tables in the public schema`);
      adminTables.forEach(table => console.log(` - ${table.tablename}`));
      
      // Test 2: Try the same with anon key (should fail or be limited)
      console.log('\nTest 2: Attempting same operation with anon key');
      const { data: anonTables, error: anonError } = await supabaseAnon
        .from('pg_catalog.pg_tables')
        .select('schemaname, tablename')
        .eq('schemaname', 'public')
        .limit(5);
      
      if (anonError) {
        console.log('Expected error with anon key:', anonError.message);
        console.log('This confirms the service role key has higher privileges');
      } else {
        console.log('Anon key also accessed tables (this is unusual)');
        console.log(`Found ${anonTables.length} tables with anon key`);
      }
      
      // Test 3: Create a temporary test table (requires admin privileges)
      console.log('\nTest 3: Creating a temporary test table');
      const testTableName = `temp_test_table_${Date.now()}`;
      
      const { error: createError } = await supabaseAdmin.rpc('pg_query', {
        query: `
          CREATE TABLE ${testTableName} (
            id SERIAL PRIMARY KEY,
            name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (createError) {
        if (createError.message && createError.message.includes('function "pg_query" does not exist')) {
          console.log('Need to create pg_query function first');
          
          // Try direct query
          const { error: directError } = await supabaseAdmin
            .from('pg_catalog.pg_tables')
            .select('*')
            .limit(1)
            .then(() => {
              return supabaseAdmin.rpc('pg_query', {
                query: `
                  CREATE OR REPLACE FUNCTION pg_query(query TEXT) 
                  RETURNS VOID AS $$
                  BEGIN
                    EXECUTE query;
                  END;
                  $$ LANGUAGE plpgsql SECURITY DEFINER;
                `
              });
            });
          
          if (directError) {
            console.error('Error creating pg_query function:', directError);
            console.log('Service role key verification INCONCLUSIVE');
          } else {
            console.log('Created pg_query function successfully');
            console.log('Service role key appears to be working');
          }
        } else {
          console.error('Error creating test table:', createError);
          console.log('Service role key verification FAILED');
        }
      } else {
        console.log(`Successfully created ${testTableName}`);
        
        // Clean up - drop the test table
        const { error: dropError } = await supabaseAdmin.rpc('pg_query', {
          query: `DROP TABLE IF EXISTS ${testTableName};`
        });
        
        if (dropError) {
          console.error('Error dropping test table:', dropError);
        } else {
          console.log(`Successfully dropped ${testTableName}`);
        }
        
        console.log('\nService role key verification PASSED');
        console.log('The service role key is working correctly and has admin privileges');
      }
    }
  } catch (error) {
    console.error('Unexpected error during verification:', error);
    console.log('Service role key verification FAILED');
  }
}

// Run the verification
verifyServiceKey();
