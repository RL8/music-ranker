<template>
  <div id="app">
    <!-- Fixed Header -->
    <header class="app-header">
      <div class="header-content">
        <h1 class="app-title">Music Ranker</h1>
        <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
          <span class="menu-icon"></span>
        </button>
      </div>
      <!-- Mobile Navigation Menu -->
      <nav class="mobile-nav" :class="{ 'is-open': menuOpen }">
        <router-link to="/" @click.native="closeMenu">Home</router-link>
        <router-link to="/about" @click.native="closeMenu">About</router-link>
        <router-link to="/admin/taylor-swift" @click.native="closeMenu">Taylor Swift Data</router-link>
        <router-link to="/visualizations/sunburst" @click.native="closeMenu">Sunburst Visualization</router-link>
        <router-link to="/visualizations/taylor-swift" @click.native="closeMenu">Taylor Swift Albums</router-link>
      </nav>
    </header>
    
    <!-- Main Content Area (Scrollable) -->
    <pull-to-refresh 
      v-if="supportsPullToRefresh"
      class="app-content" 
      :class="{ 'has-bottom-nav': isMobileView }"
      @refresh="handleRefresh"
    >
      <router-view/>
    </pull-to-refresh>
    
    <main v-else class="app-content" :class="{ 'has-bottom-nav': isMobileView }">
      <router-view/>
    </main>
    
    <!-- Fixed Footer (Hidden on Mobile) -->
    <footer class="app-footer" :class="{ 'hidden-mobile': isMobileView }">
      <div class="footer-content">
        <p>&copy; 2025 Music Ranker</p>
      </div>
    </footer>
    
    <!-- Bottom Navigation (Mobile Only) -->
    <bottom-navigation v-if="isMobileView" />
    
    <!-- Offline Status Indicator -->
    <offline-status />
  </div>
</template>

<script>
import BottomNavigation from './components/ui/BottomNavigation.vue';
import OfflineStatus from './components/ui/OfflineStatus.vue';
import PullToRefresh from './components/ui/PullToRefresh.vue';

export default {
  components: {
    BottomNavigation,
    OfflineStatus,
    PullToRefresh
  },
  data() {
    return {
      menuOpen: false,
      isMobileView: false,
      windowWidth: 0,
      supportsPullToRefresh: false
    }
  },
  created() {
    window.addEventListener('resize', this.checkScreenSize);
    this.checkScreenSize();
  },
  mounted() {
    // Check if device supports touch events for pull-to-refresh
    this.supportsPullToRefresh = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      // Prevent body scrolling when menu is open
      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    },
    closeMenu() {
      this.menuOpen = false;
      document.body.style.overflow = '';
    },
    checkScreenSize() {
      this.windowWidth = window.innerWidth;
      this.isMobileView = this.windowWidth < 768;
    },
    handleRefresh(completeCallback) {
      // Reload current route data
      const currentRoute = this.$router.currentRoute;
      
      // If the current component has a refresh method, call it
      const currentComponent = this.$router.app.$children[0].$children[0];
      
      if (currentComponent && typeof currentComponent.refresh === 'function') {
        // Component has a refresh method
        Promise.resolve(currentComponent.refresh())
          .then(() => {
            completeCallback();
          })
          .catch(() => {
            completeCallback();
          });
      } else {
        // No refresh method, just reload the route
        this.$router.replace({
          name: currentRoute.name,
          params: { ...currentRoute.params },
          query: { ...currentRoute.query, _t: Date.now() }
        }).finally(() => {
          setTimeout(completeCallback, 500);
        });
      }
    }
  }
}
</script>

<style lang="scss">
// Reset and base styles
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden; // Prevent double scrollbars
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

// Main app container
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

// Fixed header
.app-header {
  flex: 0 0 auto;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
    margin: 0;
  }
}

// Mobile menu toggle button
.menu-toggle {
  display: block;
  background: none;
  border: none;
  width: 2rem;
  height: 2rem;
  position: relative;
  cursor: pointer;
  
  .menu-icon {
    display: block;
    position: relative;
    
    &, &:before, &:after {
      width: 100%;
      height: 2px;
      background-color: #2c3e50;
      transition: all 0.3s ease;
    }
    
    &:before, &:after {
      content: '';
      position: absolute;
      left: 0;
    }
    
    &:before {
      top: -8px;
    }
    
    &:after {
      bottom: -8px;
    }
  }
}

// Mobile navigation
.mobile-nav {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.is-open {
    max-height: 100vh;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  a {
    display: block;
    padding: 1rem;
    text-decoration: none;
    color: #2c3e50;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

// Main content area (scrollable)
.app-content {
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // Smooth scrolling on iOS
  padding: 1rem;
  
  &.has-bottom-nav {
    padding-bottom: calc(1rem + 56px); // Add space for bottom nav
  }
}

// Fixed footer
.app-footer {
  flex: 0 0 auto;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 1rem;
  text-align: center;
  font-size: 0.875rem;
  
  &.hidden-mobile {
    display: none;
  }
}

// Active state for touch elements
.touch-active {
  background-color: rgba(0, 0, 0, 0.05);
}

// Media queries for larger screens
@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  
  .mobile-nav {
    max-height: none;
    flex-direction: row;
    justify-content: center;
    padding: 0.5rem 0;
    
    a {
      border-bottom: none;
      padding: 0.5rem 1rem;
    }
  }
  
  .app-footer.hidden-mobile {
    display: block;
  }
}
</style>
