<script setup lang="ts">

</script>

<template>
  <div style="background-color: #EF5350; height: 20px"></div>
  <v-container>
    <h2>Last entries</h2>
    <ContentList path="/blog/" v-slot="{ list }">
      <v-card v-for="article in list"
              :key="article._path"
              variant="outlined"
              link
              :href="article._path"
              elevation="10"
              class="my-4 pa-5">
        <v-row no-gutters>
          <v-col cols="3" align-self="center">
            <v-img
                aspect-ratio="16/9"
                cover
                :src="article.image"/>
          </v-col>
          <v-col cols="9">
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-subtitle>
              <v-chip v-for="tag in article.tags" class="mr-1" variant="outlined">{{ tag }}</v-chip><br>
            </v-card-subtitle>
            <div class="mt-3 ml-5"><span style="color: #EF5350">24-2-2002</span></div>
            <v-card-text style="padding-top: .50rem !important;">
              {{ article.description }}
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </ContentList>
  </v-container>
</template>

<style scoped>

</style>