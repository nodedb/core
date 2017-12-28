/**
 * connections
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';
import uuid from 'uuid';
import Vue from 'vue/dist/vue.min';

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

function prepareState (state) {
  /* Clone and remove the driver instance */
  const newState = _.chain(state)
    .cloneDeep()
    .map(({ connection, id, name }) => ({
      connection,
      name,
      id,
    }))
    .value();

  return JSON.stringify(newState);
}

export default {

  namespaced: true,

  actions: {
    removeById ({ commit, getters }, id) {
      const index = getters.getIndexById(id);

      commit('removeById', id);

      return index;
    },

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
    getById: (state, getters) => id => getters.list
      .find(item => item.id === id),

    getIndexById: (state, getters) => id => getters.list
      .findIndex(item => item.id === id),

    list: (state, getters, states, globalGetters) => state.connections.map((item) => {
      item.driver = globalGetters['drivers/load'](item.name);
      item.driver.setConnection(item.connection);
      return item;
    }),
  },

  mutations: {
    add (state, newConnection) {
      state.connections.push(newConnection);

      const newState = prepareState(state.connections);

      sessionStorage.setItem(stateKey, newState);
    },

    removeById (state, id) {
      const newState = state.connections.filter(item => item.id !== id);

      Vue.set(state, 'connections', newState);

      sessionStorage.setItem(stateKey, prepareState(newState));
    },
  },

  state: {
    connections: Array.isArray(connectionState) ? connectionState : [],
  },

};
