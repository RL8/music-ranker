/* eslint-disable no-console */

import { register } from 'register-service-worker'

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

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      );
      swEventBus.emit('ready');
    },
    registered(registration) {
      console.log('Service worker has been registered.');
      swEventBus.emit('registered', registration);
      
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60);
    },
    cached() {
      console.log('Content has been cached for offline use.');
      swEventBus.emit('cached');
    },
    updatefound() {
      console.log('New content is downloading.');
      swEventBus.emit('updatefound');
    },
    updated(registration) {
      console.log('New content is available; please refresh.');
      swEventBus.emit('updated', registration);
      
      // Notify the user about the update
      const shouldRefresh = window.confirm(
        'New version available! Click OK to refresh.'
      );
      
      if (shouldRefresh) {
        window.location.reload();
      }
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
      swEventBus.emit('offline');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
      swEventBus.emit('error', error);
    }
  });
}
