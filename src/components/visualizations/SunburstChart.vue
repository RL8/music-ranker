<template>
  <div class="sunburst-container">
    <sunburst 
      ref="sunburstRef"
      :data="chartData" 
      :color-scheme="colorScheme"
      :min-angle-displayed="minAngleDisplayed"
      :show-labels="showLabels"
      :central-circle-relative-size="centralCircleSize"
      :highlight-opacity="highlightOpacity"
      :in-animation-duration="inAnimationDuration"
      :out-animation-duration="outAnimationDuration"
      :max-label-text="maxLabelSize"
      @mouseOverNode="onMouseOverNode"
      @clickNode="onClickNode"
      @zoomedChanged="onZoomedChanged"
      @resize="onResize">
      
      <!-- Add behaviors -->
      <template slot-scope="{ on, actions }">
        <highlightOnHover v-bind="{ on, actions }"/>
        <zoomOnClick v-bind="{ on, actions }"/>
      </template>
      
      <!-- Add information to be displayed on top of the graph -->
      <nodeInfoDisplayer 
        slot="top" 
        slot-scope="{ nodes }" 
        :current="nodes.mouseOver" 
        :root="nodes.root" 
        :description="nodeInfoDescription" />
      
      <!-- Add bottom legend -->
      <breadcrumbTrail 
        slot="legend" 
        slot-scope="{ nodes, colorGetter, width }" 
        :current="nodes.mouseOver" 
        :root="nodes.root" 
        :colorGetter="colorGetter" 
        :from="nodes.clicked" 
        :width="width" />
      
      <!-- Add pop-up -->
      <template slot="pop-up" slot-scope="{ data }">
        <div class="pop-up">
          <strong>{{ data.name }}</strong>
          <div v-if="data.size">Size: {{ data.size }}</div>
        </div>
      </template>
    </sunburst>
  </div>
</template>

<script>
import {
  breadcrumbTrail,
  highlightOnHover,
  nodeInfoDisplayer,
  sunburst,
  zoomOnClick
} from 'vue-d3-sunburst';
import "vue-d3-sunburst/dist/vue-d3-sunburst.css";

export default {
  name: 'SunburstChart',
  components: {
    breadcrumbTrail,
    highlightOnHover,
    nodeInfoDisplayer,
    sunburst,
    zoomOnClick
  },
  props: {
    /**
     * The data to display in the sunburst chart
     * Must follow the format:
     * {
     *   name: "root",
     *   children: [
     *     {
     *       name: "category1",
     *       children: [
     *         { name: "item1", size: 100 },
     *         { name: "item2", size: 200 }
     *       ]
     *     }
     *   ]
     * }
     */
    chartData: {
      type: Object,
      required: true
    },
    /**
     * D3 color scheme to use
     * See: https://github.com/d3/d3-scale-chromatic
     */
    colorScheme: {
      type: String,
      default: 'schemeCategory10'
    },
    /**
     * Whether to show labels on the arcs
     */
    showLabels: {
      type: [Boolean, Function],
      default: false
    },
    /**
     * Minimum arc angle to display (in radians)
     */
    minAngleDisplayed: {
      type: Number,
      default: 0.005
    },
    /**
     * Size of the central circle as percentage of total size
     */
    centralCircleSize: {
      type: Number,
      default: 0.1
    },
    /**
     * Opacity for non-highlighted nodes
     */
    highlightOpacity: {
      type: Number,
      default: 0.3
    },
    /**
     * Duration for in animation in milliseconds
     */
    inAnimationDuration: {
      type: Number,
      default: 100
    },
    /**
     * Duration for out animation in milliseconds
     */
    outAnimationDuration: {
      type: Number,
      default: 1000
    },
    /**
     * Maximum label size in pixels
     */
    maxLabelSize: {
      type: Number,
      default: 45
    },
    /**
     * Description text for the node info displayer
     */
    nodeInfoDescription: {
      type: String,
      default: "of total items"
    }
  },
  data() {
    return {
      currentNode: null,
      zoomedNode: null,
      chartSize: {
        width: 0,
        height: 0,
        radius: 0
      }
    };
  },
  methods: {
    /**
     * Resets the zoom level to show the entire chart
     */
    resetZoom() {
      if (this.$refs.sunburstRef) {
        // Access the underlying sunburst component
        const sunburstComponent = this.$refs.sunburstRef;
        // Reset zoom to root node
        sunburstComponent.zoomToNode(sunburstComponent.root);
      }
    },
    
    /**
     * Zoom to a specific node by name (path)
     * @param {string} nodePath - Path to the node (e.g., "root.category1.item1")
     */
    zoomToNodeByPath(nodePath) {
      if (!this.$refs.sunburstRef || !nodePath) return;
      
      const sunburstComponent = this.$refs.sunburstRef;
      const pathParts = nodePath.split('.');
      
      // Start from root
      let currentNode = sunburstComponent.root;
      
      // Navigate through the path
      for (let i = 1; i < pathParts.length; i++) {
        if (!currentNode.children) break;
        
        const childNode = currentNode.children.find(
          child => child.data.name === pathParts[i]
        );
        
        if (!childNode) break;
        currentNode = childNode;
      }
      
      // Zoom to the found node
      sunburstComponent.zoomToNode(currentNode);
    },
    
    /**
     * Export the chart as SVG
     * @returns {string} SVG content as string
     */
    exportAsSVG() {
      if (!this.$refs.sunburstRef) return '';
      
      const svgElement = this.$refs.sunburstRef.$el.querySelector('svg');
      if (!svgElement) return '';
      
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true);
      
      // Add XML declaration and set namespaces
      const svgContent = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      
      return URL.createObjectURL(svgBlob);
    },
    
    /**
     * Export the chart as PNG
     * @returns {Promise<string>} Promise resolving to PNG data URL
     */
    async exportAsPNG() {
      const svgUrl = this.exportAsSVG();
      if (!svgUrl) return '';
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = this.chartSize.width;
          canvas.height = this.chartSize.height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          try {
            const pngUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(svgUrl); // Clean up
            resolve(pngUrl);
          } catch (e) {
            URL.revokeObjectURL(svgUrl); // Clean up
            reject(e);
          }
        };
        
        img.onerror = (e) => {
          URL.revokeObjectURL(svgUrl); // Clean up
          reject(e);
        };
        
        img.src = svgUrl;
      });
    },
    
    /**
     * Event handler for mouseOverNode event
     */
    onMouseOverNode({ node }) {
      this.currentNode = node;
      this.$emit('node-hover', node);
    },
    
    /**
     * Event handler for clickNode event
     */
    onClickNode({ node }) {
      this.$emit('node-click', node);
    },
    
    /**
     * Event handler for zoomedChanged event
     */
    onZoomedChanged({ node }) {
      this.zoomedNode = node;
      this.$emit('zoom-changed', node);
    },
    
    /**
     * Event handler for resize event
     */
    onResize({ width, height, radius }) {
      this.chartSize = { width, height, radius };
      this.$emit('chart-resize', { width, height, radius });
    }
  }
};
</script>

<style scoped>
.sunburst-container {
  width: 100%;
  height: 600px;
  position: relative;
}

.pop-up {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
}
</style>
