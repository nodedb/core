/**
 * main
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueFormGenerator from 'vue-form-generator';

/* Files */
import App from './components/app.vue';
import i18n from './lib/i18n';
import layoutLeftSidebar from './layouts/left-sidebar.vue';
import layoutNoSidebar from './layouts/no-sidebar.vue';
import navbar from './components/navbar.vue';
import router from './lib/router';

Vue.use(VueFormGenerator);

/* Register global Vue components */
Vue.component('layoutLeftSidebar', layoutLeftSidebar);
Vue.component('layoutNoSidebar', layoutNoSidebar);
Vue.component('navbar', navbar);

// eslint-disable-next-line no-new
new Vue({
  components: {
    App,
  },
  i18n,
  router,
  template: '<App />',
}).$mount('#app');
