<template>
  <div class="taylor-swift-data-manager">
    <h2 class="mb-4">Taylor Swift Data Manager</h2>
    
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">{{ loadingMessage }}</p>
    </div>
    
    <div v-else class="card">
      <div class="card-body">
        <h5 class="card-title">Data Status</h5>
        
        <div class="alert" :class="statusClass" role="alert">
          {{ statusMessage }}
        </div>
        
        <div class="d-flex justify-content-between align-items-center mt-4">
          <div>
            <span v-if="lastUpdated" class="text-muted">
              Last updated: {{ formatDate(lastUpdated) }}
            </span>
            <span v-else class="text-muted">
              No data has been loaded yet
            </span>
          </div>
          
          <div>
            <button 
              class="btn btn-primary me-2" 
              @click="checkForUpdates" 
              :disabled="loading || checking"
            >
              <span v-if="checking" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Check for Updates
            </button>
            
            <button 
              class="btn btn-success" 
              @click="initializeData" 
              :disabled="loading || !needsUpdate"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ dataExists ? 'Update Data' : 'Initialize Data' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="dataExists && !loading" class="mt-4">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Data Summary</h5>
          <div class="row">
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3>{{ stats.albumCount || 0 }}</h3>
                  <p class="mb-0">Albums</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3>{{ stats.songCount || 0 }}</h3>
                  <p class="mb-0">Songs</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3>{{ stats.playlistCount || 0 }}</h3>
                  <p class="mb-0">User Playlists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Template Playlists</h5>
          <p class="card-text">Create a new playlist from one of these templates:</p>
          
          <div class="row">
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">All Songs</h5>
                  <p class="card-text">Create a playlist with all Taylor Swift songs for ranking</p>
                  <button 
                    class="btn btn-outline-primary" 
                    @click="createTemplatePlaylist('all-songs')"
                    :disabled="creatingTemplate === 'all-songs'"
                  >
                    <span v-if="creatingTemplate === 'all-songs'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">By Album</h5>
                  <p class="card-text">Create playlists organized by album for ranking songs within each album</p>
                  <button 
                    class="btn btn-outline-primary" 
                    @click="createTemplatePlaylist('by-album')"
                    :disabled="creatingTemplate === 'by-album'"
                  >
                    <span v-if="creatingTemplate === 'by-album'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
            
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">Top Songs</h5>
                  <p class="card-text">Create a playlist to rank your favorite Taylor Swift songs</p>
                  <button 
                    class="btn btn-outline-primary" 
                    @click="createTemplatePlaylist('top-songs')"
                    :disabled="creatingTemplate === 'top-songs'"
                  >
                    <span v-if="creatingTemplate === 'top-songs'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success/Error Toast Notifications -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
      <div v-if="showToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header" :class="toastClass">
          <strong class="me-auto text-white">{{ toastTitle }}</strong>
          <button type="button" class="btn-close btn-close-white" @click="showToast = false" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/lib/supabase/client';
import * as dataService from '@/services/musicbrainz/dataService';
import * as mbCache from '@/services/musicbrainz/cache';
import { createTemplatePlaylist as createTemplate } from '@/services/playlistService';

