/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuex from 'vuex';

/* Files */
import connections from './connections';
import dbSession from './dbSession';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    connections,
    dbSession,
  },
  strict: true,
});
