<script setup lang="ts">

</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <header class="my-5 px-5 pt-5 elevation-4"
              style="background: rgba(52,56,65,0.39); border-top: 15px solid #EF5350">
        <h1 class="text-h3 font-weight-medium ms-n1">{{ doc.title }}</h1>
        <v-label class="text-h5">{{ doc.description }}</v-label>
        <v-row class="my-1" dense no-gutters>
          <v-col cols="auto">
            <h2>
              <v-btn variant="text"
                     prepend-icon="mdi-github"
                     href="https://github.com/surister"
                     target="_blank">Surister
              </v-btn>
            </h2>
          </v-col>
          <v-col align-self="center">
            <v-card-subtitle><span class="text-subtitle-1 font-weight-bold"> · 29/02/2024</span></v-card-subtitle>
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

  <div class="mt-5">
    <div class="text-h4 mb-2">React to this article.</div>
    <span class="">
      <v-chip class="text-h4" style="background-color: rgba(239,83,80,0.13)" variant="text" size="x-large"
              @click="console.log('yo')">🦧</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🗣🔥🔥</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🤔</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🖕</v-chip>
    </span>
  </div>
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

.h {
  font-size: 20px;
  background: rgb(52, 56, 65);
  padding: .20rem .25rem;
  border-radius: 10px;
  margin-right: 1px;
  margin-left: 1px;
}
</style>