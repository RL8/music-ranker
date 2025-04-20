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
  margin-bottom: 1rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  padding-left: 2.5rem; /* Space for sidebar toggle */
}

@media (min-width: 768px) {
  .header-title {
    padding-left: 0; /* No extra padding needed on larger screens */
  }
}
</style>
