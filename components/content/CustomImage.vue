<script setup lang="ts">
import {useBreakpoints, breakpointsVuetifyV3} from "@vueuse/core";

const props = defineProps({
  src: {
    type: String
  },
  label: {
    type: String
  },
  height: {
    type: Number
  },
  width: {
    type: Number
  },
  maxwidth: {
    type: String
  },
  marginTop: {
    type: String,
    default: '0'
  },
  alt: {
    type: String
  },
  roundedTop: {
    type: String,
    default: 'false'
  },
  roundedBottom: {
    type: String,
    default: 'false'
  }
})
const breakpoints = useBreakpoints(breakpointsVuetifyV3)
const largerThanSm = breakpoints.greater('sm')
</script>

<template>
  <v-img aspect-ratio="16/9"
         :class="[roundedTop === 'true' ? 'rounded-t-lg':
              '',
             roundedBottom === 'true' ? 'rounded-b-lg': '']"
         :height="height"
         :width="width"
         :max-width="maxwidth"
         :src="src"
         :style="{'marginTop': marginTop + 'px'}"
         :alt="alt"
         cover/>
  <v-label class="text-subtitle-2 font-italic pt-2"
           style="white-space: pre-wrap">
    {{ alt }}
  </v-label>
</template>

<style scoped>

</style>