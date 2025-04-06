# Taylor Swift Data Fetcher

This script fetches Taylor Swift's artist information, albums, and songs from the MusicBrainz API and saves them as static JSON files in the `src/data` directory.

## Why This Approach?

This approach offers several advantages:
- No CORS issues - data is part of your application
- No API rate limits during runtime - you only fetch the data once
- Faster performance - no waiting for API responses
- Works offline - no internet connection needed
- Simple to implement - no complex proxy servers or infrastructure

## How to Use

1. Run the script to fetch the data:
   ```
   node scripts/fetchTaylorSwiftData.js
   ```

2. The script will create the following files:
   - `src/data/taylor-swift-info.json` - Artist information
   - `src/data/taylor-swift-albums.json` - List of albums
   - `src/data/taylor-swift-songs.json` - List of all songs

3. Use the data in your application through the `taylorSwiftService.js` service.

## Notes

- This script respects MusicBrainz's rate limiting by adding delays between requests
- The data is fetched once and doesn't need to be updated unless you want fresh data
- If you need to update the data, simply run the script again
