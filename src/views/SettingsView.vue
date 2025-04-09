<template>
  <div class="p-4 pb-20">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>
    <p class="mb-6">Spec: Settings page with tabs for different configuration sections</p>
    
    <!-- Settings Tabs -->
    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        @click="activeTab = 'account'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'account' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Account
      </button>
      <button 
        @click="activeTab = 'preferences'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'preferences' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Preferences
      </button>
      <button 
        @click="activeTab = 'notifications'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'notifications' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Notifications
      </button>
      <button 
        @click="activeTab = 'about'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'about' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        About
      </button>
    </div>
    
    <!-- Account Settings Tab -->
    <div v-if="activeTab === 'account'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Account Settings</h2>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input type="text" disabled value="user@example.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Username
        </label>
        <input type="text" disabled value="swiftie123" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      
      <div class="flex items-center justify-between mt-6">
        <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Change Password
        </button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Delete Account
        </button>
      </div>
    </div>
    
    <!-- Preferences Tab -->
    <div v-if="activeTab === 'preferences'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Preferences</h2>
      
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">Theme</h3>
        <div class="flex space-x-4">
          <button class="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium">Light</button>
          <button class="bg-gray-800 border border-gray-800 rounded-md px-4 py-2 text-white font-medium">Dark</button>
          <button class="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium">System</button>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">Display Options</h3>
        <div class="space-y-2">
          <div class="flex items-center">
            <input type="checkbox" id="showAlbumArt" class="mr-2">
            <label for="showAlbumArt">Show album artwork</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="compactView" class="mr-2">
            <label for="compactView">Use compact view</label>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="animateTransitions" class="mr-2" checked>
            <label for="animateTransitions">Animate transitions</label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Notification Settings</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Email Notifications</h3>
            <p class="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <div class="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="emailToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label for="emailToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">Push Notifications</h3>
            <p class="text-sm text-gray-500">Receive in-app notifications</p>
          </div>
          <div class="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="pushToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked/>
            <label for="pushToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium">New Release Alerts</h3>
            <p class="text-sm text-gray-500">Get notified about new music</p>
          </div>
          <div class="relative inline-block w-10 mr-2 align-middle select-none">
            <input type="checkbox" id="releaseToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked/>
            <label for="releaseToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- About Tab -->
    <div v-if="activeTab === 'about'" class="border border-gray-300 rounded p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">About Swifties.io</h2>
      
      <div class="mb-4">
        <p class="mb-2">Version: 1.0.0 (Beta)</p>
        <p class="mb-4">A music ranking application for Taylor Swift fans.</p>
        
        <h3 class="text-lg font-medium mb-2">Credits</h3>
        <p class="mb-4">Developed by the Swifties.io Team</p>
        
        <h3 class="text-lg font-medium mb-2">Legal</h3>
        <div class="space-y-2">
          <button class="text-green-600 hover:underline">Terms of Service</button>
          <br>
          <button class="text-green-600 hover:underline">Privacy Policy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Active tab state
const activeTab = ref('account');
</script>

<style scoped>
/* Toggle switch styling */
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
.toggle-label {
  transition: background-color 0.2s ease;
}
</style>
