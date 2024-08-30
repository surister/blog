<script setup lang="ts">

import {CodeEditor} from "magic-code-editor";
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <header class="my-5 px-5 pt-5" style="background: rgba(52,56,65,0.39); border-radius: 20px">
        <h1 class="text-h2 font-weight-medium mb-3 ms-n1">{{ doc.title }}</h1>
        <h2>{{ doc.description }}</h2>
        <v-row class="my-1" dense no-gutters>
          <v-col cols="auto">
            <h2>
              <v-btn variant="outlined" prepend-icon="mdi-github" href="https://github.com/surister"
                     target="_blank">Surister
              </v-btn>
            </h2>
          </v-col>
          <v-col align-self="center">
            <v-card-subtitle><span class="text-subtitle-1 font-weight-bold">· 29/02/2024</span></v-card-subtitle>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <v-row class="mt-0">
          <v-col>
            <v-chip variant="outlined" class="mr-3" v-for="tag in doc.tags">{{ tag }}</v-chip>
          </v-col>
        </v-row>
        <v-divider class="my-5"/>
      </header>
      <main>
        <ContentRenderer :value="doc"/>
      </main>
    </article>
  </ContentDoc>
</template>

<style>
main p {
  font-size: 25px;
  margin-top: 20px;
  line-height: 30px;
}

main h2 {
  margin-top: 30px;
  margin-bottom: 30px;
}

main ul {
  font-size: 25px;
  margin-left: 50px;
  margin-top: 25px;
  margin-bottom: 25px;
}

.code {
  background: rgb(52, 56, 65);
  padding: 3px .50rem;
  border-radius: 10px;
}
</style>