<template>
  <div class="taylor-swift-manager">
    <h1>Taylor Swift Data Manager</h1>
    
    <div class="data-status">
      <h2>Data Status</h2>
      <div v-if="isLoading" class="loading">
        Loading data...
      </div>
      <div v-else class="status-info">
        <div class="status-item">
          <strong>Albums:</strong> {{ albums.length }} albums loaded
        </div>
        <div class="status-item">
          <strong>Songs:</strong> {{ songs.length }} songs loaded
        </div>
      </div>
    </div>
    
    <div class="album-list">
      <h2>Albums</h2>
      <div class="albums-container">
        <div v-for="album in albums" :key="album.id" class="album-card">
          <h3>{{ album.title }}</h3>
          <p>Released: {{ album['first-release-date'] || 'Unknown' }}</p>
          <button @click="viewAlbumSongs(album.id)" class="btn btn-primary">
            View Songs
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="selectedAlbum" class="song-list">
      <h2>Songs in "{{ selectedAlbum.title }}"</h2>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Length</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in albumSongs" :key="song.id">
            <td>{{ song.position }}</td>
            <td>{{ song.title }}</td>
            <td>{{ formatDuration(song.length) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getAlbums, getAllSongs, getAlbumById, getSongsByAlbumId } from '@/services/taylorSwiftService';

export default {
  name: 'TaylorSwiftDataManager',
  
  data() {
    return {
      isLoading: true,
      albums: [],
      songs: [],
      selectedAlbum: null,
      albumSongs: []
    };
  },
  
  created() {
    this.loadData();
  },
  
  methods: {
    loadData() {
      this.isLoading = true;
      
      try {
        // Load data from static files
        this.albums = getAlbums();
        this.songs = getAllSongs();
        
        // Sort albums by release date (newest first)
        this.albums.sort((a, b) => {
          if (!a['first-release-date']) return 1;
          if (!b['first-release-date']) return -1;
          return new Date(b['first-release-date']) - new Date(a['first-release-date']);
        });
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error loading Taylor Swift data:', error);
        this.isLoading = false;
      }
    },
    
    viewAlbumSongs(albumId) {
      this.selectedAlbum = getAlbumById(albumId);
      if (this.selectedAlbum) {
        this.albumSongs = getSongsByAlbumId(albumId);
        
        // Sort songs by position
        this.albumSongs.sort((a, b) => {
          if (a.discNumber !== b.discNumber) {
            return a.discNumber - b.discNumber;
          }
          return a.position - b.position;
        });
      }
    },
    
    formatDuration(ms) {
      if (!ms) return 'Unknown';
      
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.taylor-swift-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.data-status {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.status-info {
  display: flex;
  gap: 20px;
}

.albums-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.album-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: white;
}

.song-list {
  margin-top: 30px;
}

.loading {
  font-style: italic;
  color: #6c757d;
}
</style>
