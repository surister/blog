<script setup lang="ts">
const props = defineProps({
  src: {
    type: String
  },
  label: {
    type: String
  },
  height: {
    type: String
  },
  width: {
    type: String
  },
  marginTop: {
    type: String,
    default: '0'
  }
})
</script>

<template>
  <div>
    <v-img aspect-ratio="16/9"
           :height="height"
           :width="width"
           :src="src"
           :style="{'marginTop': marginTop + 'px'}"
           cover>
    </v-img>
    <v-label class="text-subtitle-2 font-italic pt-2">{{ label }}</v-label>
  </div>
</template>

<style scoped>

</style>