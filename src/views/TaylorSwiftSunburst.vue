<template>
  <div id="taylor-swift-sunburst" class="container-fluid">
    <div class="row main-row">
      <div class="col-3">
        <div class="card control-left">
          <div class="card-header">Taylor Swift Albums Visualization</div>
          <div class="card-body">
            <p class="description">
              This visualization shows Taylor Swift's discography organized by album type.
            </p>
            <div class="form-horizontal">
              <div class="form-group">
                <label for="showLabels" class="control-label">Show Labels</label>
                <select
                  id="showLabels"
                  class="form-control"
                  v-model="showLabels"
                >
                  <option :value="false">No</option>
                  <option :value="true">Yes</option>
                  <option :value="showLabelsFunction">Custom</option>
                </select>
              </div>

              <div class="form-group">
                <label for="colorScheme" class="control-label">Color scheme</label>
                <select
                  id="colorScheme"
                  class="form-control"
                  v-model="colorScheme"
                >
                  <option
                    v-for="(scheme, index) in colorSchemes"
                    :key="index"
                    :value="scheme.value"
                  >
                    {{ scheme.text }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="minAngleDisplayed">Minimal arc angle to be displayed</label>
                <div>
                  <input
                    id="minAngleDisplayed"
                    class="form-control"
                    type="range"
                    min="0"
                    step="0.005"
                    max="0.5"
                    v-model.number="minAngleDisplayed"
                  />
                </div>
                <div>
                  <p>{{ minAngleDisplayed }} radian</p>
                </div>
              </div>

              <div class="form-group">
                <label for="centralCircleRelativeSize">Central circle relative size</label>
                <div>
                  <input
                    id="centralCircleRelativeSize"
                    class="form-control"
                    type="range"
                    min="0"
                    step="1"
                    max="50"
                    v-model.number="centralCircleRelativeSize"
                  />
                </div>
                <div>
                  <p>{{ centralCircleRelativeSize }} %</p>
                </div>
              </div>

              <div class="form-group">
                <label for="inAnimationDuration">Duration animation in</label>
                <div>
                  <input
                    id="inAnimationDuration"
                    class="form-control"
                    type="range"
                    min="0"
                    max="250"
                    v-model.number="inAnimationDuration"
                  />
                </div>
                <div>
                  <p>{{ inAnimationDuration }} ms</p>
                </div>
              </div>

              <div class="form-group">
                <label for="outAnimationDuration">Duration animation out</label>
                <div>
                  <input
                    id="outAnimationDuration"
                    class="form-control"
                    type="range"
                    min="0"
                    max="2000"
                    v-model.number="outAnimationDuration"
                  />
                </div>
                <div>
                  <p>{{ outAnimationDuration }} ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="card control-middle">
          <div class="card-header">Taylor Swift Discography</div>
          <div class="card-body father">
            <div ref="sunburstContainer" class="sunburst-container">
              <sunburst
                id="ts-sunburst"
                ref="sunburst"
                class="sunburst"
                :data="data"
                :max-label-text="20"
                :centralCircleRelativeSize="centralCircleRelativeSize"
                :showLabels="showLabels"
                :minAngleDisplayed="minAngleDisplayed"
                :colorScheme="colorScheme"
                :inAnimationDuration="inAnimationDuration"
                :outAnimationDuration="outAnimationDuration"
                @clickNode="onNodeClick"
              >
                <breadcrumbTrail
                  slot="legend"
                  slot-scope="{ nodes, colorGetter, width }"
                  :current="nodes.mouseOver"
                  :root="nodes.root"
                  :colorGetter="colorGetter"
                  :from="nodes.zoomed"
                  :width="width"
                />

                <template slot-scope="{ on, actions }">
                  <highlightOnHover v-bind="{ on, actions }" />
                  <zoomOnClick v-bind="{ on, actions }" />
                </template>
              </sunburst>
              
              <!-- Gesture feedback indicator -->
              <div v-if="gestureActive" class="gesture-indicator" :class="gestureType">
                <span v-if="gestureType === 'pinch'">
                  <i class="fas fa-search-plus" v-if="gestureDirection === 'in'"></i>
                  <i class="fas fa-search-minus" v-else></i>
                </span>
                <span v-else-if="gestureType === 'swipe'">
                  <i class="fas fa-undo" v-if="gestureDirection === 'left'"></i>
                  <i class="fas fa-home" v-else></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Album Notes Section -->
    <div class="row mt-3">
      <div class="col-12">
        <div class="card album-notes-card" :class="{ 'has-content': selectedNode.name }">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{ selectedNode.name || 'Tap on an album for details' }}</h5>
            <button v-if="selectedNode.name" type="button" class="btn-close" aria-label="Close" @click="clearSelectedNode">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="card-body">
            <transition name="fade">
              <div v-if="selectedNode.name">
                <p>{{ selectedNode.note || 'No additional information available.' }}</p>
              </div>
              <div v-else class="text-center text-muted">
                <p><i class="fa fa-info-circle"></i> Tap on any section of the chart to see detailed information.</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  breadcrumbTrail,
  highlightOnHover,
  sunburst,
  zoomOnClick
} from 'vue-d3-sunburst';
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";
import taylorSwiftData from '@/data/taylor-swift-sunburst.json';
import Hammer from 'hammerjs';

