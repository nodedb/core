/**
 * dbSession
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */

const sessionName = 'dbSession';
let stateData = {};

try {
  const tmp = JSON.parse(sessionStorage.getItem(sessionName));

  if (_.isPlainObject(tmp)) {
    stateData = tmp;
  }
} catch (err) {
  /* No valid data */
}

export default {

  getters: {
    getDbSession: state => (connectionId, item = null) => {
      const dbSession = state[connectionId];

      if (item) {
        return _.has(dbSession, item) ? dbSession[item] : null;
      }

      return dbSession;
    },
  },

  mutations: {
    saveDbSession (state, { id, key, value }) {
      if (_.isPlainObject(state[id]) === false) {
        state[id] = {};
      }

      state[id][key] = value;

      const strState = JSON.stringify(state);

      sessionStorage.setItem(sessionName, strState);
    },
  },

  state: stateData,

};
