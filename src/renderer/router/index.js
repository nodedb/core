/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import login from '../components/login.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/login',
  component: login,
}, {
  path: '*',
  redirect: '/login',
}];

export default new VueRouter({
  routes,
});
