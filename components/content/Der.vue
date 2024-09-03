<script setup lang="ts">
import {useRoute} from "vue-router";

const props = defineProps({
  r: {
    type: String,
  },
  link: {
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
  <p :class="{highlighted: '#'+ r === current_hash, 'references': true}"
     style="margin-top: 0; font-size: 15px">
    <span :id="r" class="text-subtitle-1 font-weight-bold" style="color: #EF5350">[{{ r }}]</span>
    {{ link }}
  </p>
</template>

<style scoped>
.highlighted {
  background-color: rgba(239, 83, 80, 0.07);
}
</style>