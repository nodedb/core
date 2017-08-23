<template lang="jade">
  div
    div i am the db list
    div connection {{ connection.id }}
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
