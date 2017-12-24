/**
 * i18n
 */

/* Node modules */

/* Third-party modules */
import { remote } from 'electron';
import Vue from 'vue/dist/vue.min';
import VueI18Next from '@panter/vue-i18next';

/* Files */

Vue.use(VueI18Next);

export default new VueI18Next(remote.app.i18next);
