<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Music Dashboard</h1>
    <p class="mb-6">Spec: Main dashboard with sunburst visualization and music overview</p>
    
    <!-- View Toggle Buttons -->
    <div class="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <button class="flex-1 py-2 px-4 bg-green-600 text-white font-medium">
        Visualizations
      </button>
      <button class="flex-1 py-2 px-4 bg-white text-gray-700 font-medium">
        Rankings
      </button>
    </div>
    
    <!-- Sunburst Type Toggle -->
    <div class="flex mb-6 space-x-2">
      <button class="py-1 px-3 bg-green-600 text-white text-sm rounded-full">
        Era
      </button>
      <button class="py-1 px-3 bg-gray-200 text-gray-700 text-sm rounded-full">
        Time Period
      </button>
      <button class="py-1 px-3 bg-gray-200 text-gray-700 text-sm rounded-full">
        Overview
      </button>
    </div>
    
    <!-- Sunburst Chart Area (Placeholder) -->
    <div class="border p-4 my-4 min-h-[300px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
      <div class="text-center">
        <div class="w-32 h-32 mx-auto rounded-full bg-green-600 flex items-center justify-center mb-4">
          <span class="text-white font-bold text-lg">Sunburst</span>
        </div>
        <p class="text-gray-600">Sunburst Chart Placeholder</p>
        <p class="text-sm text-gray-500 mt-2">The actual visualization will be implemented in the next phase</p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-between mt-6">
      <button class="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium">
        Edit Rankings
      </button>
      <button class="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium">
        Share Menu
      </button>
    </div>
    
    <!-- Dashboard Content Placeholder -->
    <div class="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-6 mb-6">
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
