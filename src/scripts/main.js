/**
 * main
 */

/* Node modules */

/* Third-party modules */
import electron from 'electron';
import Vue from 'vue/dist/vue.min';

/* Files */
import App from './App.vue';
import router from './router';

/* eslint-ignore-next-line no-new */
new Vue({
  components: {
    App,
  },
  router,
  template: '<App/>',
}).$mount('#app');
