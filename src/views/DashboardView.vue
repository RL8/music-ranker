<template>
  <MobilePageContainer>
    <MobileHeader>
      <template #title>
        Welcome to your Swiftie Universe, <span class="text-green-600">{{ userStore.user?.username || 'Swiftie' }}</span>!
      </template>
    </MobileHeader>
    
    <!-- View Toggle Buttons -->
    <div class="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <MobileButton 
        @click="activeView = 'visualizations'"
        :variant="activeView === 'visualizations' ? 'primary' : 'outline'"
        :fullWidth="true"
        size="medium"
      >
        Visualizations
      </MobileButton>
      <MobileButton 
        @click="activeView = 'rankings'"
        :variant="activeView === 'rankings' ? 'primary' : 'outline'"
        :fullWidth="true"
        size="medium"
      >
        Rankings
      </MobileButton>
    </div>
    
    <MobileSpacing size="medium" />
    
    <!-- Visualizations View -->
    <div v-if="activeView === 'visualizations'">
      <!-- Sunburst Type Toggle -->
      <div class="flex space-x-2">
        <MobileButton 
          @click="activeSunburst = 'era'"
          :variant="activeSunburst === 'era' ? 'primary' : 'secondary'"
          size="small"
        >
          Era
        </MobileButton>
        <MobileButton 
          @click="activeSunburst = 'time'"
          :variant="activeSunburst === 'time' ? 'primary' : 'secondary'"
          size="small"
        >
          Time Period
        </MobileButton>
        <MobileButton 
          @click="activeSunburst = 'overview'"
          :variant="activeSunburst === 'overview' ? 'primary' : 'secondary'"
          size="small"
        >
          Overview
        </MobileButton>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-between">
      <router-link 
        to="/rank/albums"
        class="router-link"
      >
        <MobileButton variant="secondary">
          <template #icon>
            <i class="edit-icon w-4 h-4 bg-center bg-no-repeat bg-contain"></i>
          </template>
          Edit Rankings
        </MobileButton>
      </router-link>
      <div class="relative">
        <MobileButton 
          @click="showShareModal = true"
          variant="secondary"
        >
          <template #icon>
            <i class="share-icon w-4 h-4 bg-center bg-no-repeat bg-contain"></i>
          </template>
          Share
        </MobileButton>
        
        <!-- Share Modal -->
        <ShareModal v-model="showShareModal" />
      </div>
    </div>
  </MobilePageContainer>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue';
import { useUserStore } from '@/store/userStore';
import { useRankingStore } from '@/store/rankingStore';
import toastService from '@/services/toastService';
import alertService from '@/services/alertService';
import modalService from '@/services/modalService';
import MobileHeader from '@/components/ui/MobileHeader.vue';
import MobileButton from '@/components/ui/MobileButton.vue';
import MobileSection from '@/components/ui/MobileSection.vue';
import MobilePageContainer from '@/components/ui/MobilePageContainer.vue';
import MobileSpacing from '@/components/ui/MobileSpacing.vue';
import SunburstChart from '@/components/visualizations/SunburstChart.vue';
import staticAlbumsData from '@/data/static-albums.json';
import ShareModal from '@/components/modals/ShareModal.vue';
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue';

// Store setup
const userStore = useUserStore();
const rankingStore = useRankingStore();
const toast = toastService;

// UI state
const activeView = ref('visualizations');
const activeSunburst = ref('overview');
const showShareMenu = ref(false);
const showShareModal = ref(false);

// Check if user has any rankings
const hasRankings = computed(() => {
  return Object.values(rankingStore.rankedTiers).some(tier => tier.length > 0);
});

// Toggle share menu
function toggleShareMenu() {
  showShareMenu.value = !showShareMenu.value;
}

// Show toast notification
function showToast(title, message, type = 'info') {
  switch (type) {
    case 'success':
      toast.success(title, message);
      break;
    case 'error':
      toast.error(title, message);
      break;
    case 'warning':
      toast.warning(title, message);
      break;
    default:
      toast.info(title, message);
  }
}

// Download visualization as PNG
function downloadAsPNG() {
  showToast('Download Started', 'Your visualization is being prepared for download.', 'info');
  // This would be implemented with actual export functionality
}

// Share as animation
function shareAsAnimation() {
  showToast('Share Animation', 'Preparing animation for sharing...', 'info');
  // This would be implemented with actual sharing functionality
}

// Share profile link
function shareProfileLink() {
  showToast('Link Copied', 'Your profile link has been copied to clipboard.', 'success');
  // This would be implemented with actual clipboard functionality
}

// Toggle login/logout
function toggleLogin(status) {
  if (!status) {
    // If logging out, show confirmation modal
    showLogoutConfirmation();
  } else {
    // If logging in, just do it
    userStore.setIsLoggedInSimulation(status);
    showToast(
      'Logged In', 
      'You are now logged in.',
      'success'
    );
  }
}

// Show logout confirmation
function showLogoutConfirmation() {
  modalService.show({
    component: markRaw(ConfirmationModal),
    props: {
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out? Any unsaved rankings will be lost.',
      confirmText: 'Logout',
      confirmVariant: 'danger',
      onConfirm: () => {
        userStore.setIsLoggedInSimulation(false);
        showToast('Logged Out', 'You have been logged out.', 'info');
      }
    }
  });
}

// Helper functions for tier display
function getTierLabel(tierName) {
  const labels = {
    tier1: 'S',
    tier2: 'A',
    tier3: 'B',
    tier4: 'C',
    tier5: 'D'
  };
  return labels[tierName] || '';
}

