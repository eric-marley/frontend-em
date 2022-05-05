<template>
  <MainLayout>
    <div class="mb-6">
      <h1>Novo planejamento - {{ account.name }}</h1>
      <Steps :current="currentStep" />
      <Container class="custom-width view">
        <header>
          <div>
            <h2 class="title">{{ page.header.title }}</h2>
            <p>{{ page.header.subtitle }}</p>
          </div>

          <SearchInput @searchBy="handleSearchByTarget" :value="searchValue" />
        </header>
        <Skeleton v-if="!targets.hasLoaded" :count="20" />
        <section v-if="targets.hasLoaded" class="target-tags">
          <ul class="tag-list scrolled" ref="targets">
            <li
              @click="handleTargetSelection"
              v-for="(target, index) in availableTargets"
              :key="index"
              :data-id="target._id"
              :data-type="target.type"
              :class="{ active: target.selected }"
              :data-cy="`badge-target-${index}`"
            >
              {{ target.name }}
              <svg @click="handleTargetRemoval" width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8.49c0-.578-.054-1.146-.163-1.7a8.746 8.746 0 0 0-.508-1.594 7.62 7.62 0 0 0-.779-1.448 8.03 8.03 0 0 0-1.033-1.268 9.654 9.654 0 0 0-1.269-1.032A8.604 8.604 0 0 0 11.817.67 7.88 7.88 0 0 0 10.222.18 8.09 8.09 0 0 0 8.5 0a8.09 8.09 0 0 0-1.722.181A7.88 7.88 0 0 0 5.183.67a8.608 8.608 0 0 0-1.431.778c-.46.314-.882.658-1.27 1.032A8.026 8.026 0 0 0 1.45 3.748c-.314.458-.58.941-.798 1.448a9.76 9.76 0 0 0-.489 1.593A8.833 8.833 0 0 0 0 8.491c0 .591.054 1.165.163 1.72.12.555.284 1.086.49 1.593.217.507.483.99.797 1.448.302.447.646.863 1.033 1.25.387.386.81.73 1.269 1.031a7.88 7.88 0 0 0 3.026 1.286A8.09 8.09 0 0 0 8.5 17a8.09 8.09 0 0 0 1.722-.181 7.882 7.882 0 0 0 3.026-1.285c.46-.302.882-.646 1.27-1.032.386-.387.73-.803 1.032-1.25.314-.458.574-.941.78-1.448a8.745 8.745 0 0 0 .507-1.593A8.933 8.933 0 0 0 17 8.49Zm-1.54 0c0 .967-.182 1.872-.544 2.717a6.974 6.974 0 0 1-1.486 2.208A7.2 7.2 0 0 1 11.2 14.9a6.704 6.704 0 0 1-2.7.543 6.834 6.834 0 0 1-2.719-.543 7.264 7.264 0 0 1-2.21-1.485 6.974 6.974 0 0 1-1.487-2.208 6.814 6.814 0 0 1-.543-2.716c0-.954.18-1.853.543-2.698A6.975 6.975 0 0 1 3.57 3.585 7.265 7.265 0 0 1 5.781 2.1 6.644 6.644 0 0 1 8.5 1.54c.967 0 1.867.187 2.7.561a7.202 7.202 0 0 1 2.23 1.485 6.975 6.975 0 0 1 1.486 2.208c.362.845.543 1.744.543 2.698ZM5.636 6.718 7.413 8.49l-1.777 1.774a.766.766 0 0 0-.235.561c0 .206.078.38.235.525a.71.71 0 0 0 .544.236.71.71 0 0 0 .544-.236L8.5 9.595l1.776 1.756a.71.71 0 0 0 .544.236.71.71 0 0 0 .543-.236.688.688 0 0 0 .236-.525.766.766 0 0 0-.236-.56L9.588 8.49l1.777-1.774a.688.688 0 0 0 .235-.525.766.766 0 0 0-.236-.562.738.738 0 0 0-.543-.217.738.738 0 0 0-.544.217L8.5 7.405 6.724 5.63a.738.738 0 0 0-.544-.217.738.738 0 0 0-.544.217.766.766 0 0 0-.235.562c0 .205.078.38.235.525Z" :fill="handleTargetTagColor(target.type)"/>
              </svg>
            </li>
          </ul>
          <div class="tag-caption">
            <span class="tag-description" v-for="caption in captions" :key="caption.type">
              <span class="tag-bullet" :data-type="caption.type" />
              {{ caption.description }}
            </span>
          </div>
        </section>
        <section  v-if="targets.hasLoaded" class="target-result">
          <b-row>
            <b-col>
              <h3>{{ targets.title }}</h3>
              <div class="result-list">
                <Fragment>
                  <h4>{{ targets.currentTarget.descriptions.title }}</h4>
                  <ul>
                    <li v-for="(description, index) in targets.currentTarget.descriptions.data" :key="index">{{ description }}</li>
                  </ul>
                </Fragment>
                <Fragment v-if="targets.currentTarget.behaviors.hasOwnProperty('title')">
                  <h4>{{ targets.currentTarget.behaviors.title }}</h4>
                  <ul>
                    <li>{{ targets.currentTarget.behaviors.data }}</li>
                  </ul>
                </Fragment>
                <Fragment v-if="targets.currentTarget.interests.hasOwnProperty('title')">
                  <h4>{{ targets.currentTarget.interests.title }}</h4>
                  <ul>
                    <li>{{ targets.currentTarget.interests.data }}</li>
                  </ul>
                </Fragment>
                <Fragment v-if="targets.currentTarget.educationalLevel.hasOwnProperty('title')">
                  <h4>{{ targets.currentTarget.educationalLevel.title }}</h4>
                  <ul>
                    <li>{{ targets.currentTarget.educationalLevel.data }}</li>
                  </ul>
                </Fragment>
              </div>
            </b-col>
            <b-col>
              <div class="universe-content">
                <h4>{{ targets.currentTarget.universes.title }}</h4>
                <span>
                  {{ targets.currentTarget.universes.description }}
                  <b-icon
                    icon="BIconExclamation-circle"
                    aria-hidden="true"
                    id="target-universes"
                    class="tip-icon"
                    v-b-tooltip.hover.right.html="tooltip.universes"
                  />
                </span>
                <div class="universes-table-wrapper scrolled">
                  <b-table bordered :items="targets.currentTarget.universes.data" :fields="targets.currentTarget.universes.headers" />
                </div>
              </div>
            </b-col>
          </b-row>
        </section>
      </Container>
      <div id="footer" class="d-flex">
        <b-button variant="outline-secondary" class="mr-3 ml-auto" @click="previoustPage">Voltar</b-button>
        <b-button variant="primary" @click="nextPage" :disabled="!targets.hasSelection" data-cy="btn-next">Próximo</b-button>
      </div>
    </div>
  </MainLayout>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import { Fragment } from 'vue-frag'

  import MainLayout from '@/layouts/MainLayout.vue'
  import Container from '@/components/Container.vue'
  import Steps from '@/components/Steps.vue'
  import SearchInput from '@/components/SearchInput.vue'

  import { Skeleton } from "vue-loading-skeleton";

  export default {
    name: 'TargetView',
    components: {
      MainLayout,
      Container,
      Steps,
      SearchInput,
      Fragment,
      Skeleton
    },
    data () {
      return {
        currentStep: 'target',
        page: {
          header: {
            title: 'Definição do target',
            subtitle: 'Selecione a categoria no campo de busca, veja detalhes e defina o target.'
          }
        },
        tooltip: {
          universes: `
            <strong>Região:</strong> nome da(s) região(ões) selecionada(s) anteriormente<br>
            <strong>Universo:</strong> a quantidade de pessoas presentes na região<br>
            <strong>Target:</strong> quantidade de pessoas do target na região<br>
            <strong>Composição:</strong> Porcentagem do target no universo que será impactado<br>
          `,
        },
        captions: [
          { type: 'demographic', description: 'Azul: seleção de tags demográficas' },
          { type: 'behavioral', description: 'Laranja: seleção de tags comportamentais' },
        ],
        searchValue: ''
      }
    },
    computed: {
      ...mapGetters({
        targets: 'targets/targets',
        stepHeaders: 'steps/stepHeaders',
        account: "account/account",
      }),
      availableTargets() {
        if (!this.targets.hasFiltereds) return this.targets.data
        return this.targets.data.filter(target => target.filtered)
      },
    },
    methods: {
      ...mapMutations({
        SET_TARGETS: 'targets/SET_TARGETS',
        SET_CURRENT_TARGET: 'targets/SET_CURRENT_TARGET',
        HAS_SELECTION: 'targets/HAS_SELECTION',
        HAS_FILTEREDS: 'targets/HAS_FILTEREDS',
        SET_SELECTED_TARGET: 'targets/SET_SELECTED_TARGET',
        SET_CURRENT_STEP: 'steps/SET_STEP_HEADERS',
      }),
      ...mapActions({
        getTargets: 'targets/getTargets',
        saveTargets: 'targets/saveTargets',
      }),
      handleSearchByTarget(value) {
        const searchedText = value.toLowerCase().trim()
        const hasContent = searchedText !== ''

        if (hasContent) {
          this.searchValue = searchedText

          const targets = this.targets.data.map(target => {
            const hasTargetName = target.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1

            const regex = new RegExp(searchedText, 'gi')

            const hasTargetBehaviors = regex.test(target.behaviors.data)
            const hasTargetInterests = regex.test(target.interests.data)
            const hasTargetEducationalLevels = regex.test(target.educationalLevel.data)

            target.filtered = hasTargetName || hasTargetBehaviors || hasTargetInterests || hasTargetEducationalLevels

            return target
          })

          if (targets.some(target => target.filtered)) this.HAS_FILTEREDS(true)
        } else {
          this.HAS_FILTEREDS(false)
        }
      },
      handleTargetTagColor(type) {
        return this.targets.colors[type]
      },
      async handleTargetSelection(event) {
        const selectedTarget = event.target
        const selectedTargetIsValid = selectedTarget.tagName === 'LI'

        if (selectedTargetIsValid) {
          this.SET_TARGETS(
            this.targets.data.map(target => {
              target.selected = selectedTarget.textContent.trim() === target.name
              return target
            })
          )

          this.SET_CURRENT_TARGET(this.targets.data.find(target => target.selected))
          this.HAS_SELECTION(true)
        }
      },
      handleTargetRemoval(event) {
        const selectedTarget = event.target.parentNode
        const selectedTargetIsActive = selectedTarget.classList.contains('active')

        if (selectedTargetIsActive) {
          if (this.targets.hasFiltereds) {
            this.SET_TARGETS(this.targets.data.map(target => {
              target.selected = false
              target.filtered = false

              return target
            }))
            this.HAS_FILTEREDS(false)
          }

          this.SET_TARGETS(this.targets.data.map(target => {
            target.selected = false
            return target
          }))
          this.SET_CURRENT_TARGET({})
          this.HAS_SELECTION(false)
        }
      },
      previoustPage() {
        this.$router.push({ name: 'IdentificationLocals' })
      },
      async nextPage() {
        this.SET_CURRENT_STEP(
          this.stepHeaders.map(stepHeader => {
            if (stepHeader.name === this.currentStep) stepHeader.done = true
            return stepHeader
          })
        )

        const selectedTarget = Array.from(this.$refs['targets'].querySelectorAll('li')).find(target => target.classList.contains('active'))

        this.SET_TARGETS(this.targets.data.map(item => {
          item.selected = (item.name === selectedTarget.textContent.trim()) ? true : false
          return item
        }))

        await this.saveTargets()

        this.$router.push({ name: 'ActivesPeriod' })
      },
    },
    async created() {
      this.isLoading = true;
      await this.getTargets()
    },
    async beforeMount() {
      // this.isLoading = false;
    }
  }
