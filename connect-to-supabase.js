// Script to generate PostgreSQL connection string for Supabase
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY || process.env.VUE_APP_SUPABASE_ANON_KEY;

// Extract project ID from the URL
const projectId = supabaseUrl ? supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] : 'unknown';

// Extract JWT information
const jwtPayload = supabaseKey ? JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64').toString()) : null;

// Generate connection information
console.log('Supabase PostgreSQL Connection Information:');
console.log('==========================================');
console.log(`Project ID: ${projectId}`);

if (jwtPayload) {
  console.log(`\nJWT Information:`);
  console.log(`Role: ${jwtPayload.role}`);
  console.log(`Expiration: ${new Date(jwtPayload.exp * 1000).toISOString()}`);
}

// PostgreSQL connection details
console.log('\nPostgreSQL Connection Details:');
console.log(`Host: db.${projectId}.supabase.co`);
console.log(`Database: postgres`);
console.log(`Port: 5432`);
console.log(`User: postgres`);
console.log(`Password: Use your Supabase database password`);
console.log(`Schema: public`);

// Generate psql connection command
console.log('\nTo connect using psql, use this command:');
console.log(`psql -h db.${projectId}.supabase.co -p 5432 -d postgres -U postgres`);
console.log('You will be prompted for your password.');

// Generate connection string (without password)
console.log('\nConnection string format (add your password):');
console.log(`postgresql://postgres:YOUR_PASSWORD@db.${projectId}.supabase.co:5432/postgres`);

console.log('\nNote: You need to use the database password from your Supabase dashboard.');
console.log('This is different from your API keys. Find it in Project Settings > Database.');
