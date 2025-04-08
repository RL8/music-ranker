import { defineStore } from 'pinia'
// Import supabase client when needed
// import { supabase } from '@/lib/supabase/client'

export const useUserStore = defineStore('user', {
  // State: reactive data
  state: () => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  // Getters: computed properties for the state
  getters: {
    getUserId: (state) => state.user?.id,
    getUsername: (state) => state.profile?.username || state.user?.email,
    getAvatarUrl: (state) => state.profile?.avatar_url
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    async fetchUser() {
      this.loading = true
      try {
        // This will be implemented with actual Supabase logic
        // const { data: { user } } = await supabase.auth.getUser()
        // this.user = user
        // this.isAuthenticated = !!user
        
        // Placeholder for now
        console.log('Fetching user data...')
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch user'
        console.error('Error fetching user:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchProfile() {
      if (!this.user?.id) return
      
      this.loading = true
      try {
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('id', this.user.id)
        //   .single()
        
        // if (error) throw error
        // this.profile = data
        
        // Placeholder for now
        console.log('Fetching user profile...')
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch profile'
        console.error('Error fetching profile:', error)
      } finally {
        this.loading = false
      }
    },
    
    async login({ email, password }) {
      this.loading = true
      try {
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase.auth.signInWithPassword({
        //   email,
        //   password
        // })
        
        // if (error) throw error
        // this.user = data.user
        // this.isAuthenticated = !!data.user
        
        // Placeholder for now
        console.log('Logging in user:', email)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to login'
        console.error('Error logging in:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loading = true
      try {
        // This will be implemented with actual Supabase logic
        // await supabase.auth.signOut()
        
        // Placeholder for now
        console.log('Logging out user')
        this.user = null
        this.profile = null
        this.isAuthenticated = false
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to logout'
        console.error('Error logging out:', error)
      } finally {
        this.loading = false
      }
    },
    
    async updateProfile(profileData) {
      if (!this.user?.id) return
      
      this.loading = true
      try {
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('profiles')
        //   .update(profileData)
        //   .eq('id', this.user.id)
        
        // if (error) throw error
        // this.profile = { ...this.profile, ...profileData }
        
        // Placeholder for now
        console.log('Updating user profile:', profileData)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to update profile'
        console.error('Error updating profile:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
