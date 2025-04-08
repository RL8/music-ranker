/**
 * Supabase Database Inspector
 * 
 * A comprehensive tool to inspect your Supabase database structure
 * using the service role key for elevated permissions.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from .env
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.VUE_APP_SUPABASE_SERVICE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase URL or Service Key in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Helper to format output
const formatOutput = (title, content) => {
  console.log('\n' + '='.repeat(80));
  console.log(`${title}`);
  console.log('='.repeat(80));
  console.log(content);
};

// Helper to execute SQL with proper error handling
async function executeSQL(query, params = {}) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: query });
    
    if (error) {
      if (error.message && error.message.includes('function "exec_sql" does not exist')) {
        // Fall back to direct query if RPC doesn't exist
        return await directQuery(query);
      }
      throw new Error(`SQL Error: ${error.message}`);
    }
    
    return data;
  } catch (err) {
    console.error(`Error executing SQL: ${err.message}`);
    return null;
  }
}

// Fallback direct query method
async function directQuery(query) {
  try {
    // Try to use a direct approach by checking tables individually
    if (query.includes('information_schema.tables')) {
      return await checkTablesIndividually();
    }
    return null;
  } catch (err) {
    console.error(`Error in direct query: ${err.message}`);
    return null;
  }
}

// Check tables individually as fallback
async function checkTablesIndividually() {
  const commonTables = [
    'songs', 'artists', 'albums', 'playlists', 'users', 'profiles',
    'auth_users', 'auth_identities', 'auth_sessions', 'buckets', 'objects',
    'migrations', 'schema_migrations', '_prisma_migrations', 'categories',
    'genres', 'user_ratings', 'user_song_ratings', 'settings', 'config'
  ];
  
  const results = [];
  
  for (const table of commonTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error) {
        results.push({
          table_schema: 'public',
          table_name: table,
          exists: true,
          row_count: await getTableRowCount(table)
        });
      }
    } catch (e) {
      // Table likely doesn't exist, skip
    }
  }
  
  return results;
}

// Get row count for a table
async function getTableRowCount(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) return 'Unknown';
    return data.count || 0;
  } catch (e) {
    return 'Error';
  }
}

// Get table schema details
async function getTableSchema(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);
    
    if (error) return null;
    
    // Extract column info from the response
    const columnInfo = Object.keys(data.length > 0 ? data[0] : {}).map(col => ({
      column_name: col,
      data_type: typeof data[0][col]
    }));
    
    return columnInfo;
  } catch (e) {
    return null;
  }
}

// Main function to inspect database
async function inspectDatabase() {
  console.log('Supabase Database Inspector');
  console.log(`URL: ${supabaseUrl}`);
  console.log('Starting inspection...\n');
  
  try {
    // 1. Check connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Connection Error:', authError.message);
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase');
    
    // 2. Try to create exec_sql function if it doesn't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE sql_query INTO result;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('error', SQLERRM);
      END;
      $$;
    `;
    
    try {
      await supabase.rpc('exec_sql', { sql_query: 'SELECT 1' });
      console.log('✅ SQL execution function already exists');
    } catch (e) {
      if (e.message && e.message.includes('function "exec_sql" does not exist')) {
        // Try to create the function
        try {
          // This is a direct approach that might not work due to permissions
          const { error } = await supabase.rpc('exec_sql_setup');
          
          if (error) {
            console.log('ℹ️ Could not create SQL execution function (requires manual setup)');
          } else {
            console.log('✅ Created SQL execution function');
          }
        } catch (setupErr) {
          console.log('ℹ️ Could not create SQL execution function (requires manual setup)');
        }
      }
    }
    
    // 3. List schemas
    console.log('\nAttempting to list database schemas...');
    
    const schemas = await executeSQL(`
      SELECT schema_name 
      FROM information_schema.schemata 
      ORDER BY schema_name
    `);
    
    if (schemas) {
      formatOutput('Database Schemas', schemas.map(s => s.schema_name).join('\n'));
    } else {
      console.log('ℹ️ Could not retrieve schema list (permission restrictions)');
    }
    
    // 4. List tables in public schema
    console.log('\nAttempting to list tables in public schema...');
    
    const tables = await executeSQL(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM 
        information_schema.tables 
      WHERE 
        table_schema = 'public'
      ORDER BY 
        table_name
    `);
    
    if (tables && tables.length > 0) {
      formatOutput('Tables in Public Schema', 
        tables.map(t => `${t.table_name} (${t.table_type})`).join('\n')
      );
      
      // 5. For each table, get details
      console.log('\nGathering details for each table...');
      
      const tableDetails = [];
      
      for (const table of tables) {
        const tableName = table.table_name;
        const rowCount = await getTableRowCount(tableName);
        const schema = await getTableSchema(tableName);
        
        tableDetails.push({
          name: tableName,
          row_count: rowCount,
          columns: schema
        });
        
        console.log(`✅ Processed table: ${tableName}`);
      }
      
      // Output detailed table information
      for (const table of tableDetails) {
        formatOutput(`Table: ${table.name} (${table.row_count} rows)`,
          table.columns 
            ? table.columns.map(c => `${c.column_name} (${c.data_type})`).join('\n')
            : 'Could not retrieve column information'
        );
      }
    } else {
      console.log('ℹ️ No tables found in the public schema or could not retrieve table list');
      
      // Fallback to checking common tables
      const foundTables = await checkTablesIndividually();
      
      if (foundTables && foundTables.length > 0) {
        formatOutput('Tables Found Through Direct Checks', 
          foundTables.map(t => `${t.table_name} (${t.row_count} rows)`).join('\n')
        );
      } else {
        console.log('ℹ️ No tables found through direct checks');
      }
    }
    
    // 6. Check for extensions
    console.log('\nAttempting to list database extensions...');
    
    const extensions = await executeSQL(`
      SELECT 
        extname as name,
        extversion as version
      FROM 
        pg_extension
      ORDER BY 
        extname
    `);
    
    if (extensions) {
      formatOutput('Database Extensions', 
        extensions.map(e => `${e.name} (${e.version})`).join('\n')
      );
    } else {
      console.log('ℹ️ Could not retrieve extension list (permission restrictions)');
    }
    
    console.log('\nDatabase inspection complete!');
    
  } catch (error) {
    console.error('Error during database inspection:', error.message);
  }
}

// Run the inspection
inspectDatabase();
