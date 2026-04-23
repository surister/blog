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
  <div>
    <span v-html="bind"></span>
  </div>
</template>

<style scoped>

</style>
