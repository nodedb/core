/**
 * activeDb
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */

let stateData = {};

try {
  const tmp = JSON.parse(sessionStorage.getItem('activeDb'));

  if (_.isPlainObject(tmp)) {
    stateData = tmp;
  }
} catch (err) {
  /* No valid data */
}

export default {

  getters: {
    getActiveDb: state => path => state[path],
  },

  mutations: {
    activeDb (state, { path, db }) {
      state[path] = db;

      const strState = JSON.stringify(state);

      sessionStorage.setItem('activeDb', strState);
    },
  },

  state: stateData,

};
