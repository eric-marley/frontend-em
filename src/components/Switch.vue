<template>
  <b-form-checkbox
    @change="handleSwitchChange"
    v-model="checked"
    name="switchButton"
    switch
    class="switchComponent"
    >{{ text }}</b-form-checkbox
  >
</template>

<script>
export default {
  name: "SwitchComponent",
  props: {
    handleSwitchChange: {
      type: Function,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      checked: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.switchComponent {
  :hover {
    cursor: pointer !important;
  }
}
</style>