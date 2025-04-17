<template>
  <div>
    <!-- Overlay for mobile when sidebar is open -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="toggleSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      :style="{ width: sidebarWidth + 'px' }"
    >
      <!-- App Logo and Name -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center">
          <div class="w-10 h-10 mr-3 bg-green-600 rounded-full flex items-center justify-center text-white">
            <span class="text-lg font-bold">S</span>
          </div>
          <h1 class="text-xl font-bold m-0">Swifties.io</h1>
        </div>
      </div>
      
      <!-- Navigation Links -->
      <nav class="mt-6">
        <router-link 
          to="/music" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/music') }"
          @click="mobileClose"
        >
          <i class="music-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Music</span>
        </router-link>
        
        <router-link 
          to="/rank/albums" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/rank/albums') }"
          @click="mobileClose"
        >
          <i class="album-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Rank Eras</span>
        </router-link>
        
        <router-link 
          to="/rank/songs" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/rank/songs') }"
          @click="mobileClose"
        >
          <i class="song-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Rank Songs</span>
        </router-link>
        
        <router-link 
          to="/profile" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/profile') }"
          @click="mobileClose"
        >
          <i class="profile-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Profile</span>
        </router-link>
        
        <!-- Database Integration Section (Admin Only) -->
        <template v-if="userStore.profile && userStore.profile.role === 'admin'">
          <div class="mt-6 px-6 py-2">
            <h3 class="text-xs uppercase font-bold text-gray-500">Database Integration</h3>
          </div>
          <router-link 
            to="/database-test" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/database-test' }"
            @click="mobileClose"
          >
            <i class="database-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium">Database Test</span>
          </router-link>
          <router-link 
            to="/hybrid-songs" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/hybrid-songs' }"
            @click="mobileClose"
          >
            <i class="song-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium">Hybrid Song List</span>
          </router-link>
          <router-link 
            to="/edition-browser" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/edition-browser' }"
            @click="mobileClose"
          >
            <i class="album-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium">Edition Browser</span>
          </router-link>
          <router-link 
            to="/simple-db" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/simple-db' }"
            @click="mobileClose"
          >
            <i class="database-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium">Simple DB View</span>
          </router-link>
          <router-link 
            to="/database-diagnostic" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/database-diagnostic' }"
            @click="mobileClose"
          >
            <i class="settings-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium text-amber-700 font-semibold">Connection Diagnostic</span>
          </router-link>
          <router-link 
            to="/env-checker" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path === '/env-checker' }"
            @click="mobileClose"
          >
            <i class="settings-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium text-amber-700 font-semibold">Env Variables Checker</span>
          </router-link>
        </template>
        <!-- Settings and About (Always Visible) -->
        <router-link 
          to="/settings" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/settings') }"
          @click="mobileClose"
        >
          <i class="settings-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Settings</span>
        </router-link>
        <router-link 
          to="/about" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path === '/about' }"
          @click="mobileClose"
        >
          <i class="about-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">About</span>
        </router-link>
        <router-link 
          to="/eras" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path === '/eras' }"
          @click="mobileClose"
        >
          <i class="music-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Musical Eras</span>
        </router-link>
        <router-link 
          to="/image-diagnostic" 
          class="flex items-center px-6 py-3 pl-12 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path === '/image-diagnostic' }"
          @click="mobileClose"
        >
          <i class="settings-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-2 font-medium text-amber-700">Image Diagnostic</span>
        </router-link>
      </nav>
      
      <!-- User Info (bottom of sidebar) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <i class="profile-icon w-6 h-6 bg-center bg-no-repeat bg-contain text-gray-600"></i>
          </div>
          <div class="ml-3">
            <p class="font-medium text-gray-800">{{ userStore.isLoggedInSimulation ? 'Taylor Fan' : 'Guest User' }}</p>
            <p class="text-sm text-gray-500">{{ userStore.isLoggedInSimulation ? 'Logged In' : 'Not Logged In' }}</p>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Toggle Button (only visible on mobile) -->
    <button 
      class="fixed top-4 left-4 z-30 md:hidden w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-green-600 transition-colors"
      @click="toggleSidebar"
      aria-label="Toggle navigation menu"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        :class="{ 'hidden': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        class="h-6 w-6" 
        :class="{ 'hidden': !isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/store/userStore';

export default {
  name: 'Sidebar',
  props: {
    initiallyOpen: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const isOpen = ref(props.initiallyOpen);
    const sidebarWidth = ref(250);
    const userStore = useUserStore();
    
    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
    };
    
    const mobileClose = () => {
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 768) {
        isOpen.value = false;
      }
    };
    
    // Close sidebar when clicking outside on mobile
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    };
    
    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    
    return {
      isOpen,
      sidebarWidth,
      userStore,
      toggleSidebar,
      mobileClose
    };
  }
};
</script>

<style scoped>
/* SVG icons as background images */
.music-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
}

.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55-2.22 0-4.01 1.79-4.01 4s1.79 4 4.01 4 3.99-1.79 3.99-4V7h4V3h-6zm-1.99 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E");
}

.profile-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.settings-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'/%3E%3C/svg%3E");
}

.about-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}

.database-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E");
}
</style>
