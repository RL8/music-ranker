/**
 * Test Supabase Connection
 * 
 * This script tests the connection to Supabase using both the anon key and service role key.
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('Error: Supabase credentials are missing in .env.local file');
  process.exit(1);
}

// Initialize Supabase clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Test function
async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Anon Key: ${supabaseAnonKey.substring(0, 10)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`);
  console.log(`Service Key: ${supabaseServiceKey.substring(0, 10)}...${supabaseServiceKey.substring(supabaseServiceKey.length - 5)}`);
  
  try {
    // Test anon connection
    console.log('\nTesting anonymous connection...');
    const { data: anonData, error: anonError } = await supabaseAnon.from('_prisma_migrations').select('*').limit(1);
    
    if (anonError) {
      if (anonError.code === '42501') { // Permission denied
        console.log('✅ Anon key working as expected (restricted access)');
      } else {
        console.error('❌ Anon key test failed:', anonError.message);
      }
    } else {
      console.log('✅ Anon key connected successfully');
      console.log(`Retrieved ${anonData.length} rows from _prisma_migrations table`);
    }
    
    // Test service role connection
    console.log('\nTesting service role connection...');
    const { data: adminData, error: adminError } = await supabaseAdmin.from('_prisma_migrations').select('*').limit(1);
    
    if (adminError) {
      if (adminError.code === '42P01') { // Table doesn't exist
        // Try another system table
        const { data: schemaData, error: schemaError } = await supabaseAdmin.rpc('get_schema_version');
        
        if (schemaError) {
          if (schemaError.message && schemaError.message.includes('function "get_schema_version" does not exist')) {
            // Create a simple function to test execution privileges
            console.log('Creating test function...');
            const { error: createError } = await supabaseAdmin.rpc('create_test_function');
            
            if (createError && createError.message && createError.message.includes('function "create_test_function" does not exist')) {
              // Try direct query to check if we have admin privileges
              const { data: tablesData, error: tablesError } = await supabaseAdmin
                .from('pg_tables')
                .select('schemaname, tablename')
                .eq('schemaname', 'public')
                .limit(5);
              
              if (tablesError) {
                console.error('❌ Service role key test failed:', tablesError.message);
              } else {
                console.log('✅ Service role key connected successfully');
                console.log(`Found ${tablesData.length} tables in the public schema`);
                tablesData.forEach(table => console.log(` - ${table.tablename}`));
              }
            } else if (createError) {
              console.error('❌ Service role key test failed:', createError.message);
            } else {
              console.log('✅ Service role key connected successfully (able to create functions)');
            }
          } else {
            console.error('❌ Service role key test failed:', schemaError.message);
          }
        } else {
          console.log('✅ Service role key connected successfully');
          console.log('Schema version:', schemaData);
        }
      } else {
        console.error('❌ Service role key test failed:', adminError.message);
      }
    } else {
      console.log('✅ Service role key connected successfully');
      console.log(`Retrieved ${adminData.length} rows from _prisma_migrations table`);
    }
    
    // Test creating a table (only with service role)
    console.log('\nTesting table creation with service role...');
    const testTableName = `test_table_${Date.now()}`;
    
    const { error: createTableError } = await supabaseAdmin.rpc('pg_query', {
      query: `
        CREATE TABLE IF NOT EXISTS ${testTableName} (
          id SERIAL PRIMARY KEY,
          name TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (createTableError) {
      if (createTableError.message && createTableError.message.includes('function "pg_query" does not exist')) {
        console.log('Need to create pg_query function first');
        
        // Try direct query
        const { error: directError } = await supabaseAdmin
          .from('pg_catalog.pg_tables')
          .select('*')
          .limit(1);
        
        if (directError) {
          console.error('❌ Service role key cannot access system tables:', directError.message);
          console.log('You may need to execute SQL directly in the Supabase dashboard');
        } else {
          console.log('✅ Service role key has system table access');
          console.log('You can execute the schema script in the Supabase SQL Editor');
        }
      } else {
        console.error('❌ Service role key cannot create tables:', createTableError.message);
      }
    } else {
      console.log(`✅ Successfully created test table: ${testTableName}`);
      
      // Clean up - drop the test table
      const { error: dropError } = await supabaseAdmin.rpc('pg_query', {
        query: `DROP TABLE IF EXISTS ${testTableName};`
      });
      
      if (dropError) {
        console.error(`Warning: Could not drop test table ${testTableName}:`, dropError.message);
      } else {
        console.log(`✅ Successfully dropped test table: ${testTableName}`);
      }
    }
    
    console.log('\nConnection test completed');
    
  } catch (error) {
    console.error('Unexpected error during connection test:', error);
  }
}

// Run the test
testConnection();
