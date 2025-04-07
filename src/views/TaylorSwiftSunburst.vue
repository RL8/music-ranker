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
            <sunburst
              id="ts-sunburst"
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
      }
    };
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
        // Smooth scroll to the notes section on mobile
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

  .sunburst {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .form-group {
    margin-bottom: 1rem;
    text-align: left;
  }
  
  // Album notes card styles
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