function getTierName(tierName) {
  const names = {
    tier1: 'Tier 1 (Top)',
    tier2: 'Tier 2',
    tier3: 'Tier 3',
    tier4: 'Tier 4',
    tier5: 'Tier 5'
  };
  return names[tierName] || '';
}

function getTierColor(tierName) {
  const colors = {
    tier1: '#ef4444', // Red
    tier2: '#3b82f6', // Blue
    tier3: '#f59e0b', // Yellow
    tier4: '#10b981', // Green
    tier5: '#8b5cf6'  // Purple
  };
  return colors[tierName] || '#6b7280'; // Gray default
}

// Sunburst data transformations
const overviewSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  const children = [];
  
  // Add each tier as a node
  Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
    if (albums.length > 0) {
      children.push({
        name: getTierName(tierName),
        color: getTierColor(tierName),
        children: albums.map((album, index) => ({
          name: album.title,
          size: tierName === 'tier1' ? 10 : 
                tierName === 'tier2' ? 8 : 
                tierName === 'tier3' ? 6 : 
                tierName === 'tier4' ? 4 : 2,
          color: album.color
        }))
      });
    }
  });
  
  return {
    name: "My Album Rankings",
    children
  };
});

const eraSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  // Group albums by era (simplified for this example)
  const eraGroups = {
    "Country Era": ["album-ts"],
    "Pop Transition": ["album-fearless", "album-speaknow", "album-red"],
    "Pure Pop Era": ["album-1989", "album-reputation", "album-lover"],
    "Folk Era": ["album-folklore", "album-evermore"],
    "Recent Era": ["album-midnights", "album-tortured"]
  };
  
  const children = [];
  
  // Create era nodes with their albums
  Object.entries(eraGroups).forEach(([eraName, albumIds]) => {
    const eraAlbums = [];
    
    // Find ranked albums in this era
    Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
      albums.forEach(album => {
        if (albumIds.includes(album.id)) {
          eraAlbums.push({
            name: album.title,
            size: tierName === 'tier1' ? 10 : 
                  tierName === 'tier2' ? 8 : 
                  tierName === 'tier3' ? 6 : 
                  tierName === 'tier4' ? 4 : 2,
            color: album.color,
            tierName: getTierName(tierName)
          });
        }
      });
    });
    
    // Only add era if it has ranked albums
    if (eraAlbums.length > 0) {
      children.push({
        name: eraName,
        children: eraAlbums
      });
    }
  });
  
  return {
    name: "Albums by Era",
    children
  };
});

const timeSunburstData = computed(() => {
  if (!hasRankings.value) return { name: "No Rankings", children: [] };
  
  // Group albums by time period
  const timeGroups = {
    "2006-2010": [2006, 2007, 2008, 2009, 2010],
    "2011-2015": [2011, 2012, 2013, 2014, 2015],
    "2016-2020": [2016, 2017, 2018, 2019, 2020],
    "2021-2025": [2021, 2022, 2023, 2024, 2025]
  };
  
  const children = [];
  
  // Create time period nodes with their albums
  Object.entries(timeGroups).forEach(([periodName, years]) => {
    const periodAlbums = [];
    
    // Find all albums in this time period
    const albumsInPeriod = staticAlbumsData.filter(album => years.includes(album.year));
    const albumIdsInPeriod = albumsInPeriod.map(album => album.id);
    
    // Find ranked albums in this period
    Object.entries(rankingStore.rankedTiers).forEach(([tierName, albums]) => {
      albums.forEach(album => {
        if (albumIdsInPeriod.includes(album.id)) {
          periodAlbums.push({
            name: album.title,
            size: tierName === 'tier1' ? 10 : 
                  tierName === 'tier2' ? 8 : 
                  tierName === 'tier3' ? 6 : 
                  tierName === 'tier4' ? 4 : 2,
            color: album.color,
            tierName: getTierName(tierName)
          });
        }
      });
    });
    
    // Only add period if it has ranked albums
    if (periodAlbums.length > 0) {
      children.push({
        name: periodName,
        children: periodAlbums
      });
    }
  });
  
  return {
    name: "Albums by Time Period",
    children
  };
});

// Mock method to simulate getting incomplete rankings
function getIncompleteRankings() {
  return ['Midnights', 'Folklore'];
}

onMounted(() => {
  // Show welcome alert for new users
  if (!userStore.user) {
    alertService.info('Welcome to Swiftie Universe! Create an account to save your rankings and access all features.', 'Welcome');
  }
  
  // Show incomplete rankings alert if user has started but not completed rankings
  const incompleteRankings = getIncompleteRankings();
  if (incompleteRankings.length > 0) {
    alertService.warning(
      `You have incomplete rankings for: ${incompleteRankings.join(', ')}. Continue ranking to see them in your visualizations.`,
      'Incomplete Rankings',
      { dismissible: true }
    );
  }
  
  // Show new feature alert
  alertService.info(
    'Try our new song ranking feature! Rank your favorite songs from each album.',
    'New Feature',
    { dismissible: true, id: 'new-feature-alert' }
  );
});
</script>

<style scoped>
/* Icon styles */
.edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' /%3E%3C/svg%3E");
}

.share-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z' /%3E%3C/svg%3E");
}

.album-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.song-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.coverflow-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' /%3E%3C/svg%3E");
}

.router-link {
  display: inline-block;
  text-decoration: none;
}
</style>
