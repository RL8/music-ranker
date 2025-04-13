import { databaseService } from './databaseService'

/**
 * Data Adapter Service
 * 
 * This service provides a consistent interface for data access,
 * allowing for a smooth transition from static JSON data to the database.
 * It transforms database records to match the format expected by the application.
 */
export const dataAdapter = {
  /**
   * Get all songs with transformations to match the expected format
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Transformed songs
   */
  getSongs: async (options = {}) => {
    try {
      const songs = await databaseService.songs.getAll(options)
      
      // Transform database records to match the expected format in the app
      return songs.map(song => ({
        id: song.songId,
        title: song.canonicalTitle,
        era: song.originalEraId,
        // Add any other transformations needed
        ...song
      }))
    } catch (error) {
      console.error('Error in dataAdapter.getSongs:', error)
      throw error
    }
  },
  
  /**
   * Get songs grouped by era
   * @returns {Promise<Object>} - Songs grouped by era
   */
  getSongsByEra: async () => {
    try {
      // Get all eras and songs
      const eras = await databaseService.eras.getAll({ ascending: true })
      const songs = await databaseService.songs.getAll({ withEras: true })
      
      // Group songs by era
      const songsByEra = eras.map(era => {
        const eraSongs = songs.filter(song => song.originalEraId === era.eraId)
        
        return {
          era: era.eraName,
          eraId: era.eraId,
          songs: eraSongs.map(song => ({
            id: song.songId,
            title: song.canonicalTitle,
            // Add any other transformations needed
            ...song
          }))
        }
      })
      
      return songsByEra
    } catch (error) {
      console.error('Error in dataAdapter.getSongsByEra:', error)
      throw error
    }
  },
  
  /**
   * Get all albums with their recordings
   * @returns {Promise<Array>} - Transformed albums with recordings
   */
  getAlbums: async () => {
    try {
      const albums = await databaseService.albums.getAll({ withRecordings: true })
      
      // Transform database records to match the expected format in the app
      return albums.map(album => ({
        id: album.albumId,
        title: album.albumTitle,
        releaseDate: album.releaseDate,
        // Transform recordings
        tracks: album.Recordings?.map(recording => ({
          id: recording.recordingId,
          title: recording.recordingTitle,
          trackNumber: recording.trackNumber,
          discNumber: recording.discNumber,
          songId: recording.songId,
          // Add any other transformations needed
          ...recording
        })) || [],
        // Add any other transformations needed
        ...album
      }))
    } catch (error) {
      console.error('Error in dataAdapter.getAlbums:', error)
      throw error
    }
  },
  
  /**
   * Get songs by edition
   * @param {string} editionName - Edition name (e.g., 'Vault', 'Deluxe')
   * @returns {Promise<Array>} - Songs in the specified edition
   */
  getSongsByEdition: async (editionName) => {
    try {
      // Get all editions
      const editions = await databaseService.editions.getAll()
      
      // Find the edition ID by name
      const edition = editions.find(e => 
        e.editionName.toLowerCase() === editionName.toLowerCase()
      )
      
      if (!edition) {
        throw new Error(`Edition "${editionName}" not found`)
      }
      
      // Get songs for this edition
      const songs = await databaseService.editions.getSongs(edition.editionId)
      
      // Transform to expected format
      return songs.map(song => ({
        id: song.songId,
        title: song.canonicalTitle,
        // Add any other transformations needed
        ...song
      }))
    } catch (error) {
      console.error(`Error in dataAdapter.getSongsByEdition(${editionName}):`, error)
      throw error
    }
  },
  
  /**
   * Get all vault songs
   * @returns {Promise<Array>} - Vault songs
   */
  getVaultSongs: async () => {
    return dataAdapter.getSongsByEdition('Vault')
  }
}
