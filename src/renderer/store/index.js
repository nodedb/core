/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex';

/* Files */
import activeDb from './activeDb';
import connections from './connections';
import sidebar from './sidebar';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    activeDb,
    connections,
    sidebar,
  },
  strict: true,
});
