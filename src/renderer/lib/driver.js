/**
 * driver
 */

/* Node modules */
import fs from 'fs';
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';
import { validators } from 'vue-form-generator';
import { v4 as uuid } from 'uuid';

/* Files */
import Base from './base';

const i18n = remote.app.$i18n;

export default class Driver extends Base {
  constructor (strategy, module) {
    super();

    /* This may or may not be the same the id */
    this.connectionId = null;
    this.module = module;
    this.strategy = strategy;

    /* Set the logger to the strategy */
    this.strategy.logger = (level, message, data = {}, ...additional) => {
      /* Ensure there's enough identifying info in the log */
      data.info = {
        connectionId: this.connectionId,
        module: this.module,
        name: this.name,
      };

      return Driver.logger(level, message, data, ...additional);
    };
  }

  get active () {
    return this.isActive || false;
  }

  set active (isActive) {
    this.isActive = isActive === true;
  }

  get connectionName () {
    return this.params.name;
  }

  get iconPath () {
    return this.strategy.iconPath;
  }

  get id () {
    return this.strategy.id;
  }

  get lang () {
    return this.strategy.lang;
  }

  get name () {
    return this.strategy.name;
  }

  get params () {
    return this.dbParams || {};
  }

  set params (params) {
    if (_.isPlainObject(params)) {
      this.dbParams = params;
      this.strategy.params = params;
    }
  }

  /**
   * Connect
   *
   * Attempts to connect to a database
   *
   * @returns {Promise.<T>}
   */
  connect () {
    Driver.logger('info', 'Attempting to connect to database', {
      id: this.id,
      params: this.params,
    });

    return Promise.resolve()
      .then(() => this.strategy.connect())
      .then((connection) => {
        Driver.logger('info', 'Successfully connected to database', {
          id: this.id,
        });

        return connection;
      })
      .catch((err) => {
        Driver.logger('warn', 'Failed to connect to database', {
          id: this.id,
          err,
        });

        throw err;
      });
  }

  /**
   * Connect Form
   *
   * Retrieves the connect form for the driver
   *
   * @returns {*}
   */
  connectForm () {
    return this.strategy.connectForm({
      validators,
      i18n,
    });
  }

  /**
   * Connection String
   *
   * Returns the connection detail in string form. This
   * will usually be in the form of 'username@host'
   *
   * @returns {*}
   */
  connectionString () {
    return this.strategy.connectionString();
  }

  dbList () {
    return Promise.resolve()
      .then(() => this.strategy.dbList());
  }

  query (db, str) {
    return Promise.resolve()
      .then(() => this.strategy.query(db, str));
  }

  /**
   * Table of Contents
   *
   * Gets the table of contents of the database. This
   * will typically be a list of databases, tables etc.
   *
   * @returns {Promise.<TResult>}
   */
  tableOfContents () {
    return Promise.resolve()
      .then(() => this.strategy.tableOfContents());
  }

  /**
   * Driver Path
   *
   * The location of where we store the drivers
   * on the user's machine.
   *
   * @returns {string}
   */
  static get driverPath () {
    return path.join(remote.app.getPath('userData'), 'drivers');
  }

  /**
   * Generate ID
   *
   * Generates a new ID. This is just a UUID.v4
   *
   * @returns {string}
   */
  static generateId () {
    return uuid();
  }

  /**
   * Get Driver List
   *
   * Gets all the drivers loaded to the
   * machine
   *
   * @returns {Promise.<TResult>}
   */
  static getDriverList () {
    return new Promise((resolve, reject) => {
      /* First, get the folders */
      fs.readdir(Driver.driverPath, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    }).then(drivers => drivers.reduce((result, moduleName) => {
      const module = Driver.loadModule(moduleName);

      module.forEach((driver) => {
        result.push({
          driver,
          name: driver.name,
          id: driver.id,
        });
      });

      return result;
    }, [])).then(driverList => driverList.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }

      return 0;
    })).catch((err) => {
      Driver.logger('error', 'Error loading driver list', {
        err,
      });

      throw err;
    });
  }

  static loadConnection (driverName, moduleName, connectionId, params, isActive) {
    const driver = Driver.loadDriver(driverName, moduleName);

    if (!driver) {
      return null;
    }

    /* Set driver state */
    driver.active = isActive;
    driver.connectionId = connectionId;
    driver.params = params;

    return driver;
  }

  static loadDriver (moduleName, driverName) {
    const drivers = Driver.loadModule(moduleName);

    return drivers.find(({ id }) => id === driverName);
  }

  /**
   * Load Module
   *
   * Loads up all the drivers in a module
   *
   * @param {string} moduleName
   * @returns {*[]}
   */
  static loadModule (moduleName) {
    const modulePath = path.join(Driver.driverPath, moduleName);

    // eslint-disable-next-line global-require, import/no-dynamic-require
    let module = require(modulePath);

    module = module.default || module;

    /* Check if multi-driver module */
    if (module.drivers) {
      return module.drivers.map(({ id }) => new Driver(module.load(id), moduleName));
    }

    /* Just one driver in module */
    return [
      new Driver(module.load(), moduleName),
    ];
  }
}
