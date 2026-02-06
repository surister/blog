<script setup>
import {ref} from 'vue'

let part1 = "aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2lu"
let part2 = "L2l2YW4tc2FuY2hleg=="
let part3 = "LXZhbGVuY2lhLw=="

let showText = ref(false);

function de(s) {
  return window.atob(s)
}
</script>

<template>
  <v-container style="max-width: 720px">
    <h2 class="text-h4 text-red mt-2">Disclaimer</h2>
    <p class="">
      Views and opinions in this blog are entirely my own, they do not
      reflect any past, current or future employer's view.
    </p>
    <v-img src="/img/cantread.png" width="500px" class="mt-5"></v-img>
    <v-alert
        class="mt-5"
        text="Did I mentioned you or you would like to submit a correction? You can submit a Github Issue at https://github.com/surister/blog"
        variant="outlined"
        color="red"></v-alert>
    <h2 class="pt-4 text-red mt-2">Contact</h2>
    <v-divider/>
    <p class="mt-2">
      You can contact me at linkedin:
    </p>
    <v-btn class="my-3 text-red" size="small" variant="text" @click="showText=!showText">show url</v-btn>
    <p v-if="showText" class="my-3">
      {{ de(part1) }}{{ de(part2) }}{{ de(part3) }}
    </p>
    <h2 class="pt-10 pb-2 text-red" id="human">🌍🌳🧑 Humanely sourced 💚</h2>
    <v-divider/>

    <p class="mt-2">While it is almost impossible to scape LLM influence nowadays as it is being baked into every
      product, the content in this blog is painstakingly written by a human, and the information is
      human-experienced sourced.
    </p>
    <h2 class="pt-10 pb-2 text-red">References</h2>
    <v-divider/>

    <p class="mt-2">The references in this blog follow to the best of my sleep the IEEE
      <a target="_blank"
         class="text-blue"
         href="https://docs.google.com/document/d/1j1L96U2NagwWI9MEVDNVKt9pXxRzTH7h3krI3Mb6wZE/edit?usp=sharing">
        reference guide
      </a>
    </p>
    <h2 class="pt-10 pb-2 text-red">Third person about me.</h2>
    <v-divider/>
    <p class="text-h5 pt-2">[surister] believes in creating and sharing knowledge for free to
      further science and human development in a sustainable way. Even if it is just by centering
      divs.</p>
    <p class="text-h5"> A strong advocate of Open Science and Open Source, he has contributed
      to and worked with organizations aligned with these principles. He also enjoys mentoring
      engineers and helping them grow in their careers.</p>
    <p class="text-h5">
      Passionate about software engineering, he enjoys diving deep into technical details and has experience
      in web development, backend, mobile, and data engineering, having worked with a variety of languages,
      frameworks, and techniques.
    </p>
    <p class="text-h5">
      He is currently neck-deep in the database world, working as a Database Environment Engineer
      @<a href="https://cratedb.com/" style="color: navajowhite;">CrateDB</a>, an open-source distributed SQL database.
    </p>
  </v-container>
</template>

<style scoped>

</style>