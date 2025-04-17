<template>
  <div class="image-loading-diagnostic">
    <h2>Supabase Image Loading Diagnostic</h2>
    
    <div class="controls">
      <button @click="loadErasData" class="diagnostic-button">
        Load Eras Data from Supabase
      </button>
      <button @click="clearLogs" class="diagnostic-button clear">
        Clear Logs
      </button>
    </div>
    
    <div class="diagnostic-section">
      <h3>Request/Response Log</h3>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-entry" :class="log.type">
          <div class="log-timestamp">{{ log.timestamp }}</div>
          <div class="log-type">{{ log.type.toUpperCase() }}</div>
          <div class="log-message">{{ log.message }}</div>
          <pre class="log-data">{{ JSON.stringify(log.data, null, 2) }}</pre>
        </div>
        <div v-if="logs.length === 0" class="no-logs">
          No logs yet. Click "Load Eras Data from Supabase" to begin.
        </div>
      </div>
    </div>
    
    <div class="diagnostic-section">
      <h3>Era Data</h3>
      <div class="era-data-container">
        <div v-if="loading" class="loading">Loading data...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="eras.length === 0" class="no-data">No era data loaded yet.</div>
        <div v-else class="era-cards">
          <div v-for="era in eras" :key="era.eraId" class="era-card">
            <h4>{{ era.eraName }}</h4>
            <div class="era-details">
              <div class="era-field">
                <span class="field-label">ID:</span> 
                <span class="field-value">{{ era.eraId }}</span>
              </div>
              <div class="era-field">
                <span class="field-label">Start Date:</span> 
                <span class="field-value">{{ era.eraStartDate }}</span>
              </div>
              <div class="era-field">
                <span class="field-label">Primary Album:</span> 
                <span class="field-value">{{ era.primaryAlbumId }}</span>
              </div>
              <div class="era-field">
                <span class="field-label">coverImageUrl:</span> 
                <span class="field-value" :class="{'missing': !era.coverImageUrl}">
                  {{ era.coverImageUrl || 'NOT PRESENT' }}
                </span>
              </div>
              <div class="era-field">
                <span class="field-label">image_url:</span> 
                <span class="field-value" :class="{'missing': !era.image_url}">
                  {{ era.image_url || 'NOT PRESENT' }}
                </span>
              </div>
            </div>
            <div class="era-image-test">
              <h5>Image Test</h5>
              <img 
                :src="era.image_url || era.coverImageUrl || '/img/covers/default.jpg'" 
                :alt="era.eraName"
                @error="handleImageError($event, era)"
                class="test-image"
              />
              <div class="image-status" :class="imageStatuses[era.eraId] || 'pending'">
                {{ getImageStatusText(era.eraId) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="diagnostic-section">
      <h3>Specific Era Check: Debut Era</h3>
      <div v-if="loading" class="loading">Loading data...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="specific-era-check">
          <div v-if="debutEra" class="era-card">
            <h4>{{ debutEra.eraName }}</h4>
            <div class="era-details">
              <div class="era-field">
                <span class="field-label">ID:</span> 
                <span class="field-value">{{ debutEra.eraId }}</span>
              </div>
              <div class="era-field">
                <span class="field-label">image_url:</span> 
                <span class="field-value" :class="{'missing': !debutEra.image_url}">
                  {{ debutEra.image_url || 'NOT PRESENT' }}
                </span>
              </div>
              <div class="era-field">
                <span class="field-label">Transformed in Store:</span>
                <button @click="checkStoreTransformation" class="diagnostic-button small">
                  Check Store
                </button>
                <div v-if="storeDebutEra" class="store-era-info">
                  <div class="era-field">
                    <span class="field-label">id:</span> 
                    <span class="field-value">{{ storeDebutEra.id }}</span>
                  </div>
                  <div class="era-field">
                    <span class="field-label">title:</span> 
                    <span class="field-value">{{ storeDebutEra.title }}</span>
                  </div>
                  <div class="era-field">
                    <span class="field-label">coverImageUrl:</span> 
                    <span class="field-value" :class="{'missing': !storeDebutEra.coverImageUrl}">
                      {{ storeDebutEra.coverImageUrl || 'NOT PRESENT' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-data">Debut Era not found in database.</div>
        </div>
      </div>
    </div>
    
    <div class="diagnostic-section">
      <h3>Specific Era Check: TTPD Era</h3>
      <div v-if="loading" class="loading">Loading data...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="specific-era-check">
          <div v-if="ttpdEra" class="era-card">
            <h4>{{ ttpdEra.eraName }}</h4>
            <div class="era-details">
              <div class="era-field">
                <span class="field-label">ID:</span> 
                <span class="field-value">{{ ttpdEra.eraId }}</span>
              </div>
              <div class="era-field">
                <span class="field-label">image_url:</span> 
                <span class="field-value" :class="{'missing': !ttpdEra.image_url}">
                  {{ ttpdEra.image_url || 'NOT PRESENT' }}
                </span>
              </div>
              <div class="era-field">
                <span class="field-label">Image Test:</span>
              </div>
              <div class="era-image-test">
                <img 
                  :src="ttpdEra.image_url || '/img/covers/default.jpg'" 
                  :alt="ttpdEra.eraName"
                  class="test-image"
                />
              </div>
            </div>
          </div>
          <div v-else class="no-data">TTPD Era not found in database.</div>
        </div>
      </div>
    </div>
    
    <div class="diagnostic-section">
      <h3>Raw Database Response</h3>
      <pre class="raw-response">{{ rawResponse ? JSON.stringify(rawResponse, null, 2) : 'No response data yet' }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from '../lib/supabase/client'

export default {
  name: 'ImageLoadingDiagnostic',
  
  setup() {
    const eras = ref([])
    const loading = ref(false)
    const error = ref(null)
    const logs = ref([])
    const rawResponse = ref(null)
    const imageStatuses = reactive({})
    const debutEra = ref(null)
    const storeDebutEra = ref(null)
    const ttpdEra = ref(null)
    
    const addLog = (type, message, data = null) => {
      const timestamp = new Date().toLocaleTimeString()
      logs.value.unshift({
        type,
        message,
        data,
        timestamp
      })
    }
    
    const clearLogs = () => {
      logs.value = []
    }
    
    const loadErasData = async () => {
      loading.value = true
      error.value = null
      eras.value = []
      rawResponse.value = null
      debutEra.value = null
      ttpdEra.value = null
      
      try {
        addLog('info', 'Starting Supabase request to fetch Eras data')
        
        // Log the request details
        const requestDetails = {
          table: 'Eras',
          method: 'SELECT',
          url: `${supabase.supabaseUrl}/rest/v1/Eras`
        }
        addLog('request', 'Sending request to Supabase', requestDetails)
        
        // Make the request
        const { data, error: supabaseError, status, statusText } = await supabase
          .from('Eras')
          .select('*')
        
        // Store the raw response
        rawResponse.value = { data, error: supabaseError, status, statusText }
        
        if (supabaseError) {
          addLog('error', 'Supabase returned an error', supabaseError)
          error.value = `Error fetching eras: ${supabaseError.message}`
          return
        }
        
        // Log the successful response
        addLog('success', `Received ${data.length} eras from Supabase`, data)
        
        // Process the data
        eras.value = data
        
        // Find the Debut Era
        const debutEraData = data.find(era => era.eraName === 'Debut Era')
        if (debutEraData) {
          debutEra.value = debutEraData
        }
        
        // Find the TTPD Era
        const ttpdEraData = data.find(era => era.eraName === 'TTPD Era')
        if (ttpdEraData) {
          ttpdEra.value = ttpdEraData
        }
        
        // Check for coverImageUrl field
        const missingImageUrls = data.filter(era => !era.coverImageUrl).length
        if (missingImageUrls > 0) {
          addLog('warning', `${missingImageUrls} out of ${data.length} eras are missing coverImageUrl field`)
        }
        
        // Initialize image statuses
        data.forEach(era => {
          imageStatuses[era.eraId] = 'pending'
        })
        
      } catch (err) {
        addLog('error', 'Exception occurred during Supabase request', err)
        error.value = `Exception: ${err.message}`
      } finally {
        loading.value = false
      }
    }
    
    const handleImageError = (event, era) => {
      imageStatuses[era.eraId] = 'failed'
      addLog('warning', `Image for era ${era.eraName} failed to load`, {
        eraId: era.eraId,
        coverImageUrl: era.coverImageUrl,
        image_url: era.image_url,
        attemptedUrl: event.target.src
      })
      
      // Fallback to a default image
      event.target.src = '/img/covers/default.jpg'
    }
    
    const getImageStatusText = (eraId) => {
      const status = imageStatuses[eraId]
      if (status === 'pending') return 'Pending'
      if (status === 'loaded') return 'Loaded Successfully'
      if (status === 'failed') return 'Failed to Load'
      return 'Unknown'
    }
    
    // Handle successful image loads
    const handleImageLoad = (eraId) => {
      imageStatuses[eraId] = 'loaded'
      const era = eras.value.find(e => e.eraId === eraId)
      if (era) {
        addLog('info', `Image for era ${era.eraName} loaded successfully`, {
          eraId: era.eraId,
          coverImageUrl: era.coverImageUrl
        })
      }
    }
    
    const checkStoreTransformation = async () => {
      if (!debutEra.value) {
        addLog('error', 'Debut Era not found in database')
        return
      }
      
      try {
        const { data, error: supabaseError } = await supabase
          .from('Eras')
          .select('id, title, coverImageUrl')
          .eq('id', debutEra.value.eraId)
        
        if (supabaseError) {
          addLog('error', 'Supabase returned an error', supabaseError)
          return
        }
        
        storeDebutEra.value = data[0]
        addLog('info', 'Debut Era data from store', storeDebutEra.value)
        
      } catch (err) {
        addLog('error', 'Exception occurred during Supabase request', err)
      }
    }
    
    onMounted(() => {
      addLog('info', 'Component mounted, ready to diagnose Supabase image loading')
    })
    
    return {
      eras,
      loading,
      error,
      logs,
      rawResponse,
      imageStatuses,
      debutEra,
      storeDebutEra,
      ttpdEra,
      loadErasData,
      clearLogs,
      handleImageError,
      getImageStatusText,
      checkStoreTransformation
    }
  }
}
</script>

<style scoped>
.image-loading-diagnostic {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.diagnostic-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.diagnostic-button.clear {
  background-color: #f44336;
}

.diagnostic-button.small {
  padding: 5px 10px;
  font-size: 0.8em;
}

.diagnostic-section {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}

h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.log-entry {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
}

.log-entry.info {
  background-color: #e3f2fd;
}

.log-entry.request {
  background-color: #e8f5e9;
}

.log-entry.success {
  background-color: #e8f5e9;
}

.log-entry.warning {
  background-color: #fff8e1;
}

.log-entry.error {
  background-color: #ffebee;
}

.log-timestamp {
  font-size: 0.8em;
  color: #666;
}

.log-type {
  font-weight: bold;
  margin: 5px 0;
}

.log-data {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.era-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.era-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}

.era-details {
  margin-bottom: 15px;
}

.era-field {
  margin-bottom: 5px;
}

.field-label {
  font-weight: bold;
}

.field-value.missing {
  color: #f44336;
}

.era-image-test {
  text-align: center;
}

.test-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.image-status {
  font-weight: bold;
}

.image-status.pending {
  color: #ff9800;
}

.image-status.loaded {
  color: #4CAF50;
}

.image-status.failed {
  color: #f44336;
}

.raw-response {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 400px;
  white-space: pre-wrap;
  word-break: break-word;
}

.loading, .error, .no-data, .no-logs {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.error {
  color: #f44336;
}

.specific-era-check {
  padding: 20px;
}

.store-era-info {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
}
</style>
