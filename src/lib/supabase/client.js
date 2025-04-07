import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * 
 * This creates a Supabase client instance using environment variables.
 * The client is used throughout the application for database operations.
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

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Database functionality will be limited.')
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// Helper for handling Supabase errors consistently
export const handleSupabaseError = (error, context = 'operation') => {
  if (error) {
    console.error(`Supabase ${context} error:`, error)
    return { error: error.message || `Error during ${context}` }
  }
  return null
}
