<template>
  <div class="mobile-page-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MobilePageContainer'
}
</script>

<style lang="scss" scoped>
.mobile-page-container {
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    max-width: 768px;
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    max-width: 1024px;
    padding: 2rem;
  }
}
</style>
