<template>
  <div class="p-4">
    <MobileHeader title="Profile">
      <!-- Optional actions can be added here if needed -->
    </MobileHeader>
    
    <!-- Not Logged In View -->
    <div v-if="!userStore.isLoggedInSimulation" class="flex flex-col items-center justify-center py-10">
      <div class="w-24 h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
        <span class="text-gray-500 text-3xl">?</span>
      </div>
      <p class="text-lg font-medium mb-2 text-center">Please log in to view your profile</p>
      <p class="text-sm text-gray-600 mb-6 text-center">Create an account to rank albums, save your preferences, and share with friends</p>
      <MobileButton 
        @click="login" 
        variant="primary"
        :fullWidth="true"
        class="max-w-xs mb-3"
      >
        Log In
      </MobileButton>
      <MobileButton 
        @click="showToast('Sign Up', 'This would open the sign up form for new users.')"
        variant="text"
      >
        Don't have an account? Sign up
      </MobileButton>
    </div>
    
    <!-- Logged In View -->
    <div v-else>
      <!-- Profile Tabs -->
      <MobileTabs 
        v-model="activeTab" 
        :tabs="profileTabs" 
        class="mb-6 overflow-x-auto"
      />
      
      <!-- Profile Content - Info Tab -->
      <div v-if="activeTab === 'info'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <div class="flex items-center mb-4">
          <div 
            class="w-16 h-16 bg-gray-300 rounded-full mr-4 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors relative"
          >
            <span class="text-gray-500 text-xl">U</span>
            <div class="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div class="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded shadow-md">
              Upload Photo
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold">SwiftieUser13</h2>
            <p class="text-gray-600">swiftie@example.com</p>
          </div>
        </div>
        
        <MobileAlert
          v-if="showSuccessAlert"
          type="success"
          title="Profile Updated"
          message="Your profile information has been saved successfully."
          :dismissible="true"
          :auto-close="true"
          :duration="3000"
          v-model:show="showSuccessAlert"
        />
        
        <div class="border-t border-gray-200 pt-4 mt-4 space-y-4">
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <MobileInput 
              label="Username"
              type="text" 
              placeholder="Username" 
              v-model="username"
              help-text="Your unique username for your profile link"
            >
              <template #addon>
                <div class="text-xs text-green-600 bg-green-100 px-2 py-1">
                  Available
                </div>
              </template>
            </MobileInput>
          </div>
          
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <MobileInput 
              label="Email"
              type="email" 
              placeholder="email@example.com" 
              v-model="email"
              help-text="We'll never share your email with anyone else"
            />
          </div>
          
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <MobileInput 
              label="Display Name"
              type="text" 
              placeholder="Display Name" 
              v-model="displayName"
              help-text="This is how other users will see you"
            />
          </div>
          
          <div class="bg-white p-3 rounded-lg shadow-sm">
            <MobileTextarea
              label="Bio"
              placeholder="Tell us about yourself and your Taylor Swift journey"
              v-model="bio"
              :maxlength="150"
              help-text="Share your Swiftie journey (150 characters max)"
              :rows="3"
            />
          </div>
          
          <MobileButton 
            @click="saveProfileChanges"
            variant="primary"
            :fullWidth="true"
          >
            Save Changes
          </MobileButton>
        </div>
      </div>
      
      <!-- Profile Content - Link Preview Tab -->
      <div v-if="activeTab === 'link'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Link Preview</h2>
        <p class="text-sm text-gray-600 mb-4">This is how others will see your profile when you share your link</p>
        
        <MobileAlert
          v-if="showCopyAlert"
          type="success"
          message="Profile link copied to clipboard!"
          :auto-close="true"
          :duration="2000"
          v-model:show="showCopyAlert"
        />
        
        <div class="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h3 class="font-medium mb-2">Your Shareable Profile Link</h3>
          <div class="flex">
            <input 
              type="text" 
              value="swifties.io/profile/SwiftieUser13" 
              disabled 
              class="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline">
            <MobileButton 
              @click="copyProfileLink"
              variant="primary"
              class="rounded-l-none"
            >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </template>
              Copy
            </MobileButton>
          </div>
          <p class="text-xs text-gray-500 mt-1">Share this link with friends to show off your rankings</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="font-medium mb-2">Preview</h3>
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                <span class="text-gray-500 text-sm">U</span>
              </div>
              <div>
                <p class="font-medium">Taylor's #1 Fan</p>
                <p class="text-xs text-gray-500">@SwiftieUser13 · Swiftie since 2008</p>
              </div>
            </div>
            <p class="text-sm mb-1 italic text-gray-600">"Swiftie since 2008. Folklore is my therapy. Red (Taylor's Version) changed my life."</p>
            
            <div class="mt-3 border-t border-gray-200 pt-3">
              <h4 class="text-sm font-medium mb-2">Top Albums</h4>
              <div class="flex space-x-2 overflow-x-auto pb-2">
                <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-xs">
                  Red (TV)
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                  Folklore
                </div>
                <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xs">
                  1989
                </div>
              </div>
            </div>
            
            <div class="mt-3 border-t border-gray-200 pt-3">
              <h4 class="text-sm font-medium mb-2">Top Songs</h4>
              <div class="flex space-x-2 overflow-x-auto pb-2">
                <div class="flex-shrink-0 px-2 py-1 bg-red-100 rounded text-xs whitespace-nowrap">
                  All Too Well (10 min)
                </div>
                <div class="flex-shrink-0 px-2 py-1 bg-gray-100 rounded text-xs whitespace-nowrap">
                  cardigan
                </div>
                <div class="flex-shrink-0 px-2 py-1 bg-purple-100 rounded text-xs whitespace-nowrap">
                  Blank Space
                </div>
              </div>
            </div>
            
            <div class="mt-3 text-center">
              <button class="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                View Full Rankings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - Game Tab -->
      <div v-if="activeTab === 'game'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Swifties Game</h2>
        
        <MobileAlert
          type="warning"
          title="Beta Feature"
          message="The Swifties Game is currently in beta testing. Some features may not work as expected."
          :dismissible="true"
        />
        
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center">
          <div class="text-yellow-500 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-sm text-yellow-700">
            <span class="font-bold">Coming Soon!</span> Share a cryptic graphic of your favorite Taylor Swift songs and albums and let your friends guess! Earn points and compete!
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p class="text-lg mb-4">Test your knowledge of Taylor Swift songs!</p>
          <div 
            class="w-32 h-32 mx-auto bg-gray-200 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-red-400 via-purple-400 to-blue-400 opacity-30"></div>
            <div class="relative z-10 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span class="text-gray-700 font-medium">Swifties Quiz</span>
            </div>
          </div>
          <button 
            @click="startGame"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Start Game
          </button>
        </div>
        
        <div class="mt-4 bg-white rounded-lg p-4 border border-gray-200">
          <h3 class="font-medium mb-2">Your Stats</h3>
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">12</p>
              <p class="text-xs text-gray-500">Games Played</p>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">8</p>
              <p class="text-xs text-gray-500">High Score</p>
            </div>
            <div class="p-2 bg-gray-50 rounded">
              <p class="text-2xl font-bold">6</p>
              <p class="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>
          <div class="mt-3 text-center">
            <p class="text-sm text-gray-600">Complete your first game to unlock achievements!</p>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - History Tab -->
      <div v-if="activeTab === 'history'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Activity History</h2>
        <p class="text-sm text-gray-600 mb-4">View your past ranking sessions and activities</p>
        
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Ranked "Midnights" album</p>
                <p class="text-sm text-gray-500">2 days ago</p>
                <div class="mt-2 flex space-x-1">
                  <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-800">S</div>
                  <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs text-purple-800">A</div>
                  <div class="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-xs text-pink-800">B</div>
                </div>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">View</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Added "Anti-Hero" to Tier 1</p>
                <p class="text-sm text-gray-500">3 days ago</p>
                <div class="mt-2 flex">
                  <div class="px-2 py-1 bg-blue-100 rounded text-xs text-blue-800">
                    Tier 1
                  </div>
                </div>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">View</button>
            </div>
          </div>
          
          <div class="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium">Updated profile settings</p>
                <p class="text-sm text-gray-500">1 week ago</p>
                <div class="mt-2 text-xs text-gray-600">
                  Changed display name and bio
                </div>
              </div>
              <button class="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">View</button>
            </div>
          </div>
        </div>
        
        <div class="mt-4 border-t border-gray-200 pt-4">
          <div class="bg-gray-100 rounded-lg p-3 border border-gray-300 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-gray-200 to-transparent"></div>
            <div class="relative z-10">
              <p class="font-medium text-gray-700">View More History</p>
              <p class="text-sm text-gray-600 mb-2">Access your complete ranking history</p>
              <div class="mt-2 bg-yellow-100 rounded-full h-2 overflow-hidden">
                <div class="bg-yellow-400 h-full" style="width: 78%"></div>
              </div>
              <p class="text-xs text-right mt-1 text-yellow-700">1,550/1,989 spots filled</p>
              <div class="inline-block bg-yellow-100 text-xs px-2 py-1 rounded">
                Premium Feature
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Content - Premium Tab -->
      <div v-if="activeTab === 'premium'" class="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <h2 class="text-xl font-semibold mb-4">Premium Features</h2>
        
        <MobileAlert
          type="info"
          title="Premium Benefits"
          message="Upgrade to Premium to unlock exclusive features like unlimited rankings, advanced analytics, and ad-free experience."
        />
        
        <MobileSpacing size="small" />
        
        <MobileAlert
          type="error"
          title="Payment Processing Unavailable"
          message="Our payment system is currently undergoing maintenance. Please try again later."
          :dismissible="true"
        />
        
        <div class="bg-white rounded-lg p-6 border border-gray-200 text-center mb-4 relative overflow-hidden">
          <div class="absolute top-0 right-0">
            <div class="bg-yellow-400 text-yellow-800 transform rotate-45 translate-x-5 -translate-y-1 px-8 py-1 text-xs font-bold">
              SPECIAL OFFER
            </div>
          </div>
          
          <h3 class="text-lg font-bold mb-2">Upgrade to Premium</h3>
          <p class="mb-4">Unlock exclusive features and enhance your experience!</p>
          
          <ul class="text-left mb-6 space-y-2">
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> 
              <span>Advanced visualization options</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> 
              <span>Unlimited ranking sessions</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> 
              <span>Ad-free experience</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> 
              <span>Early access to new features</span>
            </li>
            <li class="flex items-center">
              <span class="text-green-500 mr-2">✓</span> 
              <span>Complete ranking history</span>
            </li>
          </ul>
          
          <div class="mb-6 bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">Annual Subscription</span>
              <span class="font-bold text-lg">$19.89</span>
            </div>
            <p class="text-sm text-gray-600">Billed annually</p>
          </div>
          
          <div class="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">Join Club 1989</span>
              <span class="font-bold text-lg">$13.13</span>
            </div>
            <p class="text-sm text-yellow-700">Limited offer: Lifetime subscription for the first 1,989 users!</p>
            <div class="mt-2 bg-yellow-100 rounded-full h-2 overflow-hidden">
              <div class="bg-yellow-400 h-full" style="width: 78%"></div>
            </div>
            <p class="text-xs text-right mt-1 text-yellow-700">1,550/1,989 spots filled</p>
          </div>
          
          <button 
            @click="subscribeToPremium"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Subscribe Now
          </button>
        </div>
        
        <div class="bg-gray-100 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600">Current Status: <span class="font-medium">Free Plan</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';
