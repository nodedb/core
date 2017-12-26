/**
 * driver
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default class Driver {
  constructor (id, strategy) {
    this.id = id;
    this.strategy = strategy;

    this.logo = this.strategy.logo;
    this.name = this.strategy.name;
  }
}
