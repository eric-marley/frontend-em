<template>
  <MainLayout>
    <div class="home">
      <h1>Novo planejamento - {{ account.name }}</h1>
      <Steps :current="currentStep" />
      <div class="campaign">
        <b-form @keyup.enter="onKeyUp" @submit="$event.preventDefault()">
          <Container class="custom-width view">
            <div class="campaign__inputs">
              <b-form-group
                id="input-group-1"
                label="Nome da campanha"
                label-for="campaignName"
                class="m-0 title"
              >
                <b-form-input
                  id="campaignName"
                  placeholder="Nome de identificação da campanha"
                  v-model="identificationForm.campaignName"
                  :value="identificationForm.campaignName"
                  required
                  @change="handleCampaignNameChange"
                  :state="isCampaignValid"

                ></b-form-input>
                <b-form-invalid-feedback id="campaignName-feedback">
                  Campo obrigatório
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </Container>
         <Container class="custom-width view">
            <div class="campaign__objective">
              <h2 class="mb-2">Objetivo da campanha</h2>
              <small>Qual será o objetivo da campanha planejada?</small>

              <b-form-group class="radios-select-campain" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  stacked
                  @change="handleCampaignChange"
                  :aria-describedby="ariaDescribedby"
                >
                  <b-form-radio
                    v-model="selectedCampaignObjective"
                    name="campaignRadioCity"
                    value="city"
                    class="campaignRadio"
                    data-cy="radio-show-cities"
                    ref="objectives"
                  >
                    <strong>Melhores locais baseados no target</strong>
                    <small>Defina cidades de interesse</small>
                  </b-form-radio>
                  <b-form-radio
                    v-model="selectedCampaignObjective"
                    name="campaignRadioSheet"
                    value="sheet"
                    class="campaignRadio"
                    data-cy="radio-show-sheet"
                    disabled
                  >
                    <strong>Cercar endereços de interesse</strong>
                    <small>Importe uma planilha com seus endereços</small>
                    <b-badge class="badge after-feature">
                      Essa feature será disponibilizada em breve
                      <b-icon
                        icon="BIconExclamation-circle"
                        aria-hidden="true"
                        class="tip-icon"
                      />
                    </b-badge>
                  </b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </div>
          </Container>

          <Container class="custom-width view mb-6" v-if="identificationForm.campaignObjective === 'city'">
            <div class="region">
              <div class="region__title">
                <h2 class="mb-2">
                  Definir região
                </h2>
                <small>Selecione uma ou mais cidades que deseja veicular a campanha</small>
              </div>
              <div class="region__select">
                <b-form-group class="radios-select-campain">
                  <SelectInput
                    :handleChange="handleSelectRegionChange"
                    :options="availableOptions"
                    :emitOnChange="getLocals"
                    :error="emptyTargetRegion"
                    errorMessage="Região não encontrada"
                    withSearch
                    placeholder="Ex: São Paulo"
                    data-cy="selectLocals"
                  />
                </b-form-group>
              </div>
              <div v-if="identificationForm.regionTags" class="region__tags mt-4">
                <LocationChip
                  :options="identificationForm.regionTags"
                  :removeTag="removeRegionTag"
                />
              </div>
            </div>
          </Container>

          <Container
            class="custom-width view mb-6"
            v-else-if="identificationForm.campaignObjective === 'sheet'"
          >
            <div class="address">
              <div class="address__title mb-4">
                <h2 class="mb-2">Importar planilha de endereços</h2>
                <small
                  >Para cercar os locais de interesse é necessário fazer a
                  importação utilizando a planilha padrão da
                  EletromidiaAds.</small
                >
                <div v-if="tableRowWithError">
                  <Alert class="my-2" variant="danger">
                    <b-icon
                      class="mr-2"
                      icon="BIconInfo-circle"
                      aria-hidden="true"
                    />
                    {{ tableRowWithError }}
                  </Alert>
                </div>
              </div>
              <div class="address__buttons">
                <input
                  type="file"
                  hidden
                  @change="handleFileUpload"
                  ref="uploadLocation"
                  accept=".csv"
                />
                <b-button
                  @click="uploadFile"
                  variant="primary"
                  class="address__uploadButton"
                  size="sm"
                >
                  <b-icon icon="BIconUpload" aria-hidden="true" />Enviar planilha
                </b-button>
                <b-button
                  @click="downloadSample"
                  variant="primary"
                  class="address__downloadButton"
                  size="sm"
                >
                  <b-icon icon="BIconDownload" aria-hidden="true" />Baixar
                  modelo
                </b-button>
                <SwitchComponent
                  text="Ignorar erros"
                  :handleSwitchChange="handleSwitchChange"
                />
                <b-button
                  variant="primary"
                  class="address__downloadButton"
                  @click="downloadFileToCorrect"
                  size="sm"
                >
                  <b-icon icon="BIconDownload" aria-hidden="true" />Baixar
                  planilha para correção
                </b-button>
                <div class="address__rangePreference">
                  <span class="mr-3">Raio de preferência</span>
                  <SelectInput
                    :handleChange="handleRegionRangeChange"
                    :options="selectRangeOptions"
                    :selectedOption="identificationForm.selectedRange"
                  />
                  <b-button
                    variant="primary"
                    class="address__infoButton"
                    id="locationInfo"
                    size="sm"
                  >
                    <b-icon icon="BIconInfo-circle" aria-hidden="true" />
                  </b-button>
                  <Tooltip
                    tooltipId="locationInfo"
                    :text="rangeSelectionTooltipText"
                  />
                </div>
              </div>
              <div class="address__table" v-if="tableRegions.length">
                <h2 class="mb-4 mt-4">Localizações importadas</h2>
                <LocationTable
                  :data="tableRegions"
                  :columnFields="tableColumns"
                  :handleEditLocation="handleEditLocation"
                />
              </div>
            </div>
          </Container>
        </b-form>
      </div>
      <div id="footer" class="d-flex">
        <b-button
          variant="outline-secondary"
          class="mr-3 ml-auto"
          @click="previousPage"
          data-cy="prevBtn"
          >Voltar</b-button
        >
        <b-button
          @click="nextPage"
          :disabled="isButtonDisabled()"
          variant="primary"
          data-cy="btn-next"
          ref="nextButton"
          >Próximo</b-button
        >
      </div>
      <EditModal
        :row="currentEditingRow"
        :modal="modal"
        :callback="handleEditModal"
      />
      <FeedbackModal :open=feedbackModal :handleClose=handleCloseFeedbackModal :message="'<p>Por favor, selecione um tipo de arquivo válido <br/> <br /> <span>Tipos válidos: <b>CSV<b></span>'" />
    </div>
  </MainLayout>
