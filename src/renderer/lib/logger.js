/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import { remote } from 'electron';

/* Files */

const { logger } = remote.app;

function factory (level, data) {
  let fn = 'log';
  if (level === 'error') {
    fn = 'error';
  }

  // eslint-disable-next-line no-console
  console[fn](data);
}

export default (level, message, data = {}, ...additional) => {
  /* Log to the console - makes debugging easier */
  factory(level, {
    message,
    data,
    additional,
  });

  /* Record the log as normal */
  return logger.trigger(level, message, data, ...additional);
};
