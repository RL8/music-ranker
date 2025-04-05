/**
 * Playlist Service
 * 
 * This service handles the creation and management of custom playlists and rankings.
 * It supports multiple user-created lists with different rankings of the same songs.
 */

import { supabase } from '@/lib/supabase/client';

/**
 * Create a new playlist
 * @param {string} name - Name of the playlist
 * @param {string} description - Description of the playlist
 * @param {boolean} isPublic - Whether the playlist is public
 * @returns {Promise<Object>} The created playlist
 */
export async function createPlaylist(name, description = '', isPublic = false) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: user.user.id,
        name,
        description,
        is_public: isPublic
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

/**
 * Get all playlists for the current user
 * @returns {Promise<Array>} List of user's playlists
 */
export async function getUserPlaylists() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
}

/**
 * Get a specific playlist with its songs
 * @param {string} playlistId - ID of the playlist to fetch
 * @returns {Promise<Object>} Playlist with songs
 */
export async function getPlaylistWithSongs(playlistId) {
  try {
    // Get the playlist details
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', playlistId)
      .single();

    if (playlistError) throw playlistError;
    if (!playlist) throw new Error('Playlist not found');

    // Get the songs in this playlist
    const { data: playlistSongs, error: songsError } = await supabase
      .from('playlist_songs')
      .select(`
        id,
        position,
        songs:song_id (
          id,
          title,
          album,
          release_year,
          duration,
          image_url,
          artists:artist_id (
            id,
            name
          )
        )
      `)
      .eq('playlist_id', playlistId)
      .order('position');

    if (songsError) throw songsError;

    // Format the response
    return {
      ...playlist,
      songs: playlistSongs.map(item => ({
        ...item.songs,
        artist: item.songs.artists,
        position: item.position,
        playlist_song_id: item.id
      }))
    };
  } catch (error) {
    console.error('Error fetching playlist with songs:', error);
    throw error;
  }
}

/**
 * Add a song to a playlist
 * @param {string} playlistId - ID of the playlist
 * @param {string} songId - ID of the song to add
 * @param {number} position - Position in the playlist (optional)
 * @returns {Promise<Object>} The created playlist song entry
 */
export async function addSongToPlaylist(playlistId, songId, position = null) {
  try {
    // Check if the song is already in the playlist
    const { data: existing } = await supabase
      .from('playlist_songs')
      .select('id')
      .eq('playlist_id', playlistId)
      .eq('song_id', songId)
      .maybeSingle();

    if (existing) {
      throw new Error('Song is already in this playlist');
    }

    // If position is not provided, add to the end
    if (position === null) {
      const { data: lastPosition } = await supabase
        .from('playlist_songs')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();

      position = lastPosition ? lastPosition.position + 1 : 1;
    }

    // Add the song to the playlist
    const { data, error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId,
        position
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
}

/**
 * Remove a song from a playlist
 * @param {string} playlistId - ID of the playlist
 * @param {string} songId - ID of the song to remove
 * @returns {Promise<boolean>} Success status
 */
export async function removeSongFromPlaylist(playlistId, songId) {
  try {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_id', songId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    throw error;
  }
}

/**
 * Update the position of a song in a playlist
 * @param {string} playlistId - ID of the playlist
 * @param {string} songId - ID of the song
 * @param {number} newPosition - New position in the playlist
 * @returns {Promise<boolean>} Success status
 */
export async function updateSongPosition(playlistId, songId, newPosition) {
  try {
    const { error } = await supabase
      .from('playlist_songs')
      .update({ position: newPosition })
      .eq('playlist_id', playlistId)
      .eq('song_id', songId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating song position:', error);
    throw error;
  }
}

/**
 * Create a template playlist for the user
 * @param {string} templateName - Name of the template to use
 * @returns {Promise<Object>} The created playlist
 */
export async function createTemplatePlaylist(templateName) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create a new playlist based on the template
    let playlistName, playlistDescription, songFilter;

    switch (templateName) {
      case 'all-songs':
        playlistName = 'All Taylor Swift Songs';
        playlistDescription = 'Complete collection of Taylor Swift songs ranked by your preference';
        songFilter = () => true; // Include all songs
        break;
      case 'by-album':
        playlistName = 'Songs by Album';
        playlistDescription = 'Taylor Swift songs organized and ranked by album';
        songFilter = () => true; // Include all songs, will be grouped later
        break;
      case 'top-songs':
        playlistName = 'My Top Taylor Swift Songs';
        playlistDescription = 'Your personal ranking of favorite Taylor Swift songs';
        songFilter = () => true; // Include all songs for user to rank
        break;
      default:
        throw new Error(`Unknown template: ${templateName}`);
    }

    // Create the playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .insert({
        user_id: user.user.id,
        name: playlistName,
        description: playlistDescription,
        is_public: false
      })
      .select()
      .single();

    if (playlistError) throw playlistError;

    // Get Taylor Swift's songs
    const { data: taylorSwift } = await supabase
      .from('artists')
      .select('id')
      .eq('name', 'Taylor Swift')
      .single();

    if (!taylorSwift) {
      throw new Error('Taylor Swift not found in the database');
    }

    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('artist_id', taylorSwift.id);

    if (songsError) throw songsError;

    // Filter songs based on template
    const filteredSongs = songs.filter(songFilter);

    // Add songs to the playlist
    const playlistSongs = filteredSongs.map((song, index) => ({
      playlist_id: playlist.id,
      song_id: song.id,
      position: index + 1
    }));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < playlistSongs.length; i += batchSize) {
      const batch = playlistSongs.slice(i, i + batchSize);
      const { error } = await supabase
        .from('playlist_songs')
        .insert(batch);

      if (error) throw error;
    }

    return {
      ...playlist,
      songCount: filteredSongs.length
    };
  } catch (error) {
    console.error('Error creating template playlist:', error);
    throw error;
  }
}

/**
 * Create a custom playlist based on specific criteria
 * @param {string} name - Name of the playlist
 * @param {string} description - Description of the playlist
 * @param {Function} filterFunction - Function to filter songs
 * @returns {Promise<Object>} The created playlist
 */
export async function createCustomPlaylist(name, description, filterFunction) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create the playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .insert({
        user_id: user.user.id,
        name,
        description,
        is_public: false
      })
      .select()
      .single();

    if (playlistError) throw playlistError;

    // Get Taylor Swift's songs
    const { data: taylorSwift } = await supabase
      .from('artists')
      .select('id')
      .eq('name', 'Taylor Swift')
      .single();

    if (!taylorSwift) {
      throw new Error('Taylor Swift not found in the database');
    }

    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('artist_id', taylorSwift.id);

    if (songsError) throw songsError;

    // Filter songs based on custom criteria
    const filteredSongs = songs.filter(filterFunction);

    // Add songs to the playlist
    const playlistSongs = filteredSongs.map((song, index) => ({
      playlist_id: playlist.id,
      song_id: song.id,
      position: index + 1
    }));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < playlistSongs.length; i += batchSize) {
      const batch = playlistSongs.slice(i, i + batchSize);
      const { error } = await supabase
        .from('playlist_songs')
        .insert(batch);

      if (error) throw error;
    }

    return {
      ...playlist,
      songCount: filteredSongs.length
    };
  } catch (error) {
    console.error('Error creating custom playlist:', error);
    throw error;
  }
}
