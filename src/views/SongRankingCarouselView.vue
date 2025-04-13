<template>
  <div class="song-ranking-carousel" :style="dynamicBackgroundStyle">
    <!-- Top Section: Instructions and Status -->
    <div class="top-section">
      <div class="header-bar">
        <h1 class="title">Song Ranker</h1>
        <div class="navigation-actions">
          <button 
            @click="showToast('Song Ranking Help', 'Swipe through songs and rank them in your preferred order.')"
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
      
      <!-- Album Selector -->
      <div class="album-selector">
        <div class="album-carousel">
          <div 
            v-for="album in rankingStore.availableAlbums" 
            :key="album.id"
            class="album-option"
            :class="{ 'selected': selectedAlbumId === album.id }"
            @click="selectAlbum(album.id)"
            :style="{ 
              '--album-color': album.color || '#333',
              '--album-shadow-color': album.color || 'rgba(0,0,0,0.3)'
            }"
          >
            <img :src="album.coverImageUrl" :alt="album.title" class="album-thumbnail">
            <span class="album-name">{{ album.title }}</span>
          </div>
        </div>
      </div>
      
      <div class="status-bar" v-if="selectedAlbum">
        <div class="progress-indicator">
          <div class="progress-text">{{ rankedSongs.length }} of {{ totalSongs }} ranked</div>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
        <div class="album-info">
          {{ selectedAlbum.title }}
        </div>
      </div>
    </div>

    <!-- Middle Section: Ranked Songs List -->
    <div class="middle-section" :class="{ 'expanded': showRankedList }" v-if="selectedAlbum">
      <div class="section-header" @click="toggleRankedList">
        <h2>Your Ranked Songs</h2>
        <button class="toggle-button">
          {{ showRankedList ? '▲ Hide' : '▼ Show' }}
        </button>
      </div>
      
      <transition name="slide">
        <div class="ranked-songs-container" v-if="showRankedList">
          <div class="empty-state" v-if="rankedSongs.length === 0">
            <p>You haven't ranked any songs yet. Use the carousel below to start ranking!</p>
          </div>
          <draggable 
            v-else
            v-model="rankedSongs" 
            item-key="id"
            class="ranked-songs-list"
            handle=".drag-handle"
            @end="updateRankings"
          >
            <template #item="{ element, index }">
              <div 
                class="ranked-song-card" 
                :style="{ 
                  '--song-color': selectedAlbum.color || '#333',
                  '--song-gradient': `linear-gradient(135deg, ${selectedAlbum.color || '#333'}, transparent)`
                }"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="song-info">
                  <div class="song-title">{{ element.title }}</div>
                  <div class="song-album">{{ selectedAlbum.title }}</div>
                </div>
                <div class="song-actions">
                  <button class="drag-handle" aria-label="Drag to reorder">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                    </svg>
                  </button>
                  <button @click="removeSongFromRanking(element.id)" class="remove-button" aria-label="Remove from ranking">
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

    <!-- Main Content: Song Carousel -->
    <div class="main-content">
      <!-- Song Carousel -->
      <div class="carousel-container">
        <swiper
          class="song-carousel"
          :modules="swiperModules"
          :effect="'coverflow'"
          :grab-cursor="true"
          :centered-slides="true"
          :slides-per-view="'auto'"
          :loop="false"
          :coverflow-effect="{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          v-if="selectedAlbum && selectedAlbum.songs && selectedAlbum.songs.length > 0"
        >
          <swiper-slide 
            v-for="song in (selectedAlbum.songs || [])" 
            :key="song ? song.id : 'unknown'"
            class="song-slide"
            :class="{ 'ranked': song && isSongRanked(song) }"
          >
            <div 
              class="song-card"
              :style="{ 
                '--song-color': selectedAlbum.color || '#333',
                '--song-shadow-color': selectedAlbum.color || 'rgba(0,0,0,0.3)'
              }"
            >
              <div class="song-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <div class="song-title-overlay">{{ song ? song.title : 'Unknown Song' }}</div>
              <div v-if="song && isSongRanked(song)" class="ranked-badge">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        
        <!-- Fallback when no album is selected or no songs available -->
        <div class="empty-state" v-else>
          <p v-if="!selectedAlbum">Select an album above to see its songs</p>
          <p v-else-if="!selectedAlbum.songs || selectedAlbum.songs.length === 0">No songs available for this album</p>
        </div>
        
        <div class="carousel-controls" v-if="selectedAlbum && selectedAlbum.songs && selectedAlbum.songs.length > 0">
          <button 
            class="control-button prev-button" 
            @click="prevSlide"
            aria-label="Previous song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            class="action-button add-button"
            @click="toggleSongInRanking(currentSong)"
            :disabled="isSongRanked(currentSong)"
            aria-label="Add to ranking"
          >
            <span v-if="isSongRanked(currentSong)">Already Ranked</span>
            <span v-else>Add to Ranking</span>
          </button>
          
          <button 
            class="control-button next-button" 
            @click="nextSlide"
            aria-label="Next song"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" v-if="selectedAlbum">
        <button 
          @click="saveRankings"
          class="action-button save-button"
          :disabled="rankedSongs.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Save Rankings
        </button>
        <button 
          @click="resetRankings"
          class="action-button reset-button"
          :disabled="rankedSongs.length === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Reset
        </button>
        <button 
          @click="randomizeRankings"
          class="action-button randomize-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Randomize
        </button>
      </div>
    </div>

    <!-- Placeholder for the rest of the components -->
    <div v-if="selectedAlbum" v-show="false">
      <!-- This section is now hidden and replaced with the song carousel -->
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRankingStore } from '@/store/rankingStore';
import { useUserStore } from '@/store/userStore';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import draggable from 'vuedraggable';
import toastService from '@/services/toastService';
import staticAlbumsData from '@/data/static-albums.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

