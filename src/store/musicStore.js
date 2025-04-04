import { defineStore } from 'pinia'

// Define a store for managing music data
export const useMusicStore = defineStore('music', {
  // State: reactive data
  state: () => ({
    songs: [],
    artists: [],
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
    }
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    async fetchSongs() {
      this.loading = true
      try {
        // In a real app, this would be an API call
        // Example: const response = await this.$axios.get('/api/songs')
        // Simulating API response with setTimeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Sample data
        this.songs = [
          { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen', rating: 4.9 },
          { id: 2, title: 'Imagine', artist: 'John Lennon', rating: 4.8 },
          { id: 3, title: 'Hotel California', artist: 'Eagles', rating: 4.7 }
        ]
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch songs'
      } finally {
        this.loading = false
      }
    },
    
    async fetchArtists() {
      this.loading = true
      try {
        // In a real app, this would be an API call
        // Example: const response = await this.$axios.get('/api/artists')
        // Simulating API response with setTimeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Sample data
        this.artists = [
          { id: 1, name: 'Queen', genre: 'Rock' },
          { id: 2, name: 'John Lennon', genre: 'Rock' },
          { id: 3, name: 'Eagles', genre: 'Rock' }
        ]
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch artists'
      } finally {
        this.loading = false
      }
    },
    
    addSong(song) {
      this.songs.push(song)
    },
    
    updateSongRating(songId, rating) {
      const song = this.songs.find(s => s.id === songId)
      if (song) {
        song.rating = rating
      }
    }
  }
})
