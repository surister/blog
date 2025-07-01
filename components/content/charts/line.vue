<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {color} from 'chart.js/helpers';
import {Line} from 'vue-chartjs'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#ffffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

let props = defineProps({
  chartProps: {
    required: true
  },
})

let config = {
  plugins: [
    plugin
  ],
  chartData: {
    "labels": props.chartProps.labels,
    "datasets": props.chartProps.datasets
  },
  chartOptions: {
    responsive: true,
    scales: {
      x: {
        display: false
      }
    },
    plugins: {
      title: {}
    }
  }
}
</script>

<template>
  <div>
    <Line :data="config.chartData" :options="config.chartOptions" :plugins="config.plugins"/>
  </div>
</template>

<style scoped>

</style>