<template>
  <MainLayout>
    <h1>Novo planejamento - {{ account.name }}</h1>
    <Steps :current="currentStep" />
    <div class="main-layout">
      <Container class="budget mb-6">
        <div class="budget__header">
          <p class="title">
            Budget para investimento
            <b-icon
              icon="BIconExclamation-circle"
              aria-hidden="true"
              class="investmentBudgetTooltipIcon"
              v-b-tooltip.hover.top="
                'P: Plano menor de acordo com a sua necessidade e com um investimento mais reduzido com um impacto pequeno <br /><br /> M: Plano médio de investimento, visando alcançar a massa em uma proporção interessante para conseguir bons resultados <br /><br /> G: Plano grande de investimento, alcançando um número expressivo de resultados para ajudar na conversão da sua empresa'
              "
              v-b-tooltip.hover="{
                customClass: 'investmentBudgetTooltipDiv',
                html: true,
              }"
            />
            <b-tooltip
              target="investmentBudget"
              triggers="hover"
              class="investmentBudgetTooltip"
            />
          </p>
          <span
            >Selecione pelo menos um plano de budget por região para
            avançar</span
          >
          <BudgetCard
             v-if="!loading"
            :budgets="budgets"
            :handleBudgetClick="handleBudgetClick"
            :handleActiveModal="handleActiveModal"
            :handleAddCustomBudget="handleAddCustomBudget"
            :handleRemoveCustomBudget="handleRemoveCustomBudget"
            :handleInvestmentChange="handleInvestmentChange"
          />
          <Skeleton v-if="loading" :count="10" />
        </div>
      </Container>
      <div class="popout">
        <p><SpeakerIcon /><b>Planos recomendados.</b></p>
        <p>
          Os planos recomendados que terão o melhor desempenho nas campanhas
          está marcado como <b>Recomendado</b>. Você pode alterar clicando no
          plano desejado. <br /><br />
          Para ver as mídias disponíveis para o plano, basta clicar em
          <b>Ver mídias</b>.
        </p>
      </div>
    </div>
    <BudgetModal :modal="modal" :handleCloseModal="handleCloseModal" />
    <div id="footer" class="d-flex">
    <div class="d-flex align-items-center">
      <p class="mb-0">
        O valor até o momento do seu planejamento é de: </p><p class="total-planned ml-1 mb-0"> {{convertToCurrency(total)}}</p>
    </div>
      <b-button
        variant="outline-secondary"
        class="mr-3 ml-auto"
        @click="previousPage"
        >Voltar</b-button
      >
      <b-button @click="nextPage" variant="primary" :disabled="loading" data-cy="btn-next"
        >Próximo</b-button
      >
    </div>
    <FeedbackModal
      :open="feedbackModal"
      :handleClose="handleCloseFeedbackModal"
      :message="'<p>Por favor, selecione 1 budget para cada região</p>'"
    />
  </MainLayout>
</template>

<script>
import MainLayout from "@/layouts/MainLayout.vue";
import Container from "@/components/Container.vue";
import Steps from "@/components/Steps.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { Skeleton } from "vue-loading-skeleton";
import BudgetCard from "./components/BudgetCard.vue";
import handleBudgetSelection from "./helpers/handleBudgetSelection";
import handleDefaultBudgetSelected from "./helpers/handleDefaultBudgetSelected";
import handleFormValidation from "./helpers/handleFormValidation";
import SpeakerIcon from "@/assets/speakerIcon.svg";
import Vue from "vue";
import BudgetModal from "./components/BudgetModal.vue";
import FeedbackModal from "@/components/FeedbackModal.vue";
import mediaPlansService from "@/services/mediaPlans.service";
import convertValues from '../../helpers/money'

