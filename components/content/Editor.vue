<script setup lang="ts">
import {CodeEditor} from "magic-code-editor";
import 'magic-code-editor/style.css'

// const slots = useSlots();
// const value = slots.default()[0].children.default()[0].children;

import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python'
import rust from 'highlight.js/lib/languages/rust'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('python', python)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('js', javascript)

const props = defineProps(
    {
      text: {},
      code: {
        type: String,
        default: ""
      },
      hasResult: {
        type: Boolean,
        default: false
      },
      language: {
        type: String,
        default: 'shell'
      },
      filename: {
        type: String,
        default: ""
      },
      meta: {},
      highlights: {}
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
<!--  This is a hack to modify only the top border radius, since the property
 :radius of the CodeEditor component applies it to the whole thing,
 unfortunately.

:border-radius="meta === 'true' ? '8':'8'"
:style="{borderRadius: meta === 'true' ? 0: null}"
-->


<!--  We remove the last character of code, because for some reason a \n is added, don't know why -->
  <CodeEditor :text="code.substring(0, code.length - 1)"
              :show-line-number="false"
              :class="['mt-5', 'rounded-t-lg', meta === 'true' ? '' : 'rounded-b-lg']"
              :show-header="filename !== ''"
              :header-text="filename"
              :border-radius="meta === 'true' ? '8':'8'"
              :style="{borderRadius: meta === 'true' ? 0: null}"
              highlight-row-background-color="red"
              background-color="#212121"
              padding-bottom="12"
              padding-top="12"
              code-font-size="16"
              read-only
              :highlight="(t) => hljs.highlight(t, {language: language}).value">
    <template #appendText>
      <v-btn variant="outlined"
             :color="copied ? 'success' : ''"
             :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
             style="border-radius: 5px"
             size="x-small"
             @click="copyToClipboard(code)">
      </v-btn>
    </template>
  </CodeEditor>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css';
</style>
