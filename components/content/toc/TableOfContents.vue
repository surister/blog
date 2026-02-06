<template>
  <div v-if="toc">
    <span
      v-if="(toc && toc.links.length) || isTitleShownWithNoContent"
      id="toc-title"
      role="heading"
      aria-level="2"
    >{{ props.title }}</span>
    <ul
      v-if="toc && toc.links"
      id="toc-container"
      role="list"
      aria-labelledby="toc-title"
    >
      <li
        v-for="link in toc.links"
        :key="link.text"
        class="toc-topitem-and-sublist"
        role="listitem"
      >
        <div
          :id="`toc-item-${link.id}`"
          class="toc-item toc-topitem"
          :class="{ 'active-toc-item active-toc-topitem': activeTocIds.has(link.id) || link.id === lastVisibleHeading }"
          role="heading"
          aria-level="3"
        >
          <a
            :href="`#${link.id}`"
            class="toc-link toc-toplink"
            role="link"
          >{{
            link.text }}</a>
        </div>

        <ul
          v-if="isSublistShown && link.children && link.children.length"
          class="toc-sublist"
          role="list"
        >
          <li
            v-for="sublink in link.children"
            :key="sublink.id"
            class="toc-item toc-sublist-item"
            :class="{ 'active-toc-item active-toc-sublist-item': activeTocIds.has(sublink.id) || sublink.id === lastVisibleHeading }"
            role="listitem"
            aria-level="4"
          >
            <a
              :href="`#${sublink.id}`"
              class="toc-link toc-sublink"
              role="link"
            > {{ sublink.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useRoute } from '#imports'

const activeTocIds = ref<Set<string>>(new Set())
const lastVisibleHeading = ref<string>('')

const props = defineProps({
  toc: {
  },
  path: {
    type: String,
    default: '',
  },
  isSublistShown: {
    type: Boolean,
    default: true,
  },
  isTitleShownWithNoContent: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Table of Contents',
  },
})




const observeSections = () => {
  const options = {
    root: null,
    rootMargin: '0px 0px -80% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  }

  const callback: IntersectionObserverCallback = async (entries: IntersectionObserverEntry[]): Promise<void> => {
    entries.forEach((entry) => {
      const id: string = entry.target.id
      if (entry.isIntersecting) {
        lastVisibleHeading.value = id
        activeTocIds.value.add(id)
      }
      else {
        activeTocIds.value.delete(id)
      }
    })
  }

  const observer: IntersectionObserver = new IntersectionObserver(callback, options)
  const sections: NodeListOf<HTMLElement> = document.querySelectorAll('h2, h3')

  sections.forEach((section: HTMLElement) =>
    observer.observe(section))

  onUnmounted((): void => {
    sections.forEach((section: HTMLElement) =>
      observer.unobserve(section))
  })
}

onMounted((): void => {
  observeSections()
})
</script>

<style>
.active-toc-item {
 color: #fef08a
}

.toc-sublist-item {
  padding-left: 1rem;
}

a {
  text-decoration: none;
  color: inherit;
}

ul,
ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>