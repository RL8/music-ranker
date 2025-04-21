<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 pl-10 md:pl-0">Artists</h1>
    
    <!-- Artist Search -->
    <div class="mb-6">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search artists..." 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button 
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="searchQuery = ''"
          v-if="searchQuery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Featured Artist -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div class="relative h-40 bg-gradient-to-r from-purple-500 to-pink-500">
        <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h2 class="text-2xl font-bold">Taylor Swift</h2>
          <p class="text-sm opacity-90">Featured Artist</p>
        </div>
      </div>
      <div class="p-4">
        <p class="text-gray-600 mb-4">
          American singer-songwriter known for narrative songs about her personal life. One of the most successful and influential artists of her generation.
        </p>
        <div class="flex space-x-2">
          <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Pop</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Country</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Folk</span>
          <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Rock</span>
        </div>
      </div>
    </div>
    
    <!-- Artist Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(artist, index) in filteredArtists" :key="index" class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
              <i class="artist-icon w-6 h-6 bg-center bg-no-repeat bg-contain text-gray-500"></i>
            </div>
            <div class="ml-3">
              <h3 class="font-medium text-gray-800">{{ artist.name }}</h3>
              <p class="text-sm text-gray-500">{{ artist.genre }}</p>
            </div>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <span class="text-xs text-gray-500">{{ artist.albumCount }} albums</span>
            <button class="text-green-600 text-sm font-medium hover:text-green-700">View</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Coming Soon Message -->
    <div v-if="artists.length === 0" class="mt-8 text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
      <div class="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-800 mb-2">Artist Profiles Coming Soon</h3>
      <p class="text-gray-600 max-w-md mx-auto">
        We're working on expanding our artist database. Check back soon for more artists and detailed profiles!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Search functionality
const searchQuery = ref('');

// Artist data (placeholder for now)
const artists = ref([
  {
    name: 'Olivia Rodrigo',
    genre: 'Pop, Rock',
    albumCount: 2
  },
  {
    name: 'Sabrina Carpenter',
    genre: 'Pop',
    albumCount: 5
  },
  {
    name: 'Gracie Abrams',
    genre: 'Pop, Indie',
    albumCount: 1
  },
  {
    name: 'Phoebe Bridgers',
    genre: 'Indie Folk, Rock',
    albumCount: 2
  },
  {
    name: 'Lana Del Rey',
    genre: 'Alternative, Pop',
    albumCount: 9
  }
]);

// Filter artists based on search query
const filteredArtists = computed(() => {
  if (!searchQuery.value) return artists.value;
  
  const query = searchQuery.value.toLowerCase();
  return artists.value.filter(artist => 
    artist.name.toLowerCase().includes(query) || 
    artist.genre.toLowerCase().includes(query)
  );
});
</script>

<style scoped>
.artist-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E");
}
</style>
