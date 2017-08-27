/**
 * driver
 */

/* Node modules */
import fs from 'fs';
import path from 'path';

/* Third-party modules */
import { remote } from 'electron';
import { validators } from 'vue-form-generator';

/* Files */
import Base from './base';
import Connection from './connection';

const i18n = remote.app.$i18n;

export default class Driver extends Base {
  constructor (strategy, module) {
    super();

    /* This may or may not be the same the id */
    this.module = module;
    this.strategy = strategy;
  }

  get iconPath () {
    return this.strategy.iconPath;
  }

  get id () {
    return this.strategy.id;
  }

  get name () {
    return this.strategy.name;
  }

  /**
   * Connect
   *
   * Attempts to connect to a database
   *
   * @param {object} params
   * @returns {Promise.<T>}
   */
  connect (params) {
    Driver.logger('info', 'Attempting to connect to database', {
      id: this.strategy.id,
      params,
    });

    return this.strategy.connect(params)
      .then((connection) => {
        Driver.logger('info', 'Successfully connected to database', {
          id: this.strategy.id,
        });

        return connection;
      })
      .catch((err) => {
        Driver.logger('warn', 'Failed to connect to database', {
          id: this.strategy.id,
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

    return Connection.load(driver, connectionId, params, isActive);
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
