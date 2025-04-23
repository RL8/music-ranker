<template>
  <MobileModal 
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    title="Share Your Rankings" 
    size="sm"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <p class="text-gray-600 text-sm">
        Choose how you want to share your rankings with friends and fellow Swifties.
      </p>
      
      <div class="space-y-2">
        <button 
          @click="downloadAsPNG" 
          class="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-medium">Download as PNG</h3>
            <p class="text-xs text-gray-500">Save your visualization as an image</p>
          </div>
        </button>
        
        <button 
          @click="shareAsAnimation" 
          class="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-medium">Share as Animation</h3>
            <p class="text-xs text-gray-500">Create an animated GIF of your rankings</p>
          </div>
        </button>
        
        <button 
          @click="shareProfileLink" 
          class="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-medium">Share Profile Link</h3>
            <p class="text-xs text-gray-500">Copy your profile link to clipboard</p>
          </div>
        </button>
        
        <div class="w-full flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="text-left">
            <h3 class="font-medium text-gray-500">Share as Game</h3>
            <div class="flex items-center">
              <p class="text-xs text-gray-500">Create a game for friends to guess your rankings</p>
              <span class="ml-1 px-1 bg-yellow-100 text-yellow-800 text-xs rounded">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MobileModal>
</template>

<script setup>
import { ref } from 'vue';
import MobileModal from '@/components/ui/MobileModal.vue';
import toastService from '@/services/toastService';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

// Download visualization as PNG
const downloadAsPNG = () => {
  toastService.info('Download Started', 'Your visualization is being prepared for download.');
  // This would be implemented with actual export functionality
  emit('update:modelValue', false);
};

// Share as animation
const shareAsAnimation = () => {
  toastService.info('Share Animation', 'Preparing animation for sharing...');
  // This would be implemented with actual sharing functionality
  emit('update:modelValue', false);
};

// Share profile link
const shareProfileLink = () => {
  toastService.success('Link Copied', 'Your profile link has been copied to clipboard.');
  // This would be implemented with actual clipboard functionality
  emit('update:modelValue', false);
};
</script>
