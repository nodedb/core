/**
 * logger
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import bunyan from 'bunyan';
import fs from 'fs-extra';

/* Files */

export default class Logger {

  constructor (logPath) {
    this.logPath = logPath;

    const { dir } = path.parse(this.logPath);

    this.logDir = dir;

    /* Ensure the directory exists */
    fs.mkdirpSync(this.logDir);

    /* Create bunyan instance */
    this.bunyan = bunyan.createLogger({
      name: 'NodeDB',
      streams: [{
        level: 'trace',
        stream: process.stdout,
      }, {
        type: 'rotating-file',
        path: this.logPath,
        level: 'trace',
        period: 'weekly',
      }],
    });
  }

  read () {
    return new Promise((resolve, reject) => {
      fs.readdir(this.logDir, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });
  }

  trigger (level, message, data = {}, ...additional) {
    try {
      this.bunyan[level](message, data, ...additional);
    } catch (err) {
      /* Unknown level, but record all the data */
      this.bunyan.fatal('Unknown log level', {
        err,
        level,
        message,
        data,
      }, ...additional);
    }

    return this;
  }

}
