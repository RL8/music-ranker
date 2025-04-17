import { defineStore } from 'pinia'
// Import supabase client for database operations
import { supabase } from '@/lib/supabase/client'
// Import database service for enhanced operations
import { databaseService } from '@/services/databaseService'

export const useRankingStore = defineStore('ranking', {
  // State: reactive data
  state: () => ({
    albumRankings: [],
    songRankings: [],
    eraRankings: [], // New state for era rankings
    rankingHistory: [],
    loading: false,
    error: null,
    // New state for drag-and-drop functionality
    availableAlbums: [], // Albums available to be ranked (on the shelf)
    availableEras: [], // Eras available to be ranked
    rankedTiers: {     // Albums placed in tiers
      tier1: [], // Max 1 album { id, title, coverImageUrl }
      tier2: [], // Max 2 albums
      tier3: [], // Max 3 albums
      tier4: [], // Max 3 albums
      tier5: []  // Max 2 albums
    },
    eraRankedTiers: {  // Eras placed in tiers (same structure)
      tier1: [],
      tier2: [],
      tier3: [],
      tier4: [],
      tier5: []
    },
    currentEraContext: null, // Currently selected era for song rankings
    notEnoughAlbumsForLoop: false, // Flag to disable loop mode
    // Local storage key for persisting rankings
    localStorageKey: 'swifties_album_rankings',
    eraLocalStorageKey: 'swifties_era_rankings',
    songLocalStorageKey: 'swifties_song_rankings',
    // App version for data structure changes
    appVersion: '2.0' // Updated for era-centric approach
  }),

  // Getters: computed properties for the state
  getters: {
    getAlbumRankingsByTier: (state) => (tier) => {
      return state.albumRankings.filter(ranking => ranking.tier === tier)
    },
    
    getEraRankingsByTier: (state) => (tier) => {
      return state.eraRankings.filter(ranking => ranking.tier === tier)
    },
    
    getSongRankingsByAlbum: (state) => (albumId) => {
      return state.songRankings.filter(ranking => ranking.album_context_id === albumId)
    },
    
    getSongRankingsByEra: (state) => (eraId) => {
      return state.songRankings.filter(ranking => ranking.era_context_id === eraId)
    },
    
    getAlbumRankingById: (state) => (albumId) => {
      return state.albumRankings.find(ranking => ranking.album_id === albumId)
    },
    
    getEraRankingById: (state) => (eraId) => {
      return state.eraRankings.find(ranking => ranking.era_id === eraId)
    },
    
    getSongRankingById: (state) => (songId, contextId, isEraContext = false) => {
      if (isEraContext) {
        return state.songRankings.find(
          ranking => ranking.song_id === songId && ranking.era_context_id === contextId
        )
      } else {
        return state.songRankings.find(
          ranking => ranking.song_id === songId && ranking.album_context_id === contextId
        )
      }
    },
    
    // New getters for drag-and-drop functionality
    getTierCapacity: () => (tier) => {
      const capacities = {
        tier1: 1,
        tier2: 2,
        tier3: 3,
        tier4: 3,
        tier5: 2
      };
      return capacities[tier] || 0;
    },
    
    isTierFull: (state) => (tier, isEraRanking = false) => {
      const capacities = {
        tier1: 1,
        tier2: 2,
        tier3: 3,
        tier4: 3,
        tier5: 2
      };
      
      if (isEraRanking) {
        return state.eraRankedTiers[tier].length >= capacities[tier];
      } else {
        return state.rankedTiers[tier].length >= capacities[tier];
      }
    },
    
    // Get all ranked albums across all tiers
    allRankedAlbums: (state) => {
      return [
        ...state.rankedTiers.tier1,
        ...state.rankedTiers.tier2,
        ...state.rankedTiers.tier3,
        ...state.rankedTiers.tier4,
        ...state.rankedTiers.tier5
      ];
    },
    
    // Get all ranked eras across all tiers
    allRankedEras: (state) => {
      return [
        ...state.eraRankedTiers.tier1,
        ...state.eraRankedTiers.tier2,
        ...state.eraRankedTiers.tier3,
        ...state.eraRankedTiers.tier4,
        ...state.eraRankedTiers.tier5
      ];
    }
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    async fetchAlbumRankings(userId) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use database service to fetch album rankings
        const data = await databaseService.rankings.getAlbumRankings(userId)
        this.albumRankings = data
        
        console.log('Fetched album rankings for user:', userId)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch album rankings'
        console.error('Error fetching album rankings:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchEraRankings(userId) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use Supabase to fetch era rankings (from the same table as album rankings)
        const { data, error } = await supabase
          .from('user_album_rankings')
          .select('*')
          .eq('user_id', userId)
          .not('era_id', 'is', null)
        
        if (error) throw error
        this.eraRankings = data
        
        console.log('Fetched era rankings for user:', userId)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch era rankings'
        console.error('Error fetching era rankings:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchSongRankings(userId, contextId = null, isEraContext = false) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use database service to fetch song rankings with context
        const options = {}
        if (contextId) {
          if (isEraContext) {
            options.eraContextId = contextId
          } else {
            options.albumContextId = contextId
          }
        }
        
        const data = await databaseService.rankings.getSongRankings(userId, options)
        this.songRankings = data
        
        if (isEraContext && contextId) {
          this.currentEraContext = contextId
        }
        
        console.log('Fetched song rankings for user:', userId, 
          isEraContext ? 'era:' : 'album:', contextId)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to fetch song rankings'
        console.error('Error fetching song rankings:', error)
      } finally {
        this.loading = false
      }
    },
    
    async rankAlbum(albumRanking) {
      if (!albumRanking.user_id || !albumRanking.album_id) return
      
      this.loading = true
      try {
        // Use Supabase to save album ranking
        const { data, error } = await supabase
          .from('user_album_rankings')
          .upsert({
            user_id: albumRanking.user_id,
            album_id: albumRanking.album_id,
            tier: albumRanking.tier,
            rank_in_tier: albumRanking.rank_in_tier,
            updated_at: new Date()
          })
          .select()
        
        if (error) throw error
        
        // Update local state
        const existingIndex = this.albumRankings.findIndex(
          r => r.album_id === albumRanking.album_id && r.user_id === albumRanking.user_id
        )
        
        if (existingIndex >= 0) {
          this.albumRankings[existingIndex] = { 
            ...this.albumRankings[existingIndex], 
            ...albumRanking,
            updated_at: new Date()
          }
        } else {
          this.albumRankings.push({
            ...albumRanking,
            id: data[0]?.id || Date.now().toString(),
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        console.log('Saved album ranking:', albumRanking)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to rank album'
        console.error('Error ranking album:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async rankEra(eraRanking) {
      if (!eraRanking.user_id || !eraRanking.era_id) return
      
      this.loading = true
      try {
        // Use Supabase to save era ranking
        const { data, error } = await supabase
          .from('user_album_rankings')
          .upsert({
            user_id: eraRanking.user_id,
            era_id: eraRanking.era_id,
            tier: eraRanking.tier,
            rank_in_tier: eraRanking.rank_in_tier,
            updated_at: new Date()
          })
          .select()
        
        if (error) throw error
        
        // Update local state
        const existingIndex = this.eraRankings.findIndex(
          r => r.era_id === eraRanking.era_id && r.user_id === eraRanking.user_id
        )
        
        if (existingIndex >= 0) {
          this.eraRankings[existingIndex] = { 
            ...this.eraRankings[existingIndex], 
            ...eraRanking,
            updated_at: new Date()
          }
        } else {
          this.eraRankings.push({
            ...eraRanking,
            id: data[0]?.id || Date.now().toString(),
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        console.log('Saved era ranking:', eraRanking)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to rank era'
        console.error('Error ranking era:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async rankSong(songRanking) {
      if (!songRanking.user_id || !songRanking.song_id) return
      
      // Ensure we have at least one context ID (era or album)
      if (!songRanking.era_context_id && !songRanking.album_context_id) {
        console.error('Song ranking must have either era_context_id or album_context_id')
        return
      }
      
      this.loading = true
      try {
        // Use database service to save song ranking
        const rankingData = {
          user_id: songRanking.user_id,
          song_id: songRanking.song_id,
          rank: songRanking.rank,
          notes: songRanking.notes || '',
          updated_at: new Date()
        }
        
        // Add context IDs if present
        if (songRanking.album_context_id) {
          rankingData.album_context_id = songRanking.album_context_id
        }
        
        if (songRanking.era_context_id) {
          rankingData.era_context_id = songRanking.era_context_id
        }
        
        const data = await databaseService.rankings.saveSongRankings([rankingData])
        
        // Update local state
        const existingIndex = this.songRankings.findIndex(r => {
          if (songRanking.era_context_id) {
            return r.song_id === songRanking.song_id && 
                   r.era_context_id === songRanking.era_context_id && 
                   r.user_id === songRanking.user_id
          } else {
            return r.song_id === songRanking.song_id && 
                   r.album_context_id === songRanking.album_context_id && 
                   r.user_id === songRanking.user_id
          }
        })
        
        if (existingIndex >= 0) {
          this.songRankings[existingIndex] = { 
            ...this.songRankings[existingIndex], 
            ...rankingData,
            updated_at: new Date()
          }
        } else {
          this.songRankings.push({
            ...rankingData,
            id: data[0]?.id || Date.now().toString(),
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        console.log('Saved song ranking:', rankingData)
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to rank song'
        console.error('Error ranking song:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async saveRankingSnapshot(userId, rankingType) {
      if (!userId) return
      
      try {
        let rankings = []
        let snapshotType = ''
        
        if (rankingType === 'album') {
          rankings = this.albumRankings
          snapshotType = 'album_rankings'
        } else if (rankingType === 'era') {
          rankings = this.eraRankings
          snapshotType = 'era_rankings'
        } else if (rankingType === 'song') {
          rankings = this.songRankings
          snapshotType = 'song_rankings'
        } else {
          throw new Error('Invalid ranking type')
        }
        
        const snapshot = {
          user_id: userId,
          snapshot_type: snapshotType,
          snapshot_data: JSON.stringify(rankings),
          created_at: new Date()
        }
        
        const { data, error } = await supabase
          .from('ranking_snapshots')
          .insert(snapshot)
          .select()
        
        if (error) throw error
        
        // Add to history
        this.rankingHistory.push({
          id: data[0].id,
          type: snapshotType,
          createdAt: data[0].created_at
        })
        
        console.log(`Saved ${rankingType} ranking snapshot`)
        return data[0]
      } catch (error) {
        console.error(`Error saving ${rankingType} ranking snapshot:`, error)
        throw error
      }
    },
    
    // New actions for drag-and-drop functionality
    initializeStaticAlbums(albumsData) {
      // Reset state
      this.availableAlbums = []
      
      Object.keys(this.rankedTiers).forEach(tier => {
        this.rankedTiers[tier] = []
      })
      
      // Initialize available albums
      if (albumsData && albumsData.length) {
        this.availableAlbums = albumsData.map(album => ({
          id: album.albumId,
          title: album.albumTitle,
          coverImageUrl: album.coverImageUrl || '',
          releaseDate: album.releaseDate
        }))
      }
      
      // Check if we have enough albums for loop mode
      this.notEnoughAlbumsForLoop = this.availableAlbums.length < 11
      
      console.log('Initialized static albums:', this.availableAlbums.length)
    },
    
    initializeStaticEras(erasData) {
      // Reset state
      this.availableEras = []
      
      Object.keys(this.eraRankedTiers).forEach(tier => {
        this.eraRankedTiers[tier] = []
      })
      
      // Initialize available eras
      if (erasData && erasData.length) {
        this.availableEras = erasData.map(era => ({
          id: era.id || era.eraId,
          title: era.title || era.eraName,
          coverImageUrl: era.image_url || era.coverImageUrl || '',
          startDate: era.eraStartDate || era.startDate,
          primaryAlbumId: era.primaryAlbumId
        }))
      }
      
      console.log('Initialized static eras:', this.availableEras.length)
    },
    
    // Save rankings to localStorage for persistence
    saveRankingsToLocalStorage() {
      try {
        const rankingsData = {
          version: this.appVersion,
          albumRankings: this.allRankedAlbums,
          eraRankings: this.allRankedEras,
          timestamp: new Date().toISOString()
        }
        
        localStorage.setItem(this.localStorageKey, JSON.stringify(rankingsData))
        console.log('Rankings saved to localStorage')
      } catch (error) {
        console.error('Error saving rankings to localStorage:', error)
      }
    },
    
    // Save song rankings to localStorage
    saveSongRankingsToLocalStorage() {
      try {
        const songRankingsData = {
          version: this.appVersion,
          songRankings: this.songRankings,
          timestamp: new Date().toISOString()
        }
        
        localStorage.setItem(this.songLocalStorageKey, JSON.stringify(songRankingsData))
        console.log('Song rankings saved to localStorage')
      } catch (error) {
        console.error('Error saving song rankings to localStorage:', error)
      }
    },
    
    // Load rankings from localStorage
    loadRankingsFromLocalStorage() {
      try {
        const savedRankings = localStorage.getItem(this.localStorageKey)
        
        if (savedRankings) {
          const parsedRankings = JSON.parse(savedRankings)
          
          // Check version compatibility
          if (parsedRankings.version === this.appVersion) {
            // Restore album rankings
            Object.keys(this.rankedTiers).forEach(tier => {
              this.rankedTiers[tier] = []
            })
            
            // Filter albums by tier and add to appropriate tier arrays
            if (parsedRankings.albumRankings) {
              parsedRankings.albumRankings.forEach(album => {
                const tier = album.tier || 'tier3'
                if (this.rankedTiers[tier]) {
                  this.rankedTiers[tier].push(album)
                }
              })
            }
            
            // Restore era rankings if available
            if (parsedRankings.eraRankings) {
              Object.keys(this.eraRankedTiers).forEach(tier => {
                this.eraRankedTiers[tier] = []
              })
              
              parsedRankings.eraRankings.forEach(era => {
                const tier = era.tier || 'tier3'
                if (this.eraRankedTiers[tier]) {
                  this.eraRankedTiers[tier].push(era)
                }
              })
            }
            
            console.log('Rankings loaded from localStorage')
          } else {
            console.log('Saved rankings version mismatch, not loading')
          }
        }
      } catch (error) {
        console.error('Error loading rankings from localStorage:', error)
      }
    },
    
    // Load song rankings from localStorage
    loadSongRankingsFromLocalStorage() {
      try {
        const savedRankings = localStorage.getItem(this.songLocalStorageKey)
        
        if (savedRankings) {
          const parsedRankings = JSON.parse(savedRankings)
          
          // Check version compatibility
          if (parsedRankings.version === this.appVersion) {
            if (parsedRankings.songRankings) {
              this.songRankings = parsedRankings.songRankings
            }
            
            console.log('Song rankings loaded from localStorage')
          } else {
            console.log('Saved song rankings version mismatch, not loading')
          }
        }
      } catch (error) {
        console.error('Error loading song rankings from localStorage:', error)
      }
    },
    
    // Clear all rankings and reset to initial state
    resetRankings(albumsData, erasData) {
      this.albumRankings = []
      this.songRankings = []
      this.eraRankings = []
      
      // Reset tiered rankings
      this.initializeStaticAlbums(albumsData)
      if (erasData) {
        this.initializeStaticEras(erasData)
      }
      
      // Clear localStorage
      localStorage.removeItem(this.localStorageKey)
      localStorage.removeItem(this.songLocalStorageKey)
      localStorage.removeItem(this.eraLocalStorageKey)
    },
    
    // Convert tiered rankings to flat structure for API/database
    convertRankingsToApiFormat(userId) {
      const apiRankings = []
      
      // Process each tier
      Object.keys(this.rankedTiers).forEach(tier => {
        this.rankedTiers[tier].forEach((album, index) => {
          apiRankings.push({
            user_id: userId,
            album_id: album.id,
            tier: tier,
            rank_in_tier: index + 1
          })
        })
      })
      
      return apiRankings
    },
    
    // Convert era tiered rankings to flat structure for API/database
    convertEraRankingsToApiFormat(userId) {
      const apiRankings = []
      
      // Process each tier
      Object.keys(this.eraRankedTiers).forEach(tier => {
        this.eraRankedTiers[tier].forEach((era, index) => {
          apiRankings.push({
            user_id: userId,
            era_id: era.id,
            tier: tier,
            rank_in_tier: index + 1
          })
        })
      })
      
      return apiRankings
    },
    
    // Save rankings to API/database when user is logged in
    async saveRankingsToApi(userId, rankingType = 'album') {
      if (!userId) return
      
      this.loading = true
      try {
        let rankings = []
        
        if (rankingType === 'album') {
          rankings = this.convertRankingsToApiFormat(userId)
          
          // Use database service to save album rankings
          await databaseService.rankings.saveAlbumRankings(rankings)
        } else if (rankingType === 'era') {
          rankings = this.convertEraRankingsToApiFormat(userId)
          
          // Use database service to save era rankings
          await databaseService.rankings.saveAlbumRankings(rankings)
        } else {
          throw new Error('Invalid ranking type')
        }
        
        console.log(`Saved ${rankingType} rankings to API for user:`, userId)
        this.error = null
        
        // Create a snapshot of the rankings
        await this.saveRankingSnapshot(userId, rankingType)
      } catch (error) {
        this.error = error.message || `Failed to save ${rankingType} rankings to API`
        console.error(`Error saving ${rankingType} rankings to API:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Get song rankings for a specific era
    getSongRankingsForEra(eraId) {
      return this.songRankings.filter(ranking => ranking.era_context_id === eraId)
        .sort((a, b) => a.rank - b.rank)
    },
    
    // Get song rankings for a specific album
    getSongRankingsForAlbum(albumId) {
      return this.songRankings.filter(ranking => ranking.album_context_id === albumId)
        .sort((a, b) => a.rank - b.rank)
    },
    
    // Update temporary song rankings (not saved to database yet)
    updateSongRankingsTemp(contextId, rankings, isEraContext = false) {
      // Remove existing rankings for this context
      this.songRankings = this.songRankings.filter(r => {
        if (isEraContext) {
          return r.era_context_id !== contextId
        } else {
          return r.album_context_id !== contextId
        }
      })
      
      // Add new rankings
      this.songRankings.push(...rankings)
    },
    
    // Save song rankings to the database
    async saveSongRankings(contextId, rankings, userId, isEraContext = false) {
      if (!userId || !rankings.length) return
      
      this.loading = true
      try {
        // Format rankings for database
        const formattedRankings = rankings.map((song, index) => {
          const ranking = {
            user_id: userId,
            song_id: song.id,
            rank: index + 1,
            notes: song.notes || ''
          }
          
          // Add context ID based on type
          if (isEraContext) {
            ranking.era_context_id = contextId
          } else {
            ranking.album_context_id = contextId
          }
          
          return ranking
        })
        
        // Use database service to save song rankings
        await databaseService.rankings.saveSongRankings(formattedRankings)
        
        // Update local state
        this.updateSongRankingsTemp(contextId, formattedRankings, isEraContext)
        
        console.log(`Saved song rankings for ${isEraContext ? 'era' : 'album'}:`, contextId)
        this.error = null
        
        // Create a snapshot of the song rankings
        await this.saveRankingSnapshot(userId, 'song')
      } catch (error) {
        this.error = error.message || 'Failed to save song rankings'
        console.error('Error saving song rankings:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Initialize with sample data for development
    initializeWithSampleData() {
      // This method can be used to populate the store with sample data for testing
      console.log('Initializing with sample data')
      
      // Sample implementation left empty for now
      // This would be filled with sample data as needed for development
    },
    
    // Set the current era context for song rankings
    setCurrentEraContext(eraId) {
      this.currentEraContext = eraId
      console.log('Set current era context:', eraId)
    }
  }
})
