/**
 * connections
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
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
    save ({ commit }, { connection, name }) {
      const id = uuid.v4();

      commit('add', {
        connection,
        name,
        id,
      });

      return id;
    },
  },

  getters: {
    list: (connections, getters, states, globalGetters) => connections.map((item) => {
      item.driver = globalGetters['drivers/load'](item.name);
      item.driver.setConnection(item.connection);
      return item;
    }),
  },

  mutations: {
    add (state, newConnection) {
      state.push(newConnection);

      /* Clone and remove the driver instance */
      const newState = _.chain(state)
        .cloneDeep()
        .map(({ connection, id, name }) => ({
          connection,
          name,
          id,
        }))
        .value();

      sessionStorage.setItem(stateKey, JSON.stringify(newState));
    },
  },

  state: Array.isArray(connectionState) ? connectionState : [],

};
