<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Swifties.io Home</h1>
    <p class="mb-6">Spec: Landing page with sunburst visualization and login option</p>
    
    <!-- Sunburst Chart Area (Placeholder) -->
    <div class="border p-4 my-4 min-h-[300px] flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <div class="w-32 h-32 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-4">
          <span class="text-white font-bold text-lg">Sunburst</span>
        </div>
        <p class="text-gray-600">Sunburst Chart Placeholder</p>
        <p class="text-sm text-gray-500 mt-2">The actual visualization will be implemented in the next phase</p>
      </div>
    </div>
    
    <!-- Login Simulation Button -->
    <button 
      @click="userStore.setIsLoggedInSimulation(true)" 
      class="mt-10 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    >
      Simulate Login
    </button>
  </div>
</template>

<script>
import { useMusicStore } from '@/store'
import { useUserStore } from '@/store/userStore'

export default {
  name: 'HomeView',
  setup() {
    const musicStore = useMusicStore()
    const userStore = useUserStore()
    
    return { 
      musicStore, 
      userStore
    }
  }
}
</script>

<style scoped>
/* Any component-specific styles can go here */
</style>
