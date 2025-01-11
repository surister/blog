<script setup lang="ts">
const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
const props = defineProps({
  type: {
    type: String,
    default: "text"
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
function unpack_row(row){
  return row.split("\n")[0].split("|").map((v) => v.trim()).filter((v) => v !== "")
}
function get_rows(){
  return value.split("\n").splice(2).map(unpack_row)
}
</script>

<template>
  <template v-if="type === 'text'">
    <pre>{{ value }}</pre>
  </template>
  <template v-else-if="type === 'table'">
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
  <template v-else>
    <h1 style="background-color: red">Table of type "{{ type }}" is not supported</h1>
  </template>

</template>

<style scoped>
.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th {
  background: #212121;
}
table tbody {
  background-color: #212121
}
</style>