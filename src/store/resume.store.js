import Money from '../helpers/money'
import resumeService from '../services/resume.service'

const initialState = {
  modal: {
    share: {
      visible: false,
    }
  },
  investiments: null,
  investmentsAmount: null,
  locations: null,
  mediaPlan: {
    investments: {},
    investmentsAmount: {
      investiment: 0,
      weeklyReach: 0,
      frequency: 0,
      weeklyImpact: 0,
      grp: 0,
    }
  },
  map: null,
  fields: {
    investiments: [
      { key: "city", label: "Cidade", sortable: true },
      { key: "investiment", label: "Investimento", sortable: false },
      { key: "weeklyReach", label: "Alcance semanal", sortable: false },
      { key: "frequency", label: "Frequência", sortable: false },
      { key: "weeklyImpact", label: "Impacto semanal", sortable: false },
      { key: "grp", label: "GRP", sortable: false },
    ],
    locations: [
      { key: "name", label: "Nome", sortable: true },
      { key: "media", label: "Mídia", sortable: true },
      { key: "address", label: "Endereço", sortable: true },
      { key: "city", label: "Cidade", sortable: true },
    ],
  },
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
    shareModalView: (state) => state.modal.share.visible,
    locations: (state) => state.locations,

    map: (state) => state.map,
    fields: (state) => state.fields,
    mediaPlan: (state) => state.mediaPlan,
  },
  mutations: {
    SET_SHARE_MODAL_DISPLAY: (state, status) => state.modal.share.visible = status,
    SET_LOCATIONS: (state, locations) => state.locations = locations,
    SET_MAP: (state, data) => state.map = data,
    SET_MEDIAPLAN: (state, mediaPlan) => {
      state.mediaPlan = mediaPlan;
    },
    RESET: (state) => Object.assign(state, initialState),
    HAS_LOADED: (state, status) => state.targets.hasLoaded = status,
  },
  actions: {
    getLocations: async ({ commit }, { mediaPlanId }) => {
      const locationsData = await resumeService.getResumeLocations(mediaPlanId)
      delete locationsData.metricas
      const dataMapped = [];
      locationsData.map(location => {
        return location.locais.map(locationDetails => {
          dataMapped.push({
          name: locationDetails.nome,       
          media: locationDetails.midia,
          address: `${locationDetails.endereco.endereco}, ${locationDetails.endereco.numero} - ${locationDetails.endereco.bairro}`,
          city: locationDetails.endereco.cidade,
        })})
      })
      commit('SET_LOCATIONS', dataMapped)
    },
    getMap: async ({ commit }, { mediaPlanId }) => {
      const mapData = await resumeService.getMap(mediaPlanId)
      commit('SET_MAP', mapData)
    },
    getMediaPlan: async ({ state, commit }, { mediaPlanId }) => {
      const mapInvestments = (investments, amount) => 
        Object.entries(investments).reduce((acc, item) => {
          const [key, value] = item
  
          amount.investiment += value.investimento || 0
          amount.weeklyReach += value.alcanceSemanal || 0
          amount.frequency += value.frequencia || 0
          amount.weeklyImpact += value.impactoSemanal || 0
          amount.grp += value.grp || 0
  
          acc.push({
              city: key.split(',')[0],
              investiment: Money.convertToCurrency(value.investimento || 0),
              frequency: value.frequencia?.toFixed(2).toString() || 0,
              weeklyReach: Money.convertToDecimal(value.alcanceSemanal || 0),
              weeklyImpact: Money.convertToDecimal(value.impactoSemanal || 0),
              grp: Money.convertToDecimal(value.grp || 0),
          })
  
          return acc
        }, [])

      const mapTargets = (targets) =>
        targets.map((target, index) => {
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
  
          return {
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
            selected: index === 0
          }
        })
    
      
      const mediaPlanData = await resumeService.getMediaPlan(mediaPlanId)
      const mediaPlan = { ...state.mediaPlan, ...mediaPlanData }

      const targets = mapTargets(mediaPlan.targets);
      const [currentTarget] = targets;

      
      if (mediaPlan.targets) {
        mediaPlan.targets = targets;
        mediaPlan.currentTarget = currentTarget;
      }
      
      if (mediaPlan.investimentos) {
        const amount = {
          investiment: 0,
          weeklyReach: 0,
          frequency: 0,
          weeklyImpact: 0,
          grp: 0
        }
        mediaPlan.investments = mapInvestments(mediaPlan.investimentos, amount)
        mediaPlan.investmentsAmount = amount
      }

      commit('SET_MEDIAPLAN', mediaPlan)
      commit('HAS_LOADED', true)
    },
  }
}