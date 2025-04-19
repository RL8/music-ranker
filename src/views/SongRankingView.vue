<template>
  <div class="p-4" :style="dynamicBackgroundStyle">
    <h1 class="text-2xl font-bold mb-4">Rank Your Favorite Songs 
      <button 
        @click="showToast('Song Ranking Help', 'This screen allows you to rank songs from Taylor Swift albums by dragging them from the shelf into different tiers.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    
    <!-- Album Selection Section -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-3">Select an Album</h2>
      <div class="album-carousel relative">
        <div class="flex overflow-x-auto py-2 space-x-4 pb-1 scrollbar-hide">
          <div v-for="album in rankingStore.availableAlbums" :key="album.id" 
               class="flex-shrink-0 w-24 h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md relative"
               :class="selectedAlbumId === album.id ? 'border-2 border-green-500 shadow-md' : ''"
               :style="{ background: `linear-gradient(to bottom right, ${album.color}40, ${album.color}10)` }"
               @click="selectAlbum(album.id)">
            <img :src="album.coverImageUrl" :alt="album.title" class="w-full h-full object-cover rounded-lg opacity-90">
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-lg text-center">
              {{ album.title }}
            </div>
            <div v-if="selectedAlbumId === album.id" class="absolute top-0 right-0 bg-green-500 text-white text-xs p-1 rounded-full w-5 h-5 flex items-center justify-center">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
    
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
    
    <!-- Album Info Section -->
    <div v-if="selectedAlbum" class="mb-6 bg-white bg-opacity-80 rounded-lg p-4 shadow">
      <div class="flex items-center">
        <div class="w-16 h-16 rounded-lg overflow-hidden mr-4">
          <img :src="selectedAlbum.coverImageUrl" :alt="selectedAlbum.title" class="w-full h-full object-cover">
        </div>
        <div>
          <h3 class="font-bold text-lg">{{ selectedAlbum.title }}</h3>
          <p class="text-sm text-gray-600">{{ selectedAlbum.year }} • {{ songCount }} songs</p>
          <p class="text-sm mt-1" :style="{ color: selectedAlbum.color }">{{ selectedAlbum.era }}</p>
        </div>
      </div>
    </div>
    
    <!-- Tier Layout with Drag and Drop -->
    <div class="mb-8 space-y-6">
      <!-- Tier 1 -->
      <div class="border-2 border-green-500 rounded-lg p-4 bg-green-50">
        <h2 class="text-xl font-semibold mb-3 text-green-700">Tier 1</h2>
        <div class="flex flex-col space-y-2">
          <template v-for="(element, index) in rankedTiers.tier1" :key="index">
            <div class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing relative">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span class="text-green-700 font-bold">{{ index + 1 }}</span>
                </div>
                <span class="text-gray-700">{{ element.title }}</span>
              </div>
              <div class="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded shadow-md">
                Top Song
              </div>
            </div>
          </template>
          <template v-if="rankedTiers.tier1.length === 0">
            <div class="bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-green-300 hover:bg-gray-50 transition-colors">
              <span class="text-gray-700 font-medium">Rank #1: Your favorite song</span>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 2 -->
      <div class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <h2 class="text-xl font-semibold mb-3 text-blue-700">Tier 2</h2>
        <div class="flex flex-col space-y-2">
          <template v-for="(element, index) in rankedTiers.tier2" :key="index">
            <div class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span class="text-blue-700 font-bold">{{ index + 2 }}</span>
                </div>
                <span class="text-gray-700">{{ element.title }}</span>
              </div>
            </div>
          </template>
          <template v-if="rankedTiers.tier2.length < 2">
            <div class="bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-50 transition-colors">
              <span class="text-gray-700 font-medium">Rank #{{ rankedTiers.tier2.length + 2 }}: Great songs</span>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 3 -->
      <div class="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
        <h2 class="text-xl font-semibold mb-3 text-yellow-700">Tier 3</h2>
        <div class="flex flex-col space-y-2">
          <template v-for="(element, index) in rankedTiers.tier3" :key="index">
            <div class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <span class="text-yellow-700 font-bold">{{ index + 4 }}</span>
                </div>
                <span class="text-gray-700">{{ element.title }}</span>
              </div>
            </div>
          </template>
          <template v-if="rankedTiers.tier3.length < 3">
            <div class="bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-50 transition-colors">
              <span class="text-gray-700 font-medium">Rank #{{ rankedTiers.tier3.length + 4 }}: Good songs</span>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Tier 4 -->
      <div class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <h2 class="text-xl font-semibold mb-3 text-red-700">Tier 4</h2>
        <div class="flex flex-col space-y-2">
          <template v-for="(element, index) in rankedTiers.tier4" :key="index">
            <div class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <span class="text-red-700 font-bold">{{ index + 7 }}</span>
                </div>
                <span class="text-gray-700">{{ element.title }}</span>
              </div>
            </div>
          </template>
          <template v-if="rankedTiers.tier4.length < 3">
            <div class="bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-50 transition-colors">
              <span class="text-gray-700 font-medium">Rank #{{ rankedTiers.tier4.length + 7 }}: Average songs</span>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Song Shelf Area -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-300 p-4 transition-all duration-300 z-10" :class="{ 'h-20 overflow-hidden': isShelfCollapsed }">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">Song Shelf</h2>
        <button 
          @click="toggleShelf" 
          class="text-gray-500 hover:text-green-600 transition-colors">
          {{ isShelfCollapsed ? 'Expand ▼' : 'Collapse ▲' }}
        </button>
      </div>
      
      <div class="flex flex-col space-y-2 max-h-60 overflow-y-auto">
        <template v-if="availableSongs.length > 0">
          <div v-for="(song, index) in availableSongs" :key="index" 
               class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:shadow-lg">
            <span class="text-gray-700">{{ song.title }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-center py-4 text-gray-500">
            <p>All songs have been ranked!</p>
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
        to="/rank/songs/carousel"
        class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center"
      >
        <span>Try Carousel Ranking</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 110 4v2a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 110-4h-2a2 2 0 00-2 2V5a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useRankingStore } from '@/store/rankingStore';
