/**
 * index
 */

/* Node modules */
import path from 'path';

/* Third-party modules */
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-sync-fs-backend';
import i18nextLanguageDetector from 'i18next-electron-language-detector';
import Vue from 'vue/dist/vue.min';
import VueI18Next from '@panter/vue-i18next';

/* Files */

Vue.use(VueI18Next);

i18next
  .use(i18nextLanguageDetector)
  .use(i18nextFsBackend)
  .init({
    backend: {
      loadPath: path.join(__dirname, '..', 'locales', '{{lng}}', '{{ns}}.json'),
    },
    debug: false,
    defaultNS: 'common',
    fallbackLng: 'en',
    initImmediate: false,
    ns: [
      'common',
    ],
  });

export default new VueI18Next(i18next);
