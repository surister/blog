<script setup lang="ts">
const props = defineProps({
  text: {
    type: String
  },
  href: {
    type: String
  },
  color:{
    type: String,
    default: '#F44336'
  },
  target:{
    type:String,
    default: "_blank"
  }
})
</script>

<template>
  <NuxtLink
      class="text-decoration-underline"
      :style="{'color': color}"
      :href="href"
      :target="props.target">
    <slot/>{{ text }}
  </NuxtLink>

</template>

<style>
.a-tag:hover {
  color: beige !important;
}
</style>