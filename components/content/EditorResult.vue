<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
</script>

<template>
  <v-divider thickness="3"/>
  <span class="t text-grey-lighten-1" style="position: relative; ">
      <code>
        kd
        {{ hljs.highlight(value, {language: 'python'}).value }}
      </code>
  </span>
</template>

<style>
.t pre {
  background-color: #1f2024;
  padding: 20px;
}
</style>