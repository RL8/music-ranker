import json
import os
import sys

# Get the current directory path
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Script running from: {current_dir}")

try:
    # Load albums data with full path
    albums_path = os.path.join(current_dir, 'taylor-swift-albums.json')
    print(f"Attempting to open albums file at: {albums_path}")
    
    if not os.path.exists(albums_path):
        print(f"ERROR: Albums file not found at {albums_path}")
        sys.exit(1)
    
    with open(albums_path, 'r', encoding='utf-8') as f:
        albums = json.load(f)
    print(f"Successfully loaded albums data: {len(albums)} albums found")

    # Load songs data with full path
    songs_path = os.path.join(current_dir, 'taylor-swift-songs.json')
    print(f"Attempting to open songs file at: {songs_path}")
    
    if not os.path.exists(songs_path):
        print(f"ERROR: Songs file not found at {songs_path}")
        sys.exit(1)
        
    with open(songs_path, 'r', encoding='utf-8') as f:
        songs = json.load(f)
    print(f"Successfully loaded songs data: {len(songs)} songs found")

    # Helper function to determine era based on release date
    def get_era(release_date):
        if not release_date:  # Handle empty release dates
            return "Unknown"
        try:
            year = int(release_date[:4])  # Extract year
            if year >= 2006 and year < 2008:
                return "Taylor Swift"
            elif year >= 2008 and year < 2010:
                return "Fearless"
            elif year >= 2010 and year < 2012:
                return "Speak Now"
            elif year >= 2012 and year < 2014:
                return "Red"
            elif year >= 2014 and year < 2017:
                return "1989"
            elif year >= 2017 and year < 2019:
                return "Reputation"
            elif year >= 2019 and year < 2020:
                return "Lover"
            elif year >= 2020 and year < 2022:
                return "Folklore/Evermore"
            elif year >= 2022 and year < 2024:
                return "Midnights"
            elif year >= 2024:
                return "Tortured Poets Department"
            else:
                return "Unknown"
        except (ValueError, TypeError, IndexError) as e:
            print(f"Error parsing release date '{release_date}': {e}")
            return "Unknown"

    # Add era and isTaylorsVersion to albums
    for album in albums:
        release_date = album.get('first-release-date', '')
        album['era'] = get_era(release_date)
        album['isTaylorsVersion'] = "Taylor's version" in album.get('title', '')
        
    print("Successfully added era and isTaylorsVersion to albums")

    # Create a set to store unique song IDs for the Taylor Swift era
    ts_album_ids = set()
    unique_song_ids = set()

    # Helper function to determine if an album has live versions
    def has_secondary_type(album, target_type):
        return target_type in album.get('secondary_types', [])

    # Iterate through the albums to identify those belonging to the Taylor Swift era
    for album in albums:
        if album['era'] == 'Taylor Swift':
            ts_album_ids.add(album['id'])

    print(f"Found {len(ts_album_ids)} albums in the Taylor Swift era")

    # Iterate through the songs to count unique songs associated with those albums
    for song in songs:
        if song.get('releaseGroupId') in ts_album_ids:
            unique_song_ids.add(song['id'])

    # Print the results
    print(f"\nRESULTS:")
    print(f"Number of unique albums in the Taylor Swift era: {len(ts_album_ids)}")
    print(f"Number of unique songs in the Taylor Swift era albums: {len(unique_song_ids)}")
    
    print("\nDetails of albums in the Taylor Swift era:")
    for album in albums:
        if album['id'] in ts_album_ids:
            print(f"- {album.get('title', 'Unknown title')} (Release date: {album.get('first-release-date', 'Unknown')})")

except Exception as e:
    print(f"ERROR: An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
