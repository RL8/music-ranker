<template>
  <div class="album-coverflow-carousel">
    <swiper
      class="swiper"
      :modules="modules"
      :pagination="{ clickable: true }"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
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
          />
          <div class="album-info">
            <h3 class="album-title">{{ album.title }}</h3>
            <p class="album-year" v-if="album.year">{{ album.year }}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    
    <!-- Album Rating Controls -->
    <div class="rating-controls">
      <button 
        class="rating-button dislike"
        @click="rateCurrentAlbum('dislike')"
        :disabled="!currentAlbum"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Dislike</span>
      </button>
      
      <button 
        class="rating-button neutral"
        @click="rateCurrentAlbum('neutral')"
        :disabled="!currentAlbum"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Neutral</span>
      </button>
      
      <button 
        class="rating-button like"
        @click="rateCurrentAlbum('like')"
        :disabled="!currentAlbum"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Like</span>
      </button>
    </div>
    
    <!-- Progress Indicator -->
    <div class="progress-indicator">
      <p>Album {{ currentIndex + 1 }} of {{ albums.length }}</p>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: `${(currentIndex + 1) / albums.length * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
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
    
    const currentAlbum = computed(() => {
      return props.albums[currentIndex.value] || null;
    });
    
    const onSwiper = (swiper) => {
      swiperInstance.value = swiper;
    };
    
    const onSlideChange = () => {
      if (swiperInstance.value) {
        currentIndex.value = swiperInstance.value.activeIndex;
      }
    };
    
    const rateCurrentAlbum = (rating) => {
      if (currentAlbum.value) {
        emit('rate-album', {
          album: currentAlbum.value,
          rating: rating
        });
        
        // Automatically move to the next album after rating
        if (swiperInstance.value && currentIndex.value < props.albums.length - 1) {
          swiperInstance.value.slideNext();
        }
      }
    };
    
    return {
      modules: [Pagination, EffectCoverflow],
      currentIndex,
      currentAlbum,
      onSwiper,
      onSlideChange,
      rateCurrentAlbum
    };
  }
};
</script>

<style scoped>
.album-coverflow-carousel {
  width: 100%;
  height: 400px;
  position: relative;
  margin-bottom: 2rem;
}

.swiper {
  width: 100%;
  height: 300px;
  padding-top: 30px;
  padding-bottom: 30px;
}

.slide {
  width: 250px;
  height: 250px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.album-card {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.album-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  text-align: center;
}

.album-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-year {
  font-size: 12px;
  margin: 4px 0 0;
}

.rating-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.rating-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-button span {
  font-size: 12px;
  margin-top: 4px;
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
}

.neutral {
  background-color: #fef3c7;
  color: #d97706;
}

.neutral:hover:not(:disabled) {
  background-color: #fde68a;
}

.like {
  background-color: #d1fae5;
  color: #059669;
}

.like:hover:not(:disabled) {
  background-color: #a7f3d0;
}

.progress-indicator {
  margin-top: 1rem;
  text-align: center;
}

.progress-indicator p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #8b5cf6;
  border-radius: 3px;
  transition: width 0.3s ease;
}
</style>
