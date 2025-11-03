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
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
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
      :alt="props.alt"
      :style="{
        maxWidth: props.max_width + 'px',
        height: props.height + 'px',
        width:props.width + 'px'
      }"
  />
</template>

<style scoped>

</style>