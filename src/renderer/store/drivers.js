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
import logger from '../lib/logger';

const appName = remote.app.getName();

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

      logger('trace', 'Load all drivers', {
        fileName,
      });

      return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', (err, result) => {
          if (err) {
            if (err.code === 'ENOENT') {
              /* File doesn't exist - empty array */
              logger('trace', 'File doesn\'t exist', {
                fileName,
              });

              return resolve([]);
            }

            logger('error', 'Error loading drivers', {
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
            logger('debug', 'Driver list is not an array', {
              data,
            });

            data = [];
          }
        } catch (err) {
          /* Unable to cast to array */
          logger('debug', 'Drivers list is not valid JSON', {
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
     * The
     *
     * @param state
     * @returns {function(*=)}
     */
    load (state) {
      return (id) => {
        const moduleName = `@${appName}/drivers/${id}`;

        logger('trace', 'Loading driver strategy', {
          module: moduleName,
        });

        let driver = null;

        if (state.has(moduleName)) {
          logger('trace', 'Using cached version of module', {
            module: moduleName,
          });

          driver = state.get(moduleName);
        } else {
          logger('trace', 'Loading module', {
            module: moduleName,
          });

          try {
            // eslint-disable-next-line global-require,import/no-dynamic-require
            let strategy = require(moduleName);

            if (strategy.default) {
              strategy = strategy.default;
            }

            state.set(moduleName, strategy);

            /* Create instance of driver class */
            driver = new Driver(id, strategy);

            logger('trace', 'Module loaded successfully', {
              module: moduleName,
            });
          } catch (err) {
            logger('debug', 'Error loading driver', {
              err,
              driver: id,
              module: moduleName,
            });
          }
        }

        return driver;
      };
    },

    pathName () {
      const args = [
        remote.app.getPath('userData'),
        appName,
      ];

      return path.join(...args);
    },
  },

  state: new Map(),

};
