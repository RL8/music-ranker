<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Your Favorite Albums <span class="text-gray-500 text-xl">(i)</span></h1>
    <p class="mb-6">Spec: Landing page with sunburst visualization and login option</p>
    
    <!-- Sunburst Chart Area (Placeholder) -->
    <div class="border p-4 my-4 min-h-[300px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
      <div class="text-center">
        <div class="w-32 h-32 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-4">
          <span class="text-white font-bold text-lg">Sunburst</span>
        </div>
        <p class="text-gray-600">Sunburst Chart Placeholder</p>
        <p class="text-sm text-gray-500 mt-2">[Swipeable Visualization - 1 of 3]</p>
        <div class="flex justify-center mt-4 space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-600"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
    
    <!-- CTA Buttons -->
    <div class="mt-8 flex flex-col items-center">
      <button 
        @click="userStore.setIsLoggedInSimulation(true)" 
        class="w-full max-w-xs p-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-md"
      >
        Create Your Own Visuals
      </button>
      
      <button class="mt-4 text-green-600 font-medium">
        Already have an account? Log in
      </button>
    </div>
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
