<script setup lang="ts">
import Header from "~/components/slug/Header.vue";
</script>

<template>
  <ContentDoc v-slot="{ doc }">
    <article>
      <v-container fluid>
        <Header :doc="doc"></Header>
      </v-container>
      <v-container fluid>
        <v-row no-gutters>
          <v-col class="v-col-lg-3 v-col-xl-3 v-col-xxl-3">
            <div style="top: 50px" class="position-sticky">
              <v-container>
                <Toc></Toc>
              </v-container>
            </div>
          </v-col>
          <v-col class="v-col-lg-6 v-col-auto">
            <main>
              <ContentRenderer :value="doc"/>
            </main>
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
  padding: .25rem .30rem;
  border-radius: 10px;
}

#toc-title {
  font-size: 20px;
  font-weight: bold;
}
</style>