<script setup lang="ts">
import 'katex/dist/katex.min.css';
import katex from 'katex';
import {computed} from "vue";

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
const bind = computed(() => katex.renderToString(value, {throwOnError: false}))
</script>

<template>
  <div>
    <span v-html="bind"></span>
  </div>
</template>

<style scoped>

</style>
