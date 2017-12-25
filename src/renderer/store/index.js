/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex';

/* Files */
import drivers from './drivers';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    drivers,
  },
  strict: false,
});
