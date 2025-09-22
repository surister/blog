<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';

const props = defineProps(
    {
      'hasSyntaxHighlighting': {
        'type': Boolean,
        default: false
      }
    }
)

if (props.hasSyntaxHighlighting){
  hljs.registerLanguage('bash', bash);
}

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
</script>

<template>
  <div class="bg-gray rounded-b-lg">
         <code><pre class="pa-4 rounded-b-lg" style="overflow: scroll"><span
             v-html="hasSyntaxHighlighting ? hljs.highlight(value, {language: 'bash'}).value : value"></span></pre>
         </code>
  </div>
</template>

<style>
.bg-gray pre {
  background-color: #212121;
}
</style>