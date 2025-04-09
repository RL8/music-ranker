<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="fixed inset-x-0 bottom-20 mx-auto w-4/5 max-w-sm bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 transition-all duration-300"
      :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-10 opacity-0': !isVisible }"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1 mr-4">
          <p class="font-medium">{{ title }}</p>
          <p v-if="message" class="text-sm text-gray-300 mt-1">{{ message }}</p>
        </div>
        <button @click="hide" class="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoClose: {
    type: Boolean,
    default: true
  }
});

const isVisible = ref(false);
let timeoutId = null;

const show = () => {
  isVisible.value = true;
  if (props.autoClose && props.duration > 0) {
    timeoutId = setTimeout(() => {
      hide();
    }, props.duration);
  }
};

const hide = () => {
  isVisible.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

onMounted(() => {
  show();
});

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});

defineExpose({ show, hide });
</script>
