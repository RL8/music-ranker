/**
 * Environment variable utility to handle both Vite and Vue CLI environments
 * 
 * Vite uses import.meta.env
 * Vue CLI uses process.env
 */

// Check if we're in a Vite environment
const isVite = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'

// Get environment variables based on the environment
export const getEnv = (key, defaultValue = '') => {
  if (isVite) {
    return import.meta.env[key] || defaultValue
  } else {
    return process.env[key] || defaultValue
  }
}

// Common environment variables
export const BASE_URL = getEnv('BASE_URL', '/')
export const NODE_ENV = getEnv('NODE_ENV', 'development')
export const SUPABASE_URL = getEnv('VUE_APP_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getEnv('VUE_APP_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY')
export const SUPABASE_SERVICE_KEY = getEnv('VUE_APP_SUPABASE_SERVICE_KEY') || getEnv('VITE_SUPABASE_SERVICE_KEY')

// Helper function to check if we're in production
export const isProduction = NODE_ENV === 'production'
export const isDevelopment = NODE_ENV === 'development'
