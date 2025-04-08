/* eslint-disable no-console */

// Create a custom event bus for service worker events
const swEventBus = {
  events: {},
  
  // Subscribe to an event
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return () => this.off(event, callback);
  },
  
  // Unsubscribe from an event
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  },
  
  // Emit an event
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
};

// Export the event bus for use in components
export const ServiceWorkerEventBus = swEventBus;

// Track the offline status
let isOffline = !navigator.onLine;
export const getOfflineStatus = () => isOffline;

// Listen for online/offline events
window.addEventListener('online', () => {
  isOffline = false;
  swEventBus.emit('connectivity', { isOffline });
});

window.addEventListener('offline', () => {
  isOffline = true;
  swEventBus.emit('connectivity', { isOffline });
});

// Initial connectivity check
swEventBus.emit('connectivity', { isOffline });

// With Vite PWA plugin, we don't need to manually register the service worker
// The plugin handles registration and updates automatically
// We just need to listen for the events from the plugin

if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // The vite-plugin-pwa uses workbox-window for managing service workers
    try {
      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker controller, page will reload');
        swEventBus.emit('updated');
        // Reload the page to ensure new content is shown
        window.location.reload();
      });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        const data = event.data;
        if (data && data.type) {
          swEventBus.emit(data.type, data);
        }
      });

      console.log('Service worker event listeners registered');
    } catch (error) {
      console.error('Error setting up service worker event listeners:', error);
      swEventBus.emit('error', error);
    }
  });
}