</template>

<style lang="scss">
.title {
  label {
    font-size: 1.125rem;
  }
}
.tip-icon {
  color: var(--blue);
  margin-left: 5px;

  &:hover {
    cursor: pointer;
  }
}

.region__select {
  width: 345px;
}

.address {
  &__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px 0 0px;

    svg {
      margin-right: 5px;
    }
  }

  &__downloadButton,
  &__editButton {
    color: inherit;
    text-decoration: none;
    background-color: transparent;
    border-color: transparent;

    &:hover,
    &:active,
    &:focus {
      border-color: transparent !important;
      background-color: transparent !important;
      color: inherit !important;
      cursor: pointer;
      box-shadow: none !important;
    }
  }

  &__infoButton {
    color: var(--green);
    text-decoration: none;
    background-color: transparent;
    border-color: transparent;

    &:hover,
    &:active,
    &:focus {
      border-color: transparent !important;
      background-color: transparent !important;
      color: var(--green) !important;
      cursor: pointer;
      box-shadow: none !important;
    }
  }

  &__rangePreference {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-weight: lighter;
    }
  }

  &__table {
    th {
      font-weight: lighter;
    }
  }
}

.region {
  &__tags {
    span {
      background-color: var(--primary);
      border-radius: 20px;
      padding: 2px 10px;
      color: white;
    }
    button {
      color: white !important;
      opacity: 1;
      :hover {
        opacity: 1;
      }
    }
  }
}

h3 {
  font-size: 16px;
  font-weight: 400;
  color: var(--white);
  margin: 0px;
}

.list-group {
  margin: 30px 0 0 0;
  .list-group-item {
    padding: 0 15px 0 0;
    .btn {
      width: 32px;
      height: 32px;
      padding: 0;
      margin-right: 5px;
    }
  }
}

