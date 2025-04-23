<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click="closeOnBackdrop && close()">
        <div class="modal-container" :class="[size]" @click.stop>
          <!-- Header -->
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button 
              v-if="showCloseButton" 
              class="modal-close-button" 
              @click="close()"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

// Close modal
const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Handle ESC key press
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close();
  }
};

// Add/remove event listeners
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  } else {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = ''; // Restore scrolling when modal is closed
  }
});

// Clean up event listeners when component is unmounted
defineExpose({
  close
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-container.sm {
  max-width: 24rem;
}

.modal-container.md {
  max-width: 32rem;
}

.modal-container.lg {
  max-width: 48rem;
}

.modal-container.xl {
  max-width: 64rem;
}

.modal-container.full {
  max-width: 100%;
  height: 100%;
  border-radius: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close-button {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-button:hover {
  color: #1f2937;
  background-color: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Transition animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(10px);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-container:not(.full) {
    max-width: 100%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>
