/**
 * Simple Supabase Table Lister
 * 
 * This script uses a simpler approach to list tables in Supabase
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
    // Query information_schema.tables instead of pg_tables
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_schema, table_name')
      .eq('table_schema', 'public')
      .order('table_name');
      
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    
    console.log('Public schema tables:');
    console.log('====================');
    
    if (data && data.length > 0) {
      data.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
      console.log(`\nTotal: ${data.length} tables found`);
    } else {
      console.log('No tables found in the public schema');
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

listTables();
