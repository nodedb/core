/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';

/* Files */
import App from './App.vue';
import i18n from './lib/i18n';
import router from './router';

/* eslint-ignore-next-line no-new */
new Vue({
  components: {
    App,
  },
  i18n,
  router,
  template: '<App/>',
}).$mount('#app');
