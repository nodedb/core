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
    this.inst = null;
  }

  connect (connectionData) {
    /* Wrap in a promise */
    return Promise.resolve()
      .then(() => {
        const Strategy = this.strategy;

        this.inst = new Strategy(connectionData);

        return this.inst.connect();
      });
  }

  /**
   * Get Login Form
   *
   * Gets the login form from the strategy
   *
   * @returns {[]}
   */
  getLoginForm () {
    const form = this.strategy.connection;

    if (Array.isArray(form)) {
      return form;
    }

    return [];
  }
}
