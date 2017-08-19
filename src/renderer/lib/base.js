/**
 * base
 */

/* Node modules */
import { EventEmitter } from 'events';

/* Third-party modules */
import { remote } from 'electron';

/* Files */

export default class Base extends EventEmitter {
  /**
   * Logger
   *
   * Returns the logger instance
   *
   * @returns {*}
   */
  static logger (...args) {
    return remote.app.logger.trigger(...args);
  }

  static get i18n () {
    return remote.app.$i18n;
  }
}
