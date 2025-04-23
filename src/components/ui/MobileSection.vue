<template>
  <section 
    class="mobile-section"
    :class="[
      `spacing-${spacing}`,
      { 'with-border': border, 'with-shadow': shadow }
    ]"
  >
    <h2 v-if="title" class="section-title">{{ title }}</h2>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'MobileSection',
  props: {
    title: {
      type: String,
      default: ''
    },
    spacing: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    border: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.mobile-section {
  background-color: #fff;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  
  &.spacing-small {
    padding: 0.75rem;
  }
  
  &.spacing-medium {
    padding: 1rem;
  }
  
  &.spacing-large {
    padding: 1.5rem;
  }
  
  &.with-border {
    border: 1px solid #e5e7eb; // gray-200
  }
  
  &.with-shadow {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #111827; // gray-900
  }
  
  @media (min-width: 768px) {
    &.spacing-medium {
      padding: 1.25rem;
    }
    
    &.spacing-large {
      padding: 2rem;
    }
  }
}
</style>
