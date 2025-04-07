<template>
  <div class="mobile-list-container">
    <div v-if="title" class="list-header">
      <h3 class="list-title">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    
    <div class="mobile-list" :class="{ 'compact': compact }">
      <div 
        v-for="(item, index) in items" 
        :key="itemKey ? item[itemKey] : index"
        class="list-item"
        :class="{ 'with-divider': withDividers && index < items.length - 1 }"
        @click="$emit('item-click', item)"
      >
        <div class="item-content">
          <slot name="item" :item="item" :index="index">
            {{ item }}
          </slot>
        </div>
        <div v-if="showArrow" class="item-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
      
      <div v-if="items.length === 0" class="empty-state">
        <slot name="empty">
          <p>No items to display</p>
        </slot>
      </div>
    </div>
    
    <div v-if="$slots.footer" class="list-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileList',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemKey: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    compact: {
      type: Boolean,
      default: false
    },
    withDividers: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: false
    }
  },
  emits: ['item-click']
}
</script>

<style lang="scss" scoped>
.mobile-list-container {
  margin-bottom: 1rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  .list-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.mobile-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &.compact {
    .list-item {
      padding: 0.75rem 1rem;
    }
  }
  
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:active {
      background-color: #f5f5f5;
    }
    
    &.with-divider {
      border-bottom: 1px solid #eee;
    }
    
    .item-content {
      flex: 1;
    }
    
    .item-arrow {
      margin-left: 0.5rem;
      color: #999;
    }
  }
  
  .empty-state {
    padding: 2rem 1rem;
    text-align: center;
    color: #999;
  }
}

.list-footer {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}
</style>
