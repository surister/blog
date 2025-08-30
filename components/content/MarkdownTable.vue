<script setup>
const slots = useSlots();
const value = slots.default()[0].children.default()[0].children;
const props = defineProps({
  type: {
    type: String,
    default: "table"
  },
  hasTop: {
    type: String,
    default: "false"
  },
  hasBottom: {
    type: String,
    default: "false"
  },

  maxHeight: {
    type: Number,
    default: 500
  },

  rowHighlight: {
    type: Array,
    default: []
    // Example: [
    // {from: 1, to: 2, color: "green"},
    // {from: 2, to: 3, color: "blue"}
    // ]
  }
})

function is_row_highlighted(row_number) {
  console.log(props.rowHighlight)
  console.log(typeof props.rowHighlight)
  for (const row_rules of props.rowHighlight) {
    if (row_number >= row_rules.from - 1 && row_number < row_rules.to) {
      return row_rules.color
    }
  }
  return ""
}

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
    <v-table :style="{'max-height': maxHeight + 'px'}"
             :class="[hasBottom === 'true' ? '' : 'rounded-b-lg', hasTop === 'true' ? '' : 'rounded-t-lg']"
             density="compact"
             striped="even"
             :hover="true"
             fixed-header>
      <thead>
      <tr>
        <th v-for="header in unpack_row(value.split('\n')[0])" class="text-left">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in get_rows()" :style="{backgroundColor: is_row_highlighted(index)}">
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