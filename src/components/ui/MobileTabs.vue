<template>
  <div class="mobile-tabs-container">
    <!-- Tab Navigation -->
    <div class="tabs-nav" :class="{ 'scrollable': scrollable }">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ 'active': modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span v-if="tab.icon" class="tab-icon">
          <slot :name="`icon-${tab.id}`">
            {{ tab.icon }}
          </slot>
        </span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileTabs',
  props: {
    modelValue: {
      type: [String, Number],
      required: true
    },
    tabs: {
      type: Array,
      required: true,
      validator: (tabs) => {
        return tabs.every(tab => 'id' in tab && 'label' in tab);
      }
    },
    scrollable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue']
}
</script>

<style lang="scss" scoped>
.mobile-tabs-container {
  margin-bottom: 1rem;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb; // gray-200
  margin-bottom: 1rem;
  
  &.scrollable {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE/Edge
    
    &::-webkit-scrollbar {
      display: none; // Chrome/Safari
    }
  }
}

.tab-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280; // gray-500
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #4b5563; // gray-600
  }
  
  &.active {
    color: #22c55e; // green-600
    border-bottom-color: #22c55e; // green-600
  }
  
  .tab-icon {
    margin-right: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.tab-content {
  padding: 0.5rem 0;
}

// Mobile optimizations
@media (max-width: 640px) {
  .tab-button {
    padding: 0.75rem 1rem;
    min-height: 3rem;
  }
}
</style>
