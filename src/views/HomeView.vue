<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <b-container>
      <b-row class="my-4">
        <b-col>
          <h2>Music Ranker</h2>
          <p>A simple application to rank your favorite music</p>
          <b-button variant="primary" @click="loadData">Load Music Data</b-button>
        </b-col>
      </b-row>
      
      <!-- Loading indicator -->
      <b-row v-if="musicStore.loading">
        <b-col class="text-center">
          <b-spinner label="Loading..."></b-spinner>
          <p>Loading music data...</p>
        </b-col>
      </b-row>
      
      <!-- Error message -->
      <b-row v-if="musicStore.error">
        <b-col>
          <b-alert show variant="danger">{{ musicStore.error }}</b-alert>
        </b-col>
      </b-row>
      
      <!-- Top rated songs -->
      <b-row v-if="musicStore.songs.length > 0">
        <b-col>
          <h3>Top Rated Songs</h3>
          <b-list-group>
            <b-list-group-item 
              v-for="song in topRatedSongs" 
              :key="song.id"
              class="song-item"
              @click="viewSongDetails(song.id)"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ song.title }}</strong> by {{ song.artist }}
                </div>
                <b-badge variant="primary" pill>{{ song.rating }}</b-badge>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { useMusicStore } from '@/store'
import { mapState } from 'pinia'

export default {
  name: 'HomeView',
  computed: {
    ...mapState(useMusicStore, ['songs', 'artists', 'loading', 'error']),
    topRatedSongs() {
      return this.musicStore.topRatedSongs
    }
  },
  data() {
    return {
      musicStore: useMusicStore()
    }
  },
  methods: {
    loadData() {
      this.musicStore.fetchSongs()
      this.musicStore.fetchArtists()
    },
    viewSongDetails(songId) {
      this.$router.push({ name: 'song-detail', params: { id: songId } })
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.song-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-item:hover {
  background-color: #f8f9fa;
}
</style>
