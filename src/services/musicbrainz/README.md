# Taylor Swift Data Integration

This module provides integration with the MusicBrainz API to fetch Taylor Swift's music data for the Music Ranker application. It implements a cached API approach that balances fresh data with offline capability.

## Features

- Fetch Taylor Swift's artist information, albums, and songs from MusicBrainz
- Cache data in browser storage for faster access and offline capability
- Manual refresh controls instead of automatic updates
- Support for multiple user-created playlists with different rankings

## Components

### API Service (`api.js`)

Handles direct communication with the MusicBrainz API, including:
- Fetching artist information
- Retrieving albums and songs
- Getting album artwork

### Cache Service (`cache.js`)

Manages local browser storage of Taylor Swift's music data:
- Storing and retrieving cached data
- Checking cache freshness
- Clearing cache when needed

### Data Service (`dataService.js`)

Coordinates between the API, cache, and Supabase database:
- Initializing data from cache or API
- Transforming data to match database schema
- Storing data in Supabase

## Usage

The Taylor Swift Data Manager component (`/admin/taylor-swift`) provides a user interface for:
- Checking data status
- Manually refreshing data
- Creating template playlists for ranking

## Playlist Features

Users can create and manage multiple playlists including:
- Complete discography ranking
- Album-specific rankings
- Custom playlists based on various criteria

Each song can appear in multiple playlists with different rankings in each list.
