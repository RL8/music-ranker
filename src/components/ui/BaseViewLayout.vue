<template>
  <div class="base-view-layout">
    <MobileHeader v-if="!hideHeader">
      <template #title v-if="title">{{ title }}</template>
      <template #title v-else><slot name="header"></slot></template>
      <template #actions v-if="$slots.actions"><slot name="actions"></slot></template>
    </MobileHeader>
    
    <div class="mobile-page-container">
      <slot></slot>
    </div>
    
    <slot name="footer"></slot>
  </div>
</template>

<script>
import MobileHeader from './MobileHeader.vue';

export default {
  name: 'BaseViewLayout',
  components: {
    MobileHeader
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    hideHeader: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.base-view-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.mobile-page-container {
  flex: 1;
  padding: 0.75rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    max-width: 90%;
    padding: 1rem;
  }
  
  @media (min-width: 1024px) {
    max-width: 85%;
    padding: 1.5rem;
  }
}
</style>
