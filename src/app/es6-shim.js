/**
 * es6-shim
 *
 * This is used to serve the application
 * when used for development
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const compile = require('electron-compile');

/* Files */

const appRoot = path.join(__dirname, '..', '..');

module.exports = compile.init(appRoot, require.resolve('./main'));
