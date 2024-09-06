<template>
  <v-toolbar>
    <template #title>
      <h3 class="font-weight-blac text-uppercase"><a href="/">Surister's blog</a></h3>
    </template>
    <template #append>
      <span class="ma-2">
        <v-btn icon="mdi-github" class="mr-2" href="https://github.com/surister" target="_blank" style="border-radius: 0"></v-btn>
        <v-btn icon="mdi-head-question-outline" class="mr-2" href="/about" target="_blank" style="border-radius: 0"></v-btn>
      </span>
    </template>
  </v-toolbar>
  <NuxtPage/>
</template>

<style>
body {
  background-color: #121212;
}
</style>
<script setup lang="ts">
</script>