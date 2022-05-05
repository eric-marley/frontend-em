<template>
  <MainLayout>
    <div class="plans-list">
      <b-row no-gutters class="align-items-center">
        <b-col cols="2" class="mr-4">
          <h1 class="m-0 p-0">Painel do cliente</h1>
        </b-col>
        <b-col cols="2">
          <b-form-select
            v-model="selectedClient"
            :options="clients"
            id="select-plans"
            @change="handleClient"
          ></b-form-select>
        </b-col>
      </b-row>
      <Container>
        <b-row>
          <b-col class="d-flex">
            <h2 class="m-0 self-center">Planos de mídia {{ account.name }}</h2>
          </b-col>
          <b-col>
            <div class="float-right">
              <b-button
                variant="primary"
                class="to-right"
                style="margin-right: 6px"
                data-cy="btn-start-planning"
                @click="createNewPlanning(account._id)"
              >
                <PlayCircleOutlineIcon></PlayCircleOutlineIcon>
                Iniciar Planejamento
              </b-button>

              <b-dropdown id="filter-dropdown" variant="light" class="m-2" style="display: none;">
                <template #button-content>
                  <FilterOutlineIcon></FilterOutlineIcon>
                  Filtro
                </template>
                <b-dropdown-item href="#"></b-dropdown-item>
              </b-dropdown>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h3>Lista de Planos de mídia</h3>
            <div>
              <b-table
                id="media-plans-table"
                small
                sort-icon-left
                ref="plans_table"
                :busy.sync="isBusy"
                :items="paginateTable"
                :fields="fields"
                :per-page="perPage"
                :current-page="currentPage"
              >
                <template #cell(actions)="row">
                  <b-icon
                    icon="eye"
                    class="default-icon-sizing custom-cursor"
                    v-if="row"
                    :id="'view-resume' + row.item.id"
                    @click="handleResume(row.item.id)"
                  />
                  <b-icon
                    icon="pen"
                    :id="'edit-plan' + row.item.id"
                    class="default-icon-sizing custom-cursor"
                    @click="handleEdit(row.item.id)"
                  />
                  <b-tooltip :target="'view-resume' + row.item.id" :key="row.item.id" custom-class="tooltip-table-actions" triggers="hover" container="media-plans-table">
                    Visualizar
                  </b-tooltip>
                  <b-tooltip :target="'edit-plan' + row.item.id" custom-class="tooltip-table-actions" triggers="hover" container="media-plans-table">
                    Editar
                  </b-tooltip>
                </template>
              </b-table>
            </div>
          </b-col>
        </b-row>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="media-plans-table"
          style="justify-content: flex-end;"
          class="m-0"
        ></b-pagination>
      </Container>
    </div>
  </MainLayout>
</template>

<script>
import Container from "@/components/Container.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import PlayCircleOutlineIcon from "vue-material-design-icons/PlayCircleOutline.vue";
import FilterOutlineIcon from "vue-material-design-icons/FilterOutline.vue";

