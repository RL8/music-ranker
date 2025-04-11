<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Albums with Coverflow 
      <button 
        @click="showToast('Coverflow Ranking Help', 'This screen allows you to rank Taylor Swift albums using a coverflow interface. Swipe through albums and rate them.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    <p class="mb-6 text-gray-600">Swipe through albums and rank them based on your preference</p>
    
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
    
    <!-- Coverflow Album Display Placeholder -->
    <div class="border-2 border-gray-300 rounded-lg p-6 bg-gray-50 mb-8">
      <div class="text-center">
        <h2 class="text-xl font-semibold mb-4">Coverflow Ranking Coming Soon</h2>
        <p class="text-gray-600 mb-6">This feature is currently under development</p>
        
        <!-- Placeholder Coverflow UI -->
        <div class="relative h-64 max-w-md mx-auto mb-8">
          <!-- Album Cards -->
          <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-lg shadow-lg z-30 flex items-center justify-center">
            <img src="https://via.placeholder.com/200x200?text=Current+Album" alt="Current Album" class="w-full h-full object-cover rounded-lg">
          </div>
          <div class="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-lg shadow-md z-20 rotate-[-15deg] flex items-center justify-center opacity-70">
            <img src="https://via.placeholder.com/200x200?text=Previous+Album" alt="Previous Album" class="w-full h-full object-cover rounded-lg">
          </div>
          <div class="absolute left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-lg shadow-md z-20 rotate-[15deg] flex items-center justify-center opacity-70">
            <img src="https://via.placeholder.com/200x200?text=Next+Album" alt="Next Album" class="w-full h-full object-cover rounded-lg">
          </div>
        </div>
        
        <!-- Rating Controls -->
        <div class="flex justify-center space-x-4 mb-6">
          <button class="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow hover:bg-red-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button class="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shadow hover:bg-yellow-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow hover:bg-green-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        
        <!-- Navigation Dots -->
        <div class="flex justify-center space-x-1 mb-4">
          <div class="w-2 h-2 rounded-full bg-green-600"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
          <div class="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
        
        <p class="text-sm text-gray-500">Album 1 of 11</p>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8 mb-24">
      <button 
        @click="saveRankings"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors opacity-50 cursor-not-allowed"
      >
        <span>Save Rankings (Coming Soon)</span>
      </button>
      
      <button 
        @click="resetRankings"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors opacity-50 cursor-not-allowed"
      >
        Reset Rankings
      </button>
      
      <router-link 
        to="/rank/albums"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-colors text-center"
      >
        Back to Traditional Ranking
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';

const router = useRouter();
const userStore = useUserStore();
const rankingStore = useRankingStore();

// Placeholder functions for future implementation
const saveRankings = () => {
  showToast('Coming Soon', 'This feature is currently under development.');
};

const resetRankings = () => {
  showToast('Coming Soon', 'This feature is currently under development.');
};

const login = () => {
  userStore.setIsLoggedInSimulation(true);
  showToast('Logged In', 'You are now logged in.');
};

const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    duration: 3000
  });
};
</script>

<style scoped>
.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}
</style>
