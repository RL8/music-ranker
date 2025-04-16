import { databaseService } from './databaseService'

/**
 * Data Adapter Service
 * 
 * This service provides a consistent interface for data access,
 * allowing for a smooth transition from static JSON data to the database.
 * It transforms database records to match the format expected by the application.
 * Enhanced for era-centric approach.
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
        songId: song.songId, // Include both for compatibility
        title: song.canonicalTitle,
        canonicalTitle: song.canonicalTitle,
        era: song.originalEraId,
        originalEraId: song.originalEraId,
        notes: song.notes || '',
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
      // Use the enhanced method from databaseService
      const songsByEraGroups = await databaseService.songs.getByEraGrouped()
      
      // Transform to match expected format
      return songsByEraGroups.map(group => ({
        era: group.eraName,
        eraName: group.eraName,
        eraId: group.eraId,
        eraStartDate: group.eraStartDate,
        primaryAlbumId: group.primaryAlbumId,
        songs: group.songs.map(song => ({
          id: song.songId,
          songId: song.songId,
          title: song.canonicalTitle,
          canonicalTitle: song.canonicalTitle,
          notes: song.notes || '',
          originalEraId: group.eraId
        }))
      }))
    } catch (error) {
      console.error('Error in dataAdapter.getSongsByEra:', error)
      throw error
    }
  },
  
  /**
   * Get albums grouped by era
   * @returns {Promise<Object>} - Albums grouped by era
   */
  getAlbumsByEra: async () => {
    try {
      // Use the enhanced method from databaseService
      const albumsByEraGroups = await databaseService.albums.getByEraGrouped()
      
      // Transform to match expected format
      return albumsByEraGroups.map(group => ({
        era: group.eraName,
        eraName: group.eraName,
        eraId: group.eraId,
        eraStartDate: group.eraStartDate,
        primaryAlbumId: group.primaryAlbumId,
        albums: group.albums.map(album => ({
          id: album.albumId,
          albumId: album.albumId,
          title: album.albumTitle,
          albumTitle: album.albumTitle,
          releaseDate: album.releaseDate,
          albumType: album.albumType,
          isPrimaryAlbum: album.isPrimaryAlbum,
          eraId: group.eraId
        }))
      }))
    } catch (error) {
      console.error('Error in dataAdapter.getAlbumsByEra:', error)
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
        albumId: album.albumId,
        title: album.albumTitle,
        albumTitle: album.albumTitle,
        releaseDate: album.releaseDate,
        eraId: album.eraId,
        albumType: album.albumType,
        coverImageUrl: album.coverImageUrl || '',
        // Transform recordings
        tracks: album.Recordings?.map(recording => ({
          id: recording.recordingId,
          recordingId: recording.recordingId,
          title: recording.recordingTitle,
          recordingTitle: recording.recordingTitle,
          trackNumber: recording.trackNumber,
          discNumber: recording.discNumber,
          songId: recording.songId,
          albumId: album.albumId,
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
   * Get a complete era with its albums and songs
   * @param {string} eraId - Era ID
   * @returns {Promise<Object>} - Complete era data
   */
  getCompleteEra: async (eraId) => {
    try {
      const era = await databaseService.eras.getComplete(eraId)
      
      if (!era) {
        throw new Error(`Era with ID "${eraId}" not found`)
      }
      
      // Transform to expected format
      return {
        id: era.eraId,
        eraId: era.eraId,
        name: era.eraName,
        eraName: era.eraName,
        startDate: era.eraStartDate,
        eraStartDate: era.eraStartDate,
        endDate: era.eraEndDate,
        eraEndDate: era.eraEndDate,
        primaryAlbumId: era.primaryAlbumId,
        description: era.description || '',
        coverImageUrl: era.coverImageUrl || '',
        // Transform albums
        albums: era.Albums?.map(album => ({
          id: album.albumId,
          albumId: album.albumId,
          title: album.albumTitle,
          albumTitle: album.albumTitle,
          releaseDate: album.releaseDate,
          albumType: album.albumType,
          isPrimaryAlbum: album.albumId === era.primaryAlbumId,
          coverImageUrl: album.coverImageUrl || '',
          eraId: era.eraId
        })) || [],
        // Transform songs
        songs: era.songs?.map(song => ({
          id: song.songId,
          songId: song.songId,
          title: song.canonicalTitle,
          canonicalTitle: song.canonicalTitle,
          notes: song.notes || '',
          originalEraId: era.eraId
        })) || []
      }
    } catch (error) {
      console.error(`Error in dataAdapter.getCompleteEra(${eraId}):`, error)
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
        songId: song.songId,
        title: song.canonicalTitle,
        canonicalTitle: song.canonicalTitle,
        era: song.originalEraId,
        originalEraId: song.originalEraId,
        notes: song.notes || '',
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
