<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar Navigation -->
    <Sidebar :is-open="sidebarOpen" :toggle-sidebar="toggleSidebar" />
    
    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300" :class="{ 'lg:ml-[250px]': sidebarOpen }">
      <!-- Page-specific header can be added by individual views -->
      
      <!-- Main Content (Scrollable) -->
      <main class="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/userStore'
import { useRankingStore } from '@/store/rankingStore'
import { useDatabaseMusicStore } from '@/store/databaseMusicStore'
import { useDatabase } from '@/utils/useDatabase'
import { checkVersionAndRefresh } from '@/utils/storageUtils'
import { onMounted, ref } from 'vue'
import Sidebar from './components/ui/Sidebar.vue'

export default {
  components: {
    Sidebar
  },
  setup() {
    const userStore = useUserStore()
    const rankingStore = useRankingStore()
    const dbMusicStore = useDatabaseMusicStore()
    const initializationStatus = ref({
      database: 'pending',
      albums: 'pending',
      eras: 'pending',
      songs: 'pending'
    })
    
    // Sidebar state
    const sidebarOpen = ref(false)
    
    // Toggle sidebar function
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }
    
    // Initialize the database music store and load era-centric data
    const initializeApplication = async () => {
      try {
        // Initialize database music store
        console.log('Initializing database store with Supabase')
        initializationStatus.value.database = 'loading'
        await dbMusicStore.initialize()
        initializationStatus.value.database = 'success'
        console.log('Database store initialized successfully')
        
        // Load albums data
        initializationStatus.value.albums = 'loading'
        const albums = await dbMusicStore.fetchAlbums()
        if (albums && albums.length) {
          rankingStore.initializeStaticAlbums(albums)
          initializationStatus.value.albums = 'success'
          console.log(`Loaded ${albums.length} albums from database`)
        } else {
          initializationStatus.value.albums = 'error'
          console.warn('No albums found in database')
        }
        
        // Load eras data
        initializationStatus.value.eras = 'loading'
        const eras = await dbMusicStore.fetchEras()
        if (eras && eras.length) {
          rankingStore.initializeStaticEras(eras)
          initializationStatus.value.eras = 'success'
          console.log(`Loaded ${eras.length} eras from database`)
        } else {
          initializationStatus.value.eras = 'error'
          console.warn('No eras found in database')
        }
        
        // Load songs data (just to cache them)
        initializationStatus.value.songs = 'loading'
        const songs = await dbMusicStore.fetchSongs()
        if (songs && songs.length) {
          initializationStatus.value.songs = 'success'
          console.log(`Loaded ${songs.length} songs from database`)
        } else {
          initializationStatus.value.songs = 'error'
          console.warn('No songs found in database')
        }
        
        // Load user rankings if user is logged in
        if (userStore.isLoggedIn && userStore.user) {
          try {
            await rankingStore.fetchAlbumRankings(userStore.user.id)
            await rankingStore.fetchEraRankings(userStore.user.id)
            await rankingStore.fetchSongRankings(userStore.user.id)
            console.log('User rankings loaded successfully')
          } catch (error) {
            console.error('Failed to load user rankings:', error)
          }
        } else {
          // If not logged in, try to load from localStorage
          rankingStore.loadRankingsFromLocalStorage()
          rankingStore.loadSongRankingsFromLocalStorage()
        }
      } catch (error) {
        console.error('Application initialization error:', error)
        
        // Update status for failed components
        if (initializationStatus.value.database === 'loading') {
          initializationStatus.value.database = 'error'
        }
        if (initializationStatus.value.albums === 'loading') {
          initializationStatus.value.albums = 'error'
        }
        if (initializationStatus.value.eras === 'loading') {
          initializationStatus.value.eras = 'error'
        }
        if (initializationStatus.value.songs === 'loading') {
          initializationStatus.value.songs = 'error'
        }
      }
    }
    
    onMounted(() => {
      // Initialize application with Supabase data
      initializeApplication()
      
      // Check for app version changes
      // Use the version from package.json
      const appVersion = '0.1.0' // Hardcoded from package.json
      checkVersionAndRefresh(appVersion)
    })
    
    return {
      userStore,
      rankingStore,
      dbMusicStore,
      initializationStatus,
      sidebarOpen,
      toggleSidebar
    }
  }
}
</script>

<style>
/* Any global styles can go here */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

/* Fix for iOS height issues */
html, body {
  height: 100%;
  overflow: hidden;
}

/* Info icon */
.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}
</style>
