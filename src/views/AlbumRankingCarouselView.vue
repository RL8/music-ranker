<template>
  <div class="album-ranking-carousel" :style="dynamicBackgroundStyle">
    <!-- Top Section: Instructions and Status -->
    <div class="top-section">
      <div class="header-bar">
        <h1 class="title">Album Ranker</h1>
        <div class="navigation-actions">
          <button 
            @click="showToast('Album Ranking Help', 'Swipe through albums and rank them in your preferred order.')"
            class="nav-button help-button"
            aria-label="Help">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            @click="toggleRankedList"
            class="nav-button"
            aria-label="Toggle ranked list">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div class="status-bar">
        <div class="progress-indicator">
          <div class="progress-text">{{ rankedAlbums.length }} of {{ totalAlbums }} ranked</div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <div class="album-emoji" v-if="currentAlbum">
          {{ getAlbumEmoji(currentAlbum) }}
        </div>
      </div>
    </div>

    <!-- Middle Section: Ranked Albums List -->
    <div class="middle-section" :class="{ 'expanded': showRankedList }">
      <div class="section-header" @click="toggleRankedList">
        <h2>Your Ranked Albums</h2>
        <button class="toggle-button">
          {{ showRankedList ? '▲ Hide' : '▼ Show' }}
        </button>
      </div>
      
      <transition name="slide">
        <div class="ranked-albums-container" v-if="showRankedList">
          <div class="empty-state" v-if="rankedAlbums.length === 0">
            <p>You haven't ranked any albums yet. Use the carousel below to start ranking!</p>
          </div>
          <draggable 
            v-else
            v-model="rankedAlbums" 
            item-key="id"
            class="ranked-albums-list"
            handle=".drag-handle"
            @end="saveRankings"
          >
            <template #item="{ element, index }">
              <div 
                class="ranked-album-card" 
                :style="{ 
                  '--album-color': element.color || '#333',
                  '--album-gradient': `linear-gradient(135deg, ${element.color || '#333'}, transparent)`
                }"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="album-thumbnail">
                  <img :src="element.coverImageUrl" :alt="element.title">
                </div>
                <div class="album-info">
                  <div class="album-title">{{ element.title }}</div>
                  <div class="album-year">{{ element.year }}</div>
                </div>
                <div class="album-actions">
                  <button class="drag-handle" aria-label="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                    </svg>
                  </button>
                  <button @click="removeFromRanking(element)" class="remove-button" aria-label="Remove from ranking">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </transition>
    </div>

    <!-- Bottom Section: Album Carousel -->
    <div class="bottom-section">
      <div class="carousel-container">
        <!-- Only render Swiper when we have enough albums -->
        <template v-if="rankingStore.availableAlbums.length >= 3">
          <swiper
            class="album-carousel"
            :modules="swiperModules"
            :effect="'coverflow'"
            :grab-cursor="true"
            :centered-slides="true"
            :slides-per-view="'auto'"
            :loop="true"
            :coverflow-effect="{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            }"
            @swiper="onSwiper"
            @slideChange="onSlideChange"
          >
            <swiper-slide 
              v-for="album in rankingStore.availableAlbums" 
              :key="album.id"
              class="album-slide"
              :class="{ 'ranked': isAlbumRanked(album) }"
            >
              <div 
                class="album-card"
                :style="{ 
                  '--album-color': album.color || '#333',
                  '--album-shadow-color': album.color || 'rgba(0,0,0,0.3)'
                }"
              >
                <img 
                  :src="album.coverImageUrl" 
                  :alt="album.title" 
                  class="album-cover"
                  loading="lazy"
                />
                <div class="album-title-overlay">{{ album.title }}</div>
                <div v-if="isAlbumRanked(album)" class="ranked-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </template>
        
        <!-- Placeholder when not enough albums -->
        <div v-else class="album-carousel-placeholder">
          <div class="placeholder-message">
            <svg xmlns="http://www.w3.org/2000/svg" class="placeholder-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <p>Loading albums...</p>
            <p class="placeholder-subtext">Please wait while we prepare your music collection.</p>
          </div>
        </div>
        
        <div class="carousel-controls">
          <button 
            class="control-button prev-button" 
            @click="prevSlide"
            aria-label="Previous album"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            class="control-button rank-button" 
            @click="addToRanking(currentAlbum)"
            :disabled="!currentAlbum || isAlbumRanked(currentAlbum)"
          >
            {{ isAlbumRanked(currentAlbum) ? 'Already Ranked' : 'Add to Ranking' }}
          </button>
          
          <button 
            class="control-button next-button" 
            @click="nextSlide"
            aria-label="Next album"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div class="bottom-actions">
          <button 
            @click="saveRankings"
            class="bottom-action-button save-button"
            :disabled="rankedAlbums.length === 0 || !userStore.isLoggedInSimulation">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293z" />
            </svg>
            <span>Save Rankings</span>
          </button>
          
          <button 
            @click="resetRankings"
            class="bottom-action-button reset-button"
            :disabled="rankedAlbums.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            <span>Reset Rankings</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import draggable from 'vuedraggable';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const router = useRouter();
