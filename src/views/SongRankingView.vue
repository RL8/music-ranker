<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Rank Your Favorite Songs
      <button 
        @click="showToast('Song Ranking Help', 'This screen allows you to rank songs from Taylor Swift albums by dragging them from the shelf into different tiers.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    <p class="mb-6 text-gray-600">Drag songs from the shelf to rank them in order of preference</p>
    
    <!-- Horizontally Scrollable Album Thumbnails -->
    <div class="mb-6">
      <h2 class="text-lg font-medium mb-3">Selected Album</h2>
      <div class="flex overflow-x-auto py-2 space-x-4 pb-1">
        <div v-for="(album, index) in albums" :key="index" 
             class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:shadow-md"
             :class="selectedAlbum === index ? 'border-2 border-green-500 shadow-md' : ''"
             @click="selectAlbum(index)">
          <span class="text-xs text-gray-700 font-medium">Album {{ index + 1 }}</span>
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
            @click="showToast('Tier 1 Slot', 'This is your #1 favorite song. Drag a song here from the shelf below.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-green-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #1: Song Title</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 2 -->
      <div class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
        <h2 class="text-xl font-semibold mb-3 text-blue-700">Tier 2</h2>
        <div class="flex flex-col space-y-2">
          <div 
            @click="showToast('Tier 2 Slot', 'This is your #2 favorite song. Drag a song here from the shelf below.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #2: Song Title</span>
          </div>
          <div 
            @click="showToast('Tier 2 Slot', 'This is your #3 favorite song. Drag a song here from the shelf below.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-blue-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #3: Song Title</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 3 -->
      <div class="border-2 border-yellow-500 rounded-lg p-4 bg-yellow-50">
        <h2 class="text-xl font-semibold mb-3 text-yellow-700">Tier 3</h2>
        <div class="flex flex-col space-y-2">
          <div 
            @click="showToast('Tier 3 Slot', 'Drag a song here to rank it in Tier 3.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #4: Song Title</span>
          </div>
          <div 
            @click="showToast('Tier 3 Slot', 'Drag a song here to rank it in Tier 3.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #5: Song Title</span>
          </div>
          <div 
            @click="showToast('Tier 3 Slot', 'Drag a song here to rank it in Tier 3.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-yellow-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #6: Song Title</span>
          </div>
        </div>
      </div>
      
      <!-- Tier 4 -->
      <div class="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <h2 class="text-xl font-semibold mb-3 text-red-700">Tier 4</h2>
        <div class="flex flex-col space-y-2">
          <div 
            @click="showToast('Tier 4 Slot', 'Drag a song here to rank it in Tier 4.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #7: Song Title</span>
          </div>
          <div 
            @click="showToast('Tier 4 Slot', 'Drag a song here to rank it in Tier 4.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #8: Song Title</span>
          </div>
          <div 
            @click="showToast('Tier 4 Slot', 'Drag a song here to rank it in Tier 4.')"
            class="w-full max-w-xs bg-white rounded-lg p-3 shadow-sm border-2 border-dashed border-red-300 hover:bg-gray-50 transition-colors cursor-pointer">
            <span class="text-gray-700 font-medium">Rank #9: Song Title</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Song List Shelf Area -->
    <div class="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 mb-6 transition-all duration-300" :class="{ 'h-20 overflow-hidden': isShelfCollapsed }">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">Song Shelf</h2>
        <button 
          @click="toggleShelf" 
          class="text-gray-500 hover:text-green-600 transition-colors">
          {{ isShelfCollapsed ? 'Expand ▼' : 'Collapse ▲' }}
        </button>
      </div>
      
      <div class="flex flex-col space-y-2">
        <div v-for="(song, index) in songs" :key="index" 
             @click="showToast('Song Selection', `You selected '${song}'. In the full app, you would be able to drag this to a tier.`)"
             class="song-item bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing active:shadow-lg">
          <span class="text-gray-700">{{ song }}</span>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-3 mt-8">
      <button 
        @click="showToast('Start Ranking', 'This would initialize a new song ranking session with all songs from the selected album available for ranking.')"
        class="w-full p-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors active:scale-98 transform duration-150">
        Start Song Ranking Session
      </button>
      <button 
        @click="showToast('Save Rankings', 'This button is disabled until you rank at least 3 songs. It would save your current song rankings to your profile.')"
        class="w-full p-3 bg-gray-300 text-gray-500 rounded-lg font-bold opacity-50 cursor-not-allowed">
        Save Song Rankings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import toastService from '@/services/toastService';

// Album selection
const albums = ref(Array(5).fill(null));
const selectedAlbum = ref(0);

const selectAlbum = (index) => {
  selectedAlbum.value = index;
  showToast('Album Selected', `You selected Album ${index + 1}. Songs from this album are now available for ranking.`);
};

// Songs for the shelf
const songs = ref([
  'Anti-Hero',
  'Blank Space',
  'Cardigan',
  'Cruel Summer',
  'Love Story',
  'All Too Well',
  'Shake It Off',
  'You Belong With Me',
  'Wildest Dreams',
  'Enchanted'
]);

// Shelf collapse state
const isShelfCollapsed = ref(false);

// Toggle shelf collapse
const toggleShelf = () => {
  isShelfCollapsed.value = !isShelfCollapsed.value;
  showToast(
    isShelfCollapsed.value ? 'Shelf Collapsed' : 'Shelf Expanded', 
    isShelfCollapsed.value ? 'The song shelf is now collapsed to give more space to the tiers.' : 'The song shelf is now expanded to show all available songs.'
  );
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
/* Song hover effect */
.song-item:hover {
  transform: translateY(-2px);
}

/* Button active state */
.active\:scale-98:active {
  transform: scale(0.98);
}
</style>
