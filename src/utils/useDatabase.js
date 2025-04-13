/**
 * Database Toggle Utility
 * 
 * This utility allows toggling between static JSON data and database data.
 * It reads from environment variables but can be overridden programmatically.
 */

// Default to the environment variable if available, otherwise default to false
let useDatabaseFlag = process.env.VUE_APP_USE_DATABASE === 'true'

/**
 * Database utility object with methods to check, enable, disable, and toggle database usage
 */
export const useDatabase = {
  /**
   * Check if the application should use database as the data source
   * @returns {boolean} True if database should be used, false for static JSON
   */
  isEnabled: () => {
    return useDatabaseFlag
  },
  
  /**
   * Enable database as the data source
   */
  enable: () => {
    useDatabaseFlag = true
    console.log('Database data source enabled')
    return true
  },
  
  /**
   * Disable database as the data source (use static JSON instead)
   */
  disable: () => {
    useDatabaseFlag = false
    console.log('Database data source disabled, using static JSON')
    return false
  },
  
  /**
   * Toggle between database and static JSON data sources
   * @returns {boolean} The new state (true = database, false = static JSON)
   */
  toggle: () => {
    useDatabaseFlag = !useDatabaseFlag
    console.log(`Database data source ${useDatabaseFlag ? 'enabled' : 'disabled'}`)
    return useDatabaseFlag
  }
}
