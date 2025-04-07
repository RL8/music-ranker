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
        <img alt="Vue logo" src="../assets/logo.png" class="app-logo">
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
        <div class="d-flex justify-content-between align-items-center w-100">
          <div class="song-info">
            <div class="song-title">{{ item.title }}</div>
            <div class="song-artist">{{ item.artist }}</div>
          </div>
          <b-badge variant="primary" pill>{{ item.rating }}</b-badge>
        </div>
      </template>
      
      <template #empty>
        <div class="text-center py-4">
          <p>No songs found. Click "Load Music" to get started.</p>
        </div>
      </template>
    </mobile-list>
  </div>
</template>

<script>
import { useMusicStore } from '@/store'
import MobileCard from '@/components/ui/MobileCard.vue'
import MobileList from '@/components/ui/MobileList.vue'

export default {
  name: 'HomeView',
  components: {
    MobileCard,
    MobileList
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
    max-width: 80px;
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

// Media queries for larger screens
@media (min-width: 768px) {
  .home {
    max-width: 768px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .app-intro {
    .app-logo {
      max-width: 100px;
    }
    
    h2 {
      font-size: 1.75rem;
    }
  }
}
</style>
