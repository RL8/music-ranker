<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" exact>
      <i class="nav-icon home-icon"></i>
      <span class="nav-label">Home</span>
    </router-link>
    <router-link to="/visualizations/taylor-swift" class="nav-item">
      <i class="nav-icon albums-icon"></i>
      <span class="nav-label">Albums</span>
    </router-link>
    <router-link to="/visualizations/sunburst" class="nav-item">
      <i class="nav-icon viz-icon"></i>
      <span class="nav-label">Viz</span>
    </router-link>
    <router-link to="/about" class="nav-item">
      <i class="nav-icon about-icon"></i>
      <span class="nav-label">About</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomNavigation'
}
</script>

<style lang="scss" scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 90;
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    text-decoration: none;
    color: #999;
    transition: color 0.2s ease;
    
    &.router-link-active {
      color: #42b983;
    }
  }
  
  .nav-icon {
    display: block;
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
  
  .home-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'/%3E%3C/svg%3E");
  }
  
  .albums-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E");
  }
  
  .viz-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'/%3E%3C/svg%3E");
  }
  
  .about-icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
  }
  
  .nav-label {
    font-size: 0.7rem;
    font-weight: 500;
  }
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none; // Hide on larger screens
  }
}
</style>
