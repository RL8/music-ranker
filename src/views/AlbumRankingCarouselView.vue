<template>
  <div class="era-ranking-carousel" :style="dynamicBackgroundStyle">
    <!-- Top Section: Instructions and Status -->
    <div class="top-section">
      <div class="header-bar">
        <h1 class="title">Era Ranker</h1>
        <div class="navigation-actions">
          <button 
            @click="showToast('Era Ranking Help', 'Swipe through eras and rank them in your preferred order.')"
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
          <div class="progress-text">{{ rankedEras.length }} of {{ totalEras }} ranked</div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <div class="era-emoji" v-if="currentEra">
          {{ getEraEmoji(currentEra) }}
        </div>
      </div>
    </div>

    <!-- Middle Section: Ranked Eras List -->
    <div class="middle-section" :class="{ 'expanded': showRankedList }">
      <div class="section-header" @click="toggleRankedList">
        <h2>Your Ranked Eras</h2>
        <button class="toggle-button">
          {{ showRankedList ? '▲ Hide' : '▼ Show' }}
        </button>
      </div>
      
      <transition name="slide">
        <div class="ranked-eras-container" v-if="showRankedList">
          <div class="empty-state" v-if="rankedEras.length === 0">
            <p>You haven't ranked any eras yet. Use the carousel below to start ranking!</p>
          </div>
          <draggable 
            v-else
            v-model="rankedEras" 
            item-key="id"
            class="ranked-eras-list"
            handle=".drag-handle"
            @end="saveRankings"
          >
            <template #item="{ element, index }">
              <div 
                class="ranked-era-card" 
                :style="{ 
                  '--era-color': element.color || '#333',
                  '--era-gradient': `linear-gradient(135deg, ${element.color || '#333'}, transparent)`
                }"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="era-thumbnail">
                  <img :src="element.coverImageUrl" :alt="element.title">
                </div>
                <div class="era-info">
                  <div class="era-title">{{ element.title }}</div>
                  <div class="era-year">{{ element.year }}</div>
                </div>
                <div class="era-actions">
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

    <!-- Bottom Section: Era Carousel -->
    <div class="bottom-section">
      <div class="carousel-container">
        <!-- Only render Swiper when we have enough eras -->
        <template v-if="rankingStore.availableEras.length >= 3">
          <swiper
            class="era-carousel"
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
              v-for="era in rankingStore.availableEras" 
              :key="era.id"
              class="era-slide"
              :class="{ 'ranked': isEraRanked(era) }"
            >
              <div 
                class="era-card"
                :style="{ 
                  '--era-color': era.color || '#333',
                  '--era-shadow-color': era.color || 'rgba(0,0,0,0.3)'
                }"
              >
                <img 
                  :src="getEraImageUrl(era)" 
                  :alt="era.title" 
                  class="era-cover"
                  loading="lazy"
                />
                <div class="era-title-overlay">{{ era.title }}</div>
                <div v-if="isEraRanked(era)" class="ranked-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                </div>
            </div>
          </swiper-slide>
        </swiper>
      </template>
        
        <!-- Placeholder when not enough eras -->
        <div v-else class="era-carousel-placeholder">
          <div class="placeholder-message">
            <svg xmlns="http://www.w3.org/2000/svg" class="placeholder-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <p>Loading eras...</p>
            <p class="placeholder-subtext">Please wait while we prepare your music collection.</p>
          </div>
        </div>
        
        <div class="carousel-controls">
          <button 
            class="control-button prev-button" 
            @click="prevSlide"
            aria-label="Previous era"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            class="control-button rank-button" 
            @click="addToRanking(currentEra)"
            :disabled="!currentEra || isEraRanked(currentEra)"
          >
            {{ isEraRanked(currentEra) ? 'Already Ranked' : 'Add to Ranking' }}
          </button>
          
          <button 
            class="control-button next-button" 
            @click="nextSlide"
            aria-label="Next era"
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
            :disabled="rankedEras.length === 0 || !userStore.isLoggedInSimulation">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293z" />
            </svg>
            <span>Save Rankings</span>
          </button>
          
          <button 
            @click="resetRankings"
            class="bottom-action-button reset-button"
            :disabled="rankedEras.length === 0">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110-2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
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
import { supabase } from '@/lib/supabase/client';

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
const rankedEras = ref([]);
const swiperModules = [EffectCoverflow, Pagination];
const loading = ref(true);
const error = ref(null);

