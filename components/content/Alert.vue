<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Note'
  },
  type: {
    type: String,
    default: "success"
  },
  icon: {
    type: String,
    default: ''
  },
})
</script>

<template>
  <v-alert :title="title" :text="text" :icon="icon" :color="type" variant="tonal"/>
</template>

<style scoped>

</style>