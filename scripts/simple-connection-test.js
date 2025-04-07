/**
 * Simple Supabase Connection Test
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

console.log('Supabase Configuration:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Anon Key: ${supabaseAnonKey ? 'Present' : 'Missing'}`);
console.log(`Service Key: ${supabaseServiceKey ? 'Present' : 'Missing'}`);

// Initialize Supabase clients
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function runTest() {
  try {
    console.log('\nTesting Anon Key Connection:');
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (anonError) {
      console.log('Anon key test result: Limited access as expected');
      console.log('Error:', anonError.message);
    } else {
      console.log('Anon key test result: Success');
      console.log('Tables found:', anonData.length);
      anonData.forEach(table => console.log(` - ${table.tablename}`));
    }
    
    console.log('\nTesting Service Key Connection:');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (adminError) {
      console.log('Service key test result: Failed');
      console.log('Error:', adminError.message);
    } else {
      console.log('Service key test result: Success');
      console.log('Tables found:', adminData.length);
      adminData.forEach(table => console.log(` - ${table.tablename}`));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

runTest();
