/**
 * connections
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { v4 as uuid } from 'uuid';

/* Files */

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
    saveConnection ({ commit }, connection) {
      /* Generate a random ID */
      const connectionId = uuid();

      connection.connectionId = connectionId;

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
