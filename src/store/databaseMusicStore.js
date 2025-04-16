import { defineStore } from 'pinia'
import { dataAdapter } from '../services/dataAdapter'
import { databaseService } from '../services/databaseService'

/**
 * Database Music Store
 * 
 * This store manages music data from the database.
 * It provides the same interface as the original musicStore
 * but sources data from the database instead of static JSON.
 * Enhanced for era-centric approach.
 */
export const useDatabaseMusicStore = defineStore('databaseMusic', {
  // State: reactive data
  state: () => ({
    songs: [],
    albums: [],
    eras: [],
    editions: [],
    songsByEra: [],
    albumsByEra: [],
    currentEra: null,
    loading: {
      songs: false,
      albums: false,
      eras: false,
      editions: false,
      songsByEra: false,
      albumsByEra: false,
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
    
    getAlbumsByEra: (state) => (eraId) => {
      const eraGroup = state.albumsByEra.find(group => group.eraId === eraId)
      return eraGroup ? eraGroup.albums : []
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
    },
    
    // Get all eras sorted by start date
    getSortedEras: (state) => {
      return [...state.eras].sort((a, b) => {
        return new Date(a.eraStartDate) - new Date(b.eraStartDate)
      })
    },
    
    // Get primary album for an era
    getPrimaryAlbumForEra: (state) => (eraId) => {
      const era = state.eras.find(era => era.eraId === eraId)
      if (!era || !era.primaryAlbumId) return null
      
      return state.albums.find(album => album.albumId === era.primaryAlbumId)
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
        return this.songs
      } catch (error) {
        console.error('Error fetching songs:', error)
        this.error = error.message
        return []
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
        return this.albums
      } catch (error) {
        console.error('Error fetching albums:', error)
        this.error = error.message
        return []
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
        return eras
      } catch (error) {
        console.error('Error fetching eras:', error)
        this.error = error.message
        return []
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
        return editions
      } catch (error) {
        console.error('Error fetching editions:', error)
        this.error = error.message
        return []
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
        // Use the new getByEraGrouped method from databaseService
        const songsByEra = await databaseService.songs.getByEraGrouped()
        this.songsByEra = songsByEra
        return songsByEra
      } catch (error) {
        console.error('Error fetching songs by era:', error)
        this.error = error.message
        return []
      } finally {
        this.loading.songsByEra = false
      }
    },
    
    /**
     * Fetch albums grouped by era
     */
    async fetchAlbumsByEra() {
      this.loading.albumsByEra = true
      this.error = null
      
      try {
        // Use the new getByEraGrouped method from databaseService
        const albumsByEra = await databaseService.albums.getByEraGrouped()
        this.albumsByEra = albumsByEra
        return albumsByEra
      } catch (error) {
        console.error('Error fetching albums by era:', error)
        this.error = error.message
        return []
      } finally {
        this.loading.albumsByEra = false
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
        
        return vaultSongs
      } catch (error) {
        console.error('Error fetching vault songs:', error)
        this.error = error.message
        return []
      } finally {
        this.loading.vaultSongs = false
      }
    },
    
    /**
     * Fetch a complete era with its songs and albums
     */
    async fetchCompleteEra(eraId) {
      this.error = null
      
      try {
        const era = await databaseService.eras.getComplete(eraId)
        
        // Update the current era
        this.currentEra = era
        
        return era
      } catch (error) {
        console.error(`Error fetching complete era ${eraId}:`, error)
        this.error = error.message
        return null
      }
    },
    
    /**
     * Set the current era
     */
    setCurrentEra(eraId) {
      const era = this.getEraById(eraId)
      if (era) {
        this.currentEra = era
        return true
      }
      return false
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
          this.fetchSongsByEra(),
          this.fetchAlbumsByEra()
        ])
        
        // If we have eras, set the first one as current
        if (this.eras.length > 0) {
          // Find the earliest era by start date
          const sortedEras = [...this.eras].sort((a, b) => 
            new Date(a.eraStartDate) - new Date(b.eraStartDate)
          )
          this.currentEra = sortedEras[0]
        }
        
        console.log('Database music store initialized successfully')
        return true
      } catch (error) {
        console.error('Error initializing database music store:', error)
        this.error = error.message
        return false
      }
    }
  }
})
