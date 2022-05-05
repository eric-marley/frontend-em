<template>
  <MainLayout>
    <div>
      <h1>Novo planejamento - {{ account.name }}</h1>
      <Steps :current="currentStep" />
      <Container class="custom-width view">
        <header>
          <h2 class="title">{{ page.header.title }}</h2>
          <p>{{ page.header.subtitle }}</p>
        </header>
        <Media :medias="medias" v-if="!isLoading" />
        <Skeleton v-if="isLoading" :count="5" />
      </Container>
      <Container class="custom-width view mb-6">
        <header>
          <h2>Período da Campanha</h2>
          <p>Defina o período de veiculação da campanha</p>
        </header>
        <div>
          <b-form>
            <b-row>
              <b-col cols="auto" class="fix-z-index">
                <label for="data-inicial">Data de início</label>
                <b-form-datepicker
                  id="data-inicial"
                  v-model="startDate"
                  v-bind="labels[locale] || {}"
                  :locale="locale"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  }"
                  :min="minDate"
                  placeholder="dd/mm/aaaa"
                >
                </b-form-datepicker>
              </b-col>
              <b-col cols="auto">
                <b-form-group
                  id="periodo-group"
                  label="Duração"
                  label-for="periodo"
                  class="mb-0"
                >
                  <b-form-select
                    id="periodo"
                    v-model="selectedPeriod"
                    :options="options"
                    required
                  ></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- <b-row>
              <b-col>
                <b-form-checkbox
                  id="without-startdate"
                  v-model="withoutStartDate"
                  name="without-startdate"
                  value="without-startdate"
                  unchecked-value="with-startdate"
                  class="custom-checkbox"
                >
                  <span
                    class="without-startdate-label"
                    data-cy="check-none-startdate"
                    >Não quero definir a data de início</span
                  >
                </b-form-checkbox>
              </b-col>
            </b-row> -->
          </b-form>
        </div>
      </Container>
      <div id="footer" class="d-flex">
        <b-button
          variant="outline-secondary"
          class="mr-3 ml-auto"
          @click="previousPage"
          >Voltar</b-button
        >
        <b-button
          variant="primary"
          @click="nextPage"
          :disabled="isLoading"
          data-cy="btn-next"
        >
          Próximo
        </b-button>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

import MainLayout from "@/layouts/MainLayout.vue";

import Container from "@/components/Container.vue";
import Steps from "@/components/Steps.vue";
import Media from "./components/Media.vue";

import mediasService from "../../services/medias.service";
import mediaPlansService from "../../services/mediaPlans.service";

import { Skeleton } from "vue-loading-skeleton";

import dateConstraints from "./helpers/dateConstraints";

export default {
  name: "ActivesPeriod",
  components: {
    MainLayout,
    Container,
    Steps,
    Media,
    Skeleton,
  },
  data() {
    return {
      isLoading: true,
      currentStep: "media",
      page: {
        header: {
          title: "Mídias de preferência",
          subtitle:
            "Escolha as mídias que deseja anunciar. As mídias desativadas não estão disponíveis na região selecionada.",
        },
      },
      options: [
        { text: "Semanal", value: "Semanal" },
        { text: "Bissemanal", value: "Bissemanal" },
        { text: "Mensal", value: "Mensal" },
        { text: "Bimestral", value: "Bimestral" },
        { text: "Trimestral", value: "Trimestral" },
      ],
      selectedPeriod: null,
      startDate: "",
      context: null,
      withoutStartDate: "with-startdate",
      locale: "pt-BR",
      minDate: dateConstraints(),
      labels: {
        "pt-BR": {
          labelNoDateSelected: "Sem data selecionada",
          labelHelp: "Use os cursores para navegar no calendário",
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      stepHeaders: "steps/stepHeaders",
      medias: "medias/medias",
      mediaPlan: "media_plans/mediaPlan",
      startDateStore: "medias/startDate",
      selectedPeriodStore: "medias/selectedPeriod",
      selectedMediasStore: "medias/selectedMedias",
      account: "account/account",
    }),
    canGoNextStep() {
      return (
        (this.selectedMediasStore.length &&
          this.startDate !== "" &&
          this.startDate &&
          this.selectedPeriod !== null) ||
        (this.selectedMediasStore.length &&
          (this.startDate === "" || this.startDate === null) &&
          this.selectedPeriod !== null &&
          this.withoutStartDate === "without-startdate")
      );
    },
  },
  watch: {
    selectedPeriod() {
      this.$store.dispatch("medias/setSelectedPeriod", {
        period: this.selectedPeriod,
      });
    },
    startDate() {
      if (this.startDate === null) {
        this.withoutStartDate = "without-startdate";
      } else if (this.startDate !== "") {
        this.withoutStartDate = "with-startdate";
      }
      this.$store.dispatch("medias/setStartDate", { date: this.startDate });
    },
    withoutStartDate() {
      if (this.withoutStartDate === "without-startdate") {
        this.startDate = "";
        this.$store.dispatch("medias/setStartDate", { date: null });
      }
    },
  },
  methods: {
    ...mapMutations({
      SET_CURRENT_STEP: "steps/SET_STEP_HEADERS",
    }),
    ...mapActions({
      getMediaPlan: "media_plans/getMediaPlan",
    }),
    previousPage() {
      this.$router.push({ name: "Target" });
    },
    async nextPage() {
      this.SET_CURRENT_STEP(
        this.stepHeaders.map((stepHeader) => {
          if (stepHeader.name === this.currentStep) stepHeader.done = true;
          return stepHeader;
        })
      );

      await mediaPlansService.updateMedias(this.mediaPlan._id, {
        medias: this.selectedMediasStore,
        period: {
          type: this.selectedPeriodStore,
          startDate: this.startDateStore,
        },
      });

      this.getMediaPlan({ id: this.mediaPlan._id });

      this.$router.push({
        name: "IdentificationLocals",
        params: { accountId: this.account._id },
      });

      this.$router.push({ name: "Budget" });
    },
    onContext(ctx) {
      this.context = ctx;
    },
  },
  async beforeMount() {
    if (!this.mediaPlan.midias.length) {
      const response = await mediasService.getMedias(this.mediaPlan._id);
      this.$store.dispatch("medias/setMedias", {
        medias: response,
      });
      this.isLoading = false;
    } else {
      this.$store.dispatch("medias/setMedias", {
        medias: this.mediaPlan.midias,
      });
      this.isLoading = false;
    }
  },
  mounted() {
    this.selectedPeriod = this.mediaPlan.period
      ? this.mediaPlan.period.type
      : "Semanal";
    this.startDate = this.mediaPlan.period
      ? this.mediaPlan.period.startDate
      : "";

    if (this.startDate === "" || this.startDate === null) {
      this.withoutStartDate = "without-startdate";
    }

    const now = new Date();
    const nextDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()+1}`;

    if (!this.mediaPlan.midias.length) {
      this.startDate = nextDate;
    }
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.125rem;
}
header {
  p {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.2;

    margin-top: -18px;
  }
}

.without-startdate-label {
  font-weight: normal;
  font-size: 14px;
}

.fix-z-index {
  z-index: 2;
}
</style>

<style lang="scss">
#data-inicial__dialog_[role="dialog"] {
  header {
    display: none;
  }
  .small {
    display: none;
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
</style>
