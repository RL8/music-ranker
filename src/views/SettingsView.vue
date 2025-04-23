<template>
  <BaseViewLayout title="Settings">
    <p class="mb-6">Spec: Settings page with tabs for different configuration sections</p>
    
    <!-- Settings Tabs - Different tabs for logged in vs logged out -->
    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button 
        @click="activeTab = 'standard'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'standard' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Standard Settings
      </button>
      <button 
        @click="activeTab = 'account'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'account' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Account
      </button>
      <button 
        @click="activeTab = 'privacy'" 
        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap"
        :class="activeTab === 'privacy' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Privacy
      </button>
    </div>
    
    <!-- Standard Settings Tab -->
    <div v-if="activeTab === 'standard'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Standard Settings</h2>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Theme</h3>
        <div class="flex space-x-4">
          <button class="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium">Light</button>
          <button class="bg-gray-800 border border-gray-800 rounded-md px-4 py-2 text-white font-medium">Dark</button>
          <button class="bg-gray-200 border border-gray-300 rounded-md px-4 py-2 text-gray-700 font-medium">System</button>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Display Options</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label for="showAlbumArt">Show album artwork</label>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="showAlbumArt" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label for="showAlbumArt" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <label for="compactView">Use compact view</label>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="compactView" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label for="compactView" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <label for="animateTransitions">Animate transitions</label>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="animateTransitions" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked/>
              <label for="animateTransitions" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Language</h3>
        <select class="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>
    </div>
    
    <!-- Account Settings Tab (Always visible) -->
    <div v-if="activeTab === 'account'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Account Settings</h2>
      <div v-if="userStore.isLoggedInSimulation">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input type="text" disabled value="user@example.com" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
          <p class="text-xs text-gray-500 mt-1">Contact support to change your email address</p>
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input type="text" value="swiftie123" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Data Management</h3>
          <div class="space-y-3">
            <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Export My Data
            </button>
            <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Change Password
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Delete Account
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <button @click="promptLogin" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Log in or Create Account to manage your account</button>
      </div>
    </div>
    
    <!-- Privacy Tab (Always visible) -->
    <div v-if="activeTab === 'privacy'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
      <h2 class="text-xl font-semibold mb-4">Privacy Settings</h2>
      <div v-if="userStore.isLoggedInSimulation">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Profile Visibility</h3>
              <p class="text-sm text-gray-500">Make your profile visible to other users</p>
            </div>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="profileToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked/>
              <label for="profileToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Ranking Visibility</h3>
              <p class="text-sm text-gray-500">Allow others to see your rankings</p>
            </div>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="rankingToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" checked/>
              <label for="rankingToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Data Collection</h3>
              <p class="text-sm text-gray-500">Allow anonymous usage data collection</p>
            </div>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="dataToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label for="dataToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Marketing Emails</h3>
              <p class="text-sm text-gray-500">Receive promotional emails</p>
            </div>
            <div class="relative inline-block w-10 mr-2 align-middle select-none">
              <input type="checkbox" id="emailToggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
              <label for="emailToggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <button @click="promptLogin" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Log in or Create Account to change privacy settings</button>
      </div>
    </div>
    
    <!-- Login Simulation Buttons (for testing) -->
    <div class="mt-8">
      <div v-if="!userStore.isLoggedInSimulation">
        <button 
          @click="userStore.setIsLoggedInSimulation(true)" 
          class="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Simulate Login
        </button>
      </div>
      <div v-else>
        <button 
          @click="userStore.setIsLoggedInSimulation(false)" 
          class="p-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
        >
          Simulate Logout
        </button>
      </div>
    </div>
  </BaseViewLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';
import BaseViewLayout from '@/components/ui/BaseViewLayout.vue';

// Active tab state
const activeTab = ref('standard');
const userStore = useUserStore();

function promptLogin() {
  alert('Please log in or create an account to use this feature.');
}
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
