/**
 * Simple script to verify Supabase service role key
 */

const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const serviceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Supabase URL and service key must be set in .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceKey);

async function checkServiceKey() {
  console.log('Checking Supabase service role key...');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${serviceKey.substring(0, 10)}...${serviceKey.substring(serviceKey.length - 5)}`);
  
  try {
    // Simple test: Try to get system schema info
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(10);
    
    if (error) {
      console.error('Error accessing tables with service role key:', error);
      console.log('Service role key verification FAILED');
    } else {
      console.log('\nSuccessfully accessed tables with service role key');
      console.log(`Found ${data.length} tables in the public schema:`);
      data.forEach(table => console.log(` - ${table.tablename}`));
      console.log('\nService role key verification PASSED');
    }
  } catch (error) {
    console.error('Unexpected error during verification:', error);
    console.log('Service role key verification FAILED');
  }
}

// Run the check
checkServiceKey();
