<template>
  <ul v-if="options.length" class="list-inline d-inline-block mb-2">
    <li v-for="tag in options" :key="tag.value" class="list-inline-item">
      <b-form-tag @remove="removeTag(tag.value)" :title="tag.text">{{
        tag.text
      }}</b-form-tag>
    </li>
  </ul>
</template>

<script>
export default {
  name: "Chip",
  props: {
    options: {
      type: Array,
      required: true,
    },
    removeTag: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>