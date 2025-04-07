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

              <nodeInfoDisplayer
                slot="top"
                slot-scope="{ nodes }"
                :current="nodes.mouseOver"
                :root="nodes.root"
                :clicked="nodes.clicked"
                description="of Taylor Swift's discography"
              />

              <template slot="pop-up" slot-scope="{ data }">
                <div class="pop-up">{{data.name}}</div>
              </template>

              <template slot-scope="{ on, actions }">
                <highlightOnHover v-bind="{ on, actions }" />
                <zoomOnClick v-bind="{ on, actions }" />
                <popUpOnHover v-bind="{ on, actions }"/>
              </template>
            </sunburst>
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
  nodeInfoDisplayer,
  sunburst,
  zoomOnClick,
  popUpOnHover
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
    nodeInfoDisplayer,
    breadcrumbTrail,
    highlightOnHover,
    zoomOnClick,
    popUpOnHover
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
      showLabels: false
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

  .pop-up {
    background-color: white;
    border: 1px solid black;
    border-radius: 4px;
    padding: 4px 8px;
    pointer-events: none;
    opacity: 0.92;
  }

  .main-row {
    min-height: 700px;
  }

  .control-middle {
    height: 600px;
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
}
</style>
