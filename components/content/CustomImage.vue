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
  alt:{
    type: String
  }
})
const breakpoints = useBreakpoints(breakpointsVuetifyV3)
const largerThanSm = breakpoints.greater('sm')
</script>

<template>
  <v-dialog max-width="80%" class="padding-0 ma-0" v-if="largerThanSm">
    <template v-slot:activator="{ props: activatorProps }">
      <v-img aspect-ratio="16/9"
             class="cursor-pointer"
             v-bind="activatorProps"
             :height="height"
             :width="width"
             :max-width="maxwidth"
             :src="src"
             :style="{'marginTop': marginTop + 'px'}"
             :alt="alt"
             cover/>
    </template>

    <template v-slot:default="{ isActive }">
      <v-expand-transition>
        <v-card>
          <v-card-text>
            <v-row justify="center" no-gutters>
              <v-col cols="8">
                <v-img aspect-ratio="16/9"
                       :src="src"
                       :alt="alt"
                       cover/>
              </v-col>
            </v-row>

          </v-card-text>


        </v-card>
      </v-expand-transition>
    </template>
  </v-dialog>
  <template v-else>
    <v-img aspect-ratio="16/9"
           :height="height"
           :width="width"
           :max-width="maxwidth"
           :src="src"
           :style="{'marginTop': marginTop + 'px'}"
           :alt="alt"
           cover/>
  </template>
  <v-label class="text-subtitle-2 font-italic pt-2"
           style="white-space: pre-wrap">
    {{ alt }}
  </v-label>
</template>

<style scoped>

</style>