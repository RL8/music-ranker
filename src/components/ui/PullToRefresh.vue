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
import { ref, computed } from 'vue'

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
  setup(props, { emit }) {
    const container = ref(null)
    const startY = ref(0)
    const currentY = ref(0)
    const isPulling = ref(false)
    const isRefreshing = ref(false)
    const pullDistance = ref(0)
    const indicatorHeight = ref(0)
    
    const contentStyle = computed(() => {
      if (!isPulling.value && !isRefreshing.value) return {}
      
      return {
        transform: `translateY(${indicatorHeight.value}px)`,
        transition: isPulling.value ? 'none' : 'transform 0.3s ease'
      }
    })
    
    const onTouchStart = (e) => {
      if (props.disabled || isRefreshing.value) return
      
      // Only enable pull-to-refresh when at the top of the container
      if (container.value && container.value.scrollTop > 0) return
      
      startY.value = e.touches[0].clientY
      isPulling.value = true
    }
    
    const onTouchMove = (e) => {
      if (!isPulling.value || props.disabled || isRefreshing.value) return
      
      currentY.value = e.touches[0].clientY
      pullDistance.value = Math.max(0, currentY.value - startY.value)
      
      // Apply resistance to the pull
      indicatorHeight.value = Math.min(
        props.maxPullDistance,
        pullDistance.value * 0.5
      )
      
      // Prevent default scrolling when pulling
      if (pullDistance.value > 0) {
        e.preventDefault()
      }
    }
    
    const onTouchEnd = () => {
      if (!isPulling.value || props.disabled) return
      
      if (pullDistance.value >= props.threshold) {
        refresh()
      } else {
        reset()
      }
    }
    
    const refresh = () => {
      isRefreshing.value = true
      indicatorHeight.value = 60 // Show indicator while refreshing
      
      // Emit refresh event
      emit('refresh', onRefreshComplete)
    }
    
    const onRefreshComplete = () => {
      isRefreshing.value = false
      reset()
    }
    
    const reset = () => {
      isPulling.value = false
      pullDistance.value = 0
      indicatorHeight.value = 0
    }
    
    return {
      container,
      isPulling,
      isRefreshing,
      indicatorHeight,
      contentStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd
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
