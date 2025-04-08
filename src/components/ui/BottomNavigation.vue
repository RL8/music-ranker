<template>
  <nav class="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] h-14 z-50">
    <router-link to="/music" class="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-green-600 transition-colors duration-200" :class="{ 'text-green-600': $route.path.startsWith('/music') }">
      <i class="music-icon w-6 h-6 mb-1 bg-center bg-no-repeat bg-contain"></i>
      <span class="text-xs font-medium">Music</span>
    </router-link>
    <router-link to="/profile" class="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-green-600 transition-colors duration-200" :class="{ 'text-green-600': $route.path.startsWith('/profile') }">
      <i class="profile-icon w-6 h-6 mb-1 bg-center bg-no-repeat bg-contain"></i>
      <span class="text-xs font-medium">Profile</span>
    </router-link>
    <router-link to="/settings" class="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-green-600 transition-colors duration-200" :class="{ 'text-green-600': $route.path.startsWith('/settings') }">
      <i class="settings-icon w-6 h-6 mb-1 bg-center bg-no-repeat bg-contain"></i>
      <span class="text-xs font-medium">Settings</span>
    </router-link>
    <router-link to="/about" class="flex flex-col items-center justify-center flex-1 h-full text-gray-500 hover:text-green-600 transition-colors duration-200" :class="{ 'text-green-600': $route.path === '/about' }">
      <i class="about-icon w-6 h-6 mb-1 bg-center bg-no-repeat bg-contain"></i>
      <span class="text-xs font-medium">About</span>
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'BottomNavigation'
}
</script>

<style>
/* SVG icons as background images */
.music-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
}

.profile-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
}

.settings-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z'/%3E%3C/svg%3E");
}

.about-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}

/* Hide on larger screens */
@media (min-width: 768px) {
  nav {
    @apply hidden;
  }
}
</style>
