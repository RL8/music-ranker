<template>
  <div class="album-coverflow-carousel">
    <!-- Minimal Ranking Indicator -->
    <div class="ranking-indicator">
      <div class="current-rank">{{ currentIndex + 1 }}/{{ albums.length }}</div>
    </div>
    
    <swiper
      class="swiper"
      :modules="modules"
      :pagination="{ clickable: true, dynamicBullets: true }"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :speed="400"
      :resistance="false"
      :coverflow-effect="{
        rotate: 30,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @touchEnd="handleTouchEnd"
    >
      <swiper-slide 
        class="slide" 
        v-for="(album, index) in albums" 
        :key="album.id"
      >
        <div class="album-card">
          <img 
            :src="album.coverImageUrl" 
            :alt="album.title" 
            class="album-image"
            loading="lazy"
          />
          <div class="album-info">
            <h3 class="album-title">{{ album.title }}</h3>
          </div>
          
          <!-- Visual indicator for current album -->
          <div class="album-status" v-if="index === currentIndex">
            <div class="pulse-ring"></div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    
    <!-- Simplified Rating Controls -->
    <div class="rating-controls">
      <button 
        class="rating-button dislike"
        @click="rateCurrentAlbum('dislike')"
        :disabled="!currentAlbum"
        aria-label="Dislike"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <button 
        class="rating-button neutral"
        @click="rateCurrentAlbum('neutral')"
        :disabled="!currentAlbum"
        aria-label="Neutral"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      <button 
        class="rating-button like"
        @click="rateCurrentAlbum('like')"
        :disabled="!currentAlbum"
        aria-label="Like"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
    
    <!-- Visual Progress Indicator -->
    <div class="progress-indicator">
      <div class="album-dots">
        <div 
          v-for="(album, index) in albums" 
          :key="album.id"
          class="album-dot"
          :class="{ 
            'current': index === currentIndex,
            'rated': ratedAlbumIds.includes(album.id)
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { Pagination, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export default {
  name: 'AlbumCoverflowCarousel',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    albums: {
      type: Array,
      required: true
    }
  },
  emits: ['rate-album'],
  setup(props, { emit }) {
    const swiperInstance = ref(null);
    const currentIndex = ref(0);
    const ratedAlbumIds = ref([]);
    
    const currentAlbum = computed(() => {
      return props.albums[currentIndex.value] || null;
    });
    
    const onSwiper = (swiper) => {
      swiperInstance.value = swiper;
      
      // Improve performance by preloading adjacent slides
      swiper.params.preloadImages = false;
      swiper.params.lazy = {
        loadPrevNext: true,
        loadPrevNextAmount: 2
      };
      
      // Optimize touch handling
      swiper.params.touchRatio = 1;
      swiper.params.touchAngle = 45;
      swiper.params.longSwipes = true;
      swiper.params.longSwipesRatio = 0.5;
      
      swiper.update();
    };
    
    const onSlideChange = () => {
      if (swiperInstance.value) {
        currentIndex.value = swiperInstance.value.activeIndex;
      }
    };
    
    // Handle swipe gestures using Swiper's built-in events
    const handleTouchEnd = (swiper) => {
      // Check if it was an upward swipe by comparing touch coordinates
      if (swiper.touches.diff < -50 && swiper.touches.currentY < swiper.touches.startY) {
        // This was an upward swipe
        if (currentAlbum.value && !ratedAlbumIds.value.includes(currentAlbum.value.id)) {
          rateCurrentAlbum('like');
        }
      }
    };
    
    const rateCurrentAlbum = (rating) => {
      if (currentAlbum.value) {
        // Add to rated albums list
        if (!ratedAlbumIds.value.includes(currentAlbum.value.id)) {
          ratedAlbumIds.value.push(currentAlbum.value.id);
        }
        
        emit('rate-album', {
          album: currentAlbum.value,
          rating: rating
        });
        
        // Add animation class
        const albumElement = document.querySelector(`.slide:nth-child(${currentIndex.value + 1}) .album-card`);
        if (albumElement) {
          albumElement.classList.add('rated-animation');
          setTimeout(() => {
            albumElement.classList.remove('rated-animation');
          }, 500);
        }
        
        // Automatically move to the next album after rating with a slight delay
        if (swiperInstance.value && currentIndex.value < props.albums.length - 1) {
          setTimeout(() => {
            swiperInstance.value.slideNext(300);
          }, 200);
        }
      }
    };
    
    return {
      modules: [Pagination, EffectCoverflow],
      currentIndex,
      currentAlbum,
      ratedAlbumIds,
      onSwiper,
      onSlideChange,
      handleTouchEnd,
      rateCurrentAlbum
    };
  }
};
</script>

<style scoped>
.album-coverflow-carousel {
  width: 100%;
  position: relative;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: linear-gradient(to bottom, #f3f4f6, #ffffff);
  border-radius: 12px;
  will-change: transform;
}

.ranking-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
}

.current-rank {
  background-color: rgba(139, 92, 246, 0.9);
  color: white;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.swiper {
  width: 100%;
  height: 320px;
  padding: 20px 0;
  overflow: visible;
}

.swiper :deep(.swiper-pagination) {
  bottom: -5px;
}

.swiper :deep(.swiper-pagination-bullet) {
  background: rgba(139, 92, 246, 0.5);
}

.swiper :deep(.swiper-pagination-bullet-active) {
  background: rgba(139, 92, 246, 1);
}

.slide {
  width: 280px;
  height: 280px;
  background-color: transparent;
  transition: transform 0.3s ease;
  will-change: transform;
}

.album-card {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

.album-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transform: translateZ(0);
}

.album-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 1rem 0.5rem 0.5rem;
  text-align: center;
}

.album-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.pulse-ring {
  border: 3px solid rgba(139, 92, 246, 0.7);
  border-radius: 50%;
  height: 40px;
  width: 40px;
  position: absolute;
  animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.rating-controls {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.rating-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rating-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dislike {
  background-color: #fee2e2;
  color: #dc2626;
}

.dislike:hover:not(:disabled) {
  background-color: #fecaca;
  transform: scale(1.1);
}

.neutral {
  background-color: #fef3c7;
  color: #d97706;
}

.neutral:hover:not(:disabled) {
  background-color: #fde68a;
  transform: scale(1.1);
}

.like {
  background-color: #d1fae5;
  color: #059669;
}

.like:hover:not(:disabled) {
  background-color: #a7f3d0;
  transform: scale(1.1);
}

.progress-indicator {
  margin-top: 1rem;
  padding: 0 1rem;
}

.album-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 100%;
}

.album-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e5e7eb;
  transition: all 0.3s ease;
}

.album-dot.current {
  background-color: #8b5cf6;
  transform: scale(1.2);
}

.album-dot.rated {
  background-color: #10b981;
}

.rated-animation {
  animation: rated 0.5s ease;
}

@keyframes rated {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
