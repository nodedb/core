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
import store from '../store';

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
    meta: {
      requireLogin: true,
    },
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
router.beforeEach((to, from, next) => {
  /* Check if we need to be logged in */
  if (!to.meta.requireLogin) {
    /* Return Promise for consistent output */
    return Promise.resolve()
      .then(() => next());
  }

  return Promise.all([
    store.dispatch('getConnections'),
    store.dispatch('getConnection', {
      connectionId: to.params.connectionId,
    }),
  ]).then(([connections, connection]) => {
    /* Check if we have any connections */
    if (!connection) {
      /* No connection available - back to login page */
      return next({
        name: 'login',
      });
    }

    to.meta.connection = connection;
    to.meta.connections = connections;

    return next();
  }).catch((err) => {
    return next(err);
  });
});

export default router;
