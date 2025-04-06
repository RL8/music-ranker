<template>
  <div class="sunburst-demo">
    <h1>Music Data Visualization</h1>
    <p class="description">This visualization shows Taylor Swift's live albums and their songs using a sunburst chart.</p>
    
    <div class="controls-container">
      <div class="controls-section">
        <h3>Data Controls</h3>
        <div class="control-group">
          <label for="dataSource">Data Source:</label>
          <select id="dataSource" v-model="selectedDataSource" class="form-select" @change="updateChartData">
            <option value="liveAlbums">Live Albums Only</option>
            <option value="allAlbums">All Albums</option>
            <option value="byEra">By Era</option>
            <option value="sample">Sample Data</option>
          </select>
        </div>
        
        <div class="control-group" v-if="selectedDataSource === 'byEra'">
          <label for="eraSelect">Select Era:</label>
          <select id="eraSelect" v-model="selectedEra" class="form-select" @change="loadEraData">
            <option v-for="era in availableEras" :key="era" :value="era">{{ era }}</option>
          </select>
        </div>
        
        <div class="control-group">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="useSupabase" v-model="useSupabase">
            <label class="form-check-label" for="useSupabase">Use Supabase</label>
          </div>
        </div>
        
        <div class="control-group">
          <button @click="resetZoom" class="btn btn-primary">Reset Zoom</button>
        </div>
      </div>
      
      <div class="controls-section">
        <h3>Visual Controls</h3>
        <div class="control-group">
          <label for="colorScheme">Color Scheme:</label>
          <select id="colorScheme" v-model="colorScheme" class="form-select">
            <option value="schemeCategory10">Category 10</option>
            <option value="schemeAccent">Accent</option>
            <option value="schemeDark2">Dark 2</option>
            <option value="schemePaired">Paired</option>
            <option value="schemePastel1">Pastel 1</option>
            <option value="schemePastel2">Pastel 2</option>
            <option value="schemeSet1">Set 1</option>
            <option value="schemeSet2">Set 2</option>
            <option value="schemeSet3">Set 3</option>
            <option value="schemeTableau10">Tableau 10</option>
          </select>
        </div>
        
        <div class="control-group">
          <label for="centralCircleSize">Central Circle Size:</label>
          <div class="slider-container">
            <input 
              type="range" 
              id="centralCircleSize" 
              v-model.number="centralCircleSize" 
              min="0" 
              max="0.5" 
              step="0.01" 
              class="form-range"
            />
            <span>{{ (centralCircleSize * 100).toFixed(0) }}%</span>
          </div>
        </div>
        
        <div class="control-group">
          <label for="highlightOpacity">Highlight Opacity:</label>
          <div class="slider-container">
            <input 
              type="range" 
              id="highlightOpacity" 
              v-model.number="highlightOpacity" 
              min="0" 
              max="1" 
              step="0.05" 
              class="form-range"
            />
            <span>{{ highlightOpacity.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="control-group">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="showLabels" v-model="showLabels">
            <label class="form-check-label" for="showLabels">Show Labels</label>
          </div>
        </div>
        
        <div class="control-group">
          <label for="maxLabelSize">Max Label Size:</label>
          <div class="slider-container">
            <input 
              type="range" 
              id="maxLabelSize" 
              v-model.number="maxLabelSize" 
              min="0" 
              max="100" 
              step="5" 
              class="form-range"
              :disabled="!showLabels"
            />
            <span>{{ maxLabelSize }}px</span>
          </div>
        </div>
      </div>
      
      <div class="controls-section">
        <h3>Animation Controls</h3>
        <div class="control-group">
          <label for="inAnimationDuration">In Animation Duration:</label>
          <div class="slider-container">
            <input 
              type="range" 
              id="inAnimationDuration" 
              v-model.number="inAnimationDuration" 
              min="0" 
              max="1000" 
              step="50" 
              class="form-range"
            />
            <span>{{ inAnimationDuration }}ms</span>
          </div>
        </div>
        
        <div class="control-group">
          <label for="outAnimationDuration">Out Animation Duration:</label>
          <div class="slider-container">
            <input 
              type="range" 
              id="outAnimationDuration" 
              v-model.number="outAnimationDuration" 
              min="0" 
              max="2000" 
              step="100" 
              class="form-range"
            />
            <span>{{ outAnimationDuration }}ms</span>
          </div>
        </div>
      </div>
      
      <div class="controls-section">
        <h3>Export Options</h3>
        <div class="control-group export-buttons">
          <button @click="exportSVG" class="btn btn-outline-primary">Export as SVG</button>
          <button @click="exportPNG" class="btn btn-outline-primary">Export as PNG</button>
        </div>
      </div>
    </div>
    
    <div class="chart-container">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <SunburstChart 
        v-else
        ref="sunburstChart"
        :chart-data="currentChartData" 
        :color-scheme="colorScheme"
        :show-labels="showLabels"
        :central-circle-size="centralCircleSize"
        :highlight-opacity="highlightOpacity"
        :in-animation-duration="inAnimationDuration"
        :out-animation-duration="outAnimationDuration"
        :max-label-size="maxLabelSize"
        :node-info-description="nodeInfoDescription"
        @node-hover="onNodeHover"
        @node-click="onNodeClick"
        @zoom-changed="onZoomChanged"
        @chart-resize="onChartResize"
      />
    </div>
    
    <div v-if="selectedNode" class="node-details">
      <h3>Selected Node: {{ selectedNode.data.name }}</h3>
      <div v-if="selectedNode.data.size" class="node-size">
        Size: {{ selectedNode.data.size }}
      </div>
      <div class="node-path">
        Path: {{ getNodePath(selectedNode) }}
      </div>
    </div>
    
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import SunburstChart from '@/components/visualizations/SunburstChart.vue';
import taylorSwiftSupabaseService from '@/services/taylorSwiftSupabaseService';

export default {
  name: 'SunburstDemo',
  components: {
    SunburstChart
  },
  data() {
    return {
      loading: true,
      error: null,
      showLabels: false,
      colorScheme: 'schemeCategory10',
      selectedDataSource: 'liveAlbums',
      taylorSwiftData: null,
      taylorSwiftLiveAlbumsData: null,
      selectedNode: null,
      zoomedNode: null,
      chartSize: null,
      useSupabase: true,
      selectedEra: 'Taylor Swift',
      availableEras: [],
      eraData: null,
      
      // Additional control values
      centralCircleSize: 0.1,
      highlightOpacity: 0.3,
      inAnimationDuration: 100,
      outAnimationDuration: 1000,
      maxLabelSize: 45,
      nodeInfoDescription: "of total songs",
      
      sampleData: {
        name: "Music Library",
        children: [
          {
            name: "Taylor Swift",
            children: [
              {
                name: "Folklore",
                children: [
                  { name: "cardigan", size: 100 },
                  { name: "the 1", size: 85 },
                  { name: "exile", size: 95 },
                  { name: "august", size: 90 }
                ]
              },
              {
                name: "1989",
                children: [
                  { name: "Blank Space", size: 120 },
                  { name: "Style", size: 110 },
                  { name: "Shake It Off", size: 130 },
                  { name: "Bad Blood", size: 105 }
                ]
              }
            ]
          },
          {
            name: "Other Artists",
            children: [
              {
                name: "The Beatles",
                children: [
                  { name: "Abbey Road", size: 200 },
                  { name: "Let It Be", size: 180 }
                ]
              },
              {
                name: "Queen",
                children: [
                  { name: "A Night at the Opera", size: 150 },
                  { name: "News of the World", size: 140 }
                ]
              }
            ]
          }
        ]
      }
    };
  },
  computed: {
    currentChartData() {
      switch(this.selectedDataSource) {
        case 'liveAlbums':
          return this.taylorSwiftLiveAlbumsData;
        case 'allAlbums':
          return this.taylorSwiftData;
        case 'byEra':
          return this.eraData;
        case 'sample':
          return this.sampleData;
        default:
          return this.taylorSwiftLiveAlbumsData;
      }
    }
  },
  methods: {
    resetZoom() {
      if (this.$refs.sunburstChart) {
        this.$refs.sunburstChart.resetZoom();
      }
    },
    updateChartData() {
      // Reset zoom when changing data source
      this.$nextTick(() => {
        if (this.$refs.sunburstChart) {
          this.$refs.sunburstChart.resetZoom();
        }
      });
      
      // Load data if needed
      if (this.selectedDataSource === 'byEra') {
        this.loadEraData();
      }
    },
    async loadTaylorSwiftData() {
      this.loading = true;
      this.error = null;
      
      try {
        await this.loadDataFromSupabase();
        
        // Also load available eras if using Supabase
        await this.loadAvailableEras();
      } catch (error) {
        console.error('Error loading Taylor Swift data:', error);
        this.error = `Failed to load data: ${error.message}`;
        // Fallback to sample data if there's an error
        this.selectedDataSource = 'sample';
      } finally {
        this.loading = false;
      }
    },
    
    async loadDataFromSupabase() {
      try {
        // Load all albums data for general view
        const sunburstData = await taylorSwiftSupabaseService.visualizations.getSunburstData();
        this.taylorSwiftData = sunburstData;
        
        // Load only live albums
        const allAlbums = await taylorSwiftSupabaseService.albums.getAll();
        const liveAlbums = allAlbums.filter(album => {
          const albumTitle = (album.title || "").toLowerCase();
          const albumDesc = (album.description || "").toLowerCase();
          
          return albumTitle.includes("live") || 
                 albumDesc.includes("live") || 
                 albumTitle.includes("tour") || 
                 albumDesc.includes("tour") ||
                 albumTitle.includes("concert") || 
                 albumDesc.includes("concert");
        });
        
        // Create live albums data structure
        const liveAlbumsIds = liveAlbums.map(album => album.id);
        
        if (liveAlbumsIds.length === 0) {
          this.taylorSwiftLiveAlbumsData = {
            name: "Taylor Swift Live Albums",
            children: [{ name: "No live albums found", size: 100 }]
          };
          return;
        }
        
        // Get songs for these albums
        const songsPromises = liveAlbumsIds.map(id => 
          taylorSwiftSupabaseService.songs.getByAlbumId(id)
        );
        
        const songsResults = await Promise.all(songsPromises);
        
        // Create the live albums data structure
        this.taylorSwiftLiveAlbumsData = {
          name: "Taylor Swift Live Albums",
          children: liveAlbums.map((album, index) => ({
            name: album.title,
            children: songsResults[index].map(song => ({
              name: song.title,
              size: song.length_ms || 100
            }))
          }))
        };
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        throw error;
      }
    },
    
    async loadAvailableEras() {
      try {
        const eras = await taylorSwiftSupabaseService.albums.getAllEras();
        this.availableEras = eras;
        
        // Set default era if not already set
        if (!this.selectedEra && eras.length > 0) {
          this.selectedEra = eras[0];
        }
      } catch (error) {
        console.error('Error loading eras:', error);
        this.error = `Failed to load eras: ${error.message}`;
      }
    },
    
    async loadEraData() {
      if (!this.selectedEra) return;
      
      this.loading = true;
      this.error = null;
      
      try {
        // Load data for the selected era from Supabase
        const data = await taylorSwiftSupabaseService.visualizations.getSunburstData(this.selectedEra);
        this.eraData = data;
      } catch (error) {
        console.error(`Error loading data for era ${this.selectedEra}:`, error);
        this.error = `Failed to load era data: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    
    // Event handlers
    onNodeHover(node) {
      this.selectedNode = node;
    },
    
    onNodeClick(node) {
      // You could add specific behavior on node click
      console.log('Node clicked:', node.data.name);
    },
    
    onZoomChanged(node) {
      this.zoomedNode = node;
    },
    
    onChartResize(size) {
      this.chartSize = size;
    },
    
    // Helper methods
    getNodePath(node) {
      if (!node) return '';
      
      const path = [];
      let currentNode = node;
      
      while (currentNode) {
        if (currentNode.data && currentNode.data.name) {
          path.unshift(currentNode.data.name);
        }
        currentNode = currentNode.parent;
      }
      
      return path.join(' > ');
    },
    
    // Export methods
    async exportSVG() {
      if (!this.$refs.sunburstChart) return;
      
      const svgUrl = this.$refs.sunburstChart.exportAsSVG();
      if (!svgUrl) {
        alert('Failed to generate SVG');
        return;
      }
      
      // Create a download link
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = `sunburst-chart-${new Date().toISOString().slice(0, 10)}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(svgUrl), 100);
    },
    
    async exportPNG() {
      if (!this.$refs.sunburstChart) return;
      
      try {
        const pngUrl = await this.$refs.sunburstChart.exportAsPNG();
        if (!pngUrl) {
          alert('Failed to generate PNG');
          return;
        }
        
        // Create a download link
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `sunburst-chart-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(pngUrl), 100);
      } catch (error) {
        console.error('Error exporting PNG:', error);
        alert('Failed to export as PNG');
      }
    }
  },
  watch: {
    useSupabase() {
      // Reload data when switching between local and Supabase
      this.loadTaylorSwiftData();
    }
  },
  mounted() {
    // Load Taylor Swift data when the component mounts
    this.loadTaylorSwiftData();
  }
};
</script>

<style scoped>
.sunburst-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.description {
  margin-bottom: 20px;
  color: #666;
}

.controls-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.controls-section {
  flex: 1;
  min-width: 250px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
}

.controls-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input {
  flex: 1;
}

.slider-container span {
  min-width: 50px;
  text-align: right;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

.chart-container {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 600px;
  position: relative;
  margin-bottom: 20px;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.node-details {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  margin-top: 20px;
}

.node-details h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
}

.node-size, .node-path {
  margin-bottom: 5px;
  color: #666;
}
</style>
