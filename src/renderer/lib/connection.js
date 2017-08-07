/**
 * connection
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default class Connection {

  constructor (driver, type = undefined) {
    this.Driver = driver;
    this.type = type;
  }

  connect (connection) {
    this.inst = new this.Driver(connection, this.type);
  }

}
