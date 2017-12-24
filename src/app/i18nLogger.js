/**
 * i18nLogger
 */

/* Node modules */

/* Third-party modules */

/* Files */

export default (bunyan) => {
  const logger = level => args => bunyan[level](...args);

  return {
    type: 'logger',
    log: logger('info'),
    warn: logger('warn'),
    error: logger('error'),
  };
};
