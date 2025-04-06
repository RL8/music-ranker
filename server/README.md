# MusicBrainz API Proxy Server

This server acts as a proxy between the Music Ranker frontend application and the MusicBrainz API. It handles CORS issues, rate limiting, and proper header management.

## Features

- **CORS Handling**: Eliminates cross-origin resource sharing issues
- **Rate Limiting**: Respects MusicBrainz's 1 request per second limit
- **Caching**: Reduces API calls with in-memory caching
- **Error Handling**: Provides consistent error responses

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/artist/:id` | Get artist information by ID |
| `/api/release-groups` | Get albums by artist ID |
| `/api/release-group/:id` | Get album details by ID |
| `/api/release/:id` | Get release details with songs |
| `/api/cover-art/:id` | Get album artwork |
| `/health` | Health check endpoint |

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables in `.env` file:
   ```
   PORT=3001
   MUSICBRAINZ_API_URL=https://musicbrainz.org/ws/2
   MUSICBRAINZ_USER_AGENT=MusicRanker/1.0.0 (your-email@example.com)
   CACHE_DURATION=3600000
   ```

3. Start the server:
   ```
   npm start
   ```

## Development

For development with auto-restart:
```
npm run dev
```

## Integration with Frontend

Update the frontend API service to use this proxy server instead of directly calling the MusicBrainz API.
