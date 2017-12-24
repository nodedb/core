/**
 * settings
 */

/* Node modules */

/* Third-party modules */
import { remote } from 'electron';
import Vue from 'vue/dist/vue.min';

/* Files */

const logger = remote.app.logger;

const storageKey = 'ci-menu-settings';

/* Never below this */
const minTimeout = 5000;

let stateData = {
  updateInterval: 0,
};

try {
  stateData = JSON.parse(localStorage[storageKey]);
} catch (err) {
  /* Use default */
}

if (stateData.updateInterval < minTimeout) {
  stateData.updateInterval = minTimeout;
}

stateData.minTimeout = minTimeout;

export default {

  actions: {

    saveSettings ({ commit }, { updateInterval }) {
      const data = {
        updateInterval,
      };

      logger.trigger('debug', 'Saving settings', {
        data,
        storageKey,
      });

      /* Save to local storage */
      localStorage[storageKey] = JSON.stringify(data);

      /* Update the state */
      commit('updateSettings', data);

      return data;
    },

  },

  getters: {

    minTimeout: state => state.settings.minTimeout,

    updateInterval: state => state.settings.updateInterval,

  },

  mutations: {

    updateSettings (state, data) {
      logger.trigger('trace', 'Updating settings state', data);

      data.minTimeout = minTimeout;

      Vue.set(state, 'settings', data);
    },

  },

  state: {
    settings: stateData,
  },

};