import { useUserStore } from '@/store/userStore';
import toastService from '@/services/toastService';
import staticAlbumsData from '@/data/static-albums.json';

const router = useRouter();
const rankingStore = useRankingStore();
const userStore = useUserStore();

// State
const selectedAlbumId = ref(null);
const isShelfCollapsed = ref(false);
const rankedTiers = ref({
  tier1: [],
  tier2: [],
  tier3: [],
  tier4: []
});
const availableSongs = ref([]);

// Computed properties
const selectedAlbum = computed(() => {
  if (!selectedAlbumId.value) return null;
  return rankingStore.availableAlbums.find(album => album.id === selectedAlbumId.value);
});

const songCount = computed(() => {
  if (!selectedAlbum.value || !selectedAlbum.value.songs) return 0;
  return selectedAlbum.value.songs.length;
});

const dynamicBackgroundStyle = computed(() => {
  if (!selectedAlbum.value) return {};
  return {
    background: `linear-gradient(to bottom, ${selectedAlbum.value.bgColor || '#f8f8f8'}, #ffffff)`
  };
});

// Methods
const selectAlbum = (albumId) => {
  selectedAlbumId.value = albumId;
  loadSongsForAlbum(albumId);
  showToast('Album Selected', `You selected ${selectedAlbum.value.title}. Songs from this album are now available for ranking.`);
};

const loadSongsForAlbum = (albumId) => {
  const album = rankingStore.availableAlbums.find(a => a.id === albumId);
  if (!album || !album.songs) {
    availableSongs.value = [];
    return;
  }
  
  // Convert song strings to objects with IDs for easier tracking
  availableSongs.value = album.songs.map((title, index) => ({
    id: `song-${index + 1}`,
    title,
    albumId
  }));
  
  // Reset rankings for this album
  rankedTiers.value = {
    tier1: [],
    tier2: [],
    tier3: [],
    tier4: []
  };
};

const toggleShelf = () => {
  isShelfCollapsed.value = !isShelfCollapsed.value;
};

const saveRankings = () => {
  if (!userStore.isLoggedInSimulation) {
    showToast('Login Required', 'Please log in to save your rankings.');
    return;
  }
  
  // Here we would save the rankings to the store/backend
  const allRankedSongs = [
    ...rankedTiers.value.tier1,
    ...rankedTiers.value.tier2,
    ...rankedTiers.value.tier3,
    ...rankedTiers.value.tier4
  ];
  
  if (allRankedSongs.length === 0) {
    showToast('No Rankings', 'Please rank at least one song before saving.');
    return;
  }
  
  // Mock implementation - in a real app this would save to the backend
  showToast('Rankings Saved', `Your rankings for ${selectedAlbum.value.title} have been saved.`);
};

const resetRankings = () => {
  if (selectedAlbumId.value) {
    loadSongsForAlbum(selectedAlbumId.value);
    showToast('Rankings Reset', 'Your song rankings have been reset.');
  }
};

const login = () => {
  userStore.isLoggedInSimulation = true;
  showToast('Logged In', 'You are now logged in and can save your rankings.');
};

const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    duration: 3000
  });
};

// Initialize on component mount
onMounted(() => {
  // If we have albums available, select the first one by default
  if (rankingStore.availableAlbums.length > 0) {
    selectAlbum(rankingStore.availableAlbums[0].id);
  } else {
    // Initialize with data from static-albums.json if needed
    if (rankingStore.availableAlbums.length === 0) {
      console.log('Initializing albums from static data in SongRankingView');
      try {
        // Log the imported data for debugging
        console.log('Static albums data structure:', 
          Object.keys(staticAlbumsData).length > 0 ? 'Object with keys' : 'Array with length ' + staticAlbumsData.length);
        
        // Ensure we're passing the correct data structure
        const albumsToInitialize = Array.isArray(staticAlbumsData) ? staticAlbumsData : 
          (staticAlbumsData.default && Array.isArray(staticAlbumsData.default)) ? staticAlbumsData.default : [];
        
        rankingStore.initializeStaticAlbums(albumsToInitialize);
      } catch (error) {
        console.error('Error initializing albums:', error);
      }
    }
    selectAlbum(staticAlbumsData[0].id);
  }
});
</script>

<style scoped>
/* Song hover effect */
.song-item:hover {
  transform: translateY(-2px);
}

/* Info icon */
.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'%3E%3C/path%3E%3C/svg%3E");
}

/* Hide scrollbar for album carousel */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