.radios-select-campain {
  margin: 15px 0 -15px 0;

  .campaignRadio :hover {
    cursor: pointer;
  }

  .custom-radio {
    padding: 0;
    .custom-control-label {
      border: 1px solid var(--silver);
      border-radius: 8px;
      padding: 15px 15px 15px 45px;
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;

      &::before {
        left: 15px;
        top: calc(40% - 10px);
      }
    }

    input[type="radio"]:checked + label {
      border: 1px solid var(--primary);
      position: relative;
      &::after{
        background: url("~@/assets/checkIcon.png") center center no-repeat !important;
        left: 15px;
        top: calc(40% - 10px);
        color: #fff;
        font-size: 9px;
      }
    }
  }
}

#footer {
  background: var(--white);
  position: fixed;
  bottom: 0;
  width: calc(100% - 50px);
  left: 50px;
  padding: 15px 15px;
  border: 1px solid var(--light-gray2);
  z-index: 3;
}

.downloadModel {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
  :hover {
    cursor: pointer;
  }
}

.after-feature {
  background: var(--blue);
  position: absolute;
  right: 20px;
  top: calc(50% - 7.5px);
  & svg {
    color: var(--white);
  }
}
</style>

<script>
import Container from "@/components/Container.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import SelectInput from "@/components/SelectInput.vue";
import SwitchComponent from "@/components/Switch.vue";
import Tooltip from "@/components/Tooltip.vue";
import Alert from "@/components/Alert.vue";
import LocationTable from "./components/LocationTable.vue";
import EditModal from "./components/EditModal.vue";
import LocationChip from "./components/LocationChip.vue";
import Steps from "@/components/Steps.vue";
import FeedbackModal from "@/components/FeedbackModal.vue"

import { mapActions, mapGetters, mapMutations } from "vuex";
import mediaPlansService from "../../services/mediaPlans.service";
import Vue from "vue";

