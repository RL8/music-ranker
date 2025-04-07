import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * 
 * This creates a Supabase client instance using environment variables.
 * The client is used throughout the application for database operations.
 * 
 * TEMPORARY: Using mock implementation until sunburst feature is complete
 */

// Get environment variables based on the build system
// Support both Vue CLI (process.env) and Vite (import.meta.env) formats
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
const supabaseAnonKey = getEnvVar('VUE_APP_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY') || ''

// Create a mock Supabase client if credentials are missing
// This prevents errors when environment variables aren't set
let supabase;

if (supabaseUrl && supabaseAnonKey) {
  // Use actual Supabase client if credentials are available
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
} else {
  // Create a mock client to prevent errors
  console.warn('Using mock Supabase client. Database functionality will be limited.');
  
  // Mock implementation that returns empty results instead of throwing errors
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            then: (callback) => callback({ data: [], error: null })
          }),
          then: (callback) => callback({ data: [], error: null })
        }),
        order: () => ({
          then: (callback) => callback({ data: [], error: null })
        }),
        then: (callback) => callback({ data: [], error: null })
      }),
      insert: () => ({
        then: (callback) => callback({ data: null, error: null })
      }),
      update: () => ({
        eq: () => ({
          then: (callback) => callback({ data: null, error: null })
        })
      }),
      delete: () => ({
        eq: () => ({
          then: (callback) => callback({ data: null, error: null })
        })
      })
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, session: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: null, error: null })
    }
  };
}

// Export the client (real or mock)
export { supabase };

// Helper for handling Supabase errors consistently
export const handleSupabaseError = (error, context = 'operation') => {
  if (error) {
    console.error(`Supabase ${context} error:`, error)
    return { error: error.message || `Error during ${context}` }
  }
  return null
}
