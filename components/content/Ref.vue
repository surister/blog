<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps({
  r: {
    type: String
  }
})


</script>

<template>
  <a :href="`#${r}`" @click="">
    <sup class="text-subtitle-1 font-weight-bold" style="color: #EF5350">{{ r }}</sup>
  </a>
</template>

<style scoped>

</style>