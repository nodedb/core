/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex';

/* Files */
import notifications from './notifications';
import repositories from './repositories';
import settings from './settings';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    notifications,
    repositories,
    settings,
  },
  strict: false,
});
