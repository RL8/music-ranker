<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">
      <span>Welcome to your Swiftie Universe, <span class="text-green-600">Username</span>!</span>
    </h1>
    
    <!-- View Toggle Buttons -->
    <div class="flex mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button 
        @click="activeView = 'visualizations'"
        class="flex-1 py-2 px-4 font-medium transition-colors"
        :class="activeView === 'visualizations' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'">
        Visualizations
      </button>
      <button 
        @click="activeView = 'rankings'"
        class="flex-1 py-2 px-4 font-medium transition-colors"
        :class="activeView === 'rankings' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'">
        Rankings
      </button>
    </div>
    
    <!-- Visualizations View -->
    <div v-if="activeView === 'visualizations'">
      <!-- Sunburst Type Toggle -->
      <div class="flex mb-6 space-x-2">
        <button 
          @click="activeSunburst = 'era'"
          class="py-1 px-3 text-sm rounded-full shadow-sm transition-colors"
          :class="activeSunburst === 'era' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          Era
        </button>
        <button 
          @click="activeSunburst = 'time'"
          class="py-1 px-3 text-sm rounded-full shadow-sm transition-colors"
          :class="activeSunburst === 'time' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          Time Period
        </button>
        <button 
          @click="activeSunburst = 'overview'"
          class="py-1 px-3 text-sm rounded-full shadow-sm transition-colors"
          :class="activeSunburst === 'overview' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
          Overview
        </button>
      </div>
      
      <!-- Era Sunburst Chart -->
      <div v-if="activeSunburst === 'era'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <div class="text-center">
          <div class="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-4 relative">
            <div class="absolute inset-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
              <div class="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center">
                <div class="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                  <span class="text-gray-800 font-bold text-sm">Era View</span>
                </div>
              </div>
            </div>
          </div>
          <p class="text-gray-600 font-medium">Era-Based Visualization</p>
          <p class="text-sm text-gray-500 mt-2">Your preferences organized by Taylor Swift eras</p>
        </div>
      </div>
      
      <!-- Time Period Sunburst Chart -->
      <div v-if="activeSunburst === 'time'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <div class="text-center">
          <div class="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 relative">
            <div class="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500 flex items-center justify-center">
              <div class="absolute inset-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <div class="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                  <span class="text-gray-800 font-bold text-sm">Time View</span>
                </div>
              </div>
            </div>
          </div>
          <p class="text-gray-600 font-medium">Time-Based Visualization</p>
          <p class="text-sm text-gray-500 mt-2">Your preferences organized by release years</p>
        </div>
      </div>
      
      <!-- Overview Sunburst Chart -->
      <div v-if="activeSunburst === 'overview'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <div class="text-center">
          <div class="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4 relative">
            <div class="absolute inset-4 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
              <div class="absolute inset-4 rounded-full bg-gradient-to-r from-teal-400 to-green-500 flex items-center justify-center">
                <div class="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                  <span class="text-gray-800 font-bold text-sm">Overview</span>
                </div>
              </div>
            </div>
          </div>
          <p class="text-gray-600 font-medium">Complete Overview</p>
          <p class="text-sm text-gray-500 mt-2">A comprehensive view of all your rankings</p>
        </div>
      </div>
    </div>
    
    <!-- Rankings View -->
    <div v-if="activeView === 'rankings'">
      <div class="mb-6 space-y-4">
        <!-- Album Rankings Section -->
        <div class="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 class="font-medium mb-3">Album Rankings</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs mr-2">S</div>
              <div class="flex-1">
                <p class="font-medium">Red (Taylor's Version)</p>
                <p class="text-xs text-gray-500">Tier 1</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs mr-2">A</div>
              <div class="flex-1">
                <p class="font-medium">Folklore</p>
                <p class="text-xs text-gray-500">Tier 2</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs mr-2">A</div>
              <div class="flex-1">
                <p class="font-medium">1989</p>
                <p class="text-xs text-gray-500">Tier 2</p>
              </div>
            </div>
          </div>
          <router-link to="/rank/albums" class="mt-3 text-sm text-green-600 hover:underline inline-block">
            View all album rankings →
          </router-link>
        </div>
        
        <!-- Song Rankings Section -->
        <div class="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 class="font-medium mb-3">Song Rankings</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-xs mr-2">S</div>
              <div class="flex-1">
                <p class="font-medium">All Too Well (10 min)</p>
                <p class="text-xs text-gray-500">Red (Taylor's Version) - Tier 1</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs mr-2">S</div>
              <div class="flex-1">
                <p class="font-medium">cardigan</p>
                <p class="text-xs text-gray-500">Folklore - Tier 1</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xs mr-2">A</div>
              <div class="flex-1">
                <p class="font-medium">Blank Space</p>
                <p class="text-xs text-gray-500">1989 - Tier 2</p>
              </div>
            </div>
          </div>
          <router-link to="/rank/songs" class="mt-3 text-sm text-green-600 hover:underline inline-block">
            View all song rankings →
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-between mt-6">
      <router-link 
        to="/rank/albums"
        class="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center">
        <i class="edit-icon w-4 h-4 mr-1 bg-center bg-no-repeat bg-contain"></i>
        Edit Rankings
      </router-link>
      <div class="relative">
        <button 
          @click="toggleShareMenu"
          class="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center">
          <i class="share-icon w-4 h-4 mr-1 bg-center bg-no-repeat bg-contain"></i>
          Share
        </button>
        <!-- Share Menu Dropdown -->
        <div v-if="showShareMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div class="py-1">
            <button @click="downloadAsPNG" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Download as PNG
            </button>
            <button @click="shareAsAnimation" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Share as Animation
            </button>
            <button @click="shareProfileLink" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Share Profile Link
            </button>
            <div class="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
              <div class="flex items-center">
                <span>Share as Game</span>
                <span class="ml-2 px-1 bg-yellow-100 text-yellow-800 text-xs rounded">Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dashboard Content -->
    <div class="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">Music Collection Overview</h2>
      <div class="space-y-2">
        <router-link 
          to="/rank/albums"
          class="flex justify-between items-center p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 block">
          <span>Ranked Albums</span>
          <span class="font-medium">11</span>
        </router-link>
        <router-link 
          to="/rank/songs"
          class="flex justify-between items-center p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 block">
          <span>Ranked Songs</span>
          <span class="font-medium">42</span>
        </router-link>
        <div class="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
          <span>Favorite Era</span>
          <span class="font-medium">Red (Taylor's Version)</span>
        </div>
      </div>
    </div>
    
    <!-- Logout Simulation Button -->
    <button 
      @click="logout"
      class="mt-8 p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors flex items-center mx-auto"
    >
      <i class="logout-icon w-4 h-4 mr-1 bg-center bg-no-repeat bg-contain"></i>
      Simulate Logout
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import toastService from '@/services/toastService';

const userStore = useUserStore();
const router = useRouter();
const showShareMenu = ref(false);
const activeView = ref('visualizations');
const activeSunburst = ref('era');

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value;
};

const showToast = (title, message) => {
  toastService.show({
    title,
    message,
    duration: 3000
  });
};

const downloadAsPNG = () => {
  showToast('Download Started', 'Your visualization is being downloaded as a PNG image.');
  showShareMenu.value = false;
};

const shareAsAnimation = () => {
  showToast('Animation Created', 'Your animated visualization is ready to share.');
  showShareMenu.value = false;
};

const shareProfileLink = () => {
  showToast('Link Copied', 'Your profile link has been copied to clipboard: swifties.io/profile/username');
  showShareMenu.value = false;
};

const logout = () => {
  userStore.setIsLoggedInSimulation(false);
  showToast('Logged Out', 'You have been logged out and will be redirected to the home page.');
  setTimeout(() => {
    router.push('/');
  }, 1500);
};
</script>

<style scoped>
/* Icon styles */
.edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E");
}

.share-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E");
}

.logout-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z'/%3E%3C/svg%3E");
}

/* Add subtle animation to the sunburst */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.rounded-full {
  animation: pulse 4s infinite ease-in-out;
}
</style>
