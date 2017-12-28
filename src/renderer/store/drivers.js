/**
 * drivers
 */

/* Node modules */
import fs from 'fs';
import path from 'path';

/* Third-party modules */
import { remote } from 'electron';

/* Files */
import Driver from '../lib/driver';

const { logger } = remote.app;

export default {

  namespaced: true,

  actions: {
    /**
     * Load All
     *
     * Loads the list of drivers
     *
     * @returns {Promise<[*]>}
     */
    loadAll () {
      const fileName = this.getters['drivers/fileName'];

      logger.trigger('trace', 'Load all drivers', {
        fileName,
      });

      return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, result) => {
          if (err) {
            if (err.code === 'ENOENT') {
              /* File doesn't exist - empty array */
              logger.trigger('trace', 'File doesn\'t exist', {
                fileName,
              });

              return resolve([]);
            }

            logger.trigger('error', 'Error loading drivers', {
              err,
              fileName,
            });

            return reject(err);
          }

          return resolve(result);
        });
      }).then((result) => {
        let data;

        try {
          data = JSON.parse(result);

          if (!Array.isArray(data)) {
            logger.trigger('debug', 'Driver list is not an array', {
              data,
            });

            data = [];
          }
        } catch (err) {
          /* Unable to cast to array */
          logger.trigger('debug', 'Drivers list is not valid JSON', {
            err,
            data: result,
          });

          data = [];
        }

        return data;
      }).then(data => data.reduce((result, id) => {
        const driver = this.getters['drivers/load'](id);

        if (driver) {
          result.push(driver);
        }

        return result;
      }, []));
    },
  },

  getters: {
    /**
     * File Name
     *
     * Returns the file name for where the drivers
     * are stored.
     */
    fileName (state, getters) {
      const args = [
        getters.pathName,
        'drivers.json',
      ];

      return path.join(...args);
    },

    /**
     * Load
     *
     * Loads a specific driver
     *
     * @param {*} state
     * @param {*} getters
     * @returns {function({string}={object})}
     */
    load (state, getters) {
      return (id) => {
        const args = [
          getters.pathName,
          id,
        ];

        const strategyPath = path.join(...args);

        let driver = null;
        try {
          // eslint-disable-next-line global-require,import/no-dynamic-require
          let strategy = require(strategyPath);

          if (strategy.default) {
            strategy = strategy.default;
          }

          /* Create instance of driver class */
          driver = new Driver(id, strategy);
        } catch (err) {
          logger.trigger('debug', 'Error loading driver', {
            err,
            driver: id,
            strategyPath,
          });
        }

        return driver;
      };
    },

    pathName () {
      const args = [
        remote.app.getPath('userData'),
        remote.app.getName(),
      ];

      return path.join(...args);
    },
  },

  state: new Map(),

};
