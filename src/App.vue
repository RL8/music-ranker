<template>
  <div class="flex flex-col h-screen w-full">
    <!-- Fixed Header -->
    <header class="flex-none bg-white shadow-md z-50">
      <div class="flex justify-between items-center p-4">
        <div class="flex items-center">
          <div class="w-8 h-8 mr-2 bg-green-600 rounded-full flex items-center justify-center text-white">
            <span class="text-lg font-bold">M</span>
          </div>
          <h1 class="text-2xl font-medium m-0">Music Ranker</h1>
        </div>
        <div class="flex items-center">
          <button 
            class="block bg-transparent border-0 w-8 h-8 relative cursor-pointer md:hidden"
            @click="toggleMenu" 
            aria-label="Toggle menu"
          >
            <span class="menu-icon"></span>
          </button>
        </div>
      </div>
      <!-- Mobile Navigation Menu -->
      <nav 
        class="flex flex-col bg-white overflow-hidden transition-all duration-300 md:flex-row md:max-h-full md:justify-center md:py-2"
        :class="{ 'max-h-screen shadow-md': menuOpen, 'max-h-0': !menuOpen && !isMobileView }"
      >
        <router-link 
          to="/music" 
          @click="closeMenu"
          class="block p-4 no-underline text-gray-800 font-bold border-b border-gray-100 hover:text-green-600 md:border-b-0 md:py-2 md:px-4"
          :class="{ 'text-green-600': $route.path.startsWith('/music') }"
        >
          Music
        </router-link>
        <router-link 
          to="/rank/albums" 
          @click="closeMenu"
          class="block p-4 no-underline text-gray-800 font-bold border-b border-gray-100 hover:text-green-600 md:border-b-0 md:py-2 md:px-4"
          :class="{ 'text-green-600': $route.path === '/rank/albums' }"
        >
          Rank Albums
        </router-link>
        <router-link 
          to="/rank/songs" 
          @click="closeMenu"
          class="block p-4 no-underline text-gray-800 font-bold border-b border-gray-100 hover:text-green-600 md:border-b-0 md:py-2 md:px-4"
          :class="{ 'text-green-600': $route.path === '/rank/songs' }"
        >
          Rank Songs
        </router-link>
        <router-link 
          to="/visualizations/taylor-swift" 
          @click="closeMenu"
          class="block p-4 no-underline text-gray-800 font-bold border-b border-gray-100 hover:text-green-600 md:border-b-0 md:py-2 md:px-4"
          :class="{ 'text-green-600': $route.path === '/visualizations/taylor-swift' }"
        >
          Taylor Swift
        </router-link>
        <router-link 
          to="/about" 
          @click="closeMenu"
          class="block p-4 no-underline text-gray-800 font-bold border-b border-gray-100 hover:text-green-600 md:border-b-0 md:py-2 md:px-4"
          :class="{ 'text-green-600': $route.path === '/about' }"
        >
          About
        </router-link>
      </nav>
    </header>
    
    <!-- Main Content Area (Scrollable) -->
    <pull-to-refresh 
      v-if="supportsPullToRefresh"
      class="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch" 
      :class="{ 'pb-[calc(1rem+56px)]': isMobileView }"
      @refresh="handleRefresh"
    >
      <router-view/>
    </pull-to-refresh>
    
    <main 
      v-else 
      class="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch"
      :class="{ 'pb-[calc(1rem+56px)]': isMobileView }"
    >
      <router-view/>
    </main>
    
    <!-- Fixed Footer (Hidden on Mobile) -->
    <footer 
      class="flex-none bg-gray-100 border-t border-gray-200 p-4 text-center text-sm"
      :class="{ 'hidden': isMobileView }"
    >
      <div class="footer-content">
        <p>&copy; 2025 Music Ranker</p>
      </div>
    </footer>
    
    <!-- Bottom Navigation (Mobile Only) -->
    <bottom-navigation v-if="isMobileView" />
    
    <!-- Offline Status Indicator -->
    <offline-status />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BottomNavigation from './components/ui/BottomNavigation.vue'
import OfflineStatus from './components/ui/OfflineStatus.vue'
import PullToRefresh from './components/ui/PullToRefresh.vue'

export default {
  components: {
    BottomNavigation,
    OfflineStatus,
    PullToRefresh
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const menuOpen = ref(false)
    const isMobileView = ref(false)
    const windowWidth = ref(0)
    const supportsPullToRefresh = ref(false)
    
    const checkScreenSize = () => {
      windowWidth.value = window.innerWidth
      isMobileView.value = windowWidth.value < 768
    }
    
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
      // Prevent body scrolling when menu is open
      document.body.style.overflow = menuOpen.value ? 'hidden' : ''
    }
    
    const closeMenu = () => {
      menuOpen.value = false
      document.body.style.overflow = ''
    }
    
    const handleRefresh = (completeCallback) => {
      // Reload current route data
      const currentRoute = router.currentRoute.value
      
      // Just reload the route with a timestamp to force refresh
      router.replace({
        name: currentRoute.name,
        params: { ...currentRoute.params },
        query: { ...currentRoute.query, _t: Date.now() }
      }).finally(() => {
        setTimeout(completeCallback, 500)
      })
    }
    
    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('resize', checkScreenSize)
      checkScreenSize()
      
      // Check if device supports touch events for pull-to-refresh
      supportsPullToRefresh.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })
    
    return {
      menuOpen,
      isMobileView,
      windowWidth,
      supportsPullToRefresh,
      toggleMenu,
      closeMenu,
      checkScreenSize,
      handleRefresh
    }
  }
}
</script>

<style>
/* Custom styles that can't be easily replaced with Tailwind utilities */
.menu-icon {
  @apply block relative;
}

.menu-icon, .menu-icon:before, .menu-icon:after {
  @apply w-full h-0.5 bg-gray-800 transition-all duration-300;
}

.menu-icon:before, .menu-icon:after {
  @apply content-[''] absolute left-0;
}

.menu-icon:before {
  @apply -top-2;
}

.menu-icon:after {
  @apply -bottom-2;
}

/* Add -webkit-overflow-scrolling-touch as a utility since Tailwind doesn't have it */
.-webkit-overflow-scrolling-touch {
  -webkit-overflow-scrolling: touch;
}
</style>
