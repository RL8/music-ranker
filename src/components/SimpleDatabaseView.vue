<template>
  <div class="simple-db-view">
    <h1>Database Songs</h1>
    <p class="description">A simple view of songs from the database</p>
    
    <div v-if="loading" class="loading">
      Loading data from database...
    </div>
    
    <div v-else-if="error" class="error">
      <h3>Error loading data</h3>
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <p class="count">Found {{ songs.length }} songs</p>
      
      <div class="song-list">
        <div v-for="song in songs" :key="song.songId" class="song-card">
          <h3>{{ song.canonicalTitle }}</h3>
          <p v-if="song.era">Era: {{ song.era }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase/client'

export default {
  name: 'SimpleDatabaseView',
  
  setup() {
    const songs = ref([])
    const loading = ref(true)
    const error = ref(null)
    
    const loadSongs = async () => {
      loading.value = true
      error.value = null
      
      try {
        console.log('Attempting to load songs from database...')
        
        // Direct database query - no abstraction layers
        const { data, error: dbError } = await supabase
          .from('UniqueSongs')
          .select('*')
          .order('canonicalTitle')
        
        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }
        
        // Get era information for display
        if (data && data.length > 0) {
          console.log(`Found ${data.length} songs, fetching era information...`)
          const eraIds = [...new Set(data.map(song => song.originalEraId).filter(id => id))]
          
          if (eraIds.length > 0) {
            const { data: eras, error: erasError } = await supabase
              .from('Eras')
              .select('*')
              .in('eraId', eraIds)
            
            if (erasError) {
              console.error('Error fetching eras:', erasError)
              throw erasError
            }
            
            // Add era names to songs
            songs.value = data.map(song => {
              const era = eras?.find(e => e.eraId === song.originalEraId)
              return {
                ...song,
                era: era ? era.eraName : null
              }
            })
          } else {
            songs.value = data
          }
        } else {
          songs.value = data || []
        }
        
        console.log(`Loaded ${songs.value.length} songs from database`)
      } catch (err) {
        console.error('Error loading songs from database:', err)
        error.value = `Failed to load songs: ${err.message || 'Unknown error'}`
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadSongs()
    })
    
    return {
      songs,
      loading,
      error
    }
  }
}
</script>

<style scoped>
.simple-db-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 1rem 0;
}

.error {
  background-color: #fee;
  color: #c00;
}

.count {
  margin-bottom: 1rem;
  font-weight: 500;
}

.song-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.song-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.song-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}
</style>
