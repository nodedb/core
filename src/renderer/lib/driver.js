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

  /**
   * Connect
   *
   * Connects to the database. Will automatically
   * disconnect afterwards.
   *
   * @param {boolean} disconnect
   * @returns {Promise<void>}
   */
  connect (disconnect = true) {
    /* Wrap in a promise */
    return Promise.resolve()
      .then(() => this.inst.connect())
      .then((connection) => {
        if (disconnect) {
          return this.inst.disconnect(connection);
        }

        return undefined;
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

  query (query) {
    return Promise.resolve()
      .then(() => this.inst.query(query));
  }

  /**
   * Set Connection
   *
   * Creates a new instance of the strategy with
   * the connection data set to it. This allows
   * us to interact with the database
   *
   * @param {*} connectionData
   * @returns {Driver}
   */
  setConnection (connectionData) {
    const Strategy = this.strategy;

    this.inst = new Strategy(connectionData);

    return this;
  }
}
