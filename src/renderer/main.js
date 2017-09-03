/**
 * main
 */

/* Node modules */

/* Third-party modules */
import vex from 'vex-js';
import vexDialog from 'vex-dialog/src/vex.dialog';
import Vue from 'vue/dist/vue.min';
import VueFormGenerator from 'vue-form-generator';
import VueShortKey from 'vue-shortkey';

/* Files */
import App from './components/app.vue';
import fieldButtonGroup from './components/fields/button-group.vue';
import i18n from './lib/i18n';
import router from './lib/router';
import treeItem from './components/tree-item.vue';

/* Register global Vue components */
Vue.component('fieldButtonGroup', fieldButtonGroup);
Vue.component('vueTreeItem', treeItem);

Vue.use(VueFormGenerator);
Vue.use(VueShortKey);

/* Configure Vex */
vex.registerPlugin(vexDialog);
vex.defaultOptions.className = 'vex-theme-os';

// eslint-disable-next-line no-new
new Vue({
  components: {
    App,
  },
  i18n,
  router,
  template: '<App />',
}).$mount('#app');
