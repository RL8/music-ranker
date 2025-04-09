<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Music Dashboard</h1>
    <p class="mb-6">Spec: Main dashboard with sunburst visualization and music overview</p>
    
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
    
    <!-- Dashboard Content Placeholder -->
    <div class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-2">[Music Collection Overview]</h2>
      <p class="text-gray-600">This area will display statistics and summaries of the user's music collection.</p>
    </div>
    
    <!-- Logout Simulation Button -->
    <button 
      @click="userStore.setIsLoggedInSimulation(false)" 
      class="mt-10 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
    >
      Simulate Logout
    </button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();
</script>

<style scoped>
/* Any component-specific styles can go here */
</style>
