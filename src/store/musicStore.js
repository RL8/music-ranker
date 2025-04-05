import { defineStore } from 'pinia'
import { supabaseService } from '../services/supabaseService'

// Define a store for managing music data
export const useMusicStore = defineStore('music', {
  // State: reactive data
  state: () => ({
    songs: [],
    artists: [],
    userRatings: [],
    loading: false,
    error: null
  }),

  // Getters: computed properties for the state
  getters: {
    getSongById: (state) => (id) => {
      return state.songs.find(song => song.id === id)
    },
    getArtistById: (state) => (id) => {
      return state.artists.find(artist => artist.id === id)
    },
    topRatedSongs: (state) => {
      return [...state.songs].sort((a, b) => b.rating - a.rating).slice(0, 10)
    },
    getUserRatingForSong: (state) => (songId) => {
      const rating = state.userRatings.find(r => r.song_id === songId)
      return rating ? rating.rating : 0
    }
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    async fetchSongs() {
      this.loading = true
      try {
        // Use Supabase service to fetch songs
        const songs = await supabaseService.songs.getAll()
        this.songs = songs
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch songs'
        
        // Fallback to sample data if there's an error
        console.warn('Using sample data due to error:', error)
        this.songs = [
          { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', rating: 4.9 },
          { id: '2', title: 'Imagine', artist: 'John Lennon', rating: 4.8 },
          { id: '3', title: 'Hotel California', artist: 'Eagles', rating: 4.7 }
        ]
      } finally {
        this.loading = false
      }
    },
    
    async fetchArtists() {
      this.loading = true
      try {
        // Use Supabase service to fetch artists
        const artists = await supabaseService.artists.getAll()
        this.artists = artists
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch artists'
        
        // Fallback to sample data if there's an error
        console.warn('Using sample data due to error:', error)
        this.artists = [
          { id: '1', name: 'Queen', genre: 'Rock' },
          { id: '2', name: 'John Lennon', genre: 'Rock' },
          { id: '3', name: 'Eagles', genre: 'Rock' }
        ]
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserRatings(userId) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use Supabase service to fetch user ratings
        const ratings = await supabaseService.ratings.getUserRatings(userId)
        this.userRatings = ratings
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch user ratings'
        
        // Fallback to sample data if there's an error
        console.warn('Using sample data due to error:', error)
        this.userRatings = [
          { id: '1', user_id: userId, song_id: '1', rating: 4.5 },
          { id: '2', user_id: userId, song_id: '2', rating: 5.0 }
        ]
      } finally {
        this.loading = false
      }
    },
    
    async rateSong(songId, rating, userId) {
      if (!userId || !songId) return
      
      this.loading = true
      try {
        // Use Supabase service to rate a song
        await supabaseService.ratings.rateSong({
          user_id: userId,
          song_id: songId,
          rating
        })
        
        // Update local state after successful API call
        const existingRating = this.userRatings.find(r => r.song_id === songId)
        
        if (existingRating) {
          existingRating.rating = rating
        } else {
          this.userRatings.push({
            id: Date.now().toString(),
            user_id: userId,
            song_id: songId,
            rating
          })
        }
        
        // Also update the song's overall rating for UI purposes
        const song = this.songs.find(s => s.id === songId)
        if (song) {
          song.rating = (song.rating + rating) / 2 // Simple average for demo
        }
        
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to rate song'
      } finally {
        this.loading = false
      }
    },
    
    async addSong(song) {
      this.loading = true
      try {
        // Use Supabase service to add a song
        const newSong = await supabaseService.songs.add(song)
        
        // Add to local state after successful API call
        this.songs.push(newSong)
        this.error = null
        return newSong
      } catch (error) {
        this.error = error.message || 'Failed to add song'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateSongRating(songId, rating) {
      const song = this.songs.find(s => s.id === songId)
      if (song) {
        song.rating = rating
      }
    }
  }
})
