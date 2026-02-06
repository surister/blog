<script setup lang="ts">
let cratedb_blogs = [
  {
    title: 'Doing Hybrid Search in CrateDB',
    path: 'https://cratedb.com/blog/hybrid-search-explained',
    date: '2024-07-22'
  },
  {
    title: 'Dissecting a Hybrid Search query',
    path: 'https://cratedb.com/blog/dissecting-a-hybrid-search-query-in-sql',
    date: '2024-08-30'
  }
]
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').select("title", "path","meta").all()
})
</script>

<template>
  <v-container  class="pt-10" style="max-width: 720px">
    <!--   Last Entries   -->
    <v-row no-gutters>
      <v-col>
        <h2>Last entries</h2>
        <div v-for="article in page">
          <template v-if="article.meta.published ||
            article.meta.show_preview">
            <div class="my-1">
                <span class="text-red text-subtitle-1 ml-1">
                {{ article.meta.date || new Date().toISOString().slice(0, 10) }}
              </span>
              <a :href="article.path"
                 class="font-weight-bold text-decoration-none text-white">
                {{ article.title }}
              </a>
              <v-chip variant="outlined"
                      size="x-small"
                      v-if="article.meta.show_preview">
                preview
              </v-chip>
            </div>
          </template>
        </div>
      </v-col>
    </v-row>

    <!--   CrateDB Section   -->
    <v-row no-gutters class="pt-5" >

      <v-col>
        <h2>CrateDB blog</h2>
        <div v-for="article in cratedb_blogs">
          <div class="my-1">
            <span class="text-blue text-subtitle-1 ml-1">
                {{ article.date || new Date().toISOString().slice(0, 10) }}
            </span>
            <a :href="article.path"
               class="font-weight-bold text-decoration-none text-white">
              {{ article.title }}
            </a>
          </div>
        </div>
      </v-col>

    </v-row>
  </v-container>
</template>

<style scoped>
span {
  word-break: break-word;
}
</style>