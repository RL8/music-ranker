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
      class="fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform overflow-y-auto"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
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
      <nav class="flex-1 pt-4 pb-4 overflow-y-auto">
        <router-link 
          to="/" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path === '/' }"
          @click="mobileClose"
        >
          <i class="home-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Home</span>
        </router-link>
        
        <router-link 
          to="/dashboard" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path === '/dashboard' }"
          @click="mobileClose"
        >
          <i class="dashboard-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Dashboard</span>
        </router-link>
        
        <router-link 
          to="/music" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/music') }"
          @click="mobileClose"
        >
          <i class="music-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Music Library</span>
        </router-link>
        
        <!-- Divider -->
        <div class="mx-6 my-4 border-t border-gray-200"></div>
        
        <router-link 
          to="/profile" 
          class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/profile') }"
          @click="mobileClose"
        >
          <i class="profile-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">Profile</span>
        </router-link>
        
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
          :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/about') }"
          @click="mobileClose"
        >
          <i class="about-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          <span class="ml-3 font-medium">About Us</span>
        </router-link>
        
        <!-- Admin Dashboard (Admin Only) -->
        <template v-if="adminViewEnabled">
          <!-- Divider before Admin section if it's visible -->
          <div class="mx-6 my-4 border-t border-gray-200"></div>
          
          <router-link 
            to="/admin" 
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            :class="{ 'bg-green-50 text-green-600': $route.path.startsWith('/admin') }"
            @click="mobileClose"
          >
            <i class="admin-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
            <span class="ml-3 font-medium">Admin Dashboard</span>
          </router-link>
        </template>
      </nav>
      
      <!-- User Info (bottom of sidebar) -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <i class="profile-icon w-6 h-6 bg-center bg-no-repeat bg-contain text-gray-600"></i>
            </div>
            <div class="ml-3">
              <p class="font-medium text-gray-800">{{ userStore.isLoggedInSimulation ? 'Taylor Fan' : 'Guest User' }}</p>
              <p class="text-sm text-gray-500">{{ userStore.isLoggedInSimulation ? 'Logged In' : 'Not Logged In' }}</p>
            </div>
          </div>
          
          <!-- Login/Profile Button -->
          <button 
            v-if="!userStore.isLoggedInSimulation" 
            @click="navigateToLogin"
            class="ml-2 px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            Login
          </button>
          <button 
            v-else 
            @click="navigateToProfile"
            class="ml-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Profile
          </button>
        </div>
        
        <!-- Admin Toggle -->
        <div class="mt-3 flex items-center justify-between">
          <label class="inline-flex items-center cursor-pointer">
            <span class="mr-2 text-sm text-gray-600">Admin View</span>
            <div class="relative">
              <input type="checkbox" v-model="adminViewEnabled" class="sr-only peer" @change="toggleAdminView">
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </div>
          </label>
        </div>
      </div>
    </aside>
    
    <!-- Toggle Button (optimized for mobile) -->
    <button 
      class="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-green-600 transition-colors"
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
import { useRouter } from 'vue-router';

export default {
  name: 'Sidebar',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    toggleSidebar: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const userStore = useUserStore();
    const router = useRouter();
    const sidebarWidth = ref(250); // Default sidebar width
    const adminViewEnabled = ref(false);

    // Close sidebar on mobile when navigating
    const mobileClose = () => {
      if (window.innerWidth < 768) { // Only on mobile
        props.toggleSidebar();
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // On desktop, sidebar can stay open
      } else {
        // On mobile, close sidebar if window resizes
        if (props.isOpen) {
          props.toggleSidebar();
        }
      }
    };

    // Toggle admin view
    const toggleAdminView = () => {
      // Save admin view state to localStorage
      localStorage.setItem('adminViewEnabled', adminViewEnabled.value);
    };

    // Navigate to login page
    const navigateToLogin = () => {
      // Close the sidebar on mobile
      mobileClose();
      // Use router to navigate to login page
      router.push('/login');
    };

    // Navigate to profile page
    const navigateToProfile = () => {
      // Close the sidebar on mobile
      mobileClose();
      // Use router to navigate to profile page
      router.push('/profile');
    };

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('resize', handleResize);
      
      // Initialize admin view state from localStorage
      const savedAdminView = localStorage.getItem('adminViewEnabled');
      if (savedAdminView !== null) {
        adminViewEnabled.value = savedAdminView === 'true';
      }
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      userStore,
      sidebarWidth,
      mobileClose,
      adminViewEnabled,
      toggleAdminView,
      navigateToLogin,
      navigateToProfile
    };
  }
};
</script>

<style scoped>
/* SVG icons as background images */
.music-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.profile-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E");
}

.settings-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E");
}

.about-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

.admin-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' /%3E%3C/svg%3E");
}

.database-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' /%3E%3C/svg%3E");
}

.artist-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5.121 17.804A13.937 13.937 0 0112 16c3.105 0 5.939.942 8.151 2.746a2.694 2.694 0 000 4.308c-3.046 1.705-6.148 2.746-9.296 2.746a13.987 13.987 0 01-4.872 0c-2.21 0-4.165-.481-5.875-1.381z' /%3E%3C/svg%3E");
}

.dashboard-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' /%3E%3C/svg%3E");
}

.home-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' /%3E%3C/svg%3E");
}
</style>
