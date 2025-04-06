import json

# Load albums data
with open('taylor-swift-albums.json', 'r') as f:
    albums = json.load(f)

# Load songs data
with open('taylor-swift-songs.json', 'r') as f:
    songs = json.load(f)

# Helper function to determine era based on release date
def get_era(release_date):
    if not release_date:  # Handle empty release dates
        return "Unknown"
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

# Add era and isTaylorsVersion to albums
for album in albums:
    album['era'] = get_era(album.get('first-release-date', ''))  # safely get the date
    album['isTaylorsVersion'] = "Taylor’s version" in album['title']

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

# Iterate through the songs to count unique songs associated with those albums
for song in songs:
    if song['releaseGroupId'] in ts_album_ids:
        unique_song_ids.add(song['id'])

# Print the results
print(f"Number of unique albums in the Taylor Swift era: {len(ts_album_ids)}")
print(f"Number of unique songs in the Taylor Swift era albums: {len(unique_song_ids)}")