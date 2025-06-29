<script setup lang="ts">
const props = defineProps(['doc'])
</script>

<template>
  <header class="text-sm-center text-center text-md-start">
    <h1 class="text-h3 ms-n1 text-red">{{ doc.title }}</h1>
    <v-row class="bottom-0 mt-5">
      <v-col cols="auto" align-self="center">
              <span class="text-subtitle-1 font-weight-bold text-grey-lighten-1">
                {{ doc.published_date || 'date_unpublished' }}
              </span>
        <span class="pl-1" v-if="doc.comment_links">·</span>
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