// Initialize from the store if available
onMounted(async () => {
  // Initialize eras from database
  if (rankingStore.availableEras.length === 0) {
    try {
      loading.value = true;
      console.log('Attempting to load eras from database...');
      
      // Direct database query to fetch all eras
      const { data, error: dbError } = await supabase
        .from('Eras')
        .select('*')
        .order('eraName');
      
      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
      
      // Transform database eras to the format needed for the carousel
      const formattedEras = data.map(era => ({
        id: era.eraId,
        title: era.eraName,
        coverImageUrl: era.image_url || getEraImageUrl(era),
        year: era.eraStartDate ? new Date(era.eraStartDate).getFullYear() : null,
        color: era.color || getRandomColor(era.eraName),
        primaryAlbumId: era.primaryAlbumId
      }));
      
      console.log(`Loaded ${formattedEras.length} eras from database`);
      rankingStore.initializeStaticEras(formattedEras);
    } catch (err) {
      console.error('Error loading eras from database:', err);
      error.value = `Failed to load eras: ${err.message || 'Unknown error'}`;
      
      // Fallback to static data if database fails
      console.log('Falling back to static era data');
      import('@/data/static-eras.json').then(erasData => {
        rankingStore.initializeStaticEras(erasData.default);
      });
    } finally {
      loading.value = false;
    }
  }
  
  // Initialize ranked eras from any existing rankings
  const existingRankings = [];
  Object.values(rankingStore.rankedTiers).forEach(tier => {
    existingRankings.push(...tier);
  });
  
  if (existingRankings.length > 0) {
    rankedEras.value = [...existingRankings];
    showRankedList.value = true;
  }
});

// Computed properties
const unrankedEras = computed(() => {
  return rankingStore.availableEras.filter(era => 
    !rankedEras.value.some(rankedEra => rankedEra.id === era.id)
  );
});

const shouldEnableLoop = computed(() => {
  // Only enable loop mode when we have enough eras (3 or more is typically enough for Swiper)
  // Also check the flag from the store that indicates if there are enough eras
  return rankingStore.availableEras.length >= 3 && !rankingStore.notEnoughErasForLoop;
});

const currentEra = computed(() => {
  if (rankingStore.availableEras.length === 0) return null;
  if (!swiperInstance.value) return rankingStore.availableEras[0];
  const index = swiperInstance.value.activeIndex;
  // Handle loop mode index adjustment
  const realIndex = swiperInstance.value.realIndex;
  return rankingStore.availableEras[realIndex] || rankingStore.availableEras[0];
});

const totalEras = computed(() => {
  return rankingStore.availableEras.length;
});

const progressPercentage = computed(() => {
  return (rankedEras.value.length / totalEras.value) * 100;
});

