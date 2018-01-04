/**
 * symlink-drivers
 */

/* Node modules */
const path = require('path');

/* Third-party modules */
const fs = require('fs-extra');

/* Files */
const pkg = require('../package');

const projectPath = path.join(__dirname, '..');
const target = path.join(projectPath, 'node_modules', `@${pkg.productName}`, 'drivers');
const driverPath = path.join(projectPath, '..');

const drivers = fs.readdirSync(driverPath);

fs.mkdirpSync(target);

drivers.forEach((driver) => {
  const fullTargetPath = path.join(target, driver);
  const fullDriverPath = path.join(driverPath, driver);

  const stat = fs.statSync(fullDriverPath);

  if (stat.isDirectory() === false) {
    /* Not a directory */
    return;
  }

  if (fullDriverPath === projectPath) {
    /* It's this project */
    return;
  }

  /* It's a driver - symlink it */
  fs.ensureSymlinkSync(fullDriverPath, fullTargetPath);
});
