<template>
  <div class="album-ranking-coverflow">
    <div class="header">
      <h1 class="title">Album Ranking
        <span class="subtitle">Rate your favorite albums</span>
        <button 
          @click="showToast('Coverflow Ranking', 'Swipe through albums and rate them as Like, Neutral, or Dislike.')"
          class="help-button"
          aria-label="Help">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </button>
      </h1>
    </div>
    
    <!-- Sign-up Prompt for Non-Logged-In Users (Minimized) -->
    <div v-if="!userStore.isLoggedInSimulation" class="login-prompt">
      <p>Create a free account to save your rankings</p>
      <div class="login-buttons">
        <button @click="login" class="sign-up-button">Sign Up</button>
        <button @click="login" class="login-button">Log In</button>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Coverflow Album Display -->
      <div class="carousel-container" v-if="rankingStore.availableAlbums.length > 0">
        <AlbumCoverflowCarousel 
          :albums="rankingStore.availableAlbums"
          @rate-album="handleAlbumRating"
        />
      </div>
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3>No Albums Available</h3>
        <p>There are no albums available to rank right now.</p>
      </div>
    </div>
    
    <!-- Ranking Results (Slide-in Panel) -->
    <div class="results-panel" :class="{ 'show': showResults }">
      <div class="results-header">
        <h2>Your Rankings</h2>
        <button @click="toggleResults" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="results-content">
        <!-- Liked Albums -->
        <div v-if="likedAlbums.length > 0" class="rating-group">
          <h3 class="liked-heading">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Liked ({{ likedAlbums.length }})
          </h3>
          <div class="album-grid">
            <div v-for="album in likedAlbums" :key="album.id" class="ranked-album">
              <img :src="album.coverImageUrl" :alt="album.title" class="album-thumbnail">
              <span class="album-name">{{ album.title }}</span>
            </div>
          </div>
        </div>
        
        <!-- Neutral Albums -->
        <div v-if="neutralAlbums.length > 0" class="rating-group">
          <h3 class="neutral-heading">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Neutral ({{ neutralAlbums.length }})
          </h3>
          <div class="album-grid">
            <div v-for="album in neutralAlbums" :key="album.id" class="ranked-album">
              <img :src="album.coverImageUrl" :alt="album.title" class="album-thumbnail">
              <span class="album-name">{{ album.title }}</span>
            </div>
          </div>
        </div>
        
        <!-- Disliked Albums -->
        <div v-if="dislikedAlbums.length > 0" class="rating-group">
          <h3 class="disliked-heading">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Disliked ({{ dislikedAlbums.length }})
          </h3>
          <div class="album-grid">
            <div v-for="album in dislikedAlbums" :key="album.id" class="ranked-album">
              <img :src="album.coverImageUrl" :alt="album.title" class="album-thumbnail">
              <span class="album-name">{{ album.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Floating Action Buttons -->
    <div class="fab-container">
      <button 
        @click="toggleResults" 
        class="fab results-fab"
        :class="{ 'has-results': hasRatings }"
        :disabled="!hasRatings">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>
      
      <button 
        @click="saveRankings"
        class="fab save-fab"
        :disabled="!hasRatings || !userStore.isLoggedInSimulation">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </button>
      
      <button 
        @click="resetRankings"
        class="fab reset-fab"
        :disabled="!hasRatings">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <router-link 
        to="/rank/albums/carousel"
        class="fab carousel-fab"
        title="Try Carousel Ranking">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
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
import staticAlbumsData from '@/data/static-albums.json';

const router = useRouter();
const userStore = useUserStore();
const rankingStore = useRankingStore();

// Track rated albums
const ratedAlbums = ref({});
const showResults = ref(false);

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

// Toggle results panel
const toggleResults = () => {
  showResults.value = !showResults.value;
};

// Handle album rating from the coverflow component
const handleAlbumRating = ({ album, rating }) => {
  ratedAlbums.value[album.id] = {
    ...album,
    rating
  };
  
  // Show a subtle toast notification
  showToast('Album Rated', `${album.title} rated`);
  
  // Auto-show results after rating a few albums
  if (Object.keys(ratedAlbums.value).length === 3 && !showResults.value) {
    setTimeout(() => {
      showResults.value = true;
    }, 500);
  }
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
  
  // Add disliked albums to bottom tiers (5)
  dislikedAlbums.value.forEach(album => {
    rankingStore.rankedTiers.tier5.push(album);
  });
};

// Save rankings
const saveRankings = () => {
  if (!hasRatings.value) return;
  
  // Convert ratings to tiers
  convertRatingsToTiers();
  
  // Save rankings
  rankingStore.saveRankingsToLocalStorage();
  
  // Show success message
  showToast('Success', 'Your album rankings have been saved!');
  
  // Navigate to results page
  router.push('/rank/albums');
};

// Reset rankings
const resetRankings = () => {
  if (!hasRatings.value) return;
  
  // Clear rated albums
  ratedAlbums.value = {};
  
  // Hide results panel
  showResults.value = false;
  
  // Show message
  showToast('Reset', 'Your rankings have been reset');
};

// Login
const login = () => {
  userStore.loginSimulation();
  showToast('Welcome', 'You are now logged in!');
};

// Show toast notification
const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    type: 'info',
    duration: 2000
  });
};

