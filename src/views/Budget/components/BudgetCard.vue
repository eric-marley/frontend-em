<template>
  <div>
    <div
      class="regionTitle"
      v-for="(budget, index) in budgets"
      :key="budget[0]"
    >
      <div class="region-title-header">
        <b-icon
          icon="BIconFlag"
          aria-hidden="true"
          font-scale="1.3"
          class="rewardIcon mr-3"
        />
        <span class="regionTitleName">{{ budget[0] }}</span>
      </div>
      <div class="budget-card-list">
        <b-card
          :class="`${isSelectedBudget(budgetDetails)} card-item`"
          v-for="(budgetDetails, indexDetails) in budget[1]"
          :key="budgetDetails.idSimulacao"
        >
          <div :class="`${currentBudget === budgetDetails.idSimulacao ? `loadingOn` : `loadingOff`}`"><Skeleton v-if="true" :count="9" /></div>
          <div :class="`budget-card-content__header ${currentBudget === budgetDetails.idSimulacao ? `opacity-0` : ``}`">
            <div class="budget-card__titleAndActive">
              <label :data-cy="`check-budget-item-${index}${indexDetails}`">
                <b-form-checkbox
                  @change="handleBudgetClick(budgetDetails.idSimulacao, index)"
                  v-model="budgetDetails.selected"
                />
                {{ budgetDetails.tipo !== "Personalizado" ? `Plano ${ budgetDetails.tipo}` : budgetDetails.tipo }}
              </label>
              <span
                @click="handleActiveModal(budgetDetails)"
                class="text-blue cursor-pointer ml-2"
                v-if="budgetDetails.tipo !== 'Personalizado'"
                >Ver mídias</span
              >
            </div>

            <!-- <div class="recommend" v-if="budgetDetails.recomendado">
              <b-icon
                icon="BIconAward"
                aria-hidden="true"
                class="rewardIcon"
              />
              <span class="rewardIconText">Recomendado</span>
            </div> -->
          </div>
          <div
            class="budget-card__list"
            v-bind:class="{ 'opacity-0': currentBudget === budgetDetails.idSimulacao }"
            @click="handleBudgetClick(budgetDetails.idSimulacao, index)"
          >
            <div class="list-item">
              <div class="list-text">
                <span>Investimento</span>
              </div>
              <div class="list-value">
                <div v-if="budgetDetails.tipo === 'Personalizado'">
                  <MoneyInput :value="`${budgetDetails.investimento}`" :handleOnChange="handleInvestmentChange" :budgetId="budgetDetails.id" :handleLoadingCard="handleLoadingCard" />
                </div>
                <div v-else>
                  {{ handleCurrency(budgetDetails.investimento) }}
                </div>
              </div>
            </div>
            <div class="list-item">
              <div class="list-text">
                <span>Frequência</span>
              </div>
              <div class="list-value">{{ budgetDetails.frequencia }}</div>
            </div>
            <div class="list-item">
              <div class="list-text">
                <span>Alcance semanal</span>
              </div>
              <div class="list-value">
                {{ handleNumber(budgetDetails.alcanceSemanal) }}
              </div>
            </div>
            <div class="list-item">
              <div class="list-text">
                <span>Impacto semanal</span>
              </div>
              <div class="list-value">
                {{ handleNumber(budgetDetails.impactoSemanal) }}
              </div>
            </div>
            <div class="trashIconWrap" v-if="budgetDetails.tipo === 'Personalizado'">
              <b-icon
                icon="BIconTrash"
                aria-hidden="true"
                id="investmentBudget"
                class="investmentBudgetTooltipIcon"
                @click="handleRemoveCustomBudget(index)"
              />
            </div>
          </div>
        </b-card>
        <div v-if="budget[1].length <= 3" class="budget-card__list-add">
          <button class="addBudgetWrap" @click="handleAddCustomBudget(index)">
            <b-icon
              icon="BIconPlus-circle"
              aria-hidden="true"
              id="investmentBudget"
              class="investmentBudgetTooltipIcon"
            />
            <span class="budget-card__list-add_title">Criar plano <br /> personalizado</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MoneyInput from "@/components/MoneyInput.vue";
