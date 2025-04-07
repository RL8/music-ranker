import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * 
 * This creates a Supabase client instance using environment variables.
 * The client is used throughout the application for database operations.
 */

// Supabase connection details
// Using direct values from .env.local
const supabaseUrl = 'https://zfujellgwbznmosjuenq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdWplbGxnd2J6bm1vc2p1ZW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5ODM1MzYsImV4cCI6MjA1OTU1OTUzNn0.Yn3SJ7Vxnyv__XF6LPUIAuwOzOnRcRy47s5LA_9NlcQ'

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
