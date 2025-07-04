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
  <v-dialog max-width="70%">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps"
             class="my-2"
             color="surface-variant"
             text="Expand"
             size="small"
             variant="outlined"/>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card color="red">
        <Line :data="config.chartData"
          :options="config.chartOptions"
          :plugins="config.plugins"/>

        <v-card-actions>
          <v-btn @click="isActive.value = false"
                 class="font-weight-bold">
            <template #default><span class="fm">close</span></template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <div >
    <Line :data="config.chartData"
          :options="config.chartOptions"
          :plugins="config.plugins"/>
  </div>
</template>

<style scoped>

</style>