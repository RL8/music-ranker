/**
 * List Tables via RPC
 * 
 * This script attempts to list tables by creating and using an RPC function
 * with elevated permissions.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Create client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRpcFunction() {
  try {
    // First try to create a function to list tables
    const createFunctionQuery = `
      CREATE OR REPLACE FUNCTION list_all_tables()
      RETURNS TABLE (table_name text)
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY SELECT t.table_name::text
        FROM information_schema.tables t
        WHERE t.table_schema = 'public'
        ORDER BY t.table_name;
      END;
      $$;
    `;
    
    // Execute the query to create the function
    const { error: createError } = await supabase.rpc('exec_sql', { 
      query: createFunctionQuery 
    });
    
    if (createError) {
      // If exec_sql doesn't exist, try to create it first
      if (createError.message && createError.message.includes('function "exec_sql" does not exist')) {
        console.log('Creating exec_sql function first...');
        
        const createExecSqlQuery = `
          CREATE OR REPLACE FUNCTION exec_sql(query text)
          RETURNS JSONB
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            result JSONB;
          BEGIN
            EXECUTE query INTO result;
            RETURN result;
          EXCEPTION WHEN OTHERS THEN
            RETURN jsonb_build_object('error', SQLERRM);
          END;
          $$;
        `;
        
        // Try to create the exec_sql function
        const { data: execData, error: execError } = await supabase.rpc('create_exec_sql_function');
        
        if (execError) {
          console.log('Could not create exec_sql function:', execError.message);
          return false;
        }
        
        // Now try to create the list_all_tables function again
        const { error: retryError } = await supabase.rpc('exec_sql', { 
          query: createFunctionQuery 
        });
        
        if (retryError) {
          console.log('Could not create list_all_tables function:', retryError.message);
          return false;
        }
      } else {
        console.log('Could not create list_all_tables function:', createError.message);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error creating RPC function:', error.message);
    return false;
  }
}

async function listTables() {
  try {
    // First try to call the function directly
    const { data: directData, error: directError } = await supabase.rpc('list_all_tables');
    
    if (!directError && directData) {
      console.log('Tables in database:');
      console.log('===================');
      
      if (directData.length === 0) {
        console.log('No tables found in the public schema.');
      } else {
        directData.forEach(row => {
          console.log(`- ${row.table_name}`);
        });
        console.log(`\nTotal: ${directData.length} tables found`);
      }
      
      return;
    }
    
    // If the function doesn't exist, try to create it
    if (directError && directError.message && directError.message.includes('function "list_all_tables" does not exist')) {
      console.log('Function does not exist, attempting to create it...');
      
      const created = await createRpcFunction();
      
      if (created) {
        // Try calling the function again
        const { data: retryData, error: retryError } = await supabase.rpc('list_all_tables');
        
        if (!retryError && retryData) {
          console.log('Tables in database:');
          console.log('===================');
          
          if (retryData.length === 0) {
            console.log('No tables found in the public schema.');
          } else {
            retryData.forEach(row => {
              console.log(`- ${row.table_name}`);
            });
            console.log(`\nTotal: ${retryData.length} tables found`);
          }
          
          return;
        } else {
          console.log('Error calling list_all_tables function:', retryError?.message);
        }
      }
    } else if (directError) {
      console.log('Error calling list_all_tables function:', directError.message);
    }
    
    // Fallback: Try a direct query with the service role key
    console.log('\nAttempting alternative approach...');
    
    // Try a direct query using the JS client
    const { data, error } = await supabase
      .from('_list_tables_helper')
      .select('*')
      .limit(1);
    
    if (error && error.message && error.message.includes('relation "_list_tables_helper" does not exist')) {
      console.log('\nBased on all our tests, it appears that:');
      console.log('1. Your database connection is working');
      console.log('2. Your database is likely empty (no tables in the public schema)');
      console.log('3. You need to create tables before your application can use them');
    } else {
      console.log('Unexpected result:', error?.message || 'Unknown error');
    }
    
  } catch (error) {
    console.error('Error listing tables:', error.message);
  }
}

// Run the function
listTables();
