<template>
  <div class="edition-browser">
    <h1>Edition Browser</h1>
    <p class="description">
      This component demonstrates database-specific features by allowing you to browse songs by edition type.
    </p>
    
    <div class="editions-container">
      <div v-if="loading" class="loading-indicator">
        <p>Loading editions...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
      
      <div v-else>
        <div class="edition-tabs">
          <button 
            v-for="edition in editions" 
            :key="edition.editionId"
            :class="{ active: selectedEdition === edition.editionId }"
            @click="selectEdition(edition.editionId)"
            class="edition-tab"
          >
            {{ edition.editionName }}
          </button>
        </div>
        
        <div class="edition-content">
          <div v-if="loadingSongs" class="loading-indicator">
            <p>Loading songs...</p>
          </div>
          
          <div v-else-if="!selectedEdition" class="empty-state">
            <p>Select an edition to view its songs</p>
          </div>
          
          <div v-else-if="editionSongs.length === 0" class="empty-state">
            <p>No songs found for this edition</p>
          </div>
          
          <div v-else class="song-list-container">
            <h2>{{ getSelectedEditionName() }} Songs</h2>
            <p class="song-count">{{ editionSongs.length }} songs</p>
            
            <div class="song-list">
              <div 
                v-for="song in editionSongs" 
                :key="song.songId"
                class="song-card"
              >
                <h3 class="song-title">{{ song.canonicalTitle }}</h3>
                <div class="song-details">
                  <span v-if="song.era" class="song-era">{{ song.era }}</span>
                  <span v-if="song.recordings && song.recordings.length" class="recording-count">
                    {{ song.recordings.length }} recordings
                  </span>
                </div>
                <div v-if="song.notes" class="song-notes">
                  {{ song.notes }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { databaseService } from '@/services/databaseService'

export default {
  name: 'EditionBrowser',
  
  setup() {
    // State
    const editions = ref([])
    const selectedEdition = ref(null)
    const editionSongs = ref([])
    const loading = ref(false)
    const loadingSongs = ref(false)
    const error = ref(null)
    
    // Load all editions
    const loadEditions = async () => {
      loading.value = true
      error.value = null
      
      try {
        const { data } = await databaseService.editions.getAll()
        editions.value = data || []
        
        // If we have a "vault" edition, select it by default
        const vaultEdition = editions.value.find(e => 
          e.editionName.toLowerCase() === 'vault'
        )
        
        if (vaultEdition) {
          selectEdition(vaultEdition.editionId)
        }
      } catch (err) {
        console.error('Error loading editions:', err)
        error.value = 'Failed to load editions: ' + (err.message || 'Unknown error')
      } finally {
        loading.value = false
      }
    }
    
    // Select an edition and load its songs
    const selectEdition = async (editionId) => {
      selectedEdition.value = editionId
      loadSongsForEdition(editionId)
    }
    
    // Load songs for a specific edition
    const loadSongsForEdition = async (editionId) => {
      loadingSongs.value = true
      editionSongs.value = []
      
      try {
        // Get songs for this edition
        const songs = await databaseService.editions.getSongs(editionId)
        
        // Get era information for each song
        const eras = await databaseService.eras.getAll()
        
        // Enhance songs with era name
        editionSongs.value = songs.map(song => {
          const era = eras.data?.find(e => e.eraId === song.originalEraId)
          return {
            ...song,
            era: era ? era.eraName : null
          }
        })
      } catch (err) {
        console.error(`Error loading songs for edition ${editionId}:`, err)
        error.value = 'Failed to load songs: ' + (err.message || 'Unknown error')
      } finally {
        loadingSongs.value = false
      }
    }
    
    // Get the name of the selected edition
    const getSelectedEditionName = () => {
      const edition = editions.value.find(e => e.editionId === selectedEdition.value)
      return edition ? edition.editionName : ''
    }
    
    // Initialize component
    onMounted(() => {
      loadEditions()
    })
    
    return {
      editions,
      selectedEdition,
      editionSongs,
      loading,
      loadingSongs,
      error,
      selectEdition,
      getSelectedEditionName
    }
  }
}
</script>

<style scoped>
.edition-browser {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.loading-indicator, .error-message, .empty-state {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 1rem 0;
}

.error-message {
  background-color: #fee;
  color: #c00;
}

.edition-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.edition-tab {
  padding: 0.75rem 1.25rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.edition-tab:hover {
  background-color: #e0e0e0;
}

.edition-tab.active {
  background-color: #4CAF50;
  color: white;
}

.edition-content {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 300px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.song-count {
  color: #666;
  margin-bottom: 1.5rem;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.song-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.song-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.song-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.song-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #666;
}

.song-era {
  padding: 0.25rem 0.5rem;
  background-color: #e6f7ff;
  border-radius: 4px;
  font-size: 0.8rem;
}

.recording-count {
  font-size: 0.8rem;
  color: #999;
}

.song-notes {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .song-list {
    grid-template-columns: 1fr;
  }
  
  .edition-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}
</style>
