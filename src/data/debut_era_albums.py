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
            album['songs'] = album_songs.get(album['id'], [])
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
                    duration = song.get('duration_ms', 0)
                    if duration:
                        minutes = int(duration / 60000)
                        seconds = int((duration % 60000) / 1000)
                        duration_str = f"{minutes}:{seconds:02d}"
                    else:
                        duration_str = "Unknown"
                    
                    print(f"  {idx}. {song.get('name', 'Unknown')} ({duration_str})")
            else:
                print("No songs found for this album")
            
            print("\n" + "-" * 50 + "\n")

except Exception as e:
    print(f"ERROR: An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
