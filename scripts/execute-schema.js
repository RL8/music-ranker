/**
 * Execute Taylor Swift Schema Script
 * 
 * This script executes the SQL schema for Taylor Swift data in Supabase
 * using the service role key for administrative access.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL and service key must be set in .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Execute SQL in chunks to avoid API limitations
 * @param {string} sql - SQL script to execute
 */
async function executeSqlInChunks(sql) {
  // Split the SQL into individual statements
  const statements = sql
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);
  
  console.log(`Found ${statements.length} SQL statements to execute`);
  
  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    try {
      // First try using the pg_query function if it exists
      const { error: functionError } = await supabase.rpc('pg_query', { 
        query: statement 
      });
      
      if (!functionError) {
        console.log(`Statement ${i + 1} executed successfully`);
        continue;
      }
      
      // If the function doesn't exist, try creating it
      if (functionError.message && functionError.message.includes('function "pg_query" does not exist')) {
        console.log('Creating pg_query function...');
        
        // Create the pg_query function using direct REST API call
        const createFunctionQuery = `
          CREATE OR REPLACE FUNCTION pg_query(query TEXT) 
          RETURNS VOID AS $$
          BEGIN
            EXECUTE query;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        // Use direct REST API call
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({
            query: createFunctionQuery
          })
        });
        
        if (!response.ok) {
          console.error('Error creating pg_query function');
          console.error('You may need to execute the schema manually in the Supabase SQL Editor');
          console.error('Please copy the contents of taylor-swift-schema.sql and run it in the SQL Editor');
          process.exit(1);
        }
        
        console.log('pg_query function created successfully');
        
        // Try executing the statement again
        const { error: retryError } = await supabase.rpc('pg_query', { 
          query: statement 
        });
        
        if (retryError) {
          console.error(`Error executing statement ${i + 1}:`, retryError);
          console.error('Statement:', statement);
        } else {
          console.log(`Statement ${i + 1} executed successfully on retry`);
        }
      } else {
        console.error(`Error executing statement ${i + 1}:`, functionError);
        console.error('Statement:', statement);
      }
    } catch (error) {
      console.error(`Unexpected error executing statement ${i + 1}:`, error);
      console.error('Statement:', statement);
    }
  }
}

/**
 * Main function to execute the schema
 */
async function executeSchema() {
  console.log('Starting schema execution...');
  
  try {
    // Read the SQL schema file
    const schemaPath = path.resolve(__dirname, 'taylor-swift-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Schema file loaded successfully');
    
    // Execute the schema
    await executeSqlInChunks(schemaSql);
    
    console.log('Schema execution completed');
    console.log('You can now run the migration script to populate the tables');
    
  } catch (error) {
    console.error('Error executing schema:', error);
    console.error('You may need to execute the schema manually in the Supabase SQL Editor');
    process.exit(1);
  }
}

// Run the script
executeSchema();
