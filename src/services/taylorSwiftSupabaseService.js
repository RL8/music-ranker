import { supabase } from '../lib/supabase/client'
import { handleSupabaseError } from '../lib/supabase/client'

/**
 * Service for handling Taylor Swift data from Supabase
 * Uses the improved schema design with junction tables for song appearances
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
        orderBy = 'release_date', 
        ascending = true,
        era = null,
        isTaylorsVersion = null
      } = options
      
      try {
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
          return { error: `Error fetching albums: ${error.message}` }
        }
        
        return { data }
      } catch (error) {
        console.error('Unexpected error fetching albums:', error)
        return { error: 'Unexpected error fetching albums' }
      }
    },
    
    /**
     * Get a single album by ID
     * @param {string} id - Album ID
     * @returns {Promise} - Query result
     */
    getById: async (id) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_albums')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          return { error: `Error fetching album ${id}: ${error.message}` }
        }
        
        return { data }
      } catch (error) {
        console.error(`Unexpected error fetching album ${id}:`, error)
        return { error: `Unexpected error fetching album ${id}` }
      }
    },
    
    /**
     * Get albums by era
     * @param {string} era - Era name (e.g., "Taylor Swift", "Fearless", etc.)
     * @returns {Promise} - Query result
     */
    getByEra: async (era) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_albums')
          .select('*')
          .eq('era', era)
          .order('release_date', { ascending: true })
        
        if (error) {
          return { error: `Error fetching albums from era ${era}: ${error.message}` }
        }
        
        return { data }
      } catch (error) {
        console.error(`Unexpected error fetching albums from era ${era}:`, error)
        return { error: `Unexpected error fetching albums from era ${era}` }
      }
    },
    
    /**
     * Get a list of all unique eras
     * @returns {Promise} - Query result with unique eras
     */
    getAllEras: async () => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_albums')
          .select('era')
          .order('release_date', { ascending: true })
        
        if (error) {
          return { error: `Error fetching eras: ${error.message}` }
        }
        
        // Extract unique eras
        const uniqueEras = [...new Set(data.map(item => item.era))].filter(Boolean)
        return { data: uniqueEras }
      } catch (error) {
        console.error('Unexpected error fetching eras:', error)
        return { error: 'Unexpected error fetching eras' }
      }
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
        versionType = null
      } = options
      
      try {
        // If albumId is provided, we need to query through the junction table
        if (albumId) {
          const { data, error } = await supabase
            .from('taylor_swift_song_appearances')
            .select(`
              position,
              disc_number,
              version_type,
              taylor_swift_songs (
                id,
                title,
                duration_ms,
                explicit
              )
            `)
            .eq('album_id', albumId)
            .order('disc_number', { ascending: true })
            .order('position', { ascending: true })
            .limit(limit)
          
          if (error) {
            return { error: `Error fetching songs for album ${albumId}: ${error.message}` }
          }
          
          // Transform the data to a more usable format
          const songs = data.map(appearance => ({
            ...appearance.taylor_swift_songs,
            position: appearance.position,
            disc_number: appearance.disc_number,
            version_type: appearance.version_type,
            album_id: albumId
          }))
          
          return { data: songs }
        }
        
        // If no albumId, get all songs
        let query = supabase
          .from('taylor_swift_songs')
          .select('*')
          .order(orderBy, { ascending })
          .limit(limit)
        
        const { data, error } = await query
        
        if (error) {
          return { error: `Error fetching songs: ${error.message}` }
        }
        
        return { data }
      } catch (error) {
        console.error('Unexpected error fetching songs:', error)
        return { error: 'Unexpected error fetching songs' }
      }
    },
    
    /**
     * Get a single song by ID
     * @param {string} id - Song ID
     * @returns {Promise} - Query result with song and all its album appearances
     */
    getById: async (id) => {
      try {
        // First get the song details
        const { data: songData, error: songError } = await supabase
          .from('taylor_swift_songs')
          .select('*')
          .eq('id', id)
          .single()
        
        if (songError) {
          return { error: `Error fetching song ${id}: ${songError.message}` }
        }
        
        // Then get all album appearances
        const { data: appearancesData, error: appearancesError } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            taylor_swift_albums (
              id,
              title,
              era,
              release_date,
              is_taylors_version
            )
          `)
          .eq('song_id', id)
          .order('taylor_swift_albums(release_date)', { ascending: true })
        
        if (appearancesError) {
          return { error: `Error fetching appearances for song ${id}: ${appearancesError.message}` }
        }
        
        // Combine the data
        const result = {
          ...songData,
          appearances: appearancesData.map(appearance => ({
            position: appearance.position,
            disc_number: appearance.disc_number,
            version_type: appearance.version_type,
            album: appearance.taylor_swift_albums
          }))
        }
        
        return { data: result }
      } catch (error) {
        console.error(`Unexpected error fetching song ${id}:`, error)
        return { error: `Unexpected error fetching song ${id}` }
      }
    },
    
    /**
     * Get songs by album ID using the junction table
     * @param {string} albumId - Album ID
     * @returns {Promise} - Query result
     */
    getByAlbumId: async (albumId) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            taylor_swift_songs (
              id,
              title,
              duration_ms,
              explicit
            )
          `)
          .eq('album_id', albumId)
          .order('disc_number', { ascending: true })
          .order('position', { ascending: true })
        
        if (error) {
          return { error: `Error fetching songs for album ${albumId}: ${error.message}` }
        }
        
        // Transform the data to a more usable format
        const songs = data.map(appearance => ({
          ...appearance.taylor_swift_songs,
          position: appearance.position,
          disc_number: appearance.disc_number,
          version_type: appearance.version_type,
          album_id: albumId
        }))
        
        return { data: songs }
      } catch (error) {
        console.error(`Unexpected error fetching songs for album ${albumId}:`, error)
        return { error: `Unexpected error fetching songs for album ${albumId}` }
      }
    },
    
    /**
     * Get songs by era
     * @param {string} era - Era name
     * @returns {Promise} - Query result with songs and their albums
     */
    getByEra: async (era) => {
      try {
        // First get all albums in the era
        const { data: albumsData, error: albumsError } = await supabase
          .from('taylor_swift_albums')
          .select('id, title')
          .eq('era', era)
        
        if (albumsError) {
          return { error: `Error fetching albums for era ${era}: ${albumsError.message}` }
        }
        
        if (!albumsData.length) {
          return { data: [] }
        }
        
        // Get all song appearances for these albums
        const albumIds = albumsData.map(album => album.id)
        const { data: appearancesData, error: appearancesError } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            album_id,
            taylor_swift_songs (
              id,
              title,
              duration_ms,
              explicit
            )
          `)
          .in('album_id', albumIds)
          .order('album_id', { ascending: true })
          .order('disc_number', { ascending: true })
          .order('position', { ascending: true })
        
        if (appearancesError) {
          return { error: `Error fetching song appearances for era ${era}: ${appearancesError.message}` }
        }
        
        // Create a map of album IDs to album objects for quick lookup
        const albumMap = albumsData.reduce((map, album) => {
          map[album.id] = album
          return map
        }, {})
        
        // Transform the data to a more usable format
        const songs = appearancesData.map(appearance => ({
          ...appearance.taylor_swift_songs,
          position: appearance.position,
          disc_number: appearance.disc_number,
          version_type: appearance.version_type,
          album_id: appearance.album_id,
          album_title: albumMap[appearance.album_id]?.title
        }))
        
        return { data: songs }
      } catch (error) {
        console.error(`Unexpected error fetching songs for era ${era}:`, error)
        return { error: `Unexpected error fetching songs for era ${era}` }
      }
    },
    
    /**
     * Get all albums that a song appears on
     * @param {string} songId - Song ID
     * @returns {Promise} - Query result
     */
    getAlbumsForSong: async (songId) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            taylor_swift_albums (
              id,
              title,
              era,
              release_date,
              is_taylors_version
            )
          `)
          .eq('song_id', songId)
          .order('taylor_swift_albums(release_date)', { ascending: true })
        
        if (error) {
          return { error: `Error fetching albums for song ${songId}: ${error.message}` }
        }
        
        // Transform the data to a more usable format
        const albums = data.map(appearance => ({
          ...appearance.taylor_swift_albums,
          position: appearance.position,
          disc_number: appearance.disc_number,
          version_type: appearance.version_type
        }))
        
        return { data: albums }
      } catch (error) {
        console.error(`Unexpected error fetching albums for song ${songId}:`, error)
        return { error: `Unexpected error fetching albums for song ${songId}` }
      }
    },
    
    /**
     * Get all songs that appear on multiple albums
     * @param {Object} options - Query options
     * @param {number} options.limit - Maximum number of songs to return
     * @returns {Promise} - Query result
     */
    getSongsOnMultipleAlbums: async (options = {}) => {
      const { limit = 100 } = options
      
      try {
        // This query finds songs that appear in more than one album
        const { data, error } = await supabase
          .rpc('get_songs_on_multiple_albums', { limit_count: limit })
        
        if (error) {
          // If the function doesn't exist, we need to create it
          if (error.message && error.message.includes('function "get_songs_on_multiple_albums" does not exist')) {
            // We'll need to create this function in our SQL schema
            return { error: 'The required database function does not exist yet. Please run the schema setup script.' }
          }
          
          return { error: `Error fetching songs on multiple albums: ${error.message}` }
        }
        
        return { data }
      } catch (error) {
        console.error('Unexpected error fetching songs on multiple albums:', error)
        return { error: 'Unexpected error fetching songs on multiple albums' }
      }
    },
    
    /**
     * Rate a song
     * @param {string} songId - Song ID
     * @param {string} userId - User ID
     * @param {number} rating - Rating (1-10)
     * @returns {Promise} - Result of the operation
     */
    rateSong: async (songId, userId, rating) => {
      try {
        // Validate the rating
        if (rating < 1 || rating > 10) {
          return { error: 'Rating must be between 1 and 10' }
        }
        
        // Check if the user has already rated this song
        const { data: existingRating, error: checkError } = await supabase
          .from('taylor_swift_song_ratings')
          .select('id')
          .eq('song_id', songId)
          .eq('user_id', userId)
          .single()
        
        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
          return { error: `Error checking existing rating: ${checkError.message}` }
        }
        
        let result
        
        if (existingRating) {
          // Update existing rating
          result = await supabase
            .from('taylor_swift_song_ratings')
            .update({ rating, updated_at: new Date() })
            .eq('id', existingRating.id)
        } else {
          // Create new rating
          result = await supabase
            .from('taylor_swift_song_ratings')
            .insert([
              { song_id: songId, user_id: userId, rating }
            ])
        }
        
        if (result.error) {
          return { error: `Error saving rating: ${result.error.message}` }
        }
        
        return { success: true }
      } catch (error) {
        console.error(`Unexpected error rating song ${songId}:`, error)
        return { error: `Unexpected error rating song ${songId}` }
      }
    },
    
    /**
     * Get a user's rating for a song
     * @param {string} songId - Song ID
     * @param {string} userId - User ID
     * @returns {Promise} - Query result
     */
    getUserRating: async (songId, userId) => {
      try {
        const { data, error } = await supabase
          .from('taylor_swift_song_ratings')
          .select('rating')
          .eq('song_id', songId)
          .eq('user_id', userId)
          .single()
        
        if (error) {
          if (error.code === 'PGRST116') { // No rows returned
            return { data: null }
          }
          return { error: `Error fetching rating: ${error.message}` }
        }
        
        return { data: data.rating }
      } catch (error) {
        console.error(`Unexpected error fetching rating for song ${songId}:`, error)
        return { error: `Unexpected error fetching rating for song ${songId}` }
      }
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
        // Get albums (filtered by era if provided)
        const albumsQuery = supabase
          .from('taylor_swift_albums')
          .select('id, title, era, release_date')
          .order('release_date', { ascending: true })
        
        if (era) {
          albumsQuery.eq('era', era)
        }
        
        const { data: albums, error: albumsError } = await albumsQuery
        
        if (albumsError) {
          return { error: `Error fetching albums for visualization: ${albumsError.message}` }
        }
        
        // Get songs for each album
        const albumsWithSongs = await Promise.all(
          albums.map(async (album) => {
            const { data: songs, error: songsError } = await supabase
              .from('taylor_swift_song_appearances')
              .select(`
                position,
                disc_number,
                version_type,
                taylor_swift_songs (
                  id,
                  title,
                  duration_ms
                )
              `)
              .eq('album_id', album.id)
              .order('disc_number', { ascending: true })
              .order('position', { ascending: true })
            
            if (songsError) {
              console.error(`Error fetching songs for album ${album.id}:`, songsError)
              return {
                ...album,
                songs: []
              }
            }
            
            // Transform the songs data
            const formattedSongs = songs.map(appearance => ({
              id: appearance.taylor_swift_songs.id,
              title: appearance.taylor_swift_songs.title,
              duration_ms: appearance.taylor_swift_songs.duration_ms,
              position: appearance.position,
              disc_number: appearance.disc_number,
              version_type: appearance.version_type
            }))
            
            return {
              ...album,
              songs: formattedSongs
            }
          })
        )
        
        // Format the data for sunburst visualization
        const sunburstData = formatForSunburst(albumsWithSongs, era)
        return { data: sunburstData }
      } catch (error) {
        console.error('Unexpected error generating sunburst data:', error)
        return { error: 'Unexpected error generating sunburst data' }
      }
    },
    
    /**
     * Get album songs formatted for visualization
     * @param {string} albumId - Album ID
     * @returns {Promise} - Array of songs
     */
    getAlbumSongsForVisualization: async (albumId) => {
      try {
        // Get the album details
        const { data: album, error: albumError } = await supabase
          .from('taylor_swift_albums')
          .select('id, title, era, release_date')
          .eq('id', albumId)
          .single()
        
        if (albumError) {
          return { error: `Error fetching album ${albumId}: ${albumError.message}` }
        }
        
        // Get the songs for this album
        const { data: songs, error: songsError } = await supabase
          .from('taylor_swift_song_appearances')
          .select(`
            position,
            disc_number,
            version_type,
            taylor_swift_songs (
              id,
              title,
              duration_ms
            )
          `)
          .eq('album_id', albumId)
          .order('disc_number', { ascending: true })
          .order('position', { ascending: true })
        
        if (songsError) {
          return { error: `Error fetching songs for album ${albumId}: ${songsError.message}` }
        }
        
        // Transform the songs data
        const formattedSongs = songs.map(appearance => ({
          id: appearance.taylor_swift_songs.id,
          title: appearance.taylor_swift_songs.title,
          duration_ms: appearance.taylor_swift_songs.duration_ms,
          position: appearance.position,
          disc_number: appearance.disc_number,
          version_type: appearance.version_type
        }))
        
        // Format for visualization
        const result = {
          album: album,
          songs: formattedSongs
        }
        
        return { data: result }
      } catch (error) {
        console.error(`Unexpected error fetching visualization data for album ${albumId}:`, error)
        return { error: `Unexpected error fetching visualization data for album ${albumId}` }
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
  // Group albums by era
  const albumsByEra = albumsWithSongs.reduce((acc, album) => {
    if (!acc[album.era]) {
      acc[album.era] = []
    }
    acc[album.era].push(album)
    return acc
  }, {})
  
  // If a specific era is requested, only include that era
  const eras = era ? [era] : Object.keys(albumsByEra).sort()
  
  // Create the root node
  const root = {
    name: 'Taylor Swift',
    children: eras.map(eraName => ({
      name: eraName,
      children: albumsByEra[eraName].map(album => ({
        name: album.title,
        children: album.songs.map(song => ({
          name: song.title,
          value: song.duration_ms / 1000, // Convert to seconds for better visualization
          songId: song.id
        }))
      }))
    }))
  }
  
  return root
}

export default taylorSwiftSupabaseService
