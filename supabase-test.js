// Simple script to test Supabase connection and get project ID
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

// Extract project ID from the URL
const projectId = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : 'unknown';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Supabase Connection Information:');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Key: ${supabaseKey ? '✓ Key is defined' : '✗ Key is missing'}`);
  
  try {
    // Try to query the project reference from the JWT token
    console.log('\nVerifying project reference from JWT token:');
    // The JWT token contains the project reference in the payload
    const jwtPayload = supabaseKey ? JSON.parse(atob(supabaseKey.split('.')[1])) : null;
    
    if (jwtPayload) {
      console.log(`Project reference in JWT: ${jwtPayload.ref}`);
      console.log(`JWT issuer: ${jwtPayload.iss}`);
      console.log(`JWT role: ${jwtPayload.role}`);
      console.log(`JWT expiration: ${new Date(jwtPayload.exp * 1000).toISOString()}`);
    } else {
      console.log('Could not decode JWT payload');
    }
    
  } catch (err) {
    console.error('Exception occurred:', err);
  }
}

testConnection();
