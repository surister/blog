<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
  subtitle: String,
  href: String
})
</script>

<template>
  <v-card
      prepend-avatar="https://media.licdn.com/dms/image/v2/D4D03AQEFN72iCT02Yw/profile-displayphoto-shrink_200_200/B4DZdGYtEPHkAY-/0/1749232571270?e=1756339200&v=beta&t=8OM7RaXEKs9JklGIojmwIFkghOQi8aXyyin91Vjileg"
      class="mx-auto"
      rel="noopener"
      target="_blank"
      max-width="300"
      href="https://github.com/surister"
      :title="title"
      :subtitle="subtitle"
      variant="text"
      density="compact"
  ></v-card>
</template>

<style scoped>

</style>