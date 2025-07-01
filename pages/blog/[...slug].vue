<script setup lang="ts">
import Header from "~/components/slug/Header.vue";

const scrollTop = () => {
  window.scrollTo({top: 0,})
}
let showScrollUp = ref(false)
let isTocFixed = ref(false)

const handle = (_) => {
  showScrollUp.value = window.scrollY >= 500;
  isTocFixed.value = window.scrollY >= 200;
}

onMounted(() => {
  window.addEventListener('scroll', handle)
})

</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <v-container fluid>
        <v-row justify="center"
               no-gutters>

          <!--  TABLE OF CONTENTS  -->
          <div style="
               position: fixed;
               animation: ease;
               transition: all .5s;
               left: 50px;
               z-index: 1000;"
               :style="{top: isTocFixed ? '100px' : '300px'}"
               ref="toc"
               class="hidden-md hidden-sm hidden-xs">
            <Toc></Toc>
          </div>

          <!--  CONTENT  -->
          <v-col cols="auto">

            <div class="max-w-720px">

              <!--  BLOG HEADER  -->
              <Header :doc="doc" class="my-6"/>

              <v-alert v-if="!doc.published"
                       density="compact"
                       text="This article is incomplete, it will most likely contain wrong data, typos, lack of references and/or unfinished paragraphs."
                       title="Warning: This is a work in progress and is not yet published."
                       type="warning"/>

              <div class="mt-8 hidden-lg hidden-xl">
                <Toc class="text-h1"></Toc>
              </div>

              <main ref="main">
                <ContentRenderer :value="doc"/>
              </main>

            </div>

          </v-col>

        </v-row>
      </v-container>
    </article>
    <v-container>
      <div class="mt-5">
        <!--        <span>-->
        <!--      <v-chip class="text-h4"-->
        <!--              style="background-color: rgba(239, 83, 80, 0.13)"-->
        <!--              variant="text"-->
        <!--              size="x-large"-->
        <!--              @click="console.log('yo')">🦧</v-chip>-->
        <!--          <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🗣🔥🔥</v-chip>-->
        <!--          <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🤔</v-chip>-->
        <!--          <v-chip class="text-h4" variant="text" size="x-large" @click="console.log('yo')">🖕</v-chip>-->
        <!--        </span>-->
      </div>
    </v-container>
    <v-btn class="hidden-xs scroll-to-top"
           style="transition: all 10s"
           @click="scrollTop"
           icon="mdi-arrow-up"
           v-if="showScrollUp">
    </v-btn>
  </ContentDoc>

</template>

<style>
.max-w-720px {
  max-width: 720px;
}

.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
  transition: all 10s;
}

a {
  /* Removes link color and underline */
  color: inherit;
  text-decoration: inherit;
}

main p {
  font-size: 1.3rem;
  margin-top: 20px;
  line-height: 30px;
}


main h2 {
  margin-top: 30px;
  margin-bottom: 30px;
}

main h3 {
  margin-top: 30px;
  margin-bottom: 30px;
}

main h4 {
  margin-top: 30px;
  margin-bottom: 30px;
}

main ul {
  font-size: 1.188rem;
  margin-left: 18px;
  margin-top: 5px;
  margin-bottom: 25px;
  list-style-type: circle;
}

.h {
  font-size: 1rem;
  background: rgb(52, 56, 65);
  padding: .05rem .20rem;
  border-radius: 5px;
  word-wrap: break-word;
}

#toc-container {
  margin-left: 20px;
}

#toc-title {
  font-size: 20px;
  font-weight: bold;
}

.ct table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 2px solid red;
  text-align: center;
  text-justify: distribute;
}

th,
td {
  padding: 5px;
}

ol {
  font-size: 1.1rem;
  list-style: decimal;
  margin-left: 20px;
  margin-top: 5px
}

html {
  scroll-behavior: smooth;
}


</style>