// Define color schemes
const colorSchemes = {
  schemeCategory10: { name: "Category 10" },
  schemeAccent: { name: "Accent" },
  schemeDark2: { name: "Dark 2" },
  schemePaired: { name: "Paired" },
  schemePastel1: { name: "Pastel 1" },
  schemePastel2: { name: "Pastel 2" },
  schemeSet1: { name: "Set 1" },
  schemeSet2: { name: "Set 2" },
  schemeSet3: { name: "Set 3" },
  schemeTableau10: { name: "Tableau 10" }
};

const colorSchemesNames = Object.keys(colorSchemes).map(key => ({
  value: key,
  text: colorSchemes[key].name
}));

export default {
  name: 'TaylorSwiftSunburst',
  components: {
    sunburst,
    breadcrumbTrail,
    highlightOnHover,
    zoomOnClick
  },
  data() {
    return {
      data: taylorSwiftData,
      minAngleDisplayed: 0.01,
      colorScheme: "schemeSet3", // Using a color scheme that works well with the data
      colorSchemes: colorSchemesNames,
      inAnimationDuration: 100,
      outAnimationDuration: 1000,
      centralCircleRelativeSize: 20,
      showLabels: false,
      // Properties for album notes
      selectedNode: {
        name: '',
        note: ''
      },
      // Properties for mobile gestures
      hammer: null,
      currentZoomNode: null,
      zoomHistory: [],
      gestureActive: false,
      gestureType: '',
      gestureDirection: '',
      gestureTimeout: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeHammerGestures();
    });
  },
  beforeDestroy() {
    if (this.hammer) {
      this.hammer.destroy();
    }
  },
  methods: {
    showLabelsFunction(d) {
      const {
        data,
        context: { angle, relativeDepth }
      } = d;
      if (relativeDepth > 2 || angle < 5) {
        return null;
      }
      return data.name;
    },
    // Methods for handling node clicks and notes display
    onNodeClick({ node }) {
      if (node && node.data) {
        // Update the current zoom node for gesture navigation
        this.currentZoomNode = node;
        
        // Add to zoom history for navigation
        if (this.zoomHistory.length === 0 || 
            this.zoomHistory[this.zoomHistory.length - 1] !== node) {
          this.zoomHistory.push(node);
        }
        
        // Update the selected node info
        this.selectedNode = {
          name: node.data.name,
          note: node.data.note || ''
        };
        
        // On mobile, scroll to the notes section
        if (window.innerWidth < 768) {
          this.$nextTick(() => {
            const notesCard = document.querySelector('.album-notes-card');
            if (notesCard) {
              notesCard.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }
      }
    },
    clearSelectedNode() {
      this.selectedNode = {
        name: '',
        note: ''
      };
    },
    
    // Mobile gesture methods
    initializeHammerGestures() {
      const sunburstEl = this.$refs.sunburstContainer;
      if (!sunburstEl) return;
      
      // Initialize Hammer
      this.hammer = new Hammer(sunburstEl);
      
      // Configure recognizers
      this.hammer.get('pinch').set({ enable: true });
      this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });
      
      // Add gesture handlers
      this.hammer.on('pinch', this.handlePinch);
      this.hammer.on('swipe', this.handleSwipe);
      this.hammer.on('tap', this.handleTap);
    },
    
    handlePinch(event) {
      // Determine pinch direction (in or out)
      const isPinchIn = event.scale > 1;
      
      // Show gesture feedback
      this.showGestureFeedback('pinch', isPinchIn ? 'in' : 'out');
      
      // Only trigger on pinch end to avoid multiple zooms
      if (event.eventType === Hammer.INPUT_END) {
        if (isPinchIn) {
          // Pinch in - zoom into the current node if available
          if (this.currentZoomNode) {
            this.zoomToNode(this.currentZoomNode);
          }
        } else {
          // Pinch out - zoom out to parent
          this.zoomOut();
        }
      }
    },
    
    handleSwipe(event) {
      // Determine swipe direction
      const isSwipeLeft = event.direction === Hammer.DIRECTION_LEFT;
      
      // Show gesture feedback
      this.showGestureFeedback('swipe', isSwipeLeft ? 'left' : 'right');
      
      if (isSwipeLeft) {
        // Swipe left - go back to previous view
        this.goBack();
      } else {
        // Swipe right - reset to root view
        this.resetZoom();
      }
    },
    
    handleTap() {
      // Single tap is already handled by the sunburst component
      // We could add double-tap functionality here if needed
    },
    
    zoomToNode(node) {
      if (!node) return;
      
      // Access the sunburst component's internal API
      const sunburstComponent = this.$refs.sunburst;
      if (sunburstComponent && sunburstComponent.actions && sunburstComponent.actions.zoomToNode) {
        sunburstComponent.actions.zoomToNode(node);
        
        // Update current node and history
        this.currentZoomNode = node;
        if (this.zoomHistory.length === 0 || 
            this.zoomHistory[this.zoomHistory.length - 1] !== node) {
          this.zoomHistory.push(node);
        }
      }
    },
    
    zoomOut() {
      // If we have a history, go back one level
      if (this.zoomHistory.length > 1) {
        // Remove current node
        this.zoomHistory.pop();
        // Get parent node
        const parentNode = this.zoomHistory[this.zoomHistory.length - 1];
        // Zoom to parent
        this.zoomToNode(parentNode);
      } else {
        // If at root already, do nothing or provide feedback
        this.resetZoom();
      }
    },
    
    goBack() {
      // Similar to zoomOut but with different user intent
      if (this.zoomHistory.length > 1) {
        this.zoomHistory.pop();
        const previousNode = this.zoomHistory[this.zoomHistory.length - 1];
        this.zoomToNode(previousNode);
      }
    },
    
    resetZoom() {
      // Reset to root view
      const sunburstComponent = this.$refs.sunburst;
      if (sunburstComponent && sunburstComponent.actions && sunburstComponent.actions.zoomToNode) {
        // Get the root node
        const rootNode = sunburstComponent.nodes ? sunburstComponent.nodes.root : null;
        if (rootNode) {
          sunburstComponent.actions.zoomToNode(rootNode);
          this.currentZoomNode = rootNode;
          this.zoomHistory = [rootNode];
        }
      }
    },
    
    showGestureFeedback(type, direction) {
      // Clear any existing timeout
      if (this.gestureTimeout) {
        clearTimeout(this.gestureTimeout);
      }
      
      // Show the gesture indicator
      this.gestureActive = true;
      this.gestureType = type;
      this.gestureDirection = direction;
      
      // Hide after a short delay
      this.gestureTimeout = setTimeout(() => {
        this.gestureActive = false;
      }, 800);
    }
  }
};
</script>

