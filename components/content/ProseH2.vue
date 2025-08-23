<script setup lang="ts">
const props = defineProps({
  id: {},
})
</script>

<template>
  <h2 class="font-weight-medium" :id="id">
    <a :href="`#${id}`" >
      <span class="text-red text-h4">
      <slot/>
    </span>
    </a>
  </h2>

</template>

<style scoped>

</style>