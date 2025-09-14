<script setup>
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

function get_default(slots) {
  // Gets the default content of slots as passed by nuxt in their custom components.
  return slots.default()[0].children.default()[0].children
}

function is_row_highlighted(row_number) {
  for (const row_rules of props.rowHighlight) {
    if (row_number >= row_rules.from - 1 && row_number < row_rules.to) {
      return row_rules.color
    }
  }
  return ""
}

function parse_row(string){
  // Given a text representing a row where values are separated by "|", returns an array
  // with the values.
  // Example:
  // >>> parse_row("| one | two |", "|")
  // ['one', 'two']
  return string.split("\n")[0].split("|").map((v) => v.trim()).filter((v) => v !== "")
}

function get_headers(string){
  // Given a markdown table as a string, returns the headers as an array.
  // Example:
  // >>> get_headers(`
  //      | Month    | Savings |
  //      | -------- | ------- |
  //      | January  | $250    |
  //      | February | $80     |
  //      | March    | $420    |
  // `)
  // ["Month", "Savings"]

  return [string.split("\n")[0]].map(parse_row)[0]

}

function get_rows(string){
  // Given a markdown table as a string, returns the rows as an array of arrays.
  // Example:
  // >>> get_rows(`
  //      | Month    | Savings |
  //      | -------- | ------- |
  //      | January  | $250    |
  //      | February | $80     |
  //      | March    | $420    |
  // `)
  // [
  //    ["January", 250],
  //    ["February", 80],
  //    ["March", 422]
  // ]

  // splice(2) removes the first (header row) and second (separator row)
  return string.split("\n").splice(2).map(parse_row)
}
</script>

<template>
  <template v-if="type === 'text'">
    <pre>{{ get_default($slots) }}</pre>
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
        <th v-for="header in get_headers(get_default($slots))" class="text-left">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, index) in get_rows(get_default($slots))" :style="{backgroundColor: is_row_highlighted(index)}">
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