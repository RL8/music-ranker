<template>
  <div class="flex flex-col h-screen w-full overflow-hidden">
    <!-- Fixed Header -->
    <header class="flex-none bg-white shadow-md z-10 p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <div class="w-8 h-8 mr-2 bg-green-600 rounded-full flex items-center justify-center text-white">
            <span class="text-lg font-bold">S</span>
          </div>
          <h1 class="text-xl font-bold m-0">Swifties.io</h1>
        </div>
        <div class="flex items-center">
          <button class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-600 transition-colors">
            <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Main Content Area (Scrollable) -->
    <main class="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
      <router-view/>
    </main>
    
    <!-- Bottom Navigation (Only when logged in simulation is active) -->
    <footer class="flex-none z-10">
      <bottom-navigation v-if="userStore.isLoggedInSimulation" />
    </footer>
  </div>
</template>

<script>
import { useUserStore } from '@/store/userStore'
import BottomNavigation from './components/ui/BottomNavigation.vue'

export default {
  components: {
    BottomNavigation
  },
  setup() {
    const userStore = useUserStore()
    
    return {
      userStore
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
