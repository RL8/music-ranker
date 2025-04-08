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
    error: null
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
    }
  }
})
