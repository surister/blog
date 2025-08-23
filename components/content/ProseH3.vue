<script setup lang="ts">
const props = defineProps({
  id: {},
})
</script>

<template>
  <h3 class="font-weight-medium" :id="id">
    <a :href="`#${id}`" >
      <span class="text-red text-h5">
      <slot/>
    </span>
    </a>
  </h3>

</template>

<style scoped>

</style>