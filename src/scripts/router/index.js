/**
 * index
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import landingPage from '../components/LandingPage.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/foo',
  component: landingPage,
}, {
  path: '*',
  redirect: '/foo',
}];

export default new VueRouter({
  routes,
});