import { Skeleton } from "vue-loading-skeleton";

export default {
  name: "BudgetCard",
  components: {
    MoneyInput,
    Skeleton
  },
  props: {
    budgets: {
      type: Array,
      required: true,
      default: () => [],
    },
    handleBudgetClick: {
      type: Function,
      required: true,
    },
    handleActiveModal: {
      type: Function,
      required: true,
    },
    handleAddCustomBudget: {
      type: Function,
      required: true,
    },
    handleRemoveCustomBudget: {
      type: Function,
      required: true,
    },
    handleInvestmentChange: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      currentBudget: ''
    };
  },
  methods: {
    handleNumber: function (number) {
      return new Intl.NumberFormat("pt-BR").format(number);
    },
    handleCurrency: function (number) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(number);
    },
    isSelectedBudget: function (budget) {
      if (budget.selected) return "budget-card-selected budget-card";
      return "budget-card";
    },
    handleLoadingCard: function (budgetId) {
      this.currentBudget = budgetId
    }
  },
};
</script>

<style lang="scss">
.loadingOff {
  display: none;
}

.loadingOn {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 1;
  top: 0;
  left: 0;
  border-radius: 10px;
  overflow: hidden;
  padding: 8px;
}
.card-item {
  position: relative;
}
.opacity-0 {
  opacity: 0;
}
.trashIconWrap {
  display: flex;
  justify-content: end;
  padding: 0;
  margin: 0;
  font-size: 12px !important;
  width: 12px;
  align-self: flex-end;
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.investment-budget-region-tooltip-div {
  max-width: 200px;
  text-align: left;
}

.regionTitle {
  .region-title-header {
    margin: 20px 0px 15px 0px;
    display: flex;
    color: var(--orange);
    align-items: center;

    &:first-child svg:last-child {
      color: var(--blue);
    }
  }

  .budget-card-list {
    gap: 15px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .budget-card__list-add {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--orange);
    position: relative;

    & svg {
      fill: var(--orange);
      margin: 0 !important;
    }

    &:hover {
      cursor: pointer;
    }

    .budget-card__list-add_title{
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 400;
    }
    .addBudgetWrap {
      border: 0;
      background: transparent;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--orange);
    }
  }

  .regionTitleName {
    margin-right: 1rem;
    font-size: large;
    font-weight: bold;
  }
}

.budget-card-selected {
  border: 2px solid var(--orange);
  .custom-control-label:after {
    background-image: url("~@/assets/checkIcon.png") !important;
    background-color: var(--orange);
    border-radius: 6px;
  }
}

.card {
  border-radius: 8px;
}

.card-body {
  padding: 18px 20px;
}

.budget-card {
  border-radius: 10px;
  width: 100%;
  height: 180px;
  display: flex;
  position: relative;
  :hover {
    cursor: pointer;
  }

  &__titleAndActive {
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
      display: flex;
    }
  }

  &__list {
    display: flex;
    justify-content: space-between;
    margin-top: 35px;
    flex-direction: column;

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2px 0px;

      .list-text {
        span {
          font-weight: normal;
          font-size: 12px;
        }
        svg {
          width: 16px;
        }
      }
      .list-value {
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        padding-top: 3px;
      }

    }
  }

  .rewardIcon {
    color: var(--green);
    font-size: 11px !important;
  }
  .rewardIconText {
    color: var(--green);
    margin-left: 5px;
    font-size: 11px !important;
  }
}

.budget-card-content__header {
  position: relative;
  // .recommend {
  //   position: absolute;
  //   top: 20px;
  // }
}

.budget-card__titleAndActive {
  label {
    display: flex;
    align-items: center;
    margin: 0;
    font-size: 13px;
  }

  span {
    font-size: 11px !important;
  }
}

.budget-card__list {
  margin-top: 0;
}

.cursor-pointer {
  cursor: pointer;
}
</style>