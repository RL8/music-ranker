import { defineStore } from 'pinia'
// Import supabase client when needed
// import { supabase } from '@/lib/supabase/client'

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
    // Local storage key for persisting rankings
    localStorageKey: 'swifties_album_rankings'
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
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('user_album_rankings')
        //   .select('*')
        //   .eq('user_id', userId)
        
        // if (error) throw error
        // this.albumRankings = data
        
        // Placeholder for now
        console.log('Fetching album rankings for user:', userId)
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
        // This will be implemented with actual Supabase logic
        // let query = supabase
        //   .from('user_song_rankings')
        //   .select('*')
        //   .eq('user_id', userId)
        
        // if (albumContextId) {
        //   query = query.eq('album_context_id', albumContextId)
        // }
        
        // const { data, error } = await query
        
        // if (error) throw error
        // this.songRankings = data
        
        // Placeholder for now
        console.log('Fetching song rankings for user:', userId, 'album:', albumContextId)
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
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('user_album_rankings')
        //   .upsert({
        //     user_id: albumRanking.user_id,
        //     album_id: albumRanking.album_id,
        //     tier: albumRanking.tier,
        //     rank_in_tier: albumRanking.rank_in_tier,
        //     updated_at: new Date()
        //   })
        //   .select()
        
        // if (error) throw error
        
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
            id: Date.now().toString(), // Temporary ID until we get the real one from the server
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        // Placeholder for now
        console.log('Ranking album:', albumRanking)
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
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('user_song_rankings')
        //   .upsert({
        //     user_id: songRanking.user_id,
        //     song_id: songRanking.song_id,
        //     album_context_id: songRanking.album_context_id,
        //     tier: songRanking.tier,
        //     rank_in_tier: songRanking.rank_in_tier,
        //     updated_at: new Date()
        //   })
        //   .select()
        
        // if (error) throw error
        
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
            id: Date.now().toString(), // Temporary ID until we get the real one from the server
            created_at: new Date(),
            updated_at: new Date()
          })
        }
        
        // Placeholder for now
        console.log('Ranking song:', songRanking)
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
        
        // This will be implemented with actual Supabase logic
        // const { data, error } = await supabase
        //   .from('ranking_history')
        //   .insert({
        //     user_id: userId,
        //     ranking_type: rankingType,
        //     rankings_snapshot: snapshotData,
        //     created_at: new Date()
        //   })
        //   .select()
        
        // if (error) throw error
        
        // Placeholder for now
        console.log('Saving ranking snapshot:', {
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
      // Only initialize if availableAlbums is empty to prevent overwriting during navigation
      if (this.availableAlbums.length === 0) {
        // First try to load from localStorage
        this.loadRankingsFromLocalStorage();
        
        // If we still don't have any ranked albums, initialize with static data
        if (this.availableAlbums.length === 0 && 
            this.rankedTiers.tier1.length === 0 && 
            this.rankedTiers.tier2.length === 0 && 
            this.rankedTiers.tier3.length === 0 && 
            this.rankedTiers.tier4.length === 0 && 
            this.rankedTiers.tier5.length === 0) {
          
          this.availableAlbums = [...albumsData];
          // Clear tiers just in case
          this.rankedTiers = { tier1: [], tier2: [], tier3: [], tier4: [], tier5: [] };
        }
      }
    },
    
    // Save rankings to localStorage for persistence
    saveRankingsToLocalStorage() {
      try {
        const rankings = {
          availableAlbums: this.availableAlbums,
          rankedTiers: this.rankedTiers,
          timestamp: new Date().toISOString()
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
          const { availableAlbums, rankedTiers } = JSON.parse(savedRankings);
          this.availableAlbums = availableAlbums;
          this.rankedTiers = rankedTiers;
          return true;
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
      if (!userId) return;
      
      this.loading = true;
      try {
        const flatRankings = this.convertRankingsToApiFormat(userId);
        
        // For each ranking, call the existing rankAlbum method
        for (const ranking of flatRankings) {
          await this.rankAlbum(ranking);
        }
        
        console.log('Rankings saved to API');
        this.error = null;
        return true;
      } catch (error) {
        this.error = error.message || 'Failed to save rankings';
        console.error('Error saving rankings to API:', error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
})
