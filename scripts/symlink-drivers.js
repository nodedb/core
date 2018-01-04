/**
 * symlink-drivers
 */

/* Node modules */
const os = require('os');
const path = require('path');

/* Third-party modules */
const fs = require('fs-extra');

/* Files */
const pkg = require('../package');

const configFiles = [
  'Electron',
  pkg.productName,
];
const projectPath = path.join(__dirname, '..');
const target = path.join(projectPath, 'node_modules', `@${pkg.productName}`, 'drivers');
const driverPath = path.join(projectPath, '..');
const homeDir = os.homedir();

const drivers = fs.readdirSync(driverPath);

try {
  fs.mkdirpSync(target);

  const driversLinked = [];

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

    driversLinked.push(driver);
  });

  const configData = JSON.stringify(driversLinked, null, 2);

  configFiles.forEach((configFile) => {
    const configDir = path.join(homeDir, '.config', configFile, pkg.productName);
    fs.mkdirpSync(configDir);

    const fileName = path.join(configDir, 'drivers.json');

    fs.writeFileSync(fileName, `${configData}\n`);
  });

  console.log(`Linked ${driversLinked.length} driver(s)`);
  console.log(driversLinked);
} catch (err) {
  console.error('Failed to symlink drivers');
  console.error(err.stack);
  process.exit(1);
}
