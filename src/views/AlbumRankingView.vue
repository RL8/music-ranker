<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Your Favorite Albums 
      <button 
        @click="showToast('Album Ranking Help', 'This screen allows you to rank Taylor Swift albums by dragging them from the shelf into different tiers.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    <p class="mb-6 text-gray-600">Drag albums from the shelf to rank them in order of preference</p>
    
    <!-- Sign-up Prompt for Non-Logged-In Users -->
    <div v-if="!userStore.isLoggedInSimulation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div class="flex items-start">
        <div class="text-yellow-500 mr-3 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 class="font-medium text-yellow-800">Create a free account to save your rankings</h3>
          <p class="text-sm text-yellow-700 mt-1">You can create rankings without an account, but to save and share your rankings, you'll need to sign up.</p>
          <div class="mt-3 flex space-x-3">
            <button 
              @click="login"
              class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              Sign Up Free
            </button>
            <button 
              @click="login"
              class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tier Layout Placeholders -->
    <div class="mb-8 space-y-6">
      <!-- Tier 1 -->
      <div class="border-2 border-green-500 rounded-lg p-4 bg-green-50">
        <h2 class="text-xl font-semibold mb-3 text-green-700">Tier 1</h2>
        <div class="flex justify-center">
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-green-300 hover:bg-gray-100 transition-colors cursor-pointer relative"
          >
            <span class="text-gray-500 font-medium">Rank #1</span>
            <div class="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded shadow-md">
              Top Album
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tier 2 -->
      <div class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <h2 class="text-xl font-semibold mb-3 text-blue-700">Tier 2</h2>
        <div class="flex justify-center space-x-4">
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #2</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #3</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 3 -->
      <div class="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
        <h2 class="text-xl font-semibold mb-3 text-yellow-700">Tier 3</h2>
        <div class="flex justify-center space-x-4">
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #4</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #5</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #6</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 4 -->
      <div class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <h2 class="text-xl font-semibold mb-3 text-red-700">Tier 4</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #7</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #8</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #9</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 5 -->
      <div class="border-2 border-purple-500 rounded-lg p-4 bg-purple-50">
        <h2 class="text-xl font-semibold mb-3 text-purple-700">Tier 5</h2>
        <div class="flex justify-center space-x-4">
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-purple-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #10</span>
          </div>
          <div 
            class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm border-2 border-dashed border-purple-300 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span class="text-gray-500 font-medium">Rank #11</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Album Shelf Area -->
    <div class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-6 transition-all duration-300" :class="{ 'h-20 overflow-hidden': isShelfCollapsed }">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">Album Shelf</h2>
        <button 
          @click="toggleShelf" 
          class="text-gray-500 hover:text-green-600 transition-colors">
          {{ isShelfCollapsed ? 'Expand ▼' : 'Collapse ▲' }}
        </button>
      </div>
      
      <div class="flex flex-wrap gap-4 py-2">
        <!-- Taylor Swift Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Taylor Swift</span>
        </div>
        
        <!-- Fearless Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Fearless (TV)</span>
        </div>
        
        <!-- Speak Now Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Speak Now (TV)</span>
        </div>
        
        <!-- Red Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Red (TV)</span>
        </div>
        
        <!-- 1989 Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">1989 (TV)</span>
        </div>
        
        <!-- Reputation Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-100 font-medium text-center">Reputation</span>
        </div>
        
        <!-- Lover Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Lover</span>
        </div>
        
        <!-- Folklore Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Folklore</span>
        </div>
        
        <!-- Evermore Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Evermore</span>
        </div>
        
        <!-- Midnights Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center">Midnights</span>
        </div>
        
        <!-- The Tortured Poets Department Album -->
        <div 
          class="album-item flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:scale-105"
        >
          <span class="text-xs text-gray-700 font-medium text-center p-1">TTPD</span>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8">
      <button 
        @click="startRanking"
        class="w-full p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors active:scale-98 transform duration-150">
        Start Ranking Session
      </button>
      
      <div class="relative">
        <button 
          class="w-full p-3 bg-gray-300 text-gray-500 rounded-lg font-bold opacity-50 cursor-not-allowed">
          Save Rankings
        </button>
        <div v-if="!userStore.isLoggedInSimulation" class="absolute inset-0 flex items-center justify-center">
          <div class="bg-white px-3 py-1 rounded-full shadow-md text-sm text-green-600">
            Sign up to save your rankings
          </div>
        </div>
      </div>
      
      <router-link 
        to="/rank/songs"
        class="w-full p-3 bg-white border border-green-600 text-green-600 rounded-lg font-bold hover:bg-green-50 transition-colors text-center">
        Continue to Song Ranking
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import toastService from '@/services/toastService';

const router = useRouter();
const userStore = useUserStore();

// Shelf collapse state
const isShelfCollapsed = ref(false);

// Toggle shelf collapse
const toggleShelf = () => {
  isShelfCollapsed.value = !isShelfCollapsed.value;
  showToast(
    isShelfCollapsed.value ? 'Shelf Collapsed' : 'Shelf Expanded', 
    isShelfCollapsed.value ? 'The album shelf is now collapsed to give more space to the tiers.' : 'The album shelf is now expanded to show all available albums.'
  );
};

// Start ranking session
const startRanking = () => {
  showToast('Ranking Started', 'You can now drag albums from the shelf to the tier slots to rank them.');
  
  // If not logged in, show a delayed toast encouraging sign up
  if (!userStore.isLoggedInSimulation) {
    setTimeout(() => {
      showToast('Create an Account', 'Sign up for free to save your rankings and access them later!');
    }, 5000);
  }
};

// Login function
const login = () => {
  userStore.setIsLoggedInSimulation(true);
  showToast('Logged In', 'You are now logged in and can save your rankings.');
};

// Show toast notification
const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    duration: 3000
  });
};
</script>

<style scoped>
/* Album hover effect */
.album-item:hover {
  transform: translateY(-2px);
}

/* Button active state */
.active\:scale-98:active {
  transform: scale(0.98);
}

.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}
</style>
