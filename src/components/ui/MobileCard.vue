<template>
  <div class="mobile-card" :class="{ 'is-compact': compact }">
    <div v-if="title" class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <slot name="header-actions"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    compact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  
  &.is-compact {
    margin-bottom: 0.5rem;
    
    .card-body {
      padding: 0.75rem;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    
    .card-title {
      margin: 0;
      font-size: 1.1rem;
    }
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .card-footer {
    padding: 0.75rem 1rem;
    border-top: 1px solid #eee;
    background-color: #f8f9fa;
  }
}

@media (min-width: 768px) {
  .mobile-card {
    margin-bottom: 1.5rem;
  }
}
</style>
