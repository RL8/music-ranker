import json
import os

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load albums data
albums_path = os.path.join(current_dir, 'taylor-swift-albums.json')
with open(albums_path, 'r', encoding='utf-8') as f:
    albums = json.load(f)

# Load songs data
songs_path = os.path.join(current_dir, 'taylor-swift-songs.json')
with open(songs_path, 'r', encoding='utf-8') as f:
    songs = json.load(f)

# Map album IDs to songs
album_songs = {}
for song in songs:
    album_id = song.get('releaseGroupId')
    if album_id:
        if album_id not in album_songs:
            album_songs[album_id] = []
        album_songs[album_id].append(song)

# Filter albums for debut era (2006-2008)
debut_era_albums = []
for album in albums:
    release_date = album.get('first-release-date', '')
    if release_date and release_date[:4] >= '2006' and release_date[:4] <= '2008':
        album_songs_list = album_songs.get(album['id'], [])
        album['song_count'] = len(album_songs_list)
        debut_era_albums.append(album)

# Sort albums by release date
debut_era_albums.sort(key=lambda x: x.get('first-release-date', ''))

# Print the list of debut era albums
print("\nTAYLOR SWIFT'S DEBUT ERA ALBUMS (2006-2008)")
print("=" * 50)

for i, album in enumerate(debut_era_albums, 1):
    title = album.get('title', 'Unknown')
    release_date = album.get('first-release-date', 'Unknown')
    song_count = album.get('song_count', 0)
    album_id = album.get('id', 'Unknown')
    
    print(f"{i}. {title}")
    print(f"   Release Date: {release_date}")
    print(f"   Song Count: {song_count}")
    print(f"   Album ID: {album_id}")
    print()

# Now list the songs from her self-titled debut album
print("\nSONGS FROM TAYLOR SWIFT'S SELF-TITLED DEBUT ALBUM")
print("=" * 50)

debut_album = next((album for album in debut_era_albums if album.get('title') == "Taylor Swift"), None)
if debut_album:
    debut_songs = album_songs.get(debut_album['id'], [])
    
    # Sort songs by track position
    debut_songs.sort(key=lambda x: x.get('position', float('inf')))
    
    for i, song in enumerate(debut_songs, 1):
        title = song.get('title', 'Unknown')
        position = song.get('position', 'Unknown')
        
        print(f"{i}. {title} (Track {position})")
