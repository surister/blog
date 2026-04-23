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
const props = defineProps({
  title: 'Final formula',
  caption: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'default',
  },
})

const toneMap = {
  default: {
    border: '#7c8aa5',
    soft: 'rgba(124, 138, 165, 0.12)',
  },
  success: {
    border: '#2e8b57',
    soft: 'rgba(46, 139, 87, 0.12)',
  },
  info: {
    border: '#4682b4',
    soft: 'rgba(70, 130, 180, 0.12)',
  },
  warning: {
    border: '#daa520',
    soft: 'rgba(218, 165, 32, 0.14)',
  },
}
</script>

<template>
  <div class="formula-card-wrap">
    <v-card
      class="formula-card"
      rounded="xl"
      theme="success"
      color="info"
      variant="tonal"
    >
      <v-card-title>
        <p
        v-if="title"
        class="formula-card__title text-overline"
      >
        {{ title }}
        </p>
      </v-card-title>
      <v-card-text>
        <div class="formula-card__math">
          <span
            v-html="bind"
            class="text-white"
          ></span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.formula-card-wrap {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.formula-card {
  display: inline-block;
  width: fit-content;
  max-width: 100%;
}

.formula-card__title {
  margin-bottom: 0.85rem;
  letter-spacing: 0.14em;
  color: var(--formula-accent);
  opacity: 0.9;
}

.formula-card__math {
  display: flex;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  padding: 0.35rem 0;
  font-size: clamp(1.1rem, 1rem + 0.65vw, 1.55rem);
}

@media (max-width: 600px) {
  .formula-card {
    max-width: 100%;
  }
}
</style>
