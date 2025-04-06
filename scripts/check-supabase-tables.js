/**
 * Script to check existing tables in Supabase
 * This helps us understand what tables already exist before making changes
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env.local file');
  console.error('Make sure you have VUE_APP_SUPABASE_URL and VUE_APP_SUPABASE_KEY defined');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Checking existing Supabase tables...');
    
    // Query for all tables in the public schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error fetching tables:', error);
      return;
    }
    
    console.log('\nExisting tables in your Supabase project:');
    if (data && data.length > 0) {
      data.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('No tables found in the public schema.');
    }
    
    // Check specifically for Taylor Swift tables
    const taylorTables = data.filter(table => 
      table.table_name.includes('taylor_swift')
    );
    
    console.log('\nExisting Taylor Swift tables:');
    if (taylorTables.length > 0) {
      taylorTables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('No Taylor Swift tables found yet.');
    }
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();
