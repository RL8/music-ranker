/**
 * TypeScript definitions for Music Ranker database tables
 * Generated on 13 Apr 2025
 */

/**
 * Albums table type definition
 */
export interface Album {
  albumId: string;
  albumTitle?: string;
  releaseDate?: string;
  albumType?: string;
  eraId?: string;
}

/**
 * Artists table type definition
 */
export interface Artist {
  artistId?: string;
  artistName?: string;
}

/**
 * Eras table type definition
 */
export interface Era {
  eraId?: string;
  eraName?: string;
  primaryAlbumId?: string;
  eraStartDate?: string;
}

/**
 * Recordings table type definition
 */
export interface Recording {
  recordingId: string;
  recordingTitle?: string;
  songId?: string;
  albumId?: string;
  discNumber?: number;
  trackNumber?: number;
  versionType?: string;
  artistsJson?: any; // JSON array of artists
  notes?: string;
}

/**
 * Songs table type definition
 */
export interface Song {
  songId: string;
  canonicalTitle?: string;
  originalEraId?: string;
  notes?: string;
}

/**
 * Type definition for joined data between Albums and Songs
 */
export interface AlbumWithSongs extends Album {
  songs?: Song[];
}

/**
 * Type definition for joined data between Artists and Albums
 */
export interface ArtistWithAlbums extends Artist {
  albums?: Album[];
}

/**
 * Type definition for joined data between Songs and Recordings
 */
export interface SongWithRecordings extends Song {
  recordings?: Recording[];
}

/**
 * Database schema type containing all tables
 */
export interface Database {
  Albums: Album[];
  Artists: Artist[];
  Eras: Era[];
  Recordings: Recording[];
  Songs: Song[];
}
