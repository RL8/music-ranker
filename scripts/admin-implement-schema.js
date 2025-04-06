/**
 * Admin implementation of Taylor Swift schema in Supabase
 * This script uses the service role key for administrative operations
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Get Supabase credentials
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const serviceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Error: Supabase URL and service key must be set in .env.local file');
  console.error('Make sure you have added VUE_APP_SUPABASE_SERVICE_KEY to your .env.local file');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceKey);

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
    console.log('Starting schema implementation with service role key...');
    
    // Check for existing tables
    console.log('Checking for existing Taylor Swift tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .like('tablename', 'taylor_swift%');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
    } else if (tables && tables.length > 0) {
      console.log(`Found ${tables.length} existing Taylor Swift tables:`);
      tables.forEach(t => console.log(` - ${t.tablename}`));
      
      // Drop existing tables
      console.log('Dropping existing tables...');
      for (const table of tables) {
        const { error: dropError } = await supabase.rpc('exec_sql', {
          sql: `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`
        });
        
        if (dropError) {
          if (dropError.message && dropError.message.includes('function "exec_sql" does not exist')) {
            // Create exec_sql function
            console.log('Creating exec_sql function...');
            const { error: createFnError } = await supabase.rpc('pg_query', {
              query: `
                CREATE OR REPLACE FUNCTION exec_sql(sql TEXT) 
                RETURNS VOID AS $$
                BEGIN
                  EXECUTE sql;
                END;
                $$ LANGUAGE plpgsql SECURITY DEFINER;
              `
            });
            
            if (createFnError) {
              console.error('Error creating exec_sql function:', createFnError);
              
              // Try direct SQL execution
              const { error: directError } = await supabase
                .from('pg_tables')
                .select('*')
                .limit(1)
                .then(() => {
                  return supabase.rpc('pg_query', {
                    query: `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`
                  });
                });
              
              if (directError) {
                console.error(`Error dropping table ${table.tablename}:`, directError);
              } else {
                console.log(`Dropped ${table.tablename}`);
              }
            } else {
              // Try dropping again with the new function
              const { error: retryError } = await supabase.rpc('exec_sql', {
                sql: `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`
              });
              
              if (retryError) {
                console.error(`Error dropping table ${table.tablename}:`, retryError);
              } else {
                console.log(`Dropped ${table.tablename}`);
              }
            }
          } else {
            console.error(`Error dropping table ${table.tablename}:`, dropError);
          }
        } else {
          console.log(`Dropped ${table.tablename}`);
        }
      }
    } else {
      console.log('No existing Taylor Swift tables found');
    }
    
    // Execute each SQL file
    for (const sqlFile of sqlContents) {
      console.log(`\nExecuting ${sqlFile.name}...`);
      
      const { error } = await supabase.rpc('pg_query', {
        query: sqlFile.content
      });
      
      if (error) {
        if (error.message && error.message.includes('function "pg_query" does not exist')) {
          console.log('Creating pg_query function...');
          
          // Create a function that can execute arbitrary SQL
          const createFnResult = await supabase
            .from('pg_tables')
            .select('*')
            .limit(1)
            .then(() => {
              return supabase.rpc('pg_query', {
                query: `
                  CREATE OR REPLACE FUNCTION pg_query(query TEXT) 
                  RETURNS VOID AS $$
                  BEGIN
                    EXECUTE query;
                  END;
                  $$ LANGUAGE plpgsql SECURITY DEFINER;
                `
              });
            });
          
          if (createFnResult.error) {
            console.error('Error creating pg_query function:', createFnResult.error);
            console.log('Falling back to direct SQL execution...');
            
            // Try direct SQL execution
            const { error: directError } = await supabase
              .from('pg_tables')
              .select('*')
              .limit(1)
              .then(() => {
                return supabase.rpc('pg_query', {
                  query: sqlFile.content
                });
              });
            
            if (directError) {
              console.error(`Error executing ${sqlFile.name}:`, directError);
            } else {
              console.log(`Successfully executed ${sqlFile.name}`);
            }
          } else {
            // Try again with the new function
            const { error: retryError } = await supabase.rpc('pg_query', {
              query: sqlFile.content
            });
            
            if (retryError) {
              console.error(`Error executing ${sqlFile.name}:`, retryError);
            } else {
              console.log(`Successfully executed ${sqlFile.name}`);
            }
          }
        } else {
          console.error(`Error executing ${sqlFile.name}:`, error);
        }
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
implementSchema();
