/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import login from '../pages/login.vue';
import query from '../pages/query.vue';
import settings from '../pages/settings.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/login',
  name: 'login',
  component: login,
}, {
  path: '/query/:id',
  name: 'query',
  component: query,
}, {
  path: '/settings',
  name: 'settings',
  component: settings,
}, {
  path: '*',
  redirect: {
    name: 'login',
  },
}];

const router = new VueRouter({
  routes,
});

export default router;