// Initialize albums if needed
onMounted(() => {
  if (rankingStore.availableAlbums.length === 0) {
    console.log('Initializing albums from static data in AlbumRankingCoverflowView');
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
});
</script>

<style scoped>
.album-ranking-coverflow {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 1rem;
}

.header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.help-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-button:hover {
  background-color: #e5e7eb;
  color: #4b5563;
}

.login-prompt {
  background-color: rgba(255, 251, 235, 0.8);
  border-radius: 8px;
  margin: 0.5rem 1rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(4px);
}

.login-prompt p {
  font-size: 0.875rem;
  color: #92400e;
  margin: 0;
}

.login-buttons {
  display: flex;
  gap: 0.5rem;
}

.sign-up-button, .login-button {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sign-up-button {
  background-color: #059669;
  color: white;
}

.sign-up-button:hover {
  background-color: #047857;
}

.login-button {
  background-color: #e5e7eb;
  color: #4b5563;
}

.login-button:hover {
  background-color: #d1d5db;
}

.main-content {
  padding: 1rem;
}

.carousel-container {
  margin-bottom: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.results-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 85%;
  max-width: 400px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.results-panel.show {
  right: 0;
}

.results-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
}

.results-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #e5e7eb;
  color: #4b5563;
}

.results-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.rating-group {
  margin-bottom: 1.5rem;
}

.liked-heading, .neutral-heading, .disliked-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.liked-heading {
  color: #059669;
}

.neutral-heading {
  color: #d97706;
}

.disliked-heading {
  color: #dc2626;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.ranked-album {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.album-thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.album-thumbnail:hover {
  transform: scale(1.05);
}

.album-name {
  font-size: 0.75rem;
  color: #4b5563;
  text-align: center;
  margin-top: 0.25rem;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fab-container {
  position: fixed;
  bottom: 80px;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 40;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-fab {
  background-color: #8b5cf6;
  color: white;
}

.results-fab.has-results {
  position: relative;
}

.results-fab.has-results::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

.results-fab:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: scale(1.05);
}

.save-fab {
  background-color: #059669;
  color: white;
}

.save-fab:hover:not(:disabled) {
  background-color: #047857;
  transform: scale(1.05);
}

.reset-fab {
  background-color: #f3f4f6;
  color: #4b5563;
}

.reset-fab:hover:not(:disabled) {
  background-color: #e5e7eb;
  transform: scale(1.05);
}

.carousel-fab {
  background-color: #f59e0b;
  color: white;
}

.carousel-fab:hover:not(:disabled) {
  background-color: #d97706;
  transform: scale(1.05);
}
</style>
