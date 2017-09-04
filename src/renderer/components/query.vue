<template lang="jade">
  div.full_height
    .query_wrapper query

    .result_wrapper result
</template>

<script>
  /**
   * query
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
