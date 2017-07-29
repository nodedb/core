/**
 * es6-shim
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const electronCompile = require('electron-compile');

/* Files */
const pkg = require('./package.json');

const initScript = path.resolve(__dirname, pkg.originalMain);
electronCompile.init(__dirname, initScript);