const userStore = useUserStore();
const rankingStore = useRankingStore();

// State variables
const swiperInstance = ref(null);
const currentIndex = ref(0);
const showRankedList = ref(false);
const rankedAlbums = ref([]);
const swiperModules = [EffectCoverflow, Pagination];

// Initialize from the store if available
onMounted(() => {
  // Initialize albums if needed
  if (rankingStore.availableAlbums.length === 0) {
    // Load static album data
    import('@/data/static-albums.json').then(albumsData => {
      rankingStore.initializeStaticAlbums(albumsData.default);
    });
  }
  
  // Initialize ranked albums from any existing rankings
  const existingRankings = [];
  Object.values(rankingStore.rankedTiers).forEach(tier => {
    existingRankings.push(...tier);
  });
  
  if (existingRankings.length > 0) {
    rankedAlbums.value = [...existingRankings];
    showRankedList.value = true;
  }
});

// Computed properties
const unrankedAlbums = computed(() => {
  return rankingStore.availableAlbums.filter(album => 
    !rankedAlbums.value.some(rankedAlbum => rankedAlbum.id === album.id)
  );
});

const shouldEnableLoop = computed(() => {
  // Only enable loop mode when we have enough albums (3 or more is typically enough for Swiper)
  // Also check the flag from the store that indicates if there are enough albums
  return rankingStore.availableAlbums.length >= 3 && !rankingStore.notEnoughAlbumsForLoop;
});

const currentAlbum = computed(() => {
  if (rankingStore.availableAlbums.length === 0) return null;
  if (!swiperInstance.value) return rankingStore.availableAlbums[0];
  const index = swiperInstance.value.activeIndex;
  // Handle loop mode index adjustment
  const realIndex = swiperInstance.value.realIndex;
  return rankingStore.availableAlbums[realIndex] || rankingStore.availableAlbums[0];
});

const totalAlbums = computed(() => {
  return rankingStore.availableAlbums.length;
});

const progressPercentage = computed(() => {
  return (rankedAlbums.value.length / totalAlbums.value) * 100;
});

const dynamicBackgroundStyle = computed(() => {
  if (!currentAlbum.value) return {};
  
  const albumColor = currentAlbum.value.color || '#333';
  const lighterColor = adjustColor(albumColor, 40);
  
  return {
    '--album-primary-color': albumColor,
    '--album-secondary-color': lighterColor,
    background: `linear-gradient(135deg, ${albumColor}22, ${lighterColor}55)`
  };
});

// Helper functions
function adjustColor(color, amount) {
  // Simple function to lighten a hex color
  if (!color.startsWith('#')) return color;
  
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);
  
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getAlbumEmoji(album) {
  // Map albums to appropriate emojis based on their characteristics
  if (!album) return '🎵';
  
  const title = album.title.toLowerCase();
  
  if (title.includes('taylor swift')) return '🤠'; // Cowboy hat for Taylor Swift album
  if (title.includes('fearless')) return '✨';
  if (title.includes('speak now')) return '💜';
  if (title.includes('red')) return '❤️';
  if (title.includes('1989')) return '🌃';
  if (title.includes('reputation')) return '🐍';
  if (title.includes('lover')) return '💕';
  if (title.includes('folklore')) return '🌲';
  if (title.includes('evermore')) return '🍂';
  if (title.includes('midnights')) return '🌙';
  if (title.includes('tortured')) return '📜'; // Scroll/manuscript for TTPD
  
  // Default emoji
  return '🎵';
}

// Swiper handlers
function onSwiper(swiper) {
  swiperInstance.value = swiper;
}

function onSlideChange() {
  if (swiperInstance.value) {
    currentIndex.value = swiperInstance.value.activeIndex;
  }
}

function nextSlide() {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext();
  }
}

function prevSlide() {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev();
  }
}

// Ranking functions
function addToRanking(album) {
  if (!album || isAlbumRanked(album)) return;
  
  // Add the album to the ranked list
  rankedAlbums.value.push(album);
  
  // Auto-show the ranked list if it's the first album
  if (rankedAlbums.value.length === 1) {
    showRankedList.value = true;
  }
  
  // Move to the next album if available
  nextSlide();
}

function removeFromRanking(album) {
  const index = rankedAlbums.value.findIndex(a => a.id === album.id);
  if (index !== -1) {
    rankedAlbums.value.splice(index, 1);
  }
}

function isAlbumRanked(album) {
  if (!album) return false;
  return rankedAlbums.value.some(a => a.id === album.id);
}

function toggleRankedList() {
  showRankedList.value = !showRankedList.value;
}

