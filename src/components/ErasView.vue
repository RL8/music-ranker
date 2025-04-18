<template>
  <div class="eras-view">
    <h1>Musical Eras</h1>
    <p class="description">Displaying all musical eras from the database</p>
    
    <div v-if="loading" class="loading">
      Loading eras from database...
    </div>
    
    <div v-else-if="error" class="error">
      <h3>Error loading eras</h3>
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <p class="count">Found {{ eras.length }} eras</p>
      
      <div class="eras-list">
        <div v-for="era in eras" :key="era.eraId" class="era-card">
          <div class="era-image">
            <img 
              :src="getImageUrl(era)" 
              :alt="era.eraName"
              @error="handleImageError($event, era)"
            />
          </div>
          <div class="era-details">
            <h3>{{ era.eraName }}</h3>
            <p v-if="era.eraStartDate">Start Date: {{ formatDate(era.eraStartDate) }}</p>
            <p v-if="era.primaryAlbumId">Primary Album ID: {{ era.primaryAlbumId }}</p>
            
            <!-- Song count and toggle button -->
            <div class="songs-header">
              <p class="song-count" v-if="era.songs">
                <strong>{{ era.songs.length }}</strong> unique songs
              </p>
              <button 
                @click="toggleSongsList(era.eraId)" 
                class="toggle-songs-btn"
                :class="{ 'active': expandedEras.includes(era.eraId) }"
              >
                {{ expandedEras.includes(era.eraId) ? 'Hide Songs' : 'Show Songs' }}
              </button>
            </div>
            
            <!-- Songs list (expandable) -->
            <div v-if="expandedEras.includes(era.eraId)" class="songs-list">
              <div v-if="!era.songs || era.songs.length === 0" class="no-songs">
                <p>No songs found for this era</p>
              </div>
              <div v-else>
                <ul>
                  <li v-for="song in era.songs" :key="song.songId" class="song-item">
                    {{ song.canonicalTitle || song.title }}
                  </li>
                </ul>
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
import { supabase } from '../lib/supabase/client'
import { dataAdapter } from '../services/dataAdapter'

export default {
  name: 'ErasView',
  
  setup() {
    const eras = ref([])
    const loading = ref(true)
    const error = ref(null)
    const expandedEras = ref([])
    
    const loadEras = async () => {
      loading.value = true
      error.value = null
      
      try {
        console.log('Attempting to load eras from database...')
        
        // First, load all eras with basic information
        const { data, error: dbError } = await supabase
          .from('Eras')
          .select('*')
          .order('eraName')
        
        if (dbError) {
          console.error('Database error:', dbError)
          throw dbError
        }
        
        // Store basic era information
        const basicEras = data || []
        console.log(`Loaded ${basicEras.length} eras from database`)
        
        // Then, fetch songs by era to get the complete data
        try {
          console.log('Fetching songs by era...')
          const erasWithSongs = await dataAdapter.getSongsByEra()
          console.log(`Loaded songs for ${erasWithSongs.length} eras`)
          
          // Merge the data - keep all eras but add songs where available
          eras.value = basicEras.map(basicEra => {
            const eraWithSongs = erasWithSongs.find(e => e.eraId === basicEra.eraId)
            return {
              ...basicEra,
              songs: eraWithSongs ? eraWithSongs.songs : []
            }
          })
          
          // Log song counts for debugging
          eras.value.forEach(era => {
            console.log(`Era: ${era.eraName}, Songs: ${era.songs ? era.songs.length : 0}`)
          })
        } catch (songsError) {
          console.error('Error loading songs by era:', songsError)
          // If songs fail to load, still show eras without songs
          eras.value = basicEras.map(era => ({ ...era, songs: [] }))
        }
        
        // Debug log for image paths
        eras.value.forEach(era => {
          console.log(`Era: ${era.eraName}, Image Path: ${getImageUrl(era)}`)
        })
      } catch (err) {
        console.error('Error loading eras from database:', err)
        error.value = `Failed to load eras: ${err.message || 'Unknown error'}`
      } finally {
        loading.value = false
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (e) {
        return dateString;
      }
    }
    
    const getImageUrl = (era) => {
      // First check if the era has an image URL from the database
      // Check both coverImageUrl and image_url fields
      if (era.coverImageUrl) {
        return era.coverImageUrl;
      }
      
      if (era.image_url) {
        return era.image_url;
      }
      
      // If no database URL, fall back to local image mapping
      const eraNameToFileName = {
        'Taylor Swift': 'ts',
        'Debut Era': 'ts',  
        'Fearless': 'fearless',
        'Speak Now': 'speaknow',
        'Red': 'red',
        '1989': '1989',
        'Reputation': 'reputation',
        'Lover': 'lover',
        'Folklore': 'folklore',
        'Evermore': 'evermore',
        'Midnights': 'midnights',
        'The Tortured Poets Department': 'tortured',
        'TTPD Era': 'tortured'
      };
      
      // Special case for TTPD Era
      if ((era.eraName === 'TTPD Era' || era.eraId === 'ERA_TTPD') && era.image_url) {
        return era.image_url;
      }
      
      // Try to find a matching file name based on era name
      const fileName = eraNameToFileName[era.eraName] || era.eraId?.toLowerCase();
      
      if (fileName) {
        // Use the era_*.jpg format that's being used in the application
        return `/img/covers/era_${fileName}.jpg`;
      }
      
      // Default fallback
      return '/img/covers/default.jpg';
    }
    
    const handleImageError = (event, era) => {
      // Fallback to a default image if the era image fails to load
      event.target.src = '/img/covers/default.jpg';
      console.log(`Image for era ${era.eraName} failed to load, using default image`);
    }
    
    const toggleSongsList = (eraId) => {
      if (expandedEras.value.includes(eraId)) {
        expandedEras.value = expandedEras.value.filter(id => id !== eraId)
      } else {
        expandedEras.value.push(eraId)
      }
    }
    
    onMounted(() => {
      loadEras()
    })
    
    return {
      eras,
      loading,
      error,
      formatDate,
      handleImageError,
      getImageUrl,
      expandedEras,
      toggleSongsList
    }
  }
}
</script>

<style scoped>
.eras-view {
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

.eras-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.era-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.era-image {
  height: 180px;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
}

.era-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.era-image img:hover {
  transform: scale(1.05);
}

.era-details {
  flex: 1;
}

.era-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.era-card p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #666;
}

.songs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.song-count {
  font-size: 0.9rem;
  color: #666;
}

.toggle-songs-btn {
  background-color: #f9f9f9;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-songs-btn.active {
  background-color: #ccc;
}

.songs-list {
  margin-top: 1rem;
}

.no-songs {
  padding: 1rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.song-item {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.song-item:last-child {
  border-bottom: none;
}
</style>
