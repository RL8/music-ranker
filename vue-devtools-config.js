// Vue DevTools Configuration
module.exports = {
  // The Vue DevTools host (default is localhost)
  host: 'localhost',
  
  // The port that the Vue DevTools will listen on
  port: 8098,
  
  // Enable Vue DevTools in production mode
  // Set to false in production
  enabled: process.env.NODE_ENV !== 'production'
}
