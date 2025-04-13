<template>
  <div class="hybrid-song-list">
    <div class="controls">
      <h2>Song List</h2>
      <div class="data-source-toggle">
        <span>Data Source:</span>
        <div class="toggle-switch">
          <button 
            @click="setDataSource('static')" 
            :class="{ 'active': !usingDatabase.value }"
            class="source-button"
          >
            Static JSON
          </button>
          <button 
            @click="setDataSource('database')" 
            :class="{ 'active': usingDatabase.value }"
            class="source-button"
          >
            Database
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      <p>Loading songs...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>Error: {{ error }}</p>
    </div>
    
    <div v-else class="song-list-container">
      <p class="song-count">Found {{ songs.length }} songs</p>
      
      <div class="filter-controls">
        <div class="filter-group">
          <label for="era-filter">Filter by Era:</label>
          <select id="era-filter" v-model="selectedEra" @change="filterSongs">
            <option value="">All Eras</option>
            <option v-for="era in eras" :key="era.eraId" :value="era.eraId">
              {{ era.eraName }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="edition-filter">Filter by Edition:</label>
          <select id="edition-filter" v-model="selectedEdition" @change="filterSongs" :disabled="!usingDatabase.value">
            <option value="">All Editions</option>
            <option v-for="edition in editions" :key="edition.editionId" :value="edition.editionId">
              {{ edition.editionName }}
            </option>
          </select>
          <span v-if="!usingDatabase.value" class="edition-note">
            (Edition filtering requires database)
          </span>
        </div>
      </div>
      
      <ul class="song-list">
        <li v-for="song in filteredSongs" :key="getSongId(song)" class="song-item">
          <div class="song-title">{{ getSongTitle(song) }}</div>
          <div class="song-era" v-if="getSongEra(song)">
            {{ getSongEra(song) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useMusicStore } from '@/store/musicStore'
import { useDatabaseMusicStore } from '@/store/databaseMusicStore'
import { useDatabase } from '@/utils/useDatabase'
import staticSongsData from '@/data/taylor-swift-songs.json'

export default {
  name: 'HybridSongList',
  
  setup() {
    // State
    const usingDatabase = ref(useDatabase.isEnabled())
    const loading = ref(false)
    const error = ref(null)
    const songs = ref([])
    const eras = ref([])
    const editions = ref([])
    const selectedEra = ref('')
    const selectedEdition = ref('')
    const filteredSongs = ref([])
    
    // Store references
    const musicStore = useMusicStore()
    const dbMusicStore = useDatabaseMusicStore()
    
    // Set data source
    const setDataSource = async (dataSource) => {
      if (dataSource === 'static') {
        usingDatabase.value = false
        useDatabase.disable()
      } else if (dataSource === 'database') {
        usingDatabase.value = true
        useDatabase.enable()
      }
      
      console.log(`Data source set to: ${dataSource}`)
      console.log(`usingDatabase.value: ${usingDatabase.value}`)
      
      await loadData()
    }
    
    // Load data based on the current data source
    const loadData = async () => {
      loading.value = true
      error.value = null
      songs.value = []
      
      try {
        console.log(`Loading data from: ${usingDatabase.value ? 'database' : 'static JSON'}`)
        
        if (usingDatabase.value) {
          // Load from database
          await dbMusicStore.fetchSongs()
          await dbMusicStore.fetchEras()
          await dbMusicStore.fetchEditions()
          
          // Get songs from the database store
          songs.value = dbMusicStore.songs
          eras.value = dbMusicStore.eras
          editions.value = dbMusicStore.editions
        } else {
          // Load from static JSON
          songs.value = staticSongsData
          // Static data doesn't have editions
          editions.value = []
        }
        
        // Apply any active filters
        filterSongs()
      } catch (err) {
        console.error('Error loading data:', err)
        error.value = err.message || 'Failed to load songs'
      } finally {
        loading.value = false
      }
    }
    
    // Filter songs based on selected era and edition
    const filterSongs = () => {
      let result = [...songs.value]
      
      // Filter by era if selected
      if (selectedEra.value) {
        result = result.filter(song => {
          const songEra = usingDatabase.value ? song.originalEraId : song.era
          return songEra === selectedEra.value
        })
      }
      
      // Filter by edition if selected (database only)
      if (usingDatabase.value && selectedEdition.value) {
        result = result.filter(song => {
          // This assumes the database store has edition information
          // You might need to adjust this based on your actual data structure
          return song.editions?.includes(selectedEdition.value)
        })
      }
      
      filteredSongs.value = result
    }
    
    // Helper functions to handle different data formats
    const getSongId = (song) => {
      return usingDatabase.value ? song.songId : song.id
    }
    
    const getSongTitle = (song) => {
      return usingDatabase.value ? song.canonicalTitle : song.title
    }
    
    const getSongEra = (song) => {
      if (usingDatabase.value) {
        const era = eras.value.find(e => e.eraId === song.originalEraId)
        return era ? era.eraName : ''
      } else {
        return song.era
      }
    }
    
    // Watch for changes in filters
    watch([selectedEra, selectedEdition], () => {
      filterSongs()
    })
    
    // Load data when component mounts
    onMounted(() => {
      loadData()
    })
    
    return {
      usingDatabase,
      loading,
      error,
      songs,
      eras,
      editions,
      selectedEra,
      selectedEdition,
      filteredSongs,
      setDataSource,
      filterSongs,
      getSongId,
      getSongTitle,
      getSongEra
    }
  }
}
</script>

<style scoped>
.hybrid-song-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.data-source-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-switch {
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.source-button {
  background-color: #f5f5f5;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  border-right: 1px solid #ddd;
  font-weight: 500;
}

.source-button:last-child {
  border-right: none;
}

.source-button:hover {
  background-color: #e8e8e8;
}

.source-button.active {
  background-color: #4CAF50;
  color: white;
}

.loading-indicator, .error-message {
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
}

.song-count {
  margin-bottom: 15px;
  color: #666;
}

.filter-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.edition-note {
  font-size: 0.8em;
  color: #999;
  font-style: italic;
}

.song-list {
  list-style: none;
  padding: 0;
}

.song-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s ease;
}

.song-item:hover {
  background-color: #f5f5f5;
}

.song-title {
  font-weight: 500;
}

.song-era {
  color: #666;
  font-size: 0.9em;
}
</style>
