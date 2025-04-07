<template>
  <transition name="slide-fade">
    <div 
      v-if="showStatus" 
      class="offline-status"
      :class="{ 'is-offline': isOffline }"
    >
      <div class="status-icon">
        <span v-if="isOffline" class="offline-icon"></span>
        <span v-else class="online-icon"></span>
      </div>
      <div class="status-message">
        {{ isOffline ? 'You are offline. Some features may be limited.' : 'Back online!' }}
      </div>
      <button class="close-button" @click="hideStatus" aria-label="Close">
        &times;
      </button>
    </div>
  </transition>
</template>

<script>
import { ServiceWorkerEventBus, getOfflineStatus } from '@/registerServiceWorker';

export default {
  name: 'OfflineStatus',
  data() {
    return {
      isOffline: getOfflineStatus(),
      showStatus: false,
      hideTimeout: null
    }
  },
  created() {
    // Listen for connectivity changes
    this.unsubscribe = ServiceWorkerEventBus.on('connectivity', ({ isOffline }) => {
      this.isOffline = isOffline;
      this.showStatusWithTimeout();
    });
    
    // Show initial status if offline
    if (this.isOffline) {
      this.showStatus = true;
    }
  },
  beforeDestroy() {
    // Clean up event listener
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    // Clear any pending timeouts
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  },
  methods: {
    showStatusWithTimeout() {
      // Always show the status when connectivity changes
      this.showStatus = true;
      
      // Clear any existing timeout
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }
      
      // Auto-hide the online status after 3 seconds
      // Keep offline status visible
      if (!this.isOffline) {
        this.hideTimeout = setTimeout(() => {
          this.showStatus = false;
        }, 3000);
      }
    },
    hideStatus() {
      this.showStatus = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.offline-status {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 90%;
  
  &.is-offline {
    background-color: #f44336;
  }
  
  .status-icon {
    margin-right: 10px;
    
    .offline-icon,
    .online-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .offline-icon {
      background-color: white;
      position: relative;
      
      &:before {
        content: '';
        position: absolute;
        top: 5px;
        left: -3px;
        width: 18px;
        height: 2px;
        background-color: #f44336;
        transform: rotate(-45deg);
      }
    }
    
    .online-icon {
      background-color: white;
    }
  }
  
  .status-message {
    font-size: 14px;
    flex: 1;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    padding: 0 0 0 10px;
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
    }
  }
}

// Transitions
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
}
</style>
