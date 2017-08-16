<template lang="jade">
  div
    div(v-if="loading")
      img(
        src="assets/img/loading.svg",
        :alt="$t('common:LOADING_PAGE')"
      )
    div(v-else) query page {{ $t('common:LOADING_PAGE') }}
</template>

<script>
  /**
   * query
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */
  import router from '../lib/router';
  import store from '../store';

  export default {

    created () {
      return this.loadConnection();
    },

    data () {
      return {
        connection: null,
        loading: true,
      };
    },

    methods: {

      loadConnection () {
        return store.dispatch('getConnection', {
          connectionId: this.$route.params.connectionId,
        }).then((connection) => {
          if (!connection) {
            /* No connection available - back to login page */
            return router.push({
              name: 'login',
            });
          }

          this.connection = connection;
          this.loading = false;

          return connection;
        }).catch((err) => {
          console.log({
            err,
          });
        });
      },

    },

    watch: {
      $route: 'loadConnection',
    },

  };
</script>
