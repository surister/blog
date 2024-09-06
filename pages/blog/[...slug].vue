<script setup lang="ts">

</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <header class="elevation-4"
              style="background: rgba(52,56,65,0.39);
                 border-top: 15px solid #EF5350">
        <v-container max-width="60%">
          <v-row>
            <v-col cols="6" align-self="end">
              <h1 class="text-h3 font-weight-medium ms-n1">{{ doc.title }}</h1>
              <v-row class="position-sticky bottom-0 mt-5" dense no-gutters>
                <v-col cols="auto">
                  <v-btn variant="text"
                         prepend-icon="mdi-github"
                         href="https://github.com/surister"
                         target="_blank">Surister
                  </v-btn>
                  <span class="text-subtitle-1 font-weight-bold text-grey-lighten-1"><span
                      class="mr-4">·</span>29/02/2024</span>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
              <v-label class="text-h5 text-wrap mt-3">{{ doc.description }}</v-label>
            </v-col>
            <v-col cols="6" align-self="center">
              <v-img :src="doc.image"/>
            </v-col>
          </v-row>
        </v-container>
      </header>
      <v-container max-width="60%">
        <main>
          <ContentRenderer :value="doc"/>
        </main>
      </v-container>
    </article>
    <v-container max-width="60%">
      <div class="mt-5">
          <span>
      <v-chip class="text-h4"
              style="background-color: rgba(239, 83, 80, 0.13)"
              variant="text"
              size="x-large"
              @click="console.log('yo')">🦧</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🗣🔥🔥</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🤔</v-chip>
      <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🖕</v-chip>
    </span>
      </div>
    </v-container>
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