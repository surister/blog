<script setup lang="ts">
const props = defineProps({
  author: {},
  text: {},
  src: {},
  alert_type: {
    type: String,
    default: "info"
  },
  alert_icon: {},
  alert_bd_color: {},
  e_link: {
    type: String
  }
})
</script>

<template>
  <v-banner
      class="my-4 text-subtitle-1"
      elevation="5"
      rounded
      density="compact"
      :bg-color="alert_type"
      :icon="alert_icon">
    <template #prepend>
      <v-icon size="45">mdi-format-quote-close</v-icon>
    </template>
    <template #text>
      <p>{{ text }}</p>
      <p class="font-weight-bold font-italic">{{ author }}</p>
    </template>

    <template v-slot:actions v-if="src">
      <v-btn prepend-icon="mdi-open-in-new" :href="src">Source</v-btn>
    </template>
  </v-banner>

</template>

<style scoped>

</style>