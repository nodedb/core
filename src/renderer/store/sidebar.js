/**
 * sidebar
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';

/* Files */

let stateData = {};

try {
  const tmp = JSON.parse(sessionStorage.getItem('sidebarWidth'));

  if (_.isPlainObject(tmp)) {
    stateData = tmp;
  }
} catch (err) {
  /* No valid data */
}

export default {

  getters: {
    getSidebarWidth: state => path => state[path],
  },

  mutations: {
    sidebarWidth (state, { path, width }) {
      state[path] = width;

      const strState = JSON.stringify(state);

      sessionStorage.setItem('sidebarWidth', strState);
    },
  },

  state: stateData,

};
