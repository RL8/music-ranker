<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Album Ranking <span class="text-gray-500 text-xl">(i)</span></h1>
    <p class="mb-6">Spec: Tiered layout for ranking albums by preference</p>
    
    <!-- Tier Layout Placeholders -->
    <div class="mb-8 space-y-6">
      <!-- Tier 1 -->
      <div class="border-2 border-green-500 rounded-lg p-4 bg-green-50">
        <h2 class="text-xl font-semibold mb-3 text-green-700">Tier 1</h2>
        <div class="flex justify-center">
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #1]</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 2 -->
      <div class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <h2 class="text-xl font-semibold mb-3 text-blue-700">Tier 2</h2>
        <div class="flex justify-center space-x-4">
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #2]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #3]</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 3 -->
      <div class="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
        <h2 class="text-xl font-semibold mb-3 text-yellow-700">Tier 3</h2>
        <div class="flex justify-center space-x-4">
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #4]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #5]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #6]</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 4 -->
      <div class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <h2 class="text-xl font-semibold mb-3 text-red-700">Tier 4</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #7]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #8]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #9]</span>
          </div>
          <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <span class="text-gray-500 font-medium">[Rank #10]</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Album Shelf Area -->
    <div class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">Album Shelf</h2>
        <span class="text-gray-500">[Collapsible Shelf ▼]</span>
      </div>
      
      <div class="flex overflow-x-auto py-2 space-x-4">
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 1</span>
        </div>
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 2</span>
        </div>
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 3</span>
        </div>
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 4</span>
        </div>
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 5</span>
        </div>
        <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-xs text-gray-500">Album 6</span>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8">
      <button class="w-full p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
        Start Ranking Session
      </button>
      <button class="w-full p-3 bg-gray-300 text-gray-500 rounded-lg font-bold opacity-50 cursor-not-allowed">
        Save Rankings
      </button>
    </div>
  </div>
</template>

<script setup>
// Component logic will be added in future implementation
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