export default {
  name: "IdentificationAndLocals",
  components: {
    Container,
    MainLayout,
    SelectInput,
    LocationChip,
    LocationTable,
    SwitchComponent,
    Tooltip,
    Alert,
    EditModal,
    Steps,
    FeedbackModal
  },
  data() {
    return {
      interestPlacesIsAvailable: false,
      tooltip: {
        region: 'As buscas <strong>devem</strong> ser realizadas com a acentuação correspondente.'
      },
      currentStep: 'local',
      emptyTargetRegion: null,
      modal: new Vue(),
      currentEditingRow: {},
      isCampaignValid: null,
      selectRegionOptions: [],
      selectedCampaignObjective: null,
      feedbackModal: new Vue(),
      selectRangeOptions: [
        { value: "500m", text: "500m" },
        { value: "1km", text: "1km" },
        { value: "2km", text: "2km" },
        { value: "5km", text: "5km" },
      ],
      defaultIdentificationForm: {
        campaignName: "",
        selectedRange: "1km",
        regionTags: [],
        ignoreErrors: false,
        campaignObjective: "",
        tableRegions: [],
      },
      identificationForm: {},
      rangeSelectionTooltipText:
        "Essa distância selecionada pode ter breve oscilações no raio dependendo da região ",
      tableRegions: [],
      tableColumns: [
        { key: "logradouro", label: "Logradouro" },
        { key: "numero", label: "N°" },
        { key: "bairro", label: "Bairro" },
        { key: "cidade", label: "Cidade" },
        { key: "estado", label: "Estado" },
        { key: "cep", label: "CEP" },
        { key: "latitude", label: "Latitude" },
        { key: "longitude", label: "Longitude" },
        { key: "icon", label: "" },
      ],
    };
  },
  beforeMount: function () {
    this.identificationForm = Object.assign(
      this.mediaPlan,
      this.identificationForm,
      this.defaultIdentificationForm
    );


    if (this.mediaPlan._id !== undefined) {
      const type = this.mediaPlan.objective.type === 'PLACES_BY_TARGET' ? 'city' : 'sheet';
      this.identificationForm.campaignObjective = type;
      this.identificationForm.campaignName = this.mediaPlan.name;
      this.tableRegions = this.mediaPlan.objective.locations || [];

      const regions = this.mediaPlan.objective.regions.map(
        (region, indice) => {
          return Vue.observable({
            value: (indice + 1).toString(),
            text: region,
            cities: region
          })
        }
      );

      this.setFieldValue(
        {
          field: 'regionTags',
          value: Vue.observable(regions)
        }
      )
    }
  },
  mounted: function () {
    if (this.mediaPlan._id !== undefined) {
      const type = this.mediaPlan.objective.type === 'PLACES_BY_TARGET' ? 'city' : 'sheet';
      this.identificationForm.campaignObjective = type;
      this.selectedCampaignObjective = type;
      this.tableRegions = this.mediaPlan.objective.locations || [];

      this.setFieldValue(
        {
          field: 'campaignObjective',
          value: type
        }
      )
    }
    this.getLocals('')
  },
  computed: {
    ...mapGetters({
      stepHeaders: 'steps/stepHeaders',
      accounts: "account/accounts",
      account: "account/account",
      mediaPlans: "media_plans/mediaPlans",
      mediaPlan: "media_plans/mediaPlan",
    }),
    availableOptions() {
      if (!this.identificationForm.regionTags.length) {
        return this.selectRegionOptions
      }
      const availableOptions = this.selectRegionOptions.filter(
        (opt) => !this.identificationForm.regionTags.map(item => item.text).includes(opt.text)
      )
      return availableOptions
    },
    tableRowWithError() {
      const totalOfRows = this.tableRegions.length;
      const rowsWithError = this.tableRegions.filter(
        (region) => region.erro
      );

      if (!rowsWithError.length || this.identificationForm.ignoreErrors) {
        return null
      }
      return `${rowsWithError.length} de ${totalOfRows} endereços não foram possíveis de importar.`;
    },
  },
  watch: {
    selectedCampaignObjective (newObj) {
      this.setFieldValue({field: 'campaignObjective', value: newObj});
    }
  },
  methods: {
    ...mapActions({
      createOrUpdateMediaPlan: 'media_plans/createOrUpdateMediaPlan'
    }),
    ...mapMutations({
      SET_CURRENT_STEP: 'steps/SET_STEP_HEADERS',
      SET_UPLOAD_LOCATIONS: 'media_plans/SET_UPLOAD_LOCATIONS',
    }),
    setFieldValue: function (object) {
      return this.$set(this.identificationForm, object.field, object.value);
    },
    getLocals: async function (value) {
      if(value !== null) {
        const isValidSearch = !value.trim().startsWith('[')

        if(value.startsWith("sao")) {
          value = value.toLowerCase().replace("sao", "são")
        } else if(value.startsWith("vito")) {
          value = value.toLowerCase().replace("vito", "vitó")
        } else if(value.startsWith("goia")) {
          value = value.toLowerCase().replace("goia", "goiâ")
        } else if(value.startsWith("joao")) {
          value = value.toLowerCase().replace("joao", "joão")
        }

        if (isValidSearch) {
          const URLParams = {
            search: value,
            limit: 100,
            skip: 0,
          };

          const locals = await mediaPlansService.getLocals(URLParams);

          if (!locals.length) {
            this.emptyTargetRegion = false
          } else {
            this.emptyTargetRegion = null
          }

          const newSelectRegionOptions = locals.map((location) => ({
            value: location._id,
            text: location.name,
            cities: location.cities.join('\n')
          }));

          this.selectRegionOptions = newSelectRegionOptions;
        }
      }
    },
    handleSelectRegionChange: function (region) {
      if (!region) return

      const regionExists = this.identificationForm.regionTags.some(regionTag => regionTag.value === region.value)

      let currentRegions = this.identificationForm.regionTags;

      if (!regionExists) {
        currentRegions.push(region);
        this.setFieldValue({
          field: 'regionTags',
          value: currentRegions
        });
      }
    },
    removeRegionTag: function (region) {

      const item = this.identificationForm.regionTags.findIndex(
        (item) => item.value == region.value
      );

      this.identificationForm.regionTags.splice(item, 1);

      if (this.isButtonDisabled()) {
        this.$refs['nextButton'].disabled = true;
      }
    },
    handleCampaignChange: function (value) {
      this.identificationForm = Object.assign({}, this.identificationForm, {
        ...this.defaultIdentificationForm,
        campaignObjective: value,
        regionTags: [],
        tableRegions: [],
        campaignName: this.identificationForm.campaignName,
      });
      this.handleCampaignState(this.identificationForm.campaignName)
      return this.isButtonDisabled()
    },
    handleSwitchChange: function (value) {
      return this.setFieldValue({
        field: "ignoreErrors",
        value: value,
      });
    },
    handleRegionRangeChange: function (rangeObject) {
      this.setFieldValue({
        field: "selectedRange",
        value: rangeObject.value,
      });
      return this.isButtonDisabled()
    },
    handleCampaignState: function (value) {
      if (!value.trim()){
        return this.isCampaignValid = false
      }
      return this.isCampaignValid = null
    },
    handleCampaignNameChange: function (value) {
      this.handleCampaignState(value)
      return this.setFieldValue({
        field: "campaignName",
        value: value,
      });
    },
    previousPage() {
      this.$router.push({ name: "Plans" })
    },
    async nextPage() {
      this.setFieldValue({
        field: "tableRegions",
        value: this.tableRegions,
      });

      await this.createOrUpdateMediaPlan({
        identificationForm: this.identificationForm,
        accountId: this.$route.params.accountId,
      });

      this.SET_CURRENT_STEP(
        this.stepHeaders.map(stepHeader => {
          if (stepHeader.name === this.currentStep) stepHeader.done = true
          return stepHeader
        })
      )

      this.$router.push({ name: "Target" });
    },
    isButtonDisabled: function () {
      const validCampaignName = this.identificationForm.campaignName.trim();

      if (this.identificationForm.campaignObjective === "city") {
        return !this.identificationForm.regionTags.length || !validCampaignName
      }

      if (this.identificationForm.campaignObjective === "sheet") {
        const ignoreTableError = this.identificationForm.ignoreErrors;


        if (!ignoreTableError) {
          if (this.tableRegions.length){
            const hasErrorOnTable = this.tableRegions.length ? this.tableRegions.find((region) => region.erro) : false;
            return !(validCampaignName && !hasErrorOnTable);
          }
          return true
        }

        return !this.tableRegions.length && validCampaignName
      }

      return true
    },
    handleEditLocation: function (row) {
      this.modal.$emit('open');
      const editingRow = {
        ...row.item,
        index: row.index,
      };
      this.currentEditingRow = Object.assign(
        {},
        this.currentEditingRow,
        editingRow
      );
    },
    handleEditModal: function (hasFields) {
      this.modal.$emit('close');
      if (hasFields) {
        this.$set(this.tableRegions, hasFields.index, hasFields);
      }
    },
    handleCloseFeedbackModal: function () {
      this.feedbackModal.$emit("close");
    },
    handleCloseModal: function () {
      this.modal.$emit('close');
    },
    downloadSample: function () {
      let csv =
        "Logradouro, N°, Bairro, Cidade, Estado, CEP, Latitude, Longitude\r\n";
      csv += "Alameda Barros,11,Alameda Barros,São Paulo,SP,01226-020,-,-,";
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sample.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    downloadFileToCorrect: function () {
      let csv =
        "Logradouro, N°, Bairro, Cidade, Estado, CEP, Latitude, Longitude\r\n";

      this.tableRegions.map((region) => {
        csv += `${region.logradouro}, ${region.n}, ${region.bairro}, ${region.cidade}, ${region.estado}, ${region.cep}, ${region.latitude}, ${region.longitude},\r\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "correct.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    uploadFile: function () {
      let fileInputElement = this.$refs.uploadLocation;
      fileInputElement.click();
    },
    handleFileUpload: async function (event) {
      const [file] = event.target.files;
      if (file.type !== "text/csv") {
      this.feedbackModal.$emit("open");
        return;
      }

      const upload = new FormData();
      upload.append("file", file);

      this.SET_UPLOAD_LOCATIONS(file);

      const regionData = await mediaPlansService.uploadSurroundLocation(upload);
      const newRegionData = []
      regionData.map(region => {
        if (region.erro) {
          return newRegionData.push({
            ...region,
            _rowVariant: 'danger'
          })
        }
        return newRegionData.push(region)
      })
      this.tableRegions = newRegionData
    },
    onKeyUp() {
      this.$refs.objectives.focus();
    }
  },
};
</script>