// Save and reset functions
function saveRankings() {
  if (!userStore.isLoggedInSimulation) {
    showToast('Login Required', 'Please log in to save your rankings');
    return;
  }
  
  if (rankedAlbums.value.length === 0) {
    showToast('No Rankings', 'You need to rank at least one album to save');
    return;
  }
  
  // Convert ranked albums to tiers for compatibility with existing store
  convertRankingsToTiers();
  
  // Show success message
  showToast('Rankings Saved', 'Your album rankings have been saved successfully');
}

function convertRankingsToTiers() {
  // Clear existing tiers
  Object.keys(rankingStore.rankedTiers).forEach(tier => {
    rankingStore.rankedTiers[tier] = [];
  });
  
  // Distribute ranked albums into tiers based on their position
  const totalRanked = rankedAlbums.value.length;
  
  rankedAlbums.value.forEach((album, index) => {
    const position = index + 1;
    
    // Determine which tier this album belongs to
    if (position === 1) {
      rankingStore.rankedTiers.tier1.push(album);
    } else if (position <= 3) {
      rankingStore.rankedTiers.tier2.push(album);
    } else if (position <= 6) {
      rankingStore.rankedTiers.tier3.push(album);
    } else if (position <= 9) {
      rankingStore.rankedTiers.tier4.push(album);
    } else {
      rankingStore.rankedTiers.tier5.push(album);
    }
  });
}

function resetRankings() {
  // Confirm before resetting
  if (rankedAlbums.value.length > 0) {
    if (confirm('Are you sure you want to reset your rankings?')) {
      rankedAlbums.value = [];
      showToast('Rankings Reset', 'Your album rankings have been reset');
      
      // Reset the store as well
      Object.keys(rankingStore.rankedTiers).forEach(tier => {
        rankingStore.rankedTiers[tier] = [];
      });
      
      // Reset the carousel
      if (swiperInstance.value) {
        swiperInstance.value.slideTo(0);
        currentIndex.value = 0;
      }
    }
  }
}

function showToast(title, message) {
  toastService.show({
    title,
    message,
    type: 'info',
    duration: 3000
  });
}
</script>

<style scoped>
.album-ranking-carousel {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f8f9fa;
  transition: background 0.5s ease;
  position: relative;
  padding-bottom: 33vh; /* Reserve space for the carousel */
}

/* Top Section */
.top-section {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.navigation-actions {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  color: #555;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.help-button {
  color: #666;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-indicator {
  flex: 1;
}

.progress-text {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.progress-bar-container {
  height: 0.4rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--album-primary-color, #4caf50);
  transition: width 0.3s ease;
}

.album-emoji {
  font-size: 1.25rem;
  margin-left: 0.5rem;
}

/* Middle Section */
.middle-section {
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: 2.75rem;
  flex: 1;
  max-height: calc(67vh - 6rem); /* Ensure it doesn't overlap with carousel */
  overflow-y: auto;
}

.middle-section.expanded {
  max-height: calc(67vh - 6rem); /* Ensure it doesn't overlap with carousel */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 5;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.toggle-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.75rem;
}

.ranked-albums-container {
  padding: 0 0.75rem 0.75rem;
  overflow-y: auto;
  max-height: calc(67vh - 8.75rem);
}

.empty-state {
  padding: 0.75rem;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}

.ranked-albums-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranked-album-card {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 3px solid var(--album-color);
  position: relative;
  overflow: hidden;
}

.ranked-album-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--album-gradient);
  opacity: 0.1;
  pointer-events: none;
}

.rank-number {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--album-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 0.5rem;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.album-thumbnail {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.album-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-info {
  flex: 1;
  min-width: 0;
}

.album-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
}

.album-year {
  font-size: 0.7rem;
  color: #666;
}

.album-actions {
  display: flex;
  gap: 0.25rem;
}

.drag-handle, .remove-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drag-handle:hover, .remove-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.remove-button:hover {
  color: #e53935;
}

/* Bottom Section */
.bottom-section {
  height: 33vh;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.carousel-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.album-carousel {
  width: 100%;
  height: 60%;
  padding: 0.5rem 0;
}

.album-slide {
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.album-slide.ranked {
  opacity: 0.8;
}

.album-card {
  width: 160px;
  height: 160px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 4px var(--album-shadow-color, rgba(0, 0, 0, 0.1));
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-origin: center bottom;
  position: relative;
}

.album-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 4px var(--album-shadow-color, rgba(0, 0, 0, 0.2));
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
}

.ranked-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.carousel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: #f0f0f0;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rank-button {
  border-radius: 2rem;
  width: auto;
  padding: 0 1.25rem;
  background-color: var(--album-primary-color, #4caf50);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.rank-button:hover:not(:disabled) {
  background-color: var(--album-primary-color, #43a047);
}

.bottom-actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.bottom-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: 1;
  text-decoration: none;
}

.bottom-action-button .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: #43a047;
}

.reset-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.reset-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.album-carousel-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
}

.placeholder-message {
  text-align: center;
}

.placeholder-icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: 1rem;
}

.placeholder-subtext {
  font-size: 0.875rem;
  color: #666;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