export default {
  name: 'SongRankingCarouselView',
  components: {
    Swiper,
    SwiperSlide,
    draggable
  },
  setup() {
    const rankingStore = useRankingStore();
    const userStore = useUserStore();

    // Initialize with data from static-albums.json if needed
    if (rankingStore.availableAlbums.length === 0) {
      console.log('Initializing albums from static data in SongRankingCarouselView');
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

    // State
    const selectedAlbumId = ref(null);
    const selectedAlbum = computed(() => {
      if (!selectedAlbumId.value) return null;
      return rankingStore.availableAlbums.find(album => album.id === selectedAlbumId.value);
    });
    
    const rankedSongs = ref([]);
    const showRankedList = ref(false);
    const swiper = ref(null);
    const currentSlideIndex = ref(0);
    const currentSong = computed(() => {
      if (!selectedAlbum.value || !selectedAlbum.value.songs || selectedAlbum.value.songs.length === 0) return null;
      
      // Add safety check for undefined songs
      const songAtIndex = selectedAlbum.value.songs[currentSlideIndex.value];
      if (!songAtIndex) {
        console.warn(`No song found at index ${currentSlideIndex.value}`);
        return null;
      }
      
      return songAtIndex;
    });
    
    const totalSongs = computed(() => {
      return selectedAlbum.value && selectedAlbum.value.songs ? selectedAlbum.value.songs.length : 0;
    });
    
    const progressPercentage = computed(() => {
      if (totalSongs.value === 0) return 0;
      return (rankedSongs.value.length / totalSongs.value) * 100;
    });
    
    const canNavigate = computed(() => {
      return swiper.value !== null;
    });
    
    const dynamicBackgroundStyle = computed(() => {
      if (selectedAlbum.value && selectedAlbum.value.color) {
        return {
          '--bg-gradient-start': `${selectedAlbum.value.color}22`,
          '--bg-gradient-end': `${selectedAlbum.value.color}11`
        };
      }
      return {
        '--bg-gradient-start': '#f3f4f611',
        '--bg-gradient-end': '#ffffff'
      };
    });

    // Helper function to show toast notifications
    function showToast(title, message, type = 'success') {
      toastService.show({
        title,
        message,
        type,
        duration: 3000
      });
    }

    // Methods
    function selectAlbum(albumId) {
      console.log(`Selecting album: ${albumId}`);
      selectedAlbumId.value = albumId;
      loadSongsForAlbum();
      showToast('Album Selected', `Now ranking songs from ${selectedAlbum.value.title}`);
    }
    
    function loadSongsForAlbum() {
      console.log(`Loading songs for album: ${selectedAlbum.value.title}`);
      console.log(`Album data:`, JSON.stringify(selectedAlbum.value).substring(0, 200) + '...');
      
      if (!selectedAlbum.value) return;
      
      if (selectedAlbum.value.songs) {
        console.log(`Number of songs: ${selectedAlbum.value.songs.length}`);
        if (selectedAlbum.value.songs.length > 0) {
          console.log(`First song: ${JSON.stringify(selectedAlbum.value.songs[0])}`);
        }
      } else {
        console.warn(`No songs array found for album: ${selectedAlbum.value.title}`);
      }
      
      // Reset state
      currentSlideIndex.value = 0;
      
      // Load existing rankings if available
      const existingRankings = rankingStore.getSongRankingsForAlbum(selectedAlbum.value.id);
      if (existingRankings && existingRankings.length > 0) {
        rankedSongs.value = existingRankings;
        showToast('Rankings Loaded', 'Your previous rankings for this album have been loaded.');
      } else {
        rankedSongs.value = [];
      }
    }
    
    function onSwiper(swiperInstance) {
      console.log('Swiper instance created:', swiperInstance);
      swiper.value = swiperInstance;
    }
    
    function onSlideChange() {
      console.log('Slide changed:', swiper.value.activeIndex);
      if (swiper.value) {
        currentSlideIndex.value = swiper.value.activeIndex;
      }
    }
    
    function nextSlide() {
      console.log('Navigating to next slide...');
      if (swiper.value) {
        swiper.value.slideNext();
      }
    }
    
    function prevSlide() {
      console.log('Navigating to previous slide...');
      if (swiper.value) {
        swiper.value.slidePrev();
      }
    }
    
    function toggleRankedList() {
      console.log('Toggling ranked list...');
      showRankedList.value = !showRankedList.value;
    }
    
    function isSongRanked(song) {
      console.log(`Checking if song is ranked: ${song.title}`);
      return rankedSongs.value.some(rankedSong => rankedSong.id === song.id);
    }
    
    function toggleSongInRanking(song) {
      console.log(`Toggling song in ranking: ${song.title}`);
      if (isSongRanked(song)) {
        removeSongFromRanking(song.id);
      } else {
        addSongToRanking(song);
      }
    }
    
    function addSongToRanking(song) {
      console.log(`Adding song to ranking: ${song.title}`);
      if (!isSongRanked(song)) {
        rankedSongs.value.push({ ...song });
        updateRankings();
        showToast('Song Added', `${song.title} added to your ranking.`);
      }
    }
    
    function removeSongFromRanking(songId) {
      console.log(`Removing song from ranking: ${songId}`);
      const index = rankedSongs.value.findIndex(song => song.id === songId);
      if (index !== -1) {
        const removedSong = rankedSongs.value[index];
        rankedSongs.value.splice(index, 1);
        updateRankings();
        showToast('Song Removed', `${removedSong.title} removed from your ranking.`);
      }
    }
    
    function updateRankings() {
      console.log('Updating rankings...');
      if (selectedAlbum.value) {
        rankingStore.updateSongRankingsTemp(selectedAlbum.value.id, rankedSongs.value);
      }
    }
    
    function saveRankings() {
      console.log('Saving rankings...');
      if (selectedAlbum.value && rankedSongs.value.length > 0) {
        rankingStore.saveSongRankings(selectedAlbum.value.id, rankedSongs.value);
        showToast('Rankings Saved', 'Your song rankings have been saved successfully!');
      } else {
        showToast('Cannot Save', 'You need to rank at least one song before saving.', 'error');
      }
    }
    
    function resetRankings() {
      console.log('Resetting rankings...');
      if (confirm('Are you sure you want to reset your rankings?')) {
        rankedSongs.value = [];
        if (selectedAlbum.value) {
          rankingStore.updateSongRankingsTemp(selectedAlbum.value.id, []);
        }
        showToast('Rankings Reset', 'Your song rankings have been reset.');
      }
    }
    
    function randomizeRankings() {
      console.log('Randomizing rankings...');
      if (!selectedAlbum.value || !selectedAlbum.value.songs) return;
      
      // Create a copy of all songs
      const allSongs = [...selectedAlbum.value.songs];
      
      // Shuffle the array
      for (let i = allSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSongs[i], allSongs[j]] = [allSongs[j], allSongs[i]];
      }
      
      // Take a random subset (between 3 and all songs)
      const count = Math.max(3, Math.floor(Math.random() * allSongs.length));
      rankedSongs.value = allSongs.slice(0, count);
      updateRankings();
      
      showToast('Rankings Randomized', `Created a random ranking with ${count} songs.`);
    }

    // Lifecycle hooks
    onMounted(() => {
      console.log('Component mounted...');
      // Check if there's a default album to load
      if (rankingStore.availableAlbums.length > 0) {
        // Auto-select the first album for a better initial experience
        selectAlbum(rankingStore.availableAlbums[0].id);
      }
    });

    onBeforeUnmount(() => {
      console.log('Component unmounted...');
      // Save any unsaved rankings when leaving
      if (selectedAlbum.value && rankedSongs.value.length > 0) {
        rankingStore.updateSongRankingsTemp(selectedAlbum.value.id, rankedSongs.value);
      }
    });

    // Watch for changes to selectedAlbum
    watch(selectedAlbum, (newAlbum) => {
      console.log('Selected album changed:', newAlbum);
      if (newAlbum) {
        // Reset the swiper when album changes
        if (swiper.value) {
          swiper.value.slideTo(0);
          currentSlideIndex.value = 0;
        }
      }
    });

    return {
      rankingStore,
      userStore,
      selectedAlbumId,
      selectedAlbum,
      rankedSongs,
      showRankedList,
      swiper,
      currentSlideIndex,
      currentSong,
      totalSongs,
      progressPercentage,
      canNavigate,
      dynamicBackgroundStyle,
      swiperModules: [EffectCoverflow, Navigation],
      
      // Methods
      selectAlbum,
      loadSongsForAlbum,
      onSwiper,
      onSlideChange,
      nextSlide,
      prevSlide,
      toggleRankedList,
      isSongRanked,
      toggleSongInRanking,
      addSongToRanking,
      removeSongFromRanking,
      updateRankings,
      saveRankings,
      resetRankings,
      randomizeRankings,
      showToast
    };
  }
};
</script>

