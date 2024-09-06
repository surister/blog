<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
</script>

<template>
  <v-divider thickness="3" style="color:white"/>

  <span class="t bg-gray" style="position: relative">
         <code><pre class="pa-5"><span
             v-html="hljs.highlight(value, {language: 'json'}).value"></span></pre>
         </code>
  </span>
</template>

<style>
.bg-gray {
  background-color: #1f2024
}

.t pre {
  background-color: #1f2024;
}
</style>