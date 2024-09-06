<script setup lang="ts">
import {CodeEditor} from "magic-code-editor";
import 'magic-code-editor/style.css'

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python)
const copied = ref(false)

function copyToClipboard(text){
  navigator.clipboard.writeText(text).then((res) => {
    copied.value = true
    setTimeout(()=>{
      copied.value = false
    }, 2500)
  })
}
</script>

<template>
  <CodeEditor :text="value"
              :show-line-number="false"
              class="mt-5"
              border-radius="0"
              highlight-row-background-color="red"
              header-background-color="#EF5350"
              header-text=""
              :show-border-top="false"
              background-color="#1f2024"
              show-header
              read-only
              :highlight="(text) => hljs.highlight(value, {language: 'python'}).value">
    <template #appendText>
      <v-btn variant="outlined" :color="copied ? 'success' : ''" style="border-radius: 5px"
             :icon="copied ? 'mdi-check' : 'mdi-content-copy'" size="x-small"
             @click="copyToClipboard(value)">
      </v-btn>
    </template>
  </CodeEditor>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/vs2015.min.css';
</style>
