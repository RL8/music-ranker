/**
 * Direct implementation of Taylor Swift schema in Supabase
 * This script uses the Supabase REST API to execute SQL commands
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

// Read SQL files
const sqlFiles = [
  { name: '1-taylor-swift-tables.sql', path: path.resolve(__dirname, './1-taylor-swift-tables.sql') },
  { name: '2-taylor-swift-indexes.sql', path: path.resolve(__dirname, './2-taylor-swift-indexes.sql') },
  { name: '3-taylor-swift-rls.sql', path: path.resolve(__dirname, './3-taylor-swift-rls.sql') },
  { name: '4-taylor-swift-functions.sql', path: path.resolve(__dirname, './4-taylor-swift-functions.sql') }
];

// Load SQL content
const sqlContents = sqlFiles.map(file => ({
  name: file.name,
  content: fs.readFileSync(file.path, 'utf8')
}));

async function executeSQL() {
  try {
    console.log('Starting direct Supabase implementation...');
    
    // First, check if we need to drop existing tables
    console.log('Checking for existing Taylor Swift tables...');
    
    const checkTablesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/check_tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        pattern: 'taylor_swift%'
      })
    });
    
    // If the function doesn't exist, create it
    if (!checkTablesResponse.ok) {
      console.log('Creating helper function to check tables...');
      
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION check_tables(pattern TEXT)
        RETURNS TABLE (table_name TEXT) AS $$
        BEGIN
          RETURN QUERY
          SELECT tablename::TEXT
          FROM pg_tables
          WHERE schemaname = 'public'
            AND tablename LIKE pattern;
        END;
        $$ LANGUAGE plpgsql;
      `;
      
      const createFunctionResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          query: createFunctionSQL
        })
      });
      
      if (!createFunctionResponse.ok) {
        console.error('Error creating helper function:', await createFunctionResponse.text());
      } else {
        console.log('Created helper function successfully');
      }
      
      // Try checking tables again
      const retryCheckResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/check_tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          pattern: 'taylor_swift%'
        })
      });
      
      if (retryCheckResponse.ok) {
        const tables = await retryCheckResponse.json();
        if (tables && tables.length > 0) {
          console.log(`Found ${tables.length} existing Taylor Swift tables`);
          
          // Drop existing tables
          console.log('Dropping existing tables...');
          
          const dropTablesSQL = tables
            .map(table => `DROP TABLE IF EXISTS "${table.table_name}" CASCADE;`)
            .join('\n');
          
          const dropResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({
              query: dropTablesSQL
            })
          });
          
          if (!dropResponse.ok) {
            console.error('Error dropping tables:', await dropResponse.text());
          } else {
            console.log('Dropped existing tables successfully');
          }
        } else {
          console.log('No existing Taylor Swift tables found');
        }
      }
    }
    
    // Execute each SQL file
    for (const sqlFile of sqlContents) {
      console.log(`Executing ${sqlFile.name}...`);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          query: sqlFile.content
        })
      });
      
      if (!response.ok) {
        console.error(`Error executing ${sqlFile.name}:`, await response.text());
      } else {
        console.log(`Successfully executed ${sqlFile.name}`);
      }
    }
    
    console.log('\nSchema implementation completed!');
    console.log('You can now run the migration script to populate the tables.');
    
  } catch (error) {
    console.error('Error implementing schema:', error);
  }
}

// Execute the implementation
executeSQL();
