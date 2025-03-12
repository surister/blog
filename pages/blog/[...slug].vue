<script setup lang="ts">
import Header from "~/components/slug/Header.vue";
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <v-container fluid>
        <v-row>
          <v-col class="v-col-xxl-3 v-col-xl-3 v-col-lg-3 v-col-md-3 v-col-xs-auto v-col-sm-12"></v-col>
          <v-col class="v-col-lg-6 v-col-auto">
            <Header :doc="doc"></Header>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid>
        <v-row no-gutters class="justify-md-center justify-start justify-lg-start">
          <v-col class="v-col-xxl-3 v-col-xl-3 v-col-lg-3 v-col-md-3 v-col-xs-auto v-col-sm-12 ">
            <div style="top: 50px" class="position-sticky">
              <v-container>
                <Toc></Toc>
              </v-container>
            </div>
          </v-col>
          <v-col class="v-col-xl-auto v-col-lg-7 v-col-md-auto v-col-sm-12 v-col-xs-12">
            <v-alert
                v-if="!doc.published"
                density="compact"
                max-width="860"
                text="This article is incomplete, it will most likely contain wrong data, typos, lack of references and/or unfinished paragraphs."
                title="Warning: This is a work in progress and is not yet published."
                type="warning"/>
            <main style="max-width: 860px">
              <ContentRenderer :value="doc"/>
            </main>
          </v-col>
          <v-col class="v-col-xxl-3 v-col-xl-3 v-col-lg-3 v-col-md-3 v-col-xs-auto v-col-sm-12"></v-col>
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
  font-size: 19px;
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
  font-size: 19px;
  margin-left: 50px;
  margin-top: 25px;
  margin-bottom: 25px;
}

.h {
  font-size: 19px;
  background: rgb(52, 56, 65);
  padding: .20rem .25rem;
  border-radius: 5px;
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
</style>