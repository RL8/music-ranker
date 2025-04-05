import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios'
import { createPinia, PiniaVuePlugin } from 'pinia'

// Import Bootstrap and BootstrapVue CSS files
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Install Pinia
Vue.use(PiniaVuePlugin)
const pinia = createPinia()

// Configure Axios
Vue.prototype.$axios = axios

// Configure Vue DevTools connection
// This will connect to the standalone Vue DevTools application
if (process.env.NODE_ENV !== 'production') {
  // Force enable devtools for Vue 2
  Vue.config.devtools = true
  
  // Make Vue available globally for DevTools to detect
  window.Vue = Vue
  
  // Log Vue version to help with debugging
  console.log('Vue version:', Vue.version)
  console.log('Vue DevTools enabled:', Vue.config.devtools)
}

Vue.config.productionTip = false

new Vue({
  router,
  pinia,
  render: h => h(App)
}).$mount('#app')

// Expose the Vue instance to window for DevTools
// Check if the hook exists before trying to use it
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue)
}