const dynamicBackgroundStyle = computed(() => {
  if (!currentEra.value) return {};
  
  const eraColor = currentEra.value.color || '#333';
  const lighterColor = adjustColor(eraColor, 40);
  
  return {
    '--era-primary-color': eraColor,
    '--era-secondary-color': lighterColor,
    background: `linear-gradient(135deg, ${eraColor}22, ${lighterColor}55)`
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

function getEraEmoji(era) {
  // Map eras to appropriate emojis based on their characteristics
  if (!era) return '🎵';
  
  const title = era.title.toLowerCase();
  
  if (title.includes('taylor swift')) return '🤠'; // Cowboy hat for Taylor Swift era
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

// Helper function for generating colors if not provided in the database
function getRandomColor(seed) {
  // Generate a consistent color based on the era name
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a pastel-ish color
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 65%)`;
}

// Helper function to get the correct image URL for an era
function getEraImageUrl(era) {
  // First check if the era has an image URL from the database
  // Check both coverImageUrl and image_url fields
  if (era.coverImageUrl) {
    return era.coverImageUrl;
  }
  
  if (era.image_url) {
    return era.image_url;
  }
  
  // If no database URL, fall back to local image mapping
  const eraNameToFileName = {
    'Taylor Swift': 'ts',
    'Debut Era': 'ts',  
    'Fearless': 'fearless',
    'Speak Now': 'speaknow',
    'Red': 'red',
    '1989': '1989',
    'Reputation': 'reputation',
    'Lover': 'lover',
    'Folklore': 'folklore',
    'Evermore': 'evermore',
    'Midnights': 'midnights',
    'The Tortured Poets Department': 'tortured',
    'TTPD Era': 'tortured'
  };
  
  // Special case for TTPD Era
  if ((era.eraName === 'TTPD Era' || era.title === 'TTPD Era' || era.eraId === 'ERA_TTPD' || era.id === 'ERA_TTPD') && era.image_url) {
    return era.image_url;
  }
  
  // Try to find a matching file name based on era name
  const fileName = eraNameToFileName[era.eraName || era.title] || era.eraId || era.id?.toLowerCase();
  
  if (fileName) {
    // Check if the image is already using the era_ prefix format
    if (era.coverImageUrl && era.coverImageUrl.includes(`era_${fileName}.jpg`)) {
      return era.coverImageUrl;
    }
    
    // Try both formats - with and without the era_ prefix
    // First check if the era_*.jpg format exists
    const eraFormat = `/img/covers/era_${fileName}.jpg`;
    
    // Return the era_*.jpg format since that's what we're seeing in the DOM
    return eraFormat;
  }
  
  // Default fallback
  return '/img/covers/default.jpg';
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
function addToRanking(era) {
  if (!era || isEraRanked(era)) return;
  
  // Add the era to the ranked list
  rankedEras.value.push(era);
  
  // Auto-show the ranked list if it's the first era
  if (rankedEras.value.length === 1) {
    showRankedList.value = true;
  }
  
  // Move to the next era if available
  nextSlide();
}

function removeFromRanking(era) {
  const index = rankedEras.value.findIndex(e => e.id === era.id);
  if (index !== -1) {
    rankedEras.value.splice(index, 1);
  }
}

function isEraRanked(era) {
  if (!era) return false;
  return rankedEras.value.some(e => e.id === era.id);
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
  
  if (rankedEras.value.length === 0) {
    showToast('No Rankings', 'You need to rank at least one era to save');
    return;
  }
  
  // Convert ranked eras to tiers for compatibility with existing store
  convertRankingsToTiers();
  
  // Show success message
  showToast('Rankings Saved', 'Your era rankings have been saved successfully');
}

function convertRankingsToTiers() {
  // Clear existing tiers
  Object.keys(rankingStore.rankedTiers).forEach(tier => {
    rankingStore.rankedTiers[tier] = [];
  });
  
  // Distribute ranked eras into tiers based on their position
  const totalRanked = rankedEras.value.length;
  
  rankedEras.value.forEach((era, index) => {
    const position = index + 1;
    
    // Determine which tier this era belongs to
    if (position === 1) {
      rankingStore.rankedTiers.tier1.push(era);
    } else if (position <= 3) {
      rankingStore.rankedTiers.tier2.push(era);
    } else if (position <= 6) {
      rankingStore.rankedTiers.tier3.push(era);
    } else if (position <= 9) {
      rankingStore.rankedTiers.tier4.push(era);
    } else {
      rankingStore.rankedTiers.tier5.push(era);
    }
  });
}

function resetRankings() {
  // Confirm before resetting
  if (rankedEras.value.length > 0) {
    if (confirm('Are you sure you want to reset your rankings?')) {
      rankedEras.value = [];
      showToast('Rankings Reset', 'Your era rankings have been reset');
      
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
.era-ranking-carousel {
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
  background-color: var(--era-primary-color, #4caf50);
  transition: width 0.3s ease;
}

.era-emoji {
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

.ranked-eras-container {
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

.ranked-eras-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranked-era-card {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 3px solid var(--era-color);
  position: relative;
  overflow: hidden;
}

.ranked-era-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--era-gradient);
  opacity: 0.1;
  pointer-events: none;
}

.rank-number {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--era-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 0.5rem;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.era-thumbnail {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.era-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.era-info {
  flex: 1;
  min-width: 0;
}

.era-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
}

.era-year {
  font-size: 0.7rem;
  color: #666;
}

.era-actions {
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

.era-carousel {
  width: 100%;
  height: 60%;
  padding: 0.5rem 0;
}

.era-slide {
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.era-slide.ranked {
  opacity: 0.8;
}

.era-card {
  width: 160px;
  height: 160px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 4px var(--era-shadow-color, rgba(0, 0, 0, 0.1));
  background-color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform-origin: center bottom;
  position: relative;
}

.era-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 4px var(--era-shadow-color, rgba(0, 0, 0, 0.2));
}

.era-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.era-title-overlay {
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
  background-color: var(--era-primary-color, #4caf50);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.rank-button:hover:not(:disabled) {
  background-color: var(--era-primary-color, #43a047);
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

.era-carousel-placeholder {
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
