import { createClient } from '@supabase/supabase-js'

// Use Vue CLI environment variables format (process.env)
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
