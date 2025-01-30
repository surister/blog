<script setup lang="ts">
import {computed} from "vue";
import katex from "katex";

const props = defineProps(['text'])
const bind = computed(() => katex.renderToString(props.text, {throwOnError: false}))
</script>

<template>
  <div>
    <span v-html="bind"></span>
  </div>
</template>

<style scoped>

</style>