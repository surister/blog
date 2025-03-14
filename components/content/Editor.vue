<script setup lang="ts">
import {CodeEditor} from "magic-code-editor";
import 'magic-code-editor/style.css'

const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('python', python)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('sql', sql)

const props = defineProps(
    {
      'hasResult': {
        'type': Boolean,
        default: false
      },
      'lang': {
        type: String,
        default: 'shell'
      },
      'header_text': {
        type: String
      }
    }
)

const copied = ref(false)

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then((_) => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  })
}

</script>

<template>
  <CodeEditor :text="value"
              :show-line-number="false"
              :class="['mt-5', 'rounded-t-lg', hasResult ? '' : 'rounded-b-lg']"
              highlight-row-background-color="red"
              background-color="#212121"
              padding-bottom="10"
              padding-top="10"
              read-only
              :prepend-inline="true"
              :highlight="(text) => hljs.highlight(text, {language: lang}).value">
    <template #appendText>
      <v-btn variant="outlined" :color="copied ? 'success' : ''" style="border-radius: 5px"
             :icon="copied ? 'mdi-check' : 'mdi-content-copy'" size="x-small"
             @click="copyToClipboard(value)">
      </v-btn>
    </template>
  </CodeEditor>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
</style>
