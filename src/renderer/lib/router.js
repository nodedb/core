/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import layoutFullWidth from '../components/layoutFullWidth.vue';
import login from '../components/login.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/fw',
  component: layoutFullWidth,
  children: [{
    path: '/login',
    name: 'login',
    component: login,
  }],
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
