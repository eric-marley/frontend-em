<template>
  <b-alert :variant="variant" show><slot></slot></b-alert>
</template>

<script>
export default {
  name: "Alert",
  props: {
    variant: {
      type: String,
      required: true,
    },
    children: {
      type: Object,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>