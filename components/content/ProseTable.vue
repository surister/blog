<script setup lang="ts">

const props = defineProps(
    {
      headers: {},
      rows: {},
      data: {}
    }
)
</script>

<template>
  <v-table
      class="rounded-lg"
      density="compact"
      :hover="true">
    <slot/>
  </v-table>
</template>

<style>
div.v-table > div > table> thead > tr > th{
    background: #212121;
}
table tbody {
  background-color: #212121
}
</style>