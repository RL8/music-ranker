import { supabase } from '../lib/supabase/client'

/**
 * Service for handling Taylor Swift data from Supabase
 * Extends the existing supabaseService with Taylor Swift specific operations
 */
export const taylorSwiftSupabaseService = {
  /**
   * Album related operations
   */
  albums: {
    /**
     * Get all Taylor Swift albums with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { 
        limit = 100, 
        orderBy = 'first_release_date', 
        ascending = true,
        era = null,
        isTaylorsVersion = null
      } = options
      
      let query = supabase
        .from('taylor_swift_albums')
        .select('*')
        .order(orderBy, { ascending })
      
      // Apply filters if provided
      if (era) {
        query = query.eq('era', era)
      }
      
      if (isTaylorsVersion !== null) {
        query = query.eq('is_taylors_version', isTaylorsVersion)
      }
      
      // Apply limit
      query = query.limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching Taylor Swift albums:', error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get a single album by ID
     * @param {string} id - Album ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      const { data, error } = await supabase
        .from('taylor_swift_albums')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error(`Error fetching Taylor Swift album with ID ${id}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get albums by era
     * @param {string} era - Era name (e.g., "Taylor Swift", "Fearless", etc.)
     * @returns {Promise} - Query result
     */
    getByEra: async (era) => {
      const { data, error } = await supabase
        .from('taylor_swift_albums')
        .select('*')
        .eq('era', era)
        .order('first_release_date', { ascending: true })
      
      if (error) {
        console.error(`Error fetching Taylor Swift albums from ${era} era:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get a list of all unique eras
     * @returns {Promise} - Query result with unique eras
     */
    getAllEras: async () => {
      const { data, error } = await supabase
        .from('taylor_swift_albums')
        .select('era')
        .order('first_release_date', { ascending: true })
      
      if (error) {
        console.error('Error fetching Taylor Swift eras:', error)
        throw error
      }
      
      // Extract unique eras
      const uniqueEras = [...new Set(data.map(item => item.era))].filter(Boolean)
      return uniqueEras
    }
  },
  
  /**
   * Song related operations
   */
  songs: {
    /**
     * Get all Taylor Swift songs with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise} - Query result
     */
    getAll: async (options = {}) => {
      const { 
        limit = 100, 
        orderBy = 'title', 
        ascending = true,
        albumId = null,
        isTaylorsVersion = null,
        isFromVault = null
      } = options
      
      let query = supabase
        .from('taylor_swift_songs')
        .select(`
          *,
          taylor_swift_albums (
            id,
            title,
            era,
            first_release_date
          )
        `)
        .order(orderBy, { ascending })
      
      // Apply filters if provided
      if (albumId) {
        query = query.eq('album_id', albumId)
      }
      
      if (isTaylorsVersion !== null) {
        query = query.eq('is_taylors_version', isTaylorsVersion)
      }
      
      if (isFromVault !== null) {
        query = query.eq('is_from_vault', isFromVault)
      }
      
      // Apply limit
      query = query.limit(limit)
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching Taylor Swift songs:', error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get a single song by ID
     * @param {string} id - Song ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      const { data, error } = await supabase
        .from('taylor_swift_songs')
        .select(`
          *,
          taylor_swift_albums (
            id,
            title,
            era,
            first_release_date
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error(`Error fetching Taylor Swift song with ID ${id}:`, error)
        throw error
      }
      
      return data
    },
    
    /**
     * Get songs by album ID
     * @param {string} albumId - Album ID
     * @returns {Promise} - Query result
     */
    getByAlbumId: async (albumId) => {
      const { data, error } = await supabase
        .from('taylor_swift_song_appearances')
        .select(`
          position,
          disc_number,
          is_bonus_track,
          version_type,
          taylor_swift_songs (*)
        `)
        .eq('album_id', albumId)
        .order('disc_number')
        .order('position')
      
      if (error) {
        console.error(`Error fetching Taylor Swift songs for album ${albumId}:`, error)
        throw error
      }
      
      // Format the response to be more usable
      return data.map(item => ({
        ...item.taylor_swift_songs,
        position: item.position,
        disc_number: item.disc_number,
        is_bonus_track: item.is_bonus_track,
        version_type: item.version_type
      }))
    },
    
    /**
     * Get songs by era
     * @param {string} era - Era name
     * @returns {Promise} - Query result with songs and their albums
     */
    getByEra: async (era) => {
      // First get all albums from this era
      const { data: albums, error: albumsError } = await supabase
        .from('taylor_swift_albums')
        .select('id')
        .eq('era', era)
      
      if (albumsError) {
        console.error(`Error fetching Taylor Swift albums from era ${era}:`, albumsError)
        throw albumsError
      }
      
      if (!albums.length) {
        return []
      }
      
      // Get all songs that appear on these albums
      const albumIds = albums.map(album => album.id)
      
      const { data, error } = await supabase
        .from('taylor_swift_song_appearances')
        .select(`
          position,
          disc_number,
          taylor_swift_songs (*),
          taylor_swift_albums (id, title)
        `)
        .in('album_id', albumIds)
        .order('position')
      
      if (error) {
        console.error(`Error fetching Taylor Swift songs from era ${era}:`, error)
        throw error
      }
      
      // Format the response to be more usable
      return data.map(item => ({
        ...item.taylor_swift_songs,
        position: item.position,
        disc_number: item.disc_number,
        album: item.taylor_swift_albums
      }))
    },
    
    /**
     * Get all albums that a song appears on
     * @param {string} songId - Song ID
     * @returns {Promise} - Query result
     */
    getAlbumsForSong: async (songId) => {
      const { data, error } = await supabase
        .from('taylor_swift_song_appearances')
        .select(`
          album_id,
          position,
          disc_number,
          version_type,
          taylor_swift_albums (*)
        `)
        .eq('song_id', songId)
        .order('position')
      
      if (error) {
        console.error(`Error fetching albums for song ID ${songId}:`, error)
        throw error
      }
      
      // Format the response to be more usable
      return data.map(item => ({
        ...item.taylor_swift_albums,
        position: item.position,
        disc_number: item.disc_number,
        version_type: item.version_type
      }))
    },
    
    /**
     * Get all songs that appear on multiple albums
     * @param {Object} options - Query options
     * @param {number} options.limit - Maximum number of songs to return
     * @returns {Promise} - Query result
     */
    getSongsOnMultipleAlbums: async (options = {}) => {
      const { limit = 50 } = options
      
      // This complex query counts appearances and returns songs on multiple albums
      const { data, error } = await supabase
        .rpc('get_songs_on_multiple_albums', { limit_count: limit })
      
      if (error) {
        console.error('Error fetching songs on multiple albums:', error)
        throw error
      }
      
      return data
    }
  },
  
  /**
   * Data for visualizations
   */
  visualizations: {
    /**
     * Get data structured for sunburst visualization
     * @param {string} era - Optional era to filter by
     * @returns {Promise} - Data in sunburst format
     */
    getSunburstData: async (era = null) => {
      try {
        // Get albums, filtered by era if specified
        let albumsQuery = supabase
          .from('taylor_swift_albums')
          .select('*')
          .order('first_release_date', { ascending: true })
        
        if (era) {
          albumsQuery = albumsQuery.eq('era', era)
        }
        
        const { data: albums, error: albumsError } = await albumsQuery
        
        if (albumsError) throw albumsError
        
        // For each album, get its songs
        const albumsWithSongs = await Promise.all(
          albums.map(async (album) => {
            const songs = await taylorSwiftSupabaseService.songs.getAlbumSongsForVisualization(album.id)
            return {
              ...album,
              songs
            }
          })
        )
        
        // Format data for sunburst visualization
        return formatForSunburst(albumsWithSongs, era)
        
      } catch (error) {
        console.error('Error getting sunburst data:', error)
        throw error
      }
    },
    
    /**
     * Get album songs formatted for visualization
     * @param {string} albumId - Album ID
     * @returns {Promise} - Array of songs
     */
    getAlbumSongsForVisualization: async (albumId) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            taylor_swift_songs (id, title, length_ms)
          `)
          .eq('album_id', albumId)
          .order('disc_number')
          .order('position')
        
        if (error) throw error
        
        // Format songs for visualization
        return data.map(item => ({
          id: item.taylor_swift_songs.id,
          title: item.taylor_swift_songs.title,
          position: item.position,
          disc_number: item.disc_number,
          length_ms: item.taylor_swift_songs.length_ms,
          version_type: item.version_type
        }))
        
      } catch (error) {
        console.error(`Error getting songs for album ${albumId}:`, error)
        throw error
      }
    }
  }
}

/**
 * Format albums and songs for sunburst visualization
 * @param {Array} albumsWithSongs - Albums with their songs
 * @param {string} era - Optional era name for the root node
 * @returns {Object} - Hierarchical data structure for sunburst
 */
function formatForSunburst(albumsWithSongs, era = null) {
  // If era is specified, use it as the root name
  const rootName = era ? `Taylor Swift - ${era}` : 'Taylor Swift'
  
  return {
    name: rootName,
    children: albumsWithSongs.map(album => ({
      name: album.title,
      children: album.songs.map(song => ({
        name: song.title,
        size: song.length_ms || 100  // Use song length or default value
      }))
    }))
  }
}

export default taylorSwiftSupabaseService
