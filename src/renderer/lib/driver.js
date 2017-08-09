/**
 * driver
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import fs from 'fs-extra';
import { remote } from 'electron';
import { validators } from 'vue-form-generator';

/* Files */
import Base from './base';

export default class Driver extends Base {

  constructor ({ driver, moduleName, modulePath }) {
    super();

    this.driver = driver;
    this.name = moduleName;
    this.path = modulePath;
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
   * LoadAll
   *
   * Loads up the drivers array
   *
   * @returns {Promise.<Driver[]>}
   */
  static loadAll () {
    return new Promise((resolve, reject) => {
      fs.readdir(Driver.driverPath, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    }).then(drivers => drivers
      .reduce((result, moduleName) => {
        Driver.loadModule(moduleName)
          .forEach((driver) => {
            result.push(driver);
          });

        return result;
      }, [])
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }

        return 0;
      }));
  }

  static loadModule (moduleName) {
    const modulePath = path.join(Driver.driverPath, moduleName);

    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      let module = require(modulePath);

      if (module.default) {
        /* The driver is on exports.default not module.exports */
        module = module.default;
      }

      return module.load({
        i18next: remote.app.$i18n,
        validators,
      });
    } catch (err) {
      Driver.logger('error', 'Failed to load driver module', {
        err,
        modulePath,
      });
    }

    return [];
  }

}
