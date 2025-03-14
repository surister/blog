<script setup lang="ts">
const props = defineProps({
  author: {},
  text: {},
  src: {},
  alert_type: {
    type: String,
    default: "info"
  },
  icon: {
    type: String
  },
  alert_bd_color: {},
  e_link: {
    type: String
  }
})
</script>

<template>
  <v-banner
      class="my-4"
      :bg-color="alert_type"
      :icon="icon"
      :lines="author ? 'four' : 'one'"
      elevation="5"
      rounded
  >
      <v-banner-text >
        <span class="font-weight-bold text-subtitle-1">{{ text }}</span>
        <p class="font-weight-bold font-italic" v-if="author">{{ author }}</p>
      </v-banner-text>

      <template v-slot:actions v-if="src">
        <v-btn prepend-icon="mdi-open-in-new">SOURCE</v-btn>
      </template>
    </v-banner>


</template>

<style scoped>

</style>