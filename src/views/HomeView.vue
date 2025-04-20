<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Taylor Swift Discography 
      <button 
        @click="showToast('Information', 'This visualization shows Taylor Swift\'s complete discography organized by albums and songs.')"
        class="inline-flex items-center justify-center ml-1 text-gray-500 hover:text-green-600 transition-colors">
        <i class="info-icon w-5 h-5 bg-center bg-no-repeat bg-contain"></i>
      </button>
    </h1>
    
    <!-- Sunburst Chart Area with Swipe Indicators -->
    <div class="border p-4 my-6 min-h-[350px] flex items-center justify-center bg-gray-100 rounded-lg shadow-sm relative">
      <!-- Sunburst Visualization -->
      <div class="text-center">
        <div 
          @click="showToast('Sunburst Interaction', 'In the full app, you would be able to click on sections to drill down into albums and songs.')"
          class="w-48 h-48 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mb-4 relative cursor-pointer">
          <div class="absolute inset-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
            <div class="absolute inset-4 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 flex items-center justify-center">
              <div class="absolute inset-3 rounded-full bg-white flex items-center justify-center">
                <span class="text-gray-800 font-bold text-sm">Taylor Swift</span>
              </div>
            </div>
          </div>
        </div>
        <p class="text-gray-600 font-medium">Interactive Sunburst Visualization</p>
        <p class="text-sm text-gray-500 mt-2">Swipe to explore different views</p>
        
        <!-- Pagination Dots -->
        <div class="flex justify-center mt-4 space-x-2">
          <div 
            @click="showToast('View Selection', 'This would switch to the first visualization view.')"
            class="w-2 h-2 rounded-full bg-green-600 cursor-pointer"></div>
          <div 
            @click="showToast('View Selection', 'This would switch to the second visualization view.')"
            class="w-2 h-2 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"></div>
          <div 
            @click="showToast('View Selection', 'This would switch to the third visualization view.')"
            class="w-2 h-2 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition-colors"></div>
        </div>
      </div>
      
      <!-- Swipe Indicators -->
      <div 
        @click="showToast('Previous View', 'This would show the previous visualization view.')"
        class="absolute left-2 inset-y-0 flex items-center opacity-50 cursor-pointer hover:opacity-75 transition-opacity">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-600">←</span>
        </div>
      </div>
      <div 
        @click="showToast('Next View', 'This would show the next visualization view.')"
        class="absolute right-2 inset-y-0 flex items-center opacity-50 cursor-pointer hover:opacity-75 transition-opacity">
        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span class="text-gray-600">→</span>
        </div>
      </div>
    </div>
    
    <!-- CTA Buttons -->
    <div class="mt-10 flex flex-col items-center">
      <router-link 
        to="/rank/eras"
        class="w-full max-w-xs p-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-md active:scale-95 transform duration-150 text-center mb-3"
      >
        Create Your Own Album Rankings
      </router-link>
      
      <button 
        @click="login"
        class="mt-4 text-green-600 font-medium hover:underline">
        Already have an account? Log in
      </button>
    </div>
  </div>
</template>

<script>
import { useMusicStore } from '@/store'
import { useUserStore } from '@/store/userStore'
import toastService from '@/services/toastService'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const musicStore = useMusicStore()
    const userStore = useUserStore()
    const router = useRouter()
    
    const showToast = (title, message) => {
      toastService.show({
        title,
        message,
        duration: 3000
      });
    };
    
    const login = () => {
      userStore.setIsLoggedInSimulation(true);
      showToast('Logged In', 'You are now logged in and will be redirected to your dashboard.');
      // Redirect to dashboard after login
      setTimeout(() => {
        router.push('/music');
      }, 1500);
    };
    
    return { 
      musicStore, 
      userStore,
      showToast,
      login
    }
  }
}
</script>

<style scoped>
/* Add subtle animation to the sunburst */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.rounded-full {
  animation: pulse 4s infinite ease-in-out;
}

.info-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}
</style>
