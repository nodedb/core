/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex/dist/vuex';

/* Files */
import connections from './connections';
import drivers from './drivers';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connections,
    drivers,
  },
  strict: false,
});
