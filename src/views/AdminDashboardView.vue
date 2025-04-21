<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 pl-10 md:pl-0">Admin Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Admin Navigation Cards -->
      <div v-for="(item, index) in adminLinks" :key="index" 
           class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <router-link :to="item.path" class="block">
          <div class="p-5">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i :class="item.icon" class="w-6 h-6 bg-center bg-no-repeat bg-contain"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ item.title }}</h3>
            </div>
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
          <div class="bg-gray-50 px-5 py-3 border-t border-gray-100">
            <span class="text-green-600 text-sm font-medium flex items-center">
              Access
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </router-link>
      </div>
    </div>
    
    <!-- Admin Stats Summary -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">System Status</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4 bg-green-50">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Database Connection</p>
              <p class="font-semibold text-gray-800">Connected</p>
            </div>
          </div>
        </div>
        <div class="border rounded-lg p-4 bg-blue-50">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Environment</p>
              <p class="font-semibold text-gray-800">Development</p>
            </div>
          </div>
        </div>
        <div class="border rounded-lg p-4 bg-purple-50">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">API Status</p>
              <p class="font-semibold text-gray-800">Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();

// Admin links with descriptions
const adminLinks = [
  {
    title: 'Disco Overview',
    path: '/admin/disco-overview',
    description: 'Manage discography data and metadata',
    icon: 'music-icon'
  },
  {
    title: 'Database Diagnostic',
    path: '/admin/database-diagnostic',
    description: 'Check database connection status and performance',
    icon: 'database-icon'
  },
  {
    title: 'Database Test',
    path: '/admin/database-test',
    description: 'Test database queries and operations',
    icon: 'database-icon'
  },
  {
    title: 'Edition Browser',
    path: '/admin/edition-browser',
    description: 'Browse and manage album editions',
    icon: 'album-icon'
  },
  {
    title: 'Environment Checker',
    path: '/admin/env-checker',
    description: 'Verify environment variables and configuration',
    icon: 'settings-icon'
  },
  {
    title: 'Musical Eras',
    path: '/admin/eras',
    description: 'Manage musical eras and their metadata',
    icon: 'music-icon'
  },
  {
    title: 'Hybrid Songs',
    path: '/admin/hybrid-songs',
    description: 'Compare song data across different sources',
    icon: 'song-icon'
  },
  {
    title: 'Image Diagnostic',
    path: '/admin/image-diagnostic',
    description: 'Test image loading and optimization',
    icon: 'settings-icon'
  },
  {
    title: 'Simple DB View',
    path: '/admin/simple-db',
    description: 'Basic database record viewer',
    icon: 'database-icon'
  }
];

// Check if user has admin privileges
if (!userStore.isAdmin) {
  // Redirect non-admin users or show access denied message
  // This is handled by router navigation guards
}
</script>

<style scoped>
/* SVG icons as background images - using the same styles from Sidebar.vue */
.music-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.database-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' /%3E%3C/svg%3E");
}

.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' /%3E%3C/svg%3E");
}

.settings-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}
</style>
