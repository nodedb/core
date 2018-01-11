/**
 * serve-dist
 */

/* Node modules */
const fs = require('fs');
const path = require('path');

/* Third-party modules */

/* Files */

const name = 'dist';
const baseDir = path.join(__dirname, '..', 'build');

const dir = fs.readdirSync(baseDir)[0];

const exec = path.join(baseDir, dir, name);

console.log(exec);
