/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueFormGenerator from 'vue-form-generator';

/* Files */
import App from './app.vue';
import fieldButton from './components/fieldButton.vue';
import i18n from './lib/i18n';
import router from './lib/router';

Vue.component('fieldButton', fieldButton);
Vue.use(VueFormGenerator);

/* eslint-ignore-next-line no-new */
new Vue({
  components: {
    App,
  },
  i18n,
  router,
  template: '<App/>',
}).$mount('#app');
