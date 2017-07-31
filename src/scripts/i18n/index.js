/**
 * index
 */

/* Node modules */

/* Third-party modules */
import i18next from 'i18next';
import i18nextFsBackend from 'i18next-sync-fs-backend';
import Vue from 'vue/dist/vue.min';
import VueI18Next from '@panter/vue-i18next';

/* Files */

Vue.use(VueI18Next);

i18next
  .use(i18nextFsBackend)
  .init({
    backend: {
      loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.json`,
    },
    debug: true,
    defaultNS: 'common',
    fallbackLng: 'en',
    initImmediate: false,
    ns: [
      'common',
    ],
  });

export default new VueI18Next(i18next);
