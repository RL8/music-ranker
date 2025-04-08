import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../utils/env'

/**
 * Supabase Client Configuration
 * 
 * This creates a Supabase client instance using environment variables.
 * The client is used throughout the application for database operations.
 */

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.')
}

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Export the client
export { supabase };

/**
 * Helper for handling Supabase errors consistently
 * @param {Error} error - The error object from Supabase
 * @param {string} context - Context where the error occurred
 * @returns {string} Formatted error message
 */
export function handleSupabaseError(error, context = 'operation') {
  console.error(`Supabase ${context} error:`, error);
  return `Error during ${context}: ${error.message || 'Unknown error'}`;
}
