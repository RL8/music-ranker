<template>
  <div 
    v-if="show"
    class="mobile-alert"
    :class="[
      `type-${type}`,
      { 'is-dismissible': dismissible }
    ]"
    role="alert"
  >
    <div class="alert-icon" v-if="showIcon">
      <component :is="typeIcons[type] || typeIcons.info" />
    </div>
    
    <div class="alert-content">
      <h4 v-if="title" class="alert-title">{{ title }}</h4>
      <p class="alert-message">
        <slot>{{ message }}</slot>
      </p>
    </div>
    
    <button 
      v-if="dismissible" 
      @click="dismiss"
      class="alert-dismiss"
      aria-label="Dismiss"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MobileAlert',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 5000
    }
  },
  emits: ['dismiss', 'update:show'],
  data() {
    return {
      timeoutId: null,
      typeIcons: {
        success: {
          template: `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          `
        },
        error: {
          template: `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          `
        },
        info: {
          template: `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          `
        },
        warning: {
          template: `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          `
        }
      }
    };
  },
  watch: {
    show(newValue) {
      if (newValue && this.autoClose) {
        this.setAutoClose();
      }
    }
  },
  mounted() {
    if (this.show && this.autoClose) {
      this.setAutoClose();
    }
  },
  beforeUnmount() {
    this.clearAutoClose();
  },
  methods: {
    dismiss() {
      this.$emit('dismiss');
      this.$emit('update:show', false);
    },
    setAutoClose() {
      this.clearAutoClose();
      if (this.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.dismiss();
        }, this.duration);
      }
    },
    clearAutoClose() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-alert {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  
  &.type-info {
    background-color: #eff6ff; // blue-50
    color: #1e40af; // blue-800
    
    .alert-icon {
      color: #3b82f6; // blue-500
    }
  }
  
  &.type-success {
    background-color: #f0fdf4; // green-50
    color: #166534; // green-800
    
    .alert-icon {
      color: #22c55e; // green-500
    }
  }
  
  &.type-warning {
    background-color: #fffbeb; // amber-50
    color: #92400e; // amber-800
    
    .alert-icon {
      color: #f59e0b; // amber-500
    }
  }
  
  &.type-error {
    background-color: #fef2f2; // red-50
    color: #991b1b; // red-800
    
    .alert-icon {
      color: #ef4444; // red-500
    }
  }
  
  .alert-icon {
    flex-shrink: 0;
    margin-right: 0.75rem;
    margin-top: 0.125rem;
  }
  
  .alert-content {
    flex: 1;
  }
  
  .alert-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .alert-message {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .alert-dismiss {
    flex-shrink: 0;
    margin-left: 0.75rem;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: currentColor;
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>
