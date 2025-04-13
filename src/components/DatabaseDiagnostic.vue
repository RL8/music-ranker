<template>
  <div class="diagnostic">
    <h1>Database Connection Diagnostic</h1>
    
    <div class="card">
      <h2>Environment Variables</h2>
      <p>These are the current environment variables for the Supabase connection:</p>
      
      <div class="env-vars">
        <div class="env-var">
          <strong>SUPABASE_URL:</strong> 
          <span :class="{ 'missing': !supabaseUrl }">{{ supabaseUrl || 'Not set' }}</span>
        </div>
        
        <div class="env-var">
          <strong>SUPABASE_ANON_KEY:</strong> 
          <span :class="{ 'missing': !supabaseKey }">{{ supabaseKey ? '[Present]' : 'Not set' }}</span>
        </div>
        
        <div class="env-var">
          <strong>Environment File (.env.local):</strong>
          <span>{{ envFileExists ? 'Detected' : 'Not detected' }}</span>
        </div>
        
        <div class="env-var">
          <strong>NODE_ENV:</strong>
          <span>{{ nodeEnv }}</span>
        </div>
      </div>
      
      <div class="connection-status">
        <h3>Connection Status:</h3>
        <div v-if="loading" class="loading">Testing connection...</div>
        <div v-else-if="connectionSuccess" class="success">
          ✅ Connection successful!
          <div>
            <strong>Database tables found:</strong> {{ tables.join(', ') }}
          </div>
        </div>
        <div v-else class="error">
          ❌ Connection failed!
          <div class="error-details" v-if="connectionError">
            <strong>Error:</strong> {{ connectionError }}
          </div>
          <div class="error-stack" v-if="errorStack">
            <pre>{{ errorStack }}</pre>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card setup-instructions" v-if="!connectionSuccess">
      <h2>Setup Instructions</h2>
      <p>To connect to Supabase, you need to set up the following environment variables:</p>
      
      <ol>
        <li>Create a <code>.env.local</code> file in the root directory of your project.</li>
        <li>Add the following variables to the file:
          <pre>
VUE_APP_SUPABASE_URL=your_supabase_url
VUE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key</pre>
        </li>
        <li>Restart the development server</li>
      </ol>
      
      <p>You can find these values in your Supabase project settings under API settings.</p>
    </div>
    
    <div class="card" v-if="connectionSuccess">
      <h2>Database Content</h2>
      <div v-if="loadingCounts" class="loading">Loading counts...</div>
      <div v-else class="table-counts">
        <div v-for="(count, table) in tableCounts" :key="table" class="table-count">
          <strong>{{ table }}:</strong> {{ count }} records
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase/client'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../utils/env'

export default {
  name: 'DatabaseDiagnostic',
  
  setup() {
    const supabaseUrl = ref(SUPABASE_URL)
    const supabaseKey = ref(SUPABASE_ANON_KEY)
    const loading = ref(false)
    const connectionSuccess = ref(false)
    const connectionError = ref(null)
    const errorStack = ref(null)
    const tables = ref([])
    const loadingCounts = ref(false)
    const tableCounts = ref({})
    const envFileExists = ref(process.env.VUE_APP_SUPABASE_URL !== undefined)
    const nodeEnv = ref(process.env.NODE_ENV)
    
    const testConnection = async () => {
      loading.value = true
      connectionSuccess.value = false
      connectionError.value = null
      errorStack.value = null
      
      try {
        if (!supabaseUrl.value || !supabaseKey.value) {
          throw new Error('Supabase URL or Anon Key is missing')
        }
        
        // Instead of querying information_schema, directly check known application tables
        // This avoids permission issues with system tables
        const knownTables = ['UniqueSongs', 'Albums', 'Eras', 'Editions', 'Recordings']
        const validTables = []
        
        // Test each table individually
        for (const tableName of knownTables) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true })
              .limit(1)
            
            if (!error) {
              validTables.push(tableName)
            }
          } catch (err) {
            console.log(`Table check error for ${tableName}:`, err)
            // Continue checking other tables even if one fails
          }
        }
        
        // Extract table names
        if (validTables.length > 0) {
          tables.value = validTables
          connectionSuccess.value = true
          
          // If connection successful, get record counts
          await getTableCounts()
        } else {
          tables.value = []
          connectionSuccess.value = false
          throw new Error('No valid tables found in the database')
        }
      } catch (err) {
        console.error('Database connection test failed:', err)
        connectionError.value = err.message || 'Unknown error'
        errorStack.value = err.stack
      } finally {
        loading.value = false
      }
    }
    
    const getTableCounts = async () => {
      if (!tables.value.length) return
      
      loadingCounts.value = true
      
      try {
        // Get counts for each table
        for (const table of tables.value) {
          try {
            const { count, error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true })
            
            if (error) throw error
            
            tableCounts.value[table] = count
          } catch (err) {
            console.error(`Error getting count for table ${table}:`, err)
            tableCounts.value[table] = 'Error'
          }
        }
      } catch (err) {
        console.error('Error getting table counts:', err)
      } finally {
        loadingCounts.value = false
      }
    }
    
    onMounted(() => {
      testConnection()
    })
    
    return {
      supabaseUrl,
      supabaseKey,
      loading,
      connectionSuccess,
      connectionError,
      errorStack,
      tables,
      loadingCounts,
      tableCounts,
      envFileExists,
      nodeEnv
    }
  }
}
</script>

<style scoped>
.diagnostic {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 1.5rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.env-vars {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}

.env-var {
  margin-bottom: 5px;
}

.missing {
  color: #dc3545;
  font-weight: bold;
}

.connection-status {
  margin-top: 20px;
}

.loading {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.success {
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
}

.error {
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
}

.error-details {
  margin-top: 5px;
}

.error-stack {
  margin-top: 5px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.setup-instructions {
  background: #fff3cd;
  color: #856404;
}

.setup-instructions code {
  background: rgba(0,0,0,0.1);
  padding: 2px 4px;
  border-radius: 3px;
}

.setup-instructions pre {
  background: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.table-counts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.table-count {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
</style>
