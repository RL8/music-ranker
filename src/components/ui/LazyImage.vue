<template>
  <div class="lazy-image-container" :style="{ height: height + 'px', width: width + 'px' }">
    <img 
      v-if="isVisible || !lazyLoad" 
      :src="src" 
      :alt="alt" 
      class="lazy-image"
      :class="{ 'lazy-loaded': isLoaded }"
      @load="onImageLoaded"
    />
    <div v-else class="lazy-placeholder" :style="{ backgroundColor: placeholderColor }">
      <slot name="placeholder">
        <div class="loading-indicator"></div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: 'auto'
    },
    height: {
      type: [Number, String],
      default: 'auto'
    },
    lazyLoad: {
      type: Boolean,
      default: true
    },
    placeholderColor: {
      type: String,
      default: '#f0f0f0'
    },
    threshold: {
      type: Number,
      default: 0.1
    }
  },
  data() {
    return {
      isVisible: false,
      isLoaded: false,
      observer: null
    }
  },
  mounted() {
    if (this.lazyLoad && 'IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for browsers without IntersectionObserver
      this.isVisible = true;
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: this.threshold
      };
      
      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this.isVisible = true;
          this.observer.disconnect();
          this.observer = null;
        }
      }, options);
      
      this.observer.observe(this.$el);
    },
    onImageLoaded() {
      this.isLoaded = true;
      this.$emit('loaded');
    }
  }
}
</script>

<style lang="scss" scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
  
  .lazy-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.lazy-loaded {
      opacity: 1;
    }
  }
  
  .lazy-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .loading-indicator {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-top-color: #42b983;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
