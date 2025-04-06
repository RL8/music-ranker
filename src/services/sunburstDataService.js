/**
 * Utility service for transforming music data into the format required by the sunburst chart
 */

/**
 * Transforms artist data into the format required by the sunburst chart
 * @param {Object} artistData - The artist data from the API
 * @param {Array} artistData.albums - The artist's albums
 * @param {Array} artistData.songs - The artist's songs
 * @returns {Object} - Data formatted for the sunburst chart
 */
export function transformArtistDataForSunburst(artistData) {
  if (!artistData || !artistData.albums) {
    return {
      name: "No Data Available",
      children: []
    };
  }

  // Create a map of album IDs to their songs
  const albumSongsMap = {};
  
  if (artistData.songs) {
    artistData.songs.forEach(song => {
      if (song.albumId) {
        if (!albumSongsMap[song.albumId]) {
          albumSongsMap[song.albumId] = [];
        }
        albumSongsMap[song.albumId].push(song);
      }
    });
  }

  // Transform albums and their songs into the sunburst format
  const children = artistData.albums.map(album => {
    const albumNode = {
      name: album.title || album.name,
      children: []
    };

    // Add songs as children of the album
    const songs = albumSongsMap[album.id] || [];
    if (songs.length > 0) {
      albumNode.children = songs.map(song => ({
        name: song.title || song.name,
        // You can use any numeric property for size (popularity, duration, etc.)
        size: song.popularity || song.duration_ms || 100
      }));
    } else {
      // If no songs, just add the album with a size
      albumNode.size = 100;
    }

    return albumNode;
  });

  return {
    name: artistData.name || "Artist",
    children
  };
}

/**
 * Transforms multiple artists' data into a single sunburst chart format
 * @param {Array} artistsData - Array of artist data objects
 * @returns {Object} - Data formatted for the sunburst chart
 */
export function transformMultipleArtistsForSunburst(artistsData) {
  if (!artistsData || !Array.isArray(artistsData) || artistsData.length === 0) {
    return {
      name: "Music Library",
      children: []
    };
  }

  const children = artistsData.map(artist => 
    transformArtistDataForSunburst(artist)
  );

  return {
    name: "Music Library",
    children
  };
}

/**
 * Transforms Taylor Swift data from the cached API into sunburst format
 * @param {Object} taylorData - Taylor Swift data from the cached API
 * @returns {Object} - Data formatted for the sunburst chart
 */
export function transformTaylorSwiftDataForSunburst(taylorData) {
  if (!taylorData || !taylorData.albums) {
    return {
      name: "Taylor Swift",
      children: []
    };
  }

  const children = taylorData.albums.map(album => {
    const albumNode = {
      name: album.name,
      children: []
    };

    // Add songs as children of the album if they exist
    if (album.tracks && album.tracks.length > 0) {
      albumNode.children = album.tracks.map(track => ({
        name: track.name,
        // You can use any numeric property for size
        size: track.popularity || track.duration_ms || 100
      }));
    } else {
      // If no songs, just add the album with a size
      albumNode.size = album.popularity || 100;
    }

    return albumNode;
  });

  return {
    name: "Taylor Swift",
    children
  };
}

/**
 * Transforms Taylor Swift data to show only live albums with their songs
 * @param {Object} taylorData - Taylor Swift data from the cached API
 * @returns {Object} - Data formatted for the sunburst chart with only live albums
 */
export function transformTaylorSwiftLiveAlbumsForSunburst(taylorData) {
  if (!taylorData || !taylorData.albums) {
    return {
      name: "Taylor Swift Live Albums",
      children: []
    };
  }

  // Filter albums to include only those that appear to be live albums
  // This uses a simple heuristic - albums with "live" in the name or description
  const liveAlbums = taylorData.albums.filter(album => {
    const albumName = (album.name || "").toLowerCase();
    const albumDesc = (album.description || "").toLowerCase();
    
    return albumName.includes("live") || 
           albumDesc.includes("live") || 
           albumName.includes("tour") || 
           albumDesc.includes("tour") ||
           albumName.includes("concert") || 
           albumDesc.includes("concert");
  });

  // If no live albums were found, include a message
  if (liveAlbums.length === 0) {
    return {
      name: "Taylor Swift Live Albums",
      children: [
        {
          name: "No live albums found",
          size: 100
        }
      ]
    };
  }

  // Transform the live albums into the sunburst format
  const children = liveAlbums.map(album => {
    const albumNode = {
      name: album.name,
      children: []
    };

    // Add songs as children of the album if they exist
    if (album.tracks && album.tracks.length > 0) {
      albumNode.children = album.tracks.map(track => ({
        name: track.name,
        size: track.popularity || track.duration_ms || 100
      }));
    } else {
      // If no songs, just add the album with a size
      albumNode.size = album.popularity || 100;
    }

    return albumNode;
  });

  return {
    name: "Taylor Swift Live Albums",
    children
  };
}

/**
 * Groups songs by a specific property (e.g., genre, year, etc.)
 * @param {Array} songs - Array of song objects
 * @param {string} groupByProperty - Property to group by
 * @returns {Object} - Data formatted for the sunburst chart
 */
export function groupSongsByProperty(songs, groupByProperty = 'genre') {
  if (!songs || !Array.isArray(songs) || songs.length === 0) {
    return {
      name: "Songs",
      children: []
    };
  }

  // Group songs by the specified property
  const groups = {};
  
  songs.forEach(song => {
    const groupValue = song[groupByProperty] || 'Unknown';
    
    if (!groups[groupValue]) {
      groups[groupValue] = [];
    }
    
    groups[groupValue].push(song);
  });

  // Transform groups into sunburst format
  const children = Object.entries(groups).map(([groupName, groupSongs]) => ({
    name: groupName,
    children: groupSongs.map(song => ({
      name: song.title || song.name,
      size: song.popularity || song.duration_ms || 100
    }))
  }));

  return {
    name: "Songs by " + groupByProperty.charAt(0).toUpperCase() + groupByProperty.slice(1),
    children
  };
}
