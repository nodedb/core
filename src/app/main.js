/**
 * Main
 *
 * This controls the window process and the
 * instantiation of the application.
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { app, BrowserWindow, shell } from 'electron';
import { enableLiveReload } from 'electron-compile';

/* Files */
import logger from './logger';
import pkg from '../../package.json';

/*
 Keep a global reference of the window, so it's
 not closed during garbage collection.
 */
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '..', 'assets', 'img', 'logo.png'),
    minHeight: 600,
    minWidth: 993, // Prevents us having to faff about with the mobile view
    title: pkg.productName,
  });

  const { webContents } = mainWindow;

  if (process.env.ENABLE_LIVE_RELOAD === 'true') {
    enableLiveReload();
  }

  if (process.env.SHOW_DEV_TOOLS === 'true') {
    webContents.openDevTools();
  }

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const handleRedirect = (event, url) => {
    if (url !== webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  };

  webContents
    .on('new-window', handleRedirect)
    .on('will-navigate', handleRedirect);
}

app
  .on('activate', () => (mainWindow === null ? createWindow() : ''))
  .on('ready', createWindow)
  .on('window-all-closed', () => app.quit());

/* Set the logger */
app.log = logger(`${app.getPath('userData')}/logs/nodedb.log`);

module.exports = app;
