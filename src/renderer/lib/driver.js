/**
 * driver
 */

/* Node modules */
import fs from 'fs-extra';
import path from 'path';

/* Third-party modules */
import { _ } from 'lodash';
import { remote } from 'electron';

/* Files */
import Connection from './connection';

const logger = remote.app.logger;

export default class Driver {

  constructor () {
    this.drivers = [];
  }

  /**
   * Load Driver
   *
   * Takes the driver path and loads the driver into
   * this object
   *
   * @param {string} driverPath
   * @returns {Driver}
   */
  loadDriver (driverPath) {
    logger.trigger('info', 'Attempting to load driver', {
      driverPath,
    });

    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      let driver = require(driverPath);

      driver = driver.default || driver;

      if (_.isArray(driver.drivers) && driver.drivers.length > 0) {
        /* Multiple database drivers being loaded */
        driver.drivers.forEach((item) => {
          this.drivers.push({
            name: item.name,
            driver: new Connection(driver, item.type),
          });

          logger.trigger('info', 'Loaded driver', {
            driverPath,
            name: item.name,
          });
        });
      } else {
        /* Single database driver being loaded */
        this.drivers.push({
          name: driver.name,
          driver: new Connection(driver),
        });

        logger.trigger('info', 'Loaded driver', {
          driverPath,
          name: driver.name,
        });
      }
    } catch (err) {
      logger.trigger('error', 'Failed to load driver', {
        driverPath,
        err,
      });
    }

    return this;
  }

  sort () {
    this.drivers.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0;
    });

    return this;
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
   * Load
   *
   * Factory method that creates an object
   * with all our drivers loaded to it
   *
   * @returns {Driver}
   */
  static load () {
    const driver = new Driver();

    const drivers = fs.readdirSync(Driver.driverPath);

    drivers.forEach((driverName) => {
      driver.loadDriver(path.join(Driver.driverPath, driverName));
    });

    return driver;
  }

}
