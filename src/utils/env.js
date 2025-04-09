/**
 * Environment variable utility for Vue CLI
 * 
 * This utility provides consistent access to environment variables
 * throughout the application.
 */

// Get environment variables
export const getEnv = (key, defaultValue = '') => {
  return process.env[key] || defaultValue
}

// Common environment variables
export const BASE_URL = getEnv('BASE_URL', '/')
export const NODE_ENV = getEnv('NODE_ENV', 'development')
export const SUPABASE_URL = getEnv('VUE_APP_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getEnv('VUE_APP_SUPABASE_ANON_KEY')
export const SUPABASE_SERVICE_KEY = getEnv('VUE_APP_SUPABASE_SERVICE_KEY')

// Helper function to check if we're in production
export const isProduction = NODE_ENV === 'production'
export const isDevelopment = NODE_ENV === 'development'
