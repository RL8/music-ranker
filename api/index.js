/**
 * MusicBrainz API Proxy - Serverless Function for Vercel
 * 
 * This serverless function acts as a proxy between the frontend application and the MusicBrainz API.
 * It handles CORS issues, rate limiting, and proper header management.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mcache = require('memory-cache');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting implementation
let lastRequestTime = 0;
const requestQueue = [];
let processingQueue = false;

// Process the request queue to respect rate limiting
async function processQueue() {
  if (processingQueue || requestQueue.length === 0) return;
  
  processingQueue = true;
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  // Ensure at least 1.1 seconds between requests
  if (timeSinceLastRequest < 1100 && lastRequestTime > 0) {
    await new Promise(resolve => setTimeout(resolve, 1100 - timeSinceLastRequest));
  }
  
  const nextRequest = requestQueue.shift();
  try {
    const response = await makeRequest(nextRequest.config);
    nextRequest.resolve(response);
  } catch (error) {
    nextRequest.reject(error);
  }
  
  lastRequestTime = Date.now();
  processingQueue = false;
  
  // Process next request in queue
  processQueue();
}

// Queue a request to respect rate limiting
function queueRequest(config) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ config, resolve, reject });
    processQueue();
  });
}

// Make actual request to MusicBrainz API
async function makeRequest(config) {
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error making request to MusicBrainz API:', error.message);
    throw error;
  }
}

// Cache middleware
function cache(duration) {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    
    if (cachedBody) {
      res.send(cachedBody);
      return;
    }
    
    res.sendResponse = res.send;
    res.send = (body) => {
      mcache.put(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
}

// Default cache duration (1 hour)
const CACHE_DURATION = 3600000;

// Base configuration for MusicBrainz API requests
const mbApiConfig = {
  baseURL: 'https://musicbrainz.org/ws/2',
  headers: {
    'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)',
    'Accept': 'application/json'
  },
  params: {
    fmt: 'json'
  }
};

// Endpoint: Get artist by ID (e.g., Taylor Swift)
app.get('/artist/:id', cache(CACHE_DURATION), async (req, res) => {
  try {
    const config = {
      ...mbApiConfig,
      method: 'get',
      url: `/artist/${req.params.id}`,
      params: {
        ...mbApiConfig.params,
        inc: req.query.inc || 'url-rels+aliases'
      }
    };
    
    const data = await queueRequest(config);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Get release groups (albums) by artist ID
app.get('/release-groups', cache(CACHE_DURATION), async (req, res) => {
  try {
    const config = {
      ...mbApiConfig,
      method: 'get',
      url: '/release-group',
      params: {
        ...mbApiConfig.params,
        artist: req.query.artist,
        type: req.query.type || 'album',
        limit: req.query.limit || 100
      }
    };
    
    const data = await queueRequest(config);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Get release group (album) by ID
app.get('/release-group/:id', cache(CACHE_DURATION), async (req, res) => {
  try {
    const config = {
      ...mbApiConfig,
      method: 'get',
      url: `/release-group/${req.params.id}`,
      params: {
        ...mbApiConfig.params,
        inc: req.query.inc || 'releases'
      }
    };
    
    const data = await queueRequest(config);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Get release by ID with recordings (songs)
app.get('/release/:id', cache(CACHE_DURATION), async (req, res) => {
  try {
    const config = {
      ...mbApiConfig,
      method: 'get',
      url: `/release/${req.params.id}`,
      params: {
        ...mbApiConfig.params,
        inc: req.query.inc || 'recordings'
      }
    };
    
    const data = await queueRequest(config);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Get cover art for a release
app.get('/cover-art/:id', cache(CACHE_DURATION), async (req, res) => {
  try {
    // Cover Art Archive is a separate service
    const config = {
      method: 'get',
      url: `https://coverartarchive.org/release/${req.params.id}`,
      headers: {
        'User-Agent': 'MusicRanker/1.0.0 (your-email@example.com)'
      }
    };
    
    const data = await queueRequest(config);
    res.json(data);
  } catch (error) {
    // Don't fail if cover art is not found
    if (error.response && error.response.status === 404) {
      res.json({ images: [] });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint for API information
app.get('/', (req, res) => {
  res.json({
    name: 'MusicBrainz API Proxy',
    version: '1.0.0',
    endpoints: [
      '/artist/:id',
      '/release-groups',
      '/release-group/:id',
      '/release/:id',
      '/cover-art/:id',
      '/health'
    ]
  });
});

// Export for serverless function
module.exports = app;
