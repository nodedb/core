/**
 * router
 */

/* Node modules */

/* Third-party modules */
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import dbList from '../components/dbList.vue';
import layoutLeftSidebar from '../layouts/left-sidebar.vue';
import layoutNoSidebar from '../layouts/no-sidebar.vue';
import login from '../components/login.vue';
import navbar from '../components/navbar.vue';
import query from '../components/query.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/no',
  component: layoutNoSidebar,
  children: [{
    path: 'login',
    name: 'login',
    components: {
      body: login,
      navbar,
    },
  }],
}, {
  path: '/left',
  component: layoutLeftSidebar,
  children: [{
    path: '/query/:connectionId',
    name: 'query',
    components: {
      body: query,
      navbar,
      sidebar: dbList,
    },
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

/* Check that we have appropriate permissions */
router.beforeEach((to, from, next) => next());

export default router;
