<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps({
  r: {
    type: String,
  },
  link: {
    type: String
  },
  text: {
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
  <p :class="{highlighted: '#'+ r === current_hash, 'references': true}" class="text-subtitle-1">
    <span :id="r" class="text-subtitle-1 font-weight-bold" style="color: #EF5350">[{{ r }}]</span>
    <a v-if="link"
        :href="link"
       target="_blank"
       style="word-break: break-all"
       class="text-medium-emphasis text-decoration-underline">
      {{ link }}
    </a>
    <span v-else>
      {{ text }}
    </span>
  </p>
</template>

<style scoped>
.highlighted {
  background-color: rgba(239, 83, 80, 0.07);
}

</style>