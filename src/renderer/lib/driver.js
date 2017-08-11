/**
 * driver
 */

/* Node modules */
import fs from 'fs';
import path from 'path';

/* Third-party modules */
import { remote } from 'electron';

/* Files */
import Base from './base';

export default class Driver extends Base {
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

      module.forEach((mod) => {
        result.push({
          name: mod.name,
          type: mod.type,
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
      return module.drivers.map(({ type }) => module.load(type));
    }

    /* Just one driver in module */
    return [
      module.load(),
    ];
  }
}