export default {
  name: "Budget",
  components: {
    MainLayout,
    Container,
    Steps,
    BudgetCard,
    SpeakerIcon,
    BudgetModal,
    FeedbackModal,
    Skeleton,
  },
  computed: {
    ...mapGetters({
      budget: "budget/budgets",
      stepHeaders: "steps/stepHeaders",
      account: "account/account",
      mediaPlan: "media_plans/mediaPlan",
    }),
    ...mapActions({
      getInvestments: "budget/fetchAll",
      refreshMediaPlan: "media_plans/refreshMediaPlan"
    }),
    ...mapMutations({
      SET_SELECTED_BUDGETS: "budget/SET_SELECTED_BUDGETS",
      SET_CURRENT_STEP: "steps/SET_STEP_HEADERS",
    }),
  },
  async created() {
    await this.refreshMediaPlan;
    await this.getInvestments;

    const previousSelected = this.mediaPlan.investimentos
      ? Object.entries(this.mediaPlan.investimentos)
      : [];

    const budgets = handleDefaultBudgetSelected(
      Object.entries(this.budget),
      previousSelected
    );
    this.budgets = budgets.newBudgets
    this.budgetTotal = budgets.total
    let total = 0
    this.budgetTotal.map(currentBudgetInvestmentTotal => total += currentBudgetInvestmentTotal)
    this.total = total
    this.loading = false;
  },
  methods: {
    handleBudgetClick: function (selectedBudget, selectedIndexFromBudgetList) {
      const {newBudgets: newBudgetPosition, total: selectedBudgetInvestmentTotal} = handleBudgetSelection(
        this.budgets,
        selectedBudget,
        selectedIndexFromBudgetList
      );
      this.$set(
        this.budgets[selectedIndexFromBudgetList],
        1,
        newBudgetPosition
      );
      let total = 0
      this.budgetTotal[selectedIndexFromBudgetList] = selectedBudgetInvestmentTotal
      this.budgetTotal.map(currentBudgetInvestmentTotal => total += currentBudgetInvestmentTotal)
      this.total = total
    },
    handleActiveModal: function (selectedBudget) {
      this.modal.$emit("open", selectedBudget);
    },
    handleCloseModal: function () {
      this.modal.$emit("close");
    },
    previousPage() {
      this.$router.push({ name: "ActivesPeriod" });
    },
    async nextPage() {
      const canProceed = handleFormValidation(this.budgets);
      if (canProceed) {
        const investments = this.budgets.reduce((acc, investment) => {
          const [region, availableInvestments] = investment;
          acc[region] = availableInvestments.find((i) => i.selected) || {};

          return acc;
        }, {});
        await mediaPlansService.updateInvestments(
          this.mediaPlan._id,
          investments
        );
        return this.$router.push({ path: `/resumo/${this.mediaPlan._id}` });
      }
      return this.feedbackModal.$emit("open");
    },
    handleCloseFeedbackModal: function () {
      this.feedbackModal.$emit("close");
    },
    handleRemoveCustomBudget: function (budgetIndex) {
      const newBudgets = [...this.budgets];
      newBudgets[budgetIndex][1].pop();
    },
    handleAddCustomBudget: function (budgetIndex) {
      const newBudgets = [...this.budgets];
      newBudgets[budgetIndex][1].push({
        id: Math.floor(Math.random() * 100),
        idSimulacao: Math.floor(Math.random() * 100),
        tipo: "Personalizado",
        investimento: 0,
        frequencia: 0,
        alcanceSemanal: 0,
        impactoSemanal: 0,
        grp: 900,
        recomendado: false,
        midias: [
          {
            id: "35bb60aa-9062-1443-b909-0242ac120002",
            nome: "Mídia de rua",
            available: true,
          },
          {
            id: "31265acc-9062-1443-b909-0242ac120002",
            nome: "Elevador",
            available: true,
          },
          {
            id: "1665edba-9062-1443-b909-0242ac120002",
            nome: "Shopping",
            available: true,
          },
        ],
      });
    },
    async handleInvestmentChange(value, budgetId) {
      // Get region
      let region = "";
      this.budgets.forEach((budget) => {
        let findRegion = budget[1].find(
          (budgetPlan) => budgetPlan.id === budgetId
        );
        if (findRegion) {
          region = budget[0].split(",")[0];
        }
      });

      try {
        const res = await mediaPlansService.getInvestmentResult({
          region,
          investment: value,
          mediaPlan: this.mediaPlan._id,
        });

        let newBudgets = [...this.budgets];
        newBudgets = newBudgets.map((budget, index) => {
          const plans = budget[1].map((plan) => {
            if (plan.id === budgetId) {
              this.budgetTotal[index] = Number(res.data.investimento)
              return {
                id: plan.id,
                selected: plan.selected,
                recomendado: plan.recomendado,
                investimento: Number(res.data.investimento),
                impactoSemanal: res.data.impactoSemanal,
                idSimulacao: plan.idSimulacao,
                grp: res.data.grp,
                frequencia: res.data.frequencia,
                alcanceSemanal: res.data.alcanceSemanal,
                tipo: plan.tipo,
              };
            }
            return plan;
          });
          return [budget[0], plans];
        });
        let total = 0
        this.budgetTotal.map(currentBudgetInvestmentTotal => total += currentBudgetInvestmentTotal)
        this.total = total
        this.budgets = newBudgets;
      } catch (error) {
        console.log(error);
      }
    },
    convertToCurrency: function (value){
        return convertValues.convertToCurrency(value)
    },
    mounted() {
      this.SET_CURRENT_STEP(
        this.stepHeaders.map((stepHeader) => {
          if (stepHeader.name === this.currentStep) stepHeader.done = true;
          return stepHeader;
        })
      );
    },
  },
  data() {
    return {
      budgets: [],
      modal: new Vue(),
      currentStep: "budget",
      feedbackModal: new Vue(),
      loading: true,
      total: 0,
      budgetTotal: []
    };
  },
};
</script>

<style lang="scss">
.title {
  font-size: 1.125rem;
}
.investmentBudgetTooltipDiv {
  .tooltip-inner {
    max-width: 500px;
    text-align: left;
  }
}

.budget {
  width: calc(100vw - 393px);
  &__header {
    p {
      font-size: larger;
      margin-bottom: 0px;
    }
    span {
      font-weight: lighter;
      font-size: small;
    }
    .investmentBudgetTooltipIcon {
      color: var(--blue);

      &:hover {
        cursor: pointer;
      }
    }
  }
  #investmentBudget {
    color: var(--black);
  }
}
.main-layout {
  display: flex;
  flex-direction: row;

  .popout {
    margin-top: 25px;
    margin-left: 25px;
    width: 240px;
    height: 270px;
    color: white;
    background-color: var(--blue);
    border-radius: 10px;
    padding: 15px 20px 10px 15px;
    font-weight: lighter;
    font-size: 14px;

    svg {
      width: 16px;
      height: 16px;
      display: block;
      margin-right: 10px;
    }

    svg > * {
      fill: #fff;
    }

    p:nth-child(1) {
      display: flex;
      height: 10px;
      line-height: 15px;
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
}

.total-planned {
  color: #451eff;
}
</style>
