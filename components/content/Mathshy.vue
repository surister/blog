<script setup>
import 'katex/dist/katex.min.css';
import katex from 'katex';
import {computed} from "vue";

const slots = useSlots();

function readChildren(node) {
  if (!node) {
    return ''
  }

  if (typeof node === 'string') {
    return node
  }

  if (Array.isArray(node)) {
    return node.map(readChildren).join('')
  }

  if (typeof node.default === 'function') {
    return readChildren(node.default())
  }

  if (Array.isArray(node.default)) {
    return readChildren(node.default)
  }

  if (typeof node.children === 'function') {
    return readChildren(node.children())
  }

  if (node.children && typeof node.children.default === 'function') {
    return readChildren(node.children.default())
  }

  if (node.children && Array.isArray(node.children.default)) {
    return readChildren(node.children.default)
  }

  return readChildren(node.children)
}

const value = computed(() => {
  const content = slots.default ? slots.default() : []
  return readChildren(content).trim()
})

const bind = computed(() => katex.renderToString(value.value, {throwOnError: false}))
</script>

<template>
  <div class="text-h5">
    <span v-html="bind"/>
  </div>
</template>

<style scoped>
.mathshy {
  font-size: clamp(1.25rem, 1.1rem + 0.7vw, 1.8rem);
}
</style>
