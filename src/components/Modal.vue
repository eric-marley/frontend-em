<template>
  <b-modal
    v-model="showModal"
    :title="modalTitle"
    cancel-title="Voltar"
    ok-title="Salvar"
  >
    <slot></slot>
  </b-modal>
</template>

<script>
export default {
  name: "Modal",
  props: {
    modalTitle: {
      type: String,
      required: false,
      default: "",
    },
    modalShow: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    showModal: function () {
      return this.modalShow
    }
  }
};
</script>

<style lang="scss" scoped>
</style>