/**
 * Utility functions for managing localStorage
 */

/**
 * Clears all app-related data from localStorage
 * This is useful when data structures change between deployments
 */
export function clearAppStorage() {
  try {
    // Get all keys in localStorage
    const keys = Object.keys(localStorage);
    
    // Filter for app-specific keys
    const appKeys = keys.filter(key => 
      key.startsWith('swifties_') || 
      key.startsWith('song_rankings_') || 
      key === 'app_version'
    );
    
    // Remove each app-specific key
    appKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${appKeys.length} app-related items from localStorage`);
    return true;
  } catch (error) {
    console.error('Error clearing app storage:', error);
    return false;
  }
}

/**
 * Force refresh app data if version has changed
 * @param {string} currentVersion - The current app version
 * @returns {boolean} - Whether a refresh was performed
 */
export function checkVersionAndRefresh(currentVersion) {
  try {
    const storedVersion = localStorage.getItem('app_version');
    
    // If version doesn't match or doesn't exist, clear storage and update version
    if (!storedVersion || storedVersion !== currentVersion) {
      console.log(`App version changed from ${storedVersion || 'none'} to ${currentVersion}. Refreshing data...`);
      
      // Clear app storage
      clearAppStorage();
      
      // Set new version
      localStorage.setItem('app_version', currentVersion);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking app version:', error);
    return false;
  }
}
