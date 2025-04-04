<template>
  <div class="song-detail">
    <b-container>
      <b-row class="my-4">
        <b-col>
          <b-button variant="outline-secondary" to="/" class="mb-3">
            <b-icon icon="arrow-left"></b-icon> Back to Home
          </b-button>
          
          <div v-if="loading" class="text-center">
            <b-spinner label="Loading..."></b-spinner>
            <p>Loading song details...</p>
          </div>
          
          <div v-else-if="error" class="my-3">
            <b-alert show variant="danger">{{ error }}</b-alert>
          </div>
          
          <div v-else-if="song" class="song-card">
            <b-card
              :title="song.title"
              :sub-title="'by ' + song.artist"
              class="mb-4"
            >
              <b-card-text>
                <div class="rating-display">
                  <span class="rating-label">Rating:</span>
                  <b-form-rating
                    v-model="currentRating"
                    inline
                    no-border
                    show-value
                    @change="updateRating"
                  ></b-form-rating>
                </div>
              </b-card-text>
            </b-card>
          </div>
          
          <div v-else class="text-center my-4">
            <b-alert show variant="warning">Song not found</b-alert>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { useMusicStore } from '@/store'
import { mapState } from 'pinia'

export default {
  name: 'SongDetailView',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      musicStore: useMusicStore(),
      currentRating: 0
    }
  },
  computed: {
    ...mapState(useMusicStore, ['loading', 'error']),
    song() {
      // Convert id to number since route params are strings
      const songId = Number(this.id)
      return this.musicStore.getSongById(songId)
    }
  },
  watch: {
    song: {
      immediate: true,
      handler(newSong) {
        if (newSong) {
          this.currentRating = newSong.rating
        }
      }
    }
  },
  created() {
    // Fetch songs if not already loaded
    if (this.musicStore.songs.length === 0) {
      this.musicStore.fetchSongs()
    }
  },
  methods: {
    updateRating(newRating) {
      const songId = Number(this.id)
      this.musicStore.updateSongRating(songId, newRating)
    }
  }
}
</script>

<style scoped>
.song-detail {
  padding: 20px;
}

.song-card {
  max-width: 600px;
  margin: 0 auto;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-label {
  font-weight: bold;
}
</style>
