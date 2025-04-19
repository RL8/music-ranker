<template>
  <div class="about max-w-lg mx-auto p-2">
    <!-- Tab Navigation -->
    <nav class="flex border-b border-gray-200 mb-4 sticky top-0 bg-white z-10">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex-1 px-2 py-3 text-sm font-medium text-center focus:outline-none transition-colors"
        :class="activeTab === tab.key ? 'border-b-2 border-green-500 text-green-600 bg-gray-50' : 'text-gray-500 bg-white'"
      >
        <span v-if="tab.icon" :class="tab.icon + ' mr-1 text-lg align-middle'" />{{ tab.label }}
      </button>
    </nav>

    <!-- About Us Tab -->
    <div v-if="activeTab === 'about'" class="rounded-lg p-4 bg-gray-50 mb-4 shadow-sm">
      <h2 class="text-xl font-semibold mb-2 text-green-700">Welcome to Swifties.io!</h2>
      <p class="mb-4 text-gray-700">Swifties.io is a fan-powered music ranking app that helps you discover, rank, and share your favorite Taylor Swift songs and albums. Our mission is to create a fun and interactive platform for Swifties everywhere to connect and celebrate their love for Taylor's music!</p>
      <ul class="list-disc ml-5 mb-4 text-gray-600">
        <li>Discover new music and rare editions</li>
        <li>Rank and comment on your favorite tracks</li>
        <li>Connect with fellow fans</li>
        <li>Share your rankings on social media</li>
      </ul>
      <div class="text-xs text-gray-400 text-center">Version 1.0.0 (Beta)</div>
    </div>

    <!-- Roadmap Tab -->
    <div v-if="activeTab === 'roadmap'" class="rounded-lg p-4 bg-gray-50 mb-4 shadow-sm">
      <h2 class="text-xl font-semibold mb-2 text-green-700">Our Roadmap 🚀</h2>
      <p class="mb-3 text-gray-700">We're building Swifties.io together! Here’s what’s coming soon. Your feedback shapes our journey—suggest a feature anytime!</p>
      <ul class="divide-y divide-gray-200">
        <li class="py-3 flex items-center">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3"><span class="text-green-600">🎤</span></span>
          <div>
            <div class="font-medium text-gray-800">Support for More Artists</div>
            <div class="text-xs text-gray-500">Soon you’ll be able to rank songs from artists beyond Taylor Swift!</div>
            <span class="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mt-1">Planned</span>
          </div>
        </li>
        <li class="py-3 flex items-center">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3"><span class="text-blue-600">📱</span></span>
          <div>
            <div class="font-medium text-gray-800">Share Rankings to Social</div>
            <div class="text-xs text-gray-500">Easily share your rankings with friends on Instagram, Twitter, and more.</div>
            <span class="inline-block text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1">In Progress</span>
          </div>
        </li>
        <li class="py-3 flex items-center">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3"><span class="text-purple-600">💬</span></span>
          <div>
            <div class="font-medium text-gray-800">Fan Community & Comments</div>
            <div class="text-xs text-gray-500">Join discussions, leave comments, and connect with other fans.</div>
            <span class="inline-block text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mt-1">Coming Soon</span>
          </div>
        </li>
        <li class="py-3 flex items-center">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mr-3"><span class="text-pink-600">🎨</span></span>
          <div>
            <div class="font-medium text-gray-800">Customizable Themes</div>
            <div class="text-xs text-gray-500">Personalize the app to match your style and era!</div>
            <span class="inline-block text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded mt-1">Idea</span>
          </div>
        </li>
      </ul>
      <div class="mt-4 text-center text-sm text-gray-600">Want to help shape the future? <span class="text-green-600 font-semibold">Send us your suggestions in the Feedback tab!</span></div>
    </div>

    <!-- Feedback Tab -->
    <div v-if="activeTab === 'feedback'" class="rounded-lg p-4 bg-gray-50 mb-4 shadow-sm">
      <h2 class="text-xl font-semibold mb-4 text-green-700">Send Feedback</h2>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Your Feedback</label>
        <textarea v-model="feedback" rows="4" class="w-full border rounded p-2 mb-2" placeholder="Share your ideas, bugs, or love letter to Taylor..."></textarea>
        <button @click="handleFeedback" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Submit</button>
      </div>
      <div v-if="feedbackMessage" class="text-green-600 font-medium mt-2">{{ feedbackMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/userStore';
const userStore = useUserStore();
const tabs = [
  { key: 'about', label: 'About Us', icon: 'i-about' },
  { key: 'roadmap', label: 'Roadmap', icon: 'i-roadmap' },
  { key: 'feedback', label: 'Feedback', icon: 'i-feedback' }
];
const activeTab = ref('about');
const feedback = ref('');
const feedbackMessage = ref('');
function handleFeedback() {
  if (!userStore || typeof userStore.isLoggedInSimulation === 'undefined' || userStore.isLoggedInSimulation === null) {
    alert('Please log in or create an account to send feedback.');
    return;
  }
  if (!userStore.isLoggedInSimulation) {
    alert('Please log in or create an account to send feedback.');
    return;
  }
  // Placeholder for feedback submission logic
  feedbackMessage.value = 'Thank you for your feedback!';
  feedback.value = '';
}
</script>

<style scoped>
.about ul {
  list-style-type: disc;
}
nav {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  border-radius: 0 0 12px 12px;
}
button[aria-current], button.active {
  font-weight: 600;
}
@media (max-width: 600px) {
  .about {
    padding: 0.5rem;
  }
  nav button {
    font-size: 1rem;
    padding: 0.75rem 0.5rem;
  }
  .rounded-lg {
    border-radius: 10px;
  }
}
</style>
