/**
 * MusicBrainz API Proxy Server
 * 
 * This server acts as a proxy between the frontend application and the MusicBrainz API.
 * It handles CORS issues, rate limiting, and proper header management.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mcache = require('memory-cache');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

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
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION) || 3600000;

// Base configuration for MusicBrainz API requests
const mbApiConfig = {
  baseURL: process.env.MUSICBRAINZ_API_URL,
  headers: {
    'User-Agent': process.env.MUSICBRAINZ_USER_AGENT,
    'Accept': 'application/json'
  },
  params: {
    fmt: 'json'
  }
};

// Endpoint: Get artist by ID (e.g., Taylor Swift)
app.get('/api/artist/:id', cache(CACHE_DURATION), async (req, res) => {
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
app.get('/api/release-groups', cache(CACHE_DURATION), async (req, res) => {
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
app.get('/api/release-group/:id', cache(CACHE_DURATION), async (req, res) => {
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
app.get('/api/release/:id', cache(CACHE_DURATION), async (req, res) => {
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
app.get('/api/cover-art/:id', cache(CACHE_DURATION), async (req, res) => {
  try {
    // Cover Art Archive is a separate service
    const config = {
      method: 'get',
      url: `https://coverartarchive.org/release/${req.params.id}`,
      headers: {
        'User-Agent': process.env.MUSICBRAINZ_USER_AGENT
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

// -- Stripe Payment Routes --

// Create a payment intent
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // In a production app, you might want to store customer data
      // customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
  }
});

// Handle Stripe webhooks
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    if (endpointSecret) {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } else {
      // For development without webhook signature verification
      event = req.body;
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        console.log('Payment succeeded:', paymentIntent.id);
        // In a real app, update database to mark user as premium
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Check premium status
app.get('/api/premium/status', (req, res) => {
  // In a real app, this would check the user's database record
  // For now, it's a simple mock response
  res.json({
    isPremium: false,
    expiresAt: null
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`MusicBrainz Proxy Server running on port ${PORT}`);
});
