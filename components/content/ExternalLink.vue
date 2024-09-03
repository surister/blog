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
  }
})
const icon = computed(() => `mdi-${props.type}`)
</script>

<template>
  <v-chip :prepend-icon="icon"
          size="small"
          variant="outlined"
          :href="url"
          target="_blank"
          link>
    <span class="font-weight-bold"
          style="font-size:15px">
      {{ text }}
    </span>
  </v-chip>
</template>

<style scoped>

</style>