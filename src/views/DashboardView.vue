<template>
  <div class="p-4">
    <MobileHeader>
      <template #title>
        Welcome to your Swiftie Universe, <span class="text-green-600">{{ userStore.user?.username || 'Swiftie' }}</span>!
      </template>
    </MobileHeader>
    
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
      
      <!-- No Rankings Message -->
      <div v-if="!hasRankings" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">No Rankings Yet</h3>
          <p class="text-gray-600 mb-4">You haven't ranked any albums yet. Create your rankings to see your personalized visualizations.</p>
          <router-link 
            to="/rank/albums"
            class="inline-block py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            Rank Albums Now
          </router-link>
        </div>
      </div>
      
      <!-- Era Sunburst Chart -->
      <div v-else-if="activeSunburst === 'era'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <SunburstChart 
          :data="eraSunburstData" 
          :key="JSON.stringify(eraSunburstData)"
          color-scheme="schemeSet3"
          node-info-description="of your ranked albums"
          :central-circle-size="0.15"
        />
      </div>
      
      <!-- Time Period Sunburst Chart -->
      <div v-else-if="activeSunburst === 'time'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <SunburstChart 
          :data="timeSunburstData" 
          :key="JSON.stringify(timeSunburstData)"
          color-scheme="schemeBlues"
          node-info-description="of your ranked albums"
          :central-circle-size="0.15"
        />
      </div>
      
      <!-- Overview Sunburst Chart -->
      <div v-else-if="activeSunburst === 'overview'" class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm">
        <SunburstChart 
          :data="overviewSunburstData" 
          :key="JSON.stringify(overviewSunburstData)"
          color-scheme="schemeCategory10"
          node-info-description="of your ranked albums"
          :central-circle-size="0.15"
        />
      </div>
    </div>
    
    <!-- Rankings View -->
    <div v-if="activeView === 'rankings'">
      <div class="mb-6 space-y-4">
        <!-- Album Rankings Section -->
        <div class="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 class="font-medium mb-3">Album Rankings</h3>
          <div v-if="hasRankings" class="space-y-2">
            <div v-for="(tier, tierName) in rankingStore.rankedTiers" :key="tierName" v-if="tier.length > 0">
              <div v-for="album in tier" :key="album.id" class="flex items-center mb-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs mr-2" 
                     :style="{ backgroundColor: getTierColor(tierName) + '30' }">
                  {{ getTierLabel(tierName) }}
                </div>
                <div class="flex-1">
                  <p class="font-medium">{{ album.title }}</p>
                  <p class="text-xs text-gray-500">{{ getTierName(tierName) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            No album rankings yet
          </div>
          <router-link to="/rank/albums" class="mt-3 text-sm text-green-600 hover:underline inline-block">
            {{ hasRankings ? 'Edit album rankings →' : 'Create album rankings →' }}
          </router-link>
          <router-link to="/rank/albums/coverflow" class="mt-3 ml-4 text-sm text-purple-600 hover:underline inline-flex items-center">
            Try Coverflow Ranking
            <span class="ml-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">New</span>
          </router-link>
        </div>
        
        <!-- Song Rankings Section -->
        <div class="border border-gray-200 rounded-lg p-4 bg-white">
          <h3 class="font-medium mb-3">Song Rankings</h3>
          <div class="text-center py-4 text-gray-500">
            No song rankings yet
          </div>
          <router-link to="/rank/songs" class="mt-3 text-sm text-green-600 hover:underline inline-block">
            Create song rankings →
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
    
    <!-- Login/Logout Button -->
    <div class="mt-10 text-center">
      <button 
        @click="toggleLogin(!userStore.isLoggedInSimulation)" 
        class="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors">
        {{ userStore.isLoggedInSimulation ? 'Simulate Logout' : 'Simulate Login' }}
      </button>
    </div>
    
    <div class="border border-gray-300 rounded-lg p-4 bg-gray-50 mt-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">Music Collection Overview</h2>
      <div class="space-y-2">
        <router-link 
          to="/rank/albums"
          class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <i class="album-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-medium">Album Rankings</h3>
            <p class="text-sm text-gray-500">Rank your favorite Taylor Swift albums</p>
          </div>
          <div class="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </router-link>
        
        <router-link 
          to="/rank/albums/coverflow"
          class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <i class="coverflow-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-medium">Coverflow Rankings</h3>
            <p class="text-sm text-gray-500">Try our new coverflow ranking experience</p>
            <span class="inline-block mt-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">New</span>
          </div>
          <div class="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </router-link>
        
        <router-link 
          to="/rank/songs"
          class="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <i class="song-icon w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-medium">Song Rankings</h3>
            <p class="text-sm text-gray-500">Rank songs from your favorite albums</p>
          </div>
          <div class="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';
import SunburstChart from '@/components/visualizations/SunburstChart.vue';
import staticAlbumsData from '@/data/static-albums.json';
import MobileHeader from '@/components/ui/MobileHeader.vue';

// Store setup
const userStore = useUserStore();
const rankingStore = useRankingStore();
const toast = toastService;

// UI state
const activeView = ref('visualizations');
const activeSunburst = ref('overview');
const showShareMenu = ref(false);

// Check if user has any rankings
const hasRankings = computed(() => {
  return Object.values(rankingStore.rankedTiers).some(tier => tier.length > 0);
});

// Toggle share menu
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value;
}

// Show toast notification
function showToast(title, message, type = 'info') {
  switch (type) {
    case 'success':
      toast.success(title, message);
      break;
    case 'error':
      toast.error(title, message);
      break;
    case 'warning':
      toast.warning(title, message);
      break;
    default:
      toast.info(title, message);
  }
}

// Download visualization as PNG
function downloadAsPNG() {
  showToast('Download Started', 'Your visualization is being prepared for download.', 'info');
  // This would be implemented with actual export functionality
}

// Share as animation
function shareAsAnimation() {
  showToast('Share Animation', 'Preparing animation for sharing...', 'info');
  // This would be implemented with actual sharing functionality
}

// Share profile link
function shareProfileLink() {
  showToast('Link Copied', 'Your profile link has been copied to clipboard.', 'success');
  // This would be implemented with actual clipboard functionality
}

// Toggle login/logout
function toggleLogin(status) {
  userStore.setIsLoggedInSimulation(status);
  showToast(
    status ? 'Logged In' : 'Logged Out', 
    status ? 'You are now logged in.' : 'You have been logged out.',
    status ? 'success' : 'error'
  );
}

// Helper functions for tier display
function getTierLabel(tierName) {
  const labels = {
    tier1: 'S',
    tier2: 'A',
    tier3: 'B',
    tier4: 'C',
    tier5: 'D'
  };
  return labels[tierName] || '';
}

function getTierName(tierName) {
  const names = {
    tier1: 'Tier 1 (Top)',
    tier2: 'Tier 2',
    tier3: 'Tier 3',
    tier4: 'Tier 4',
    tier5: 'Tier 5'
  };
  return names[tierName] || '';
}

function getTierColor(tierName) {
  const colors = {
    tier1: '#ef4444', // Red
    tier2: '#3b82f6', // Blue
    tier3: '#f59e0b', // Yellow
    tier4: '#10b981', // Green
    tier5: '#8b5cf6'  // Purple
  };
  return colors[tierName] || '#6b7280'; // Gray default
}

// Sunburst data transformations
const overviewSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  const children = [];
  
  // Add each tier as a node
  Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
    if (albums.length > 0) {
      children.push({
        name: getTierName(tierName),
        color: getTierColor(tierName),
        children: albums.map((album, index) => ({
          name: album.title,
          size: tierName === 'tier1' ? 10 : 
                tierName === 'tier2' ? 8 : 
                tierName === 'tier3' ? 6 : 
                tierName === 'tier4' ? 4 : 2,
          color: album.color
        }))
      });
    }
  });
  
  return {
    name: "My Album Rankings",
    children
  };
});

const eraSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  // Group albums by era (simplified for this example)
  const eraGroups = {
    "Country Era": ["album-ts"],
    "Pop Transition": ["album-fearless", "album-speaknow", "album-red"],
    "Pure Pop Era": ["album-1989", "album-reputation", "album-lover"],
    "Folk Era": ["album-folklore", "album-evermore"],
    "Recent Era": ["album-midnights", "album-tortured"]
  };
  
  const children = [];
  
  // Create era nodes with their albums
  Object.entries(eraGroups).forEach(([eraName, albumIds]) => {
    const eraAlbums = [];
    
    // Find ranked albums in this era
    Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
      albums.forEach(album => {
        if (albumIds.includes(album.id)) {
          eraAlbums.push({
            name: album.title,
            size: tierName === 'tier1' ? 10 : 
                  tierName === 'tier2' ? 8 : 
                  tierName === 'tier3' ? 6 : 
                  tierName === 'tier4' ? 4 : 2,
            color: album.color,
            tierName: getTierName(tierName)
          });
        }
      });
    });
    
    // Only add era if it has ranked albums
    if (eraAlbums.length > 0) {
      children.push({
        name: eraName,
        children: eraAlbums
      });
    }
  });
  
  return {
    name: "Albums by Era",
    children
  };
});

const timeSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  // Group albums by time period
  const timeGroups = {
    "2006-2010": [2006, 2007, 2008, 2009, 2010],
    "2011-2015": [2011, 2012, 2013, 2014, 2015],
    "2016-2020": [2016, 2017, 2018, 2019, 2020],
    "2021-2025": [2021, 2022, 2023, 2024, 2025]
  };
  
  const children = [];
  
  // Create time period nodes with their albums
  Object.entries(timeGroups).forEach(([periodName, years]) => {
    const periodAlbums = [];
    
    // Find all albums in this time period
    const albumsInPeriod = staticAlbumsData.filter(album => years.includes(album.year));
    const albumIdsInPeriod = albumsInPeriod.map(album => album.id);
    
    // Find ranked albums in this period
    Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
      albums.forEach(album => {
        if (albumIdsInPeriod.includes(album.id)) {
          periodAlbums.push({
            name: album.title,
            size: tierName === 'tier1' ? 10 : 
                  tierName === 'tier2' ? 8 : 
                  tierName === 'tier3' ? 6 : 
                  tierName === 'tier4' ? 4 : 2,
            color: album.color,
            tierName: getTierName(tierName)
          });
        }
      });
    });
    
    // Only add period if it has ranked albums
    if (periodAlbums.length > 0) {
      children.push({
        name: periodName,
        children: periodAlbums
      });
    }
  });
  
  return {
    name: "Albums by Time Period",
    children
  };
});
</script>

<style scoped>
/* Icon styles */
.edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' /%3E%3C/svg%3E");
}

.share-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' /%3E%3C/svg%3E");
}

.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.coverflow-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}
</style>
