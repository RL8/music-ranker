<template>
  <div class="database-test">
    <h1>Database Integration Test</h1>
    
    <div class="section">
      <h2>Songs from Database</h2>
      <div v-if="dbStore.loading.songs" class="loading">Loading songs...</div>
      <div v-else-if="dbStore.error" class="error">Error: {{ dbStore.error }}</div>
      <div v-else>
        <p>Found {{ dbStore.songs.length }} songs</p>
        <ul class="song-list">
          <li v-for="song in dbStore.songs.slice(0, 10)" :key="song.id || song.songId" class="song-item">
            {{ song.title || song.canonicalTitle }}
          </li>
        </ul>
        <div class="note">(Showing first 10 songs)</div>
      </div>
    </div>
    
    <div class="section">
      <h2>Songs by Era</h2>
      <div v-if="dbStore.loading.songsByEra" class="loading">Loading songs by era...</div>
      <div v-else-if="dbStore.error" class="error">Error: {{ dbStore.error }}</div>
      <div v-else>
        <div v-for="era in dbStore.songsByEra" :key="era.eraId" class="era-group">
          <h3>{{ era.era }}</h3>
          <p>{{ era.songs.length }} songs</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>Editions</h2>
      <button @click="loadEditions" :disabled="loadingEditions">
        {{ loadingEditions ? 'Loading...' : 'Load Editions' }}
      </button>
      <div v-if="editions.length > 0">
        <ul class="editions-list">
          <li v-for="edition in editions" :key="edition.editionId" class="edition-item">
            <strong>{{ edition.editionName }}</strong>
            <span v-if="edition.description">- {{ edition.description }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDatabaseMusicStore } from '@/store/databaseMusicStore'
import { databaseService } from '@/services/databaseService'

export default {
  name: 'DatabaseTest',
  
  setup() {
    const dbStore = useDatabaseMusicStore()
    const editions = ref([])
    const loadingEditions = ref(false)
    
    // Load songs and songs by era when component mounts
    onMounted(() => {
      // Initialize basic data
      dbStore.fetchSongs()
      dbStore.fetchSongsByEra()
    })
    
    // Function to load editions on demand
    const loadEditions = async () => {
      loadingEditions.value = true
      try {
        const { data, error } = await databaseService.editions.getAll()
        if (error) throw error
        editions.value = data || []
      } catch (error) {
        console.error('Error loading editions:', error)
      } finally {
        loadingEditions.value = false
      }
    }
    
    return {
      dbStore,
      editions,
      loadingEditions,
      loadEditions
    }
  }
}
</script>

<style scoped>
.database-test {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.loading {
  color: #666;
  font-style: italic;
}

.error {
  color: #d32f2f;
  font-weight: bold;
}

.song-list, .editions-list {
  list-style: none;
  padding: 0;
}

.song-item, .edition-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.era-group {
  margin-bottom: 15px;
}

.era-group h3 {
  margin-bottom: 5px;
}

.note {
  font-size: 0.8em;
  color: #666;
  margin-top: 10px;
}

button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 0;
  cursor: pointer;
  border-radius: 4px;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
