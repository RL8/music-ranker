<template>
  <div class="mobile-header">
    <!-- Title with proper spacing for sidebar toggle -->
    <h1 class="header-title">
      <!-- Allow for rich content in the title through a slot -->
      <slot name="title">{{ title }}</slot>
    </h1>
    
    <!-- Optional slot for additional actions -->
    <div class="header-actions" v-if="$slots.actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 1rem 3.5rem; /* Added left padding to make room for sidebar toggle */
  border-bottom: 1px solid #f0f0f0;
  background-color: white;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
