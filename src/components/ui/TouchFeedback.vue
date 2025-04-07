<template>
  <div 
    class="touch-feedback"
    :class="{ 'active': isActive }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <slot></slot>
    <div class="ripple-container" v-if="enableRipple">
      <span 
        v-for="(ripple, index) in ripples" 
        :key="index"
        class="ripple"
        :style="getRippleStyle(ripple)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TouchFeedback',
  props: {
    color: {
      type: String,
      default: 'rgba(0, 0, 0, 0.1)'
    },
    activeClass: {
      type: String,
      default: ''
    },
    enableRipple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isActive: false,
      ripples: []
    }
  },
  methods: {
    onTouchStart(event) {
      if (this.disabled) return;
      
      this.isActive = true;
      this.$emit('active', true);
      
      if (this.enableRipple) {
        this.createRipple(event.touches[0]);
      }
    },
    
    onTouchEnd() {
      if (this.disabled) return;
      
      this.isActive = false;
      this.$emit('active', false);
    },
    
    onMouseDown(event) {
      if (this.disabled) return;
      
      // Only handle mouse events if not a touch device
      if (window.matchMedia('(pointer: fine)').matches) {
        this.isActive = true;
        this.$emit('active', true);
        
        if (this.enableRipple) {
          this.createRipple(event);
        }
      }
    },
    
    onMouseUp() {
      if (this.disabled) return;
      
      // Only handle mouse events if not a touch device
      if (window.matchMedia('(pointer: fine)').matches) {
        this.isActive = false;
        this.$emit('active', false);
      }
    },
    
    createRipple(event) {
      const container = this.$el.getBoundingClientRect();
      const size = Math.max(container.width, container.height) * 2;
      
      // Calculate ripple position relative to the container
      const x = event.clientX - container.left;
      const y = event.clientY - container.top;
      
      // Create a new ripple
      const ripple = {
        x,
        y,
        size,
        id: Date.now()
      };
      
      // Add the ripple to the array
      this.ripples.push(ripple);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        this.ripples = this.ripples.filter(r => r.id !== ripple.id);
      }, 600);
    },
    
    getRippleStyle(ripple) {
      return {
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
        backgroundColor: this.color
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.touch-feedback {
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.2s ease;
  
  &.active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
</style>
