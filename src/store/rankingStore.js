import { defineStore } from 'pinia'
// Import supabase client for database operations
import { supabase } from '@/lib/supabase/client'

export const useRankingStore = defineStore('ranking', {
  // State: reactive data
  state: () => ({
    albumRankings: [],
    songRankings: [],
    rankingHistory: [],
    loading: false,
    error: null,
    // New state for drag-and-drop functionality
    availableAlbums: [], // Albums available to be ranked (on the shelf)
    rankedTiers: {     // Albums placed in tiers
      tier1: [], // Max 1 album { id, title, coverImageUrl }
      tier2: [], // Max 2 albums
      tier3: [], // Max 3 albums
      tier4: [], // Max 3 albums
      tier5: []  // Max 2 albums
    },
    notEnoughAlbumsForLoop: false, // Flag to disable loop mode
    // Local storage key for persisting rankings
    localStorageKey: 'swifties_album_rankings',
    // App version for data structure changes
    appVersion: '1.1'
  }),

  // Getters: computed properties for the state
  getters: {
    getAlbumRankingsByTier: (state) => (tier) => {
      return state.albumRankings.filter(ranking => ranking.tier === tier)
    },
    
    getSongRankingsByAlbum: (state) => (albumId) => {
      return state.songRankings.filter(ranking => ranking.album_context_id === albumId)
    },
    
    getAlbumRankingById: (state) => (albumId) => {
      return state.albumRankings.find(ranking => ranking.album_id === albumId)
    },
    
    getSongRankingById: (state) => (songId, albumContextId) => {
      return state.songRankings.find(
        ranking => ranking.song_id === songId && ranking.album_context_id === albumContextId
      )
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
    
    isTierFull: (state) => (tier) => {
      const capacities = {
        tier1: 1,
        tier2: 2,
        tier3: 3,
        tier4: 3,
        tier5: 2
      };
      return state.rankedTiers[tier].length >= capacities[tier];
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
    }
  },

  // Actions: methods that can change the state and perform async operations
  actions: {
    async fetchAlbumRankings(userId) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use Supabase to fetch album rankings
        const { data, error } = await supabase
          .from('user_album_rankings')
          .select('*')
          .eq('user_id', userId)
        
        if (error) throw error
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
    
    async fetchSongRankings(userId, albumContextId = null) {
      if (!userId) return
      
      this.loading = true
      try {
        // Use Supabase to fetch song rankings
        let query = supabase
          .from('user_song_rankings')
          .select('*')
          .eq('user_id', userId)
        
        if (albumContextId) {
          query = query.eq('album_context_id', albumContextId)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        this.songRankings = data
        
        console.log('Fetched song rankings for user:', userId, 'album:', albumContextId)
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
    
    async rankSong(songRanking) {
      if (!songRanking.user_id || !songRanking.song_id || !songRanking.album_context_id) return
      
      this.loading = true
      try {
        // Use Supabase to save song ranking
        const { data, error } = await supabase
          .from('user_song_rankings')
          .upsert({
            user_id: songRanking.user_id,
            song_id: songRanking.song_id,
            album_context_id: songRanking.album_context_id,
            tier: songRanking.tier,
            rank_in_tier: songRanking.rank_in_tier,
            updated_at: new Date()
          })
          .select()
        
        if (error) throw error
        
        // Update local state
        const existingIndex = this.songRankings.findIndex(
          r => r.song_id === songRanking.song_id && 
               r.album_context_id === songRanking.album_context_id && 
               r.user_id === songRanking.user_id
        )
        
        if (existingIndex >= 0) {
          this.songRankings[existingIndex] = { 
            ...this.songRankings[existingIndex], 
            ...songRanking,
            updated_at: new Date()
          }
        } else {
          this.songRankings.push({
            ...songRanking,
            id: data[0]?.id || Date.now().toString(),
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        console.log('Saved song ranking:', songRanking)
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
      
      this.loading = true
      try {
        // Prepare snapshot data based on ranking type
        const snapshotData = rankingType === 'album' 
          ? this.albumRankings.filter(r => r.user_id === userId)
          : this.songRankings.filter(r => r.user_id === userId)
        
        // Use Supabase to save ranking snapshot
        const { error } = await supabase
          .from('ranking_history')
          .insert({
            user_id: userId,
            ranking_type: rankingType,
            rankings_snapshot: snapshotData,
            created_at: new Date()
          })
        
        if (error) throw error
        
        console.log('Saved ranking snapshot:', {
          user_id: userId,
          ranking_type: rankingType,
          rankings_count: snapshotData.length
        })
        this.error = null
      } catch (error) {
        this.error = error.message || 'Failed to save ranking snapshot'
        console.error('Error saving ranking snapshot:', error)
      } finally {
        this.loading = false
      }
    },
    
    // New actions for drag-and-drop functionality
    initializeStaticAlbums(albumsData) {
      // Add debug logging to help identify issues
      console.log("Initializing with static albums data");
      
      // Only initialize if availableAlbums is empty to prevent overwriting during navigation
      if (this.availableAlbums.length === 0) {
        // First try to load from localStorage
        const loadedFromStorage = this.loadRankingsFromLocalStorage();
        
        // If we still don't have any ranked albums, initialize with static data
        if (!loadedFromStorage && 
            this.availableAlbums.length === 0 && 
            this.rankedTiers.tier1.length === 0 && 
            this.rankedTiers.tier2.length === 0 && 
            this.rankedTiers.tier3.length === 0 && 
            this.rankedTiers.tier4.length === 0 && 
            this.rankedTiers.tier5.length === 0) {
          
          // Process albums to ensure songs are properly structured
          const processedAlbums = albumsData.map(album => {
            // Ensure songs array exists and is properly formatted
            const songs = Array.isArray(album.songs) ? album.songs : [];
            
            // Log for debugging
            console.log(`Album ${album.title} has ${songs.length} songs`);
            
            return {
              ...album,
              songs: songs
            };
          });
          
          // Only set availableAlbums if there are enough albums to prevent Swiper loop warnings
          if (processedAlbums.length >= 3) {
            this.availableAlbums = processedAlbums;
          } else {
            // If there aren't enough albums, disable loop mode by adding a flag
            this.availableAlbums = processedAlbums;
            this.notEnoughAlbumsForLoop = true;
          }
          
          // Clear tiers just in case
          this.rankedTiers = { tier1: [], tier2: [], tier3: [], tier4: [], tier5: [] };
          
          // Save to localStorage with the current version
          this.saveRankingsToLocalStorage();
        }
      }
    },
    
    // Save rankings to localStorage for persistence
    saveRankingsToLocalStorage() {
      try {
        const rankings = {
          availableAlbums: this.availableAlbums,
          rankedTiers: this.rankedTiers,
          timestamp: new Date().toISOString(),
          appVersion: this.appVersion
        };
        localStorage.setItem(this.localStorageKey, JSON.stringify(rankings));
      } catch (error) {
        console.error('Error saving rankings to localStorage:', error);
      }
    },
    
    // Load rankings from localStorage
    loadRankingsFromLocalStorage() {
      try {
        const savedRankings = localStorage.getItem(this.localStorageKey);
        if (savedRankings) {
          const { availableAlbums, rankedTiers, appVersion } = JSON.parse(savedRankings);
          if (appVersion === this.appVersion) {
            this.availableAlbums = availableAlbums;
            this.rankedTiers = rankedTiers;
            return true;
          } else {
            // Clear localStorage if app version has changed
            localStorage.removeItem(this.localStorageKey);
          }
        }
      } catch (error) {
        console.error('Error loading rankings from localStorage:', error);
      }
      return false;
    },
    
    // Clear all rankings and reset to initial state
    resetRankings(albumsData) {
      this.availableAlbums = [...albumsData];
      this.rankedTiers = { tier1: [], tier2: [], tier3: [], tier4: [], tier5: [] };
      this.saveRankingsToLocalStorage();
    },
    
    // Convert tiered rankings to flat structure for API/database
    convertRankingsToApiFormat(userId) {
      const flatRankings = [];
      
      // Process each tier
      Object.entries(this.rankedTiers).forEach(([tier, albums], tierIndex) => {
        albums.forEach((album, albumIndex) => {
          flatRankings.push({
            user_id: userId,
            album_id: album.id,
            tier: tierIndex + 1, // Convert tier name to number
            rank_in_tier: albumIndex + 1,
            updated_at: new Date()
          });
        });
      });
      
      return flatRankings;
    },
    
    // Save rankings to API/database when user is logged in
    async saveRankingsToApi(userId) {
      if (!userId) return false
      
      this.loading = true
      try {
        // Convert tiered rankings to API format
        const rankings = this.convertRankingsToApiFormat(userId)
        
        // Use Supabase to save all rankings in a batch
        const { error } = await supabase
          .from('user_album_rankings')
          .upsert(rankings)
        
        if (error) throw error
        
        console.log('Rankings saved to database successfully')
        this.error = null
        return true
      } catch (error) {
        this.error = error.message || 'Failed to save rankings'
        console.error('Error saving rankings to API:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // Get song rankings for a specific album
    getSongRankingsForAlbum(albumId) {
      // In a real app, this would fetch from the database
      // For now, we'll check if we have any stored rankings
      const localStorageKey = `song_rankings_album_${albumId}`;
      try {
        const savedRankings = localStorage.getItem(localStorageKey);
        if (savedRankings) {
          return JSON.parse(savedRankings);
        }
      } catch (error) {
        console.error('Error loading song rankings from localStorage:', error);
      }
      return [];
    },

    // Update temporary song rankings (not saved to database yet)
    updateSongRankingsTemp(albumId, rankings) {
      // This is just for temporary state management
      // We'll store it in localStorage for persistence between page reloads
      const localStorageKey = `song_rankings_album_${albumId}`;
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(rankings));
      } catch (error) {
        console.error('Error saving song rankings to localStorage:', error);
      }
    },

    // Save song rankings to the database
    async saveSongRankings(albumId, rankings) {
      if (!rankings || rankings.length === 0) return false
      
      this.loading = true
      try {
        // Use Supabase to save song rankings
        const { error } = await supabase
          .from('user_song_rankings')
          .upsert(rankings.map(r => ({
            ...r,
            updated_at: new Date()
          })))
        
        if (error) throw error
        
        console.log('Song rankings saved to database successfully')
        this.error = null
        return true
      } catch (error) {
        this.error = error.message || 'Failed to save song rankings'
        console.error('Error saving song rankings:', error)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // Initialize with sample data for development
    initializeWithSampleData() {
      // Import the static albums data
      try {
        const staticAlbumsData = require('@/data/static-albums.json');
        this.initializeStaticAlbums(staticAlbumsData);
      } catch (error) {
        console.error('Error loading static albums data:', error);
        // Fallback to empty albums if the file can't be loaded
        this.availableAlbums = [];
        this.notEnoughAlbumsForLoop = true;
      }
    }
  }
})
