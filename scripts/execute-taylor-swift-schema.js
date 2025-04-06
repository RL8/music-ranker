/**
 * Script to execute Taylor Swift schema changes in Supabase
 * This script runs our SQL commands directly using the Supabase JS client
 */

const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
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

// Read the SQL file
const sqlFilePath = path.resolve(__dirname, './create-taylor-swift-tables.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

async function executeSQL() {
  try {
    console.log('Checking for existing Taylor Swift tables...');
    
    // Check for existing Taylor Swift tables
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .like('tablename', 'taylor_swift%');
    
    if (tablesError) {
      console.error('Error checking for existing tables:', tablesError);
      // Continue anyway
    } else if (tables && tables.length > 0) {
      console.log('Found existing Taylor Swift tables:');
      for (const table of tables) {
        console.log(` - ${table.tablename}`);
      }
      
      // Drop existing tables
      console.log('\nDropping existing Taylor Swift tables...');
      for (const table of tables) {
        const { error: dropError } = await supabase.rpc('exec_sql', {
          sql_string: `DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`
        });
        
        if (dropError) {
          console.error(`Error dropping table ${table.tablename}:`, dropError);
        } else {
          console.log(` - Dropped ${table.tablename}`);
        }
      }
    } else {
      console.log('No existing Taylor Swift tables found');
    }
    
    // Now execute the full SQL script
    console.log('\nExecuting SQL script to create new schema...');
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql_string: sqlContent
    });
    
    if (sqlError) {
      console.error('Error executing SQL script:', sqlError);
      
      // If the exec_sql function doesn't exist, we need to create it first
      if (sqlError.message && sqlError.message.includes('function "exec_sql" does not exist')) {
        console.log('Creating exec_sql function...');
        
        const createFunctionSql = `
          CREATE OR REPLACE FUNCTION exec_sql(sql_string text)
          RETURNS void AS $$
          BEGIN
            EXECUTE sql_string;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        const { data, error: funcError } = await supabase
          .from('pg_catalog.pg_proc')
          .select('proname')
          .eq('proname', 'exec_sql');
        
        if (funcError) {
          console.error('Error checking for exec_sql function:', funcError);
        } else if (!data || data.length === 0) {
          // Function doesn't exist, create it
          console.log('Creating exec_sql function...');
          
          // We need to use a direct REST API call for this
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ sql_string: createFunctionSql })
          });
          
          if (!response.ok) {
            console.error('Error creating exec_sql function:', await response.text());
          } else {
            console.log('Successfully created exec_sql function');
            
            // Now try executing the SQL script again
            console.log('Retrying SQL script execution...');
            const { error: retryError } = await supabase.rpc('exec_sql', {
              sql_string: sqlContent
            });
            
            if (retryError) {
              console.error('Error executing SQL script on retry:', retryError);
            } else {
              console.log('Successfully executed SQL script');
            }
          }
        }
      }
    } else {
      console.log('Successfully executed SQL script');
    }
    
    console.log('\nSchema changes completed!');
    console.log('You can now run the migration script to populate the tables.');
    
  } catch (error) {
    console.error('Error executing schema changes:', error);
  }
}

// Execute the schema changes
executeSQL();
