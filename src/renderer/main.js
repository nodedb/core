/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import Vuetify from 'vuetify';

/* Files */
import App from './components/app.vue';
import i18n from './lib/i18n';
import router from './lib/router';
import store from './store';

Vue.use(Vuetify);

setInterval(() => {
  console.log(location.href);
}, 1000);

new Vue({
  components: {
    App,
  },
  i18n,
  router,
  store,
  template: '<App />',
}).$mount('#app');
