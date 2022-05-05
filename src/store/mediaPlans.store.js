import mediaPlansService from "../services/mediaPlans.service";

const getDefaultState = () => {
    return {
      mediaPlans : [],
      pagination: {
        currentPage: 1,
        limit: 10,
        offset: null,
        total: null,
        totalPages: null
      },
      mediaPlan: {},
      location: {},
      locals: []
    };
  };
  
  export default {
    namespaced: true,
    state: getDefaultState(),
    getters: {
      mediaPlans: (state) => {
        return state.mediaPlans;
      },
      mediaPlan: (state) => {
        return state.mediaPlan;
      },
      location: (state) => {
        return state.location;
      },
      locals: (state) => {
        return state.locals;
      },
      pagination: (state) => {
        return state.pagination;
      }
    },
    mutations: {
      SET_MEDIAPLANS: (state, mediaPlans) => {
        state.mediaPlans = mediaPlans;
      },
      SET_MEDIAPLAN: (state, mediaPlan) => {
        state.mediaPlan = mediaPlan;
      },
      SET_UPLOAD_LOCATIONS: (state, location) => {
        state.location = location;
      },
      SET_LOCALS: (state, locals) => {
        state.locals = locals;
      },
      SET_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      RESET: (state) => {
        Object.assign(state, getDefaultState());
      },
    },
    actions: {
      fetchAll: async ({ commit }, { accountId, limit, skip }) => {
        const plansResponse = await mediaPlansService.fetchAll({accountId, limit, skip});
        commit("SET_MEDIAPLANS", plansResponse.items);
        commit("SET_PAGINATION", {
          currentPage: parseInt(plansResponse.currentPage),
          limit: parseInt(plansResponse.limit),
          offset: plansResponse.offset,
          total: plansResponse.total,
          totalPages: plansResponse.totalPages
        })
      },
      createOrUpdateMediaPlan: async ({ commit, state }, { identificationForm, accountId }) => {

        const mediaPlan = state.mediaPlan._id === undefined
          ? await mediaPlansService.create(identificationForm, accountId)
          : await mediaPlansService.update(identificationForm)

          commit("SET_MEDIAPLAN", mediaPlan);
      },
      getMediaPlan: async ({ commit }, { id }) => {
        const mediaPlanResponse = await mediaPlansService.getMediaPlan(id);
        commit("SET_MEDIAPLAN", mediaPlanResponse);
      },
      refreshMediaPlan: async ({ commit, state }) => {
        const mediaPlanResponse = await mediaPlansService.getMediaPlan(state.mediaPlan._id);
        commit("SET_MEDIAPLAN", mediaPlanResponse);
      },
      getLocals: ({commit}, {locals}) => {
        commit("SET_LOCALS", locals);
      }
    },
  };
  