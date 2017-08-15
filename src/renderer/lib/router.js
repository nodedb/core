/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import login from '../components/login.vue';
import query from '../components/query.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/login',
  name: 'login',
  component: login,
}, {
  path: '/query',
  name: 'query',
  component: query,
}, {
  path: '*',
  redirect: {
    name: 'login',
  },
}];

export default new VueRouter({
  routes,
});
