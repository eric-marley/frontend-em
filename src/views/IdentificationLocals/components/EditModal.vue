<template>
  <b-modal
    v-model="showModal"
    title="Editar informações"
    cancel-title="Voltar"
    ok-title="Salvar"
    @ok="handleSubmit"
  >
    <EditForm
      :editLocationFields="row"
      @finalSubmit="handleFinalSubmit"
      :bus="bus"
    />
  </b-modal>
</template>

<script>
import EditForm from "@/views/IdentificationLocals/components/EditForm.vue";
import Vue from "vue";

export default {
  name: "EditModal",
  components: {
    EditForm,
  },
  props: {
    row: {
      type: Object,
      required: true,
    },
    callback: {
      type: Function,
      required: true,
    },
    modal: {
      type: Vue,
      required: true,
    },
  },
  data() {
    return {
      bus: new Vue(),
      showModal: false,
    };
  },
  mounted() {
    const handleModalState = this.handleModalState;
    this.modal.$on("open", function () {
      return handleModalState(true);
    })
    this.modal.$on("close", function () {
      return handleModalState(false);
    })
  },
  methods: {
    handleSubmit: function (event) {
      this.bus.$emit('submit');
      return event.preventDefault();
    },
    handleFinalSubmit: function (inputs) {
      const inputsFields = Object.assign({}, inputs);
      inputsFields.erro = false;
      delete inputsFields._rowVariant;
      return this.callback(inputsFields);
    },
    handleModalState: function (state) {
      this.showModal = state;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>