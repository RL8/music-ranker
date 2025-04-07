<template>
  <div 
    class="swipe-action-container"
    ref="container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <!-- Left actions (revealed when swiping right) -->
    <div class="action-panel left-panel" v-if="leftActions.length > 0">
      <div 
        v-for="(action, index) in leftActions" 
        :key="'left-' + index"
        class="action-button"
        :class="[action.type || 'default']"
        @click="executeAction(action)"
      >
        <i v-if="action.icon" class="action-icon" :class="action.icon"></i>
        <span v-if="action.label" class="action-label">{{ action.label }}</span>
      </div>
    </div>
    
    <!-- Right actions (revealed when swiping left) -->
    <div class="action-panel right-panel" v-if="rightActions.length > 0">
      <div 
        v-for="(action, index) in rightActions" 
        :key="'right-' + index"
        class="action-button"
        :class="[action.type || 'default']"
        @click="executeAction(action)"
      >
        <i v-if="action.icon" class="action-icon" :class="action.icon"></i>
        <span v-if="action.label" class="action-label">{{ action.label }}</span>
      </div>
    </div>
    
    <!-- Main content -->
    <div 
      class="swipeable-content"
      :style="contentStyle"
      :class="{ 'is-swiping': isSwiping }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwipeAction',
  props: {
    leftActions: {
      type: Array,
      default: () => []
    },
    rightActions: {
      type: Array,
      default: () => []
    },
    threshold: {
      type: Number,
      default: 0.4 // Percentage of width required to trigger action
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startX: 0,
      currentX: 0,
      isSwiping: false,
      containerWidth: 0,
      swipeDistance: 0,
      direction: null, // 'left' or 'right'
      actionWidth: 80 // Width of each action button
    }
  },
  computed: {
    contentStyle() {
      if (!this.isSwiping && this.swipeDistance === 0) return {};
      
      return {
        transform: `translateX(${this.swipeDistance}px)`,
        transition: this.isSwiping ? 'none' : 'transform 0.3s ease'
      };
    },
    
    maxLeftSwipe() {
      return this.rightActions.length * this.actionWidth;
    },
    
    maxRightSwipe() {
      return this.leftActions.length * this.actionWidth;
    }
  },
  mounted() {
    this.containerWidth = this.$refs.container.offsetWidth;
    
    // Reset swipe when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    onTouchStart(e) {
      if (this.disabled) return;
      
      this.startX = e.touches[0].clientX;
      this.isSwiping = true;
    },
    
    onTouchMove(e) {
      if (!this.isSwiping || this.disabled) return;
      
      this.currentX = e.touches[0].clientX;
      const diff = this.currentX - this.startX;
      
      // Determine swipe direction
      this.direction = diff > 0 ? 'right' : 'left';
      
      // Apply resistance when swiping
      if (this.direction === 'left' && this.rightActions.length === 0) {
        this.swipeDistance = 0;
        return;
      }
      
      if (this.direction === 'right' && this.leftActions.length === 0) {
        this.swipeDistance = 0;
        return;
      }
      
      // Limit swipe distance based on available actions
      if (this.direction === 'left') {
        this.swipeDistance = Math.max(-this.maxLeftSwipe, diff);
      } else {
        this.swipeDistance = Math.min(this.maxRightSwipe, diff);
      }
    },
    
    onTouchEnd() {
      if (!this.isSwiping || this.disabled) return;
      
      const thresholdDistance = this.containerWidth * this.threshold;
      
      // Check if swipe distance exceeds threshold
      if (Math.abs(this.swipeDistance) >= thresholdDistance) {
        // Snap to action buttons
        if (this.direction === 'left') {
          this.swipeDistance = -this.maxLeftSwipe;
        } else {
          this.swipeDistance = this.maxRightSwipe;
        }
      } else {
        // Reset if not enough
        this.reset();
      }
      
      this.isSwiping = false;
    },
    
    executeAction(action) {
      if (typeof action.handler === 'function') {
        action.handler();
      }
      
      this.$emit('action', action);
      this.reset();
    },
    
    reset() {
      this.swipeDistance = 0;
      this.isSwiping = false;
    },
    
    handleOutsideClick(e) {
      // Reset swipe when clicking outside the component
      if (this.swipeDistance !== 0 && !this.$el.contains(e.target)) {
        this.reset();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.swipe-action-container {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.action-panel {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: stretch;
  
  &.left-panel {
    left: 0;
    transform: translateX(-100%);
  }
  
  &.right-panel {
    right: 0;
    transform: translateX(100%);
  }
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  
  &.default {
    background-color: #42b983;
  }
  
  &.danger {
    background-color: #dc3545;
  }
  
  &.warning {
    background-color: #ffc107;
    color: #212529;
  }
  
  &.info {
    background-color: #17a2b8;
  }
  
  .action-icon {
    font-size: 1.25rem;
    margin-bottom: 4px;
  }
  
  .action-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    padding: 0 8px;
  }
}

.swipeable-content {
  position: relative;
  background-color: #fff;
  z-index: 1;
  will-change: transform;
  
  &.is-swiping {
    user-select: none;
  }
}
</style>
