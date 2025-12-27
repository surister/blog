<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps({
  r: {
    type: String
  },

  authors: {
    type: String
  },

  pageTitle: {
    type: String
  },

  websiteTitle: {
    type: String
  },

  dateAccessed: {
    type: String
  },

  publicationDate: {
    type: String
  },

  link: {
    type: String
  },

  text: {
    type: String
  },

  meta: {
    type: String
  }
})

const route = useRoute();
const current_hash = ref(route.hash)

watch(route, (to) => {
  current_hash.value = to.hash
})
</script>

<template>
  <cite>
    <p :class="{highlighted: '#'+ r === current_hash, 'references': true}"
       class="text-subtitle-1 mt-1">

      <!--   Cite number   -->
      <a :id="r"
         class="text-subtitle-1 font-weight-bold"
         style="color: #EF5350">
        {{ r }}.
      </a>

      <!--   Cite arrow back ref   -->
      <a :href="`#${r}-ref`" class="mb-3">
        <v-icon icon="mdi-arrow-up" size="x-small" href="#1"/>
      </a>

      <!--   Author names   -->
      <span>
        {{ authors || 'MISSING AUTHOR NAMES' }}
      </span>

      <!--   Page title   -->
      <span v-if="pageTitle">
        "{{ pageTitle }}"
      </span>

      <!--   Website title   -->
      <span v-if="websiteTitle">
        {{ websiteTitle }}
      </span>

      <!--   Date accessed   -->
      <span v-if="dateAccessed">
        Accessed: {{ dateAccessed }}
      </span>

      <span v-if="publicationDate">
        {{ publicationDate }}
      </span>

      <!--   Link, if any  -->
      <span v-if="link">
        [Online.] Available:
       <a :href="link"
          target="_blank"
          style="word-break: break-all"
          class="text-medium-emphasis"
          :class="[link ? 'text-decoration-underline' : '']">
        <span class="text-break font-italic">
          {{ link }}
        </span>
       </a>
     </span>
    </p>
  </cite>
</template>

<style scoped>
.highlighted {
  background-color: rgba(239, 83, 80, 0.07);
}
</style>