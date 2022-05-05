const getDefaultState = () => {
    return {
        isLoading: true,
        medias: [],
        selectedMedias: [],
        startDate: "",
        selectedPeriod: null
    }
};

export default {
    namespaced: true,
    state: getDefaultState(),
    getters: {
        isLoading: (state) => state.isLoading,
        medias: (state) => state.medias,
        selectedMedias: (state) => state.selectedMedias,
        selectedPeriod: (state) => state.selectedPeriod,
        startDate: (state) => state.startDate
    },
    mutations: {
        SET_LOADING: (state, loading) => state.isLoading = loading,
        SET_MEDIAS: (state, medias) => {
            state.medias = medias;
        },
        SET_SELECTED_MEDIAS: (state, medias) => {
            state.selectedMedias = medias;
        },
        SET_STARTDATE: (state, startDate) => {
            state.startDate = startDate;
        },
        SET_SELECTED_PERIOD: (state, selectedPeriod) => {
            state.selectedPeriod = selectedPeriod;
        },
        RESET: (state) => {
            Object.assign(state, getDefaultState());
        },
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        setMedias: ({ commit }, { medias }) => {
            commit("SET_LOADING", true);
            commit("SET_MEDIAS", medias);
        },
        setSelectedMedias: ({ commit }, { medias }) => {
            commit("SET_SELECTED_MEDIAS", medias);
        },
        setSelectedPeriod: ({ commit }, { period }) => {
            commit("SET_SELECTED_PERIOD", period);
        },
        setStartDate: ({ commit }, { date }) => {
            commit("SET_STARTDATE", date);
        },
    },
};