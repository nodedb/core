/**
 * connections
 */

/* Node modules */

/* Third-party modules */
import { remote } from 'electron';
import uuid from 'uuid';

/* Files */

const { logger } = remote.app;

const stateKey = 'connections';

let connectionState = sessionStorage.getItem(stateKey);
try {
  connectionState = JSON.parse(connectionState);
} catch (err) {
  logger.trigger('error', 'Connection data in unknown state', {
    err,
  });
}

export default {

  namespaced: true,

  actions: {
    save ({ commit }, { connection, driver }) {
      const id = uuid.v4();

      commit('add', {
        connection,
        driver,
        id,
      });

      return id;
    },
  },

  getters: {
    state: state => state,
  },

  mutations: {
    add (state, newConnection) {
      state.push(newConnection);

      sessionStorage.setItem(stateKey, JSON.stringify(state));
    },
  },

  state: Array.isArray(connectionState) ? connectionState : [],

};
