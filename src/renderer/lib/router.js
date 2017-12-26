/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import layoutFullWidth from '../layouts/fullWidth.vue';
import login from '../pages/login.vue';

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
