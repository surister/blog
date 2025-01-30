<script setup lang="ts">
const props = defineProps({
  headers:{
    type: Array
  },
  rows: {
    type: Array,
  },
  hasTop: {
    type: Boolean,
    default: false
  },
  hasBottom: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div style="height: 13px; background: #EF5350" v-if="hasTop"></div>
  <v-table height="300px"
           :class="[hasBottom ? 'rounded-b-lg' : '']"
           fixed-header>
    <thead>
    <tr>
      <th v-for="header in unpack_row(value.split('\n')[0])" class="text-left">
        {{ header }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in get_rows()">
      <td v-for="element in row">
        {{ element }}
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<style scoped>

</style>