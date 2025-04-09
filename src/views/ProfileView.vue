<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Profile</h1>
    <p class="mb-6">Spec: User profile with tabs for different sections</p>
    
    <!-- Not Logged In View -->
    <div v-if="!userStore.isLoggedInSimulation" class="flex flex-col items-center justify-center py-10">
      <div class="w-24 h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
        <span class="text-gray-500 text-3xl">?</span>
      </div>
      <p class="text-lg font-medium mb-6 text-center">Please log in to view your profile</p>
      <button 
        @click="userStore.setIsLoggedInSimulation(true)" 
        class="w-full max-w-xs p-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-md mb-3"
      >
        Log In
      </button>
      <button class="text-green-600 font-medium">
        Don't have an account? Sign up
      </button>
    </div>
    
    <!-- Logged In View -->
    <div v-else>
      <!-- Profile Tabs -->
      <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
          @click="activeTab = 'info'" 
          class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
          :class="activeTab === 'info' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Profile Information
        </button>
        <button 
          @click="activeTab = 'link'" 
          class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
          :class="activeTab === 'link' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Link Preview
        </button>
        <button 
          @click="activeTab = 'game'" 
          class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
          :class="activeTab === 'game' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Game
        </button>
        <button 
          @click="activeTab = 'history'" 
          class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
          :class="activeTab === 'history' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          History
        </button>
        <button 
          @click="activeTab = 'premium'" 
          class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
          :class="activeTab === 'premium' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          Premium
        </button>
      </div>
      
      <!-- Profile Content - Info Tab -->
      <div v-if="activeTab === 'info'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
            <span class="text-gray-500 text-xl">U</span>
          </div>
          <div>
            <h2 class="text-xl font-semibold">[User Name]</h2>
            <p class="text-gray-600">[User Email]</p>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4 mt-4 space-y-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input type="text" placeholder="Username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" placeholder="email@example.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Display Name</label>
            <input type="text" placeholder="Display Name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          
          <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Save Changes
          </button>
        </div>
      </div>
      
      <!-- Profile Content - Link Preview Tab -->
      <div v-if="activeTab === 'link'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Link Preview</h2>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h3 class="font-medium mb-2">Your Shareable Profile Link</h3>
          <div class="flex">
            <input type="text" value="swifties.io/profile/username" disabled class="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
            <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline">
              Copy
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="font-medium mb-2">Preview</h3>
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p class="font-medium">[Username]</p>
                <p class="text-sm text-gray-500">Swiftie since 2022</p>
              </div>
            </div>
            <p class="text-sm mb-2">Top Albums: Folklore, Midnights, Evermore</p>
            <p class="text-sm">Top Songs: Anti-Hero, Cardigan, Blank Space</p>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - Game Tab -->
      <div v-if="activeTab === 'game'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Swifties Game</h2>
        
        <div class="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p class="text-lg mb-4">Test your knowledge of Taylor Swift songs!</p>
          <div class="w-32 h-32 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span class="text-gray-500">Game Icon</span>
          </div>
          <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Start Game
          </button>
        </div>
        
        <div class="mt-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="font-medium mb-2">Your Stats</h3>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">12</p>
              <p class="text-xs text-gray-500">Games Played</p>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">8</p>
              <p class="text-xs text-gray-500">High Score</p>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">6</p>
              <p class="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - History Tab -->
      <div v-if="activeTab === 'history'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Activity History</h2>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Ranked "Midnights" album</p>
                <p class="text-sm text-gray-500">2 days ago</p>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded">View</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Added "Anti-Hero" to Tier 1</p>
                <p class="text-sm text-gray-500">3 days ago</p>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded">View</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Updated profile settings</p>
                <p class="text-sm text-gray-500">1 week ago</p>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded">View</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - Premium Tab -->
      <div v-if="activeTab === 'premium'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Premium Features</h2>
        
        <div class="bg-white rounded-lg p-6 border border-gray-200 text-center mb-4">
          <h3 class="text-lg font-bold mb-2">Upgrade to Premium</h3>
          <p class="mb-4">Unlock exclusive features and enhance your experience!</p>
          <ul class="text-left mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> Advanced visualization options
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> Unlimited ranking sessions
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> Ad-free experience
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> Early access to new features
            </li>
          </ul>
          <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Subscribe Now
          </button>
        </div>
        
        <div class="bg-gray-100 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600">Current Status: <span class="font-medium">Free Plan</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';

// Active tab state
const activeTab = ref('info');
const userStore = useUserStore();
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
