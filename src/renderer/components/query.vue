<template lang="jade">
  div
    div query page {{ $t('common:LOADING_PAGE') }}
    div connection {{ connection.id }}
    a(href="#") back
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
