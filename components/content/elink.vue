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
  <v-badge icon="mdi-open-in-new" color="white" class="mr-2">
    <v-btn :prepend-icon="icon"
           size="small"
           variant="outlined"
           target="_blank"
           link>
      <span class="font-weight-bold"
            style="font-size:15px">
        {{ text }}
      </span>
    </v-btn>
  </v-badge>

</template>

<style scoped>

</style>