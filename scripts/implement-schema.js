/**
 * Implement Taylor Swift schema in Supabase
 * This script uses the Supabase JavaScript client to execute SQL commands
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be set in .env.local file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

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

async function implementSchema() {
  try {
    console.log('Starting schema implementation...');
    
    // Execute each SQL file
    for (const sqlFile of sqlContents) {
      console.log(`Executing ${sqlFile.name}...`);
      
      // Split the SQL file into individual statements
      const statements = sqlFile.content
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      console.log(`Found ${statements.length} statements in ${sqlFile.name}`);
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            if (error.message && error.message.includes('function "exec_sql" does not exist')) {
              console.log('Creating exec_sql function...');
              
              // Create the exec_sql function
              const { data, error: fnError } = await supabase
                .from('_')
                .select('*')
                .limit(1)
                .execute(`
                  CREATE OR REPLACE FUNCTION exec_sql(sql TEXT) 
                  RETURNS VOID AS $$
                  BEGIN
                    EXECUTE sql;
                  END;
                  $$ LANGUAGE plpgsql SECURITY DEFINER;
                `);
              
              if (fnError) {
                console.error('Error creating exec_sql function:', fnError);
              } else {
                console.log('Created exec_sql function');
                
                // Retry the statement
                const { error: retryError } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (retryError) {
                  console.error(`Error executing statement ${i+1}:`, retryError);
                }
              }
            } else {
              console.error(`Error executing statement ${i+1}:`, error);
            }
          }
        } catch (err) {
          console.error(`Exception executing statement ${i+1}:`, err);
        }
      }
      
      console.log(`Finished executing ${sqlFile.name}`);
    }
    
    console.log('\nSchema implementation completed!');
    console.log('Now running the migration script to populate the tables...');
    
    // Run the migration script
    require('./migrate-taylor-swift-to-supabase');
    
  } catch (error) {
    console.error('Error implementing schema:', error);
  }
}

// Execute the implementation
implementSchema();
