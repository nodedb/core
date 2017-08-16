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

    getConnection ({ state }, opts) {
      try {
        const {
          connectionId,
          driverName,
          moduleName,
          params,
        } = state.find(data => data.connectionId === opts.connectionId);

        /* Get the driver */
        const driver = Driver.loadDriver(driverName, moduleName);

        if (!driver) {
          return null;
        }

        return Connection.load(driver, connectionId, params);
      } catch (err) {
        return Promise.reject(err);
      }
    },

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
  },

  state: connections,

};
