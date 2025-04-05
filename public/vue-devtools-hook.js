// Vue DevTools Connection Hook
// This file is loaded before the application starts and helps connect to Vue DevTools
console.log('Vue DevTools Hook loaded');

// Create a global hook that Vue DevTools can detect
window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = window.__VUE_DEVTOOLS_GLOBAL_HOOK__ || {};

// Log when the hook is accessed
const originalDefineProperty = Object.defineProperty;
Object.defineProperty = function(obj, prop, descriptor) {
  if (obj === window && prop === '__VUE_DEVTOOLS_GLOBAL_HOOK__') {
    console.log('Vue DevTools accessing global hook');
  }
  return originalDefineProperty(obj, prop, descriptor);
};
