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
  constructor ({ active, db, driver, id, params } = {}) {
    super();

    this.active = active;
    this.db = db;
    this.driver = driver;
    this.id = id;
    this.params = params;
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
    return this.params.name;
  }

  get db () {
    return this.activeDb;
  }

  set db (db) {
    this.activeDb = db || null;
  }

  // query () {
  //
  // }

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
