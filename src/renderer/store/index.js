/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex';

/* Files */
import connections from './connections';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connections,
  },
  strict: true,
});
