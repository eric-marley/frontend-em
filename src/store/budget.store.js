import resumeService from '../services/resume.service'

const getDefaultState = () => {
    return {
        budgets: {},
    };
};

export default {
    namespaced: true,
    state: getDefaultState(),
    getters: {
        budgets: (state) => {
            return state.budgets;
        },
    },
    mutations: {
        SET_BUDGETS: (state, budgets) => {
            state.budgets = budgets;
        },
        SET_SELECTED_BUDGETS: (state, budget) => {
            state.budgets = budget;
        },
        RESET: (state) => {
            Object.assign(state, getDefaultState());
        },
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        fetchAll: async ({ rootState, commit }) => {
            const mediaPlanId = rootState.media_plans.mediaPlan._id
            const investmentsResponse = await resumeService.getInvestments(mediaPlanId)
            commit('SET_BUDGETS', investmentsResponse)
        },
        addToBudgets: async ({ commit }, budgets) => {
            commit('SET_BUDGETS', budgets)
        },
        setSelectedBudget: ({ commit }, { budget }) => {
            commit("SET_SELETECED_BUDGETS", budget);
        },
    },
};
