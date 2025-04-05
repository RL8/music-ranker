<template>
  <div class="sunburst-container">
    <div class="controls mb-3" v-if="showControls">
      <b-form-group label="Color Scheme">
        <b-form-select v-model="selectedColorScheme" :options="colorSchemeOptions"></b-form-select>
      </b-form-group>
      
      <b-form-group label="Transition Duration (ms)">
        <b-form-input v-model.number="transitionDuration" type="range" min="0" max="1000" step="100"></b-form-input>
        <div class="text-center">{{ transitionDuration }}ms</div>
      </b-form-group>
    </div>
    
    <div class="text-center mb-3" v-if="breadcrumbs.length > 0">
      <b-breadcrumb>
        <b-breadcrumb-item 
          v-for="(item, index) in breadcrumbs" 
          :key="index"
          :active="index === breadcrumbs.length - 1"
          @click="zoomToLevel(index)"
        >
          {{ item.name }}
        </b-breadcrumb-item>
      </b-breadcrumb>
    </div>
    
    <div class="chart-container">
      <div ref="chart" class="sunburst-chart"></div>
      
      <div v-if="selectedNode && selectedNode.data.lyric" class="lyric-display mt-3 p-3">
        <h4>Favorite Lyric</h4>
        <blockquote class="blockquote">
          <p class="mb-0">{{ selectedNode.data.lyric }}</p>
          <footer class="blockquote-footer">From <cite>{{ selectedNode.data.name }}</cite></footer>
        </blockquote>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'SunburstChart',
  props: {
    // The hierarchical data to visualize
    data: {
      type: Object,
      required: true
    },
    // Width of the chart
    width: {
      type: Number,
      default: 600
    },
    // Height of the chart
    height: {
      type: Number,
      default: 600
    },
    // Whether to show the control panel
    showControls: {
      type: Boolean,
      default: true
    },
    // Initial color scheme
    initialColorScheme: {
      type: String,
      default: 'schemeSpectral'
    }
  },
  data() {
    return {
      chart: null,
      svg: null,
      root: null,
      path: null,
      radius: 0,
      arc: null,
      selectedNode: null,
      breadcrumbs: [],
      transitionDuration: 750,
      selectedColorScheme: this.initialColorScheme,
      colorSchemeOptions: [
        { value: 'schemeSpectral', text: 'Spectral' },
        { value: 'schemeCategory10', text: 'Category10' },
        { value: 'schemePaired', text: 'Paired' },
        { value: 'schemeSet3', text: 'Set3' },
        { value: 'schemeTableau10', text: 'Tableau' }
      ]
    };
  },
  watch: {
    data: {
      handler() {
        this.updateChart();
      },
      deep: true
    },
    selectedColorScheme() {
      this.updateColors();
    },
    width() {
      this.resizeChart();
    },
    height() {
      this.resizeChart();
    }
  },
  mounted() {
    this.initializeChart();
    this.updateChart();
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.resizeChart();
    },
    
    resizeChart() {
      if (!this.svg) return;
      
      // Clear existing chart
      d3.select(this.$refs.chart).selectAll('*').remove();
      
      // Reinitialize with new dimensions
      this.initializeChart();
      this.updateChart();
    },
    
    initializeChart() {
      // Calculate dimensions
      const width = this.width;
      const height = this.height;
      this.radius = Math.min(width, height) / 2;
      
      // Create SVG
      this.svg = d3.select(this.$refs.chart)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
      
      // Create arc generator
      this.arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(this.radius / 2)
        .innerRadius(d => d.y0 * this.radius)
        .outerRadius(d => d.y1 * this.radius);
    },
    
    updateChart() {
      if (!this.svg || !this.data) return;
      
      // Process the data
      this.root = d3.hierarchy(this.data)
        .sum(d => d.value || 1)
        .sort((a, b) => b.value - a.value);
      
      // Create partition layout
      const partition = d3.partition()
        .size([2 * Math.PI, 1]);
      
      partition(this.root);
      
      // Reset breadcrumbs
      this.breadcrumbs = [{
        name: this.data.name,
        node: this.root
      }];
      
      this.renderChart(this.root);
    },
    
    renderChart(rootNode) {
      // Remove existing paths
      this.svg.selectAll('path').remove();
      
      // Create color scale
      const colorScheme = d3[this.selectedColorScheme];
      const color = d3.scaleOrdinal(colorScheme ? colorScheme[Math.min(colorScheme.length - 1, 10)] : d3.schemeCategory10);
      
      // Add paths
      this.path = this.svg.selectAll('path')
        .data(rootNode.descendants().filter(d => d.depth))
        .enter()
        .append('path')
        .attr('fill', d => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .attr('fill-opacity', d => {
          return d.children ? 0.7 : 0.9;
        })
        .attr('d', this.arc)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .on('click', (event, d) => this.handleClick(d))
        .on('mouseover', (event, d) => this.handleMouseOver(event, d))
        .on('mouseout', (event, d) => this.handleMouseOut(event, d));
      
      // Add labels for larger segments
      this.svg.selectAll('text')
        .data(rootNode.descendants().filter(d => d.depth && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03))
        .enter()
        .append('text')
        .attr('transform', d => {
          const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
          const y = (d.y0 + d.y1) / 2 * this.radius;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', d => {
          // Scale font size based on arc size
          const arcSize = (d.y1 - d.y0) * (d.x1 - d.x0);
          return Math.max(10, Math.min(14, arcSize * 200)) + 'px';
        })
        .text(d => d.data.name)
        .style('pointer-events', 'none')
        .style('fill', '#fff')
        .style('font-weight', 'bold')
        .style('text-shadow', '0px 0px 2px rgba(0,0,0,0.8)');
    },
    
    updateColors() {
      if (!this.path) return;
      
      const colorScheme = d3[this.selectedColorScheme];
      const color = d3.scaleOrdinal(colorScheme ? colorScheme[Math.min(colorScheme.length - 1, 10)] : d3.schemeCategory10);
      
      this.path
        .transition()
        .duration(this.transitionDuration)
        .attr('fill', d => {
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        });
    },
    
    handleClick(d) {
      this.selectedNode = d;
      
      // If the node has children, zoom to it
      if (d.children) {
        // Update breadcrumbs
        this.breadcrumbs = this.breadcrumbs.slice(0, d.depth);
        this.breadcrumbs.push({
          name: d.data.name,
          node: d
        });
        
        this.zoomTo(d);
      }
      
      // Emit the selected node
      this.$emit('node-selected', d);
    },
    
    zoomTo(d) {
      const x0 = d.x0;
      const x1 = d.x1;
      const y0 = d.y0;
      const y1 = d.y1;
      
      // Interpolate the scales
      const xd = d3.interpolate(this.root.x0, x0);
      const yd = d3.interpolate(this.root.y0, y0);
      const xdd = d3.interpolate(this.root.x1, x1);
      const ydd = d3.interpolate(this.root.y1, y1);
      
      // Update the root node dimensions
      this.root.x0 = x0;
      this.root.y0 = y0;
      this.root.x1 = x1;
      this.root.y1 = y1;
      
      // Animate the transition
      this.path
        .transition()
        .duration(this.transitionDuration)
        .attrTween('d', d => {
          return t => {
            d.x0 = xd(t) + (d.x0 - x0) * (xdd(t) - xd(t)) / (x1 - x0);
            d.x1 = xd(t) + (d.x1 - x0) * (xdd(t) - xd(t)) / (x1 - x0);
            d.y0 = yd(t) + (d.y0 - y0) * (ydd(t) - yd(t)) / (y1 - y0);
            d.y1 = yd(t) + (d.y1 - y0) * (ydd(t) - yd(t)) / (y1 - y0);
            return this.arc(d);
          };
        });
    },
    
    zoomToLevel(index) {
      if (index >= this.breadcrumbs.length) return;
      
      // Update breadcrumbs
      this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
      
      // Zoom to the selected level
      const node = this.breadcrumbs[index].node;
      this.selectedNode = node;
      this.zoomTo(node);
      
      // Emit the selected node
      this.$emit('node-selected', node);
    },
    
    handleMouseOver(event, d) {
      // Highlight the hovered segment
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('fill-opacity', 1)
        .attr('stroke-width', 1.5);
      
      // Show tooltip with node info
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'sunburst-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0,0,0,0.7)')
        .style('color', 'white')
        .style('padding', '5px 10px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('z-index', 1000)
        .style('opacity', 0);
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 0.9);
      
      const path = [];
      let current = d;
      while (current.parent) {
        path.unshift(current.data.name);
        current = current.parent;
      }
      
      tooltip.html(`
        <div><strong>${d.data.name}</strong></div>
        <div>${path.join(' > ')}</div>
        ${d.data.value ? `<div>Value: ${d.data.value}</div>` : ''}
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    },
    
    handleMouseOut(event) {
      // Reset the segment style
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .attr('fill-opacity', d => d.children ? 0.7 : 0.9)
        .attr('stroke-width', 0.5);
      
      // Remove tooltip
      d3.selectAll('.sunburst-tooltip').remove();
    }
  }
};
</script>

<style scoped>
.sunburst-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sunburst-chart {
  position: relative;
}

.lyric-display {
  background-color: #f8f9fa;
  border-radius: 8px;
  max-width: 500px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Make breadcrumb items clickable */
.breadcrumb-item {
  cursor: pointer;
}
.breadcrumb-item:hover {
  text-decoration: underline;
}
</style>
