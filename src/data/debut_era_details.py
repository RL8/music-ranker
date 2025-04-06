import json
import os
import sys
from collections import defaultdict

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

try:
    # Load albums data with full path
    albums_path = os.path.join(current_dir, 'taylor-swift-albums.json')
    with open(albums_path, 'r', encoding='utf-8') as f:
        albums = json.load(f)
    print(f"Successfully loaded albums data: {len(albums)} albums found")

    # Load songs data with full path
    songs_path = os.path.join(current_dir, 'taylor-swift-songs.json')
    with open(songs_path, 'r', encoding='utf-8') as f:
        songs = json.load(f)
    print(f"Successfully loaded songs data: {len(songs)} songs found")

    # Create a mapping of album IDs to their songs
    album_songs = defaultdict(list)
    for song in songs:
        album_id = song.get('releaseGroupId')
        if album_id:
            album_songs[album_id].append(song)

    # Filter albums for debut era (2006-2008)
    debut_era_albums = []
    for album in albums:
        release_date = album.get('first-release-date', '')
        if release_date and release_date[:4] >= '2006' and release_date[:4] <= '2008':
            # Find songs for this album
            album_songs_list = album_songs.get(album['id'], [])
            
            # Sort songs by position if available
            album_songs_list.sort(key=lambda x: (x.get('discNumber', 1), x.get('position', float('inf'))))
            
            album['songs'] = album_songs_list
            debut_era_albums.append(album)

    # Sort albums by release date
    debut_era_albums.sort(key=lambda x: x.get('first-release-date', ''))

    # Print detailed information about debut era albums
    print("\n========================================")
    print(f"TAYLOR SWIFT'S DEBUT ERA ALBUMS (2006-2008)")
    print("========================================")
    
    if not debut_era_albums:
        print("No albums found from the debut era (2006-2008)")
    else:
        print(f"Found {len(debut_era_albums)} albums from the debut era (2006-2008)\n")
        
        for i, album in enumerate(debut_era_albums, 1):
            print(f"Album #{i}: {album.get('title', 'Unknown')}")
            print(f"Release Date: {album.get('first-release-date', 'Unknown')}")
            print(f"ID: {album.get('id', 'Unknown')}")
            
            # Print album types
            album_types = album.get('album_types', [])
            secondary_types = album.get('secondary_types', [])
            print(f"Album Type: {', '.join(album_types) if album_types else 'Standard'}")
            if secondary_types:
                print(f"Secondary Types: {', '.join(secondary_types)}")
                
            # Print songs
            album_song_list = album.get('songs', [])
            if album_song_list:
                print(f"Songs ({len(album_song_list)}):")
                for idx, song in enumerate(album_song_list, 1):
                    # Get title from title or name property
                    title = song.get('title', '')
                    
                    # Get duration and format it
                    duration = song.get('length', 0)
                    if duration:
                        minutes = int(duration / 60000)
                        seconds = int((duration % 60000) / 1000)
                        duration_str = f"{minutes}:{seconds:02d}"
                    else:
                        duration_str = "Unknown"
                    
                    disc_num = song.get('discNumber', 1)
                    track_pos = song.get('position', 'Unknown')
                    
                    if disc_num > 1:
                        position_str = f"Disc {disc_num}, Track {track_pos}"
                    else:
                        position_str = f"Track {track_pos}"
                    
                    print(f"  {idx}. {title} ({duration_str}) - {position_str}")
            else:
                print("No songs found for this album")
            
            print("\n" + "-" * 50 + "\n")

    # Now, let's specifically look at the self-titled "Taylor Swift" debut album
    debut_album = next((album for album in debut_era_albums if album.get('title') == "Taylor Swift"), None)
    
    if debut_album:
        print("\n========================================")
        print("FOCUS ON THE SELF-TITLED DEBUT ALBUM")
        print("========================================")
        
        # Get all songs from the debut album
        debut_songs = debut_album.get('songs', [])
        
        # Sort songs by track position
        debut_songs.sort(key=lambda x: (x.get('discNumber', 1), x.get('position', float('inf'))))
        
        print(f"Album: Taylor Swift (Released: {debut_album.get('first-release-date')})")
        print(f"Total Songs: {len(debut_songs)}")
        print("\nTrack Listing:")
        
        for idx, song in enumerate(debut_songs, 1):
            title = song.get('title', 'Unknown')
            duration = song.get('length', 0)
            
            if duration:
                minutes = int(duration / 60000)
                seconds = int((duration % 60000) / 1000)
                duration_str = f"{minutes}:{seconds:02d}"
            else:
                duration_str = "Unknown"
                
            track_pos = song.get('position', 'Unknown')
            song_id = song.get('id', 'Unknown')
            
            print(f"  {idx}. {title} ({duration_str}) - Track {track_pos} [ID: {song_id}]")
            
except Exception as e:
    print(f"ERROR: An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
