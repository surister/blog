<template>
  <v-toolbar color="#121212">
    <template #title>
      <v-row class="justify-md-center justify-sm-start">
        <v-col class="v-col-sm-5 v-col-6 v-col-md-5 v-col-lg-6">
          <h3 class="font-weight-bold text-uppercase ml-lg-5 ml-sm-16 ml-md-16 ml-xs-0"><a href="/">Surister's dev blog</a></h3>
        </v-col>

      </v-row>
    </template>
    <template #append>
      <span class="ma-2">
        <v-btn icon="mdi-github" class="mr-2" href="https://github.com/surister" target="_blank"
               style="border-radius: 0"></v-btn>
        <v-btn icon="mdi-head-question-outline" class="mr-2" href="/about" target="_blank"
               style="border-radius: 0"></v-btn>
      </span>
    </template>
  </v-toolbar>
  <NuxtPage/>
</template>

<style>
body {
  background-color: #121212;
}

* {
  font-family: Rubik, serif;
  font-weight: 300;
}
</style>
<script setup lang="ts">
</script>