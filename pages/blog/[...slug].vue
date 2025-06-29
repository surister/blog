<script setup lang="ts">
import Header from "~/components/slug/Header.vue";
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <v-container fluid>
        <v-row no-gutters class="justify-center justify-lg-start justify-sm-center justify-xs-center">

          <!--  TABLE OF CONTENTS  -->
          <v-col class="v-col-lg-3 v-col-md-3 v-col-xs-12">
            <div style="height: 350px" class="hidden-sm hidden-xs"></div>
            <div style="top: 50px" class="position-sticky">
              <v-container>
                <Toc></Toc>
              </v-container>
            </div>
          </v-col>

          <!--  CONTENT  -->
          <v-col style="background-color: rgba(0,128,0,0)"
                 class="v-col-xl-auto v-col-lg-7 v-col-md-7 v-col-sm-12 v-col-xs-12">
            <div style="max-width: 860px">

              <!--  BLOG HEADER  -->
              <Header :doc="doc" class="my-6"></Header>
              <v-alert
                  v-if="!doc.published"
                  density="compact"
                  text="This article is incomplete, it will most likely contain wrong data, typos, lack of references and/or unfinished paragraphs."
                  title="Warning: This is a work in progress and is not yet published."
                  type="warning"/>
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
  </ContentDoc>

</template>

<style>
a {
  /* Removes link color and underline */
  color: inherit;
  text-decoration: inherit;
}

main p {
  font-size: 1.188rem;
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
  margin-left: 50px;
  margin-top: 25px;
  margin-bottom: 25px;
}

.h {
  font-size: 1rem;
  background: rgb(52, 56, 65);
  padding: .05rem .20rem;
  border-radius: 5px;
  word-wrap: break-word;
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
</style>