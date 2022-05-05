import Money from '../helpers/money'
import targetService from '../services/target.service'

const initialState = {
  targets: {
    currentTarget: null,
    data: [],
    tag: {
      padding: 40
    },
    types: {
      DEMOGRAFICO: 'demographic',
      COMPORTAMENTAL: 'behavioral'
    },
    colors: {
      demographic: '#FFFFFF',
      behavioral: '#FFFFFF'
    },
    title: 'Resultados',
    hasSelection: true,
    hasFiltereds: false,
    hasLoaded: false,
  },
}

export default {
  namespaced: true,
  root: true,
  state: initialState,
  getters: {
    targets: (state) => state.targets,
  },
  mutations: {
    SET_TARGETS: (state, targets) => state.targets.data = targets,
    SET_CURRENT_TARGET: (state, target) => state.targets.currentTarget = target,
    HAS_SELECTION: (state, status) => state.targets.hasSelection = status,
    HAS_FILTEREDS: (state, status) => state.targets.hasFiltereds = status,
    HAS_LOADED: (state, status) => state.targets.hasLoaded = status,
    RESET: (state) => Object.assign(state, initialState),
  },
  actions: {
    getTargets: async ({ state, commit, rootState }) => {
      const mediaPlanId = rootState.media_plans.mediaPlan._id
      const [targetsResponse, universesResponse] = await Promise.all([
        targetService.getTargets(mediaPlanId),
        targetService.getUniverses(mediaPlanId)
      ])
      const targets = []

      targetsResponse.forEach((target) => {
        let behaviors = {}
        let interests = {}
        let educationalLevel = {}

        const descriptions = target.descriptions
          .map((description => {
            if (description.content === ('Pessoas que correspondem a:' || 'E também deve corresponder a:')) {
              description.children.forEach(item => {
                const [key, value] = item.split(':')

                if (key === 'Comportamentos') behaviors = { title: `${key}:`, data: value }
                if (key === 'Interesses') interests = { title: `${key}:`, data: value }
                if (key === 'Nível educacional') educationalLevel = { title: `${key}:`, data: value }
              })
            }

            return `${description.content} ${description.children.join(', ')}`
          }))
          .filter(description => (
            !/Pessoas que correspondem a:|E também deve corresponder a:|Excluir:/.test(description)
          ))

        const mappedUniverses = []

        universesResponse.forEach(universe => {
          if (universe.nomeTarget === target.name) {
            mappedUniverses.push({
              _id: universe.regiaoId,
              region: universe.nomeRegiao,
              population: Money.convertToDecimal(universe.universos.total),
              target: Money.convertToDecimal(universe.universos.target),
              percentage: `${(universe.universos.perc * 100).toFixed(2)}%`,
              label: universe.universos.nomeTarget,
            })
          }
        })

        targets.push({
          ...target,
          type: state.targets.types[target.type],
          descriptions: {
            title: 'Descrição',
            data: descriptions,
          },
          behaviors,
          interests,
          educationalLevel,
          filtered: false,
          universes: {
            title: 'Universos',
            description: 'Conheça mais sobre esses universos',
            headers: [
              { key: 'region', label: 'Região' },
              { key: 'population', label: 'Universo' },
              { key: 'target', label: 'Target' },
              { key: 'percentage', label: 'Composição' },
            ],
            data: mappedUniverses,
          }
        })
      })

      if (state.targets.currentTarget) {
        commit('SET_TARGETS', state.targets.data)
      } else {
        const parseTargets = []
        targets.forEach((target, index) => {
          parseTargets.push({
            ...target,
            selected: (index === 0) ? true : false
          })
        })
        commit('SET_TARGETS', parseTargets)
      }

      commit('SET_CURRENT_TARGET', state.targets.data.find(target => target.selected))
      commit('HAS_LOADED', true)
    },
    saveTargets: async ({ state, rootState }) => {
      const _id = rootState.media_plans.mediaPlan._id
      const targetId = state.targets.currentTarget._id

      await targetService.saveTargets(_id, [targetId])
    }
  }
}
