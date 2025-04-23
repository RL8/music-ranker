<template>
  <button 
    :type="type"
    :class="[
      'mobile-button',
      `variant-${variant}`,
      `size-${size}`,
      { 'full-width': fullWidth, 'with-icon': $slots.icon }
    ]"
    @click="$emit('click', $event)"
  >
    <span v-if="$slots.icon" class="button-icon">
      <slot name="icon"></slot>
    </span>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MobileButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'text', 'danger'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    },
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style lang="scss" scoped>
.mobile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &.with-icon {
    .button-icon {
      display: inline-flex;
      margin-right: 0.5rem;
    }
  }
  
  &.full-width {
    width: 100%;
  }
  
  // Size variants
  &.size-small {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
  
  &.size-medium {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  &.size-large {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }
  
  // Style variants
  &.variant-primary {
    background-color: #22c55e; // green-600
    color: white;
    border: none;
    
    &:hover {
      background-color: #16a34a; // green-700
    }
    
    &:active {
      background-color: #15803d; // green-800
    }
  }
  
  &.variant-secondary {
    background-color: #e5e7eb; // gray-200
    color: #374151; // gray-700
    border: none;
    
    &:hover {
      background-color: #d1d5db; // gray-300
    }
    
    &:active {
      background-color: #9ca3af; // gray-400
    }
  }
  
  &.variant-outline {
    background-color: transparent;
    color: #374151; // gray-700
    border: 1px solid #d1d5db; // gray-300
    
    &:hover {
      background-color: #f3f4f6; // gray-100
    }
    
    &:active {
      background-color: #e5e7eb; // gray-200
    }
  }
  
  &.variant-text {
    background-color: transparent;
    color: #22c55e; // green-600
    border: none;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    
    &:hover {
      color: #16a34a; // green-700
      text-decoration: underline;
    }
  }
  
  &.variant-danger {
    background-color: #ef4444; // red-500
    color: white;
    border: none;
    
    &:hover {
      background-color: #dc2626; // red-600
    }
    
    &:active {
      background-color: #b91c1c; // red-700
    }
  }
}

// Mobile optimizations
@media (max-width: 640px) {
  .mobile-button {
    // Increase touch target size on mobile
    &.size-small {
      min-height: 2rem;
    }
    
    &.size-medium {
      min-height: 2.5rem;
    }
    
    &.size-large {
      min-height: 3rem;
    }
  }
}
</style>
