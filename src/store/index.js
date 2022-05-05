import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

import auth from './auth.store';
import account from './account.store';
import media_plans from './mediaPlans.store';
import targets from './targets.store';
import steps from './steps.store';
import budget from './budget.store';
import medias from './medias.store';
import resume from './resume.store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    account,
    media_plans,
    targets,
    steps,
    budget,
    medias,
    resume,
  },
  plugins: [new VuexPersist({ storage: window.localStorage }).plugin]
});
