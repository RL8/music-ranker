import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { createPinia } from 'pinia'
import apiClient from './plugins/axios'
import { NODE_ENV, isDevelopment } from './utils/env'

// Import global CSS
import './assets/main.css'

// Create Pinia instance
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Configure Axios
app.config.globalProperties.$axios = apiClient

// Configure Vue DevTools
if (isDevelopment) {
  // Log Vue version to help with debugging
  console.log('Vue version:', app.version)
}

// Global error handler
app.config.errorHandler = function(err, instance, info) {
  console.error('Vue Error Handler:', err)
  console.error('Component:', instance)
  console.error('Error Info:', info)
  
  // You can also report errors to a monitoring service here
}

app.config.productionTip = false

// Use plugins
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')
