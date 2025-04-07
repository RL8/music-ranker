<template>
  <div class="home">
    <mobile-card>
      <template #header-actions>
        <b-button size="sm" variant="primary" @click="loadData">
          <span v-if="!musicStore.loading">Load Music</span>
          <b-spinner v-else small></b-spinner>
        </b-button>
      </template>
      
      <div class="app-intro">
        <lazy-image 
          src="../assets/logo.png" 
          alt="Vue logo" 
          :width="80" 
          :height="80"
          class="app-logo"
        />
        <h2>Music Ranker</h2>
        <p>A simple application to rank your favorite music</p>
      </div>
    </mobile-card>
      
    <!-- Error message -->
    <b-alert v-if="musicStore.error" show variant="danger" class="mb-3">
      {{ musicStore.error }}
    </b-alert>
    
    <!-- Top rated songs -->
    <mobile-list
      v-if="musicStore.songs.length > 0"
      :items="topRatedSongs"
      title="Top Rated Songs"
      item-key="id"
      show-arrow
      @item-click="viewSongDetails"
    >
      <template #item="{ item }">
        <touch-feedback>
          <div class="d-flex justify-content-between align-items-center w-100">
            <div class="song-info">
              <div class="song-title">{{ item.title }}</div>
              <div class="song-artist">{{ item.artist }}</div>
            </div>
            <b-badge variant="primary" pill>{{ item.rating }}</b-badge>
          </div>
        </touch-feedback>
      </template>
      
      <template #empty>
        <div class="text-center py-4">
          <p>No songs found. Click "Load Music" to get started.</p>
        </div>
      </template>
    </mobile-list>
    
    <!-- Swipe actions demo (for songs with swipe actions) -->
    <mobile-card v-if="musicStore.songs.length > 0" title="Swipe Actions Demo">
      <div class="swipe-demo">
        <p class="text-muted mb-3">Try swiping left or right on items below:</p>
        
        <div v-for="song in topRatedSongs.slice(0, 3)" :key="song.id" class="mb-2">
          <swipe-action
            :left-actions="[
              { label: 'Favorite', type: 'default', handler: () => toggleFavorite(song) }
            ]"
            :right-actions="[
              { label: 'Delete', type: 'danger', handler: () => removeSong(song) }
            ]"
          >
            <touch-feedback>
              <div class="swipe-item">
                <div class="song-info">
                  <div class="song-title">{{ song.title }}</div>
                  <div class="song-artist">{{ song.artist }}</div>
                </div>
                <b-badge variant="primary" pill>{{ song.rating }}</b-badge>
              </div>
            </touch-feedback>
          </swipe-action>
        </div>
      </div>
    </mobile-card>
  </div>
</template>

<script>
import { useMusicStore } from '@/store'
import MobileCard from '@/components/ui/MobileCard.vue'
import MobileList from '@/components/ui/MobileList.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import TouchFeedback from '@/components/ui/TouchFeedback.vue'
import SwipeAction from '@/components/ui/SwipeAction.vue'

export default {
  name: 'HomeView',
  components: {
    MobileCard,
    MobileList,
    LazyImage,
    TouchFeedback,
    SwipeAction
  },
  setup() {
    const musicStore = useMusicStore()
    return { musicStore }
  },
  computed: {
    topRatedSongs() {
      return this.musicStore.songs
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10)
    }
  },
  methods: {
    loadData() {
      this.musicStore.fetchSongs()
    },
    viewSongDetails(song) {
      this.$router.push({ name: 'song-detail', params: { id: song.id } })
    },
    // Method for the refresh functionality
    refresh() {
      return this.loadData()
    },
    // Demo methods for swipe actions
    toggleFavorite(song) {
      // This would normally update the favorite status in the store
      alert(`Added ${song.title} to favorites!`)
    },
    removeSong(song) {
      // This would normally remove the song from the store
      alert(`Removed ${song.title}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  max-width: 100%;
  padding: 0 0.5rem;
}

.app-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  
  .app-logo {
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  p {
    margin-bottom: 0;
    color: #666;
  }
}

.song-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  .song-title {
    font-weight: 500;
  }
  
  .song-artist {
    font-size: 0.875rem;
    color: #666;
  }
}

.swipe-demo {
  .swipe-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #fff;
  }
}

// Media queries for larger screens
@media (min-width: 768px) {
  .home {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .app-intro {
    h2 {
      font-size: 1.75rem;
    }
  }
}
</style>
