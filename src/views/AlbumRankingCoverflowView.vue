<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Albums with Coverflow 
      <button 
        @click="showToast('Coverflow Ranking Help', 'This screen allows you to rank Taylor Swift albums using a coverflow interface. Swipe through albums and rate them.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    <p class="mb-6 text-gray-600">Swipe through albums and rank them based on your preference</p>
    
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
    
    <!-- Coverflow Album Display -->
    <div class="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 mb-8">
      <div v-if="rankingStore.availableAlbums.length > 0">
        <AlbumCoverflowCarousel 
          :albums="rankingStore.availableAlbums"
          @rate-album="handleAlbumRating"
        />
      </div>
      <div v-else class="text-center py-8">
        <div class="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-800 mb-2">No Albums Available</h3>
        <p class="text-gray-600 mb-4">There are no albums available to rank. Please check back later.</p>
      </div>
    </div>
    
    <!-- Ranking Results -->
    <div v-if="Object.values(ratedAlbums).length > 0" class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Your Rankings</h2>
      
      <!-- Liked Albums -->
      <div v-if="likedAlbums.length > 0" class="mb-6">
        <h3 class="font-medium text-green-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Liked Albums
        </h3>
        <div class="flex flex-wrap gap-2">
          <div v-for="album in likedAlbums" :key="album.id" class="w-16 h-16 relative">
            <img :src="album.coverImageUrl" :alt="album.title" class="w-full h-full object-cover rounded">
            <div class="absolute inset-0 bg-black bg-opacity-20 rounded"></div>
          </div>
        </div>
      </div>
      
      <!-- Neutral Albums -->
      <div v-if="neutralAlbums.length > 0" class="mb-6">
        <h3 class="font-medium text-yellow-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Neutral Albums
        </h3>
        <div class="flex flex-wrap gap-2">
          <div v-for="album in neutralAlbums" :key="album.id" class="w-16 h-16 relative">
            <img :src="album.coverImageUrl" :alt="album.title" class="w-full h-full object-cover rounded">
            <div class="absolute inset-0 bg-black bg-opacity-20 rounded"></div>
          </div>
        </div>
      </div>
      
      <!-- Disliked Albums -->
      <div v-if="dislikedAlbums.length > 0" class="mb-6">
        <h3 class="font-medium text-red-700 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Disliked Albums
        </h3>
        <div class="flex flex-wrap gap-2">
          <div v-for="album in dislikedAlbums" :key="album.id" class="w-16 h-16 relative">
            <img :src="album.coverImageUrl" :alt="album.title" class="w-full h-full object-cover rounded">
            <div class="absolute inset-0 bg-black bg-opacity-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8 mb-24">
      <button 
        @click="saveRankings"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': !hasRatings || !userStore.isLoggedInSimulation }"
        :disabled="!hasRatings || !userStore.isLoggedInSimulation"
      >
        <span v-if="userStore.isLoggedInSimulation">Save Rankings</span>
        <span v-else>Save Rankings (Login Required)</span>
      </button>
      
      <button 
        @click="resetRankings"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': !hasRatings }"
        :disabled="!hasRatings"
      >
        Reset Rankings
      </button>
      
      <router-link 
        to="/rank/albums"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors text-center"
      >
        Back to Traditional Ranking
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';
import AlbumCoverflowCarousel from '@/components/AlbumCoverflowCarousel.vue';

const router = useRouter();
const userStore = useUserStore();
const rankingStore = useRankingStore();

// Track rated albums
const ratedAlbums = ref({});

// Computed properties for different rating categories
const likedAlbums = computed(() => {
  return Object.values(ratedAlbums.value).filter(album => album.rating === 'like');
});

const neutralAlbums = computed(() => {
  return Object.values(ratedAlbums.value).filter(album => album.rating === 'neutral');
});

const dislikedAlbums = computed(() => {
  return Object.values(ratedAlbums.value).filter(album => album.rating === 'dislike');
});

const hasRatings = computed(() => {
  return Object.keys(ratedAlbums.value).length > 0;
});

// Handle album rating from the coverflow component
const handleAlbumRating = ({ album, rating }) => {
  ratedAlbums.value[album.id] = {
    ...album,
    rating
  };
  
  showToast('Album Rated', `You ${rating}d "${album.title}"`);
};

