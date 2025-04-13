import { supabase } from '../lib/supabase/client'

/**
 * Service for handling database operations with the new schema
 * Provides comprehensive access to all tables in the database
 */
export const databaseService = {
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
      const { 
        limit = 100, 
        orderBy = 'canonicalTitle', 
        ascending = true,
        eraId = null,
        withEras = false
      } = options
      
      try {
        // First, get the songs
        let query = supabase
          .from('UniqueSongs')
          .select('*')
        
        if (eraId) {
          query = query.eq('originalEraId', eraId)
        }
        
        query = query
          .order(orderBy, { ascending })
          .limit(limit)
        
        const { data: songs, error } = await query
        
        if (error) {
          console.error('Error fetching songs:', error)
          throw error
        }
        
        // If we need era information, fetch it separately
        if (withEras && songs.length > 0) {
          // Get unique era IDs from the songs
          const eraIds = [...new Set(songs.map(song => song.originalEraId))]
          
          // Fetch the eras
          const { data: eras, error: erasError } = await supabase
            .from('Eras')
            .select('*')
            .in('eraId', eraIds)
          
          if (erasError) {
            console.error('Error fetching eras:', erasError)
            throw erasError
          }
          
          // Combine the data
          return songs.map(song => {
            const era = eras.find(era => era.eraId === song.originalEraId)
            return {
              ...song,
              era: era || null
            }
          })
        }
        
        return songs
      } catch (error) {
        console.error('Error in songs.getAll:', error)
        throw error
      }
    },

    /**
     * Get a single song by ID
     * @param {string} id - Song ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      const { data, error } = await supabase
        .from('UniqueSongs')
        .select('*')
        .eq('songId', id)
        .single()
      
      if (error) {
        console.error(`Error fetching song ${id}:`, error)
        throw error
      }
      
      return data
    },

    /**
     * Get songs by era
     * @param {string} eraId - Era ID
     * @returns {Promise} - Query result
     */
    getByEra: async (eraId) => {
      const { data, error } = await supabase
        .from('UniqueSongs')
        .select('*')
        .eq('originalEraId', eraId)
        .order('canonicalTitle')
      
      if (error) {
        console.error(`Error fetching songs for era ${eraId}:`, error)
        throw error
      }
      
      return data
    },

    /**
     * Get songs with their recordings
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getWithRecordings: async (options = {}) => {
      const { limit = 50, songIds = [] } = options
      
      let query = supabase
        .from('UniqueSongs')
        .select(`
          *,
          Recordings(*)
        `)
        .limit(limit)
      
      if (songIds.length > 0) {
        query = query.in('songId', songIds)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching songs with recordings:', error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * Recordings related operations
   */
  recordings: {
    /**
     * Get all recordings with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { 
        limit = 100, 
        orderBy = 'recordingTitle', 
        ascending = true,
        albumId = null,
        songId = null,
        withSong = false,
        withAlbum = false,
        withEditions = false
      } = options
      
      let selectQuery = '*'
      
      if (withSong) {
        selectQuery += ', UniqueSongs(*)'
      }
      
      if (withAlbum) {
        selectQuery += ', Albums(*)'
      }
      
      if (withEditions) {
        selectQuery += ', RecordingEditions(*, Editions(*))'
      }
      
      let query = supabase
        .from('Recordings')
        .select(selectQuery)
      
      if (albumId) {
        query = query.eq('albumId', albumId)
      }
      
      if (songId) {
        query = query.eq('songId', songId)
      }
      
      query = query
        .order(orderBy, { ascending })
        .limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching recordings:', error)
        throw error
      }
      
      return data
    },

    /**
     * Get recordings by edition
     * @param {string} editionId - Edition ID
     * @returns {Promise} - Query result
     */
    getByEdition: async (editionId) => {
      const { data, error } = await supabase
        .from('RecordingEditions')
        .select(`
          *,
          Recordings(*),
          Editions(*)
        `)
        .eq('editionId', editionId)
      
      if (error) {
        console.error(`Error fetching recordings for edition ${editionId}:`, error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * Albums related operations
   */
  albums: {
    /**
     * Get all albums with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { 
        limit = 50, 
        orderBy = 'albumTitle', 
        ascending = true,
        eraId = null,
        withRecordings = false
      } = options
      
      let query = supabase
        .from('Albums')
        .select(withRecordings 
          ? '*, Recordings(*)' 
          : '*')
      
      if (eraId) {
        query = query.eq('eraId', eraId)
      }
      
      query = query
        .order(orderBy, { ascending })
        .limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching albums:', error)
        throw error
      }
      
      return data
    },

    /**
     * Get a single album by ID with its recordings
     * @param {string} id - Album ID
     * @returns {Promise} - Query result
     */
    getWithRecordings: async (id) => {
      const { data, error } = await supabase
        .from('Albums')
        .select(`
          *,
          Recordings(*)
        `)
        .eq('albumId', id)
        .single()
      
      if (error) {
        console.error(`Error fetching album ${id} with recordings:`, error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * Eras related operations
   */
  eras: {
    /**
     * Get all eras
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { orderBy = 'eraStartDate', ascending = true } = options
      
      const { data, error } = await supabase
        .from('Eras')
        .select('*')
        .order(orderBy, { ascending })
      
      if (error) {
        console.error('Error fetching eras:', error)
        throw error
      }
      
      return data
    },

    /**
     * Get era with its songs
     * @param {string} id - Era ID
     * @returns {Promise} - Query result
     */
    getWithSongs: async (id) => {
      const { data, error } = await supabase
        .from('Eras')
        .select(`
          *,
          UniqueSongs(*)
        `)
        .eq('eraId', id)
        .single()
      
      if (error) {
        console.error(`Error fetching era ${id} with songs:`, error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * Editions related operations
   */
  editions: {
    /**
     * Get all editions
     * @returns {Promise} - Query result
     */
    getAll: async () => {
      const { data, error } = await supabase
        .from('Editions')
        .select('*')
        .order('editionName')
      
      if (error) {
        console.error('Error fetching editions:', error)
        throw error
      }
      
      return data
    },

    /**
     * Get songs by edition
     * @param {string} editionId - Edition ID
     * @returns {Promise} - Query result with songs that have recordings in this edition
     */
    getSongs: async (editionId) => {
      try {
        // First, get the recording-edition relationships
        const { data: recordingEditions, error: relError } = await supabase
          .from('RecordingEditions')
          .select('*')
          .eq('editionId', editionId)
        
        if (relError) {
          console.error(`Error fetching recording editions for edition ${editionId}:`, relError)
          throw relError
        }
        
        if (!recordingEditions || recordingEditions.length === 0) {
          return []
        }
        
        // Get the recording IDs
        const recordingIds = recordingEditions.map(re => re.recordingId)
        
        // Get the recordings with their songs
        const { data: recordings, error: recError } = await supabase
          .from('Recordings')
          .select('*, songId')
          .in('recordingId', recordingIds)
        
        if (recError) {
          console.error(`Error fetching recordings for edition ${editionId}:`, recError)
          throw recError
        }
        
        if (!recordings || recordings.length === 0) {
          return []
        }
        
        // Get the unique song IDs
        const songIds = [...new Set(recordings.map(rec => rec.songId))]
        
        // Get the songs
        const { data: songs, error: songError } = await supabase
          .from('UniqueSongs')
          .select('*')
          .in('songId', songIds)
        
        if (songError) {
          console.error(`Error fetching songs for edition ${editionId}:`, songError)
          throw songError
        }
        
        return songs || []
      } catch (error) {
        console.error(`Error in editions.getSongs for edition ${editionId}:`, error)
        throw error
      }
    }
  }
}