export default {
  name: 'TaylorSwiftDataManager',
  
  setup() {
    // State
    const loading = ref(false);
    const loadingMessage = ref('');
    const checking = ref(false);
    const needsUpdate = ref(false);
    const dataExists = ref(false);
    const statusMessage = ref('Checking data status...');
    const lastUpdated = ref(null);
    const stats = ref({
      albumCount: 0,
      songCount: 0,
      playlistCount: 0
    });
    const creatingTemplate = ref(null);
    
    // Toast notification
    const showToast = ref(false);
    const toastTitle = ref('');
    const toastMessage = ref('');
    const toastType = ref('success');
    
    // Computed properties
    const statusClass = computed(() => {
      if (!dataExists.value) return 'alert-warning';
      if (needsUpdate.value) return 'alert-warning';
      return 'alert-success';
    });
    
    const toastClass = computed(() => {
      return toastType.value === 'success' ? 'bg-success text-white' : 'bg-danger text-white';
    });
    
    // Methods
    const checkForUpdates = async () => {
      checking.value = true;
      try {
        const result = await dataService.checkForUpdates();
        needsUpdate.value = result.needsUpdate;
        statusMessage.value = result.message;
        
        // Check if data exists in cache
        dataExists.value = mbCache.cacheExists();
        if (dataExists.value) {
          lastUpdated.value = new Date(mbCache.getCacheTimestamp());
        }
        
        // Show toast notification
        showNotification(
          result.needsUpdate ? 'Update Available' : 'Data Status',
          result.message,
          result.needsUpdate ? 'warning' : 'success'
        );
        
        // Fetch stats if data exists
        if (dataExists.value) {
          await fetchStats();
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
        statusMessage.value = 'Error checking for updates';
        showNotification('Error', 'Failed to check for updates', 'error');
      } finally {
        checking.value = false;
      }
    };
    
    const initializeData = async () => {
      loading.value = true;
      loadingMessage.value = 'Initializing Taylor Swift data...';
      
      try {
        // Fetch data from MusicBrainz
        loadingMessage.value = 'Fetching data from MusicBrainz...';
        const data = await dataService.initializeTaylorSwiftData();
        
        // Store in Supabase
        loadingMessage.value = 'Storing data in database...';
        const result = await dataService.storeTaylorSwiftDataInSupabase(data);
        
        // Update state
        dataExists.value = true;
        needsUpdate.value = false;
        lastUpdated.value = new Date();
        statusMessage.value = 'Taylor Swift data successfully initialized';
        
        // Fetch updated stats
        await fetchStats();
        
        // Show success notification
        showNotification(
          'Success',
          `Taylor Swift data initialized with ${result.songsInserted} songs`,
          'success'
        );
      } catch (error) {
        console.error('Error initializing data:', error);
        statusMessage.value = 'Error initializing data';
        showNotification('Error', 'Failed to initialize data', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    const fetchStats = async () => {
      try {
        // Get Taylor Swift artist ID
        const { data: artist } = await supabase
          .from('artists')
          .select('id')
          .eq('name', 'Taylor Swift')
          .single();
        
        if (artist) {
          // Count albums (unique album names from songs)
          const { data: albums, error: albumsError } = await supabase
            .from('songs')
            .select('album')
            .eq('artist_id', artist.id)
            .is('album', 'not.null');
          
          if (!albumsError) {
            // Get unique album names
            const uniqueAlbums = [...new Set(albums.map(item => item.album))];
            stats.value.albumCount = uniqueAlbums.length;
          }
          
          // Count songs
          const { count: songCount, error: songsError } = await supabase
            .from('songs')
            .select('id', { count: 'exact', head: true })
            .eq('artist_id', artist.id);
          
          if (!songsError) {
            stats.value.songCount = songCount;
          }
        }
        
        // Count user playlists
        const { data: user } = await supabase.auth.getUser();
        if (user) {
          const { count: playlistCount, error: playlistsError } = await supabase
            .from('playlists')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.user.id);
          
          if (!playlistsError) {
            stats.value.playlistCount = playlistCount;
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    const createTemplatePlaylist = async (templateName) => {
      creatingTemplate.value = templateName;
      try {
        const result = await createTemplate(templateName);
        
        // Update playlist count
        stats.value.playlistCount += 1;
        
        // Show success notification
        showNotification(
          'Playlist Created',
          `Created "${result.name}" with ${result.songCount} songs`,
          'success'
        );
      } catch (error) {
        console.error('Error creating template playlist:', error);
        showNotification('Error', 'Failed to create playlist', 'error');
      } finally {
        creatingTemplate.value = null;
      }
    };
    
    const showNotification = (title, message, type = 'success') => {
      toastTitle.value = title;
      toastMessage.value = message;
      toastType.value = type;
      showToast.value = true;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        showToast.value = false;
      }, 5000);
    };
    
    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleString();
    };
    
    // Lifecycle hooks
    onMounted(async () => {
      await checkForUpdates();
    });
    
    return {
      loading,
      loadingMessage,
      checking,
      needsUpdate,
      dataExists,
      statusMessage,
      statusClass,
      lastUpdated,
      stats,
      creatingTemplate,
      showToast,
      toastTitle,
      toastMessage,
      toastClass,
      checkForUpdates,
      initializeData,
      createTemplatePlaylist,
      formatDate
    };
  }
};
</script>

<style scoped>
.taylor-swift-data-manager {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toast {
  min-width: 300px;
}
</style>
