<template>
  <div 
    class="pull-to-refresh"
    ref="container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div 
      class="pull-indicator"
      :class="{ 'is-visible': isPulling, 'is-refreshing': isRefreshing }"
      :style="{ height: indicatorHeight + 'px' }"
    >
      <div class="indicator-content">
        <div class="spinner"></div>
        <span v-if="isRefreshing">Refreshing...</span>
        <span v-else-if="isPulling">Release to refresh</span>
        <span v-else>Pull down to refresh</span>
      </div>
    </div>
    
    <div class="content-wrapper" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PullToRefresh',
  props: {
    threshold: {
      type: Number,
      default: 80 // Minimum pull distance to trigger refresh
    },
    maxPullDistance: {
      type: Number,
      default: 120 // Maximum pull distance
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startY: 0,
      currentY: 0,
      isPulling: false,
      isRefreshing: false,
      pullDistance: 0,
      indicatorHeight: 0
    }
  },
  computed: {
    contentStyle() {
      if (!this.isPulling && !this.isRefreshing) return {};
      
      return {
        transform: `translateY(${this.indicatorHeight}px)`,
        transition: this.isPulling ? 'none' : 'transform 0.3s ease'
      };
    }
  },
  methods: {
    onTouchStart(e) {
      if (this.disabled || this.isRefreshing) return;
      
      // Only enable pull-to-refresh when at the top of the container
      if (this.$el.scrollTop > 0) return;
      
      this.startY = e.touches[0].clientY;
      this.isPulling = true;
    },
    
    onTouchMove(e) {
      if (!this.isPulling || this.disabled || this.isRefreshing) return;
      
      this.currentY = e.touches[0].clientY;
      this.pullDistance = Math.max(0, this.currentY - this.startY);
      
      // Apply resistance to the pull
      this.indicatorHeight = Math.min(
        this.maxPullDistance,
        this.pullDistance * 0.5
      );
      
      // Prevent default scrolling when pulling
      if (this.pullDistance > 0) {
        e.preventDefault();
      }
    },
    
    onTouchEnd() {
      if (!this.isPulling || this.disabled) return;
      
      if (this.pullDistance >= this.threshold) {
        this.refresh();
      } else {
        this.reset();
      }
    },
    
    refresh() {
      this.isRefreshing = true;
      this.indicatorHeight = 60; // Show indicator while refreshing
      
      // Emit refresh event
      this.$emit('refresh', this.onRefreshComplete);
    },
    
    onRefreshComplete() {
      this.isRefreshing = false;
      this.reset();
    },
    
    reset() {
      this.isPulling = false;
      this.pullDistance = 0;
      this.indicatorHeight = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
.pull-to-refresh {
  position: relative;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.pull-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  transform: translateY(-100%);
  
  &.is-visible {
    transform: translateY(0);
  }
  
  .indicator-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    
    span {
      margin-left: 10px;
      font-size: 14px;
      color: #666;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: #42b983;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s;
    }
  }
  
  &.is-refreshing .spinner {
    opacity: 1;
    animation: spin 1s linear infinite;
  }
}

.content-wrapper {
  min-height: 100%;
  will-change: transform;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
