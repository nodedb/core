/**
 * router
 */

/* Node modules */

/* Third-party modules */
import { remote } from 'electron';
import Vue from 'vue/dist/vue.min';
import VueRouter from 'vue-router';

/* Files */
import connections from '../components/connections.vue';
import error from '../components/error.vue';
import home from '../components/home.vue';
import layoutLeftSidebar from '../layouts/left-sidebar.vue';
import layoutNoSidebar from '../layouts/no-sidebar.vue';
import login from '../components/login.vue';
import query from '../components/query.vue';
import sidebar from '../components/sidebar.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [{
  path: '/no',
  component: layoutNoSidebar,
  children: [{
    path: 'error',
    meta: {
      err: null,
    },
    name: 'error',
    components: {
      body: error,
      connections,
    },
  }, {
    path: 'login',
    name: 'login',
    meta: {
      hideNew: true,
    },
    components: {
      body: login,
      connections,
    },
  }],
}, {
  path: '/left',
  component: layoutLeftSidebar,
  children: [{
    path: '/',
    name: 'home',
    meta: {

    },
    components: {
      body: home,
      connections,
      sidebar,
    },
  }, {
    path: '/query/:connectionId',
    name: 'query',
    meta: {
      requireLogin: true,
    },
    components: {
      body: query,
      connections,
      sidebar,
    },
  }],
}, {
  path: '*',
  redirect: {
    name: 'home',
  },
}];

const router = new VueRouter({
  routes,
});

/* Handle routing errors */
router.onError((err) => {
  remote.app.logger.trigger('error', 'Routing error', {
    err,
  });

  router.push({
    name: 'error',
  });
});

/* Check that we have appropriate permissions */
router.beforeEach((to, from, next) => {
  const connectionId = to.params.connectionId;

  return Promise.all([
    store.dispatch('getConnections', connectionId),
    store.dispatch('getConnection', {
      connectionId,
    }),
  ]).then(([connectionList, connection]) => {
    to.meta.connectionList = connectionList;
    to.meta.connection = connection;

    if (!connection && to.meta.requireLogin) {
      /* Connection required and not available - to login page */
      return next({
        name: 'login',
      });
    }

    return next();
  }).catch((err) => {
    console.log(err);
    return next(err);
  });
});

export default router;
