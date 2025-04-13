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
    notEnoughAlbumsForLoop: false, // Flag to disable loop mode
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
          
          // Only set availableAlbums if there are enough albums to prevent Swiper loop warnings
          if (albumsData.length >= 3) {
            this.availableAlbums = [...albumsData];
          } else {
            // If there aren't enough albums, disable loop mode by adding a flag
            this.availableAlbums = [...albumsData];
            this.notEnoughAlbumsForLoop = true;
          }
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
    saveSongRankings(albumId, rankings) {
      // In a real app, this would save to the database
      // For now, we'll just store in localStorage
      this.updateSongRankingsTemp(albumId, rankings);
      
      // Show success in console
      console.log(`Saved ${rankings.length} song rankings for album ${albumId}`);
      return true;
    },

    // Initialize with sample data for development
    initializeWithSampleData() {
      const sampleAlbums = [
        { 
          id: 1, 
          title: "Taylor Swift", 
          year: 2006, 
          color: "#7B9095", 
          bgColor: "#e8f0f2",
          textColor: "#2d4047",
          coverImageUrl: "https://placehold.co/300x300/7B9095/FFFFFF?text=Taylor+Swift",
          emoji: "🤠",
          era: "Country Era",
          songs: [
            { id: "1-1", title: "Tim McGraw", duration: "3:52" },
            { id: "1-2", title: "Picture to Burn", duration: "2:55" },
            { id: "1-3", title: "Teardrops on My Guitar", duration: "3:35" },
            { id: "1-4", title: "A Place in This World", duration: "3:22" },
            { id: "1-5", title: "Cold as You", duration: "4:01" },
            { id: "1-6", title: "The Outside", duration: "3:29" },
            { id: "1-7", title: "Tied Together with a Smile", duration: "4:11" },
            { id: "1-8", title: "Stay Beautiful", duration: "3:58" },
            { id: "1-9", title: "Should've Said No", duration: "4:04" },
            { id: "1-10", title: "Mary's Song (Oh My My My)", duration: "3:35" },
            { id: "1-11", title: "Our Song", duration: "3:22" }
          ]
        },
        { 
          id: 2, 
          title: "Fearless", 
          year: 2008, 
          color: "#C9B870", 
          bgColor: "#fff9e6",
          textColor: "#8f7c24",
          coverImageUrl: "https://placehold.co/300x300/C9B870/FFFFFF?text=Fearless",
          emoji: "✨",
          era: "Fearless Era",
          songs: [
            { id: "2-1", title: "Fearless", duration: "4:01" },
            { id: "2-2", title: "Fifteen", duration: "4:54" },
            { id: "2-3", title: "Love Story", duration: "3:55" },
            { id: "2-4", title: "Hey Stephen", duration: "4:14" },
            { id: "2-5", title: "White Horse", duration: "3:54" },
            { id: "2-6", title: "You Belong with Me", duration: "3:52" },
            { id: "2-7", title: "Breathe", duration: "4:23" },
            { id: "2-8", title: "Tell Me Why", duration: "3:20" },
            { id: "2-9", title: "You're Not Sorry", duration: "4:21" },
            { id: "2-10", title: "The Way I Loved You", duration: "4:04" },
            { id: "2-11", title: "Forever & Always", duration: "3:45" },
            { id: "2-12", title: "The Best Day", duration: "4:05" },
            { id: "2-13", title: "Change", duration: "4:40" }
          ]
        },
        { 
          id: 3, 
          title: "Speak Now", 
          year: 2010, 
          color: "#A95564", 
          bgColor: "#f9ecef",
          textColor: "#6d2936",
          coverImageUrl: "https://placehold.co/300x300/A95564/FFFFFF?text=Speak+Now",
          emoji: "💜",
          era: "Speak Now Era",
          songs: [
            { id: "3-1", title: "Mine", duration: "3:50" },
            { id: "3-2", title: "Sparks Fly", duration: "4:20" },
            { id: "3-3", title: "Back to December", duration: "4:53" },
            { id: "3-4", title: "Speak Now", duration: "4:00" },
            { id: "3-5", title: "Dear John", duration: "6:43" },
            { id: "3-6", title: "Mean", duration: "3:57" },
            { id: "3-7", title: "The Story of Us", duration: "4:25" },
            { id: "3-8", title: "Never Grow Up", duration: "4:50" },
            { id: "3-9", title: "Enchanted", duration: "5:52" },
            { id: "3-10", title: "Better Than Revenge", duration: "3:37" },
            { id: "3-11", title: "Innocent", duration: "5:02" },
            { id: "3-12", title: "Haunted", duration: "4:02" },
            { id: "3-13", title: "Last Kiss", duration: "6:07" },
            { id: "3-14", title: "Long Live", duration: "5:17" }
          ]
        }
      ];
      
      this.initializeStaticAlbums(sampleAlbums);
    }
  }
})
