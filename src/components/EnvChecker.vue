<template>
  <div class="env-checker">
    <h1>Environment Variables Checker</h1>
    
    <div class="card">
      <h2>Raw Environment Variables</h2>
      <p>Here are all the environment variables available to the application:</p>
      
      <pre class="env-dump">{{ envDump }}</pre>
      
      <div class="actions">
        <button @click="checkEnv" class="refresh-btn">
          Refresh Environment Variables
        </button>
      </div>
    </div>
    
    <div class="card">
      <h2>Supabase Direct Test</h2>
      <p>Testing direct connection to Supabase using environment variables:</p>
      
      <div v-if="directTestLoading" class="loading">
        Testing direct connection...
      </div>
      <div v-else-if="directTestSuccess" class="success">
        ✅ Direct connection successful! This confirms the Supabase URL and key are valid.
      </div>
      <div v-else class="error">
        ❌ Direct connection failed!
        <div v-if="directTestError" class="error-details">
          {{ directTestError }}
        </div>
      </div>
      
      <div class="actions">
        <button @click="testDirectConnection" class="test-btn">
          Test Direct Connection
        </button>
      </div>
    </div>
    
    <div class="card">
      <h2>Environment Variable Loading Tests</h2>
      
      <div class="test-result">
        <strong>Test 1: process.env direct access - </strong>
        {{ test1Result }}
      </div>
      
      <div class="test-result">
        <strong>Test 2: env.js utility - </strong>
        {{ test2Result }}
      </div>
      
      <div class="test-result">
        <strong>Test 3: supabase client - </strong>
        <span>{{ test3Result }}</span>
        <div v-if="test3Details" class="raw-data">
          <strong>Raw Response:</strong>
          <pre>{{ JSON.stringify(test3Details, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="test-result">
        <strong>Test 4: fetch data sample - </strong>
        <span>{{ test4Result }}</span>
        <div v-if="test4Details" class="raw-data">
          <strong>Table Detection Results:</strong>
          <pre>{{ JSON.stringify(test4Details, null, 2) }}</pre>
          
          <div class="raw-data explanation">
            <strong>Query Logic Explanation:</strong>
            <p>For each table, we run: <code>await supabase.from(tableName).select('*').limit(5)</code></p>
            <ul>
              <li><strong>exists: true</strong> = The query completed without a PostgreSQL error</li>
              <li><strong>hasData: false</strong> = The query returned an empty array ([])</li>
              <li><strong>hasData: true</strong> = The query returned an array with at least one item</li>
            </ul>
            <p>When a table doesn't exist in PostgreSQL, it returns an error with code <code>42P01</code> ("relation does not exist").</p>
            <p>When a table exists but has no rows, PostgreSQL returns an empty array, not an error.</p>
          </div>
        </div>
      </div>
      
      <div v-if="sampleData.length > 0" class="sample-data">
        <h4>Sample Data From Database:</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="(value, key) in sampleData[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in sampleData" :key="index">
              <td v-for="(value, key) in item" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="actions">
        <button @click="runTests" class="test-btn">
          Run Tests
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../utils/env'
import { supabase } from '../lib/supabase/client'

// TypeScript interfaces for database tables
/**
 * @typedef {Object} UniqueSong
 * @property {string} songId - The song's unique identifier
 * @property {string} canonicalTitle - The canonical/standard title of the song
 * @property {string} [originalEraId] - Foreign key reference to the era when the song was originally released
 * @property {string} [notes] - Additional notes about the song
 */

/**
 * @typedef {Object} Album
 * @property {string} albumId - The album's unique identifier
 * @property {string} albumTitle - The title of the album
 * @property {string} [releaseDate] - The release date of the album
 * @property {string} [albumType] - Type of album (e.g., studio, live, compilation)
 * @property {string} [eraId] - Foreign key reference to Eras table
 */

/**
 * @typedef {Object} Era
 * @property {string} eraId - The era's unique identifier
 * @property {string} eraName - The name of the era
 * @property {string} [primaryAlbumId] - Foreign key reference to the primary album of this era
 * @property {string} [eraStartDate] - The start date of the era
 */

/**
 * @typedef {Object} Edition
 * @property {string} editionId - The edition's unique identifier
 * @property {string} editionName - Display name of the edition
 * @property {string} [description] - Description of the edition
 * @property {string} [created_at] - Timestamp when the record was created
 */

export default {
  name: 'EnvChecker',
  
  setup() {
    const envDump = ref('Loading...')
    const test1Result = ref('Not run')
    const test2Result = ref('Not run')
    const test3Result = ref('Not run')
    const test4Result = ref('Not run')
    const directTestLoading = ref(false)
    const directTestSuccess = ref(false)
    const directTestError = ref(null)
    const sampleData = ref([])
    const test3Details = ref(null)
    const test4Details = ref(null)
    
    // Table configuration with specific columns to query
    const tableConfig = {
      UniqueSongs: '*', // Use * to avoid column name issues
      Albums: '*',
      Eras: '*',
      Editions: '*'
    }
    
    // Dump all environment variables
    const checkEnv = () => {
      envDump.value = 'ENV VARIABLES:\n\n'
      
      // Get all environment variables with VUE_APP prefix
      Object.keys(process.env).forEach(key => {
        if (key.startsWith('VUE_APP_')) {
          const value = key.includes('KEY') ? '[HIDDEN FOR SECURITY]' : process.env[key]
          envDump.value += `${key}: ${value}\n`
        }
      })
      
      // Add other useful information
      envDump.value += `\nNODE_ENV: ${process.env.NODE_ENV}\n`
      envDump.value += `BASE_URL: ${process.env.BASE_URL}\n`
    }
    
    // Run all tests
    const runTests = async () => {
      // Test 1: Direct access to process.env
      if (process.env.VUE_APP_SUPABASE_URL && process.env.VUE_APP_SUPABASE_ANON_KEY) {
        test1Result.value = '✅ Success! Variables are accessible directly'
      } else {
        test1Result.value = '❌ Failed! Variables are not accessible directly'
      }
      
      // Test 2: Access through env.js utility
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        test2Result.value = '✅ Success! Variables are accessible through env.js'
      } else {
        test2Result.value = '❌ Failed! Variables are not accessible through env.js'
      }
      
      // Test 3: Check if supabase client has credentials
      test3Result.value = 'Running test...'
      setTimeout(() => {
        testSupabaseClient()
      }, 100)
      
      // Test 4: Fetch sample data
      test4Result.value = 'Running test...'
      fetchSampleData()
    }
    
    // Test Supabase client separately to avoid await in setup
    const testSupabaseClient = async () => {
      const tableName = 'UniqueSongs'
      const columns = tableConfig[tableName]
      
      const fullDetails = {
        request: {
          target: tableName,
          method: 'select',
          query: columns,
          limit: 1
        },
        response: null,
        error: null,
        criteria: [
          'Connection is successful if the query returns without throwing an exception',
          'Table exists if the query returns without a PostgreSQL error',
          'Data exists if the returned data array contains at least one item',
          'Empty array = table exists but has no rows'
        ]
      }
      
      try {
        // Try a simple query to test the client with specific columns
        console.log(`Testing Supabase client with a query on ${tableName}...`)
        
        // First check if RLS might be blocking our access
        const { data: rlsData, error: rlsError } = await supabase
          .from(tableName)
          .select(columns, { count: 'exact', head: false })
          .limit(1)
        
        // Log raw response for debugging
        console.log('Raw response:', { data: rlsData, error: rlsError })
        fullDetails.rawResponse = { data: rlsData, error: rlsError }
        
        // Now do our actual query
        const { data, error, count } = await supabase
          .from(tableName)
          .select(columns, { count: 'exact' })
          .limit(1)
        
        // Log and store the raw response for transparency
        fullDetails.response = { data, count }
        
        if (error) {
          // Handle specific PostgreSQL error codes
          if (error.code === '42P01') {
            // Table doesn't exist
            fullDetails.error = error
            test3Result.value = `❌ Table Error: Table "${tableName}" does not exist (Code: ${error.code})`
          } else {
            // Other errors
            fullDetails.error = error
            test3Result.value = `❌ Connection Error: ${error.message} (Code: ${error.code || 'unknown'})`
          }
        } else if (!data) {
          // No error but data is null
          test3Result.value = `⚠️ Connection works but data is null. Table "${tableName}" may not exist.`
          fullDetails.assessment = 'Connection successful but data is null'
        } else if (Array.isArray(data) && data.length === 0) {
          // Table exists but no records found
          test3Result.value = `⚠️ Connection works. Table "${tableName}" exists but appears empty. Total rows: ${count || 0}. This may be due to RLS policies.`
          fullDetails.assessment = `Connection successful, table exists but appears empty. Total rows: ${count || 0}. Check RLS policies.`
        } else if (Array.isArray(data) && data.length > 0) {
          // Success! Table exists and has data
          test3Result.value = `✅ Full Success! Found ${count || data.length} total records in "${tableName}" table.`
          fullDetails.assessment = `Connection successful, table exists and has ${count || data.length} records`
        } else {
          // Unexpected data format
          test3Result.value = `⚠️ Connection works but unexpected response format: ${typeof data}`
          fullDetails.assessment = `Connection successful but unexpected data format: ${typeof data}`
        }
      } catch (err) {
        console.error('Client test error:', err)
        test3Result.value = `❌ Error: ${err.message}`
        fullDetails.error = { 
          type: 'exception',
          message: err.message,
          stack: err.stack
        }
        fullDetails.assessment = 'Connection failed with exception'
      }
      
      console.log('Full Supabase client test details:', fullDetails)
      test3Details.value = fullDetails
    }
    
    // Fetch sample data with improved error handling and pagination
    const fetchSampleData = async () => {
      const diagnosticLog = {
        tablesToCheck: Object.keys(tableConfig),
        tablesChecked: [],
        results: [],
        finalAssessment: '',
        criteria: [
          'Table exists if query returns without a PostgreSQL error (no "relation does not exist" error)',
          'Table has data if the returned data array contains at least one item',
          'Empty array = table exists but has no rows or RLS is blocking access'
        ]
      }
      
      try {
        console.log('Starting systematic database table detection...')
        
        // Try each table in turn
        let tableFound = false
        let dataFound = false
        let foundTableName = ''
        let foundData = []
        
        for (const tableName of diagnosticLog.tablesToCheck) {
          console.log(`Checking if table "${tableName}" exists...`)
          
          const columns = tableConfig[tableName]
          
          const tableResult = {
            tableName,
            exists: false,
            hasData: false,
            error: null,
            data: null,
            rowCount: 0,
            totalCount: 0,
            rawResponse: null
          }
          
          try {
            // First try without count to see if we get any results
            const { data: testData, error: testError } = await supabase
              .from(tableName)
              .select(columns)
              .limit(5)
            
            // Store raw response for debugging
            tableResult.rawResponse = { data: testData, error: testError }
            console.log(`Raw response for ${tableName}:`, tableResult.rawResponse)
            
            // Use count option for more efficient counting
            const { data, error, count } = await supabase
              .from(tableName)
              .select(columns, { count: 'exact' })
              .limit(5)
            
            if (error) {
              console.log(`Table "${tableName}" check error:`, error)
              tableResult.error = error
              diagnosticLog.results.push(tableResult)
              continue // Try the next table
            }
            
            // Table exists with no error
            tableFound = true
            foundTableName = tableName
            tableResult.exists = true
            tableResult.totalCount = count || 0
            
            if (Array.isArray(data) && data.length > 0) {
              // Table has data
              dataFound = true
              foundData = data
              tableResult.hasData = true
              tableResult.data = data
              tableResult.rowCount = data.length
              console.log(`Success! Table "${tableName}" exists with ${count || 'unknown'} total records (showing ${data.length}):`, data)
              diagnosticLog.results.push(tableResult)
              break // We found a table with data, stop searching
            } else {
              tableResult.data = data
              console.log(`Table "${tableName}" exists but appears empty or RLS is blocking access`)
              diagnosticLog.results.push(tableResult)
            }
          } catch (err) {
            // Check for specific PostgreSQL error codes
            if (err.code === '42P01') {
              console.log(`Table "${tableName}" does not exist (PostgreSQL error 42P01)`)
            } else {
              console.log(`Error checking table "${tableName}":`, err)
            }
            
            tableResult.error = {
              message: err.message,
              code: err.code,
              details: err.details,
              hint: err.hint,
              stack: err.stack
            }
            diagnosticLog.results.push(tableResult)
          }
          
          diagnosticLog.tablesChecked.push(tableName)
        }
        
        // Process results
        if (!tableFound) {
          test4Result.value = `❌ Could not find any valid tables. Checked: ${diagnosticLog.tablesChecked.join(', ')}`
          sampleData.value = []
          diagnosticLog.finalAssessment = 'No valid tables found'
        } else if (tableFound && !dataFound) {
          test4Result.value = `⚠️ Found table "${foundTableName}" but it appears empty (total rows: ${diagnosticLog.results.find(r => r.tableName === foundTableName)?.totalCount || 0}). This may be due to RLS policies.`
          sampleData.value = []
          diagnosticLog.finalAssessment = `Table "${foundTableName}" exists but appears empty or RLS is blocking access`
        } else if (tableFound && dataFound) {
          const totalCount = diagnosticLog.results.find(r => r.tableName === foundTableName)?.totalCount || foundData.length
          test4Result.value = `✅ Found ${foundData.length} records in table "${foundTableName}" (total: ${totalCount})`
          sampleData.value = foundData
          diagnosticLog.finalAssessment = `Table "${foundTableName}" exists with ${totalCount} total records`
        }
        
        test4Details.value = diagnosticLog
      } catch (err) {
        console.error('Error fetching sample data:', err)
        test4Result.value = `❌ Error: ${err.message}`
        sampleData.value = []
        test4Details.value = {
          error: {
            message: err.message,
            code: err.code,
            details: err.details,
            hint: err.hint,
            stack: err.stack
          },
          finalAssessment: 'Error occurred during table detection'
        }
      }
    }
    
    // Test direct connection with environment variables
    const testDirectConnection = () => {
      directTestLoading.value = true
      directTestSuccess.value = false
      directTestError.value = null
      
      // Run the test asynchronously
      setTimeout(() => {
        runDirectConnectionTest()
      }, 100)
    }
    
    // Run the direct connection test asynchronously
    const runDirectConnectionTest = async () => {
      try {
        // Get credentials from environment variables
        const url = SUPABASE_URL
        const key = SUPABASE_ANON_KEY
        
        if (!url || !key) {
          throw new Error('Missing Supabase credentials in environment variables')
        }
        
        // Create a direct client
        const directClient = createClient(url, key)
        
        // Test connection with a simple query on a known table
        // Avoid querying information_schema or system tables
        const { data, error } = await directClient
          .from('UniqueSongs')
          .select('*')
          .limit(1)
        
        if (error) {
          // Check for specific error types
          if (error.code === '42P01') {
            throw new Error(`Table does not exist: ${error.message}`)
          } else if (error.code && error.code.startsWith('42')) {
            throw new Error(`Schema error: ${error.message}`)
          } else if (error.code && error.code.startsWith('28')) {
            throw new Error(`Authentication error: ${error.message}`)
          } else {
            throw error
          }
        }
        
        directTestSuccess.value = true
        console.log('Direct connection successful:', data)
      } catch (err) {
        console.error('Direct connection test failed:', err)
        directTestError.value = `Error: ${err.message}${err.code ? ` (Code: ${err.code})` : ''}`
      } finally {
        directTestLoading.value = false
      }
    }
    
    onMounted(() => {
      checkEnv()
      runTests()
    })
    
    return {
      envDump,
      checkEnv,
      test1Result,
      test2Result,
      test3Result,
      test4Result,
      sampleData,
      runTests,
      directTestLoading,
      directTestSuccess,
      directTestError,
      testDirectConnection,
      test3Details,
      test4Details
    }
  }
}
</script>

<style scoped>
.env-checker {
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

.env-dump {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  max-height: 300px;
  overflow-y: auto;
}

.test-result {
  padding: 10px;
  margin-bottom: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.actions {
  margin-top: 15px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.refresh-btn {
  background: #6c757d;
  color: white;
}

.test-btn {
  background: #007bff;
  color: white;
}

.loading {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}

.success {
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin: 10px 0;
}

.error {
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin: 10px 0;
}

.error-details {
  margin-top: 5px;
}

.sample-data {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}

.sample-preview {
  font-size: 14px;
  color: #666;
}

.data-table {
  border-collapse: collapse;
  width: 100%;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.data-table th {
  background-color: #f0f0f0;
}

.raw-data {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}

.raw-data.explanation {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}
</style>
