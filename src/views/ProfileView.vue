<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>
    <p class="mb-6">Spec: User profile with tabs for different sections</p>
    
    <!-- Profile Tabs -->
    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        @click="activeTab = 'info'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'info' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Info
      </button>
      <button 
        @click="activeTab = 'stats'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'stats' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Stats
      </button>
      <button 
        @click="activeTab = 'activity'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'activity' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Activity
      </button>
    </div>
    
    <!-- Profile Content - Info Tab -->
    <div v-if="activeTab === 'info'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <div class="flex items-center mb-4">
        <div class="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h2 class="text-xl font-semibold">[User Name]</h2>
          <p class="text-gray-600">[User Email]</p>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4 mt-4">
        <h3 class="text-lg font-medium mb-2">Profile Information</h3>
        <p class="text-gray-600 mb-2">This section will display user profile information.</p>
        <p class="text-gray-600">Join date, preferences, and other user details will be shown here.</p>
      </div>
    </div>
    
    <!-- Profile Content - Stats Tab -->
    <div v-if="activeTab === 'stats'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">User Statistics</h2>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="border border-gray-200 rounded p-3 bg-white">
          <h3 class="text-sm text-gray-500">Albums Ranked</h3>
          <p class="text-2xl font-bold">24</p>
        </div>
        <div class="border border-gray-200 rounded p-3 bg-white">
          <h3 class="text-sm text-gray-500">Songs Ranked</h3>
          <p class="text-2xl font-bold">142</p>
        </div>
        <div class="border border-gray-200 rounded p-3 bg-white">
          <h3 class="text-sm text-gray-500">Favorite Artist</h3>
          <p class="text-xl font-bold">Taylor Swift</p>
        </div>
        <div class="border border-gray-200 rounded p-3 bg-white">
          <h3 class="text-sm text-gray-500">Top Genre</h3>
          <p class="text-xl font-bold">Pop</p>
        </div>
      </div>
      
      <p class="text-gray-600">More detailed statistics will be available in the full implementation.</p>
    </div>
    
    <!-- Profile Content - Activity Tab -->
    <div v-if="activeTab === 'activity'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
      
      <div class="space-y-4">
        <div class="border-b border-gray-200 pb-3">
          <p class="font-medium">Ranked "Midnights" album</p>
          <p class="text-sm text-gray-500">2 days ago</p>
        </div>
        <div class="border-b border-gray-200 pb-3">
          <p class="font-medium">Added "Anti-Hero" to Tier 1</p>
          <p class="text-sm text-gray-500">3 days ago</p>
        </div>
        <div class="border-b border-gray-200 pb-3">
          <p class="font-medium">Updated profile settings</p>
          <p class="text-sm text-gray-500">1 week ago</p>
        </div>
      </div>
      
      <p class="text-gray-600 mt-4">A complete activity log will be available in the full implementation.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Active tab state
const activeTab = ref('info');
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
