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

</script>

<template>
  <div style="background-color: #EF5350; height: 10px"></div>
  <v-container fluid class="pt-15">
    <v-row no-gutters>
      <v-col offset-md="1" offset-lg="3" offset-xl="1" offset-xxl="1">
        <h2>Last entries</h2>
        <ContentList path="/blog/" v-slot="{ list }">
          <div v-for="article in list">
            <template v-if="article.published || article.show_preview">
              🗒️ <span class="text-red text-subtitle-1 ml-1">{{ article.published_date || new Date().toISOString().slice(0, 10) }}</span>
              <v-badge content="preview" v-if="!article.published && article.show_preview">
                <elink :text="article.title" :url="article._path"></elink>
              </v-badge>
              <template v-else>
                 <elink :text="article.title" :url="article._path"></elink>
              </template>
            </template>
          </div>
        </ContentList>
      </v-col>

    </v-row>

    <!--    CrateDB Section-->
    <v-row no-gutters class="pt-5">
      <v-col offset-md="1" offset-lg="3" offset-xl="1" offset-xxl="1">
        <h2>CrateDB blog</h2>
        <div v-for="article in cratedb_blogs">
          🗒️ <span class="text-blue text-subtitle-1 ml-1">{{ article.date }}</span>
          <elink :text="article.title" :url="article.path"></elink>
        </div>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>