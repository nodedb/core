<template lang="jade">
  div
    div(v-if="connection")
      div i am the sidebar
      div connection {{ connection.connectionId }}
      div sidebar {{ sidebar.length }}
    div(v-else)
</template>

<script>
  /**
   * sidebar
   */

  /* Node modules */

  /* Third-party modules */

  /* Files */

  export default {

    created () {
      return this.fetchData();
    },

    data: () => ({
      connection: null,
      sidebar: [],
    }),

    methods: {

      fetchData () {
        this.connection = this.$route.meta.connection;
      },

    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