<style lang="scss">
#taylor-swift-sunburst {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 20px;

  .description {
    margin-bottom: 20px;
    text-align: left;
  }

  .main-row {
    min-height: 600px;
  }

  .control-middle {
    height: 500px;
  }

  .control-left {
    height: 100%;
  }

  .father {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  
  .sunburst-container {
    position: relative;
    width: 100%;
    height: 100%;
    touch-action: none; /* Important for Hammer.js */
  }

  .sunburst {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  // Gesture indicator styles
  .gesture-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    z-index: 100;
    pointer-events: none;
    opacity: 0.8;
    transition: all 0.3s ease;
    
    &.pinch {
      animation: pulse 0.8s ease-out;
    }
    
    &.swipe {
      animation: slide 0.8s ease-out;
    }
  }
  
  @keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  
  @keyframes slide {
    0% { transform: translate(-70%, -50%); opacity: 0; }
    50% { transform: translate(-50%, -50%); opacity: 0.8; }
    100% { transform: translate(-30%, -50%); opacity: 0; }
  }

  .album-notes-card {
    transition: all 0.3s ease;
    min-height: 100px;
    
    &.has-content {
      border-left: 4px solid #1DB954; // Spotify green as an accent
    }
    
    .card-header {
      background-color: rgba(240, 240, 240, 0.5);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .card-body {
      text-align: left;
      padding: 1.25rem;
      
      p {
        margin-bottom: 0.5rem;
        line-height: 1.6;
      }
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      padding: 0;
      cursor: pointer;
      opacity: 0.5;
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  // Transitions
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  // Mobile optimizations
  @media (max-width: 767px) {
    .main-row {
      min-height: 400px;
    }
    
    .control-middle {
      height: 350px;
    }
    
    .col-3, .col-9 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    .control-left {
      margin-bottom: 1rem;
    }
    
    .album-notes-card {
      margin-top: 1rem;
    }
  }
}
</style>