<style scoped>
.song-ranking-carousel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f3f4f6;
  transition: background-color 0.5s ease;
}

/* Top Section Styles */
.top-section {
  margin-bottom: 1rem;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.navigation-actions {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-button svg {
  width: 1.5rem;
  height: 1.5rem;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.progress-indicator {
  flex: 1;
}

.progress-text {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.progress-bar-container {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.album-info {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.album-selector {
  margin-bottom: 1rem;
}

.album-carousel {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.album-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.album-option.selected {
  background-color: #4f46e5;
  color: white;
}

.album-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.album-thumbnail {
  width: 40px;
  height: 40px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 9999px;
  margin-bottom: 0.25rem;
}

.album-name {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

/* Middle Section Styles */
.middle-section {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: 3.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.middle-section.expanded {
  max-height: 50vh;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.toggle-button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
}

.ranked-songs-container {
  padding: 1rem;
  max-height: calc(50vh - 3.5rem);
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #6b7280;
}

.ranked-songs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranked-song-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--song-color, #4f46e5);
  background-image: var(--song-gradient);
  background-size: 100% 100%;
  background-position: 0% 0%;
  background-repeat: no-repeat;
}

.rank-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--song-color, #4f46e5);
  color: white;
  border-radius: 9999px;
  font-weight: 600;
  margin-right: 0.75rem;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-album {
  font-size: 0.75rem;
  color: #6b7280;
}

.song-actions {
  display: flex;
  gap: 0.5rem;
}

.drag-handle, .remove-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.drag-handle:hover, .remove-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.drag-handle svg, .remove-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.carousel-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
}

.song-carousel {
  width: 100%;
  height: 250px;
  margin-bottom: 1.5rem;
}

.song-slide {
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.song-slide.ranked .song-card {
  opacity: 0.7;
}

.song-card {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--song-color, #4f46e5);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px var(--song-shadow-color, rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 1rem;
}

.song-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  margin-bottom: 1rem;
}

.song-icon svg {
  color: white;
}

.song-title-overlay {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  max-width: 100%;
  padding: 0 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranked-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #10b981;
  color: white;
  border-radius: 9999px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ranked-badge svg {
  width: 1rem;
  height: 1rem;
}

.carousel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.control-button {
  background: none;
  border: none;
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.control-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.control-button svg {
  width: 1.5rem;
  height: 1.5rem;
  color: #4b5563;
}

.add-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.add-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.add-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: auto;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  text-decoration: none;
}

.save-button {
  background-color: #4f46e5;
  color: white;
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.reset-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.reset-button:hover:not(:disabled) {
  background-color: #f9fafb;
}

.tier-button {
  background-color: white;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.tier-button:hover {
  background-color: #f9fafb;
}

.action-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.action-button svg {
  width: 1.25rem;
  height: 1.25rem;
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

/* Responsive Adjustments */
@media (max-width: 640px) {
  .song-ranking-carousel {
    padding: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
