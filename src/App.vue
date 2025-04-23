<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Alpha Version Banner -->
    <div class="alpha-banner">
      <span class="alpha-badge">ALPHA</span>
      <span class="alpha-text">This app is in active development. Features may change.</span>
      <a href="mailto:feedback@swifties.io" class="alpha-feedback">Send Feedback</a>
    </div>
    
    <!-- Sidebar Navigation -->
    <Sidebar :is-open="sidebarOpen" :toggle-sidebar="toggleSidebar" />
    
    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300" :class="{ 'lg:ml-[250px]': sidebarOpen }">
      <!-- Page-specific header can be added by individual views -->
      
      <!-- Main Content (Scrollable) -->
      <main class="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
        <router-view/>
      </main>
      
      <!-- Version Footer -->
      <footer class="version-footer">
        <div class="version-info">
          <span>Swifties.io</span>
          <span class="version-number">v0.9.0-alpha</span>
          <span class="version-date">Updated: {{ formattedDate }}</span>
        </div>
      </footer>
    </div>
    
    <!-- Global Alerts -->
    <GlobalAlerts />
    
    <!-- Global Modals -->
    <GlobalModals />
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
import GlobalAlerts from './components/ui/GlobalAlerts.vue'
import GlobalModals from './components/ui/GlobalModals.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    GlobalAlerts,
    GlobalModals
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
    
    // For version footer
    const formattedDate = ref('April 23, 2025')
    
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
      toggleSidebar,
      formattedDate
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

/* Alpha Banner Styles */
.alpha-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 249, 219, 0.95);
  border-bottom: 1px solid #f0e68c;
  padding: 6px 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.alpha-badge {
  background-color: #ff6b6b;
  color: white;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 10px;
}

.alpha-text {
  color: #555;
}

.alpha-feedback {
  margin-left: 12px;
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}

.alpha-feedback:hover {
  text-decoration: underline;
}

/* Adjust main content to account for banner */
main {
  padding-top: 30px;
}

/* Version Footer Styles */
.version-footer {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  padding: 8px 16px;
  font-size: 11px;
  color: #777;
  text-align: center;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.version-number {
  color: #4caf50;
  font-weight: 500;
}

.version-date {
  color: #999;
}
</style>
