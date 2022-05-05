const initialState = {
  steps: {
    maxStep: 1,
    headers: [
      { index: 1, name: 'local', description: 'Identificação e locais', current: true, done: false },
      { index: 2, name: 'target', description: 'Target', current: false, done: false },
      { index: 3, name: 'media', description: 'Mídias e período', current: false, done: false },
      { index: 4, name: 'budget', description: 'Budget', current: false, done: false },
      { index: 5, name: 'resume', description: 'Resumo', current: false, done: false },
    ]
  }
}
  
export default {  
  namespaced: true,
  root: true,
  state: initialState,
  getters: {
    stepHeaders: (state) => state.steps.headers,
    maxStep: (state) => state.steps.maxStep
  },
  mutations: {
    SET_STEP_HEADERS: (state, headers) => state.steps.headers = headers,
    SET_MAX_STEP: (state, index) => state.steps.maxStep = index,
    RESET: (state) => Object.assign(state, initialState), 
  },
}