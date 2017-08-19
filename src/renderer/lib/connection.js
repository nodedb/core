/**
 * connection
 */

/* Node modules */

/* Third-party modules */
import { _ } from 'lodash';
import { v4 as uuid } from 'uuid';

/* Files */
import Base from './base';

export default class Connection extends Base {
  constructor ({ driver, id, params, active } = {}) {
    super();

    this.driver = driver;
    this.id = id;
    this.params = params;
    this.active = active;
  }

  get active () {
    return this.isActive || false;
  }

  set active (active) {
    if (_.isBoolean(active)) {
      this.isActive = active;
    }
  }

  get name () {
    return 'connectionName';
  }

  static generateId () {
    return uuid();
  }

  static load (driver, id, params, active) {
    return new Connection({
      driver,
      id,
      params,
      active,
    });
  }
}
