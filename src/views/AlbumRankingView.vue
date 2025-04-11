<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Your Favorite Albums 
      <button 
        @click="showToast('Album Ranking Help', 'This screen allows you to rank Taylor Swift albums by dragging them from the shelf into different tiers.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    <p class="mb-6 text-gray-600">Drag albums from the shelf to rank them in order of preference</p>
    
    <!-- Sign-up Prompt for Non-Logged-In Users -->
    <div v-if="!userStore.isLoggedInSimulation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div class="flex items-start">
        <div class="text-yellow-500 mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-yellow-800">Create a free account to save your rankings</h3>
          <p class="text-sm text-yellow-700 mt-1">You can create rankings without an account, but to save and share your rankings, you'll need to sign up.</p>
          <div class="mt-3 flex space-x-3">
            <button 
              @click="login"
              class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              Sign Up Free
            </button>
            <button 
              @click="login"
              class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tier Layout with Drag and Drop -->
    <div class="mb-8 space-y-6">
      <!-- Tier 1 -->
      <div class="border-2 border-green-500 rounded-lg p-4 bg-green-50">
        <h2 class="text-xl font-semibold mb-3 text-green-700">Tier 1</h2>
        <div class="flex justify-center min-h-[100px] items-center">
          <template v-for="(element, index) in rankingStore.rankedTiers.tier1" :key="index">
            <div class="album-item flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing m-1 relative">
              <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
              <div class="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded shadow-md">
                Top Album
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center">
                {{ element.title }}
              </div>
            </div>
          </template>
          <template v-if="rankingStore.rankedTiers.tier1.length === 0">
            <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-green-300 hover:bg-gray-100 transition-colors">
              <span class="text-gray-500 font-medium">Rank #1</span>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 2 -->
      <div class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <h2 class="text-xl font-semibold mb-3 text-blue-700">Tier 2</h2>
        <div class="flex justify-center min-h-[100px] items-center gap-4">
          <template v-for="(element, index) in rankingStore.rankedTiers.tier2" :key="index">
            <div class="album-item flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing m-1 relative">
              <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center">
                {{ element.title }}
              </div>
            </div>
          </template>
          <template v-if="rankingStore.rankedTiers.tier2.length === 0">
            <div class="flex justify-center space-x-4">
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-100 transition-colors">
                <span class="text-gray-500 font-medium">Rank #2-3</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 3 -->
      <div class="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
        <h2 class="text-xl font-semibold mb-3 text-yellow-700">Tier 3</h2>
        <div class="flex justify-center min-h-[100px] items-center gap-4 flex-wrap">
          <template v-for="(element, index) in rankingStore.rankedTiers.tier3" :key="index">
            <div class="album-item flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing m-1 relative">
              <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center">
                {{ element.title }}
              </div>
            </div>
          </template>
          <template v-if="rankingStore.rankedTiers.tier3.length === 0">
            <div class="flex justify-center space-x-4">
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-100 transition-colors">
                <span class="text-gray-500 font-medium">Rank #4-6</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 4 -->
      <div class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <h2 class="text-xl font-semibold mb-3 text-red-700">Tier 4</h2>
        <div class="flex justify-center min-h-[100px] items-center gap-4 flex-wrap">
          <template v-for="(element, index) in rankingStore.rankedTiers.tier4" :key="index">
            <div class="album-item flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing m-1 relative">
              <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center">
                {{ element.title }}
              </div>
            </div>
          </template>
          <template v-if="rankingStore.rankedTiers.tier4.length === 0">
            <div class="flex justify-center space-x-4">
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-100 transition-colors">
                <span class="text-gray-500 font-medium">Rank #7-9</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 5 -->
      <div class="border-2 border-purple-500 rounded-lg p-4 bg-purple-50">
        <h2 class="text-xl font-semibold mb-3 text-purple-700">Tier 5</h2>
        <div class="flex justify-center min-h-[100px] items-center gap-4">
          <template v-for="(element, index) in rankingStore.rankedTiers.tier5" :key="index">
            <div class="album-item flex-shrink-0 w-24 h-24 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing m-1 relative">
              <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
              <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center">
                {{ element.title }}
              </div>
            </div>
          </template>
          <template v-if="rankingStore.rankedTiers.tier5.length === 0">
            <div class="flex justify-center space-x-4">
              <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-purple-300 hover:bg-gray-100 transition-colors">
                <span class="text-gray-500 font-medium">Rank #10-11</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Album Shelf Area -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 transition-all duration-300 z-10" :class="{ 'h-20 overflow-hidden': isShelfCollapsed }">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">Album Shelf</h2>
        <button 
          @click="toggleShelf" 
          class="text-gray-500 hover:text-green-600 transition-colors">
          {{ isShelfCollapsed ? 'Expand ▼' : 'Collapse ▲' }}
        </button>
      </div>
      
      <div class="flex flex-wrap gap-4 py-2 min-h-[80px]">
        <template v-for="(element, index) in rankingStore.availableAlbums" :key="index">
          <div class="album-item flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105 relative">
            <img :src="element.coverImageUrl" :alt="element.title" class="w-full h-full object-cover rounded-lg">
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg text-center truncate">
              {{ element.title }}
            </div>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8 mb-24">
      <button 
        @click="saveRankings"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
        :class="{ 'opacity-75': !userStore.isLoggedInSimulation }"
      >
        <span v-if="userStore.isLoggedInSimulation">Save Rankings</span>
        <span v-else>Save Rankings (Login Required)</span>
        <svg v-if="!userStore.isLoggedInSimulation" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <button 
        @click="resetRankings"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Reset Rankings
      </button>
      
      <router-link 
        to="/rank/albums/coverflow"
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <span>Try Coverflow Ranking</span>
        <span class="ml-2 px-2 py-0.5 bg-white text-purple-700 text-xs rounded-full">New</span>
      </router-link>
      
      <button 
        @click="goToSongRanking"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors"
      >
        Continue to Song Ranking
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';
import staticAlbumsData from '@/data/static-albums.json';

