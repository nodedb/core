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
import i18n from './i18n';
import Logger from './logger';

/* Set the logger */
const appName = app.getName();
const logger = new Logger(`${app.getPath('userData')}/logs/${appName}.log`);
const i18next = i18n(logger);

/*
 Keep a global reference of the window, so it's
 not closed during garbage collection.
 */
let mainWindow;

function createWindow () {
  const opts = {
    icon: path.join(__dirname, '..', 'assets', 'img', 'logo.png'),
    minHeight: 600,
    minWidth: 800,
    title: appName,
  };

  app.logger.trigger('trace', 'Creating browser window with opts', {
    opts,
  });

  mainWindow = new BrowserWindow(opts);

  const { webContents } = mainWindow;

  if (process.env.ENABLE_LIVE_RELOAD === 'true') {
    enableLiveReload();
  }

  if (process.env.SHOW_DEV_TOOLS === 'true') {
    webContents.openDevTools();
  }

  mainWindow.maximize();

  mainWindow.loadURL(`file://${__dirname}/../index.html`);

  mainWindow
    .on('closed', () => {
      mainWindow = null;
    })
    .on('ready-to-show', () => {
      mainWindow.show();
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
  .on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }

    if (mainWindow.isVisible()) {
      app.logger.trigger('trace', 'Hiding main window');

      mainWindow.hide();
    } else {
      app.logger.trigger('trace', 'Showing main window');

      mainWindow.show();
    }
  })
  .on('window-all-closed', () => {
    /* Don't quit app if last window closed */
  })
  .on('ready', createWindow);

app.logger = logger;
app.i18next = i18next;

module.exports = app;
