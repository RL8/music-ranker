<template>
  <div 
    class="mobile-spacing"
    :class="`size-${size}`"
  ></div>
</template>

<script>
export default {
  name: 'MobileSpacing',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['xs', 'small', 'medium', 'large', 'xl'].includes(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-spacing {
  &.size-xs {
    height: 0.5rem; // 8px
  }
  
  &.size-small {
    height: 1rem; // 16px
  }
  
  &.size-medium {
    height: 1.5rem; // 24px
  }
  
  &.size-large {
    height: 2rem; // 32px
  }
  
  &.size-xl {
    height: 3rem; // 48px
  }
}
</style>
