import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin Client Configuration
 * 
 * This creates a Supabase client with admin privileges using the service role key.
 * IMPORTANT: This client should ONLY be used in server-side code, never in client-side code.
 * The service role key grants full access to your database without respecting RLS policies.
 */

// Get environment variables based on the build system
const getEnvVar = (name) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name] || ''
  } else if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name] || ''
  }
  return ''
}

// Supabase connection details
const supabaseUrl = getEnvVar('VUE_APP_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL') || ''
const supabaseServiceKey = getEnvVar('VUE_APP_SUPABASE_SERVICE_KEY') || getEnvVar('VITE_SUPABASE_SERVICE_KEY') || ''

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase URL or Service Key is missing. Admin operations will not work.')
}

// Create the admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Execute a raw SQL query using the admin client
 * 
 * @param {string} query - SQL query to execute
 * @returns {Promise} - Query result or error
 */
export const executeRawSql = async (query) => {
  try {
    // First try using the pg_query function if it exists
    const { error: functionError } = await supabaseAdmin.rpc('pg_query', { query })
    
    if (!functionError) {
      return { success: true }
    }
    
    // If the function doesn't exist, try creating it
    if (functionError.message && functionError.message.includes('function "pg_query" does not exist')) {
      // Create the pg_query function
      const createFunctionQuery = `
        CREATE OR REPLACE FUNCTION pg_query(query TEXT) 
        RETURNS VOID AS $$
        BEGIN
          EXECUTE query;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
      
      // Use direct REST API call to create the function
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          query: createFunctionQuery
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error creating pg_query function:', errorData)
        return { error: 'Failed to create SQL execution function' }
      }
      
      // Try the original query again
      const { error: retryError } = await supabaseAdmin.rpc('pg_query', { query })
      
      if (retryError) {
        console.error('Error executing SQL after creating function:', retryError)
        return { error: retryError.message || 'Failed to execute SQL query' }
      }
      
      return { success: true }
    }
    
    // If there was a different error, return it
    console.error('Error executing SQL:', functionError)
    return { error: functionError.message || 'Failed to execute SQL query' }
  } catch (error) {
    console.error('Unexpected error during SQL execution:', error)
    return { error: error.message || 'Unexpected error during SQL execution' }
  }
}

export default supabaseAdmin
