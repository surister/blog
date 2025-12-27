<script setup lang="ts">
const props = defineProps({
  r: {
    type: String
  }
})


</script>

<template>
  <a :href="`#${r}`" :id="`${r}-ref`">
    <span class="text-red">[{{ r }}]</span>
  </a>
</template>

<style scoped>

</style>