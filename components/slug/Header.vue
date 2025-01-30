<script setup lang="ts">
const props = defineProps(['doc'])
</script>

<template>
  <header>
    <h1 class="text-h2 ms-n1 text-red">{{ doc.title }}</h1>

    <v-row class="position-sticky bottom-0 mt-5" dense no-gutters align="center"
           align-content="center">
      <v-col cols="auto" align-self="center">
              <span class="text-subtitle-1 font-weight-bold text-grey-lighten-1">
                29/02/2024
              </span>
        <span class="pl-1">·</span>
        <elink type="comment" :text="link.name" class="mb-1"
               v-for="link in doc.comment_links"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <p class="text-subtitle-2 text-red">Written by</p>
      </v-col>
    </v-row>

    <v-row>
      <template v-for="author in doc.authors">
        <v-col>
          <PersonCard :title="author.name" :subtitle="author.job_title"/>
        </v-col>
      </template>
      <v-col></v-col>
      <v-spacer></v-spacer>
      <v-divider></v-divider>
    </v-row>
    <v-spacer></v-spacer>

  </header>
</template>

<style scoped>

</style>