import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Plans",
  components: {
    PlayCircleOutlineIcon,
    FilterOutlineIcon,
    Container,
    MainLayout,
  },
  data() {
    return {
      selectedClient: null,
      fields: [
        {
          key: "campaign",
          label: "Nome da campanha",
          sortable: true,
        },
        {
          key: "goal",
          label: "Objetivo",
          sortable: true,
        },
        {
          key: "period",
          label: "Período",
          sortable: true,
        },
        {
          key: "budget",
          label: "Budget",
          sortable: true,
        },
        {
          key: "created",
          label: "Data de criação",
          sortable: true,
        },
        {
          key: "actions",
          label: "Opções",
          thStyle: {
            width: "12%",
            textAlign: "center",
          },
          tdClass: "text-align-center",
        },
      ],
      mediaPlansFormatted: [],
      currentPage: 1,
      isBusy: false
    };
  },
  computed: {
    ...mapGetters({
      accounts: "account/accounts",
      account: "account/account",
      mediaPlans: "media_plans/mediaPlans",
      mediaPlan: "media_plans/mediaPlan",
      pagination: "media_plans/pagination"
    }),
    clients() {
      return this.accounts.map((item) => {
        return {
          value: item,
          text: item.name,
        };
      });
    },
    perPage() {
      return 10;
    },
    totalRows() {
      return this.pagination.total;
    },
  },
  methods: {
    ...mapActions({
      getMediaPlans: 'media_plans/fetchAll',
      getMediaPlan: 'media_plans/getMediaPlan',
    }),
    ...mapMutations({
      SET_CURRENT_ACCOUNT: 'account/SET_CURRENT_ACCOUNT',
      RESET_MEDIA_PLAN: 'media_plans/RESET',
      RESET_MEDIAS: 'medias/RESET',
      RESET_TARGET: 'targets/RESET',
      RESET_BUDGET: 'budget/RESET',
      RESET_RESUME: 'resume/RESET',
      RESET_STEPS: 'steps/RESET',
    }),
    async paginateTable() {
      await this.getMediaPlans({ 
          accountId: this.account._id,
          limit: this.perPage,
          skip: (this.currentPage - 1) * this.perPage + 1,
      });
      this.updateTable();
      return this.mediaPlansFormatted;
    },
    async handleClient() {
      this.SET_CURRENT_ACCOUNT(this.selectedClient);
      await this.getMediaPlans({ accountId: this.account._id });
      this.updateTable();
      this.$refs.plans_table.items = this.mediaPlansFormatted;
    },
    createNewPlanning(accountId) {
      this.RESET_MEDIA_PLAN();
      this.RESET_TARGET();
      this.RESET_MEDIAS();
      this.RESET_BUDGET();
      this.RESET_RESUME();
      this.RESET_STEPS();

      this.$router.push({
        name: "IdentificationLocals",
        params: { accountId: accountId },
      });
    },
    async handleEdit(id) {
      await this.getMediaPlan({ id });
      this.$router.push({
        name: "IdentificationLocals",
        params: { accountId: this.account._id },
      });
    },
    async handleResume(id) {
      await this.getMediaPlan({ id });
      this.$router.push({ path: `/resumo/${id}` });
    },
    updateTable() {
      this.mediaPlansFormatted = this.mediaPlans.map((item) => {
        // # NEEDS REFACTORING
        const startDate = item.period?.startDate
          ? new Date(item.period?.startDate).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })
          : null;

        // # NEEDS REFACTORING
        let budget = parseFloat(item.budgetInCents) / 100;
        budget = isNaN(budget) ? 0 : budget;
        const formattedValue = budget.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });

        const objective =
          item.objective.type === "PLACES_BY_TARGET"
            ? "Melhores Locais baseados no target"
            : "Cercar endereços de interesse";

        return {
          id: item._id,
          campaign: item.name,
          goal: objective,
          period: item.period?.type,
          budget: formattedValue,
          created: startDate,
        };
      });
    },
  },
  async mounted() {
    this.selectedClient = this.account;
    await this.getMediaPlans({ 
      accountId: this.account._id,
      limit: this.perPage,
      offset: 0
    });
    this.updateTable();
    this.$refs.plans_table.items = this.mediaPlansFormatted;
  },
  created () {
    this.RESET_STEPS();
  }
};
</script>

<style lang="scss" scoped>
  h3{
    font-size: 18px;
    margin-bottom: 25px;
  }

  .customContainer {
    min-height: 78vh;
  }

  .to-right {
    font-weight: 600;
    text-align: right;
  }

  .default-icon-sizing {
    width: 20px;
    height: 14px;
  }

  .custom-cursor {
    cursor: pointer;
  }

  ::v-deep .text-align-center {
    text-align: center;
  }
  select.custom-select {
    /* Cinza/card-stroke */
    border: 1px solid #c6cfd6;
    border-radius: 4px;

    min-height: 40px;

    color: #262626 !important;

    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.1px;
  }

  ::v-deep .table > thead {
    background: #f8f8f9;
    border: 1px solid #dcdde1;
    box-sizing: border-box;

    th {
      padding: 19px 26px 19px 26px;

      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      align-items: flex-end;
      letter-spacing: 0.2px;

      color: rgba(0, 0, 0, 0.56);
    }
  }

  ::v-deep
    .table.b-table.table-sm
    > thead
    > tr
    > [aria-sort].b-table-sort-icon-left,
  .table.b-table.table-sm > tfoot > tr > [aria-sort].b-table-sort-icon-left {
    background-position: left 25px center;
    padding-left: 45px;
  }

  ::v-deep .table > tbody {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;

    color: rgba(0, 0, 0, 0.87);

    tr {
      border-bottom: 1px solid #dcdde1;
      td {
        padding-left: 26px;
        padding-top: 15px;
        padding-bottom: 15px;
      }
    }
  }
  ::v-deep #media-plans-table .tooltip-table-actions .tooltip-inner {
    background-color: var(--blue)
  }

  ::v-deep #media-plans-table .tooltip-table-actions .arrow::before {
    border-top-color: var(--blue)
  }

</style>