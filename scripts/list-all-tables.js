/**
 * List All Supabase Tables
 * 
 * This script attempts to list all tables in the Supabase database
 * using the service role key for elevated permissions.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or Service Key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllTables() {
  console.log('Attempting to list all tables in Supabase database...\n');

  try {
    // Query pg_tables to get all tables
    const { data, error } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .in('schemaname', ['public', 'auth', 'storage'])
      .order('schemaname, tablename');

    if (error) {
      console.error('Error querying tables:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No tables found in the database.');
      return;
    }

    // Group tables by schema
    const tablesBySchema = {};
    data.forEach(table => {
      if (!tablesBySchema[table.schemaname]) {
        tablesBySchema[table.schemaname] = [];
      }
      tablesBySchema[table.schemaname].push(table.tablename);
    });

    // Print tables by schema
    console.log('Tables in database:');
    console.log('==================\n');
    
    Object.keys(tablesBySchema).sort().forEach(schema => {
      console.log(`Schema: ${schema}`);
      console.log('-'.repeat(schema.length + 8));
      
      tablesBySchema[schema].forEach(tableName => {
        console.log(`  - ${tableName}`);
      });
      
      console.log(); // Empty line between schemas
    });
    
    console.log(`Total: ${data.length} tables found`);
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the function
listAllTables();
