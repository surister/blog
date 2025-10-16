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
      prepend-avatar="/img/me.jpg"
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