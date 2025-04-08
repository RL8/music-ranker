<template>
  <div class="supabase-importer">
    <h2>Taylor Swift Data Importer</h2>
    
    <div v-if="!isAuthenticated" class="auth-warning">
      <p>You need to be authenticated as an admin to use this tool.</p>
      <button @click="login" class="btn btn-primary">Login</button>
    </div>
    
    <div v-else>
      <div class="import-section">
        <h3>Import CSV Files</h3>
        <p>Select the CSV files to import into Supabase:</p>
        
        <div class="file-inputs">
          <div class="file-input">
            <label for="artists-file">Artists CSV:</label>
            <input 
              type="file" 
              id="artists-file" 
              @change="handleFileChange('artists', $event)"
              accept=".csv,.txt"
            />
            <span v-if="files.artists">{{ files.artists.name }}</span>
          </div>
          
          <div class="file-input">
            <label for="eras-file">Eras CSV:</label>
            <input 
              type="file" 
              id="eras-file" 
              @change="handleFileChange('eras', $event)"
              accept=".csv,.txt"
            />
            <span v-if="files.eras">{{ files.eras.name }}</span>
          </div>
          
          <div class="file-input">
            <label for="albums-file">Albums CSV:</label>
            <input 
              type="file" 
              id="albums-file" 
              @change="handleFileChange('albums', $event)"
              accept=".csv,.txt"
            />
            <span v-if="files.albums">{{ files.albums.name }}</span>
          </div>
          
          <div class="file-input">
            <label for="songs-file">Songs CSV:</label>
            <input 
              type="file" 
              id="songs-file" 
              @change="handleFileChange('songs', $event)"
              accept=".csv,.txt"
            />
            <span v-if="files.songs">{{ files.songs.name }}</span>
          </div>
          
          <div class="file-input">
            <label for="recordings-file">Recordings CSV:</label>
            <input 
              type="file" 
              id="recordings-file" 
              @change="handleFileChange('recordings', $event)"
              accept=".csv,.txt"
            />
            <span v-if="files.recordings">{{ files.recordings.name }}</span>
          </div>
        </div>
        
        <div class="actions">
          <button 
            @click="importData" 
            class="btn btn-primary"
            :disabled="isImporting || !hasFiles"
          >
            {{ isImporting ? 'Importing...' : 'Import Data' }}
          </button>
          
          <button 
            @click="createTables" 
            class="btn btn-secondary"
            :disabled="isImporting"
          >
            Create Tables Only
          </button>
        </div>
      </div>
      
      <div v-if="importStatus" class="import-status">
        <h3>Import Status</h3>
        
        <div v-if="importStatus.error" class="error">
          <p>Error: {{ importStatus.error }}</p>
        </div>
        
        <div v-else-if="importStatus.success" class="success">
          <p>Import completed successfully!</p>
          
          <div v-if="importStatus.results" class="results">
            <h4>Results:</h4>
            <ul>
              <li v-for="(result, type) in importStatus.results" :key="type">
                {{ type }}: 
                <span v-if="result.error" class="text-danger">
                  Error: {{ result.error }}
                </span>
                <span v-else-if="result.success" class="text-success">
                  {{ result.count }} records imported
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { supabase } from '../../lib/supabase/client'
import { 
  parseCSV, 
  importToTable, 
  createTaylorSwiftTables,
  importTaylorSwiftData
} from '../../utils/supabase-import/csvImporter'
import { readMultipleFiles } from '../../utils/supabase-import/fileReader'

export default {
  name: 'SupabaseImporter',
  
  setup() {
    const isAuthenticated = ref(false)
    const user = ref(null)
    const files = ref({
      artists: null,
      eras: null,
      albums: null,
      songs: null,
      recordings: null
    })
    const isImporting = ref(false)
    const importStatus = ref(null)
    
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      user.value = data.user
      isAuthenticated.value = !!data.user
    }
    
    // Call checkAuth on component mount
    checkAuth()
    
    // Login function
    const login = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.href
        }
      })
    }
    
    // Handle file selection
    const handleFileChange = (type, event) => {
      if (event.target.files.length > 0) {
        files.value[type] = event.target.files[0]
      } else {
        files.value[type] = null
      }
    }
    
    // Check if any files are selected
    const hasFiles = computed(() => {
      return Object.values(files.value).some(file => file !== null)
    })
    
    // Create tables only
    const createTables = async () => {
      isImporting.value = true
      importStatus.value = null
      
      try {
        const result = await createTaylorSwiftTables()
        
        if (result.error) {
          importStatus.value = { error: result.error }
        } else {
          importStatus.value = { 
            success: true,
            message: 'Tables created successfully'
          }
        }
      } catch (error) {
        importStatus.value = { error: error.message }
      } finally {
        isImporting.value = false
      }
    }
    
    // Import data from files
    const importData = async () => {
      isImporting.value = true
      importStatus.value = null
      
      try {
        // Read all files
        const fileContents = await readMultipleFiles({
          artists: files.value.artists,
          eras: files.value.eras,
          albums: files.value.albums,
          songs: files.value.songs,
          recordings: files.value.recordings
        })
        
        // Import the data
        const result = await importTaylorSwiftData(fileContents)
        importStatus.value = result
      } catch (error) {
        importStatus.value = { error: error.message }
      } finally {
        isImporting.value = false
      }
    }
    
    return {
      isAuthenticated,
      user,
      files,
      isImporting,
      importStatus,
      hasFiles,
      login,
      handleFileChange,
      createTables,
      importData
    }
  }
}
</script>

<style scoped>
.supabase-importer {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.auth-warning {
  background-color: #f8d7da;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.import-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.file-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.file-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.file-input label {
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.import-status {
  margin-top: 30px;
  padding: 15px;
  border-radius: 5px;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}

.success {
  background-color: #d4edda;
  color: #155724;
}

.results {
  margin-top: 15px;
}

.text-danger {
  color: #dc3545;
}

.text-success {
  color: #28a745;
}
</style>
