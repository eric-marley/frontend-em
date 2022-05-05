const getDefaultState = () => {
  return {
    token: "",
    user: {},
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    isLoggedIn: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    RESET: (state) => {
      localStorage.removeItem('token');
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    login: ({ commit }, { token, user }) => {
      commit("SET_TOKEN", token);
      commit("SET_USER", user);

      localStorage.setItem('token', token);
    },
    logout: ({ commit }) => {
      commit("RESET", "");
    },
  },
};