import MobileHeader from '@/components/ui/MobileHeader.vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import MobileInput from '@/components/ui/MobileInput.vue';
import MobileTextarea from '@/components/ui/MobileTextarea.vue';
import MobileTabs from '@/components/ui/MobileTabs.vue';
import MobileAlert from '@/components/ui/MobileAlert.vue';
import MobileSpacing from '@/components/ui/MobileSpacing.vue';
import toastService from '@/services/toastService';

// Active tab state
const activeTab = ref('info');
const userStore = useUserStore();

// Alert state
const showSuccessAlert = ref(false);
const showCopyAlert = ref(false);

// Tab configuration
const profileTabs = [
  { id: 'info', label: 'Profile Information' },
  { id: 'link', label: 'Link Preview' },
  { id: 'game', label: 'Game' },
  { id: 'history', label: 'History' },
  { id: 'premium', label: 'Premium' }
];

// Form data
const username = ref('SwiftieUser13');
const email = ref('swiftie@example.com');
const displayName = ref('Taylor\'s #1 Fan');
const bio = ref('Swiftie since 2008. Folklore is my therapy. Red (Taylor\'s Version) changed my life.');

// Show toast notification (used sparingly for confirmations only)
const showToast = (title, message, type = 'info') => {
  switch (type) {
    case 'success':
      toastService.success(title, message);
      break;
    case 'error':
      toastService.error(title, message);
      break;
    case 'warning':
      toastService.warning(title, message);
      break;
    default:
      toastService.info(title, message);
  }
};

// Login function
const login = () => {
  userStore.setIsLoggedInSimulation(true);
  showToast('Logged In', 'You are now logged in and can access your profile information.', 'success');
};

// Save profile changes
const saveProfileChanges = () => {
  showToast('Profile Updated', 'Your profile information has been successfully updated.', 'success');
  showSuccessAlert.value = true;
};

// Copy profile link
const copyProfileLink = () => {
  showToast('Link Copied', 'Your profile link has been copied to clipboard.', 'success');
  showCopyAlert.value = true;
};

// Start game
const startGame = () => {
  showToast('Game Starting', 'The Taylor Swift knowledge game would start here.', 'info');
};

// Subscribe to premium
const subscribeToPremium = () => {
  showToast('Premium Subscription', 'This would initiate the premium subscription process.', 'info');
};
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>
