// This file serves as a central point to export all stores
import { useDatabaseMusicStore } from './databaseMusicStore'

// Export the database music store as the main music store
// This allows components to continue using useMusicStore without changing imports
export const useMusicStore = useDatabaseMusicStore

// Export other stores directly
export {
  useDatabaseMusicStore
}
