import { defineStore } from 'pinia'
import { dataAdapter } from '../services/dataAdapter'
import { databaseService } from '../services/databaseService'

/**
 * Database Music Store
 * 
 * This store manages music data from the database.
 * It provides the same interface as the original musicStore
 * but sources data from the database instead of static JSON.
 */
export const useDatabaseMusicStore = defineStore('databaseMusic', {
  // State: reactive data
  state: () => ({
    songs: [],
    albums: [],
    eras: [],
    editions: [],
    songsByEra: [],
    loading: {
      songs: false,
      albums: false,
      eras: false,
      editions: false,
      songsByEra: false,
      vaultSongs: false
    },
    error: null
  }),

  // Getters: computed properties for the state
  getters: {
    getSongById: (state) => (id) => {
      return state.songs.find(song => song.id === id || song.songId === id)
    },
    
    getAlbumById: (state) => (id) => {
      return state.albums.find(album => album.id === id || album.albumId === id)
    },
    
    getEraById: (state) => (id) => {
      return state.eras.find(era => era.eraId === id)
    },
    
    getSongsByEra: (state) => (eraId) => {
      const eraGroup = state.songsByEra.find(group => group.eraId === eraId)
      return eraGroup ? eraGroup.songs : []
    },
    
    getVaultSongs: (state) => {
      // Find the vault edition in songsByEdition
      const vaultEdition = state.editions.find(edition => 
        edition.editionName.toLowerCase() === 'vault'
      )
      
      if (!vaultEdition) return []
      
      // Return songs for this edition
      return state.songs.filter(song => 
        song.editions?.includes(vaultEdition.editionId)
      )
    }
  },

  // Actions: methods that can change the state
  actions: {
    /**
     * Fetch all songs from the database
     */
    async fetchSongs() {
      this.loading.songs = true
      this.error = null
      
      try {
        this.songs = await dataAdapter.getSongs()
      } catch (error) {
        console.error('Error fetching songs:', error)
        this.error = error.message
      } finally {
        this.loading.songs = false
      }
    },
    
    /**
     * Fetch all albums with their recordings
     */
    async fetchAlbums() {
      this.loading.albums = true
      this.error = null
      
      try {
        this.albums = await dataAdapter.getAlbums()
      } catch (error) {
        console.error('Error fetching albums:', error)
        this.error = error.message
      } finally {
        this.loading.albums = false
      }
    },
    
    /**
     * Fetch all eras
     */
    async fetchEras() {
      this.loading.eras = true
      this.error = null
      
      try {
        const eras = await databaseService.eras.getAll()
        this.eras = eras
      } catch (error) {
        console.error('Error fetching eras:', error)
        this.error = error.message
      } finally {
        this.loading.eras = false
      }
    },
    
    /**
     * Fetch all editions
     */
    async fetchEditions() {
      this.loading.editions = true
      this.error = null
      
      try {
        const editions = await databaseService.editions.getAll()
        this.editions = editions
      } catch (error) {
        console.error('Error fetching editions:', error)
        this.error = error.message
      } finally {
        this.loading.editions = false
      }
    },
    
    /**
     * Fetch songs grouped by era
     */
    async fetchSongsByEra() {
      this.loading.songsByEra = true
      this.error = null
      
      try {
        this.songsByEra = await dataAdapter.getSongsByEra()
      } catch (error) {
        console.error('Error fetching songs by era:', error)
        this.error = error.message
      } finally {
        this.loading.songsByEra = false
      }
    },
    
    /**
     * Fetch vault songs
     */
    async fetchVaultSongs() {
      this.loading.vaultSongs = true
      this.error = null
      
      try {
        const vaultSongs = await dataAdapter.getVaultSongs()
        
        // Update songs with vault information
        this.songs = this.songs.map(song => {
          const isVault = vaultSongs.some(vs => vs.id === song.id)
          return {
            ...song,
            isVault
          }
        })
        
        // If songs haven't been loaded yet, load the vault songs directly
        if (this.songs.length === 0) {
          this.songs = vaultSongs.map(song => ({
            ...song,
            isVault: true
          }))
        }
      } catch (error) {
        console.error('Error fetching vault songs:', error)
        this.error = error.message
      } finally {
        this.loading.vaultSongs = false
      }
    },
    
    /**
     * Initialize the store by loading all necessary data
     */
    async initialize() {
      this.error = null
      
      try {
        // Load data in parallel for better performance
        await Promise.all([
          this.fetchSongs(),
          this.fetchAlbums(),
          this.fetchEras(),
          this.fetchEditions(),
          this.fetchSongsByEra()
        ])
        
        // After basic data is loaded, fetch vault songs to enhance the data
        await this.fetchVaultSongs()
        
        console.log('Database music store initialized successfully')
      } catch (error) {
        console.error('Error initializing database music store:', error)
        this.error = error.message
      }
    }
  }
})
