<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar Navigation -->
    <Sidebar />
    
    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 h-full overflow-hidden transition-all duration-300" :class="{ 'md:ml-[250px]': true }">
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
import { onMounted } from 'vue'
import Sidebar from './components/ui/Sidebar.vue'

export default {
  components: {
    Sidebar
  },
  setup() {
    const userStore = useUserStore()
    const rankingStore = useRankingStore()
    const dbMusicStore = useDatabaseMusicStore()
    
    onMounted(() => {
      // Initialize ranking data
      rankingStore.initializeWithSampleData()
      
      // Initialize database music store if enabled
      if (useDatabase.isEnabled()) {
        console.log('Database integration is enabled, initializing database store')
        dbMusicStore.initialize()
      } else {
        console.log('Database integration is disabled, using static data')
      }
      
      // Check for app version changes
      checkVersionAndRefresh()
    })
    
    return {
      userStore,
      rankingStore
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
