import { supabase } from '../lib/supabase/client'

/**
 * Service for handling Supabase database operations
 * Based on schema from previous project but optimized for Music Ranker app
 */
export const supabaseService = {
  /**
   * Songs related operations
   */
  songs: {
    /**
     * Get all songs with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { limit = 50, orderBy = 'title', ascending = true } = options
      
      const query = supabase
        .from('songs')
        .select('*')
        .order(orderBy, { ascending })
        .limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching songs:', error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get a single song by ID
     * @param {number|string} id - Song ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error(`Error fetching song with ID ${id}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Add a new song
     * @param {Object} song - Song data
     * @returns {Promise} - Insert result
     */
    add: async (song) => {
      const { data, error } = await supabase
        .from('songs')
        .insert(song)
        .select()
      
      if (error) {
        console.error('Error adding song:', error)
        throw error
      }
      
      return data
    },
    
    /**
     * Update an existing song
     * @param {number|string} id - Song ID
     * @param {Object} updates - Fields to update
     * @returns {Promise} - Update result
     */
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error(`Error updating song with ID ${id}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Delete a song
     * @param {number|string} id - Song ID
     * @returns {Promise} - Delete result
     */
    delete: async (id) => {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error(`Error deleting song with ID ${id}:`, error)
        throw error
      }
      
      return true
    }
  },
  
  /**
   * Artists related operations
   */
  artists: {
    /**
     * Get all artists with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { limit = 50, orderBy = 'name', ascending = true } = options
      
      const query = supabase
        .from('artists')
        .select('*')
        .order(orderBy, { ascending })
        .limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching artists:', error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get a single artist by ID
     * @param {number|string} id - Artist ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error(`Error fetching artist with ID ${id}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Add a new artist
     * @param {Object} artist - Artist data
     * @returns {Promise} - Insert result
     */
    add: async (artist) => {
      const { data, error } = await supabase
        .from('artists')
        .insert(artist)
        .select()
      
      if (error) {
        console.error('Error adding artist:', error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * User song ratings operations
   */
  ratings: {
    /**
     * Get all ratings for a user
     * @param {string} userId - User ID
     * @returns {Promise} - Query result
     */
    getUserRatings: async (userId) => {
      const { data, error } = await supabase
        .from('user_song_ratings')
        .select('*')
        .eq('user_id', userId)
      
      if (error) {
        console.error(`Error fetching ratings for user ${userId}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Rate a song
     * @param {Object} rating - Rating data (user_id, song_id, rating)
     * @returns {Promise} - Insert/Update result
     */
    rateSong: async (rating) => {
      // Check if rating already exists
      const { data: existingRating } = await supabase
        .from('user_song_ratings')
        .select('*')
        .eq('user_id', rating.user_id)
        .eq('song_id', rating.song_id)
        .maybeSingle()
      
      let result
      
      if (existingRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from('user_song_ratings')
          .update({ rating: rating.rating, updated_at: new Date() })
          .eq('id', existingRating.id)
          .select()
        
        if (error) {
          console.error('Error updating rating:', error)
          throw error
        }
        
        result = data
      } else {
        // Insert new rating
        const { data, error } = await supabase
          .from('user_song_ratings')
          .insert({
            ...rating,
            created_at: new Date(),
            updated_at: new Date()
          })
          .select()
        
        if (error) {
          console.error('Error adding rating:', error)
          throw error
        }
        
        result = data
      }
      
      return result
    }
  }
}