</script>

<style lang="scss" scoped>
.title {
  font-size: 1.125rem;
}
  .tip-icon {
    color: var(--blue);
    margin-left: 5px;

    &:hover {
      cursor: pointer;
    }
  }

  /*
   * CONTEXT - COMMON
   */

  h2, h3, h4, p, li, .tag-description {
    font-family: Inter;
    font-style: normal;
  }

  h2,
  h3 {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
  }

  /*
   * CONTEXT - HEADER
   */

  header {
    display: flex;
    justify-content: space-between;

    h2 {
      letter-spacing: 0.2px;
      color: #000000;
      margin-bottom: 6px;
    }

    p {
      font-weight: normal;
      font-size: 11px;
      line-height: 14px;
      letter-spacing: 0.2px;
      color: #262626;
    }
  }

  h3 {
    display: flex;
    align-items: center;
    letter-spacing: 0.2px;
    color: var(--primary);
    margin-top: 6px;
    margin-bottom: 12px;
  }

  h4 {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.1px;
    color: var(--orange);
    margin-bottom: 6px;

    + p {
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      letter-spacing: 0.2px;
      color: #262626;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .result-list {
    ul { 
      margin-left: 24px;

      li {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }

  .target-tags {
    padding: 12px 10px;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 12px;

    ul.tag-list {
      list-style: none;
      display: flex;
      flex-wrap: wrap;

      li {
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        text-align: center;
        color: #ACACAC;
        background: #F1F1F1;
        border-radius: 12px;
        height: 24px;
        padding: 0 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        margin-bottom: 8px;
        transition: all 250ms;
        position: relative;

        &:hover {
          color: #fff;
          padding: 0 35px 0 15px;

          cursor: pointer;

          svg {
            opacity: 1;
          }
        }

        &.active {
          color: var(--white);
        }

        &.active[data-type="demographic"],
        &[data-type="demographic"]:hover {
          background: var(--blue);
          color: var(--white);
        }

        &.active[data-type="behavioral"],
        &[data-type="behavioral"]:hover {
          background: var(--orange);
          color: var(--white);
        }

        &[data-type="demographic"]{
          background: var(--lighter-blue);
          color: var(--blue);
        }

        &[data-type="behavioral"]{
          background: var(--lighter-orange);
          color: var(--orange);
        }

        svg {
          margin-left: 5px;
          opacity: 0;
          transition: all 250ms;
          position: absolute;
          right: 5px;
          path {
            pointer-events: none;
          }
        }
      }
    }

    .tag-caption {
      align-self: flex-end;
      display: flex;

      .tag-description {
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        text-align: center;
        color: #A8A8A8;
        display: flex;

        &:not(:last-child) {
          margin-right: 24px;
        }

        .tag-bullet {
          width: 15px;
          height: 15px;
          display: block;
          border-radius: 50%;
          margin-right: 7.5px;
        }

        [data-type="demographic"] {
          background: var(--blue);
          color: var(--white);
        }

        [data-type="behavioral"] {
          background: var(--orange);
          color: var(--white);
        }
      }
    }
  }

  /*
   * CONTEXT - UNIVERSES
   */

  .universe-content {
    padding: 12px 10px;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 3px;

    span {
      margin-bottom: 20px;
      display: block;
    }

    svg {
      margin-left: 5px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .universes-table-wrapper {
    height: 260px;
    overflow-y: auto;
  }

  ::v-deep .table {
    width: calc(100% - 12px);

    > thead th,
    > tbody td {
      font-family: Inter;
      font-style: normal;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.2px;
      border-color: #E0E0E0;
      vertical-align: middle;

      &:first-child,
      &:last-child {
        padding: 0 32px;
      }
    }

    > thead {
      background-color: #F8F8F9;

      th {
        border-bottom: none;
        height: 56px;
        color: rgba(0, 0, 0, 0.56);
        > div {
          font-weight: bold;
        }
      }
    }

    > tbody {
      td {
        height: 48px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
      }
    }
  }

  /*
   * CONTEXT - SCROLLBAR
   */

  .scrolled {
    overflow-y: auto;
  }

  .scrolled::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: transparent;
  }

  .scrolled::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  .scrolled::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #E3E3E3;
  }

  /*
   * CONTEXT - FOOTER
   */

  #footer {
    background: var(--white);
    position: fixed;
    bottom: 0;
    width: calc(100% - 50px);
    left: 50px;
    padding: 15px 15px;
    border: 1px solid var(--light-gray2);
  }
</style>