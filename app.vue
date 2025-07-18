<template>
  <v-toolbar color="#121212" border>

    <template #title>
      <v-container fluid style="max-width: 720px;" class="pl-lg-14 pl-md-14">
        <v-row>
          <v-col class>
            <div class="font-weight-bold text-uppercase text-h7">
              <a href="/">Surister's dev blog</a>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <template #append>
      <span class="ma-1">
        <v-btn icon="mdi-github"
               class="mr-1"
               href="https://github.com/surister"
               target="_blank"/>
        <v-btn icon="mdi-head-question-outline"
               class="mr-1"
               href="/about"
               target="_blank"/>
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
  font-family: Rubik, Roboto;
  font-weight: 300;
}

.v-toolbar__content > .v-toolbar-title {
  margin-inline-start: 0px !important;
}

</style>

<script setup>

</script>