// Convert coverflow ratings to tier-based rankings
const convertRatingsToTiers = () => {
  // Clear existing tiers
  Object.keys(rankingStore.rankedTiers).forEach(tier => {
    rankingStore.rankedTiers[tier] = [];
  });
  
  // Add liked albums to top tiers (1-2)
  likedAlbums.value.forEach((album, index) => {
    if (index === 0) {
      rankingStore.rankedTiers.tier1.push(album);
    } else if (index < 3) {
      rankingStore.rankedTiers.tier2.push(album);
    } else {
      rankingStore.rankedTiers.tier3.push(album);
    }
  });
  
  // Add neutral albums to middle tiers (3-4)
  neutralAlbums.value.forEach((album, index) => {
    if (index < 3) {
      rankingStore.rankedTiers.tier3.push(album);
    } else {
      rankingStore.rankedTiers.tier4.push(album);
    }
  });
  
  // Add disliked albums to bottom tier (5)
  dislikedAlbums.value.forEach(album => {
    rankingStore.rankedTiers.tier5.push(album);
  });
  
  // Update available albums
  rankingStore.availableAlbums = rankingStore.availableAlbums.filter(album => 
    !Object.keys(ratedAlbums.value).includes(album.id.toString())
  );
};

const saveRankings = () => {
  if (!hasRatings.value) {
    showToast('No Rankings', 'Please rate some albums before saving.');
    return;
  }
  
  if (!userStore.isLoggedInSimulation) {
    showToast('Login Required', 'Please log in to save your rankings.');
    return;
  }
  
  // Convert coverflow ratings to tier-based rankings
  convertRatingsToTiers();
  
  // Save rankings using the existing store method
  rankingStore.saveRankingsToLocalStorage();
  
  showToast('Rankings Saved', 'Your album rankings have been saved successfully.');
};

const resetRankings = () => {
  if (!hasRatings.value) {
    showToast('No Rankings', 'You haven\'t rated any albums yet.');
    return;
  }
  
  // Reset the rated albums
  ratedAlbums.value = {};
  
  showToast('Rankings Reset', 'Your coverflow rankings have been reset.');
};

const login = () => {
  userStore.setIsLoggedInSimulation(true);
  showToast('Logged In', 'You are now logged in.');
};

const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    duration: 3000
  });
};

// Initialize albums if needed
onMounted(() => {
  if (rankingStore.availableAlbums.length === 0) {
    // If no albums are available, initialize with static data
    rankingStore.initializeStaticAlbums([
      { id: 1, title: 'Taylor Swift', coverImageUrl: 'https://via.placeholder.com/300x300?text=Taylor+Swift', year: '2006' },
      { id: 2, title: 'Fearless', coverImageUrl: 'https://via.placeholder.com/300x300?text=Fearless', year: '2008' },
      { id: 3, title: 'Speak Now', coverImageUrl: 'https://via.placeholder.com/300x300?text=Speak+Now', year: '2010' },
      { id: 4, title: 'Red', coverImageUrl: 'https://via.placeholder.com/300x300?text=Red', year: '2012' },
      { id: 5, title: '1989', coverImageUrl: 'https://via.placeholder.com/300x300?text=1989', year: '2014' },
      { id: 6, title: 'Reputation', coverImageUrl: 'https://via.placeholder.com/300x300?text=Reputation', year: '2017' },
      { id: 7, title: 'Lover', coverImageUrl: 'https://via.placeholder.com/300x300?text=Lover', year: '2019' },
      { id: 8, title: 'Folklore', coverImageUrl: 'https://via.placeholder.com/300x300?text=Folklore', year: '2020' },
      { id: 9, title: 'Evermore', coverImageUrl: 'https://via.placeholder.com/300x300?text=Evermore', year: '2020' },
      { id: 10, title: 'Midnights', coverImageUrl: 'https://via.placeholder.com/300x300?text=Midnights', year: '2022' },
      { id: 11, title: 'The Tortured Poets Department', coverImageUrl: 'https://via.placeholder.com/300x300?text=TTPD', year: '2023' }
    ]);
  }
});
</script>

<style scoped>
.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}
</style>
