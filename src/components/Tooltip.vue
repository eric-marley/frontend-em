<template>
  <b-tooltip :target="tooltipId" triggers="hover">
    {{ text }}
  </b-tooltip>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    tooltipId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>