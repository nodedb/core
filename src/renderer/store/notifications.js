/**
 * notifications
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';
import moment from 'moment';
import Vue from 'vue/dist/vue.min';

/* Files */

const logger = remote.app.logger;

const storageKey = 'ci-menu-notifications';

let stateData = {};

try {
  stateData = JSON.parse(localStorage[storageKey]);
} catch (err) {
  /* Use default */
}

/**
 * Get Date
 *
 * Gets the date for the given time,
 * adding a number of days to it relative
 * to today
 *
 * @param {string} time
 * @param {number} day
 * @returns {Date}
 */
function getDate (time, day = 0) {
  const [hours, mins] = time.split(':');

  return moment()
    .hour(hours)
    .minute(mins)
    .seconds(0)
    .milliseconds(0)
    .add(day, 'days')
    .toDate();
}

export default {

  actions: {

    notify ({ getters, state }, { i18n, newState, oldState }) {
      /* Default to always notify */
      let toNotify = true;

      const buildLabel = newState.lastBuildLabel;
      const newStatus = newState.lastBuildStatus;
      const oldStatus = oldState.lastBuildStatus;
      const build = buildLabel ? `#${buildLabel}` : '';

      switch (state.notify) {
        case 'all':
          toNotify = true;
          break;

        case 'change':
          toNotify = newStatus !== oldStatus;
          break;

        case 'fail':
          toNotify = newStatus !== 'success';
          break;

        default:
          /* Never notify */
          toNotify = false;
          break;
      }

      const msg = i18n.t(`notifications:${newStatus.toUpperCase()}`, {
        build,
        name: newState.name,
      });

      if (toNotify && !getters.doNotDisturb()) {
        logger.trigger('debug', 'Notifying of build', {
          newState,
          oldState,
        });

        return new Notification(msg, {
          tag: build,
        });
      }

      logger.trigger('debug', 'Not notifying of build', {
        newState,
        oldState,
      });

      return false;
    },

    saveNotification ({ commit }, { dnd, dndEnd, dndStart, notify }) {
      const data = {
        dnd,
        dndEnd,
        dndStart,
        notify,
      };

      logger.trigger('debug', 'Saving notification settings', {
        data,
        storageKey,
      });

      /* Save to local storage */
      localStorage[storageKey] = JSON.stringify(data);

      /* Update the state */
      commit('updateNotification', data);

      return data;
    },

  },

  getters: {

    /**
     * Do Not Disturb
     *
     * Are we in a do not disturb
     * period?
     *
     * @param {*} state
     * @returns {boolean}
     */
    doNotDisturb: state => () => {
      if (state.dnd) {
        const dates = [];

        const startDate = getDate(state.dndStart);
        const endDate = getDate(state.dndEnd);
        const now = Date.now();

        /* Check if DND period goes overnight */
        if (endDate.getTime() < startDate.getTime()) {
          /* Add in start time for yesterday and end time for today */
          dates.push({
            startDate: getDate(state.dndStart, -1),
            endDate: getDate(state.dndEnd),
          });

          /* Add in start time for today and end time for tomorrow */
          dates.push({
            startDate: getDate(state.dndStart, 0),
            endDate: getDate(state.dndEnd, 1),
          });
        } else {
          /* It's all on one day */
          dates.push({
            startDate,
            endDate,
          });
        }

        logger.trigger('debug', 'Do no disturb periods', {
          dates,
          dndStart: state.dndStart,
          dndEnd: state.dndEnd,
          now,
        });

        /* Check that we're not inside a DND period */
        const match = dates
          .find(period => (period.startDate <= now && now <= period.endDate));

        const doNotDisturb = !!match;

        if (doNotDisturb) {
          logger.trigger('debug', 'Notification suppressed due to do not disturb', {
            match,
          });
        }

        return doNotDisturb;
      }

      logger.trigger('trace', 'No do not disturb period configured');

      /* Nope */
      return false;
    },

    notify: state => ({
      dnd: state.dnd,
      dndEnd: state.dndEnd,
      dndStart: state.dndStart,
      notify: state.notify,
    }),

    notifyOpts: () => [
      'all', // Notify whenever a build has finished
      'change', // Notify when a change is detected
      'fail', // Notify when new status is not 'Success'
      'never',
    ],

  },

  mutations: {

    updateNotification (state, data) {
      logger.trigger('trace', 'Updating notifications state', data);

      Vue.set(state, 'dnd', data.dnd);
      Vue.set(state, 'dndEnd', data.dndEnd);
      Vue.set(state, 'dndStart', data.dndStart);
      Vue.set(state, 'notify', data.notify);
    },

  },

  state: _.defaults(stateData, {
    dnd: true,
    dndEnd: '08:00',
    dndStart: '22:00',
    notify: 'change',
  }),

};
