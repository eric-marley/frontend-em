import accountService from "../services/account.service";

const getDefaultState = () => {
  return {
    accounts: [],
    account: {}
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    accounts: (state) => {
      return state.accounts;
    },
    account: (state) => {
      return state.account;
    }
  },
  mutations: {
    SET_ACCOUNTS: (state, accounts) => {
      state.accounts = accounts;
    },
    SET_CURRENT_ACCOUNT: (state, account) => {
      state.account = account;
    },
    RESET: (state) => {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    fetchAll: async ({ commit }) => {
      const accountsResponse = await accountService.fetchAll();
      const accountsSelected = accountsResponse.map(account => {
        account.view = true
        return account
      })
      commit("SET_ACCOUNTS", accountsSelected);
    },
    setCurrentAccount: ({ commit }, { account }) => {
      commit("SET_CURRENT_ACCOUNT", account);
    }
  },
};
