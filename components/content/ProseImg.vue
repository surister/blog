<script setup lang="ts">
import is from "@sindresorhus/is";
import undefined = is.undefined;

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  max_width:{
    type: Number,
    default: 720
  }
})

</script>

<template>
  <component
      is="img"
      :src="src"
      :alt="alt"
      :style="{
          maxWidth: max_width ? max_width + 'px' : undefined,
          width: width ? width + 'px' : undefined,
          height: height ? height + 'px' : undefined
  }"
  />
</template>

<style scoped>

</style>