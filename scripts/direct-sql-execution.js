/**
 * Direct SQL execution script using Supabase REST API
 * This provides a more reliable way to execute SQL for our schema
 */

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env.local file');
  process.exit(1);
}

// Read SQL file
const sqlFilePath = path.resolve(__dirname, './create-taylor-swift-tables.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

async function executeSql() {
  try {
    console.log('Executing SQL script via REST API...');
    
    // Use Supabase SQL API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ query: sqlContent })
    });
    
    const result = await response.text();
    
    if (!response.ok) {
      console.error('Error executing SQL:', result);
      // Try alternative approach using the SQL HTTP API
      console.log('Trying alternative approach...');
      const sqlResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ query: sqlContent })
      });
      
      if (!sqlResponse.ok) {
        console.error('Alternative approach failed:', await sqlResponse.text());
        console.log('Please run the SQL script manually in the Supabase dashboard SQL Editor');
        
        // Write SQL to a file for manual execution
        const manualSqlPath = path.resolve(__dirname, './execute-manually.sql');
        fs.writeFileSync(manualSqlPath, sqlContent);
        console.log(`SQL script saved to ${manualSqlPath} for manual execution`);
      } else {
        console.log('SQL executed successfully via alternative approach!');
      }
    } else {
      console.log('SQL executed successfully!');
    }
    
    console.log('You can now run the migration script to populate the tables.');
  } catch (error) {
    console.error('Exception executing SQL:', error);
  }
}

// Execute the SQL
executeSql();
