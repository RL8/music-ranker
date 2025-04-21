<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 pl-10 md:pl-0">Music Library</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Music Navigation Cards -->
      <div v-for="(item, index) in musicCategories" :key="index" 
           class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <router-link :to="item.path" class="block">
          <div class="p-5">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i :class="item.icon" class="w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ item.title }}</h3>
            </div>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
          <div class="bg-gray-50 px-5 py-3 border-t border-gray-100">
            <span class="text-green-600 text-sm font-medium flex items-center">
              Explore
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div v-if="recentActivity.length === 0" class="text-gray-500 text-center py-4">
          No recent activity to display
        </div>
        <div v-for="(activity, index) in recentActivity" :key="index" class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mr-3">
              <i :class="activity.icon" class="w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
            </div>
            <div>
              <p class="font-medium text-gray-800">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();

// Music categories with descriptions
const musicCategories = [
  {
    title: 'Eras',
    path: '/music/eras',
    description: 'Explore and rank albums by musical era',
    icon: 'album-icon'
  },
  {
    title: 'Songs',
    path: '/music/songs',
    description: 'Browse and rank individual songs',
    icon: 'song-icon'
  },
  {
    title: 'Artists',
    path: '/music/artists',
    description: 'Discover artists and their discographies',
    icon: 'artist-icon'
  }
];

// Recent activity (placeholder data)
const recentActivity = ref([
  // This would typically be populated from an API or store
  // For now, using placeholder data
]);

// Check if user is logged in to show personalized content
if (userStore.isLoggedInSimulation) {
  recentActivity.value = [
    {
      title: 'You ranked Midnights as your #1 album',
      timestamp: '2 days ago',
      icon: 'album-icon'
    },
    {
      title: 'You added 3 songs to your favorites',
      timestamp: '5 days ago',
      icon: 'song-icon'
    }
  ];
}
</script>

<style scoped>
/* SVG icons as background images */
.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.artist-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E");
}
</style>
