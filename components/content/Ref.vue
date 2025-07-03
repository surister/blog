<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps({
  r: {
    type: String
  }
})


</script>

<template>
  <a :href="`#${r}`" :id="`${r}-ref`">
    <sup class="text-subtitle-2" style="color: #ef6e6b">[{{ r }}]</sup>
  </a>
</template>

<style scoped>

</style>