/**
 * connections
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */
import Connection from '../lib/connection';
import Driver from '../lib/driver';

let connections = [];

try {
  const tmp = JSON.parse(sessionStorage.getItem('connections'));

  if (_.isArray(tmp)) {
    connections = tmp;
  }
} catch (err) {
  /* No valid connections */
}

export default {

  actions: {
    removeConnection ({ commit }, { id }) {
      commit('removeConnection', id);

      return id;
    },

    getConnection ({ state }, opts) {
      try {
        const {
          connectionId,
          driverName,
          moduleName,
          params,
        } = state.find(data => data.connectionId === opts.connectionId);

        /* Get the driver */
        return Driver.loadConnection(driverName, moduleName, connectionId, params);
      } catch (err) {
        /* No connection found */
        return null;
      }
    },

    getConnections: ({ state }, activeId) => state.map((connection) => {
      const {
        connectionId,
        driverName,
        moduleName,
        params,
      } = connection;

      const isActive = activeId === connectionId;

      return Driver.loadConnection(driverName, moduleName, connectionId, params, isActive);
    }),

    saveConnection ({ commit }, { id, moduleName, params }) {
      /* Generate a connection ID */
      const connectionId = Connection.generateId();

      const connection = {
        connectionId,
        driverName: id,
        moduleName,
        params,
      };

      commit('addConnection', connection);

      return connectionId;
    },
  },

  mutations: {
    addConnection (state, connection) {
      state.push(connection);

      const strState = JSON.stringify(state);

      sessionStorage.setItem('connections', strState);
    },

    removeConnection (state, id) {
      _.remove(state, con => con.connectionId === id);

      const strState = JSON.stringify(state);

      sessionStorage.setItem('connections', strState);
    },
  },

  state: connections,

};
