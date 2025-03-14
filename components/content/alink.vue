<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
  },
  text: {
    type: String
  },
  url: {
    type: String
  },
  color:{
    type: String,
    default: '#F44336'
  }
})
</script>

<template>
<a :style="{'color': color}"
   :href="url"
   class="a-tag"
  target="_blank">
  {{ text }}
</a>
</template>

<style>
.a-tag:hover {
  color: beige;
}
</style>