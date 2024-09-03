<script setup lang="ts">

</script>

<template>
  <ContentList path="/blog" v-slot="{ list }">
    <v-card v-for="article in list"
            :key="article._path"
            variant="outlined"
            link
            :href="article._path"
            elevation="16"
            class="my-4">
      <v-card-title>{{ article.title }}</v-card-title>
      <v-card-subtitle>{{ article.description }}</v-card-subtitle>
    </v-card>
  </ContentList>
</template>

<style scoped>

</style>