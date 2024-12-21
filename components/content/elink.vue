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
  <v-btn :prepend-icon="icon"
         variant="text"
         color="red"
         target="_blank"
         :href="url"
         link>
      <span class="font-weight-bold"
            style="font-size:15px">
        {{ text }}
      </span>
  </v-btn>
</template>

<style scoped>

</style>