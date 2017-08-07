/**
 * logger
 */

/* Node modules */
import fs from 'fs-extra';
import path from 'path';

/* Third-party modules */
import bunyan from 'bunyan';

/* Files */

export default (logPath) => {
  const { dir } = path.parse(logPath);

  /* Ensure the directory exists */
  fs.mkdirpSync(dir);

  const logger = bunyan.createLogger({
    name: 'NodeDB',
    streams: [{
      level: 'info',
      stream: process.stdout,
    }, {
      type: 'rotating-file',
      path: logPath,
      level: 'trace',
      period: 'weekly',
    }],
  });

  return (level, message, data = {}, ...additional) => {
    try {
      logger[level](message, data, additional);
    } catch (err) {
      logger.fatal('Unknown log level', {
        level,
        err,
      });
    }
  };
};
