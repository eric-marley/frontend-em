<template>
  <div>
    <b-table
      no-border-collapse
      head-variant="light"
      hover
      :items="data"
      :fields="columnFields"
    >
      <slot></slot>
    </b-table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    columnFields: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {};
  },
};
</script>