/**
 * driver
 */

/* Node modules */

/* Third-party modules */

/* Files */
import logger from './logger';

export default class Driver {
  constructor (id, strategy) {
    this.id = id;
    this.strategy = strategy;
    this.strategy.logger = logger;

    this.inst = null;
  }

  get displayType () {
    const { displayType } = this.strategy;

    if (!Driver.displayTypes.includes(displayType)) {
      return 'table';
    }

    return displayType;
  }

  get lang () {
    return this.strategy.lang || 'sql';
  }

  get logo () {
    return this.strategy.logo;
  }

  get name () {
    return this.strategy.name;
  }

  /**
   * Connect
   *
   * Connects to the database.
   *
   * @returns {Promise<void>}
   */
  connect () {
    /* Wrap in a promise */
    return Promise.resolve()
      .then(() => this.inst.connect());
  }

  /**
   * Disconnect
   *
   * Terminates a connection
   *
   * @param {*} connection
   * @returns {Promise<void>}
   */
  disconnect (connection) {
    return Promise.resolve()
      .then(() => this.inst.disconnect(connection));
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

  /**
   * Get Table of Contents
   *
   * Gets the table of contents that enables
   * users to traverse their database. This is
   * nested with the queries and only made when
   * they are needed.
   *
   * @returns {Promise<[]>}
   */
  getTableOfContents () {
    return Promise.resolve()
      .then(() => this.inst.getTableOfContents());
    // const toc = this.inst.getTableOfContents();
    //
    // if (!Array.isArray(toc)) {
    //   /* Invalid format */
    //   return Promise.resolve([]);
    // }
    //
    // return toc.reduce((thenable, obj) => {
    //   return thenable
    //     .then(() => {
    //       /* Load up the first items */
    //       return this.query(obj.query, obj.db);
    //     })
    //     .then(result => {
    //       console.log(result);
    //     });
    // }, Promise.resolve());
  }

  /**
   * Query
   *
   * Makes a new query. This handles creating
   * a connection to the DB and destroying the
   * connection after we've finished with it.
   * This does it after an error condition too.
   *
   * The opts can be anything. This is passed
   * through to the strategy which decides what
   * (if anything) to do with it. Typically,
   * these might be some values that will need
   * to be escaped before adding to the query.
   *
   * @param {string} query
   * @param {string} db
   * @param {*} opts
   * @returns {Promise<void>}
   */
  query (query, db, opts = {}) {
    return Promise.resolve()
      /* Get a new connection */
      .then(() => this.connect())
      .then(connection => Promise
        .resolve()
        .then(() => {
          /* Connect to a DB */
          if (!db) {
            return undefined;
          }

          return this.setDb(connection, db);
        })
        /* Make the query */
        .then(() => this.inst.query(connection, query, opts))
        /* Error - terminate the connection */
        .catch(err => this.disconnect(connection)
          /* Reject promise with the error */
          .then(() => Promise.reject(err)))
        /* Success - terminate the connection */
        .then(result => this.disconnect(connection)
          /* Return the DB result */
          .then(() => result)));
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

    /* Inject the query function */
    this.inst.fullQuery = (...args) => this.query(...args);

    return this;
  }

  /**
   * Set DB
   *
   * Sets the connection to use a specific
   * database. This will be lost when we
   * terminate this connection.
   *
   * @param {object} connection
   * @param {strng} db
   * @returns {Promise<void>}
   */
  setDb (connection, db) {
    return Promise.resolve()
      .then(() => this.inst.setDb(connection, db));
  }

  /**
   * Display Types
   *
   * Gets the display types we can support
   *
   * @returns {string[]}
   */
  static get displayTypes () {
    return [
      'document', // eg, MongoDB
      'key-value', // eg, Redis
      'table', // default type eg, MySQL, PostgreSQL
    ];
  }
}
