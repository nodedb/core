/**
 * i18n
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import { remote } from 'electron';
import { sync as glob } from 'glob';
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-sync-fs-backend';
import i18nextLanguageDetector from 'i18next-electron-language-detector';
import Vue from 'vue/dist/vue.min';
import VueI18Next from '@panter/vue-i18next';

/* Files */
import i18nLogger from './i18nLogger';

Vue.use(VueI18Next);

const rootPath = path.join(__dirname, '..', 'locales');

/* Treat the en directory as "master" */
const ns = glob(`${rootPath}/en/*.json`)
  .map(filepath => filepath
    .replace(`${rootPath}/en/`, '')
    .replace(/\.json$/, ''));

i18next
  .use(i18nLogger(remote.app.logger.bunyan))
  .use(i18nextLanguageDetector)
  .use(i18nextFsBackend)
  .init({
    backend: {
      loadPath: path.join(rootPath, '{{lng}}', '{{ns}}.json'),
      addPath: path.join(rootPath, '{{lng}}', '{{ns}}.missing.json'),
    },
    debug: true,
    defaultNS: 'common',
    fallbackLng: 'en',
    initImmediate: false,
    ns,
  });

/* Set the i18next instance to the app */
remote.app.$i18n = i18next;

export default new VueI18Next(i18next);
