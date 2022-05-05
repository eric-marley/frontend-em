<template>
  <b-modal
    v-model="showModal"
    hide-footer
    hide-header
    centered
    content-class="modal-budget"
    size="lg"
  >
    <div class="modal-container">
      <p><b>Midias disponíveis</b></p>
      <p>
        Para o plano selecionado, recomendamos que sejam utilizados as midias
        abaixo.
      </p>
      <div
        v-for="asset in availableAsset"
        :key="asset.text"
        class="available-assets"
      >
        <div class="mr-2 custom-checked">
          <component :is="asset.check"></component>
        </div>
        <div class="mr-2">
          <component :is="asset.icon"></component>
        </div>
        <div>
          {{ asset.text }}
        </div>
      </div>
      <p>
        Abaixo, as midias que foram selecionados e não são contemplados neste
        plano. Recomendamos que escolha um plano maior para poder utilizá-los.
      </p>
      <div
        v-for="asset in unavailableAsset"
        :key="asset.text"
        class="available-assets"
      >
        <div class="mr-2">
          <component :is="asset.check"></component>
        </div>
        <div class="mr-2">
          <component :is="asset.icon"></component>
        </div>
        <div>
          {{ asset.text }}
        </div>
      </div>
    </div>
    <b-button @click="handleCloseModal" class="end-button">Fechar</b-button>
  </b-modal>
</template>

<script>
import Vue from "vue";
import handleCurrentAssets from "../helpers/handleCurrentAssets";

export default {
  name: "BudgetModal",
  components: {},
  props: {
    modal: {
      type: Vue,
      required: true,
    },
    handleCloseModal: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      bus: new Vue(),
      showModal: false,
      availableAsset: [],
      unavailableAsset: [],
    };
  },
  mounted() {
    const handleModalState = this.handleModalState;
    const handleModalData = this.handleModalData;
    this.modal.$on("open", function (data) {
      handleModalData(data);
      return handleModalState(true);
    });
    this.modal.$on("close", function () {
      return handleModalState(false);
    });
  },
  methods: {
    handleModalState: function (state) {
      this.showModal = state;
    },
    handleModalData: function (data) {
      const formattedAssets = handleCurrentAssets(data);
      this.availableAsset = formattedAssets.available;
      this.unavailableAsset = formattedAssets.unavailable;
    },
  },
};
</script>

<style lang="scss">
.modal-container {
  padding: calc(20px - 1rem);
}
.end-button {
  background-color: var(--blue);
  float: right;
}
.modal-budget {
  border-radius: 10px !important;
}
.container {
  p {
    font-size: 14px;
  }
}
.available-assets {
  display: flex;
  align-items: center;
  padding: 10px;
  
  .custom-checked {
    svg {
      path {
        fill: var(--blue);
      }
    }
  }
}
</style>