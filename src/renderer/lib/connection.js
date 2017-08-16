/**
 * connection
 */

/* Node modules */

/* Third-party modules */
import { v4 as uuid } from 'uuid';

/* Files */
import Base from './base';

export default class Connection extends Base {
  constructor ({ driver, id, params } = {}) {
    super();

    this.driver = driver;
    this.id = id;
    this.params = params;
  }

  static generateId () {
    return uuid();
  }

  static load (driver, id, params) {
    return new Connection({
      driver,
      id,
      params,
    });
  }
}
