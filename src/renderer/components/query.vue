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

    data () {
      return {
        connection: this.$route.meta.connection,
      };
    },

    methods: {
      fetchData () {
        this.connectionId = this.$route.meta.connection.id;
        this.connectionList = this.$route.meta.connectionList;
      },
    },

    watch: {
      $route: 'fetchData',
    },

  };
</script>