// Store and router setup
const userStore = useUserStore();
const rankingStore = useRankingStore();
const router = useRouter();
const toast = toastService;

// Local state
const isShelfCollapsed = ref(false);
const isTouchDevice = ref(false);

// Initialize on component mount
onMounted(() => {
  // Detect touch devices for better mobile handling
  isTouchDevice.value = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  // Load static albums into the store
  rankingStore.initializeStaticAlbums(staticAlbumsData);
  
  // Show help toast for first-time users
  if (rankingStore.availableAlbums.length === staticAlbumsData.length) {
    setTimeout(() => {
      showToast('View Albums', 'This is a simplified view of albums. Drag-and-drop functionality has been removed.');
    }, 1000);
  }
});

// Auto-save rankings when they change
watch(() => [rankingStore.rankedTiers, rankingStore.availableAlbums], () => {
  rankingStore.saveRankingsToLocalStorage();
}, { deep: true });

// Toggle shelf collapse
function toggleShelf() {
  isShelfCollapsed.value = !isShelfCollapsed.value;
}

// Save rankings
function saveRankings() {
  if (userStore.isLoggedInSimulation) {
    // Save to API if logged in
    rankingStore.saveRankingsToApi(userStore.user.id)
      .then(() => {
        showToast('Success', 'Your album rankings have been saved!');
      })
      .catch(() => {
        showToast('Error', 'There was a problem saving your rankings. Please try again.');
      });
  } else {
    // Prompt to login
    showToast('Login Required', 'Please log in or sign up to save your rankings.');
  }
}

// Reset rankings
function resetRankings() {
  if (confirm('Are you sure you want to reset all your rankings? This cannot be undone.')) {
    rankingStore.resetRankings(staticAlbumsData);
    showToast('Rankings Reset', 'Your album rankings have been reset.');
  }
}

// Navigate to song ranking
function goToSongRanking() {
  router.push('/rank/songs');
}

// Login function
function login() {
  userStore.setIsLoggedInSimulation(true);
  showToast('Logged In', 'You are now logged in and can save your rankings.');
}

// Show toast notification
function showToast(title, message) {
  toast.show({
    title,
    message,
    type: 'info',
    timeout: 3000
  });
}
</script>

<style scoped>
/* Album hover effect */
.album-item:hover {
  transform: translateY(-2px);
}

/* Drag ghost styling */
.ghost-album {
  opacity: 0.5;
  background: #c8ebfb;
  border: 2px dashed #0ea5e9;
}

/* Info icon */
.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .album-item {
    width: 18vw;
    height: 18vw;
    max-width: 80px;
    max-height: 80px;
  }
}
</style>
