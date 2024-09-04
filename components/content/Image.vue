<script setup lang="ts">
const props = defineProps({
  src: {
    type: String
  },
  label: {
    type: String
  },
  height: {
    type: String
  }
})
</script>

<template>
  <div>
    <v-img
        :aspect-ratio="1"
        class="bg-white"
        :src="props.src"
        :height="height"
        cover>
    </v-img>
    <v-label class="text-subtitle-2 font-italic" v-if="label">{{ label }}</v-label>
  </div>
</template>

<style scoped>

</style>